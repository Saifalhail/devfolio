import React from 'react';
import styled from 'styled-components';

const IconButtonWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '32px'};
  height: ${props => props.size || '32px'};
  background: transparent;
  border: none;
  color: ${props => props.color || '#777'};
  font-size: ${props => props.fontSize || '1rem'};
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 2px;
  padding: 0;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(1);
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
      {...rest}
    >
      {icon}
    </IconButtonWrapper>
  );
};

export default IconButton;
