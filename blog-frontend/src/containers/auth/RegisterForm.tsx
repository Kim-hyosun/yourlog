import { useAppSelector } from '../../redux/hooks';
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import { useRegisterMutation } from '../../redux/api/authApi';

// 로그인과 동일한 패턴: 로컬 폼 + register mutation. 성공하면 userSlice가 user를
// 채우고, 그 변화에 useEffect가 반응해 홈으로 이동.
const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [register, { error: registerError, isLoading }] =
    useRegisterMutation();
  const user = useAppSelector((state) => state.user.user);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    const { username, password, passwordConfirm } = form;
    if ([username, password, passwordConfirm].includes('')) {
      setError('빈 칸이 없도록 모두 채워주세요');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      setForm((prev) => ({ ...prev, password: '', passwordConfirm: '' }));
      return;
    }
    setError(null);
    register({ username, password });
  };

  useEffect(() => {
    if (!registerError) return;
    if ('status' in registerError && registerError.status === 409) {
      setError('이미 존재하는 아이디입니다.');
    } else {
      setError('회원가입 실패하였습니다.');
    }
  }, [registerError]);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (
    <AuthForm
      type="register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default RegisterForm;
