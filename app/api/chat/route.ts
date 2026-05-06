// OpenAI 챗봇 프록시 — 클라이언트 메시지를 받아 모델에 전달하고 응답을 반환

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
    const apiKey = process.env.OPENAI_API_KEY;
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
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...messages.slice(-10),
      ],
      temperature: 0.4,
      max_tokens: 400,
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
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
