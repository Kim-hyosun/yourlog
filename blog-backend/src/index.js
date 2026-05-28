// 로컬 dev 진입점. Vercel에선 api/[...path].js가 진입점이라 이 파일을 호출하지 않음.
import app from './app.js';

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
