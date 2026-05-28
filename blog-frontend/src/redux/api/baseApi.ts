import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 백엔드는 httpOnly 쿠키로 access_token을 관리하므로 credentials 포함이 필수.
// baseUrl이 비어 있으면 상대경로(dev proxy / 같은 origin static) 그대로 동작.
const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL || '',
  credentials: 'include',
});

// rawBaseQuery의 시그니처를 그대로 따라가는 wrapper.
type BaseQuery = typeof rawBaseQuery;

// 401 글로벌 처리: auth 엔드포인트(login/register/check/logout)는 각자 컴포넌트가
// 처리하므로 제외. 그 외에서 401이 오면 user 상태를 비운다(=세션 만료 정리).
const baseQuery: BaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const url = typeof args === 'string' ? args : args?.url || '';
  const isAuthEndpoint = url.includes('/api/auth/');
  // user.user 존재 여부만 알면 되므로 state 전체 타입은 RootState로 단정.
  const state = api.getState() as { user: { user: unknown } };
  if (
    result.error?.status === 401 &&
    !isAuthEndpoint &&
    state.user.user
  ) {
    // 동적 import로 순환 의존을 피한다.
    const { userCleared } = await import('../slices/userSlice');
    api.dispatch(userCleared());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Post', 'PostList', 'Me'],
  endpoints: () => ({}),
});
