# blog-frontend

React + RTK Query + TypeScript SPA.

## 사전 준비

- Node.js (v20 권장)
- pnpm 9+
- `.npmrc`의 `shamefully-hoist=true`는 CRA(react-scripts)의 phantom dependency 호환을 위해 필요 — 그대로 유지.

## 환경 변수 (`.env.local`)

`.env.example` 참고. 로컬에선 비워두면 됩니다(상대경로로 호출 → `package.json`의 `proxy`가 dev에서 백엔드 4000으로 위임). 프로덕션(Vercel)에선 백엔드 URL을 명시.

| 키 | 설명 | 예시 |
|---|---|---|
| `REACT_APP_API_URL` | 백엔드 API origin. | `https://your-api.vercel.app` |

> CRA 규칙상 브라우저에 노출되는 env는 모두 `REACT_APP_` 접두사가 필요

## dev 시 API 프록시

`package.json`에 `"proxy": "http://localhost:4000/"`가 설정돼 있어 `pnpm start`로 dev 서버를 띄우면 `/api/...` 요청이 자동으로 백엔드로 프록시됩니다. 백엔드도 같이 띄워두세요.

## 의존성 설치

```bash
pnpm install
```

## 스크립트

| 명령 | 동작 |
|---|---|
| `pnpm start` | 개발 서버 (3000번 포트) |
| `pnpm build` | 프로덕션 빌드 → `build/`. Vercel이 자동 인식 |
| `pnpm test` | react-scripts 테스트 |
| `pnpm exec tsc --noEmit` | 타입 검사만 (빌드 없이) |

> 빌드 시 CI 환경에서는 경고를 에러로 처리합니다. 로컬에서 빌드만 검증하려면 `CI=false pnpm build`로 회피 가능.

## 디렉토리 구조 (요약)

```
src/
├── index.tsx              # Provider + BrowserRouter 마운트
├── App.tsx                # 라우팅 + 부팅 시 useCheckQuery → GlobalLoader
├── pages/
│   ├── LandingPage.tsx    # /  (공개) hero + CTA
│   ├── LoginPage / RegisterPage
│   ├── PostListPage.tsx   # /posts(가드), /:username(공개)
│   ├── PostPage.tsx       # /:username/:postId (공개)
│   └── WritePage.tsx      # /write (가드)
├── components/
│   ├── common/            # Header, Button, Spinner, GlobalLoader, RequireAuth, …
│   ├── posts/             # PostList(2-col grid 카드)
│   ├── post/              # PostViewer(타이포 강화)
│   └── write/             # Quill Editor, TagBox, …
├── containers/            # RTK Query 훅 + UI 연결
├── redux/
│   ├── store.ts / hooks.ts
│   ├── api/               # baseApi(401 wrapper), authApi, postsApi
│   └── slices/            # userSlice, writeSlice
└── types/models.ts        # User, Post + RTK Query/Slice 인자·응답 타입
```

## 라우트 / 인증 가드 정책

| 경로 | 접근 |
|---|---|
| `/` | 공개 (LandingPage — hero + CTA) |
| `/login`, `/register` | 공개 |
| `/posts` | ✅ 가드 (로그인 사용자 전용 전체 피드) |
| `/:username` | 공개 (유저 프로필/글 모음 — 링크 공유 OK) |
| `/:username/:postId` | 공개 (단건 글 — 링크 공유 OK) |
| `/write` | ✅ 가드 |

## 전역 부팅 로딩

`App.tsx`에서 `useCheckQuery()` 응답 전까지는 `GlobalLoader`(전체 화면 스피너)만 렌더해 "비로그인 화면 깜빡 → 로그인 화면"의 깜빡임을 막습니다.

## TypeScript

- `tsconfig.json`은 **`strict: true`**.
- 공통 타입은 `src/types/models.ts`에 모음 — `User`, `Post`와 RTK Query/Slice가 쓰는 `ListPostsArgs`, `ListPostsResponse`, `WritePostArgs`, `UpdatePostArgs`, `WriteFormState`, `ChangeFieldPayload`.
- RTK Query 엔드포인트는 `build.query<Response, Args>` / `build.mutation<Response, Args>` 형태로 입출력 타입을 명시.
- 슬라이스 액션은 `PayloadAction<...>`. 컨테이너는 `useAppDispatch`/`useAppSelector`로 store 타입을 자동 추론.
- styled-components 커스텀 prop은 `styled.X<Props>` 제네릭으로 전달(콜백 안에서 `props.xxx` 자동 추론).
- 타입 검사:

```bash
pnpm exec tsc --noEmit
```

