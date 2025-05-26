import React from 'react';
import styled from 'styled-components';
import { shimmer } from '../../styles/animations';
import { colors } from '../../styles/GlobalTheme';

/**
 * SkeletonLoader shows a shimmering placeholder while content loads.
 * width and height can be customized. Set circle to true for circular shapes.
 */
const Skeleton = styled.div`
  display: inline-block;
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '1rem'};
  border-radius: ${({ circle }) => (circle ? '50%' : '4px')};
  background-color: ${colors.background.card};
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0px,
    rgba(255, 255, 255, 0.15) 40px,
    rgba(255, 255, 255, 0.05) 80px
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

const SkeletonLoader = ({ width, height, circle, style }) => (
  <Skeleton width={width} height={height} circle={circle} style={style} />
);

export default SkeletonLoader;
