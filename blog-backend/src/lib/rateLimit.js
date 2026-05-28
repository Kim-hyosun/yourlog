// 의존성 없는 인메모리 고정 윈도우 레이트리미터.
// 단일 프로세스 기준이라 서버 재시작 시 초기화되고 멀티 인스턴스 환경에는
// 적합하지 않다(그 경우 koa-ratelimit + Redis 등으로 교체 필요).
const buckets = new Map();

const rateLimit = ({ windowMs, max }) => {
  return async (ctx, next) => {
    const key = ctx.ip;
    const now = Date.now();
    const entry = buckets.get(key);

    if (!entry || now > entry.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      ctx.status = 429; // Too Many Requests
      ctx.body = { message: '너무 많은 요청입니다. 잠시 후 다시 시도해 주세요.' };
      return;
    }
    return next();
  };
};

export default rateLimit;
