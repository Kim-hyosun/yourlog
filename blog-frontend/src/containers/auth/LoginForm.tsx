import { useAppSelector } from '../../redux/hooks';
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import { useLoginMutation } from '../../redux/api/authApi';

// 폼 상태는 로컬 useState로 충분(전역에 둘 이유가 없는 transient 입력값).
// 로그인 성공 시 응답은 userSlice의 login.matchFulfilled가 받아 user에 반영하므로,
// 여기선 별도 check 디스패치 없이 user 변경을 감지해 홈으로 이동만 한다.
const LoginForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [login, { error: loginError, isLoading }] = useLoginMutation();
  const user = useAppSelector((state) => state.user.user);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    login(form);
  };

  useEffect(() => {
    if (loginError) setError('잘못된 접근으로 로그인 실패하였습니다.');
  }, [loginError]);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (
    <AuthForm
      type="login"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default LoginForm;
