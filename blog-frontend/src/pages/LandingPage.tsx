import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import palette from '../lib/styles/palette';
import { useAppSelector } from '../redux/hooks';
import HeaderContainer from '../containers/common/HeaderContainer';

const Hero = styled.section`
  max-width: 720px;
  margin: 0 auto;
  padding: 6rem 1.5rem 4rem;
  text-align: center;

  h1 {
    font-size: 3rem;
    line-height: 1.2;
    margin: 0 0 1rem;
    letter-spacing: -0.02em;
    color: ${palette.gray[9]};
  }

  p {
    font-size: 1.125rem;
    line-height: 1.7;
    color: ${palette.gray[7]};
    margin: 0 0 2.5rem;
  }
`;

const CtaRow = styled.div`
  display: inline-flex;
  gap: 0.75rem;
`;

const PrimaryCta = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: ${palette.cyan[6]};
  color: white;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s ease;
  &:hover {
    background: ${palette.cyan[5]};
  }
`;

const SecondaryCta = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: white;
  color: ${palette.gray[8]};
  border: 1px solid ${palette.gray[3]};
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.15s ease;
  &:hover {
    border-color: ${palette.gray[5]};
  }
`;

const LandingPage: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  return (
    <>
      <Helmet>
        <title>Your log</title>
      </Helmet>
      <HeaderContainer />
      <Hero>
        <h1>당신만의 글을 남겨보세요</h1>
        <p>
          Your log는 글을 쓰고, 태그로 정리하고, 다시 꺼내 읽는 가장 단순한
          방법입니다. 가입하고 첫 글을 남겨보세요.
        </p>
        <CtaRow>
          {user ? (
            <PrimaryCta to="/posts">글 목록 보러가기</PrimaryCta>
          ) : (
            <>
              <PrimaryCta to="/register">시작하기</PrimaryCta>
              <SecondaryCta to="/login">로그인</SecondaryCta>
            </>
          )}
        </CtaRow>
      </Hero>
    </>
  );
};

export default LandingPage;
