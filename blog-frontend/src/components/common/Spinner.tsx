import React from 'react';
import styled, { keyframes } from 'styled-components';
import palette from '../../lib/styles/palette';

// 회전 keyframes
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

interface SpinnerProps {
  size?: number;
  thickness?: number;
  color?: string;
}

const SpinnerCircle = styled.div<Required<SpinnerProps>>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border: ${(p) => p.thickness}px solid ${palette.gray[2]};
  border-top-color: ${(p) => p.color};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Spinner: React.FC<SpinnerProps> = ({
  size = 28,
  thickness = 3,
  color = palette.cyan[5],
}) => <SpinnerCircle size={size} thickness={thickness} color={color} />;

export default Spinner;
