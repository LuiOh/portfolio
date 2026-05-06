"use client";

// 사이트 전체에 깔리는 풀스크린 고정 Particles + nebula 글로우 배경 (은하수 분위기)
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import Particles from "./Particles";

// 다크 모드: 별 분광 톤 팔레트
const DARK_STAR_COLORS = [
  "#ffffff", // 백색 (G형)
  "#ffffff", // 가중치 (대부분 흰~연황)
  "#fff4e0", // 옅은 노랑 (F~G형)
  "#fff4e0",
  "#fde68a", // 따뜻한 별 (K형)
  "#cfe9ff", // 푸른 백색 (A형)
  "#a5b4fc", // 인디고
  "#c4b5fd", // 보라 (nebula 반영)
  "#fbcfe8", // 연핑크 (nebula 반영)
];

// 라이트 모드: 어두운 톤 팔레트 (배경에서 보이도록)
const LIGHT_STAR_COLORS = [
  "#1e293b",
  "#334155",
  "#475569",
  "#6366f1",
  "#8b5cf6",
];

export default function ParticlesBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // SSR mismatch 방지 — mounted 가드
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const particleColors = useMemo(
    () => (isDark ? DARK_STAR_COLORS : LIGHT_STAR_COLORS),
    [isDark]
  );

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* nebula 글로우 레이어 — 다크에서는 진하게, 라이트에서는 톤다운 */}
      <div className="absolute inset-0">
        <div className="absolute left-[10%] top-[20%] h-[60vh] w-[60vh] rounded-full bg-violet-500/5 blur-[120px] dark:bg-violet-500/15" />
        <div className="absolute right-[5%] top-[40%] h-[50vh] w-[50vh] rounded-full bg-blue-500/5 blur-[140px] dark:bg-blue-500/12" />
        <div className="absolute left-[40%] bottom-[5%] h-[55vh] w-[55vh] rounded-full bg-fuchsia-500/5 blur-[120px] dark:bg-fuchsia-500/10" />
      </div>

      {/* particles canvas — 갤럭시 디스크 별 분포 */}
      <Particles
        particleCount={800}
        particleSpread={10}
        speed={0.06}
        particleBaseSize={90}
        sizeRandomness={2}
        alphaParticles
        moveOnHover={false}
        particleColors={particleColors}
        className="absolute inset-0 w-full h-full"
      />

      {/* 은하수 띠 — 대각선 글로우 (다크에서만 또렷하게) */}
      <div
        className="absolute inset-x-[-20%] top-1/2 h-[30vh] -translate-y-1/2 -rotate-12 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_60%)] blur-3xl dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_60%)]"
      />
    </div>
  );
}
