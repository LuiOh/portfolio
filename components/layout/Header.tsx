"use client";

// 사이트 상단 sticky 네비게이션과 모바일 햄버거 메뉴를 담당하는 컴포넌트

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { site, profile } from "@/lib/content";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const close = () => setOpen(false);

  return (
    <motion.header
      initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container-page flex h-16 items-center justify-between">
        <a
          href="/"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          {profile.name}
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-page flex flex-col py-2">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                className="rounded-md px-2 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </motion.header>
  );
}
