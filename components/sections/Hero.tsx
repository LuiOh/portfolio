"use client";

// 페이지 최상단에서 거대 타이포 + 푸른 글로우 백드롭으로 임팩트를 주는 중앙 정렬 히어로 섹션
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { profile } from "@/lib/content";
import { SocialLinks } from "./SocialLinks";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  // reduced motion 환경에서는 진입 애니메이션 없이 즉시 표시
  const fadeUp = (delay: number, y = 30, duration = 0.7) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration, delay, ease },
        };

  return (
    <section
      id="top"
      className="relative flex min-h-[85vh] items-center justify-center overflow-hidden border-b border-border"
    >
      {/* 푸른 글로우 백드롭 */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        aria-hidden
      >
        <motion.div
          className="h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/30"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>

      <div className="container-page flex flex-col items-center py-20 text-center sm:py-28 lg:py-32">
        <motion.p
          className="text-sm font-medium uppercase tracking-widest text-muted-foreground"
          {...fadeUp(0, 20, 0.6)}
        >
          포트폴리오
        </motion.p>

        <motion.h1
          className="mt-6 text-6xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl"
          {...fadeUp(0.1)}
        >
          {profile.name}
        </motion.h1>

        <motion.p
          className="mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          {...fadeUp(0.25)}
        >
          {profile.headline}
        </motion.p>
        <motion.p
          className="mt-4 max-w-2xl text-base text-muted-foreground"
          {...fadeUp(0.4)}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          {...fadeUp(0.55)}
        >
          <a
            href={profile.ctaPrimary.href}
            className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-6 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            {profile.ctaPrimary.label}
          </a>
          <a
            href={profile.ctaSecondary.href}
            className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {profile.ctaSecondary.label}
          </a>
        </motion.div>

        <motion.div
          className="mt-10 flex justify-center"
          {...fadeUp(0.7)}
        >
          <SocialLinks links={profile.social} />
        </motion.div>
      </div>

      {/* 스크롤 다운 인디케이터 */}
      <motion.a
        href="#about"
        aria-label="아래 섹션으로 스크롤"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9, ease }}
      >
        <motion.span
          className="block"
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, 8, 0] }
          }
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.span>
      </motion.a>
    </section>
  );
}
