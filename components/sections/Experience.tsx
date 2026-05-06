"use client";

// 경력을 좌측 도트와 선이 있는 타임라인 형태로 보여주는 섹션 (모바일은 단순 스택)
import { motion } from "framer-motion";
import { experience } from "@/lib/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import Reveal from "@/components/ui/Reveal";
import Stagger, { staggerItem } from "@/components/ui/Stagger";

export function Experience() {
  return (
    <section id="experience" className="border-b border-border py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionTitle
            eyebrow="Experience"
            title="지금까지의 여정"
            description="각 단계마다 가장 임팩트가 컸던 일과 배움을 짧게 정리했습니다."
          />
        </Reveal>

        <Stagger
          className="relative space-y-10 sm:space-y-0 sm:border-l sm:border-border sm:pl-8"
          staggerChildren={0.1}
        >
          {experience.map((item, idx) => (
            <motion.div
              key={`${item.company}-${idx}`}
              variants={staggerItem}
              className="relative sm:pb-10 sm:last:pb-0"
            >
              <span className="absolute -left-[37px] top-2 hidden h-3 w-3 rounded-full border-2 border-background bg-foreground sm:block" />
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.role}{" "}
                    <span className="text-muted-foreground">@ {item.company}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.period}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                  {item.achievements.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
