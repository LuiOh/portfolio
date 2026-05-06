// 존재하지 않는 프로젝트 ID로 접근했을 때 표시되는 404 화면

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ProjectNotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center py-16">
        <div className="mx-auto max-w-md px-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400">
            404
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            프로젝트를 찾을 수 없어요
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            URL이 잘못되었거나, 더 이상 공개되지 않는 프로젝트일 수 있어요.
          </p>
          <Link
            href="/#projects"
            className="mt-6 inline-flex items-center rounded-md border border-violet-500/40 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 px-4 py-2 text-sm font-medium text-violet-700 transition-colors hover:from-violet-500/20 hover:to-indigo-500/20 dark:text-violet-300"
          >
            모든 프로젝트 보기
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
