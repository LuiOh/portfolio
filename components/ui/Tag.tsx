// 기술 스택이나 카테고리 라벨을 표시하는 작은 태그 컴포넌트

import type { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
}

export function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
      {children}
    </span>
  );
}
