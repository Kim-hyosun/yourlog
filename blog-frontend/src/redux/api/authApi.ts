import { baseApi } from './baseApi';
import type { User } from '../../types/models';

interface Credentials {
  username: string;
  password: string;
}

// 인증 관련 엔드포인트. 응답 user는 userSlice가 matcher로 받아 반영한다.
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<User, Credentials>({
      query: ({ username, password }) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: { username, password },
      }),
    }),
    register: build.mutation<User, Credentials>({
      query: ({ username, password }) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: { username, password },
      }),
    }),
    check: build.query<User, void>({
      query: () => '/api/auth/check',
      providesTags: ['Me'],
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: '/api/auth/logout', method: 'POST' }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useCheckQuery,
  useLazyCheckQuery,
  useLogoutMutation,
} = authApi;
