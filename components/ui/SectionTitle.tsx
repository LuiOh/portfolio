// 각 섹션의 상단에 표시되는 라벨/제목/설명 묶음 컴포넌트

import type { ReactNode } from "react";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionTitleProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-10 ${alignClass}`}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
