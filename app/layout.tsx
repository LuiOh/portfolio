// 루트 레이아웃: 한국어 lang, ThemeProvider 적용 및 사이트 메타데이터 설정

import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import ChatBot from "@/components/ui/ChatBot";
import { site } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <ParticlesBackground />
          {children}
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  );
}
