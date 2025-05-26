import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, spacing, borderRadius, shadows, zIndex, typography } from '../../styles/GlobalTheme';

const slideIn = keyframes`
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(20px); opacity: 0; }
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: ${spacing.lg};
  right: ${spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  z-index: ${zIndex.toast};
`;

const ToastItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  background: ${colors.gradients.card};
  color: ${colors.text.primary};
  border-left: 4px solid ${({ type }) => colors.status[type] || colors.status.info};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.md};
  min-width: 200px;
  animation: ${({ state }) => (state === 'exiting' ? slideOut : slideIn)} 0.4s forwards;
`;

const Message = styled.span`
  flex: 1;
  font-size: ${typography.fontSizes.sm};
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: ${typography.fontSizes.md};
`;

const Toast = ({ toasts, onRemove }) => (
  <ToastWrapper>
    {toasts.map((toast) => (
      <ToastItem key={toast.id} type={toast.type} state={toast.state}>
        <Message>{toast.message}</Message>
        <CloseBtn onClick={() => onRemove(toast.id)} aria-label="Close">×</CloseBtn>
      </ToastItem>
    ))}
  </ToastWrapper>
);

export default Toast;
