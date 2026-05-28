// Vercel serverless 진입점. Vercel은 api/ 폴더의 파일을 함수로 자동 라우팅하고,
// [...path]는 catch-all로 /api/* 모든 요청을 받는다.
// Koa의 app.callback()이 (req, res) 핸들러를 돌려주므로 그대로 default export.
import app from '../src/app.js';

export default app.callback();
