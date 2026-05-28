# yourlog

블로그 풀스택 프로젝트. `blog-backend`(Koa + MongoDB API)와 `blog-frontend`(React SPA)로 구성. 둘 다 **Vercel에 분리 배포**하고, DB는 **MongoDB Atlas**에 연결합니다.

```
yourlog/
├── blog-backend/   # API 서버 (Node + Koa + MongoDB) — Vercel serverless
└── blog-frontend/  # SPA (React + RTK Query + TypeScript) — Vercel static
```

실행/빌드 스크립트
- [backend-swagger 문서 바로가기](https://yourlog-red.vercel.app/docs)
- [yourlog 서비스 바로가기](https://yourlog-v447.vercel.app/)
- testID: test 
- testpw: test123
- [사용자가 작성한 글목록 페이지 바로가기](https://yourlog-v447.vercel.app/test)

---

## blog-backend — 기술 스택

| 분류 | 사용 기술 |
|---|---|
| 런타임 | **Node.js** (Native ESM, `"type": "module"`) |
| 패키지 매니저 | **pnpm** 9 |
| 프레임워크 | **Koa** 2.14 |
| 라우팅 | **koa-router** 12 |
| 미들웨어 | koa-bodyparser 4, @koa/cors 4 |
| DB / ODM | **MongoDB Atlas** + **Mongoose** 6.10 (global 캐시로 cold start 대응) |
| 인증 | **JWT** (jsonwebtoken 9) + **bcrypt** 5 + httpOnly 쿠키 (`access_token`, SameSite=None/Secure in prod) |
| 입력 검증 | **Joi** 17 |
| HTML sanitize | **sanitize-html** 2 (글 저장 시 XSS 방어) |
| 환경 변수 | **dotenv** 7 (로컬), Vercel env (프로덕션) |
| Dev | **nodemon** 2 |
| 호스팅 | **Vercel** (serverless function `api/index.js` + 모든 path → `/api` rewrite) |
| 자체 구현 | IP당 15분 20회 인메모리 레이트리미터 (로컬 한정 — serverless에선 실효 없음) |

### 디렉토리 구조
```
blog-backend/
├── api/
│   └── index.js          # Vercel serverless 진입점 (Koa app.callback() 그대로 export)
├── src/
│   ├── index.js          # 로컬 dev 진입점 (app.listen만 수행)
│   ├── app.js            # Koa 앱 구성 (로컬·Vercel 공용)
│   ├── db.js             # Mongoose connection 캐싱 (cold start 대응)
│   ├── api/
│   │   ├── index.js
│   │   ├── auth/         # /api/auth (register, login, check, logout)
│   │   └── posts/        # /api/posts (list, write, read, update, remove)
│   ├── lib/
│   │   ├── authCookie.js   # access_token 쿠키 헬퍼 (SameSite/Secure 일원화)
│   │   ├── jwtMiddleware.js # access_token 검증 + 3.5일 미만이면 갱신
│   │   ├── checkLoggedIn.js # 로그인 가드
│   │   └── rateLimit.js     # 무차별 대입 방지(로컬 한정)
│   └── models/           # Mongoose 스키마 (User, Post)
└── vercel.json           # 모든 path를 /api로 rewrite → api/index.js의 Koa app이 라우팅
```

---

## blog-frontend — 기술 스택

| 분류 | 사용 기술 |
|---|---|
| 언어 | **TypeScript** 5.9 (`strict: true`, any 0건) |
| 빌드 | **Create React App** (react-scripts 5) |
| 패키지 매니저 | **pnpm** 9 (`.npmrc` `shamefully-hoist=true`) |
| 프레임워크 | **React** 18.2 |
| 라우팅 | **React Router** 6.12 |
| 상태 관리 | **Redux Toolkit** 2.12 + **RTK Query** + **react-redux** 9 |
| 스타일 | **styled-components** 6, **open-color** |
| 에디터 | **Quill** 1.3 |
| 보안 | **DOMPurify** 3 (글 렌더링 시 XSS 이중 방어) |
| 메타 태그 | **react-helmet-async** 1.3 |
| 쿼리스트링 | **qs** |
| 호스팅 | **Vercel** (CRA 빌드 자동 인식, 루트 `/`에서 서빙) |

### 디렉토리 구조
```
blog-frontend/src/
├── index.tsx                  # Provider + BrowserRouter 마운트
├── App.tsx                    # 라우팅 + 부팅 시 useCheckQuery → GlobalLoader
├── pages/
│   ├── LandingPage.tsx        # /     (공개) hero + CTA
│   ├── LoginPage / RegisterPage
│   ├── PostListPage.tsx       # /posts(가드), /:username(공개)
│   ├── PostPage.tsx           # /:username/:postId (공개)
│   └── WritePage.tsx          # /write (가드)
├── components/
│   ├── common/                # Header, Button, Spinner, GlobalLoader, RequireAuth, …
│   ├── posts/                 # PostList (2-col grid 카드)
│   ├── post/                  # PostViewer (강화된 타이포)
│   └── write/                 # Quill Editor, TagBox, …
├── containers/                # RTK Query 훅 + UI 연결
├── redux/
│   ├── store.ts               # configureStore + RTK Query 미들웨어
│   ├── hooks.ts               # 타입드 useAppDispatch/useAppSelector
│   ├── api/                   # baseApi(401 wrapper), authApi, postsApi
│   └── slices/                # userSlice, writeSlice
├── lib/styles/palette.ts
└── types/models.ts            # User, Post + RTK Query/Slice 인자·응답 타입 일괄 정의
```

### 라우트 / 인증 가드 정책

| 경로 | 접근 |
|---|---|
| `/` | 공개 (Landing — hero + CTA) |
| `/login`, `/register` | 공개 |
| `/posts` | ✅ 가드 (로그인 사용자 전용 전체 피드) |
| `/:username` | 공개 (유저 프로필/글 모음 — 링크 공유 OK) |
| `/:username/:postId` | 공개 (단건 글 — 링크 공유 OK) |
| `/write` | ✅ 가드 |

### 상태 관리 패턴
- **서버 상태**는 RTK Query(`authApi`, `postsApi`)가 캐시·로딩·재검증을 담당.
- **클라이언트 상태**는 두 슬라이스만 둠 — `userSlice`(현재 로그인 사용자), `writeSlice`(글 작성 폼).
- 로그인/회원가입/check 응답은 `userSlice`의 RTK Query **matcher**가 자동으로 user에 반영(별도 dispatch 불필요).
- 401은 `baseApi`의 baseQuery wrapper가 auth 엔드포인트 제외 후 `userCleared` 디스패치(자동 로그아웃 정리).
- 부팅 시 `useCheckQuery` 응답 전까지 `GlobalLoader`로 화면 깜빡임 차단.

### TypeScript
- `tsconfig.strict: true`, 소스 전체에 **`any`/`as any` 0건**.
- RTK Query 엔드포인트는 `<Response, Args>` 제네릭으로 입출력 타입 명시(`postsApi`, `authApi`).
- 슬라이스 액션은 `PayloadAction<...>`. `useAppDispatch`/`useAppSelector`로 store 타입 자동 추론.
- styled-components 커스텀 prop은 `styled.X<Props>` 제네릭으로 전달.

---

## 인증 / 보안 요약

- **JWT는 httpOnly 쿠키**(`access_token`, 7일)에 저장 — JS에서 접근 불가, XSS로 토큰 탈취 어려움.
- 쿠키 만료 3.5일 미만이면 다음 요청 시 자동 재발급.
- 프로덕션(Vercel)에선 cross-site 호출을 위해 쿠키 옵션 자동 분기: `SameSite=None; Secure` (로컬 dev는 기본 Lax).
- 글 본문은 **백엔드 sanitize-html(저장 시)** + **프론트 DOMPurify(렌더 시)** 이중 방어.
- 로그인/회원가입은 IP당 15분 20회 레이트리밋 — 로컬 한정(serverless에선 함수마다 카운터 초기화).

---

## API 개요

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| POST | `/api/auth/register` | - | 회원가입 (rate-limited) |
| POST | `/api/auth/login`    | - | 로그인 (rate-limited) |
| GET  | `/api/auth/check`    | - | 세션 검증 |
| POST | `/api/auth/logout`   | - | 로그아웃 |
| GET  | `/api/posts`         | - | 글 목록(필터: page/username/tag) |
| GET  | `/api/posts/:id`     | - | 글 단건 |
| POST | `/api/posts`         | ✓ | 글 작성 |
| PATCH | `/api/posts/:id`    | ✓(작성자) | 글 수정 |
| DELETE | `/api/posts/:id`   | ✓(작성자) | 글 삭제 |

> 백엔드는 API 레벨에선 글 조회를 인증 없이 허용. 프론트의 `/posts` 가드는 클라이언트 UX 차원의 정책.

대화형 문서는 백엔드의 **`/docs`** (Swagger UI) — 예: `http://localhost:4000/docs`. 스펙 정의 파일은 `blog-backend/src/docs/openapi.js`.

---

## 배포 토폴로지

```
[ Browser ]
     │
     ├─ https://your-front.vercel.app  ──► Vercel (CRA static)
     │       │ REACT_APP_API_URL
     │       ▼
     └─ https://your-api.vercel.app    ──► Vercel (Koa serverless)
                                                │ MONGO_URI
                                                ▼
                                          MongoDB Atlas
                                          (network access 0.0.0.0/0)
```

---

## 요구사항 (로컬 dev)

- Node.js (Native ESM 지원, v20 권장)
- pnpm 9+
- MongoDB Atlas 계정 (또는 로컬 MongoDB)

---

## 트러블슈팅 기록

### bcrypt 네이티브 바이너리 누락 (Vercel 배포)

**현상**
- Vercel 백엔드에 배포 후 `/`, `/docs`, `/api/*` 모든 경로가 **500 응답**
- Function Logs:
  ```
  Cannot find module '/var/task/blog-backend/node_modules/.pnpm/bcrypt@5.1.1/
                      node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node'
  Require stack: - .../bcrypt/bcrypt.js
  ```
- 로컬(macOS)에선 정상 동작 → 환경별 차이라는 단서

**원인**
- `bcrypt`는 C++ 네이티브 모듈로 플랫폼별 `.node` 바이너리에 의존
- Vercel은 **빌드 머신과 실행 머신(`/var/task`)이 분리**돼 있고, pnpm의 깊은 nested 경로(`.pnpm/.../binding/napi-v3/`) 바이너리가 함수 번들에 누락됨

**해결**
- `bcrypt` → **`bcryptjs`**(pure JavaScript 구현)로 교체
  ```bash
  pnpm remove bcrypt
  pnpm add bcryptjs
  ```
- `src/models/user.js`의 import만 한 줄 수정 (API 동일):
  ```diff
  - import bcrypt from 'bcrypt';
  + import bcrypt from 'bcryptjs';
  ```
- 해시 포맷이 호환되므로 **기존 사용자 비밀번호 마이그레이션 불필요**
- 성능은 네이티브 대비 ~2배 느리지만 (login 한 번에 ~50ms → ~100ms) 개인 블로그 트래픽에선 체감 영향 없음

### Vercel `[...path]` catch-all이 깊은 경로 매칭 실패

**현상**
- 파일을 `api/[...path].js`로 두고 배포했을 때 `/api/posts`(1단계)는 200이지만 `/api/posts/123`, `/api/auth/check`(2단계 이상)는 Vercel 자체 404 (`x-vercel-error: NOT_FOUND`)
- 로컬에선 Koa 라우터가 정상 동작 → 차이는 Vercel의 파일 라우팅 인식

**원인 추정**
- Vercel이 `[...path]` 브래킷 파일명을 catch-all로 인식 못 하고 단일 동적 세그먼트로만 처리

**해결**
- 파일명을 `api/index.js`로 변경 (브래킷 제거)
- `vercel.json`에 모든 URL을 `/api`로 rewrite:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/api" }] }
  ```
- `api/index.js` 내부의 Koa app이 원본 `req.url`을 그대로 받아 자체 라우팅 (CORS, JWT, /docs, /api/* 모두 일관 처리)

### "Cannot send secure cookie over unencrypted connection" (Vercel + secure cookie)

**현상**
- 프로덕션에서 로그인 시도 시 500 응답 + 본문 `{"message":"Cannot send secure cookie over unencrypted connection"}`
- 로컬에선 정상 (dev 환경에서는 cookie에 `secure: true`를 안 붙이는 분기)

**원인**
- Vercel(및 Heroku/Cloudflare 등 reverse proxy)은 **엣지에서 HTTPS를 종단**하고 함수에는 HTTP로 요청을 넘김
- Koa는 `ctx.protocol === 'https'`일 때만 `secure: true` 쿠키 set을 허용
- 기본 설정에서 Koa는 `X-Forwarded-Proto` 헤더를 신뢰하지 않음 → "내부 HTTP니까 secure 쿠키 거부"

**해결**
- `app.proxy = true` 한 줄 추가 (Koa app 생성 직후):
  ```js
  const app = new Koa();
  app.proxy = true; // X-Forwarded-Proto 신뢰 → ctx.secure가 올바르게 평가됨
  ```
- 같은 패턴이 필요한 다른 시그널: `ctx.ip`(X-Forwarded-For), `ctx.hostname`(X-Forwarded-Host) 등도 함께 정상화됨

