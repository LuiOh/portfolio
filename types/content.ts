// 사이트 전반에서 사용하는 JSON 콘텐츠의 TypeScript 타입 정의

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteContent {
  title: string;
  description: string;
  copyright: string;
  nav: NavItem[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail" | "globe" | "twitter";
}

export interface ProfileContent {
  name: string;
  headline: string;
  tagline: string;
  email: string;
  resumeUrl: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  social: SocialLink[];
}

export interface AboutHighlight {
  icon: "rocket" | "users" | "zap" | "code" | "shield" | "sparkles";
  title: string;
  description: string;
}

export interface AboutContent {
  philosophy: string[];
  highlights: AboutHighlight[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export type SkillsContent = SkillCategory[];

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export type CertificationsContent = Certification[];

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
}

export type ExperienceContent = ExperienceItem[];

export type ProjectType = "personal" | "work";

export interface ProjectLinks {
  github?: string;
  demo?: string;
}

export interface ProjectContentBlock {
  heading: string;
  body: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  type: ProjectType;
  period: string;
  description: string;
  overview?: string;
  highlights?: string[];
  content?: ProjectContentBlock[];
  tech: string[];
  links: ProjectLinks;
  thumbnail?: string;
  gallery?: string[];
  cover?: string;
}

export type ProjectsContent = ProjectItem[];

export interface ChatbotConfig {
  intro: string;
  suggestions: string[];
  persona: string;
  rules: string[];
  fallback: string;
  title?: string;
  subtitle?: string;
}
