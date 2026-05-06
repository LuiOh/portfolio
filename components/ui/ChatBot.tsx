"use client";

// 풀스크린 은하수 배경에 어울리는 우주 테마 floating AI 어시스턴트 위젯

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";
import { chatbot } from "@/lib/content";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const PANEL_TITLE = chatbot.title ?? "AI 어시스턴트";
const PANEL_SUBTITLE = chatbot.subtitle ?? "은하수 너머에서 답해드려요";

// 패널 배경에 깔리는 별 패턴 (CSS radial-gradient 다중 합성)
const STAR_FIELD_STYLE: React.CSSProperties = {
  backgroundImage: [
    "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.45), transparent 50%)",
    "radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.35), transparent 50%)",
    "radial-gradient(1px 1px at 40% 80%, rgba(196,181,253,0.4), transparent 50%)",
    "radial-gradient(1px 1px at 85% 25%, rgba(165,180,252,0.35), transparent 50%)",
    "radial-gradient(1px 1px at 10% 70%, rgba(255,255,255,0.3), transparent 50%)",
    "radial-gradient(1.5px 1.5px at 55% 15%, rgba(216,180,254,0.3), transparent 50%)",
    "radial-gradient(1px 1px at 30% 50%, rgba(255,255,255,0.25), transparent 50%)",
  ].join(","),
  backgroundSize: "100% 100%",
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // 패널 열릴 때 입력창 자동 포커스
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  // 메시지 추가 / 로딩 변화 시 자동 스크롤
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading, open]);

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!r.ok) {
        throw new Error(`HTTP ${r.status}`);
      }
      const data = (await r.json()) as { reply?: string };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? chatbot.fallback },
      ]);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "오류가 발생했어요. 잠시 후 다시 시도해 주세요.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // float 애니메이션 (reduced motion 시 정지)
  const floatAnimation = prefersReducedMotion
    ? undefined
    : {
        y: [0, -4, 0],
      };

  return (
    <>
      {/* 닫힘 상태: floating 버튼 */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="chatbot-fab"
            type="button"
            aria-label="AI 어시스턴트 열기"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: 1,
              ...(floatAnimation ?? {}),
            }}
            exit={{ opacity: 0, scale: 0.85 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { type: "spring", stiffness: 280, damping: 22 },
              y: prefersReducedMotion
                ? undefined
                : { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            className="group fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 text-white ring-2 ring-violet-400/50 shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(139,92,246,0.6)]"
          >
            <Sparkles className="h-7 w-7 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />

            {/* 온라인 박동 점 */}
            <motion.span
              aria-hidden
              className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-violet-950/60 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }
              }
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* hover 툴팁 */}
            <span
              role="tooltip"
              className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg border border-violet-400/30 bg-violet-950/90 px-3 py-1.5 text-xs font-medium text-violet-100 opacity-0 shadow-lg shadow-violet-500/20 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100"
            >
              AI 어시스턴트에게 물어보세요
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 열림 상태: 패널 */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbot-panel"
            role="dialog"
            aria-label="AI 어시스턴트 챗봇"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed inset-x-3 bottom-3 z-50 flex h-[580px] max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-zinc-900/95 via-violet-950/90 to-indigo-950/95 shadow-[0_0_60px_rgba(139,92,246,0.25)] backdrop-blur-2xl sm:bottom-6 sm:right-6 sm:left-auto sm:w-[380px]"
          >
            {/* 별 패턴 오버레이 */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={STAR_FIELD_STYLE}
            />

            {/* 콘텐츠 (z-index로 별 위에) */}
            <div className="relative z-10 flex h-full flex-col">
              {/* 헤더 */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(139,92,246,0.5)] ring-1 ring-violet-300/40">
                    <Sparkles className="h-5 w-5 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-50">
                      {PANEL_TITLE}
                    </span>
                    <span className="text-[11px] text-violet-300/80">
                      {PANEL_SUBTITLE}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="챗봇 닫기"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1.5 text-violet-200/70 transition-colors hover:bg-violet-500/20 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* 그라디언트 디바이더 */}
              <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

              {/* 메시지 영역 */}
              <div
                ref={listRef}
                className="flex-1 space-y-3 overflow-y-auto px-5 py-5"
              >
                {/* 빈 상태 */}
                {messages.length === 0 && !loading && (
                  <EmptyState
                    intro={chatbot.intro}
                    suggestions={chatbot.suggestions}
                    onPick={(s) => sendMessage(s)}
                  />
                )}

                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {m.role === "user" ? (
                      <UserBubble content={m.content} />
                    ) : (
                      <AssistantBubble content={m.content} />
                    )}
                  </motion.div>
                ))}

                {loading && <TypingIndicator />}
              </div>

              {/* 오류 표시 */}
              {error && (
                <div className="mx-5 mb-2 flex items-center justify-between gap-2 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200 backdrop-blur-md">
                  <span className="truncate">⚠ {error}</span>
                  <button
                    type="button"
                    aria-label="오류 닫기"
                    onClick={() => setError(null)}
                    className="rounded p-1 hover:bg-rose-500/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* 입력 영역 디바이더 */}
              <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

              {/* 입력 영역 */}
              <div className="px-4 py-3">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="메시지를 입력하세요…"
                    className="max-h-32 flex-1 resize-none rounded-xl border border-violet-500/30 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-violet-300/50 backdrop-blur-md transition-colors focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                  />
                  <motion.button
                    type="button"
                    aria-label="전송"
                    disabled={!input.trim() || loading}
                    onClick={() => sendMessage(input)}
                    whileHover={
                      !input.trim() || loading ? undefined : { scale: 1.05 }
                    }
                    whileTap={
                      !input.trim() || loading ? undefined : { scale: 0.95 }
                    }
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] ring-1 ring-violet-300/30 transition-shadow hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                  >
                    <Send className="h-4 w-4" />
                  </motion.button>
                </div>
                <p className="mt-1.5 text-[10px] text-violet-300/50">
                  Enter 전송 · Shift+Enter 줄바꿈
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] whitespace-pre-wrap rounded-[18px] rounded-br-md border border-indigo-400/30 bg-gradient-to-br from-indigo-500 to-violet-600 px-3.5 py-2 text-sm text-white shadow-lg shadow-indigo-500/20">
        {content}
      </div>
    </div>
  );
}

function AssistantBubble({ content }: { content: string }) {
  return (
    <div className="flex items-end justify-start gap-2">
      <div
        aria-hidden
        className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 ring-1 ring-violet-300/40 shadow-[0_0_10px_rgba(139,92,246,0.4)]"
      >
        <Sparkles className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="max-w-[80%] whitespace-pre-wrap rounded-[18px] rounded-bl-md border border-violet-500/20 bg-white/5 px-3.5 py-2 text-sm text-zinc-100 backdrop-blur-md">
        {content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end justify-start gap-2">
      <div
        aria-hidden
        className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 ring-1 ring-violet-300/40 shadow-[0_0_10px_rgba(139,92,246,0.4)]"
      >
        <Sparkles className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex items-center gap-1.5 rounded-[18px] rounded-bl-md border border-violet-500/20 bg-white/5 px-3.5 py-2.5 backdrop-blur-md">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1 w-1 rounded-full bg-violet-300 shadow-[0_0_4px_rgba(196,181,253,0.8)]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  intro,
  suggestions,
  onPick,
}: {
  intro: string;
  suggestions: string[];
  onPick: (s: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 shadow-[0_0_30px_rgba(139,92,246,0.5)] ring-1 ring-violet-300/40"
      >
        <Sparkles className="h-7 w-7 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
      </motion.div>

      <p className="px-2 text-sm leading-6 text-zinc-100">{intro}</p>

      <div className="w-full">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-violet-300/80">
          ✨ 이런 걸 물어보세요
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s, i) => (
            <motion.button
              key={s}
              type="button"
              onClick={() => onPick(s)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200 transition-colors hover:border-violet-400/60 hover:bg-violet-500/20 hover:text-violet-100"
            >
              {s}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
