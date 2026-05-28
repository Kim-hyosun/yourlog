import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from './Button';
import Responsive from './Responsive';
import palette from '../../lib/styles/palette';
import type { User } from '../../types/models';

// 상단 고정 헤더. 로그인 여부에 따라 우측 영역만 바뀐다.
const HeaderBlock = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: saturate(180%) blur(8px);
  border-bottom: 1px solid ${palette.gray[2]};
  z-index: 100;
`;

const Wrapper = styled(Responsive)`
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${palette.gray[9]};
    text-decoration: none;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
`;

const UserName = styled.span`
  font-weight: 600;
  color: ${palette.gray[8]};
`;

// 고정 헤더 아래 본문이 가려지지 않도록 공간 확보.
const Spacer = styled.div`
  height: 4rem;
`;

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <>
      <HeaderBlock>
        <Wrapper>
          <Link to={user ? '/posts' : '/'} className="logo">
            Your log
          </Link>
          {user ? (
            <div className="right">
              <UserName>{user.username}</UserName>
              <Button onClick={onLogout}>로그아웃</Button>
            </div>
          ) : (
            <div className="right">
              <Button to="/login">로그인</Button>
            </div>
          )}
        </Wrapper>
      </HeaderBlock>
      <Spacer />
    </>
  );
};

export default Header;
