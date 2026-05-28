// access_token 쿠키 설정을 한 곳에서 관리.
// - 로컬(HTTP, dev proxy로 같은 origin): 기본값 SameSite=Lax로 OK
// - 프로덕션(Vercel HTTPS, 다른 도메인): SameSite=None + Secure 필수 — cross-site로 쿠키가 실리려면.

const ACCESS_TOKEN = 'access_token';
const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;

const isProd = () => process.env.NODE_ENV === 'production';

const baseOptions = () => ({
  httpOnly: true,
  ...(isProd() ? { sameSite: 'none', secure: true } : {}),
});

export function setAuthCookie(ctx, token) {
  ctx.cookies.set(ACCESS_TOKEN, token, {
    ...baseOptions(),
    maxAge: SEVEN_DAYS_MS,
  });
}

export function clearAuthCookie(ctx) {
  // value 없이 set하면 koa가 만료된 빈 쿠키를 보내 클라이언트에서 지워준다.
  ctx.cookies.set(ACCESS_TOKEN, null, baseOptions());
}
