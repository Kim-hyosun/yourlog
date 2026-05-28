import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';

// styled-components 콜백 안에서 참조하는 커스텀 props 타입.
// cyan은 기존 코드가 Link로 갈 때 1/0 숫자로 변환해 넘기므로 number도 허용.
interface StyledProps {
  fullWidth?: boolean;
  cyan?: boolean | number;
}

const buttonStyle = css<StyledProps>`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  color: white;
  outline: none;
  cursor: pointer;

  background: ${palette.gray[8]};
  &:hover {
    background: ${palette.gray[6]};
  }

  ${(props) =>
    props.fullWidth &&
    css`
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      width: 100%;
      font-size: 1.125rem;
    `}

  ${(props) =>
    props.cyan &&
    css`
      background: ${palette.cyan[5]};
      &:hover {
        background: ${palette.cyan[4]};
      }
    `}

    &:disabled {
    background: ${palette.gray[3]};
    color: ${palette.gray[5]};
    cursor: not-allowed;
  }
`;

const StyledButton = styled.button<StyledProps>`
  ${buttonStyle}
`;

const StyledLink = styled(Link)<StyledProps>`
  ${buttonStyle}
`;

// to가 있으면 Link로, 없으면 button으로 렌더. 두 갈래의 HTML 속성을 모두
// 받는 대신 공통/링크/버튼 전용을 명시적으로 분리해 잘못된 prop 전달을 막는다.
type ButtonProps = StyledProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: string;
    children?: React.ReactNode;
  };

const Button: React.FC<ButtonProps> = (props) => {
  const { to, cyan, fullWidth, children, ...rest } = props;
  if (to) {
    // Link는 disabled/type 등 button HTML 속성을 받지 않으므로 rest는 떨어뜨림.
    return (
      <StyledLink to={to} cyan={cyan ? 1 : 0} fullWidth={fullWidth}>
        {children}
      </StyledLink>
    );
  }
  return (
    <StyledButton cyan={cyan} fullWidth={fullWidth} {...rest}>
      {children}
    </StyledButton>
  );
};

export default Button;
