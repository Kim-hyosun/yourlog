import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';
import Spinner from '../common/Spinner';

/* 회원가입, 로그인 폼 보여줌 */
const AuthFormBlock = styled.div`
  h3 {
    margin: 0 0 1rem 0;
    color: ${palette.gray[8]};
  }
`;

//멋낸 input
const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }
  & + & {
    margin: 1rem 0 0 0;
  }
`;

//폼하단에 로그인 혹은 회원가입링크 보여줌
const Footer = styled.div`
  margin-top: 2rem;
  text-align: right;
  a {
    color: ${palette.gray[6]};
    text-decoration: underline;
    &:hover {
      color: ${palette.gray[9]};
    }
  }
`;

const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

type AuthFormType = 'login' | 'register';

interface AuthFormFields {
  username: string;
  password: string;
  passwordConfirm?: string;
}

interface AuthFormProps {
  type: AuthFormType;
  form: AuthFormFields;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string | null;
  isLoading?: boolean;
}

const textMap: Record<AuthFormType, string> = {
  login: 'Login',
  register: '회원가입',
};

const loadingTextMap: Record<AuthFormType, string> = {
  login: '로그인 중…',
  register: '가입 중…',
};

// 버튼 안에서 spinner와 텍스트를 가로로 배치.
const ButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

/* 에러를 보여줌 */
const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  form,
  onChange,
  onSubmit,
  error,
  isLoading,
}) => {
  const text = textMap[type];
  return (
    <AuthFormBlock>
      <h3>{text}</h3>
      <form onSubmit={onSubmit}>
        <StyledInput
          autoComplete="username"
          name="username"
          placeholder="아이디를 입력하세요"
          onChange={onChange}
          value={form.username}
          disabled={isLoading}
        />
        <StyledInput
          autoComplete="new-password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          type="password"
          onChange={onChange}
          value={form.password}
          disabled={isLoading}
        />
        {type === 'register' && (
          <StyledInput
            autoComplete="new-password"
            name="passwordConfirm"
            placeholder="비밀번호를 다시한번 입력하세요"
            type="password"
            onChange={onChange}
            value={form.passwordConfirm}
            disabled={isLoading}
          />
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonWithMarginTop
          cyan
          fullWidth
          style={{ marginTop: '1rem' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ButtonContent>
              <Spinner size={16} thickness={2} color="white" />
              {loadingTextMap[type]}
            </ButtonContent>
          ) : (
            text
          )}
        </ButtonWithMarginTop>
      </form>
      <Footer>
        {type === 'login' ? (
          <Link to="/register">회원가입</Link>
        ) : (
          <Link to="/login">로그인</Link>
        )}
      </Footer>
    </AuthFormBlock>
  );
};

export default AuthForm;
