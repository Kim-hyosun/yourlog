import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
// 엔드포인트 정의를 사이드이펙트로 등록(injectEndpoints 호출).
import './api/authApi';
import './api/postsApi';
import userReducer from './slices/userSlice';
import writeReducer from './slices/writeSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    user: userReducer,
    write: writeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// refetchOnFocus/refetchOnReconnect 활성화용. 사용은 옵션 단위.
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
