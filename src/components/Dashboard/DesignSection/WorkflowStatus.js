import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaLightbulb, 
  FaPencilAlt, 
  FaFigma, 
  FaComments, 
  FaCheckCircle, 
  FaFileAlt, 
  FaLayerGroup 
} from 'react-icons/fa';

/**
 * WorkflowStatus Component
 * 
 * Displays the design workflow process with status indicators
 * and interactive buttons to navigate between workflow steps.
 */
const WorkflowStatus = ({ currentStep, onStepChange }) => {
  const { t } = useTranslation();
  
  const workflowSteps = [
    {
      id: 'aiFoundation',
      label: t('designWorkflow.aiFoundation', 'AI Foundation'),
      icon: <FaLightbulb />,
      description: t('designWorkflow.aiFoundationDesc', 'Initial AI-generated design concepts'),
      status: 'completed' // completed, inProgress, pending
    },
    {
      id: 'wireframes',
      label: t('designWorkflow.wireframes', 'Wireframes'),
      icon: <FaPencilAlt />,
      description: t('designWorkflow.wireframesDesc', 'Low-fidelity layout sketches'),
      status: 'completed'
    },
    {
      id: 'figmaPrototype',
      label: t('designWorkflow.figmaPrototype', 'Figma Prototype'),
      icon: <FaFigma />,
      description: t('designWorkflow.figmaPrototypeDesc', 'Interactive high-fidelity mockups'),
      status: 'inProgress'
    },
    {
      id: 'feedback',
      label: t('designWorkflow.feedback', 'Feedback & Iterations'),
      icon: <FaComments />,
      description: t('designWorkflow.feedbackDesc', 'Client review and design refinement'),
      status: 'pending'
    },
    {
      id: 'approval',
      label: t('designWorkflow.approval', 'Approval'),
      icon: <FaCheckCircle />,
      description: t('designWorkflow.approvalDesc', 'Final design sign-off'),
      status: 'pending'
    },
    {
      id: 'documentation',
      label: t('designWorkflow.documentation', 'Documentation'),
      icon: <FaFileAlt />,
      description: t('designWorkflow.documentationDesc', 'Design system and guidelines'),
      status: 'pending'
    },
    {
      id: 'assets',
      label: t('designWorkflow.assets', 'Assets & Handoff'),
      icon: <FaLayerGroup />,
      description: t('designWorkflow.assetsDesc', 'Export assets for development'),
      status: 'pending'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <StatusIndicator status="completed">✅</StatusIndicator>;
      case 'inProgress':
        return <StatusIndicator status="inProgress">🟡</StatusIndicator>;
      case 'pending':
        return <StatusIndicator status="pending">⚪️</StatusIndicator>;
      default:
        return <StatusIndicator status="pending">⚪️</StatusIndicator>;
    }
  };

  return (
    <WorkflowContainer>
      <WorkflowTitle>{t('designWorkflow.title', 'Design Workflow')}</WorkflowTitle>
      <WorkflowSteps>
        {workflowSteps.map((step) => (
          <WorkflowStep 
            key={step.id} 
            active={currentStep === step.id}
            status={step.status}
            onClick={() => onStepChange(step.id)}
          >
            <StepHeader>
              {getStatusIcon(step.status)}
              <IconWrapper status={step.status}>{step.icon}</IconWrapper>
              <StepLabel>{step.label}</StepLabel>
            </StepHeader>
            <StepDescription>{step.description}</StepDescription>
            {currentStep === step.id && <ActiveIndicator />}
          </WorkflowStep>
        ))}
      </WorkflowSteps>
    </WorkflowContainer>
  );
};

const WorkflowContainer = styled.div`
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, rgba(250, 170, 147, 0.2), rgba(255, 91, 146, 0.2), rgba(167, 139, 250, 0.2));
    border-radius: 14px;
    z-index: -1;
    filter: blur(8px);
    opacity: 0.7;
  }
`;

const WorkflowTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 18px;
    background: linear-gradient(to bottom, #faaa93, #ff5b92);
    margin-right: 0.75rem;
    border-radius: 2px;
  }
`;

const WorkflowSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const WorkflowStep = styled.div`
  background: ${props => props.active ? 'rgba(96, 49, 168, 0.6)' : 'rgba(35, 38, 85, 0.6)'};
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    background: rgba(96, 49, 168, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => {
    switch(props.status) {
      case 'completed': return 'linear-gradient(45deg, #27ae60, #2ecc71)';
      case 'inProgress': return 'linear-gradient(45deg, #f39c12, #f1c40f)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const StatusIndicator = styled.div`
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  animation: ${props => props.status === 'inProgress' ? 'pulse 1.5s infinite' : 'none'};
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const StepLabel = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: white;
`;

const StepDescription = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 3.5rem;
`;

const ActiveIndicator = styled.div`
  position: absolute;
  left: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #faaa93, #ff5b92);
  border-radius: 2px;
`;

export default WorkflowStatus;
