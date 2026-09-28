// LLM 챗봇 프록시 — OpenAI 호환 API의 SSE 스트림을 평문 텍스트로 중계하고 응답 반환

import { NextRequest, NextResponse } from "next/server";
import {
  profile,
  about,
  skills,
  certifications,
  experience,
  projects,
  chatbot,
} from "@/lib/content";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant" | "system"; content: string };

// 입력 검증 상한 (남용·과금 폭주 방지)
const MAX_MESSAGES = 10;
const MAX_CONTENT_CHARS = 2000;
const MAX_TOTAL_CHARS = 8000;
const UPSTREAM_TIMEOUT_MS = 60000;

function buildSystemPrompt(): string {
  const ctx = {
    profile,
    about,
    skills,
    certifications,
    experience,
    projects,
  };
  return [
    chatbot.persona,
    "\n\n[규칙]",
    ...chatbot.rules.map((r) => `- ${r}`),
    "\n\n[사이트 컨텍스트 — JSON]",
    JSON.stringify(ctx, null, 2),
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const NVIDIA_BASE = "https://integrate.api.nvidia.com/v1";
    // NIM은 모델을 주기적으로 EOL 처리하므로 교체 시 /v1/models 로 생존 여부부터 확인할 것
    const NVIDIA_MODEL = "meta/llama-3.2-11b-vision-instruct";
    const OPENAI_BASE = "https://api.openai.com/v1";
    const OPENAI_MODEL = "gpt-4.1-nano";

    const genericKey = process.env.LLM_API_KEY;
    const nvidiaKey = process.env.NVIDIA_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // 한 곳만 호출하면 그 공급자가 죽었을 때 챗봇 전체가 멈추므로 순서대로 재시도한다.
    type Provider = { name: string; apiKey: string; baseUrl: string; model: string };
    const providers: Provider[] = [];

    if (genericKey) {
      providers.push({
        name: "custom",
        apiKey: genericKey,
        baseUrl: process.env.LLM_BASE_URL ?? NVIDIA_BASE,
        model: process.env.LLM_MODEL ?? NVIDIA_MODEL,
      });
    }
    if (nvidiaKey) {
      providers.push({
        name: "nvidia",
        apiKey: nvidiaKey,
        baseUrl: NVIDIA_BASE,
        model: process.env.NVIDIA_MODEL ?? NVIDIA_MODEL,
      });
    }
    if (openaiKey) {
      providers.push({
        name: "openai",
        apiKey: openaiKey,
        baseUrl: OPENAI_BASE,
        model: process.env.OPENAI_MODEL ?? OPENAI_MODEL,
      });
    }

    if (providers.length === 0) {
      console.error("[chat] no provider configured — check env vars on the deploy target");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as { messages?: Msg[] };
    const rawMessages = body?.messages;
    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // 검증·정규화: role 화이트리스트 + 메시지별 길이 캡 + 최근 N개만
    const messages: Msg[] = rawMessages
      .filter(
        (m): m is Msg =>
          !!m &&
          typeof m.content === "string" &&
          (m.role === "user" || m.role === "assistant")
      )
      .slice(-MAX_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CONTENT_CHARS) }));

    if (messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const totalChars = messages.reduce((n, m) => n + m.content.length, 0);
    if (totalChars > MAX_TOTAL_CHARS) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const systemPrompt = buildSystemPrompt();
    const buildPayload = (model: string) => ({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.4,
      max_tokens: 700,
      stream: true,
    });

    let upstream: Response | null = null;
    const failures: string[] = [];

    for (const provider of providers) {
      try {
        const res = await fetch(`${provider.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.apiKey}`,
          },
          body: JSON.stringify(buildPayload(provider.model)),
          signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        });

        if (res.ok && res.body) {
          upstream = res;
          break;
        }

        // 업스트림 원문은 서버 로그에만 남기고 클라이언트에는 노출하지 않음
        const errText = await res.text().catch(() => "");
        failures.push(`${provider.name}(${provider.model}):${res.status}`);
        console.error(
          "[chat] upstream failed",
          provider.name,
          provider.model,
          res.status,
          errText.slice(0, 300)
        );
      } catch (err) {
        failures.push(`${provider.name}:exception`);
        console.error("[chat] upstream exception", provider.name, err);
      }
    }

    if (!upstream?.body) {
      console.error("[chat] all providers failed —", failures.join(" | "));
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }

    // OpenAI 호환 SSE(delta) → 평문 텍스트 청크로 중계
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = upstream.body.getReader();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let buffer = "";
        let produced = false;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (data === "[DONE]") continue;
              try {
                const json = JSON.parse(data);
                const choice = json?.choices?.[0];
                const delta: unknown = choice?.delta?.content;
                if (typeof delta === "string" && delta.length > 0) {
                  produced = true;
                  controller.enqueue(encoder.encode(delta));
                }
                // 길이 제한으로 잘린 경우 말줄임 표시
                if (choice?.finish_reason === "length") {
                  controller.enqueue(encoder.encode(" …"));
                }
              } catch {
                continue;
              }
            }
          }
          if (!produced) {
            controller.enqueue(encoder.encode(chatbot.fallback));
          }
        } catch (err) {
          console.error("[chat] stream error", err);
          if (!produced) controller.enqueue(encoder.encode(chatbot.fallback));
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
      cancel() {
        reader.cancel().catch(() => {});
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[chat] handler error", message);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
