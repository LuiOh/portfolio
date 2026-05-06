// 사이트 전반에서 재사용하는 기본 카드 컨테이너 컴포넌트

import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/40 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
