// 보유 자격증 목록을 카드 그리드로 보여주는 섹션

import { ExternalLink } from "lucide-react";
import { certifications } from "@/lib/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";

export function Certifications() {
  return (
    <section
      id="certifications"
      className="border-b border-border py-20 sm:py-24"
    >
      <div className="container-page">
        <SectionTitle
          eyebrow="Certifications"
          title="자격증과 수료"
          description="학습한 내용을 객관적으로 검증받기 위해 정기적으로 자격증을 취득하고 있습니다."
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {certifications.map((cert) => (
            <li key={`${cert.name}-${cert.date}`}>
              <Card className="flex h-full items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {cert.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {cert.issuer} · {cert.date}
                  </p>
                </div>
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${cert.name} 인증 정보 보기`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
