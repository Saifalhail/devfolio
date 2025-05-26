import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { colors, spacing, borderRadius, shadows, zIndex, mixins, typography, transitions } from '../../styles/GlobalTheme';
import { fadeIn, slideUp, slideDown, pulse } from '../../styles/animations';

/**
 * Reusable modal component with advanced animations and RTL support.
 * Supports various sizes, themes, and entrance/exit animations.
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Callback when modal requests to close
 * @param {React.ReactNode} children - Modal body content
 * @param {string} title - Optional modal title
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl', or 'full'
 * @param {string} theme - Modal theme: 'default', 'dark', 'light', 'accent'
 * @param {boolean} centered - Whether the modal content is centered vertically
 * @param {boolean} closeOnClickOutside - Whether clicking outside the modal closes it
 * @param {React.ReactNode} footer - Optional footer content
 * @param {string} animation - Animation type: 'slide', 'fade', 'zoom', or 'none'
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  theme = 'default',
  centered = false,
  closeOnClickOutside = true,
  footer,
  animation = 'slide'
}) => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const containerRef = useRef();
  const [isClosing, setIsClosing] = useState(false);
  const [animationState, setAnimationState] = useState('opening');

  useEffect(() => {
    if (!isOpen) return;
    
    setAnimationState('opening');
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    const handleClick = (e) => {
      if (closeOnClickOutside && containerRef.current && !containerRef.current.contains(e.target)) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClick);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClick);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, closeOnClickOutside]);
  
  useEffect(() => {
    if (isClosing) {
      setAnimationState('closing');
      const timer = setTimeout(() => {
        onClose && onClose();
        setIsClosing(false);
        setAnimationState('closed');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);
  
  const handleClose = () => {
    setIsClosing(true);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <Overlay 
      isRTL={isRTL} 
      animation={animation}
      animationState={animationState}
      data-testid="modal-overlay"
    >
      <Container 
        ref={containerRef} 
        isRTL={isRTL}
        size={size}
        theme={theme}
        centered={centered}
        animation={animation}
        animationState={animationState}
      >
        <CloseButton 
          onClick={handleClose} 
          isRTL={isRTL} 
          aria-label={t('close', 'Close')}
        >
          <FaTimes />
        </CloseButton>
        
        {title && <Header theme={theme}>{title}</Header>}
        
        <Content>{children}</Content>
        
        {footer && <Footer theme={theme}>{footer}</Footer>}
      </Container>
    </Overlay>
  );
};

const zoomIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const zoomOut = keyframes`
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.95); opacity: 0; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: ${props => props.centered ? 'center' : 'flex-start'};
  z-index: ${zIndex.modal};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  padding: 1rem;
  overflow-y: auto;
  
  ${props => {
    if (props.animationState === 'opening') {
      return css`animation: ${fadeIn} 0.3s ease forwards;`;
    } else if (props.animationState === 'closing') {
      return css`animation: ${fadeOut} 0.3s ease forwards;`;
    }
    return '';
  }}
`;

const Container = styled.div`
  background: ${props => {
    switch(props.theme) {
      case 'dark': return colors.background.secondary;
      case 'light': return '#ffffff';
      case 'accent': return colors.background.accent;
      default: return colors.background.primary;
    }
  }};
  color: ${props => {
    switch(props.theme) {
      case 'light': return '#333333';
      default: return colors.text.primary;
    }
  }};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.lg};
  width: 100%;
  max-width: ${props => {
    switch(props.size) {
      case 'sm': return '400px';
      case 'md': return '550px';
      case 'lg': return '750px';
      case 'xl': return '950px';
      case 'full': return '95%';
      default: return '550px';
    }
  }};
  max-height: ${props => props.size === 'full' ? '95%' : '85vh'};
  padding: ${spacing.lg};
  position: relative;
  margin: ${props => props.centered ? 'auto' : `${spacing.xl} auto`};
  overflow-y: auto;
  
  ${props => {
    if (props.animationState === 'opening') {
      switch(props.animation) {
        case 'fade': return css`animation: ${fadeIn} 0.3s ease forwards;`;
        case 'zoom': return css`animation: ${zoomIn} 0.3s ease forwards;`;
        case 'none': return css``;
        default: return css`animation: ${slideDown} 0.3s ease forwards;`;
      }
    } else if (props.animationState === 'closing') {
      switch(props.animation) {
        case 'fade': return css`animation: ${fadeOut} 0.3s ease forwards;`;
        case 'zoom': return css`animation: ${zoomOut} 0.3s ease forwards;`;
        case 'none': return css``;
        default: return css`animation: ${slideUp} 0.3s ease forwards;`;
      }
    }
    return '';
  }}
  
  @media (max-width: 768px) {
    width: 95%;
    padding: ${spacing.md};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${spacing.sm};
  right: ${props => props.isRTL ? 'auto' : spacing.sm};
  left: ${props => props.isRTL ? spacing.sm : 'auto'};
  background: rgba(0, 0, 0, 0.1);
  border: none;
  color: ${colors.text.primary};
  font-size: ${typography.fontSizes.md};
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: ${borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${transitions.medium};
  z-index: 5;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(90deg);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colors.accent.primary};
  }
`;

const Header = styled.h2`
  margin: 0 0 ${spacing.md} 0;
  font-size: ${typography.fontSizes.xl};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${props => props.theme === 'light' ? colors.text.dark : colors.text.primary};
  padding-bottom: ${spacing.sm};
  border-bottom: 1px solid ${props => props.theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${colors.gradients.accent};
    border-radius: ${borderRadius.sm};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    &:after {
      left: auto;
      right: 0;
    }
  }
`;

const Content = styled.div`
  margin: ${spacing.md} 0;
  
  /* Allow custom scrollbars for long content */
  max-height: ${props => props.maxHeight || 'none'};
  overflow-y: ${props => props.maxHeight ? 'auto' : 'visible'};
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: ${borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: ${borderRadius.sm};
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: ${spacing.lg};
  padding-top: ${spacing.md};
  border-top: 1px solid ${props => props.theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'};
  gap: ${spacing.md};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    
    button {
      width: 100%;
    }
    
    /* RTL Support */
    [dir="rtl"] & {
      flex-direction: column;
    }
  }
`;

export default Modal;
