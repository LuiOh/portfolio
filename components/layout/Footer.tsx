"use client";

// 사이트 하단 카피라이트와 보조 정보를 표시하는 푸터
import { site, profile } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";

export function Footer() {
  return (
    <Reveal as="footer" className="border-t border-border py-10">
      <div className="container-page flex flex-col items-start justify-between gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <p>{site.copyright}</p>
        <p>
          문의:{" "}
          <a
            href={`mailto:${profile.email}`}
            className="text-foreground transition-colors hover:underline"
          >
            {profile.email}
          </a>
        </p>
      </div>
    </Reveal>
  );
}
