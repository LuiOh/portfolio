// 모든 JSON 콘텐츠를 타입 안전한 객체로 변환해 한 곳에서 export 하는 헬퍼

import siteData from "@/data/site.json";
import profileData from "@/data/profile.json";
import aboutData from "@/data/about.json";
import skillsData from "@/data/skills.json";
import certificationsData from "@/data/certifications.json";
import experienceData from "@/data/experience.json";
import projectsData from "@/data/projects.json";
import chatbotData from "@/data/chatbot.json";

import type {
  SiteContent,
  ProfileContent,
  AboutContent,
  SkillsContent,
  CertificationsContent,
  ExperienceContent,
  ProjectsContent,
  ChatbotConfig,
} from "@/types/content";

export const site = siteData as SiteContent;
export const profile = profileData as ProfileContent;
export const about = aboutData as AboutContent;
export const skills = skillsData as SkillsContent;
export const certifications = certificationsData as CertificationsContent;
export const experience = experienceData as ExperienceContent;
export const projects = projectsData as ProjectsContent;
export const chatbot = chatbotData as ChatbotConfig;
