import React from 'react';
import styled from 'styled-components';

const ResponsiveBlock = styled.div`
  padding: 0 1rem 0 1rem;
  width: 1024px;
  margin: 0 auto; /* 중앙정렬 */

  /* 브라우저크기에 따라 가로크기 변경 */
  @media (max-width: 1024px) {
    width: 768px;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

// style/className/onClick 등 일반 div 속성도 모두 받을 수 있도록 ...rest로 위임.
type ResponsiveProps = React.HTMLAttributes<HTMLDivElement>;

const Responsive: React.FC<ResponsiveProps> = ({ children, ...rest }) => {
  return <ResponsiveBlock {...rest}>{children}</ResponsiveBlock>;
};

export default Responsive;
