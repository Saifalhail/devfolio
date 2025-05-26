import React from 'react';
import styled from 'styled-components';

const IconButtonWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  background: transparent;
  border: none;
  color: ${props => props.color || '#777'};
  font-size: ${props => props.fontSize || '1rem'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin: 0 2px;
  padding: 0;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: ${props => props.withBg ? `${props.color}15` : 'transparent'};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s ease, height 0.4s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-2px);

    &:before {
      width: ${props => (props.withBg ? '150%' : '0')};
      height: ${props => (props.withBg ? '150%' : '0')};
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.15);
  }
`;

const IconButton = ({
  icon,
  title,
  color,
  size,
  fontSize,
  onClick,
  className,
  withBg = false,
  ...rest
}) => {
  return (
    <IconButtonWrapper
      as="span"
      title={title}
      color={color}
      size={size}
      fontSize={fontSize}
      onClick={onClick}
      className={className}
      withBg={withBg}
      {...rest}
    >
      {icon}
    </IconButtonWrapper>
  );
};

export default IconButton;
