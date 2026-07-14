// LLM 챗봇 프록시 — OpenAI 호환 API(기본값: NVIDIA NIM 무료 엔드포인트)로 메시지를 전달하고 응답 반환

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
    const NVIDIA_MODEL = "meta/llama-3.3-70b-instruct";
    const OPENAI_BASE = "https://api.openai.com/v1";
    const OPENAI_MODEL = "gpt-4.1-nano";

    const genericKey = process.env.LLM_API_KEY;
    const nvidiaKey = process.env.NVIDIA_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let apiKey: string | undefined;
    let baseUrl: string;
    let model: string;

    if (genericKey ?? nvidiaKey) {
      apiKey = genericKey ?? nvidiaKey;
      baseUrl = process.env.LLM_BASE_URL ?? NVIDIA_BASE;
      model = process.env.LLM_MODEL ?? NVIDIA_MODEL;
    } else {
      apiKey = openaiKey;
      baseUrl = process.env.LLM_BASE_URL ?? OPENAI_BASE;
      model = process.env.LLM_MODEL ?? OPENAI_MODEL;
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as { messages?: Msg[] };
    const messages = body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const payload = {
      model,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...messages.slice(-10),
      ],
      temperature: 0.4,
      max_tokens: 512,
    };

    const r = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const errText = await r.text();
      return NextResponse.json(
        { error: "Upstream error", detail: errText },
        { status: 502 }
      );
    }

    const data = await r.json();
    const reply: string =
      data?.choices?.[0]?.message?.content ?? chatbot.fallback;
    return NextResponse.json({ reply });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
