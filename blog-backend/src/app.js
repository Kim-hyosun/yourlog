// 이 파일은 Koa 앱 인스턴스만 만들어 export한다.
// 로컬 dev(src/index.js)와 Vercel(api/[...path].js) 양쪽에서 import해 사용한다.

import dotenv from 'dotenv';
dotenv.config(); // .env가 있으면 로드(Vercel에선 platform이 env를 주입하므로 no-op이어도 OK)

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import api from './api/index.js';
import jwtMiddleware from './lib/jwtMiddleware.js';
import { connectDB } from './db.js';

const app = new Koa();
const router = new Router();

// CORS: 쿠키를 cross-origin으로 실어야 하므로 credentials 필수.
const { CLIENT_ORIGIN } = process.env;
app.use(
  cors({
    origin: CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }),
);

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
