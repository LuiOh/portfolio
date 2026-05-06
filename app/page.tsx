// 모든 섹션을 순서대로 조립하는 단일 페이지 홈 컴포넌트

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
// import { Certifications } from "@/components/sections/Certifications"; // About 섹션에 통합되어 비활성화
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
      </main>
      <Footer />
    </>
  );
}
