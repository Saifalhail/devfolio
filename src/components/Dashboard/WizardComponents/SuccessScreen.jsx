import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';
import { colors, spacing, borderRadius, shadows, transitions } from '../../../styles/GlobalTheme';

/**
 * SuccessScreen component for displaying a success message after project submission
 * 
 * @param {Object} props
 * @param {string} props.projectId - The ID of the submitted project
 * @param {Function} props.onReturnToDashboard - Function to call when return to dashboard button is clicked
 * @param {boolean} props.isRTL - Whether the layout is RTL
 */
const SuccessScreen = ({ projectId, onReturnToDashboard, isRTL = false }) => {
  const { t } = useTranslation();

  return (
    <SuccessContainer isRTL={isRTL}>
      <SuccessIcon>
        <FaCheckCircle size={60} />
      </SuccessIcon>
      <SuccessTitle isRTL={isRTL}>
        {t('projects.wizard.step7.successTitle', 'Project Created Successfully!')}
      </SuccessTitle>
      <SuccessMessage isRTL={isRTL}>
        {t('projects.wizard.step7.successMessage', 'Your project has been created successfully. Your project ID is:')}
      </SuccessMessage>
      <ProjectId isRTL={isRTL}>{projectId}</ProjectId>
      <ReturnButton onClick={onReturnToDashboard} isRTL={isRTL}>
        {t('projects.wizard.step7.returnToDashboard', 'Return to Dashboard')}
      </ReturnButton>
    </SuccessContainer>
  );
};

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
  height: 100%;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    padding: ${spacing.md};
  }
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  color: ${colors.success};
  margin-bottom: ${spacing.lg};
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const SuccessTitle = styled.h2`
  color: ${colors.accent.primary};
  font-size: 2rem;
  margin: ${spacing.lg} 0;
  text-align: center;
  width: 100%;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin: ${spacing.md} 0;
  }
`;

const ProjectId = styled.div`
  background-color: ${colors.background.secondary};
  padding: ${spacing.md} ${spacing.xl};
  border-radius: ${borderRadius.md};
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.accent.primary};
  margin: ${spacing.md} 0 ${spacing.xl};
  letter-spacing: 2px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: ${spacing.sm} ${spacing.md};
    margin: ${spacing.sm} 0 ${spacing.lg};
    max-width: 90%;
    overflow-wrap: break-word;
  }
`;

const SuccessMessage = styled.p`
  color: ${colors.text.primary};
  font-size: 1.2rem;
  margin-bottom: ${spacing.md};
  text-align: center;
  max-width: 90%;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ReturnButton = styled.button`
  background: linear-gradient(to right, ${colors.accent.primary}, ${colors.accent.secondary});
  color: white;
  border: none;
  padding: ${spacing.md} ${spacing.xl};
  border-radius: ${borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: ${spacing.sm} ${spacing.lg};
    font-size: 0.9rem;
    width: 80%;
    max-width: 300px;
  }
`;

export default SuccessScreen;
