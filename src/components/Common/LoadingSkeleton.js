import React from 'react';
import styled, { keyframes } from 'styled-components';

// LoadingSkeleton displays a shimmering placeholder while data is loading.
// width and height can be customized. Set circle to true for a circular shape.
const shimmer = keyframes`
  0% { background-position: -450px 0; }
  100% { background-position: 450px 0; }
`;

const Skeleton = styled.div`
  display: inline-block;
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '1rem'};
  border-radius: ${({ circle }) => (circle ? '50%' : '4px')};
  background-color: #513a52;
  background-image: linear-gradient(
    90deg,
    rgba(81, 58, 82, 0.3) 0px,
    rgba(123, 44, 191, 0.6) 40px,
    rgba(81, 58, 82, 0.3) 80px
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

const LoadingSkeleton = ({ width, height, circle, style }) => (
  <Skeleton width={width} height={height} circle={circle} style={style} />
);

export default LoadingSkeleton;
