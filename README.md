# 포트폴리오 사이트

Next.js 15 App Router 기반의 정적 포트폴리오 사이트입니다. 모든 텍스트 콘텐츠가 `data/` 디렉토리의 JSON 파일로 외부화되어 있어, 코드를 수정하지 않고도 누구나 자신의 포트폴리오로 빠르게 갈아끼울 수 있습니다.

## 주요 특징

- Next.js 15 + React 19 + TypeScript + Tailwind CSS
- Vercel SSR 배포 (API Routes로 OpenAI 챗봇 프록시 포함)
- next-themes 기반 다크/라이트 테마 (시스템 감지 + 사용자 선택)
- 모바일/태블릿/데스크탑 반응형 레이아웃
- 모든 콘텐츠 JSON 외부화 (이름, 소개, 경력, 프로젝트 등)
- 단일 페이지 + 앵커 스무스 스크롤 네비게이션
- Pretendard 한글 폰트 + 한영 혼용 가독성

## 빠른 시작

```bash
cd portfolio
npm install
npm run dev
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

## 빌드

```bash
npm run build
```

SSR 모드라 `.next/` 디렉토리에 빌드 결과가 생성됩니다. Vercel에 배포하면 자동으로 빌드·실행됩니다.

## 콘텐츠 갈아끼우는 법

코드를 수정할 필요가 없습니다. `data/` 폴더의 JSON 파일만 편집하면 됩니다.

| 파일 | 내용 |
| --- | --- |
| `data/site.json` | 사이트 제목, 설명, 카피라이트, 네비게이션 메뉴 |
| `data/profile.json` | 이름, 한 줄 소개, 이메일, GitHub/LinkedIn 등 외부 링크, CTA 버튼 라벨 |
| `data/about.json` | 개발 철학 본문(문단 배열), 핵심 역량 카드 3개 |
| `data/skills.json` | 카테고리별 기술 스택 배열 |
| `data/certifications.json` | 자격증 목록 |
| `data/experience.json` | 경력 (회사, 직무, 기간, 설명, 성과) |
| `data/projects.json` | 프로젝트 카드. `type`이 `personal` 또는 `work` |

각 JSON의 정확한 구조는 `types/content.ts`에 TypeScript 인터페이스로 정의되어 있습니다. 빌드 시 타입이 검증되므로 잘못된 형식이면 빌드가 실패해 바로 알 수 있습니다.

### 이미지 추가

프로젝트 썸네일 등 이미지를 추가하려면 `public/images/` 폴더에 파일을 두고, JSON에서 `/images/파일명.jpg` 형태로 경로를 지정하세요. 이미지가 없으면 자동으로 그라디언트 placeholder가 표시됩니다.

### 이력서 PDF

`public/resume.pdf`로 PDF 파일을 두면 `profile.json`의 `resumeUrl`(기본값 `/resume.pdf`)을 통해 다운로드 버튼이 동작합니다.

## 디렉토리 구조

```
portfolio/
├── app/                    # Next.js App Router (layout, page, globals.css)
├── components/
│   ├── layout/             # Header, Footer, ThemeProvider, ThemeToggle
│   ├── sections/           # Hero, About, Skills, Certifications, Experience, Projects
│   └── ui/                 # SectionTitle, Card, Tag (재사용 컴포넌트)
├── data/                   # 모든 콘텐츠 JSON
├── lib/content.ts          # JSON을 타입드 객체로 변환하는 단일 진입점
├── types/content.ts        # JSON 구조의 TypeScript 인터페이스
└── public/                 # 정적 자산 (이미지, 이력서 등)
```

## 배포

### Vercel (권장)

저장소를 Vercel에 연결만 하면 자동으로 빌드·배포됩니다. 챗봇을 사용하려면 환경 변수 `OPENAI_API_KEY` 설정이 필요합니다(자세한 설명은 아래 "챗봇 설정" 참고).

## 챗봇 설정

우측 하단의 floating 챗봇은 OpenAI `gpt-4.1-nano` 모델을 사용해 사이트의 JSON 데이터(프로필, 스킬, 경력, 프로젝트 등)를 컨텍스트로 답변합니다. API 키는 서버 사이드(`app/api/chat/route.ts`)에서만 사용되며 클라이언트에 노출되지 않습니다.

### 로컬 개발

1. `.env.local.example` 파일을 `.env.local`로 복사합니다.
2. `OPENAI_API_KEY` 값을 실제 키로 채웁니다. (발급: https://platform.openai.com/api-keys)
3. `npm run dev` 실행 후 우측 하단 보라색 버튼 클릭.

### Vercel 배포

이 프로젝트는 SSR + API Routes를 사용하므로 Vercel에 배포해야 챗봇이 동작합니다.

1. Vercel 프로젝트에 저장소를 연결합니다.
2. **Settings → Environment Variables**에서 `OPENAI_API_KEY`를 추가합니다.
3. 재배포하면 챗봇이 활성화됩니다.

### 커스터마이징

- 모델 변경: `app/api/chat/route.ts`의 `model` 필드를 수정하세요. (예: `gpt-4o-mini`)
- 챗봇 톤·자기소개·추천 질문·규칙: `data/chatbot.json`을 편집하세요.
- 컨텍스트로 주입되는 데이터 범위: `app/api/chat/route.ts`의 `buildSystemPrompt()`에서 조정합니다.

## 라이선스

이 코드는 자유롭게 사용·수정·배포할 수 있습니다. 콘텐츠는 모두 더미이므로 본인의 정보로 교체해 사용하세요.
