import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaCheck, FaInfoCircle, FaClipboardList, 
  FaCalendarAlt, FaUserAlt, FaClock, FaFlag, FaProjectDiagram,
  FaTimes, FaExclamationTriangle,
  FaRegLightbulb, FaStar, FaSpinner, FaTasks
} from 'react-icons/fa';
import { FormSelect } from '../../components/Common/FormComponents';
import Modal from '../Common/Modal';
import { rtl, ltr, rtlValue, getFontFamily } from '../../utils/rtl';
import '../../styles/rtl.css';
import { colors, spacing, borderRadius, shadows, transitions, typography, breakpoints } from '../../styles/GlobalTheme';
import { motion, AnimatePresence } from 'framer-motion';

// Import reusable wizard components
// Mock implementations of wizard components until they are properly created
const TextInput = ({ value, onChange, placeholder, error, required }) => (
  <input
    type="text"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{ borderColor: error ? '#ff5252' : undefined }}
    required={required}
  />
);

const SearchableDropdown = ({ value, onChange, options, placeholder, error, required }) => (
  <select
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    style={{ borderColor: error ? '#ff5252' : undefined }}
    required={required}
  >
    <option value="" disabled>{placeholder}</option>
    {options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
);

const SelectableCards = ({ options, selectedValue, onChange, required, isRTL }) => (
  <div 
    style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
      gap: '16px' 
    }}
    className={isRTL ? 'rtl-mode' : ''}
  >
    {options.map(option => (
      <div 
        key={option.id}
        onClick={() => onChange(option.id)}
        style={{
          padding: '16px',
          borderRadius: '8px',
          border: `1px solid ${selectedValue === option.id ? '#4a6cf7' : 'rgba(255, 255, 255, 0.2)'}`,
          background: selectedValue === option.id ? 'rgba(74, 108, 247, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: isRTL ? 'right' : 'left',
          direction: isRTL ? 'rtl' : 'ltr'
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '8px',
          flexDirection: isRTL ? 'row-reverse' : 'row' 
        }}>
          <div style={{ 
            marginRight: isRTL ? '0' : '8px',
            marginLeft: isRTL ? '8px' : '0' 
          }}>{option.icon}</div>
          <div style={{ fontWeight: 'bold' }}>{option.label}</div>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          {option.description}
        </div>
      </div>
    ))}
  </div>
);

const ExpandableTextarea = ({ value, onChange, placeholder, error, required, rows = 3 }) => (
  <textarea
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    style={{ borderColor: error ? '#ff5252' : undefined }}
    required={required}
  />
);

const TimelineSelector = ({ value, onChange, options }) => (
  <div style={{ display: 'flex', gap: '8px' }}>
    {options.map(option => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          background: value === option.value ? 'linear-gradient(135deg, #4a6cf7, #6a1fd0)' : 'rgba(255, 255, 255, 0.1)',
          color: value === option.value ? 'white' : 'inherit',
          cursor: 'pointer'
        }}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const Tooltip = ({ content, children }) => (
  <div style={{ position: 'relative', display: 'inline-block' }}>
    {children}
    <div style={{
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '8px',
      borderRadius: '4px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      fontSize: '0.75rem',
      pointerEvents: 'none',
      opacity: 0,
      transition: 'opacity 0.2s',
      whiteSpace: 'nowrap',
      zIndex: 10
    }}>
      {content}
    </div>
  </div>
);

const SuccessScreen = ({ title, message, primaryAction, secondaryAction }) => (
  <div style={{ textAlign: 'center', padding: '32px 16px' }}>
    <div style={{
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #4a6cf7, #6a1fd0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px'
    }}>
      <FaCheck size={24} color="white" />
    </div>
    <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
    <p style={{ margin: '0 0 24px', color: 'rgba(255, 255, 255, 0.7)' }}>{message}</p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
      {secondaryAction && (
        <button
          onClick={secondaryAction.onClick}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'inherit',
            cursor: 'pointer'
          }}
        >
          {secondaryAction.label}
        </button>
      )}
      {primaryAction && (
        <button
          onClick={primaryAction.onClick}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            background: 'linear-gradient(135deg, #4a6cf7, #6a1fd0)',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          {primaryAction.label}
        </button>
      )}
    </div>
  </div>
);

/**
 * TaskWizard - A multi-step wizard for creating tasks within projects
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
  const [totalSteps] = useState(projectId ? 2 : 3);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('forward');
  
  // Form data
  const [formData, setFormData] = useState({
    projectId: projectId || '',
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: null,
    assignedTo: '',
    estimatedHours: null
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  
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

  // Scroll to top function for better UX when navigating between steps
  const scrollToTop = useCallback(() => {
    // Try different approaches to ensure scroll works across browsers
    if (document.querySelector('.modal-content')) {
      document.querySelector('.modal-content').scrollTop = 0;
    }
    
    // Fallback scrolling methods
    if (window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Additional fallback
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }, []);

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
      setTimeout(() => {
        setCurrentStep(current => current + 1);
        scrollToTop(); // Scroll to top when moving to next step
      }, 300);
    }
  }, [currentStep, totalSteps, validateCurrentStep, markFieldAsTouched, scrollToTop]);
  
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
      if (onTaskAdded) {
        onTaskAdded(formData);
      }
    }, 1000);
  }, [formData, validateCurrentStep, onTaskAdded]);
  
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
            {/* Progress bar container removed as requested */}
            <CenteredFooter isRTL={isRTL} className={isRTL ? 'rtl-mode' : ''}>
              <ModalButton 
                onClick={prevStep} 
                variant="secondary"
                disabled={isSubmitting}
              >
                {currentStep === 1 ? t('common.cancel', 'Cancel') : t('common.back', 'Back')}
              </ModalButton>
              <ModalButton 
                onClick={nextStep}
                variant="primary"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {currentStep === totalSteps ? t('common.create', 'Create') : t('common.next', 'Next')}
              </ModalButton>
            </CenteredFooter>
          </React.Fragment>
        )
      }
    >
      <WizardContainer isRTL={isRTL} className={isRTL ? 'rtl-mode' : ''}>
        <ProgressBar isRTL={isRTL}>
          <ProgressStep 
            active={currentStep >= 1} 
            completed={currentStep > 1}
          >
            {projectId ? '' : '1'}
          </ProgressStep>
          
          {!projectId && (
            <ProgressBarLine active={currentStep > 1} />
          )}
          
          <ProgressStep 
            active={currentStep >= 2} 
            completed={currentStep > 2}
          >
            {projectId ? '1' : '2'}
          </ProgressStep>

          <ProgressBarLine active={currentStep > 2} />
          
          <ProgressStep 
            active={currentStep >= 3} 
            completed={currentStep > 3}
          >
            {projectId ? '2' : '3'}
          </ProgressStep>


        </ProgressBar>

        {/* Render step content based on current step */}
        {showSuccess ? (
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
                onClick: () => {
                  // Reset form but keep project selection
                  setFormData(prev => ({
                    ...prev,
                    title: '',
                    description: '',
                    priority: 'medium', 
                    status: 'todo',
                    dueDate: null,
                    assignedTo: '',
                    estimatedHours: null
                  }));
                  setShowSuccess(false);
                  setTouchedFields({});
                  setErrors({});
                }
              }}
            />
          </SuccessContainer>
        ) : (
          <StepAnimationContainer
            key={currentStep}
            custom={animationDirection}
            variants={{
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
            }}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {currentStep === 1 && (
              <StepContainer isRTL={isRTL}>
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
                    {t('taskWizard.steps.stepCount', 'Step {{current}}/{{total}}', { current: currentStep, total: totalSteps })}
                  </StepIndicator>
                </StepHeader>
                
                <FormSection>
                  {/* Project Selection */}
                  <FormGroup
                    label={t('taskWizard.fields.project', 'Project')}
                    required
                    error={touchedFields.projectId && errors.projectId}
                  >
                    <FormSelect
                      value={formData.projectId || ''}
                      onChange={(e) => handleFieldChange('projectId', e.target.value)}
                      required
                      style={{ borderColor: touchedFields.projectId && errors.projectId ? '#ff5252' : undefined }}
                    >
                      <option value="" disabled>{t('taskWizard.placeholders.selectProject', 'Select a project...')}</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </FormSelect>
                    {touchedFields.projectId && errors.projectId && (
                      <ErrorMessage isRTL={isRTL}>
                        <FaExclamationTriangle />
                        {errors.projectId}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                  
                  {touchedFields.projectId && errors.projectId && (
                    <ErrorMessage isRTL={isRTL}>
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
            )}
            
            {currentStep === 2 && (
              <StepContainer isRTL={isRTL}>
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
                    {t('taskWizard.steps.stepCount', 'Step {{current}}/{{total}}', { current: currentStep, total: totalSteps })}
                  </StepIndicator>
                </StepHeader>
                
                <FormSection>
                  {/* Task Title */}
                  <FormGroup
                    label={t('taskWizard.fields.title', 'Task Title')}
                    required
                    error={touchedFields.title && errors.title}
                  >
                    <TextInput
                      value={formData.title}
                      onChange={(value) => handleFieldChange('title', value)}
                      placeholder={t('taskWizard.placeholders.title', 'Enter task title...')}
                      error={touchedFields.title && errors.title}
                      required
                    />
                    {touchedFields.title && errors.title && (
                      <ErrorMessage isRTL={isRTL}>
                        <FaExclamationTriangle />
                        {errors.title}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                  
                  {/* Task Description */}
                  <FormGroup
                    label={t('taskWizard.fields.description', 'Description')}
                  >
                    <ExpandableTextarea
                      value={formData.description}
                      onChange={(value) => handleFieldChange('description', value)}
                      placeholder={t('taskWizard.placeholders.description', 'Describe the task...')}
                      rows={4}
                    />
                  </FormGroup>
                  
                  {/* Task Priority */}
                  <SectionTitle>
                    <SectionIcon><FaFlag /></SectionIcon>
                    {t('taskWizard.sections.priority', 'Task Priority')}
                  </SectionTitle>
                  
                  <PriorityButtonGroup>
                    <PriorityButton 
                      type="button"
                      active={formData.priority === 'low'}
                      onClick={() => handleFieldChange('priority', 'low')}
                      priority="low"
                    >
                      {t('taskWizard.priority.low', 'Low')}
                    </PriorityButton>
                    <PriorityButton 
                      type="button"
                      active={formData.priority === 'medium'}
                      onClick={() => handleFieldChange('priority', 'medium')}
                      priority="medium"
                    >
                      {t('taskWizard.priority.medium', 'Medium')}
                    </PriorityButton>
                    <PriorityButton 
                      type="button"
                      active={formData.priority === 'high'}
                      onClick={() => handleFieldChange('priority', 'high')}
                      priority="high"
                    >
                      {t('taskWizard.priority.high', 'High')}
                    </PriorityButton>
                  </PriorityButtonGroup>
                  
                  {/* Due Date */}
                  <FormGroup
                    label={t('taskWizard.fields.dueDate', 'Due Date')}
                    error={touchedFields.dueDate && errors.dueDate}
                  >
                    <TextInput
                      value={formData.dueDate || ''}
                      onChange={(value) => handleFieldChange('dueDate', value)}
                      placeholder={t('taskWizard.placeholders.dueDate', 'YYYY-MM-DD')}
                      type="date"
                      error={touchedFields.dueDate && errors.dueDate}
                    />
                    {touchedFields.dueDate && errors.dueDate && (
                      <ErrorMessage isRTL={isRTL}>
                        <FaExclamationTriangle />
                        {errors.dueDate}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                  
                  {/* Estimated Hours */}
                  <FormGroup
                    label={t('taskWizard.fields.estimatedHours', 'Estimated Hours')}
                    error={touchedFields.estimatedHours && errors.estimatedHours}
                  >
                    <TextInput
                      value={formData.estimatedHours || ''}
                      onChange={(value) => handleFieldChange('estimatedHours', value)}
                      placeholder={t('taskWizard.placeholders.estimatedHours', 'e.g. 4')}
                      type="number"
                      error={touchedFields.estimatedHours && errors.estimatedHours}
                    />
                    {touchedFields.estimatedHours && errors.estimatedHours && (
                      <ErrorMessage isRTL={isRTL}>
                        <FaExclamationTriangle />
                        {errors.estimatedHours}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                  
                  {/* Status */}
                  <FormGroup
                    label={t('taskWizard.sections.status', 'Task Status')}
                    error={touchedFields.status && errors.status}
                  >
                    <FormSelect
                      value={formData.status || ''}
                      onChange={(e) => handleFieldChange('status', e.target.value)}
                      required
                      style={{ borderColor: touchedFields.status && errors.status ? '#ff5252' : undefined }}
                    >
                      <option value="" disabled>{t('taskWizard.placeholders.status', 'Select status...')}</option>
                      <option value="todo">{t('taskWizard.status.todo', 'To Do')}</option>
                      <option value="inProgress">{t('taskWizard.status.inProgress', 'In Progress')}</option>
                      <option value="review">{t('taskWizard.status.review', 'Review')}</option>
                      <option value="completed">{t('taskWizard.status.completed', 'Completed')}</option>
                    </FormSelect>
                    {touchedFields.status && errors.status && (
                      <ErrorMessage isRTL={isRTL}>
                        <FaExclamationTriangle />
                        {errors.status}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                </FormSection>
              </StepContainer>
            )}
            
            {currentStep === 3 && (
              <StepContainer isRTL={isRTL}>
                <StepHeader>
                  <StepTitleContainer>
                    <StepIcon>
                      <FaCheck />
                    </StepIcon>
                    <div>
                      <StepTitle>
                        {t('taskWizard.steps.reviewConfirm', 'Review & Confirm')}
                      </StepTitle>
                      <StepDescription>
                        {t('taskWizard.steps.reviewConfirmDesc', 'Review task details before creating')}
                      </StepDescription>
                    </div>
                  </StepTitleContainer>
                  
                  <StepIndicator>
                    {t('taskWizard.steps.stepCount', 'Step {{current}}/{{total}}', { current: currentStep, total: totalSteps })}
                  </StepIndicator>
                </StepHeader>
                
                <FormSection>
                  <SummaryCard isRTL={isRTL}>
                    <SummaryHeader>
                      <SummaryTitle>{formData.title}</SummaryTitle>
                      <SummaryBadge priority={formData.priority}>
                        {t(`taskWizard.priority.${formData.priority}`, formData.priority)}
                      </SummaryBadge>
                    </SummaryHeader>
                    
                    {formData.description && (
                      <SummarySection>
                        <SummarySectionTitle>
                          <FaInfoCircle />
                          {t('taskWizard.fields.description', 'Description')}
                        </SummarySectionTitle>
                        <SummaryText>{formData.description}</SummaryText>
                      </SummarySection>
                    )}
                    
                    <SummaryGrid>
                      <SummaryItem>
                        <SummaryItemLabel>
                          <FaProjectDiagram />
                          {t('taskWizard.fields.project', 'Project')}
                        </SummaryItemLabel>
                        <SummaryItemValue>
                          {formData.projectId ? 
                            projects.find(p => p.id === formData.projectId)?.name || formData.projectId : 
                            t('taskWizard.notSpecified', 'Not specified')}
                        </SummaryItemValue>
                      </SummaryItem>
                      
                      <SummaryItem>
                        <SummaryItemLabel>
                          <FaUserAlt />
                          {t('taskWizard.fields.assignedTo', 'Assigned To')}
                        </SummaryItemLabel>
                        <SummaryItemValue>
                          {formData.assignedTo ? 
                            [
                              { value: 'user1', label: 'Alex Johnson' },
                              { value: 'user2', label: 'Maria Garcia' },
                              { value: 'user3', label: 'David Kim' },
                              { value: 'user4', label: 'Sarah Ahmed' }
                            ].find(opt => opt.value === formData.assignedTo)?.label || formData.assignedTo : 
                            t('taskWizard.notSpecified', 'Not specified')}
                        </SummaryItemValue>
                      </SummaryItem>
                      
                      <SummaryItem>
                        <SummaryItemLabel>
                          <FaCalendarAlt />
                          {t('taskWizard.fields.dueDate', 'Due Date')}
                        </SummaryItemLabel>
                        <SummaryItemValue>
                          {formData.dueDate || t('taskWizard.notSpecified', 'Not specified')}
                        </SummaryItemValue>
                      </SummaryItem>
                      
                      <SummaryItem>
                        <SummaryItemLabel>
                          <FaClock />
                          {t('taskWizard.fields.estimatedHours', 'Estimated Hours')}
                        </SummaryItemLabel>
                        <SummaryItemValue>
                          {formData.estimatedHours ? `${formData.estimatedHours} ${t('taskWizard.hours', 'hours')}` : t('taskWizard.notSpecified', 'Not specified')}
                        </SummaryItemValue>
                      </SummaryItem>
                      
                      <SummaryItem>
                        <SummaryItemLabel>
                          <FaTasks />
                          {t('taskWizard.fields.status', 'Status')}
                        </SummaryItemLabel>
                        <SummaryItemValue>
                          <StatusBadge status={formData.status}>
                            {t(`taskWizard.status.${formData.status || 'todo'}`, formData.status || 'To Do')}
                          </StatusBadge>
                        </SummaryItemValue>
                      </SummaryItem>
                    </SummaryGrid>
                    
                    <SummaryFooter>
                      <InfoMessage isRTL={isRTL}>
                        <FaInfoCircle />
                        {t('taskWizard.reviewMessage', 'Please review all details before creating the task.')}
                      </InfoMessage>
                    </SummaryFooter>
                  </SummaryCard>
                </FormSection>
              </StepContainer>
            )}
          </StepAnimationContainer>
        )}
      </WizardContainer>
    </Modal>
  );
};

// Styled components
const WizardContainer = styled.div`
  padding: 0 ${spacing.lg} ${spacing.lg};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  display: flex;
  flex-direction: column;
  color: ${colors.text.primary};
  font-family: ${typography.fontFamily};
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

const ProgressStep = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => {
    if (props.completed) return 'linear-gradient(135deg, #6a1fd0, #4a6cf7)';
    if (props.active) return 'linear-gradient(135deg, #4a6cf7, #6a1fd0)';
    return 'linear-gradient(135deg, rgba(30, 30, 60, 0.6), rgba(20, 20, 40, 0.8))';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${typography.fontWeights.semiBold};
  font-family: ${typography.fontFamily};
  color: white;
  position: relative;
  z-index: 1;
  transition: all ${transitions.fast};
  box-shadow: ${props => {
    if (props.completed) return '0 0 15px rgba(106, 31, 208, 0.5)';
    if (props.active) return '0 0 15px rgba(74, 108, 247, 0.3)';
    return '0 2px 4px rgba(0, 0, 0, 0.2)';
  }};
  border: 3px solid ${props => {
    if (props.completed) return 'rgba(106, 31, 208, 1)';
    if (props.active) return 'rgba(138, 43, 226, 0.8)';
    return 'rgba(74, 108, 247, 0.2)';
  }};
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
    transform: ${props => (props.active || props.completed) ? 'scale(1.1)' : 'scale(1.05)'};
    box-shadow: ${props => {
      if (props.completed) return '0 0 20px rgba(106, 31, 208, 0.6)';
      if (props.active) return '0 0 20px rgba(74, 108, 247, 0.4)';
      return '0 4px 8px rgba(0, 0, 0, 0.3)';
    }};
  }
  
  /* Add a subtle pulse animation for active steps */
  ${props => props.active && !props.completed && css`
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

const ProgressBarLine = styled.div`
  height: 3px;
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  
  ${props => props.active && css`
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: linear-gradient(to right, #4a6cf7, #6a1fd0);
      box-shadow: 0 0 8px rgba(74, 108, 247, 0.5);
    }
  `}
  
  @media (max-width: ${breakpoints.sm}) {
    height: 2px;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.sm};
  margin-bottom: ${spacing.md};
  overflow: hidden;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  padding-top: ${spacing.md};
  
  @media (max-width: ${breakpoints.sm}) {
    flex-direction: ${props => props.isRTL ? 'column' : 'column-reverse'};
    gap: ${spacing.sm};
  }
`;

const CenteredFooter = styled(Footer)`
  justify-content: center;
  gap: ${spacing.md};
  
  @media (max-width: ${breakpoints.sm}) {
    gap: ${spacing.sm};
  }
`;

const ModalButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.sm} ${spacing.lg};
  border-radius: ${borderRadius.md};
  font-weight: ${typography.fontWeights.medium};
  transition: all ${transitions.fast};
  cursor: pointer;
  border: none;
  font-family: ${typography.fontFamily};
  
  ${props => props.variant === 'primary' && css`
    background: linear-gradient(135deg, #4a6cf7, #6a1fd0);
    color: white;
    box-shadow: ${shadows.medium};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${shadows.large};
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: ${shadows.small};
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background: rgba(255, 255, 255, 0.1);
    color: ${colors.text.primary};
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    &:active {
      background: rgba(255, 255, 255, 0.05);
    }
  `}
  
  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  `}
  
  ${props => props.isLoading && css`
    position: relative;
    color: transparent;
    
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      margin: -10px 0 0 -10px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `}
  
  @media (max-width: ${breakpoints.sm}) {
    width: 100%;
    padding: ${spacing.sm} ${spacing.md};
  }
`;

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

// Step container and components
const StepContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.lg};
  
  @media (max-width: ${breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.sm};
  }
`;

const StepTitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const StepIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a6cf7, #6a1fd0);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-${props => props.isRTL ? 'left' : 'right'}: ${spacing.md};
  box-shadow: 0 0 15px rgba(74, 108, 247, 0.3);
  
  svg {
    color: white;
    font-size: 1.2rem;
  }
  
  @media (max-width: ${breakpoints.sm}) {
    width: 36px;
    height: 36px;
    margin-${props => props.isRTL ? 'left' : 'right'}: ${spacing.sm};
    
    svg {
      font-size: 1rem;
    }
  }
`;

const StepTitle = styled.h3`
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.semiBold};
  margin: 0 0 ${spacing.xxs} 0;
  color: ${colors.text.primary};
  
  @media (max-width: ${breakpoints.sm}) {
    font-size: ${typography.fontSizes.md};
  }
`;

const StepDescription = styled.p`
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  margin: 0;
  
  @media (max-width: ${breakpoints.sm}) {
    font-size: ${typography.fontSizes.xs};
  }
`;

const StepIndicator = styled.div`
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  background: rgba(255, 255, 255, 0.1);
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
`;

const FormSection = styled.div`
  margin-bottom: ${spacing.xl};
`;

const FormGroup = styled.div`
  margin-bottom: ${spacing.md};
  
  label {
    display: block;
    font-size: ${typography.fontSizes.sm};
    font-weight: ${typography.fontWeights.medium};
    margin-bottom: ${spacing.xs};
    color: ${colors.text.primary};
    
    ${props => props.required && `
      &:after {
        content: '*';
        color: #ff5252;
        margin-left: 4px;
      }
    `}
  }
  
  input, select, textarea {
    width: 100%;
    padding: ${spacing.sm};
    border-radius: ${borderRadius.sm};
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid ${props => props.error ? '#ff5252' : 'rgba(255, 255, 255, 0.2)'};
    color: ${colors.text.primary};
    font-family: ${typography.fontFamily};
    font-size: ${typography.fontSizes.sm};
    transition: all ${transitions.fast};
    
    &:focus {
      outline: none;
      border-color: #4a6cf7;
      box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.3);
    }
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const SectionTitle = styled.h4`
  display: flex;
  align-items: center;
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.text.primary};
  margin: ${spacing.lg} 0 ${spacing.md};
  
  @media (max-width: ${breakpoints.sm}) {
    font-size: ${typography.fontSizes.sm};
  }
`;

const SectionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
  color: #4a6cf7;
`;

const ProjectCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  
  @media (max-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMessage = styled.div`
  color: #ff5252;
  font-size: ${typography.fontSizes.sm};
  margin-top: ${spacing.xs};
  display: flex;
  align-items: center;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  
  svg {
    margin-right: ${spacing.xs};
    font-size: 0.875rem;
  }
`;

const StepGuidance = styled.div`
  background: rgba(74, 108, 247, 0.1);
  border-left: 3px solid #4a6cf7;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  margin-top: ${spacing.lg};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${spacing.sm};
    color: #4a6cf7;
  }
`;

const StepAnimationContainer = styled(motion.div)`
  width: 100%;
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl} 0;
  text-align: center;
`;

// Priority button styling
const PriorityButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.md};
  flex-wrap: wrap;
  
  @media (max-width: ${breakpoints.sm}) {
    gap: ${spacing.xs};
  }
`;

const PriorityButton = styled.button`
  flex: 1;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  background-color: ${props => {
    if (props.active) {
      if (props.priority === 'low') return 'rgba(39, 174, 96, 0.8)';
      if (props.priority === 'medium') return 'rgba(241, 196, 15, 0.8)';
      if (props.priority === 'high') return 'rgba(231, 76, 60, 0.8)';
      return 'rgba(74, 108, 247, 0.2)';
    }
    return 'rgba(255, 255, 255, 0.05)';
  }};
  color: white;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${props => {
    if (props.active) {
      if (props.priority === 'low') return '#27AE60';
      if (props.priority === 'medium') return '#F1C40F';
      if (props.priority === 'high') return '#E74C3C';
      return 'rgba(74, 108, 247, 0.5)';
    }
    return 'transparent';
  }};
  
  &:hover {
    background-color: ${props => {
      if (props.priority === 'low') return 'rgba(39, 174, 96, 0.6)';
      if (props.priority === 'medium') return 'rgba(241, 196, 15, 0.6)';
      if (props.priority === 'high') return 'rgba(231, 76, 60, 0.6)';
      return 'rgba(74, 108, 247, 0.2)';
    }};
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => {
      if (props.priority === 'low') return 'rgba(39, 174, 96, 0.5)';
      if (props.priority === 'medium') return 'rgba(241, 196, 15, 0.5)';
      if (props.priority === 'high') return 'rgba(231, 76, 60, 0.5)';
      return 'rgba(74, 108, 247, 0.5)';
    }};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Summary styled components for step 4
const SummaryCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  box-shadow: ${shadows.medium};
  border: 1px solid rgba(255, 255, 255, 0.1);
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  
  @media (max-width: ${breakpoints.sm}) {
    padding: ${spacing.md};
  }
`;

const SummaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
  padding-bottom: ${spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: ${breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.sm};
  }
`;

const SummaryTitle = styled.h3`
  font-size: ${typography.fontSizes.xl};
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.text.primary};
  margin: 0;
`;

const SummaryBadge = styled.span`
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.semiBold};
  background: ${props => {
    switch(props.priority) {
      case 'low': return 'linear-gradient(135deg, #4caf50, #2e7d32)';
      case 'medium': return 'linear-gradient(135deg, #ff9800, #ef6c00)';
      case 'high': return 'linear-gradient(135deg, #f44336, #c62828)';
      default: return 'linear-gradient(135deg, #4a6cf7, #6a1fd0)';
    }
  }};
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const StatusBadge = styled.span`
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.semiBold};
  background: ${props => {
    switch(props.status) {
      case 'todo': return 'linear-gradient(135deg, #4a6cf7, #6a1fd0)';
      case 'inProgress': return 'linear-gradient(135deg, #ff9800, #ef6c00)';
      case 'review': return 'linear-gradient(135deg, #9c27b0, #6a1fd0)';
      default: return 'linear-gradient(135deg, #4a6cf7, #6a1fd0)';
    }
  }};
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const SummarySection = styled.div`
  margin-bottom: ${spacing.md};
  padding-bottom: ${spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SummarySectionTitle = styled.h4`
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing.sm} 0;
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  
  svg {
    color: ${colors.accent.primary};
  }
`;

const SummaryText = styled.p`
  font-size: ${typography.fontSizes.md};
  color: ${colors.text.secondary};
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.md};
  margin-bottom: ${spacing.md};
  
  @media (max-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const SummaryItemLabel = styled.div`
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  
  svg {
    color: ${colors.accent.primary};
  }
`;

const SummaryItemValue = styled.div`
  font-size: ${typography.fontSizes.md};
  color: ${colors.text.primary};
`;

const SummaryFooter = styled.div`
  margin-top: ${spacing.md};
  padding-top: ${spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const InfoMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: ${spacing.sm};
  border-radius: ${borderRadius.md};
  background: rgba(74, 108, 247, 0.1);
  color: ${colors.text.primary};
  font-size: ${typography.fontSizes.sm};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  svg {
    color: ${colors.accent.primary};
    flex-shrink: 0;
  }
`;

export default TaskWizard;