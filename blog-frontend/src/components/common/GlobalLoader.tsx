import React from 'react';
import styled from 'styled-components';
import Spinner from './Spinner';

// 앱 첫 부팅 시 세션 확인(check) 동안 깜빡임 없이 전체 화면을 덮는 로더.
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  z-index: 9999;
`;

const GlobalLoader: React.FC = () => (
  <Overlay>
    <Spinner size={40} thickness={4} />
  </Overlay>
);

export default GlobalLoader;
