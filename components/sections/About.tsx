"use client";

// 개발 철학 본문, 핵심 역량 카드, 그리고 보유 자격증 칩 리스트를 포함한 자기소개 섹션
import {
  Rocket,
  Users,
  Zap,
  Code,
  Shield,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { about, certifications } from "@/lib/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import Reveal from "@/components/ui/Reveal";
import Stagger, { staggerItem } from "@/components/ui/Stagger";
import type { AboutHighlight } from "@/types/content";

const ICONS: Record<AboutHighlight["icon"], LucideIcon> = {
  rocket: Rocket,
  users: Users,
  zap: Zap,
  code: Code,
  shield: Shield,
  sparkles: Sparkles,
};

export function About() {
  return (
    <section id="about" className="border-b border-border py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionTitle
            eyebrow="About"
            title="제가 일하는 방식"
            description="기술과 사람 사이의 균형을 가장 중요하게 생각합니다. 다음 세 가지 가치를 중심으로 일합니다."
          />
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <Reveal delay={0.1} className="space-y-4 text-base leading-7 text-muted-foreground">
            {about.philosophy.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </Reveal>

          <Stagger
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            staggerChildren={0.08}
            delayChildren={0.15}
          >
            {about.highlights.map((highlight) => {
              const Icon = ICONS[highlight.icon] ?? Sparkles;
              return (
                <motion.div key={highlight.title} variants={staggerItem}>
                  <Card className="flex h-full flex-col gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted text-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">
                      {highlight.title}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {highlight.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </Stagger>
        </div>

        {certifications.length > 0 ? (
          <Reveal delay={0.1} className="mt-12 border-t border-border pt-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              보유 자격증
            </p>
            <ul className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <li key={cert.name}>
                  <Tag>{cert.name}</Tag>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
