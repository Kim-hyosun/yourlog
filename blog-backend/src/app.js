// 이 파일은 Koa 앱 인스턴스만 만들어 export한다.
// 로컬 dev(src/index.js)와 Vercel(api/[...path].js) 양쪽에서 import해 사용한다.

import dotenv from 'dotenv';
dotenv.config(); // .env가 있으면 로드(Vercel에선 platform이 env를 주입하므로 no-op이어도 OK)

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { koaSwagger } from 'koa2-swagger-ui';
import api from './api/index.js';
import jwtMiddleware from './lib/jwtMiddleware.js';
import { connectDB } from './db.js';
import openApiSpec from './docs/openapi.js';

const app = new Koa();
// Vercel은 엣지에서 HTTPS를 종단하고 함수엔 HTTP로 넘긴다. proxy=true로 두면
// X-Forwarded-Proto 같은 헤더를 신뢰해서 ctx.secure가 올바르게 true가 되고,
// authCookie의 `secure: true` 옵션이 "Cannot send secure cookie over unencrypted"
// 에러 없이 동작한다.
app.proxy = true;

const router = new Router();

// 하위 미들웨어에서 throw해도 응답 직전에 헤더가 wipe되지 않도록 가장 바깥에서
// 직접 처리. CORS 헤더와 status를 보존해 브라우저가 진짜 에러 메시지를 볼 수 있다.
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { message: err.message || 'Internal Server Error' };
    ctx.app.emit('error', err, ctx);
  }
});

// CORS: 쿠키를 cross-origin으로 실어야 하므로 credentials 필수.
// keepHeadersOnError: 에러 응답에도 CORS 헤더 유지(브라우저에 CORS 오해 방지).
const { CLIENT_ORIGIN } = process.env;
app.use(
  cors({
    origin: CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
    keepHeadersOnError: true,
  }),
);

// Swagger UI는 정적 HTML/JS만 내려주므로 DB 연결 미들웨어보다 앞에 둔다.
// (/docs 요청에서 mongo connect 시도를 막아 cold start 비용 0)
app.use(
  koaSwagger({
    routePrefix: '/docs',
    swaggerOptions: { spec: openApiSpec },
    hideTopbar: true,
  }),
);

// 루트 헬스체크 — DB 연결 미들웨어보다 앞에 두어 Mongo가 죽어도 응답되게 한다.
// 백엔드 도메인 자체가 살아있는지 빠르게 확인할 때 사용.
app.use(async (ctx, next) => {
  if (ctx.method === 'GET' && ctx.path === '/') {
    ctx.body = { name: 'yourlog-api', docs: '/docs', api: '/api' };
    return;
  }
  return next();
});

// Serverless cold start 후 첫 요청이 DB 연결을 await하도록 보장.
// warm 상태에선 캐시된 connection을 즉시 반환하므로 오버헤드 없음.
app.use(async (ctx, next) => {
  await connectDB();
  return next();
});

app.use(bodyParser());
app.use(jwtMiddleware);

router.use('/api', api.routes());
app.use(router.routes()).use(router.allowedMethods());

export default app;
