# 포트폴리오 컨텍스트 노트

## 프로젝트 개요
- 목적: profile.nuclearbomb6518.com 레이아웃/UX 참고, 콘텐츠는 JSON 외부화한 한국어 더미 포트폴리오
- 스택: Next.js 15 App Router + TypeScript + Tailwind CSS + next-themes + lucide-react
- 빌드: 정적 export(`output: 'export'`)로 어디든 배포 가능

## 핵심 결정사항
1. **콘텐츠 외부화**: 모든 텍스트를 `data/*.json`에 두고, 컴포넌트는 `lib/content.ts`를 통해서만 접근. 컴포넌트에 하드코딩 텍스트 없음(빈 상태 메시지 정도 제외, 그것도 최소화).
2. **테마**: next-themes의 `attribute="class"`, `defaultTheme="system"`, `disableTransitionOnChange`. ThemeToggle은 마운트 전 placeholder 렌더로 hydration mismatch 방지.
3. **라우팅/네비**: 단일 페이지(앵커 스크롤). Header가 sticky로 고정. 모바일은 햄버거 → 드롭다운 메뉴.
4. **프로젝트 필터**: Projects 섹션만 'use client'. useState로 전체/개인/업무 필터.
5. **이미지**: 정적 export라 next/image 최적화 불가. `images.unoptimized: true`. 프로젝트 썸네일은 그라디언트 placeholder로 처리(이미지 없을 때).
6. **폰트**: Pretendard CDN 임포트 + 시스템 폰트 폴백. globals.css에서 `@import`.
7. **색상**: Tailwind `dark:` variant + CSS 변수(`--background`, `--foreground` 등). 다크는 거의 검정(`#0a0a0a`), 라이트는 거의 흰색.
8. **반응형**: 모바일 우선. `md:` `lg:` 분기.
9. **타임라인**: 데스크탑은 좌측 도트+선/우측 카드, 모바일은 단순 스택.
10. **헤더 주석**: 모든 신규 소스 파일 첫 줄에 한국어 한 줄 주석. 'use client' 디렉티브가 있으면 그 아래.

## 디렉토리 구조
```
portfolio/
  app/{layout.tsx, page.tsx, globals.css}
  components/{layout, sections, ui}/*.tsx
  data/*.json
  types/content.ts
  lib/content.ts
  public/images/.gitkeep
  next.config.ts, tailwind.config.ts, tsconfig.json, postcss.config.mjs
  package.json, README.md
```

## 콘텐츠 갈아끼우는 법
원하는 사람은 `data/` 디렉토리의 JSON만 수정하면 된다.

- **profile.json**: 이름, 한줄소개, 이메일, GitHub/LinkedIn URL, 이력서 경로
- **site.json**: 사이트 제목/설명, 네비 메뉴 라벨
- **about.json**: 개발 철학 본문, 핵심 역량 3개
- **skills.json**: 카테고리별 스킬 배열
- **certifications.json**: 자격증 목록
- **experience.json**: 경력 (회사/직무/기간/설명/성과)
- **projects.json**: 프로젝트 카드 (id 유일, type은 personal/work, 링크 옵션)

이미지를 추가하려면 `public/images/` 아래에 두고 `projects.json`의 `thumbnail`에 `/images/파일명.jpg` 형태로 경로 지정.

## 실행법
```bash
cd portfolio
npm install        # 최초 1회
npm run dev        # 개발 서버: http://localhost:3000
npm run build      # 정적 export → out/ 디렉토리
npm run start      # (참고) standalone 빌드일 때만, export에서는 의미 없음
```

배포: `out/` 디렉토리 전체를 정적 호스팅(GitHub Pages, S3, Vercel, Netlify 등)에 업로드.

## 확인된 동작
- 빌드 성공: `npm run build` → `out/` 생성 확인
- 다크/라이트 토글: hydration mismatch 없음 (마운트 후 토글 활성화)
- 반응형: Tailwind `md:`/`lg:` 분기로 모바일 안전
- TypeScript 타입 안전: 모든 JSON이 `types/content.ts`로 강제됨

## 애니메이션 (framer-motion)
- 원본 사이트가 framer-motion `whileInView`/`whileHover` 패턴을 쓰는 것을 확인하여 동일 톤으로 카피.
- **Reveal**(`components/ui/Reveal.tsx`): 스크롤 진입 시 fade-up 한 번. props로 delay/y/duration/as 조절. `useReducedMotion` 대응.
- **Stagger**(`components/ui/Stagger.tsx`): 컨테이너 + `staggerItem` variant export. 자식은 `motion.div variants={staggerItem}` 형태로 감싸 사용.
- **Hero**: 페이지 마운트 시 `animate` 기반 stagger entrance(글로우 scale-in 1.2s → eyebrow → H1(0.1) → headline(0.25) → tagline(0.4) → CTA(0.55) → social(0.7) → 스크롤 인디케이터(0.9, 무한 bounce y:[0,8,0])).
- **About / Skills / Experience / Projects**: 섹션 제목은 Reveal, 카드/타임라인 항목은 Stagger로 0.06~0.1s 간격.
- **Projects 카드**: `whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}`로 살짝 lift.
- **Header**: 마운트 시 짧은 fade-in(`opacity 0→1, y -10→0, 0.4s`). 이후 sticky 흔들림 없음.
- **Footer**: Reveal로 진입 시 fade-up.
- **'use client' 경계**: 섹션 컴포넌트 전체를 `'use client'`로 마크함(정적 export 영향 없음). 한국어 한 줄 헤더 주석은 디렉티브 다음 줄에 유지.
- **viewport**: `{ once: true, margin: '-80px' }` 통일하여 한 번만 트리거.
- **ease**: 표준 `[0.22, 1, 0.36, 1]`(out-quint 유사)로 통일.

## WebGL Particles 배경
- **라이브러리**: `ogl`(경량 WebGL). 원본 사이트(profile.nuclearbomb6518.com/projects/bold)와 동일.
- **셰이더**: 원본 vertex/fragment 코드 그대로 사용. 수정 금지.
- **구조**: `<div fixed inset-0 -z-10 pointer-events-none>` > `<div absolute inset-0 w-full h-full>` > `<canvas>`. 원본과 동일.
- **Renderer 옵션**: `{ depth: false, alpha: true, premultipliedAlpha: false, antialias: false }`. `gl.clearColor(0,0,0,0)`로 투명 배경 보장.
- **Camera**: fov 15, position z = `cameraDistance`(기본 20).
- **Geometry**: `position`(vec3, 단위 구 내부 균일 분포 — rejection sampling + cbrt radius), `random`(vec4), `color`(vec3, 팔레트에서 랜덤 hex→rgb).
- **Mesh 모드**: `gl.POINTS`. `transparent: true, depthTest: false`.
- **루프**: `uTime = elapsed * speed * 0.001`. `disableRotation` false면 mesh.rotation.x/y에 sin/cos 살짝.
- **prefers-reduced-motion**: RAF 미가동, 정적 1회 렌더만.
- **WebGL 미지원**: `new Renderer(...)` try/catch로 감싸서 조용히 early return.
- **ResizeObserver**로 wrapper 크기 추적 → `renderer.setSize` + `camera.perspective({aspect})`.
- **cleanup**: cancelAnimationFrame, observer.disconnect, mousemove 제거, `WEBGL_lose_context` loseContext, canvas DOM 제거.
- **layout 통합 위치**: `<ThemeProvider>` 안쪽 최상단 → 모든 라우트에 자동 적용. `'use client'`이므로 layout(server component)에서 직접 import OK. ogl은 useEffect 내부에서만 호출되어 SSR 안전.
- **기본 색상**: `["#ffffff", "#a5b4fc", "#93c5fd", "#c4b5fd", "#7dd3fc"]` — 다크 모드에서 은은한 파스텔 블루/바이올렛.
- **First Load JS 영향**: 105 kB → 159 kB(/ 페이지 기준). ogl 청크가 `chunks/517-*.js`로 합류.
- **확장**: 라이트 모드 색상 분기 필요 시 `useTheme()`로 색 팔레트 토글 가능. 현재는 양 모드에서 alphaParticles smoothstep으로 자연스럽게 표시됨.

## 은하수(Milky Way) 업그레이드
- **별 분포 변경**: `Particles.tsx`에서 단위 구체 내부 균일 분포 → 갤럭시 디스크 분포로 교체. `r = pow(rand, 2) * R`(코어 밀집), 얇은 디스크(`y = (rand-0.5) * 0.15 * R`), `theta + r*0.5` 회전으로 약한 나선 흔적, `armOffset = (rand-0.5)*0.5 * 0.1`로 변동성 추가.
- **별 개수/사이즈**: `particleCount=800`, `sizeRandomness=2`로 큰별-작은별 편차 강조. 약 5%(`BRIGHT_STAR_RATIO=0.05`)의 입자에 대해 `random.x = 0.95~1.0`을 강제하여 vertex shader의 `(1.0 + uSizeRandomness*(random.x-0.5))` 식이 자동으로 큰 별로 키움. `particleBaseSize=90`.
- **회전 톤다운**: `mesh.rotation.x = sin(t*0.0001)*0.05`, `mesh.rotation.y = cos(t*0.00015)*0.08`로 절반 수준. `speed=0.06`으로 셰이더 sin 흔들림도 더 느리게.
- **테마별 팔레트**: `next-themes useTheme()` + mounted 가드로 SSR mismatch 방지. 다크는 분광 컬러 9종(`#ffffff` 가중치 2회, `#fff4e0` 2회, `#fde68a/#cfe9ff/#a5b4fc/#c4b5fd/#fbcfe8`), 라이트는 어두운 톤 5종(`#1e293b/#334155/#475569/#6366f1/#8b5cf6`).
- **nebula 글로우**: `ParticlesBackground.tsx`에 violet/blue/fuchsia 원형 블러 3개. 다크는 `/15`, `/12`, `/10`로 또렷하게, 라이트는 `/5`로 톤다운.
- **은하수 띠**: `-rotate-12` 대각선 ellipse radial gradient 띠. 다크 `rgba(255,255,255,0.06)`, 라이트 `0.03`.
- **First Load JS**: 159 kB(/ 페이지 기준) 유지 — 입자 수 증가는 GPU 측 부담만 늘리고 번들 크기는 변동 없음.

## 챗봇 우주 테마 + 프로젝트 상세 페이지
### 챗봇 (`components/ui/ChatBot.tsx`)
- **콘셉트**: 풀스크린 은하수 배경과 한 결로 보이는 신비로운 AI 어시스턴트. 다크/라이트 모두 패널은 항상 짙은 보라/검정으로 우주 컨셉 유지.
- **floating 버튼**: 64x64 보라 그라디언트, `ring-2 ring-violet-400/50` + `shadow-[0_0_40px_rgba(139,92,246,0.4)]`. 무한 float (`y: [0,-4,0]`, 3s). 우상단 emerald-400 박동 점. hover 시 우측 툴팁("AI 어시스턴트에게 물어보세요").
- **패널 배경 3중**: 외곽 `from-zinc-900/95 via-violet-950/90 to-indigo-950/95` 그라디언트 + `backdrop-blur-2xl` 글래스 + radial-gradient 7개를 합성한 별 패턴 SVG-less 오버레이.
- **메시지 버블**: 사용자는 `from-indigo-500 to-violet-600` 그라디언트 + 우하단 둥글기 축소(말풍선 꼬리). AI는 `bg-white/5 backdrop-blur-md` + 좌측 7x7 보라 Sparkles 아바타 + 좌하단 둥글기 축소.
- **로딩**: 작은 보라 dot 3개가 `delay: i*0.2`로 순차 페이드.
- **빈 상태**: 큰 Sparkles 아이콘(float), intro 문구, "✨ 이런 걸 물어보세요" + 칩 stagger.
- **입력**: `bg-white/5 border border-violet-500/30 focus:border-violet-400`. 전송 버튼은 보라 글로우 hover. `useReducedMotion`으로 float/박동 정지.
- **모바일**: `inset-x-3 bottom-3` 풀 너비, 데스크탑은 `sm:right-6 sm:bottom-6 sm:w-[380px]`.

### 프로젝트 상세 (`app/projects/[id]/page.tsx`)
- **라우팅**: `generateStaticParams`로 6개 ID 모두 SSG. Next.js 15라 `params: Promise<...>`로 받아 `await params`.
- **404**: `notFound()` + 동일 디렉토리 `not-found.tsx`.
- **레이아웃**: max-w-880px mx-auto. 풀스크린 은하수가 그대로 비치도록 카드는 모두 `bg-white/50 dark:bg-zinc-950/50 backdrop-blur` 반투명.
- **섹션 순서**: 뒤로가기 → 타이틀 카드(타입 라벨/기간/제목/부제/링크) → cover(있으면) → Tech Stack → Overview → 주요 작업(보라 도트 bullet) → content 자유 섹션(있으면) → Gallery(있으면) → 하단 CTA.
- **카드 진입**: 기존 `Reveal` 컴포넌트로 fade-up. `delay`로 순차.
- **데이터 확장**: `ProjectItem`에 `subtitle/overview/highlights/content/gallery/cover` 모두 optional. 6개 프로젝트에 한국어 더미 채움.
- **카드 클릭 → 상세**: `Projects.tsx`에서 `motion.article` → `motion.div + Link`. 외부 링크(github/demo)는 `e.stopPropagation()`로 라우팅 차단.

### 헤더 앵커 변경
- `data/site.json`의 nav를 `#about` → `/#about`으로 절대 경로 + 해시로 통일. 상세 페이지에서도 클릭 시 홈으로 이동 후 해당 섹션으로 스크롤.
- Header 로고 링크는 `#top` → `/`로 변경.
