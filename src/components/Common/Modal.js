import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { colors, spacing, borderRadius, shadows, zIndex } from '../../styles/GlobalTheme';

/**
 * Reusable modal component with basic animations.
 * Supports RTL layout automatically based on i18next language.
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Callback when modal requests to close
 * @param {React.ReactNode} children - Modal body content
 * @param {string} title - Optional modal title
 */
const Modal = ({ isOpen, onClose, children, title }) => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const containerRef = useRef();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose && onClose();
      }
    };

    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose && onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay isRTL={isRTL} data-testid="modal-overlay">
      <Container ref={containerRef} isRTL={isRTL}>
        <CloseButton onClick={onClose} isRTL={isRTL} aria-label={t('close', 'Close')}>
          &times;
        </CloseButton>
        {title && <Header>{title}</Header>}
        <Content>{children}</Content>
      </Container>
    </Overlay>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
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
  align-items: center;
  z-index: ${zIndex.modal};
  direction: ${(props) => (props.isRTL ? 'rtl' : 'ltr')};
  animation: ${fadeIn} 0.3s ease forwards;
  padding: 1rem;
`;

const Container = styled.div`
  background: ${colors.background.primary};
  color: ${colors.text.primary};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.lg};
  width: 100%;
  max-width: 500px;
  padding: ${spacing.lg};
  position: relative;
  animation: ${slideDown} 0.3s ease forwards;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${spacing.sm};
  right: ${(props) => (props.isRTL ? 'auto' : spacing.sm)};
  left: ${(props) => (props.isRTL ? spacing.sm : 'auto')};
  background: none;
  border: none;
  color: ${colors.text.primary};
  font-size: 1.5rem;
  cursor: pointer;
`;

const Header = styled.h2`
  margin: 0 0 ${spacing.md} 0;
  font-size: 1.25rem;
`;

const Content = styled.div``;

export default Modal;
