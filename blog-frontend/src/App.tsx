import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';
import RequireAuth from './components/common/RequireAuth';
import GlobalLoader from './components/common/GlobalLoader';
import { useCheckQuery } from './redux/api/authApi';

// 부팅 시 세션 확인(check) 응답 전까지는 라우트를 그리지 않고 GlobalLoader만 보여줘서
// "비로그인 화면 깜빡 → 사용자 화면" 같은 깜빡임을 막는다.
const App: React.FC = () => {
  const { isUninitialized, isLoading } = useCheckQuery();

  if (isUninitialized || isLoading) {
    return <GlobalLoader />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/posts"
        element={
          <RequireAuth>
            <PostListPage />
          </RequireAuth>
        }
      />
      <Route
        path="/write"
        element={
          <RequireAuth>
            <WritePage />
          </RequireAuth>
        }
      />
      <Route path="/:username">
        {/* 유저별 목록과 단건 글은 모두 공개 — 프로필 링크 공유 가능(B' 옵션).
            글로벌 피드(/posts)만 로그인 사용자 전용으로 남긴다. */}
        <Route index element={<PostListPage />} />
        <Route path=":postId" element={<PostPage />} />
      </Route>
    </Routes>
  );
};

export default App;
