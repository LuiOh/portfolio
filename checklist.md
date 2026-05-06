# 포트폴리오 사이트 구축 체크리스트

## 0. 사전 준비
- [x] 디렉토리 상태 점검 (비어있음 확인)
- [x] checklist.md / context-notes.md 작성

## 1. 프로젝트 초기화
- [x] Next.js 15 + TypeScript + Tailwind 비대화형 초기화
- [x] next-themes, lucide-react 의존성 설치
- [x] next.config.ts 정적 export 설정
- [x] tsconfig 경로 별칭(@/*) 확인

## 2. 데이터 레이어
- [x] types/content.ts: 모든 JSON 타입 정의
- [x] data/site.json: 사이트 메타 + 네비
- [x] data/profile.json: 프로필 정보
- [x] data/about.json: 개발 철학 + 핵심 역량
- [x] data/skills.json: 카테고리별 스킬
- [x] data/certifications.json: 자격증
- [x] data/experience.json: 경력
- [x] data/projects.json: 프로젝트 (개인 3 + 업무 3)
- [x] lib/content.ts: 타입드 헬퍼

## 3. 레이아웃 컴포넌트
- [x] components/layout/ThemeProvider.tsx
- [x] components/layout/ThemeToggle.tsx
- [x] components/layout/Header.tsx (햄버거 포함)
- [x] components/layout/Footer.tsx

## 4. UI 컴포넌트
- [x] components/ui/SectionTitle.tsx
- [x] components/ui/Card.tsx
- [x] components/ui/Tag.tsx

## 5. 섹션 컴포넌트
- [x] components/sections/Hero.tsx
- [x] components/sections/SocialLinks.tsx
- [x] components/sections/About.tsx
- [x] components/sections/Skills.tsx
- [x] components/sections/Certifications.tsx
- [x] components/sections/Experience.tsx (타임라인)
- [x] components/sections/Projects.tsx (필터, 'use client')

## 6. 페이지 / 글로벌
- [x] app/layout.tsx (ThemeProvider + lang="ko")
- [x] app/page.tsx (모든 섹션 조립)
- [x] app/globals.css (Pretendard + 변수)

## 7. 부가 파일
- [x] public/images/.gitkeep
- [x] README.md (콘텐츠 갈아끼우는 법)

## 8. 검증
- [x] npm run build 성공
- [x] out/ 디렉토리 생성 확인
- [x] 하드코딩 텍스트 없는지 확인
- [x] 반응형 클래스 적용 확인

## 9. 마무리
- [x] checklist 갱신
- [x] context-notes에 실행법/갈아끼우는 법 기록

## 11. WebGL Particles 배경 (ogl)
- [x] ogl 의존성 설치
- [x] components/ui/Particles.tsx (원본 셰이더 그대로 적용)
- [x] components/ui/ParticlesBackground.tsx (fixed inset-0 -z-10 pointer-events-none)
- [x] app/layout.tsx에 ThemeProvider 안쪽 최상단 통합
- [x] prefers-reduced-motion 대응 (RAF 정지)
- [x] WebGL 미지원 환경 try/catch 가드
- [x] Reveal.tsx 미사용 import 정리
- [x] tsc / build 통과 (First Load JS 159 kB, +ogl 청크)

## 12. 챗봇 우주 테마 리디자인 + 프로젝트 상세 페이지
- [x] types/content.ts: ProjectItem 확장 (subtitle/overview/highlights/content/gallery/cover) + ChatbotConfig title/subtitle
- [x] data/projects.json: 6개 프로젝트에 overview/highlights/content 한국어 더미 채움
- [x] data/chatbot.json: title/subtitle 추가
- [x] data/site.json: nav 앵커 절대경로화 (/#about 등)
- [x] components/layout/Header.tsx: 로고 링크 / 로 통일
- [x] components/ui/ChatBot.tsx: 우주/은하수 테마 풀 리디자인 (보라 그라디언트, 별 패턴, glow, AI 아바타 버블, 빈상태 EmptyState, useReducedMotion 대응)
- [x] components/sections/Projects.tsx: 카드 전체 Link로 래핑, 외부 링크 stopPropagation
- [x] app/projects/[id]/page.tsx: 정적 상세 페이지 (generateStaticParams + generateMetadata)
- [x] app/projects/[id]/not-found.tsx: 404 화면
- [x] tsc / build 통과 (6개 정적 라우트 SSG 생성 확인)

## 10. 애니메이션 도입 (framer-motion)
- [x] framer-motion 설치
- [x] components/ui/Reveal.tsx (스크롤 진입 fade-up 래퍼)
- [x] components/ui/Stagger.tsx (자식 stagger 컨테이너 + staggerItem variant)
- [x] Hero: 페이지 로드 시 stagger entrance + 글로우 scale-in + 스크롤 인디케이터 무한 bounce
- [x] About: 제목/철학/카드/자격증 Reveal + 카드 stagger
- [x] Skills: 제목 Reveal + 카테고리 카드 stagger
- [x] Experience: 제목 Reveal + 타임라인 항목 stagger
- [x] Projects: 제목/필터 Reveal + 카드 stagger + hover lift(spring)
- [x] Header: mount 시 짧은 fade-in
- [x] Footer: 진입 시 Reveal
- [x] useReducedMotion 대응
- [x] tsc / build 통과
