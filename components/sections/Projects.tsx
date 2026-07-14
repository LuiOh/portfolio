"use client";

// 단색 톤다운된 카드와 전체/개인/업무 필터를 제공하는 프로젝트 섹션 (클라이언트 컴포넌트)
import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { motion } from "framer-motion";
import { projects } from "@/lib/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Tag } from "@/components/ui/Tag";
import Reveal from "@/components/ui/Reveal";
import Stagger, { staggerItem } from "@/components/ui/Stagger";
import type { ProjectType } from "@/types/content";

type Filter = "all" | ProjectType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "personal", label: "개인" },
  { value: "work", label: "업무" },
];

export function Projects() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((project) => project.type === filter);
  }, [filter]);

  return (
    <section id="projects" className="py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionTitle
            eyebrow="Projects"
            title="만들어 온 것들"
            description="개인 프로젝트와 업무 프로젝트를 함께 모았습니다. 카테고리로 필터링해서 볼 수 있습니다."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="프로젝트 필터"
            className="mb-8 inline-flex items-center gap-1 rounded-md border border-border bg-card p-1"
          >
            {FILTERS.map((option) => {
              const active = filter === option.value;
              return (
                <button
                  key={option.value}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(option.value)}
                  className={`inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            표시할 프로젝트가 없습니다.
          </p>
        ) : (
          <Stagger
            key={filter}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            staggerChildren={0.06}
          >
            {filtered.map((project) => {
              const initial = project.title.trim().charAt(0);
              return (
                <motion.div
                  key={project.id}
                  variants={staggerItem}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <article
                    className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors hover:border-violet-400 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/40 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-violet-500"
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      aria-label={`${project.title} 상세 보기`}
                      className="absolute inset-0 z-10 focus:outline-none"
                    />
                    <div
                      className="relative h-40 w-full bg-zinc-100 dark:bg-zinc-900"
                      aria-hidden
                    >
                      {project.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.thumbnail}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <span
                          className="absolute inset-0 flex items-center justify-center text-7xl font-bold text-zinc-400 opacity-20 dark:text-zinc-500"
                          aria-hidden
                        >
                          {initial}
                        </span>
                      )}
                      <span className="absolute right-3 top-3 rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
                        {project.type === "personal" ? "개인" : "업무"}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {project.period}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-foreground transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
                        {project.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                        {project.description}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <li key={tech}>
                            <Tag>{tech}</Tag>
                          </li>
                        ))}
                      </ul>
                      {(project.links.github ?? project.links.demo) ? (
                        <div className="relative z-20 mt-4 flex items-center gap-2">
                          {project.links.github ? (
                            <a
                              href={project.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="GitHub 저장소 열기"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-foreground transition-colors hover:bg-muted"
                            >
                              <FaGithub className="h-4 w-4" />
                              GitHub
                            </a>
                          ) : null}
                          {project.links.demo ? (
                            <a
                              href={project.links.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="데모 사이트 열기"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-foreground transition-colors hover:bg-muted"
                            >
                              <ExternalLink className="h-4 w-4" />
                              데모
                            </a>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </article>
                </motion.div>
              );
            })}
          </Stagger>
        )}
      </div>
    </section>
  );
}
