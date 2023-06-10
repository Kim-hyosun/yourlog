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

const Responsive = ({ children, ...rest }) => {
  //style, className, onClick, onMouseMove등의 props를 사용 할 수있도록
  //...rest를 사용하여 ResponsiveBlock에 전달
  return <ResponsiveBlock {...rest}>{children}</ResponsiveBlock>;
};

export default Responsive;
