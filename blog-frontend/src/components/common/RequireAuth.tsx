import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';

interface RequireAuthProps {
  children: React.ReactElement;
}

// 로그인하지 않은 사용자는 /login으로 리다이렉트.
const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const user = useAppSelector((state) => state.user.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default RequireAuth;
