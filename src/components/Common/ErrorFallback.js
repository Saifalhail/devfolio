import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaBug, FaRedo } from 'react-icons/fa';
import { colors, spacing, borderRadius } from '../../styles/GlobalTheme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: ${spacing.xl};
  text-align: center;
  background-color: ${colors.background.primary};
  border-radius: ${borderRadius.md};
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${spacing.md};
  color: ${colors.error.main};
`;

const ErrorTitle = styled.h3`
  color: ${colors.text.primary};
  margin-bottom: ${spacing.md};
`;

const ErrorMessage = styled.div`
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.lg};
  max-width: 600px;
  overflow-wrap: break-word;
  word-break: break-word;
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${colors.accent.primary};
  color: white;
  border: none;
  border-radius: ${borderRadius.sm};
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${colors.accent.secondary};
  }
`;

const ErrorDetails = styled.pre`
  background-color: ${colors.background.secondary};
  color: ${colors.text.secondary};
  padding: ${spacing.md};
  border-radius: ${borderRadius.sm};
  margin-top: ${spacing.lg};
  max-width: 100%;
  overflow-x: auto;
  font-size: 12px;
  text-align: left;
`;

/**
 * Error Fallback component that displays when a React error boundary catches an error
 * 
 * @param {Object} props - Component props
 * @param {Object} props.error - The error that was caught
 * @param {Function} props.resetErrorBoundary - Function to reset the error boundary
 * @param {String} props.componentName - Optional name of the component that failed
 */
const ErrorFallback = ({ error, resetErrorBoundary, componentName = 'Component' }) => {
  const { t } = useTranslation();
  
  return (
    <Container>
      <ErrorIcon>
        <FaBug />
      </ErrorIcon>
      <ErrorTitle>
        {t('errors.componentFailed', '{{componentName}} failed to load', { componentName })}
      </ErrorTitle>
      <ErrorMessage>
        {t('errors.tryAgainMessage', 'Something went wrong. You can try again or contact support if the problem persists.')}
      </ErrorMessage>
      <RetryButton onClick={resetErrorBoundary}>
        <FaRedo /> {t('common.tryAgain', 'Try Again')}
      </RetryButton>
      {error && process.env.NODE_ENV !== 'production' && (
        <ErrorDetails>
          {error.message}
          {error.stack && `\n\n${error.stack}`}
        </ErrorDetails>
      )}
    </Container>
  );
};

export default ErrorFallback;
