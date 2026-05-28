# blog-backend

Koa + MongoDB API 서버. **로컬 dev**와 **Vercel serverless** 양쪽에서 같은 코드로 동작하도록 구성.

## 사전 준비

- Node.js (Native ESM 지원, v20 권장)
- pnpm 9+
- MongoDB (로컬 또는 [Atlas](https://www.mongodb.com/atlas))

## 환경 변수 (`.env`)

`.env.example`을 복사해 `.env`로 만들고 값을 채웁니다.

| 키 | 설명 | 예시 |
|---|---|---|
| `PORT` | 로컬 서버 포트 (Vercel에선 무시) | `4000` |
| `MONGO_URI` | MongoDB 접속 URI (DB명 `/blog` 포함 권장) | `mongodb+srv://user:pass@host/blog?...` |
| `JWT_SECRET` | JWT 서명 키(64바이트 hex 권장) | 생성: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `CLIENT_ORIGIN` | CORS 허용 origin (프론트 URL) | `http://localhost:3000` (local) / `https://your-front.vercel.app` (production) |

## 의존성 설치

```bash
pnpm install
```

## 스크립트 (로컬)

| 명령 | 동작 |
|---|---|
| `pnpm start` | 로컬 실행 — `node src/index.js` |
| `pnpm start:dev` | 개발 실행(nodemon 감시) — `nodemon --watch src/ src/index.js` |

> Vercel에선 위 스크립트를 호출하지 않고 `api/[...path].js`가 진입점이 됩니다.

## 디렉토리 구조

```
blog-backend/
├── api/
│   └── [...path].js      # Vercel serverless 진입점 (catch-all → app.callback())
├── src/
│   ├── index.js          # 로컬 dev 진입점 (app.listen만)
│   ├── app.js            # Koa 앱 구성 (로컬·Vercel 공용)
│   ├── db.js             # Mongoose connection 캐싱 (cold start 대응)
│   ├── api/              # /api/auth, /api/posts 라우트
│   ├── lib/
│   │   ├── authCookie.js # access_token 쿠키 헬퍼 (SameSite/Secure 일원화)
│   │   ├── jwtMiddleware.js
│   │   ├── checkLoggedIn.js
│   │   └── rateLimit.js  # 인메모리 레이트리미터 (※ serverless에선 실효 X)
│   └── models/           # Mongoose 스키마 (User, Post)
└── (vercel.json 없음 — api/ 폴더 컨벤션만으로 함수 자동 등록)
```

## 실행 흐름

### 로컬 (`pnpm start:dev`)
1. `src/index.js`가 `src/app.js`를 import하면 dotenv 로드 + Koa 앱 구성
2. `app.listen(PORT)`로 4000 포트에서 상시 listen
3. 요청 처리 미들웨어 순서: CORS → DB 연결 보장 → bodyParser → jwtMiddleware → router

### Vercel (serverless)
1. 요청이 함수 `api/[...path].js`에 도달 → `app.callback()`을 즉시 호출
2. **Cold start**: `src/db.js`가 `global` 캐시에 connection 보관 → 첫 호출만 await, 이후 warm 동안 재사용
3. 응답 후 함수 인스턴스가 idle → 일정 시간 후 회수

## 쿠키 (SameSite / Secure)

`src/lib/authCookie.js`가 환경별로 옵션을 자동 분기합니다:

| 환경 | 설정 | 이유 |
|---|---|---|
| `NODE_ENV !== 'production'` (로컬) | `httpOnly` | dev proxy로 같은 origin 호출 → 기본 SameSite=Lax로 충분 |
| `NODE_ENV === 'production'` (Vercel) | `httpOnly, sameSite: 'none', secure: true` | 프론트·백엔드가 다른 도메인 → cross-site로 쿠키가 실리려면 None+Secure 필수 |

## API 문서 (Swagger UI)

- 경로: **`/docs`** (예: `http://localhost:4000/docs`, 배포본은 `https://your-api.vercel.app/docs`)
- 스펙은 `src/docs/openapi.js`에 손으로 작성한 OpenAPI 3.0 객체. 엔드포인트가 바뀌면 이 파일을 갱신.
- UI 미들웨어는 DB 연결 단계보다 앞에 마운트돼 있어서 `/docs` 요청은 MongoDB cold start를 트리거하지 않음.
- 접근은 공개 — 운영 단계에서 막고 싶다면 `app.js`에서 `process.env.NODE_ENV !== 'production'`일 때만 마운트하거나 헤더 토큰 가드 추가.


