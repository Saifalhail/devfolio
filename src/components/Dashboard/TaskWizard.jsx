import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaPlus, FaCheck, FaInfoCircle, FaClipboardList, 
  FaCalendarAlt, FaUserAlt, FaClock, FaFlag, FaProjectDiagram,
  FaTimes, FaExclamationTriangle, FaArrowRight, FaArrowLeft,
  FaRegLightbulb, FaStar, FaSpinner
} from 'react-icons/fa';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import { colors, spacing, borderRadius, shadows, transitions } from '../../styles/GlobalTheme';
import { motion, AnimatePresence } from 'framer-motion';

// Import reusable wizard components
import { 
  TextInput, 
  SelectableCards,
  SearchableDropdown, 
  TimelineSelector,
  ExpandableTextarea,
  SuccessScreen,
  Tooltip
} from './WizardComponents';

// Local ButtonIcon component since it's not exported from Button
const ButtonIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: ${props => props.isRTL ? '0 0 0 8px' : '0 8px 0 0'};
  font-size: 0.875rem;
  
  svg {
    transform: ${props => props.isRTL ? 'rotate(180deg)' : 'none'};
  }
`;

// Local FormGroup component implementation since it's missing from WizardComponents
const FormGroup = ({ label, required, children, error, tooltip }) => {
  return (
    <FormGroupContainer>
      {label && (
        <FormLabel>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
          {tooltip && <Tooltip content={tooltip} />}
        </FormLabel>
      )}
      {children}
      {error && <ErrorMessage><FaExclamationTriangle size={12} /> {error}</ErrorMessage>}
    </FormGroupContainer>
  );
};

const FormGroupContainer = styled.div`
  margin-bottom: ${spacing.md};
  width: 100%;
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: ${spacing.xs};
  font-weight: 500;
  font-size: 0.875rem;
`;

const RequiredMark = styled.span`
  color: ${colors.error};
  margin-left: ${spacing.xs};
`;

/**
 * TaskWizard - A simple wizard for creating tasks within projects
 * 
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Callback when modal requests to close
 * @param {function} onTaskAdded - Callback when task is successfully created
 * @param {string} projectId - Optional: Pre-selected project ID
 */
const TaskWizard = ({ isOpen, onClose, onTaskAdded, projectId = null }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(projectId ? 2 : 1);
  const [totalSteps] = useState(projectId ? 3 : 4);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('forward');
  const [touchedFields, setTouchedFields] = useState({});
  
  // Form data
  const [formData, setFormData] = useState({
    projectId: projectId || '',
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: null,
    assignedTo: '',
    assignedToName: '',
    category: '',
    tags: [],
    estimatedHours: null
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  // Track field changes for validation
  const markFieldAsTouched = useCallback((fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  }, []);
  
  // Validate individual field
  const validateField = useCallback((name, value) => {
    let error = '';
    
    switch(name) {
      case 'projectId':
        if (!value) error = t('wizard.errors.required', 'This field is required');
        break;
      case 'title':
        if (!value) error = t('wizard.errors.required', 'This field is required');
        else if (value.length < 3) error = t('wizard.errors.minLength', 'Must be at least 3 characters');
        else if (value.length > 100) error = t('wizard.errors.maxLength', 'Must be less than 100 characters');
        break;
      case 'description':
        if (value && value.length > 500) error = t('wizard.errors.maxLength', 'Must be less than 500 characters');
        break;
      case 'estimatedHours':
        if (value && (isNaN(value) || value <= 0)) {
          error = t('wizard.errors.positiveNumber', 'Must be a positive number');
        }
        break;
      default:
        break;
    }
    
    return error;
  }, [t]);
  
  // Update formData and validate on change
  const handleFieldChange = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    markFieldAsTouched(name);
    
    const errorMessage = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  }, [markFieldAsTouched, validateField]);
  
  // Demo projects data - in a real app, this would come from your database
  const projects = [
    { 
      id: 'project1', 
      name: 'Website Redesign',
      description: 'Modernize the company website with a new design and improved UX',
      icon: <FaProjectDiagram />
    },
    { 
      id: 'project2', 
      name: 'Mobile App Development',
      description: 'Build a native mobile app for iOS and Android platforms',
      icon: <FaProjectDiagram />
    },
    { 
      id: 'project3', 
      name: 'Marketing Campaign',
      description: 'Plan and execute a comprehensive digital marketing campaign',
      icon: <FaProjectDiagram />
    },
    { 
      id: 'project4', 
      name: 'E-commerce Integration',
      description: 'Add e-commerce functionality to the existing website',
      icon: <FaProjectDiagram />
    }
  ];
  
  // Validate all relevant fields based on current step
  const validateCurrentStep = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    
    // Fields to validate based on current step
    if (currentStep === 1) {
      if (!formData.projectId) {
        newErrors.projectId = t('wizard.errors.required', 'This field is required');
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (!formData.title) {
        newErrors.title = t('wizard.errors.required', 'This field is required');
        isValid = false;
      } else if (formData.title.length < 3) {
        newErrors.title = t('wizard.errors.minLength', 'Must be at least 3 characters');
        isValid = false;
      }
      
      if (formData.estimatedHours && (isNaN(formData.estimatedHours) || formData.estimatedHours <= 0)) {
        newErrors.estimatedHours = t('wizard.errors.positiveNumber', 'Must be a positive number');
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  }, [currentStep, formData, t]);

  // Navigation functions with improved transitions
  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) {
      // Mark relevant fields as touched to show errors
      if (currentStep === 1) {
        markFieldAsTouched('projectId');
      } else if (currentStep === 2) {
        markFieldAsTouched('title');
        markFieldAsTouched('estimatedHours');
      }
      return; 
    }
    
    if (currentStep === totalSteps) {
      handleSubmit();
    } else {
      setAnimationDirection('forward');
      setTimeout(() => setCurrentStep(current => current + 1), 300);
    }
  }, [currentStep, totalSteps, validateCurrentStep, markFieldAsTouched]);
  
  const prevStep = useCallback(() => {
    if (currentStep === 1) {
      onClose();
    } else {
      setAnimationDirection('backward');
      setTimeout(() => setCurrentStep(current => current - 1), 300);
    }
  }, [currentStep, onClose]);
  
  // Handle form submission with improved UX feedback
  const handleSubmit = useCallback(() => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    
    // Simulate API request with loading state
    setTimeout(() => {
      // API call would go here in a real app
      console.log('Task created:', formData);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // In a real app, you would save the task to your database here
      // and then call onTaskAdded with the new task data
    }, 1000);
  }, [formData, validateCurrentStep]);
  
  // Reset wizard on close and create a new task after success
  const handleCreateAnother = useCallback(() => {
    // Reset form but keep project selection
    setFormData(prev => ({
      ...prev,
      title: '',
      description: '',
      priority: 'medium', 
      status: 'todo',
      dueDate: null,
      assignedTo: '',
      assignedToName: '',
      category: '',
      tags: [],
      estimatedHours: null
    }));
    setShowSuccess(false);
    setTouchedFields({});
    setErrors({});
  }, []);
  
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(projectId ? 2 : 1);
      setShowSuccess(false);
      setErrors({});
    }
  }, [isOpen, projectId]);
  
  // Render step content based on current step with animations
  const renderStepContent = () => {
    // Animation variants for step transitions
    const stepVariants = {
      enter: (direction) => ({
        x: direction === 'forward' ? 300 : -300,
        opacity: 0,
        scale: 0.9,
      }),
      center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.35,
          ease: 'easeOut'
        }
      },
      exit: (direction) => ({
        x: direction === 'forward' ? -300 : 300,
        opacity: 0,
        scale: 0.9,
        transition: {
          duration: 0.25, 
          ease: 'easeIn'
        }
      })
    };
    
    if (showSuccess) {
      return (
        <SuccessContainer>
          <SuccessScreen
            title={t('taskWizard.success.title', 'Task Created Successfully!')}
            message={t('taskWizard.success.message', 'Your new task has been added to the project.')}
            primaryAction={{
              label: t('taskWizard.success.viewTask', 'View Task'),
              onClick: () => {
                onTaskAdded && onTaskAdded(formData);
                onClose();
              }
            }}
            secondaryAction={{
              label: t('taskWizard.success.createAnother', 'Create Another Task'),
              onClick: handleCreateAnother
            }}
          />
        </SuccessContainer>
      );
    }
    
    return (
      <AnimatePresence mode="wait" custom={animationDirection}>
        <StepAnimationContainer
          key={currentStep}
          custom={animationDirection}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {currentStep === 1 ? (
            <StepContainer>
              <StepHeader>
                <StepTitleContainer>
                  <StepIcon>
                    <FaProjectDiagram />
                  </StepIcon>
                  <div>
                    <StepTitle>
                      {t('taskWizard.steps.selectProject', 'Select Project')}
                    </StepTitle>
                    <StepDescription>
                      {t('taskWizard.steps.selectProjectDesc', 'Choose a project to add tasks to')}
                    </StepDescription>
                  </div>
                </StepTitleContainer>
                
                <StepIndicator>
                  {!projectId ? `${currentStep}/${totalSteps}` : t('taskWizard.steps.step', 'Step {{currentStep}}')} 
                </StepIndicator>
              </StepHeader>
              
              <FormSection>
                {/* Project Selection */}
                <FormGroup
                  label={t('taskWizard.fields.project', 'Project')}
                  required
                  tooltip={t('taskWizard.tooltips.project', 'Select the project you want to add a task to')}
                  error={touchedFields.projectId && errors.projectId}
                >
                  <SearchableDropdown
                    value={formData.projectId}
                    onChange={(value) => handleFieldChange('projectId', value)}
                    placeholder={t('taskWizard.placeholders.selectProject', 'Search projects...')}
                    options={projects.map(p => ({ value: p.id, label: p.name }))}
                    error={touchedFields.projectId && errors.projectId}
                    required
                    enhanced
                  />
                </FormGroup>
                
                {/* Visual Project Selection */}
                <CardsSectionTitle>
                  <CardsSectionIcon><FaStar /></CardsSectionIcon>
                  {t('taskWizard.sections.availableProjects', 'Available Projects')}
                </CardsSectionTitle>
                
                <ProjectCardsContainer>
                  <SelectableCards
                    options={projects.map(p => ({
                      id: p.id,
                      label: p.name,
                      icon: p.icon,
                      description: p.description
                    }))}
                    selectedValue={formData.projectId}
                    onChange={(id) => handleFieldChange('projectId', id)}
                    required
                    enhanced
                  />
                </ProjectCardsContainer>
                
                {touchedFields.projectId && errors.projectId && (
                  <ErrorMessage>
                    <FaExclamationTriangle />
                    {errors.projectId}
                  </ErrorMessage>
                )}
                
                <StepGuidance>
                  <FaRegLightbulb />
                  {t('taskWizard.guidance.selectProject', 'Select a project to proceed to the next step')}
                </StepGuidance>
              </FormSection>
            </StepContainer>
          ) : currentStep === 2 ? (
            <StepContainer>
              <StepHeader>
                <StepTitleContainer>
                  <StepIcon>
                    <FaClipboardList />
                  </StepIcon>
                  <div>
                    <StepTitle>
                      {t('taskWizard.steps.taskDetails', 'Task Details')}
                    </StepTitle>
                    <StepDescription>
                      {t('taskWizard.steps.taskDetailsDesc', 'Enter information about your task')}
                    </StepDescription>
                  </div>
                </StepTitleContainer>
                
                <StepIndicator>
                  {!projectId ? `${currentStep}/${totalSteps}` : t('taskWizard.steps.step', 'Step {{currentStep}}')} 
                </StepIndicator>
              </StepHeader>
              
              <FormSection>
                {/* Task Title */}
                <FormGroup
                  label={t('taskWizard.fields.title', 'Task Title')}
                  required
                  tooltip={t('taskWizard.tooltips.title', 'A concise name for your task')}
                  error={touchedFields.title && errors.title}
                >
                  <TextInput
                    value={formData.title}
                    onChange={(value) => handleFieldChange('title', value)}
                    placeholder={t('taskWizard.placeholders.taskTitle', 'Enter task title')}
                    error={touchedFields.title && errors.title}
                    required
                    enhanced
                  />
                </FormGroup>
                
                {/* Task Description */}
                <FormGroup
                  label={t('taskWizard.fields.description', 'Description')}
                  tooltip={t('taskWizard.tooltips.description', 'Add details about the task requirements')}
                  error={touchedFields.description && errors.description}
                >
                  <ExpandableTextarea
                    value={formData.description}
                    onChange={(value) => handleFieldChange('description', value)}
                    placeholder={t('taskWizard.placeholders.taskDescription', 'Enter task description')}
                    error={touchedFields.description && errors.description}
                    enhanced
                  />
                </FormGroup>
                
                <FormColumnsContainer>
                  <FormColumn>
                    {/* Task Priority */}
                    <CardsSectionTitle>
                      <CardsSectionIcon><FaFlag /></CardsSectionIcon>
                      {t('taskWizard.fields.priority', 'Priority')}
                    </CardsSectionTitle>
                    
                    <SelectableCards
                      options={[
                        { id: 'low', label: t('taskWizard.priority.low', 'Low'), icon: <FaFlag style={{ color: '#3498db' }} /> },
                        { id: 'medium', label: t('taskWizard.priority.medium', 'Medium'), icon: <FaFlag style={{ color: '#f39c12' }} /> },
                        { id: 'high', label: t('taskWizard.priority.high', 'High'), icon: <FaFlag style={{ color: '#e74c3c' }} /> }
                      ]}
                      selectedValue={formData.priority}
                      onChange={(id) => handleFieldChange('priority', id)}
                      enhanced
                      compact
                    />
                  </FormColumn>
                  
                  <FormColumn>
                    {/* Task Status */}
                    <CardsSectionTitle>
                      <CardsSectionIcon><FaClipboardList /></CardsSectionIcon>
                      {t('taskWizard.fields.status', 'Status')}
                    </CardsSectionTitle>
                    
                    <SelectableCards
                      options={[
                        { id: 'todo', label: t('taskWizard.status.todo', 'To Do'), icon: <FaClipboardList style={{ color: '#6a1fd0' }} /> },
                        { id: 'doing', label: t('taskWizard.status.doing', 'In Progress'), icon: <FaClock style={{ color: '#ffb100' }} /> },
                        { id: 'blocked', label: t('taskWizard.status.blocked', 'Blocked'), icon: <FaInfoCircle style={{ color: '#e74c3c' }} /> }
                      ]}
                      selectedValue={formData.status}
                      onChange={(id) => handleFieldChange('status', id)}
                      enhanced
                      compact
                    />
                  </FormColumn>
                </FormColumnsContainer>
                
                <FormColumnsContainer>
                  {/* Due Date */}
                  <FormColumn>
                    <FormGroup
                      label={t('taskWizard.fields.dueDate', 'Due Date')}
                      tooltip={t('taskWizard.tooltips.dueDate', 'When does this task need to be completed?')}
                    >
                      <TimelineSelector
                        value={formData.dueDate}
                        onChange={(value) => handleFieldChange('dueDate', value)}
                        error={touchedFields.dueDate && errors.dueDate}
                        enhanced
                      />
                    </FormGroup>
                  </FormColumn>
                  
                  {/* Estimated Hours */}
                  <FormColumn>
                    <FormGroup
                      label={t('taskWizard.fields.estimatedHours', 'Estimated Hours')}
                      tooltip={t('taskWizard.tooltips.estimatedHours', 'Approximately how many hours will this task take?')}
                      error={touchedFields.estimatedHours && errors.estimatedHours}
                    >
                      <TextInput
                        type="number"
                        value={formData.estimatedHours || ''}
                        onChange={(value) => handleFieldChange('estimatedHours', value)}
                        placeholder={t('taskWizard.placeholders.estimatedHours', 'e.g., 4')}
                        error={touchedFields.estimatedHours && errors.estimatedHours}
                        enhanced
                      />
                    </FormGroup>
                  </FormColumn>
                </FormColumnsContainer>
                
                {/* Assignee */}
                <FormGroup
                  label={t('taskWizard.fields.assignedTo', 'Assigned To')}
                  tooltip={t('taskWizard.tooltips.assignedTo', 'Who should work on this task?')}
                >
                  <SearchableDropdown
                    value={formData.assignedTo}
                    onChange={(value) => handleFieldChange('assignedTo', value)}
                    placeholder={t('taskWizard.placeholders.selectAssignee', 'Select assignee')}
                    options={[
                      { value: 'user1', label: 'John Doe' },
                      { value: 'user2', label: 'Jane Smith' },
                      { value: 'user3', label: 'Alex Johnson' }
                    ]}
                    enhanced
                  />
                </FormGroup>
              </FormSection>
            </StepContainer>
          ) : null}
        </StepAnimationContainer>
      </AnimatePresence>
    );
  };

  // Define progress based on currentStep
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={t('taskWizard.title', 'Add New Task')}
      size="medium"
      footer={
        !showSuccess && (
          <React.Fragment>
            <ProgressBarContainer>
              <ProgressBar 
                progress={progress} 
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={progress}
              />
            </ProgressBarContainer>
            <ModalFooter>
              <Button 
                onClick={prevStep} 
                variant="secondary"
                disabled={isSubmitting}
              >
                {currentStep === 1 ? (
                  <React.Fragment>
                    <ButtonIcon><FaTimes /></ButtonIcon>
                    {t('common.cancel', 'Cancel')} 
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <ButtonIcon isRTL={isRTL}><FaArrowLeft /></ButtonIcon>
                    {t('common.back', 'Back')}
                  </React.Fragment>
                )}
              </Button>
              <Button 
                onClick={nextStep}
                variant="primary"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {currentStep === totalSteps ? (
                  <React.Fragment>
                    {t('common.create', 'Create')}
                    <ButtonIcon isRTL={isRTL}><FaPlus /></ButtonIcon>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {t('common.next', 'Next')}
                    <ButtonIcon isRTL={isRTL}><FaArrowRight /></ButtonIcon>
                  </React.Fragment>
                )}
              </Button>
            </ModalFooter>
          </React.Fragment>
        )
      }
    >
      <WizardContainer>
        <ProgressStep 
          active={currentStep >= 1} 
          completed={currentStep > 1}
        >
          {projectId ? '' : '1'}
        </ProgressStep>
        
        {!projectId && (
          <ProgressLine active={currentStep > 1} />
        )}
        
        <ProgressStep 
          active={currentStep >= 2} 
          completed={false}
        >
          {projectId ? '1' : '2'}
        </ProgressStep>
        {renderStepContent()}
      </WizardContainer>
    </Modal>
  );
};

// Styled components
const WizardContainer = styled.div`
  padding: 0 ${spacing.lg} ${spacing.lg};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const StepContainer = styled.div`
  margin-top: ${spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const StepTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: ${spacing.xs};
  color: ${colors.text.primary};
`;

const StepDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.md};
  opacity: 0.7;
`;

const ProgressStepsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.xl};
  position: relative;
  z-index: 1;
`;

const ProgressStep = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.active ? 'linear-gradient(135deg, #6a1fd0, #8a2be2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.active ? '#8a2be2' : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  font-weight: ${props => props.active ? '600' : '400'};
  position: relative;
  z-index: 2;
  transition: ${transitions.medium};
  box-shadow: ${props => props.active ? '0 0 15px rgba(138, 43, 226, 0.5)' : 'none'};
  
  ${props => props.completed && `
    &:after {
      content: '✓';
      color: white;
      font-size: 1rem;
      font-weight: bold;
    }
  `}
`;


// Second ProgressStep declaration removed to resolve duplicate component error

const ProgressLine = styled.div`
  height: 3px;
  width: 80px;
  background: ${props => props.active ? 'linear-gradient(to right, #6a1fd0, #8a2be2)' : 'rgba(255, 255, 255, 0.1)'};
  margin: 0 5px;
  transition: ${transitions.medium};
`;

const CardsSectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: ${colors.text.primary};
  margin: ${spacing.md} 0 ${spacing.sm};
`;

const ErrorMessage = styled.div`
  color: ${colors.error};
  font-size: 0.75rem;
  margin-top: ${spacing.xs};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
`;

const StepAnimationContainer = styled(motion.div)`
  width: 100%;
  overflow: hidden;
`;

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.md};
`;

const StepTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const StepIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6a1fd0, #8a2be2);
  color: white;
  font-size: 1.25rem;
`;

const StepIndicator = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  opacity: 0.7;
  margin-top: ${spacing.xs};
  padding: ${spacing.xs} ${spacing.sm};
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: ${borderRadius.sm};
`;


const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: ${spacing.md};
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.sm};
  margin-bottom: ${spacing.md};
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(to right, #6a1fd0, #8a2be2);
  border-radius: ${borderRadius.sm};
  transition: width 0.5s ease;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const FormColumnsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardsSectionIcon = styled.span`
  margin-right: ${spacing.xs};
  color: ${colors.primary};
`;

const ProjectCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${spacing.md};
  margin-bottom: ${spacing.md};
`;

const StepGuidance = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-top: ${spacing.md};
  padding: ${spacing.sm};
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: ${borderRadius.sm};
`;

export default TaskWizard;
