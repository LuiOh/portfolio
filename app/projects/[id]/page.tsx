// 프로젝트 상세 페이지 (정적 생성, 풀스크린 은하수 배경 위에 반투명 카드 레이아웃)

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { projects } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tag } from "@/components/ui/Tag";
import Reveal from "@/components/ui/Reveal";

interface PageParams {
  id: string;
}

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return {};
  return {
    title: `${project.title} | 포트폴리오`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const typeLabel = project.type === "personal" ? "PERSONAL" : "WORK";

  return (
    <>
      <Header />
      <main className="py-12 sm:py-16">
        <article className="mx-auto w-full max-w-[880px] px-5 sm:px-6 lg:px-8">
          {/* 상단 뒤로가기 */}
          <Reveal>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              뒤로가기
            </Link>
          </Reveal>

          {/* 타이틀 카드 */}
          <Reveal delay={0.05}>
            <header className="mt-6 rounded-xl border border-zinc-200 bg-white/60 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/60 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-violet-500/40 bg-gradient-to-r from-violet-500/15 to-indigo-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-300">
                  {typeLabel}
                </span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {project.period}
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="mt-2 text-base text-muted-foreground sm:text-lg">
                  {project.subtitle}
                </p>
              )}

              {/* 외부 링크 액션 */}
              {(project.links.github ?? project.links.demo) && (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub 저장소 열기"
                      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <FaGithub className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="데모 사이트 열기"
                      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <ExternalLink className="h-4 w-4" />
                      데모
                    </a>
                  )}
                </div>
              )}
            </header>
          </Reveal>

          {/* 커버 이미지 (있으면) */}
          {project.cover && (
            <Reveal delay={0.08}>
              <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.cover}
                  alt=""
                  className="h-auto w-full object-cover"
                />
              </div>
            </Reveal>
          )}

          {/* TECH STACK */}
          {project.tech.length > 0 && (
            <Reveal delay={0.1}>
              <section className="mt-6 rounded-xl border border-zinc-200 bg-white/50 p-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50 sm:p-8">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Tech Stack
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <li key={tech}>
                      <Tag>{tech}</Tag>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          )}

          {/* OVERVIEW */}
          {project.overview && (
            <Reveal delay={0.12}>
              <section className="mt-6 rounded-xl border border-zinc-200 bg-white/50 p-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50 sm:p-8">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Overview
                </h2>
                <p className="mt-3 text-base leading-7 text-foreground">
                  {project.overview}
                </p>
              </section>
            </Reveal>
          )}

          {/* HIGHLIGHTS */}
          {project.highlights && project.highlights.length > 0 && (
            <Reveal delay={0.14}>
              <section className="mt-6 rounded-xl border border-zinc-200 bg-white/50 p-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50 sm:p-8">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  주요 작업
                </h2>
                <ul className="mt-4 space-y-3">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 shadow-[0_0_6px_rgba(139,92,246,0.5)]"
                      />
                      <span className="text-sm leading-6 text-foreground sm:text-base">
                        {h}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          )}

          {/* CONTENT (자유 섹션) */}
          {project.content && project.content.length > 0 && (
            <div className="mt-6 space-y-6">
              {project.content.map((block, i) => (
                <Reveal key={i} delay={0.16 + i * 0.04}>
                  <section className="rounded-xl border border-zinc-200 bg-white/50 p-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50 sm:p-8">
                    <h2 className="text-base font-semibold text-foreground sm:text-lg">
                      {block.heading}
                    </h2>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
                      {block.body}
                    </p>
                  </section>
                </Reveal>
              ))}
            </div>
          )}

          {/* GALLERY */}
          {project.gallery && project.gallery.length > 0 && (
            <Reveal delay={0.2}>
              <section className="mt-6 rounded-xl border border-zinc-200 bg-white/50 p-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50 sm:p-8">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Gallery
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {project.gallery.map((src, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>
          )}

          {/* 하단 CTA */}
          <Reveal delay={0.22}>
            <div className="mt-10 flex justify-center">
              <Link
                href="/#projects"
                className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/40 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 px-4 py-2 text-sm font-medium text-violet-700 transition-colors hover:from-violet-500/20 hover:to-indigo-500/20 dark:text-violet-300"
              >
                <ArrowLeft className="h-4 w-4" />
                모든 프로젝트 보기
              </Link>
            </div>
          </Reveal>
        </article>
      </main>
      <Footer />
    </>
  );
}
