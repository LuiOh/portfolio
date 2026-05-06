// 프로필의 외부 링크를 아이콘 버튼으로 표시하는 컴포넌트

import { Mail, Globe } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import type { ComponentType } from "react";
import type { SocialLink } from "@/types/content";

const ICONS: Record<SocialLink["icon"], ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  mail: Mail,
  globe: Globe,
  twitter: FaXTwitter,
};

interface SocialLinksProps {
  links: SocialLink[];
}

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <ul className="flex flex-wrap items-center gap-3">
      {links.map((link) => {
        const Icon = ICONS[link.icon];
        return (
          <li key={link.href}>
            <a
              href={link.href}
              aria-label={link.label}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
            >
              <Icon className="h-4 w-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
