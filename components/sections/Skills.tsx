"use client";

// 카테고리별로 그룹화한 기술 스택을 카테고리 컬러 톤으로 구분된 태그로 표시하는 섹션
import { motion } from "framer-motion";
import { skills } from "@/lib/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import Reveal from "@/components/ui/Reveal";
import Stagger, { staggerItem } from "@/components/ui/Stagger";

// 카테고리명에 키워드가 포함되어 있는지 확인하는 헬퍼
function getCategoryToneClasses(category: string): string {
  const lower = category.toLowerCase();

  // 프론트엔드 — blue
  if (category.includes("프론트") || lower.includes("front")) {
    return "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300";
  }
  // 백엔드 — emerald
  if (category.includes("백엔드") || lower.includes("back")) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }
  // 인프라 / DevOps — violet
  if (
    category.includes("인프라") ||
    lower.includes("infra") ||
    lower.includes("devops")
  ) {
    return "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300";
  }
  // 도구 / 협업 — amber
  if (
    category.includes("도구") ||
    category.includes("협업") ||
    lower.includes("tool")
  ) {
    return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }
  // 기본 — zinc
  return "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200";
}

export function Skills() {
  return (
    <section id="skills" className="border-b border-border py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionTitle
            eyebrow="Skills"
            title="다루는 기술 스택"
            description="새로운 도구를 빠르게 익히는 편이지만, 대표적으로 자주 쓰는 스택은 다음과 같습니다."
          />
        </Reveal>

        <Stagger
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2"
          staggerChildren={0.08}
        >
          {skills.map((category) => {
            const toneClasses = getCategoryToneClasses(category.category);
            return (
              <motion.div
                key={category.category}
                variants={staggerItem}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h3 className="mb-4 text-base font-semibold text-foreground">
                  {category.category}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <li key={item}>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${toneClasses}`}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
