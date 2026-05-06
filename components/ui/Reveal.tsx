"use client";

// 스크롤 진입 시 fade-up 애니메이션을 적용하는 재사용 래퍼 컴포넌트
import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "footer";
};

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.6,
  className,
  as = "div",
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const Comp = motion[as] as ElementType;

  if (prefersReducedMotion) {
    return <Comp className={className}>{children}</Comp>;
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
