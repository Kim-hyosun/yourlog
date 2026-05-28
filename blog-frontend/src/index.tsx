import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import { store } from './redux/store';

// 세션 확인(check)은 App에서 useCheckQuery가 자동 발사한다.
// 응답 전까지 App이 GlobalLoader를 렌더하므로 비로그인 깜빡임 없음.
const root = createRoot(document.getElementById('wrap')!);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </Provider>,
);
