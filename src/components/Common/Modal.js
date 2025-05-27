import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { colors, spacing, borderRadius, shadows, zIndex, mixins, typography, transitions } from '../../styles/GlobalTheme';
import { fadeIn, slideUp, slideDown, pulse } from '../../styles/animations';

/**
 * Reusable modal component with advanced animations and RTL support.
 * Supports various sizes, themes, and entrance/exit animations.
 * Uses React Portal to ensure it appears above all other elements.
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
  const [modalRoot, setModalRoot] = useState(null);

  // Create or find the modal root element
  useEffect(() => {
    let root = document.getElementById('modal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'modal-root';
      root.style.position = 'fixed';
      root.style.top = '0';
      root.style.left = '0';
      root.style.width = '100%';
      root.style.height = '100%';
      root.style.zIndex = '9999999'; // Very high z-index
      root.style.pointerEvents = 'none';
      document.body.appendChild(root);
    }
    setModalRoot(root);

    return () => {
      // Only remove if we created it and no other modals are open
      if (document.getElementById('modal-root') && document.getElementById('modal-root').childElementCount === 0) {
        document.body.removeChild(root);
      }
    };
  }, []);

  // Handle body scrolling and keyboard events
  useEffect(() => {
    if (!isOpen) return;
    
    setAnimationState('opening');
    
    // Prevent body scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  const handleClose = () => {
    if (isClosing) return;
    
    setIsClosing(true);
    setAnimationState('closing');
    
    // Add a small delay to allow the closing animation to complete
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Match this with the animation duration
  };

  const handleOverlayClick = (e) => {
    if (!closeOnClickOutside) return;
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      handleClose();
    }
  };

  if (!isOpen && !isClosing || !modalRoot) return null;

  // Use createPortal to render the modal outside the normal DOM hierarchy
  return createPortal(
    <ModalWrapper>
      <Overlay 
        onClick={handleOverlayClick} 
        isRTL={isRTL}
        animationState={animationState}
      >
        <Container 
          ref={containerRef} 
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
    </ModalWrapper>,
    modalRoot
  );
};

// Modal wrapper to create a new stacking context
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999999;
  pointer-events: auto;
  isolation: isolate;
`;

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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  overflow: hidden;
  backdrop-filter: blur(5px);
  pointer-events: auto;
  
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
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  width: 90%;
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
  height: auto;
  max-height: 85vh;
  padding: ${spacing.xl};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  
  /* Ensure modal is centered and properly positioned */
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transform: translateY(0);
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: ${borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: ${borderRadius.sm};
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    width: 95%;
    padding: ${spacing.md};
    max-height: 85vh;
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
  
  /* Improved scrolling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: ${borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: ${borderRadius.sm};
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
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
  top: ${spacing.md};
  right: ${props => props.isRTL ? 'auto' : spacing.md};
  left: ${props => props.isRTL ? spacing.md : 'auto'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  transition: ${transitions.medium};
  
  /* Explicitly remove any potential background or decoration */
  &::before, &::after {
    display: none;
  }
  
  /* Icon sizing */
  svg {
    font-size: 1.25rem;
    color: ${colors.text.secondary};
  }
  
  /* Hover effect */
  &:hover {
    transform: rotate(90deg);
    background: transparent;
    
    svg {
      color: ${colors.text.primary};
    }
  }
  &:focus {
    outline: none;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Header = styled.h2`
  margin: 0 0 ${spacing.lg} 0;
  font-size: ${typography.fontSizes.xl};
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.text.primary};
  padding-bottom: ${spacing.md};
  border-bottom: 1px solid rgba(255,255,255,0.1);
  position: relative;
  text-align: left;
  letter-spacing: 0.5px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 60px;
    height: 2px;
    background: ${colors.accent.primary};
    border-radius: ${borderRadius.sm};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    text-align: center;
  }
`;

const Content = styled.div`
  margin: ${spacing.md} 0;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  
  /* Ensure form elements are properly aligned */
  input, textarea, select {
    width: 100%;
    padding: ${spacing.sm};
    margin-bottom: ${spacing.md};
    background: ${colors.background.secondary};
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: ${borderRadius.md};
    color: ${colors.text.primary};
    font-size: ${typography.fontSizes.sm};
    
    &:focus {
      outline: none;
      border-color: ${colors.accent.primary};
    }
    
    /* RTL Support */
    [dir="rtl"] & {
      text-align: right;
    }
  }
  
  label {
    display: block;
    margin-bottom: ${spacing.xs};
    color: ${colors.text.secondary};
    font-size: ${typography.fontSizes.sm};
    
    /* RTL Support */
    [dir="rtl"] & {
      text-align: right;
    }
  }
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: ${borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: ${borderRadius.sm};
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    padding-right: ${spacing.xs};
  }
  
  /* RTL scrollbar positioning */
  [dir="rtl"] & {
    padding-right: 0;
    padding-left: ${spacing.xs};
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
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
    flex-direction: column-reverse;
    align-items: stretch;
    gap: ${spacing.sm};
    
    button {
      width: 100%;
      margin-bottom: ${spacing.sm};
    }
    
    /* RTL Support */
    [dir="rtl"] & {
      flex-direction: column-reverse;
    }
  }
`;

export default Modal;
