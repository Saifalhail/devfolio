import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { colors, spacing, borderRadius, shadows, zIndex, mixins, typography, transitions } from '../../styles/GlobalTheme';
import { fadeIn, slideUp, slideDown, pulse } from '../../styles/animations';

/**
 * Enhanced reusable modal component with advanced animations, RTL support, and theme-based styling.
 * Supports various sizes, themes, and entrance/exit animations.
 * Uses React Portal to ensure it appears above all other elements.
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Callback when modal requests to close
 * @param {React.ReactNode} children - Modal body content
 * @param {string} title - Optional modal title
 * @param {React.ReactNode} icon - Optional icon to display next to the title
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl', or 'full'
 * @param {string} theme - Modal theme: 'default', 'todo', 'doing', 'done', 'blocked', 'light'
 * @param {boolean} centered - Whether the modal content is centered vertically
 * @param {boolean} closeOnClickOutside - Whether clicking outside the modal closes it
 * @param {React.ReactNode} footer - Optional footer content
 * @param {string} className - Optional additional CSS class for custom styling
 * @param {boolean} hideCloseButton - Whether to hide the close button
 * @param {function} onAfterClose - Callback after modal has closed and animations completed
 * @param {boolean} preventBodyScroll - Whether to prevent body scrolling when modal is open
 * @param {boolean} fullScreenOnMobile - Whether to display the modal in full screen on mobile devices
 * @param {object} customStyles - Custom styles to apply to the modal container
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  icon,
  size = 'md',
  theme = 'default',
  animation = 'fade',
  centered = false,
  closeOnClickOutside = true,
  footer,
  className,
  hideCloseButton = false,
  onAfterClose = () => {},
  preventBodyScroll = true,
  fullScreenOnMobile = false,
  customStyles = {}
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
      document.body.appendChild(root);
    }
    setModalRoot(root);

    return () => {
      // Clean up only if we created the modal root
      if (root && root.childElementCount === 0) {
        document.body.removeChild(root);
      }
    };
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen && preventBodyScroll) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, preventBodyScroll]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      onAfterClose(); // Call the after close callback
    }, 300); // Match this with the animation duration
  };

  const handleOverlayClick = (e) => {
    if (!closeOnClickOutside) return;
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      handleClose();
    }
  };

  if ((!isOpen && !isClosing) || !modalRoot) return null;

  // Render the header with optional icon
  const renderHeader = () => {
    if (!title) return null;

    return (
      <Header theme={theme} className="modal-header" isRTL={isRTL}>
        {icon && <IconContainer className="header-icon" isRTL={isRTL}>{icon}</IconContainer>}
        <span className="header-title">{title}</span>
      </Header>
    );
  };
  
  // Styled component for icon container
  const IconContainer = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: ${props => props.isRTL ? '0' : spacing.sm};
    margin-left: ${props => props.isRTL ? spacing.sm : '0'};
  `;

  // Use createPortal to render the modal outside the normal DOM hierarchy
  return createPortal(
    <ModalWrapper className={className}>
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
          isRTL={isRTL}
          fullScreenOnMobile={fullScreenOnMobile}
          style={customStyles}
          className={className}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {!hideCloseButton && (
            <CloseButton 
              onClick={handleClose} 
              isRTL={isRTL} 
              theme={theme}
              className="modal-close-button"
              aria-label={t('close', 'Close')}
            >
              <FaTimes />
            </CloseButton>
          )}
          
          {renderHeader()}
          
          <Content theme={theme}>{children}</Content>
          
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
  background: rgba(30, 30, 50, 0.98); /* Lighter background for better visibility */
  color: ${props => {
    switch(props.theme) {
      case 'light': return '#f0f0f0';
      default: return colors.text.primary;
    }
  }};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
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
  padding: ${spacing.md} ${spacing.lg} ${spacing.md} ${spacing.lg};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs}; /* Reduced spacing between items */
  
  /* Ensure modal is centered and properly positioned */
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  overflow: hidden;
  transform: translateY(0);
  
  /* Enhanced background effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -2;
    background: ${props => {
      switch(props.theme) {
        case 'todo': return 'linear-gradient(135deg, rgba(131, 56, 236, 0.08) 0%, rgba(106, 31, 208, 0.02) 100%)';
        case 'doing': return 'linear-gradient(135deg, rgba(255, 177, 0, 0.08) 0%, rgba(247, 184, 1, 0.02) 100%)';
        case 'done': return 'linear-gradient(135deg, rgba(0, 194, 122, 0.08) 0%, rgba(0, 179, 113, 0.02) 100%)';
        case 'blocked': return 'linear-gradient(135deg, rgba(208, 31, 72, 0.08) 0%, rgba(239, 71, 111, 0.02) 100%)';
        default: return 'linear-gradient(135deg, rgba(131, 56, 236, 0.08) 0%, rgba(106, 31, 208, 0.02) 100%)';
      }
    }};
  }
  
  /* Subtle starry background effect - much more blurred and less visible */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 1px, transparent 2px),
      radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.08) 1px, transparent 2px),
      radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.06) 1px, transparent 2px),
      radial-gradient(circle at 15% 60%, rgba(255, 255, 255, 0.08) 1px, transparent 2px),
      radial-gradient(circle at 65% 20%, rgba(255, 255, 255, 0.06) 1px, transparent 2px),
      radial-gradient(circle at 90% 40%, rgba(255, 255, 255, 0.1) 1px, transparent 2px),
      radial-gradient(circle at 30% 95%, rgba(255, 255, 255, 0.08) 1px, transparent 2px),
      radial-gradient(circle at 85% 60%, rgba(255, 255, 255, 0.06) 1px, transparent 2px),
      radial-gradient(circle at 40% 50%, rgba(255, 255, 255, 0.07) 1px, transparent 2px);
    background-size: 150px 150px; /* Larger spacing between stars */
    opacity: 0.3; /* Much lower opacity */
    filter: blur(1px); /* Add blur effect to stars */
    animation: subtleTwinkle 12s infinite alternate;
  }
  
  @keyframes subtleTwinkle {
    0% { opacity: 0.2; }
    50% { opacity: 0.3; }
    100% { opacity: 0.4; }
  }
  
  /* Add glow effect based on theme */
  ${props => {
    switch(props.theme) {
      case 'todo':
        return css`
          box-shadow: 0 0 20px rgba(106, 31, 208, 0.25);
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: linear-gradient(to bottom, #6a1fd0, #8338ec);
          }
        `;
      case 'doing':
        return css`
          box-shadow: 0 0 20px rgba(255, 177, 0, 0.25);
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: linear-gradient(to bottom, #ffb100, #f7b801);
          }
        `;
      case 'done':
        return css`
          box-shadow: 0 0 20px rgba(0, 194, 122, 0.25);
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: linear-gradient(to bottom, #00c27a, #00b371);
          }
        `;
      case 'blocked':
        return css`
          box-shadow: 0 0 20px rgba(208, 31, 72, 0.25);
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: linear-gradient(to bottom, #d01f48, #ef476f);
          }
        `;
      default:
        return css`
          box-shadow: 0 0 20px rgba(131, 56, 236, 0.25);
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: linear-gradient(to bottom, #8338ec, #6a1fd0);
          }
        `;
    }
  }}
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    width: 95%;
    max-width: 95%;
    margin: ${spacing.lg} auto;
  }
  
  @media (max-width: 480px) {
    width: ${props => props.fullScreenOnMobile ? '100%' : '95%'};
    height: ${props => props.fullScreenOnMobile ? '100%' : 'auto'};
    max-height: ${props => props.fullScreenOnMobile ? '100vh' : '90vh'};
    border-radius: ${props => props.fullScreenOnMobile ? '0' : borderRadius.md};
    padding: ${spacing.sm};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
    direction: rtl;
    &::before {
      left: auto;
      right: 0;
    }
    
    /* Close button will be positioned on the left in RTL mode */
    .modal-close-button {
      left: ${spacing.md};
      right: auto;
    }
    
    /* Header styling for RTL */
    .modal-header {
      flex-direction: row-reverse;
    }
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0;
  margin: 0;
  box-shadow: ${shadows.sm};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  transition: ${transitions.medium};
  z-index: 10;
  
  /* Explicitly remove any potential background or decoration */
  &::before, &::after {
    display: none;
  }
  
  /* Icon sizing */
  svg {
    font-size: 1.25rem;
    color: ${props => {
      switch(props.theme) {
        case 'todo': return '#8338ec';
        case 'doing': return '#ffb100';
        case 'done': return '#00c27a';
        case 'blocked': return '#d01f48';
        default: return '#8338ec';
      }
    }};
  }
  
  /* Hover effect */
  &:hover {
    transform: rotate(90deg) scale(1.1);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: ${shadows.md};
    
    svg {
      color: ${props => {
        switch(props.theme) {
          case 'todo': return '#a56eff';
          case 'doing': return '#ffc940';
          case 'done': return '#4cdfaa';
          case 'blocked': return '#ff4d7a';
          default: return '#a56eff';
        }
      }};
    }
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => {
      switch(props.theme) {
        case 'todo': return 'rgba(131, 56, 236, 0.5)';
        case 'doing': return 'rgba(255, 177, 0, 0.5)';
        case 'done': return 'rgba(0, 194, 122, 0.5)';
        case 'blocked': return 'rgba(208, 31, 72, 0.5)';
        default: return 'rgba(131, 56, 236, 0.5)';
      }
    }};
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    top: ${spacing.sm};
    right: ${props => props.isRTL ? 'auto' : spacing.sm};
    left: ${props => props.isRTL ? spacing.sm : 'auto'};
  }
  

  
  /* RTL Support */
  [dir="rtl"] & {
    text-align: center;
  }
`;

const Content = styled.div`
  margin: 0;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  position: relative;
  padding: ${spacing.xs} 0;
  
  /* Ensure form elements are properly aligned */
  input, textarea, select {
    width: 100%;
    padding: ${spacing.sm};
    margin-bottom: ${spacing.xs};
    background: rgba(40, 40, 70, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: ${borderRadius.md};
    color: ${colors.text.primary};
    font-size: ${typography.fontSizes.md};
    transition: all 0.2s ease;
    height: auto;
    min-height: ${props => props.type === 'textarea' ? '100px' : 'auto'};
    
    &:focus {
      outline: none;
      border-color: ${props => {
        switch(props.theme) {
          case 'todo': return '#8338ec';
          case 'doing': return '#ffb100';
          case 'done': return '#00c27a';
          case 'blocked': return '#d01f48';
          default: return '#8338ec';
        }
      }};
      box-shadow: 0 0 0 1px ${props => {
        switch(props.theme) {
          case 'todo': return 'rgba(131, 56, 236, 0.3)';
          case 'doing': return 'rgba(255, 177, 0, 0.3)';
          case 'done': return 'rgba(0, 194, 122, 0.3)';
          case 'blocked': return 'rgba(208, 31, 72, 0.3)';
          default: return 'rgba(131, 56, 236, 0.3)';
        }
      }};
      background: rgba(50, 50, 90, 0.8);
    }
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    
    /* RTL Support */
    [dir="rtl"] & {
      text-align: right;
    }
  }
  
  /* Textarea specific styling */
  textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  label {
    display: block;
    margin-bottom: ${spacing.xs};
    color: rgba(255, 255, 255, 0.9);
    font-size: ${typography.fontSizes.lg};
    font-weight: ${typography.fontWeights.semibold};
    letter-spacing: 0.5px;
    
    /* Add subtle gradient effect to labels */
    background: ${props => {
      switch(props.theme) {
        case 'todo': return 'linear-gradient(90deg, rgba(255, 255, 255, 0.95), rgba(131, 56, 236, 0.8))';
        case 'doing': return 'linear-gradient(90deg, rgba(255, 255, 255, 0.95), rgba(255, 177, 0, 0.8))';
        case 'done': return 'linear-gradient(90deg, rgba(255, 255, 255, 0.95), rgba(0, 194, 122, 0.8))';
        case 'blocked': return 'linear-gradient(90deg, rgba(255, 255, 255, 0.95), rgba(208, 31, 72, 0.8))';
        default: return 'linear-gradient(90deg, rgba(255, 255, 255, 0.95), rgba(131, 56, 236, 0.8))';
      }
    }};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
    /* RTL Support */
    [dir="rtl"] & {
      text-align: right;
    }
  }
  
  /* Form group styling */
  .form-group {
    margin-bottom: ${spacing.xs};
    position: relative;
  }
  
  /* Form row for side-by-side fields */
  .form-row {
    display: flex;
    gap: ${spacing.sm};
    margin-bottom: ${spacing.xs};
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: ${spacing.xs};
    }
    
    .form-group {
      flex: 1;
    }
  }
  
  /* Helper text styling */
  .helper-text {
    font-size: ${typography.fontSizes.sm};
    color: rgba(255, 255, 255, 0.5);
    margin-top: ${spacing.xs};
    margin-bottom: ${spacing.xs};
  }
  
  /* Error message styling */
  .error-message {
    font-size: ${typography.fontSizes.sm};
    color: #ff4d7a;
    margin-top: ${spacing.xs};
    font-weight: ${typography.fontWeights.medium};
  }
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.03);
    border-radius: ${borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: ${borderRadius.sm};
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
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

const Header = styled.h1`
  margin: 0 0 ${spacing.lg};
  font-size: 2rem; /* Significantly larger size */
  font-weight: ${typography.fontWeights.bold};
  padding-bottom: ${spacing.md};
  padding-right: ${props => props.isRTL ? '0' : '50px'}; /* Add padding to prevent overlap with close button */
  padding-left: ${props => props.isRTL ? '50px' : '0'}; /* Add padding for RTL layout */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  display: flex;
  align-items: center;
  line-height: 1.2;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    padding-right: 40px;
    margin-top: ${spacing.xs};
  }
  
  ${props => {
    switch(props.theme) {
      case 'todo':
        return `
          background: linear-gradient(90deg, #fff, #8338ec);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(131, 56, 236, 0.3);
        `;
      case 'doing':
        return `
          background: linear-gradient(90deg, #fff, #ffb100);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(255, 177, 0, 0.3);
        `;
      case 'done':
        return `
          background: linear-gradient(90deg, #fff, #00c27a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(0, 194, 122, 0.3);
        `;
      case 'blocked':
        return `
          background: linear-gradient(90deg, #fff, #d01f48);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(208, 31, 72, 0.3);
        `;
      case 'light':
        return `color: #f0f0f0;`;
      default:
        return `
          background: linear-gradient(90deg, #fff, #8338ec);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(131, 56, 236, 0.3);
        `;
    }
  }}
  
  /* Icon alignment styles */
  .header-icon {
    margin-right: ${spacing.md};
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: 2px; /* Align icon with text */
    color: ${props => {
      switch(props.theme) {
        case 'todo': return '#8338ec';
        case 'doing': return '#ffb100';
        case 'done': return '#00c27a';
        case 'blocked': return '#d01f48';
        default: return '#8338ec';
      }
    }};
    
    [dir="rtl"] & {
      margin-right: 0;
      margin-left: ${spacing.md};
    }
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 120px; /* Wider underline */
    height: 2px;
    background: ${props => {
      switch(props.theme) {
        case 'todo': return 'linear-gradient(90deg, #8338ec, rgba(131, 56, 236, 0.1))';
        case 'doing': return 'linear-gradient(90deg, #ffb100, rgba(255, 177, 0, 0.1))';
        case 'done': return 'linear-gradient(90deg, #00c27a, rgba(0, 194, 122, 0.1))';
        case 'blocked': return 'linear-gradient(90deg, #d01f48, rgba(208, 31, 72, 0.1))';
        default: return 'linear-gradient(90deg, #8338ec, rgba(131, 56, 236, 0.1))';
      }
    }};
    border-radius: ${borderRadius.sm};
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
  }
  
  /* RTL Support handled directly with props instead of CSS selectors */
  &:after {
    left: ${props => props.isRTL ? 'auto' : '0'};
    right: ${props => props.isRTL ? '0' : 'auto'};
    background: ${props => {
      const direction = props.isRTL ? '270deg' : '90deg';
      switch(props.theme) {
        case 'todo': return `linear-gradient(${direction}, #8338ec, rgba(131, 56, 236, 0.1))`;
        case 'doing': return `linear-gradient(${direction}, #ffb100, rgba(255, 177, 0, 0.1))`;
        case 'done': return `linear-gradient(${direction}, #00c27a, rgba(0, 194, 122, 0.1))`;
        case 'blocked': return `linear-gradient(${direction}, #d01f48, rgba(208, 31, 72, 0.1))`;
        default: return `linear-gradient(${direction}, #8338ec, rgba(131, 56, 236, 0.1))`;
      }
    }};
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${spacing.xs};
  padding-top: ${spacing.xs};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  gap: ${spacing.sm};
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, 
      ${props => {
        switch(props.theme) {
          case 'todo': return 'rgba(131, 56, 236, 0.8), rgba(131, 56, 236, 0.05)';
          case 'doing': return 'rgba(255, 177, 0, 0.8), rgba(255, 177, 0, 0.05)';
          case 'done': return 'rgba(0, 194, 122, 0.8), rgba(0, 194, 122, 0.05)';
          case 'blocked': return 'rgba(208, 31, 72, 0.8), rgba(208, 31, 72, 0.05)';
          case 'light': return 'rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.02)';
          default: return 'rgba(131, 56, 236, 0.8), rgba(131, 56, 236, 0.05)';
        }
      }}    
    );
  }
  
  /* Add subtle glow effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => {
      switch(props.theme) {
        case 'todo': return 'radial-gradient(circle at 50% 0%, rgba(131, 56, 236, 0.08), transparent 70%)';
        case 'doing': return 'radial-gradient(circle at 50% 0%, rgba(255, 177, 0, 0.08), transparent 70%)';
        case 'done': return 'radial-gradient(circle at 50% 0%, rgba(0, 194, 122, 0.08), transparent 70%)';
        case 'blocked': return 'radial-gradient(circle at 50% 0%, rgba(208, 31, 72, 0.08), transparent 70%)';
        default: return 'radial-gradient(circle at 50% 0%, rgba(131, 56, 236, 0.08), transparent 70%)';
      }
    }};
    opacity: 0.5;
    z-index: -1;
  }
  
  /* Button spacing */
  button {
    margin-left: ${spacing.xs};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
    
    &::after {
      background: linear-gradient(270deg, 
        ${props => {
          switch(props.theme) {
            case 'todo': return 'rgba(131, 56, 236, 0.5), transparent';
            case 'doing': return 'rgba(255, 177, 0, 0.5), transparent';
            case 'done': return 'rgba(0, 194, 122, 0.5), transparent';
            case 'blocked': return 'rgba(208, 31, 72, 0.5), transparent';
            case 'light': return 'rgba(0, 0, 0, 0.1), transparent';
            default: return 'rgba(131, 56, 236, 0.5), transparent';
          }
        }}    
      );
    }
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

// Styled button component for modals
const ModalButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.sm} ${spacing.lg};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  gap: ${spacing.xs};
  position: relative;
  overflow: hidden;
  
  /* Primary button styling */
  ${props => props.primary && `
    background: ${props => {
      switch(props.theme) {
        case 'todo': return 'linear-gradient(135deg, #8338ec, #6a1fd0)';
        case 'doing': return 'linear-gradient(135deg, #ffb100, #f7b801)';
        case 'done': return 'linear-gradient(135deg, #00c27a, #00b371)';
        case 'blocked': return 'linear-gradient(135deg, #d01f48, #ef476f)';
        default: return 'linear-gradient(135deg, #8338ec, #6a1fd0)';
      }
    }};
    color: white;
    border: none;
    box-shadow: 0 4px 10px ${props => {
      switch(props.theme) {
        case 'todo': return 'rgba(131, 56, 236, 0.3)';
        case 'doing': return 'rgba(255, 177, 0, 0.3)';
        case 'done': return 'rgba(0, 194, 122, 0.3)';
        case 'blocked': return 'rgba(208, 31, 72, 0.3)';
        default: return 'rgba(131, 56, 236, 0.3)';
      }
    }};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px ${props => {
        switch(props.theme) {
          case 'todo': return 'rgba(131, 56, 236, 0.4)';
          case 'doing': return 'rgba(255, 177, 0, 0.4)';
          case 'done': return 'rgba(0, 194, 122, 0.4)';
          case 'blocked': return 'rgba(208, 31, 72, 0.4)';
          default: return 'rgba(131, 56, 236, 0.4)';
        }
      }};
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 5px ${props => {
        switch(props.theme) {
          case 'todo': return 'rgba(131, 56, 236, 0.2)';
          case 'doing': return 'rgba(255, 177, 0, 0.2)';
          case 'done': return 'rgba(0, 194, 122, 0.2)';
          case 'blocked': return 'rgba(208, 31, 72, 0.2)';
          default: return 'rgba(131, 56, 236, 0.2)';
        }
      }};
    }
    
    /* Glowing effect */
    &::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover::after {
      opacity: 0.5;
    }
  `}
  
  /* Secondary button styling */
  ${props => !props.primary && `
    background: transparent;
    color: ${props => {
      switch(props.theme) {
        case 'todo': return '#8338ec';
        case 'doing': return '#ffb100';
        case 'done': return '#00c27a';
        case 'blocked': return '#d01f48';
        case 'light': return '#333333';
        default: return '#8338ec';
      }
    }};
    border: 1px solid ${props => {
      switch(props.theme) {
        case 'todo': return 'rgba(131, 56, 236, 0.3)';
        case 'doing': return 'rgba(255, 177, 0, 0.3)';
        case 'done': return 'rgba(0, 194, 122, 0.3)';
        case 'blocked': return 'rgba(208, 31, 72, 0.3)';
        case 'light': return 'rgba(0, 0, 0, 0.1)';
        default: return 'rgba(131, 56, 236, 0.3)';
      }
    }};
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
  
  /* Icon styling */
  svg {
    font-size: 1rem;
    margin-right: ${props => props.iconOnly ? '0' : spacing.xs};
    margin-left: 0;
    
    [dir="rtl"] & {
      margin-right: 0;
      margin-left: ${props => props.iconOnly ? '0' : spacing.xs};
    }
  }
  
  /* Icon-only button */
  ${({ iconOnly }) =>
    iconOnly &&
    css`
      min-width: auto;
      width: 36px;
      height: 36px;
      padding: ${spacing.xs};
      border-radius: 50%;
  `}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

// Export the ModalButton component for use in other components
export { ModalButton };
export default Modal;

/*
 * Usage Example:
 * 
 * ```jsx
 * import Modal from '../Common/Modal';
 * import { FaPlus } from 'react-icons/fa';
 * import { useTranslation } from 'react-i18next';
 * import { useState } from 'react';
 * 
 * const YourComponent = () => {
 *   const { t } = useTranslation();
 *   const [isModalOpen, setIsModalOpen] = useState(false);
 *   
 *   const openModal = () => setIsModalOpen(true);
 *   const closeModal = () => setIsModalOpen(false);
 *   
 *   return (
 *     <div>
 *       <button onClick={openModal}>{t('common.create', 'Create')}</button>
 *       
 *       <Modal
 *         isOpen={isModalOpen}
 *         onClose={closeModal}
 *         title={t('yourModule.modalTitle', 'Your Modal Title')}
 *         icon={<FaPlus />}
 *         size="lg"
 *         theme="todo"
 *         animation="zoom"
 *         centered={true}
 *         closeOnClickOutside={true}
 *       >
 *         <div>
 *           <p>{t('yourModule.modalContent', 'Your modal content')}</p>
 *           
 *           <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
 *             <button onClick={closeModal}>{t('common.cancel', 'Cancel')}</button>
 *             <button onClick={() => { console.log('Action confirmed'); }}>
 *               {t('common.confirm', 'Confirm')}
 *             </button>
 *           </div>
 *         </div>
 *       </Modal>
 *     </div>
 *   );
 * };
 * ```
 */
