import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import type { User } from '../../types/models';

interface UserState {
  user: User | null;
}

const initialState: UserState = { user: null };

// 현재 로그인 사용자 슬라이스. 새로고침 시 localStorage에서 임시 복원 후
// check 쿼리로 검증한다. 로그인/회원가입/체크 성공 시 user를 채우고,
// 체크 실패 또는 명시적 로그아웃 시 비운다.
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    tempSetUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    userCleared(state) {
      state.user = null;
      try {
        localStorage.removeItem('user');
      } catch {
        /* no-op: localStorage 비활성 환경 */
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          authApi.endpoints.login.matchFulfilled,
          authApi.endpoints.register.matchFulfilled,
          authApi.endpoints.check.matchFulfilled,
        ),
        (state, action) => {
          state.user = action.payload;
          try {
            localStorage.setItem('user', JSON.stringify(action.payload));
          } catch {
            /* no-op */
          }
        },
      )
      .addMatcher(authApi.endpoints.check.matchRejected, (state) => {
        state.user = null;
        try {
          localStorage.removeItem('user');
        } catch {
          /* no-op */
        }
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        try {
          localStorage.removeItem('user');
        } catch {
          /* no-op */
        }
      });
  },
});

export const { tempSetUser, userCleared } = userSlice.actions;
export default userSlice.reducer;
