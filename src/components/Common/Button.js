import React from 'react';
import styled, { css } from 'styled-components';
import { rtl } from '../../utils/rtl';

/**
 * Reusable Button component with different variants and sizes
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, outline, text, danger)
 * @param {string} [props.size='medium'] - Button size (small, medium, large)
 * @param {boolean} [props.fullWidth=false] - Whether the button should take full width
 * @param {boolean} [props.active=false] - Whether the button is in active state
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {React.ReactNode} [props.leftIcon] - Icon to display on the left side
 * @param {React.ReactNode} [props.rightIcon] - Icon to display on the right side
 * @param {string} [props.type='button'] - Button type attribute
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  active = false,
  disabled = false,
  leftIcon,
  rightIcon,
  type = 'button',
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      active={active}
      disabled={disabled}
      type={type}
      {...props}
    >
      {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
      {children && <span>{children}</span>}
      {rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
    </StyledButton>
  );
};

// Button variants
const variantStyles = {
  primary: css`
    background: linear-gradient(90deg, #513a52, #3d2c3d);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: linear-gradient(90deg, #3d2c3d, #2a1f2a);
      transform: translateY(-2px);
      box-shadow: 0 6px 10px rgba(81, 58, 82, 0.3);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(81, 58, 82, 0.2);
    }
  `,
  secondary: css`
    background: linear-gradient(90deg, #82a1bf, #6889a8);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: linear-gradient(90deg, #6889a8, #567891);
      transform: translateY(-2px);
      box-shadow: 0 6px 10px rgba(104, 137, 168, 0.3);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(104, 137, 168, 0.2);
    }
  `,
  accent: css`
    background: linear-gradient(90deg, #faaa93, #e88c76);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: linear-gradient(90deg, #e88c76, #d67e69);
      transform: translateY(-2px);
      box-shadow: 0 6px 10px rgba(250, 170, 147, 0.3);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(250, 170, 147, 0.2);
    }
  `,
  outline: css`
    background: transparent;
    color: #513a52;
    border: 1px solid #513a52;
    
    &:hover:not(:disabled) {
      background: rgba(81, 58, 82, 0.05);
      transform: translateY(-2px);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  text: css`
    background: transparent;
    color: #513a52;
    border: none;
    padding: 0.5rem 0.75rem;
    
    &:hover:not(:disabled) {
      background: rgba(81, 58, 82, 0.05);
      transform: translateY(-2px);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  danger: css`
    background: linear-gradient(90deg, #e74c3c, #c0392b);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: linear-gradient(90deg, #c0392b, #a33025);
      transform: translateY(-2px);
      box-shadow: 0 6px 10px rgba(231, 76, 60, 0.3);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(231, 76, 60, 0.2);
    }
  `,
  filter: css`
    background-color: ${props => props.active ? '#513a52' : '#f7f9fc'};
    color: ${props => props.active ? 'white' : '#513a52'};
    border: none;
    
    &:hover:not(:disabled) {
      background-color: ${props => props.active ? '#3d2c3d' : '#edf1f7'};
    }
  `,
  tag: css`
    background-color: ${props => props.active ? '#513a52' : '#f7f9fc'};
    color: ${props => props.active ? 'white' : '#513a52'};
    border: none;
    border-radius: 20px;
    
    &:hover:not(:disabled) {
      background-color: ${props => props.active ? '#3d2c3d' : '#edf1f7'};
    }
  `,
  action: css`
    background-color: ${props => props.active ? '#513a52' : '#f7f9fc'};
    color: ${props => {
      if (props.danger) return '#e74c3c';
      if (props.active) return 'white';
      return '#513a52';
    }};
    border: none;
    width: 32px;
    height: 32px;
    padding: 0;
    
    &:hover:not(:disabled) {
      background-color: ${props => {
        if (props.danger) return 'rgba(231, 76, 60, 0.15)';
        if (props.active) return '#3d2c3d';
        return '#edf1f7';
      }};
      transform: translateY(-2px);
    }
  `,
  icon: css`
    background: none;
    color: ${props => props.danger ? '#e74c3c' : '#513a52'};
    border: none;
    padding: 0;
    width: auto;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: none;
    font-size: 1.2rem;
    
    &:hover:not(:disabled) {
      color: ${props => props.danger ? '#c0392b' : '#3d2c3d'};
      transform: translateY(-1px);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `
};

// Button sizes
const sizeStyles = {
  small: css`
    padding: ${props => props.variant === 'action' ? '0' : '0.5rem 0.75rem'};
    font-size: 0.8rem;
  `,
  medium: css`
    padding: ${props => props.variant === 'action' ? '0' : '0.75rem 1.25rem'};
    font-size: 0.9rem;
  `,
  large: css`
    padding: ${props => props.variant === 'action' ? '0' : '0.9rem 1.5rem'};
    font-size: 1rem;
  `
};

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  box-shadow: ${props => 
    props.variant === 'text' || props.variant === 'outline' 
      ? 'none' 
      : '0 4px 6px rgba(0, 0, 0, 0.1)'
  };
  
  ${props => variantStyles[props.variant]}
  ${props => sizeStyles[props.size]}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  &:focus {
    outline: none;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;

  ${props => props.position === 'left' && css`
    margin-right: ${props.children ? '0.25rem' : '0'};
    ${rtl`margin-left: ${props.children ? '0.25rem' : '0'}; margin-right: 0;`}
  `}

  ${props => props.position === 'right' && css`
    margin-left: ${props.children ? '0.25rem' : '0'};
    ${rtl`margin-right: ${props.children ? '0.25rem' : '0'}; margin-left: 0;`}
  `}
`;

export default Button;
