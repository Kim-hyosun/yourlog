import mongoose from 'mongoose';

// Serverless 환경에선 함수 인스턴스가 재사용되므로, 모듈 변수에 connection을
// 캐싱해 cold start 후에도 한 번만 connect하고, warm 동안엔 재사용한다.
// 로컬(상시 떠 있는 서버)에서도 동일하게 동작 — 첫 호출만 connect하고 이후엔 캐시.
mongoose.set('strictQuery', false);

let cached = global._mongooseConnection;
if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const { MONGO_URI } = process.env;
    if (!MONGO_URI) throw new Error('MONGO_URI is not set');
    cached.promise = mongoose
      .connect(MONGO_URI)
      .then((m) => {
        console.log('Connected to MongoDB');
        return m;
      })
      .catch((e) => {
        cached.promise = null; // 실패 시 다음 요청에서 재시도
        console.error('Mongo connect failed:', e.message);
        throw e;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
