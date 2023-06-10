import { Koa, Router, bodyParser } from './main.js';
/* import postsRouter from './api/posts/index.js';
import authRouter from './api/auth/index.js'; */
import jwtMiddleware from './lib/jwtMiddleware.js';
import api from './api/index.js';
import cors from '@koa/cors';
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';

const app = new Koa();
const router = new Router();

// 비구조화 할당으로 process.env 내부 값에 대한 레퍼런스 만들기
const { PORT } = process.env;

//CORS미들웨어 추가
app.use(cors({ origin: 'http://localhost:3000' }));
// 라우터 설정
router.use('/api', api.routes()); // posts 라우트 적용

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const buildDirectory = path.resolve(__dirname, '../../blog-frontend/build');
app.use(serve(buildDirectory));
app.use(async (ctx) => {
  // Not Found 이고, 주소가 /api 로 시작하지 않는 경우
  if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
    // index.html 내용을 반환
    await send(ctx, 'index.html', { root: buildDirectory });
  }
});

const port = PORT || 4000;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
