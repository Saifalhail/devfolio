import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaMobileAlt, FaGlobe, FaDesktop, FaRocket } from 'react-icons/fa';
import Modal from '../Common/Modal';
import { colors, spacing, borderRadius, shadows, transitions, typography, breakpoints } from '../../styles/GlobalTheme';

// Import wizard components
import { 
  TextInput, 
  SelectableCards, 
  SearchableDropdown, 
  TimelineSelector
} from './WizardComponents';

/**
 * ProjectWizard - A multi-step wizard for creating new projects
 * 
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Callback when modal requests to close
 * @param {function} onProjectAdded - Callback when project is successfully created
 */
const ProjectWizard = ({ isOpen, onClose, onProjectAdded }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    industry: '',
    timeline: '',
    customType: '',
    customIndustry: ''
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset form data when modal closes
      setFormData({
        name: '',
        type: '',
        industry: '',
        timeline: '',
        customType: '',
        customIndustry: ''
      });
      setCurrentStep(1);
      setError(null);
    }
  }, [isOpen]);

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user makes changes
    if (error) setError(null);
  };

  // Validate current step
  const validateStep = () => {
    if (currentStep === 1) {
      // Validate Step 1
      if (!formData.name || formData.name.trim().length < 3) {
        setError(t('projects.wizard.nameRequired', 'Project name is required (min 3 characters)'));
        return false;
      }
      if (!formData.type) {
        setError(t('projects.wizard.typeRequired', 'Please select a project type'));
        return false;
      }
      if (formData.type === 'custom' && !formData.customType) {
        setError(t('projects.wizard.customTypeRequired', 'Please specify the custom project type'));
        return false;
      }
      if (!formData.industry) {
        setError(t('projects.wizard.industryRequired', 'Please select an industry'));
        return false;
      }
      if (formData.industry === 'other' && !formData.customIndustry) {
        setError(t('projects.wizard.customIndustryRequired', 'Please specify the industry'));
        return false;
      }
      if (!formData.timeline) {
        setError(t('projects.wizard.timelineRequired', 'Please select an estimated timeline'));
        return false;
      }
    }
    return true;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // For now, we only have step 1 implemented
      // This will be expanded as more steps are added
      const projectData = {
        name: formData.name,
        type: formData.type === 'custom' ? formData.customType : formData.type,
        industry: formData.industry === 'other' ? formData.customIndustry : formData.industry,
        timeline: formData.timeline,
        status: 'inProgress', // Default status for new projects
        createdAt: new Date()
      };

      // Call the onProjectAdded callback with the project data
      await onProjectAdded(projectData);
      
      // Close modal on success
      onClose();
    } catch (err) {
      console.error('Error creating project:', err);
      setError(t('projects.wizard.submitError', 'Error creating project. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Total number of steps in the wizard
  const totalSteps = 3; // Will be increased as more steps are added
  
  // Render progress bar
  const renderProgressBar = () => {
    // Calculate progress percentage for the progress line
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    
    return (
      <ProgressBar isRTL={isRTL}>
        {/* Decorative elements */}
        <ProgressBarDecoration isRTL={isRTL} />
        <ProgressBarCorner isRTL={isRTL} />
        
        {/* Step indicators */}
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <ProgressStep 
              key={stepNumber} 
              active={isActive || isCompleted}
              isRTL={isRTL}
            >
              {stepNumber}
              <ProgressLabel active={isActive || isCompleted} isRTL={isRTL}>
                {t(`projects.wizard.step${stepNumber}Label`, `Step ${stepNumber}`)}
              </ProgressLabel>
            </ProgressStep>
          );
        })}
        
        {/* Progress line that shows how far along the user is */}
        <ProgressLine start={0} end={progressPercentage} isRTL={isRTL} />
        
        {/* Add floating particles for visual interest */}
        <ProgressBarParticle size="small" position="topLeft" isRTL={isRTL} />
        <ProgressBarParticle size="medium" position="bottomRight" isRTL={isRTL} />
        <ProgressBarParticle size="tiny" position="centerLeft" isRTL={isRTL} />
      </ProgressBar>
    );
  };

  // Project type options
  const projectTypes = [
    { id: 'mobile', label: t('projects.wizard.types.mobile', 'Mobile Application'), icon: <FaMobileAlt /> },
    { id: 'web', label: t('projects.wizard.types.web', 'Web Application'), icon: <FaGlobe /> },
    { id: 'desktop', label: t('projects.wizard.types.desktop', 'Desktop Software'), icon: <FaDesktop /> },
    { id: 'custom', label: t('projects.wizard.types.custom', 'Custom Project'), icon: <FaRocket /> }
  ];

  // Industry options
  const industryOptions = [
    { value: 'education', label: t('projects.wizard.industries.education', '📚 Education & E-Learning') },
    { value: 'ecommerce', label: t('projects.wizard.industries.ecommerce', '🛒 E-commerce & Retail') },
    { value: 'finance', label: t('projects.wizard.industries.finance', '💼 Finance & Banking') },
    { value: 'technology', label: t('projects.wizard.industries.technology', '💻 Technology & Software') },
    { value: 'healthcare', label: t('projects.wizard.industries.healthcare', '🏥 Healthcare & Medicine') },
    { value: 'gaming', label: t('projects.wizard.industries.gaming', '🎮 Gaming & Entertainment') },
    { value: 'social', label: t('projects.wizard.industries.social', '📸 Social & Media') },
    { value: 'logistics', label: t('projects.wizard.industries.logistics', '🚚 Logistics & Transportation') },
    { value: 'food', label: t('projects.wizard.industries.food', '🍽️ Food & Hospitality') },
    { value: 'creative', label: t('projects.wizard.industries.creative', '🎨 Creative & Design') },
    { value: 'marketing', label: t('projects.wizard.industries.marketing', '📈 Marketing & Advertising') },
    { value: 'manufacturing', label: t('projects.wizard.industries.manufacturing', '⚙️ Manufacturing & Production') },
    { value: 'energy', label: t('projects.wizard.industries.energy', '⚡️ Energy & Utilities') },
    { value: 'environment', label: t('projects.wizard.industries.environment', '🌱 Environment & Sustainability') },
    { value: 'realestate', label: t('projects.wizard.industries.realestate', '🏠 Real Estate') },
    // { value: 'other', label: t('projects.wizard.industries.other', 'Other') }
  ];

  // Timeline options
  const timelineOptions = [
    { id: 'urgent', label: t('projects.wizard.timelines.urgent', '🚀 Less than 1 month (Urgent)') },
    { id: 'quick', label: t('projects.wizard.timelines.quick', '⚡️ 1–3 months (Quick)') },
    { id: 'standard', label: t('projects.wizard.timelines.standard', '📅 3–6 months (Standard)') },
    { id: 'longterm', label: t('projects.wizard.timelines.longterm', '🌱 6+ months (Long-term)') }
  ];

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContainer isRTL={isRTL}>
            <StepTitle>{t('projects.wizard.step1.title', 'Step 1: Project Info')}</StepTitle>
            
            {/* Project Name */}
            <FormGroup isRTL={isRTL}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step1.projectName', 'Project Name')}
              </FormLabel>
              <TextInput
                value={formData.name}
                onChange={(value) => handleChange('name', value)}
                placeholder={t('projects.wizard.step1.projectNamePlaceholder', 'Enter project name (e.g., MyAwesomeApp)')}
                maxLength={50}
                minLength={3}
                required
              />
            </FormGroup>
            
            {/* Project Type */}
            <FormGroup isRTL={isRTL}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step1.projectType', 'Project Type')}
              </FormLabel>
              <SelectableCards
                options={projectTypes.map(type => ({
                  id: type.id,
                  label: type.label,
                  icon: type.icon
                }))}
                selectedValue={formData.type}
                onChange={(value) => handleChange('type', value)}
                required
              />
              {formData.type === 'custom' && (
                <TextInput
                  value={formData.customType}
                  onChange={(value) => handleChange('customType', value)}
                  placeholder={t('projects.wizard.step1.customTypePlaceholder', 'Describe your custom project type')}
                  maxLength={100}
                  style={{ marginTop: spacing.sm }}
                />
              )}
            </FormGroup>
            
            {/* Project Industry */}
            <FormGroup isRTL={isRTL}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step1.projectIndustry', 'Project Industry')}
              </FormLabel>
              <SearchableDropdown
                options={industryOptions.map(industry => ({
                  id: industry.value,
                  label: industry.label
                }))}
                selectedValue={formData.industry}
                onChange={(value, customValue) => {
                  if (value === 'other' && customValue) {
                    handleChange('customIndustry', customValue);
                  }
                  handleChange('industry', value);
                }}
                placeholder={t('projects.wizard.step1.industryPlaceholder', 'Select your industry')}
                allowCustom={true}
                required
              />
            </FormGroup>
            
            {/* Estimated Timeline */}
            <FormGroup isRTL={isRTL}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step1.estimatedTimeline', 'Estimated Timeline')}
              </FormLabel>
              <TimelineSelector
                options={timelineOptions.map(timeline => ({
                  id: timeline.id,
                  label: timeline.label,
                  description: timeline.description
                }))}
                selectedValue={formData.timeline}
                onChange={(value) => handleChange('timeline', value)}
                required
              />
            </FormGroup>
          </StepContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('projects.wizard.title', 'Create New Project')}
      icon={<FaPlus />}
      size="lg"
      theme="default"
      animation="fade"
      closeOnClickOutside={false}
      fullScreenOnMobile={true}
      isRTL={isRTL}
      footer={
        <ModalFooter isRTL={isRTL}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ModalButton 
            secondary 
            onClick={onClose}
            isRTL={isRTL}
          >
            {t('common.cancel', 'Cancel')}
          </ModalButton>
          
          {currentStep > 1 && (
            <ModalButton 
              secondary 
              onClick={handlePrevStep}
              isRTL={isRTL}
            >
              {t('common.back', 'Back')}
            </ModalButton>
          )}
          
          <ModalButton 
            primary 
            onClick={currentStep < totalSteps ? handleNextStep : handleSubmit}
            isRTL={isRTL}
          >
            {currentStep < totalSteps 
              ? t('common.next', 'Next') 
              : t('common.create', 'Create')}
          </ModalButton>
        </ModalFooter>
      }
    >
      <WizardContainer isRTL={isRTL}>
        {/* Progress indicator */}
        {renderProgressBar()}
        
        {/* Step content */}
        {renderStepContent()}
      </WizardContainer>
    </Modal>
  );
};

// Styled components
const WizardContainer = styled.div`
  padding: 0 ${spacing.lg} ${spacing.lg};
  color: ${colors.text.primary};
  font-family: ${typography.fontFamily};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  
  @media (max-width: ${breakpoints.sm}) {
    padding: 0 ${spacing.sm} ${spacing.md};
    margin: 0;
  }
  
  @media (max-width: ${breakpoints.xs}) {
    padding: 0 ${spacing.xs} ${spacing.sm};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${spacing.md} ${spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  width: 100%;
  gap: ${spacing.md};
  
  @media (max-width: ${breakpoints.sm}) {
    flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
    justify-content: center;
    padding: ${spacing.md} ${spacing.lg};
    gap: ${spacing.sm};
  }
  
  @media (max-width: ${breakpoints.xs}) {
    padding: ${spacing.md};
  }
  
  /* Add a subtle gradient overlay to the top border */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(74, 108, 247, 0.3), transparent);
  }
`;

const ModalButton = styled.button`
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-weight: ${typography.fontWeights.semiBold};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSizes.md};
  cursor: pointer;
  transition: all ${transitions.fast};
  border: none;
  min-width: 120px;
  position: relative;
  overflow: hidden;
  margin: 0;
  
  @media (max-width: ${breakpoints.sm}) {
    padding: ${spacing.md} ${spacing.lg};
    font-size: ${typography.fontSizes.md};
    min-width: 120px;
    height: 50px;
    width: 45%;
  }
  
  @media (max-width: ${breakpoints.xs}) {
    padding: ${spacing.sm} ${spacing.md};
    font-size: ${typography.fontSizes.md};
    border-radius: ${borderRadius.md};
    min-width: 120px;
    height: 46px;
    width: 45%;
  }
  
  /* Add shine effect */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: ${props => props.isRTL ? 'auto' : '-100%'};
    right: ${props => props.isRTL ? '-100%' : 'auto'};
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: ${transitions.medium};
  }
  
  &:hover:before {
    left: ${props => props.isRTL ? 'auto' : '100%'};
    right: ${props => props.isRTL ? '100%' : 'auto'};
    transition: 0.8s;
  }
  
  ${props => props.primary && `
    background: linear-gradient(135deg, ${colors.accent.primary}, ${colors.accent.secondary});
    color: white;
    
    &:hover {
      box-shadow: ${shadows.md};
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(-1px);
      box-shadow: ${shadows.sm};
    }
  `}
  
  ${props => props.secondary && `
    background: rgba(255, 255, 255, 0.1);
    color: white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(-1px);
    }
  `}
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 ${spacing.xl} 0;
  position: relative;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  width: 100%;
  overflow-x: auto;
  padding: ${spacing.sm} 0;
  
  @media (max-width: ${breakpoints.sm}) {
    margin: 0 0 ${spacing.lg} 0;
    justify-content: space-around;
  }
  
  @media (max-width: ${breakpoints.xs}) {
    margin: 0 0 ${spacing.md} 0;
    padding: ${spacing.xs} 0;
  }
  padding: ${spacing.xl} ${spacing.lg};
  background: linear-gradient(to right, rgba(20, 20, 50, 0.6), rgba(40, 40, 90, 0.6));
  border-radius: ${borderRadius.xl};
  box-shadow: 
    inset 0 0 30px rgba(0, 0, 0, 0.3),
    0 10px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(74, 108, 247, 0.2);
  overflow: hidden;
  
  /* Animated background glow */
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  /* Base container with animated gradient */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(74, 108, 247, 0.05) 0%, 
      rgba(138, 43, 226, 0.05) 25%, 
      rgba(90, 90, 150, 0.05) 50%, 
      rgba(74, 108, 247, 0.05) 75%, 
      rgba(138, 43, 226, 0.05) 100%);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
    z-index: -1;
  }
  
  /* Timeline line in the middle */
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-50%);
    z-index: 0;
    box-shadow: 0 0 10px rgba(74, 108, 247, 0.2);
  }
`;

/* Additional decorative elements for ProgressBar */
const ProgressBarDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  
  /* Top light effect */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }
  
  /* Left corner decoration */
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, rgba(74, 108, 247, 0.2) 0%, transparent 80%);
    border-radius: 0 0 100% 0;
  }
`;

/* Right corner decoration for ProgressBar */
const ProgressBarCorner = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(315deg, rgba(138, 43, 226, 0.2) 0%, transparent 80%);
  border-radius: 100% 0 0 0;
  pointer-events: none;
  z-index: 1;
`;

/* Decorative floating particles for ProgressBar */
const ProgressBarParticle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3));
  opacity: 0.5;
  pointer-events: none;
  z-index: 1;
  
  /* Size variations */
  width: ${props => {
    switch(props.size) {
      case 'tiny': return '8px';
      case 'small': return '12px';
      case 'medium': return '18px';
      case 'large': return '24px';
      default: return '12px';
    }
  }};
  
  height: ${props => {
    switch(props.size) {
      case 'tiny': return '8px';
      case 'small': return '12px';
      case 'medium': return '18px';
      case 'large': return '24px';
      default: return '12px';
    }
  }};
  
  /* Position variations */
  top: ${props => {
    switch(props.position) {
      case 'topLeft': return '15%';
      case 'topRight': return '15%';
      case 'centerLeft': return '50%';
      case 'centerRight': return '50%';
      case 'bottomLeft': return '75%';
      case 'bottomRight': return '75%';
      default: return '50%';
    }
  }};
  
  left: ${props => {
    switch(props.position) {
      case 'topLeft': return '15%';
      case 'centerLeft': return '25%';
      case 'bottomLeft': return '20%';
      case 'topRight': return 'auto';
      case 'centerRight': return 'auto';
      case 'bottomRight': return 'auto';
      default: return '50%';
    }
  }};
  
  right: ${props => {
    switch(props.position) {
      case 'topRight': return '15%';
      case 'centerRight': return '25%';
      case 'bottomRight': return '20%';
      case 'topLeft': return 'auto';
      case 'centerLeft': return 'auto';
      case 'bottomLeft': return 'auto';
      default: return 'auto';
    }
  }};
  
  transform: ${props => props.position.includes('center') ? 'translateY(-50%)' : 'none'};
  box-shadow: 0 0 10px rgba(138, 43, 226, 0.3);
  
  /* Animation */
  animation: ${props => {
    switch(props.position) {
      case 'topLeft': return 'floatAnimation1 8s ease-in-out infinite';
      case 'topRight': return 'floatAnimation2 12s ease-in-out infinite';
      case 'centerLeft': return 'floatAnimation3 10s ease-in-out infinite';
      case 'centerRight': return 'floatAnimation1 9s ease-in-out infinite';
      case 'bottomLeft': return 'floatAnimation2 11s ease-in-out infinite';
      case 'bottomRight': return 'floatAnimation3 7s ease-in-out infinite';
      default: return 'floatAnimation1 10s ease-in-out infinite';
    }
  }};
  
  @keyframes floatAnimation1 {
    0% { transform: translate(0, 0); }
    50% { transform: translate(10px, 10px); }
    100% { transform: translate(0, 0); }
  }
  
  @keyframes floatAnimation2 {
    0% { transform: translate(0, 0); }
    33% { transform: translate(-8px, 8px); }
    66% { transform: translate(8px, -8px); }
    100% { transform: translate(0, 0); }
  }
  
  @keyframes floatAnimation3 {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-5px, 10px) scale(1.1); }
    100% { transform: translate(0, 0) scale(1); }
  }
`;

const ProgressStep = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #4a6cf7, #6a1fd0)' 
    : 'linear-gradient(135deg, rgba(30, 30, 60, 0.6), rgba(20, 20, 40, 0.8))'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${typography.fontWeights.semiBold};
  font-family: ${typography.fontFamily};
  color: white;
  position: relative;
  z-index: 1;
  transition: all ${transitions.fast};
  box-shadow: ${props => props.active ? '0 0 15px rgba(74, 108, 247, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.2)'};
  border: 2px solid ${props => props.active ? 'rgba(138, 43, 226, 0.8)' : 'rgba(74, 108, 247, 0.2)'};
  margin: 0 ${spacing.xs};
  
  @media (max-width: ${breakpoints.sm}) {
    width: 36px;
    height: 36px;
    font-size: ${typography.fontSizes.sm};
  }
  
  @media (max-width: ${breakpoints.xs}) {
    width: 30px;
    height: 30px;
    font-size: ${typography.fontSizes.xs};
    margin: 0 ${spacing.xxs};
  }
  
  &:hover {
    transform: ${props => props.active ? 'scale(1.1)' : 'scale(1.05)'};
    box-shadow: ${props => props.active ? '0 0 20px rgba(74, 108, 247, 0.4)' : '0 4px 8px rgba(0, 0, 0, 0.3)'};
    border-color: ${props => props.active ? 'rgba(138, 43, 226, 1)' : 'rgba(74, 108, 247, 0.4)'};
  }
  
  /* Add a subtle pulse animation for active steps */
  ${props => props.active && `
    animation: pulse 2s infinite;
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(74, 108, 247, 0.4);
      }
      70% {
        box-shadow: 0 0 0 8px rgba(74, 108, 247, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(74, 108, 247, 0);
      }
    }
  `}
`;

const StepLabel = styled.span`
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  text-align: center;
  white-space: nowrap;
`;

const StepContainer = styled.div`
  margin-top: ${spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: linear-gradient(135deg, rgba(20, 20, 40, 0.3), rgba(30, 30, 60, 0.3));
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(74, 108, 247, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  width: 100%;
  max-width: 100%;
  
  @media (max-width: ${breakpoints.sm}) {
    padding: ${spacing.sm};
    gap: ${spacing.sm};
    margin-top: ${spacing.md};
    border-radius: ${borderRadius.sm};
  }
  
  @media (max-width: ${breakpoints.xs}) {
    padding: ${spacing.xs};
    gap: ${spacing.xs};
    margin-top: ${spacing.sm};
  }
  
  /* Add subtle light effect at the top */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
  
  /* Add subtle corner accent */
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: ${props => props.isRTL ? 'auto' : '0'};
    left: ${props => props.isRTL ? '0' : 'auto'};
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, transparent 50%, rgba(74, 108, 247, 0.1) 50%);
    border-radius: ${props => props.isRTL ? '0 0 40px 0' : '0 0 0 40px'};
  }
`;

const StepTitle = styled.h3`
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.semiBold};
  margin-bottom: ${spacing.md};
  color: ${colors.accent.primary};
  text-align: center;
  font-family: ${typography.fontFamily};
  
  @media (max-width: ${breakpoints.sm}) {
    font-size: ${typography.fontSizes.md};
    margin-bottom: ${spacing.sm};
  }
  
  /* Add gradient text effect */
  background: linear-gradient(90deg, ${colors.accent.primary}, ${colors.accent.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FormGroup = styled.div`
  margin-bottom: ${spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  background: linear-gradient(135deg, rgba(25, 25, 50, 0.2), rgba(35, 35, 70, 0.2));
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(74, 108, 247, 0.05);
  position: relative;
  transition: all ${transitions.fast};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  width: 100%;
  
  @media (max-width: ${breakpoints.sm}) {
    margin-bottom: ${spacing.md};
    padding: ${spacing.sm};
    gap: ${spacing.xs};
    border-radius: ${borderRadius.sm};
  }
  
  @media (max-width: ${breakpoints.xs}) {
    margin-bottom: ${spacing.sm};
    padding: ${spacing.xs};
  }
  
  /* Ensure all input elements inside FormGroup are responsive */
  input, select, textarea, button {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    
    @media (max-width: ${breakpoints.sm}) {
      font-size: ${typography.fontSizes.sm};
      padding: ${spacing.xs};
    }
    
    @media (max-width: ${breakpoints.xs}) {
      font-size: ${typography.fontSizes.xs};
      padding: ${spacing.xxs};
    }
  }
  
  &:hover {
    background: linear-gradient(135deg, rgba(30, 30, 60, 0.25), rgba(40, 40, 80, 0.25));
    border-color: rgba(74, 108, 247, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* Add subtle border accent */
  &:before {
    content: '';
    position: absolute;
    top: 10%;
    bottom: 10%;
    left: ${props => props.isRTL ? 'auto' : '0'};
    right: ${props => props.isRTL ? '0' : 'auto'};
    width: 3px;
    background: linear-gradient(to bottom, rgba(74, 108, 247, 0.2), rgba(138, 43, 226, 0.2));
    border-radius: ${props => props.isRTL ? '${borderRadius.sm} 0 0 ${borderRadius.sm}' : '0 ${borderRadius.sm} ${borderRadius.sm} 0'};
  }
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: ${spacing.xs};
  font-weight: ${typography.fontWeights.medium};
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  font-family: ${typography.fontFamily};
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  justify-content: ${props => props.isRTL ? 'flex-end' : 'flex-start'};
  width: 100%;
  
  @media (max-width: ${breakpoints.sm}) {
    font-size: ${typography.fontSizes.xs};
    margin-bottom: ${spacing.xxs};
  }
  
  /* Add gradient text effect for better visibility on mobile */
  @media (max-width: ${breakpoints.xs}) {
    background: linear-gradient(90deg, ${colors.text.secondary}, ${colors.accent.primary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: ${typography.fontWeights.semiBold};
  }
`;

const ErrorMessage = styled.div`
  color: ${colors.error};
  font-size: ${typography.fontSizes.sm};
  margin-top: ${spacing.xs};
  min-height: 1.5rem;
  font-family: ${typography.fontFamily};
  text-align: center;
  font-weight: ${typography.fontWeights.medium};
  @media (max-width: ${breakpoints.sm}) {
    margin: 0;
    text-align: center;
    width: 100%;
  }
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ProgressLine = styled.div`
  position: absolute;
  top: 50%;
  left: ${props => props.isRTL ? (100 - props.end) : props.start}%;
  right: ${props => props.isRTL ? props.start : (100 - props.end)}%;
  height: 6px;
  background: linear-gradient(${props => props.isRTL ? 'to left' : 'to right'}, #4a6cf7, #8a2be2, #6a1fd0);
  background-size: 200% 100%;
  transform: translateY(-50%);
  z-index: 0;
  transition: all 0.5s ease;
  box-shadow: 
    0 0 10px rgba(74, 108, 247, 0.6),
    0 0 20px rgba(138, 43, 226, 0.3);
  border-radius: 4px;
  animation: shimmerEffect 3s infinite linear;
  
  @media (max-width: ${breakpoints.sm}) {
    height: 4px;
  }
  
  /* Pulsating glow effect */
  &:after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(to right, rgba(74, 108, 247, 0.4), rgba(138, 43, 226, 0.4));
    border-radius: 6px;
    z-index: -1;
    filter: blur(6px);
    animation: pulseGlow 2s infinite alternate;
  }
  
  @keyframes shimmerEffect {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }
  
  @keyframes pulseGlow {
    0% { opacity: 0.4; }
    100% { opacity: 0.8; }
  }
`;

const ProgressLabel = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: ${spacing.xs};
  font-size: ${typography.fontSizes.xs};
  font-family: ${typography.fontFamily};
  color: ${props => props.active ? colors.accent.primary : 'rgba(255, 255, 255, 0.6)'};
  text-align: center;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: ${breakpoints.sm}) {
    font-size: ${typography.fontSizes.xxs};
    margin-top: ${spacing.xxs};
  }
  white-space: nowrap;
  transition: all ${transitions.fast};
  
  ${ProgressStep}:hover & {
    color: ${props => props.active ? colors.accent.secondary : 'rgba(255, 255, 255, 0.8)'};
  }
`;

export default ProjectWizard;