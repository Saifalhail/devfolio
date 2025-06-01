import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes, css } from 'styled-components';
import { colors, typography, spacing, borderRadius, transitions, breakpoints } from '../../styles/theme';
import { 
  FaUser, 
  FaBuilding, 
  FaClipboardList, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaQuestionCircle, 
  FaCalendarAlt, 
  FaTag, 
  FaFolder, 
  FaFolderOpen, 
  FaImage, 
  FaImages, 
  FaVideo, 
  FaFileAudio, 
  FaFile, 
  FaFileAlt, 
  FaFilePdf, 
  FaFileExcel, 
  FaFileWord, 
  FaTrash, 
  FaMagic, 
  FaEdit,
  FaCode,
  FaDatabase,
  FaMobile,
  FaDesktop,
  FaGlobe,
  FaDollarSign, 
  FaUsers,
  FaLaptopCode,
  FaLightbulb,
  FaCloud,
  FaServer,
  FaSpinner,
  FaPlus,
  FaFileUpload,
  FaLink,
  FaLock,
  FaUserFriends,
  FaChartLine,
  FaRocket,
  FaInfoCircle,
  FaExclamationTriangle,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaRegClock,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

// Define RadioInput component to be used throughout the file
const RadioInput = ({ type, id, name, value, checked, onChange }) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      style={{
        marginRight: '8px',
        cursor: 'pointer',
        accentColor: '#cd3efd'
      }}
    />
  );
};

/**
 * Project Wizard Component
 * 
 * An interactive step-by-step wizard for gathering project requirements
 * and creating detailed project specifications.
 */
const ProjectWizard = ({ isOpen, onClose, onProjectAdded }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { currentUser } = useAuth();
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data - Step 1: Basic Project Details
  const [formData, setFormData] = useState({
    // Basic details
    projectName: '',
    clientName: '',
    projectDescription: '',
    deadline: '',
    projectStatus: 'notStarted',
    
    // Target audience
    targetAudience: [],
    ageRange: '',
    geographicFocus: '',
    primaryLanguage: '',
    secondaryLanguages: [],
    accessibilityRequirements: '',
    
    // Functional requirements
    authenticationFeatures: [],
    dataManagementFeatures: [],
    coreApplicationFeatures: [],
    otherFeatures: '',
    
    // Technical preferences
    targetPlatforms: [],
    preferredFrontend: '',
    preferredBackend: '',
    responsiveDesign: 'all',
    hostingPreference: 'undecided',
    additionalTechRequirements: '',
    
    // Budget & resources
    budgetRange: '',
    timeframe: '',
    existingAssets: [],
    maintenanceSupport: false,
    additionalBudgetInfo: '',
    
    // Additional details
    projectBackground: '',
    competitorReferences: '',
    additionalComments: '',
    attachments: [],
    prioritySpeed: 3,
    priorityQuality: 3,
    priorityCost: 3,
    
    // Confirmation
    confirmSubmission: false,
    
    // Metadata
    createdAt: null,
    updatedAt: null,
    userId: '',
    status: 'draft'
  });

  // Target audience options
  const targetAudienceOptions = [
    { id: 'consumers', label: t('projects.consumers', 'Consumers (Public Users)') },
    { id: 'business', label: t('projects.business', 'Business/Corporate Users') },
    { id: 'internal', label: t('projects.internal', 'Internal Employees') },
    { id: 'other', label: t('projects.otherGroup', 'Other') }
  ];

  // Geographic location options
  const locationOptions = [
    { id: 'local', label: t('projects.local', 'Local (within city/region)') },
    { id: 'national', label: t('projects.national', 'National (country-wide)') },
    { id: 'international', label: t('projects.international', 'International (global)') },
    { id: 'specific', label: t('projects.specificCountries', 'Specific countries') }
  ];

  // Check if current step is complete
  
  // Check if step is complete
  const isStepComplete = () => {
    switch (currentStep) {
      case 1: // Basic Project Details
        return formData.projectName?.trim() || true; // Allow proceeding with just a name or even without
      case 2: // Target Audience
        return true; // Allow proceeding without selections
      case 3: // Functional Requirements
        return true; // Allow proceeding without selections
      case 4: // Technical Preferences
        return true; // Allow proceeding without selections
      case 5: // Budget & Resources
        return true; // Allow proceeding without selections
      case 6: // Additional Details
        return true; // No required fields in this step
      case 7: // Review & Confirmation
        return true; // Allow submission without confirmation for now
      default:
        return true;
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const currentValues = [...prev[field]];
      
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  // Handle radio/dropdown selection
  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle text input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  // Handle removing attachments
  const handleRemoveAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      projectName: '',
      clientName: '',
      projectDescription: '',
      deadline: '',
      projectStatus: 'notStarted',
      targetAudience: [],
      ageRange: '',
      geographicFocus: '',
      primaryLanguage: '',
      secondaryLanguages: [],
      accessibilityRequirements: '',
      authenticationFeatures: [],
      dataManagementFeatures: [],
      coreApplicationFeatures: [],
      otherFeatures: '',
      targetPlatforms: [],
      preferredFrontend: '',
      preferredBackend: '',
      responsiveDesign: 'all',
      hostingPreference: 'undecided',
      additionalTechRequirements: '',
      budgetRange: '',
      timeframe: '',
      existingAssets: [],
      maintenanceSupport: false,
      additionalBudgetInfo: '',
      projectBackground: '',
      competitorReferences: '',
      additionalComments: '',
      attachments: [],
      prioritySpeed: 3,
      priorityQuality: 3,
      priorityCost: 3,
      confirmSubmission: false,
      createdAt: null,
      updatedAt: null,
      userId: '',
      status: 'draft'
    });
    setCurrentStep(1);
    setError('');
    setSuccess('');
  };

  // Handle next step button click
  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    
    if (isStepComplete()) {
      // Smooth transition to next step
      setCurrentStep(prev => prev + 1);
      
      // Scroll to top of modal content
      const modalContent = document.querySelector('.modal-content');
      if (modalContent) {
        modalContent.scrollTop = 0;
      } else {
        window.scrollTo(0, 0);
      }
      
      // Clear any previous errors
      setError('');
    } else {
      setError(t('projects.completeRequiredFields', 'Please complete all required fields before proceeding'));
    }
  };

  // Handle previous step button click
  const handlePrevStep = (e) => {
    if (e) e.preventDefault();
    
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      
      // Scroll to top of modal content
      const modalContent = document.querySelector('.modal-content');
      if (modalContent) {
        modalContent.scrollTop = 0;
      } else {
        window.scrollTo(0, 0);
      }
      
      // Clear any previous errors
      setError('');
    }
  };

  // Handle AI generation
  const handleGenerateWithAI = () => {
    // This is a placeholder for the AI generation functionality
    // In the future, this will connect to an AI service to generate project requirements
    console.log('Generating project requirements with AI...');
    
    // For now, show a success message
    setSuccess(t('projects.aiGenerating', 'AI is generating your project requirements...'));
    
    // Clear the success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (currentStep < totalSteps) {
      handleNextStep();
      return;
    }
    
    if (!formData.confirmSubmission) {
      setError(t('projects.pleaseConfirm', 'Please confirm your submission by checking the confirmation box'));
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare project data
      const projectData = {
        // Basic details
        projectName: formData.projectName,
        clientName: formData.clientName,
        projectDescription: formData.projectDescription,
        deadline: formData.deadline,
        projectStatus: formData.projectStatus,
        
        // Target audience
        targetAudience: formData.targetAudience,
        ageRange: formData.ageRange,
        geographicFocus: formData.geographicFocus,
        primaryLanguage: formData.primaryLanguage,
        secondaryLanguages: formData.secondaryLanguages,
        accessibilityRequirements: formData.accessibilityRequirements,
        
        // Functional requirements
        authenticationFeatures: formData.authenticationFeatures,
        dataManagementFeatures: formData.dataManagementFeatures,
        coreApplicationFeatures: formData.coreApplicationFeatures,
        otherFeatures: formData.otherFeatures,
        
        // Technical preferences
        targetPlatforms: formData.targetPlatforms,
        preferredFrontend: formData.preferredFrontend,
        preferredBackend: formData.preferredBackend,
        responsiveDesign: formData.responsiveDesign,
        hostingPreference: formData.hostingPreference,
        additionalTechRequirements: formData.additionalTechRequirements,
        
        // Budget & resources
        budgetRange: formData.budgetRange,
        timeframe: formData.timeframe,
        existingAssets: formData.existingAssets,
        maintenanceSupport: formData.maintenanceSupport,
        additionalBudgetInfo: formData.additionalBudgetInfo,
        
        // Additional details
        projectBackground: formData.projectBackground,
        competitorReferences: formData.competitorReferences,
        additionalComments: formData.additionalComments,
        attachmentCount: formData.attachments ? formData.attachments.length : 0,
        prioritySpeed: formData.prioritySpeed,
        priorityQuality: formData.priorityQuality,
        priorityCost: formData.priorityCost,
        
        // Metadata
        userId: currentUser?.uid || '',
        userEmail: currentUser?.email || '',
        userName: currentUser?.displayName || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'submitted'
      };
      
      // Add project to Firestore
      const docRef = await addDoc(collection(db, 'projects'), projectData);
      
      setIsSubmitting(false);
      setSuccess(t('projects.projectCreated', 'Project created successfully!'));
      
      // Reset form and close modal after a delay
      setTimeout(() => {
        resetForm();
        onProjectAdded();
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error creating project:', error);
      setIsSubmitting(false);
      setError(t('projects.errorCreatingProject', 'Error creating project. Please try again.'));
    }
  };

  // Authentication features options
  const authFeatureOptions = [
    { id: 'userLogin', label: t('projects.userLogin', 'User login/sign-up functionality') },
    { id: 'socialLogin', label: t('projects.socialLogin', 'Social media login (Google, Facebook, etc.)') },
    { id: 'multiRole', label: t('projects.multiRole', 'Multi-role user system (Admin/User roles)') },
    { id: 'passwordReset', label: t('projects.passwordReset', 'Password recovery/reset feature') }
  ];

  // Data management features options
  const dataFeatureOptions = [
    { id: 'database', label: t('projects.database', 'Database setup and management') },
    { id: 'realtime', label: t('projects.realtime', 'Real-time data synchronization') },
    { id: 'offline', label: t('projects.offline', 'Offline data access') },
    { id: 'fileUploads', label: t('projects.fileUploads', 'File uploads/downloads (PDF, Images, etc.)') },
    { id: 'cloudStorage', label: t('projects.cloudStorage', 'Cloud storage requirements') }
  ];

  // Core application features options
  const coreFeatureOptions = [
    { id: 'payments', label: t('projects.payments', 'Payment processing & transaction support') },
    { id: 'chat', label: t('projects.chat', 'Chat and messaging capability') },
    { id: 'notifications', label: t('projects.notifications', 'Notifications (Email, SMS, Push)') },
    { id: 'location', label: t('projects.location', 'Location-based services (Maps, GPS integration)') },
    { id: 'calendar', label: t('projects.calendar', 'Calendar & scheduling systems') },
    { id: 'social', label: t('projects.social', 'Social media integrations') },
    { id: 'analytics', label: t('projects.analytics', 'Analytics & reporting dashboards') },
    { id: 'externalApis', label: t('projects.externalApis', 'Integration with external APIs/services') }
  ];

  // Platform options
  const platformOptions = [
    { id: 'web', label: t('projects.web', 'Web Application') },
    { id: 'ios', label: t('projects.ios', 'iOS Mobile App') },
    { id: 'android', label: t('projects.android', 'Android Mobile App') },
    { id: 'desktop', label: t('projects.desktop', 'Desktop Application') },
    { id: 'pwa', label: t('projects.pwa', 'Progressive Web App (PWA)') }
  ];

  // Frontend technology options
  const frontendOptions = [
    { id: 'react', label: 'React.js' },
    { id: 'vue', label: 'Vue.js' },
    { id: 'angular', label: 'Angular' },
    { id: 'next', label: 'Next.js' },
    { id: 'svelte', label: 'Svelte' },
    { id: 'flutter', label: 'Flutter' },
    { id: 'reactNative', label: 'React Native' },
    { id: 'swift', label: 'Swift (iOS)' },
    { id: 'kotlin', label: 'Kotlin (Android)' },
    { id: 'other', label: t('projects.other', 'Other / Not sure') }
  ];

  // Backend technology options
  const backendOptions = [
    { id: 'node', label: 'Node.js' },
    { id: 'python', label: 'Python' },
    { id: 'java', label: 'Java' },
    { id: 'php', label: 'PHP' },
    { id: 'ruby', label: 'Ruby' },
    { id: 'dotnet', label: '.NET' },
    { id: 'firebase', label: 'Firebase' },
    { id: 'aws', label: 'AWS' },
    { id: 'other', label: t('projects.other', 'Other / Not sure') }
  ];

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicDetailsStep();
      case 2:
        return renderTargetAudienceStep();
      case 3:
        return renderFunctionalRequirementsStep();
      case 4:
        return renderTechnicalPreferencesStep();
      case 5:
        return renderBudgetResourcesStep();
      case 6:
        return renderAdditionalDetailsStep();
      case 7:
        return renderReviewConfirmationStep();
      default:
        return null;
    }
  };

  // Step 1: Basic Project Details
  const renderBasicDetailsStep = () => {
    return (
      <StepContainer>
        <StepTitle>
          <StepIcon><FaEdit /></StepIcon>
          {t('projects.basicDetails', 'Basic Project Details')}
        </StepTitle>
        <StepDescription>
          {t('projects.basicDetailsDesc', 'Let\'s start with the essential information about your project.')}
        </StepDescription>
        
        <FormGroup>
          <FormLabel>{t('projects.projectName', 'Project Name')}*</FormLabel>
          <FormInput
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            placeholder={t('projects.projectNamePlaceholder', 'Enter project name')}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>{t('projects.clientName', 'Client Name')}*</FormLabel>
          <FormInput
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            placeholder={t('projects.clientNamePlaceholder', 'Enter client name')}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>{t('projects.projectDescription', 'Project Description')}*</FormLabel>
          <FormTextarea
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleInputChange}
            placeholder={t('projects.projectDescPlaceholder', 'Describe the project and its goals')}
            rows={4}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>{t('projects.deadline', 'Project Deadline')}*</FormLabel>
          <FormInput
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>{t('projects.initialStatus', 'Initial Project Status')}</FormLabel>
          <SelectWrapper>
            <FormSelect
              name="projectStatus"
              value={formData.projectStatus}
              onChange={handleInputChange}
            >
              <option value="notStarted">{t('projects.notStarted', 'Not Started')}</option>
              <option value="inProgress">{t('projects.inProgress', 'In Progress')}</option>
              <option value="onHold">{t('projects.onHold', 'On Hold')}</option>
              <option value="completed">{t('projects.completed', 'Completed')}</option>
            </FormSelect>
          </SelectWrapper>
        </FormGroup>
      </StepContainer>
    );
  };

  // Step 2: Target Audience & User Details
  const renderTargetAudienceStep = () => {
    return (
      <StepContainer>
        <StepTitle>
          <StepIcon><FaUsers /></StepIcon>
          {t('projects.targetAudience', 'Target Audience & User Details')}
        </StepTitle>
        <StepDescription>
          {t('projects.targetAudienceDesc', 'Define who will be using your application and their characteristics.')}
        </StepDescription>
        
        <FormGroup>
          <FormLabel>{t('projects.targetAudience', 'Target Audience')}*</FormLabel>
          <CheckboxGroup>
            {targetAudienceOptions.map(option => (
              <CheckboxItem key={option.id}>
                <Checkbox
                  type="checkbox"
                  id={`targetAudience-${option.id}`}
                  checked={formData.targetAudience.includes(option.id)}
                  onChange={() => handleCheckboxChange('targetAudience', option.id)}
                />
                <CheckboxLabel htmlFor={`targetAudience-${option.id}`}>
                  {option.label}
                </CheckboxLabel>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>{t('projects.ageRange', 'Age Range')}</FormLabel>
          <FormInput
            type="text"
            name="ageRange"
            value={formData.ageRange}
            onChange={handleInputChange}
            placeholder={t('projects.ageRangePlaceholder', 'Enter age range')}
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>{t('projects.geographicFocus', 'Geographic Focus')}</FormLabel>
          <FormInput
            type="text"
            name="geographicFocus"
            value={formData.geographicFocus}
            onChange={handleInputChange}
            placeholder={t('projects.geographicFocusPlaceholder', 'Enter geographic focus')}
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>{t('projects.primaryLanguage', 'Primary Language')}*</FormLabel>
          <FormInput
            type="text"
            name="primaryLanguage"
            value={formData.primaryLanguage}
            onChange={handleInputChange}
            placeholder={t('projects.primaryLanguagePlaceholder', 'Enter primary language')}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>{t('projects.secondaryLanguages', 'Secondary Languages')}</FormLabel>
          <FormInput
            type="text"
            name="secondaryLanguages"
            value={formData.secondaryLanguages}
            onChange={handleInputChange}
            placeholder={t('projects.secondaryLanguagesPlaceholder', 'Enter secondary languages')}
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>{t('projects.accessibilityRequirements', 'Accessibility Requirements')}</FormLabel>
          <FormTextarea
            name="accessibilityRequirements"
            value={formData.accessibilityRequirements}
            onChange={handleInputChange}
            placeholder={t('projects.accessibilityRequirementsPlaceholder', 'Describe accessibility requirements')}
            rows={3}
          />
        </FormGroup>
      </StepContainer>
    );
  };

  // Step 3: Functional Requirements
  const renderFunctionalRequirementsStep = () => {
    return (
      <StepContainer>
        <StepTitle>
          <StepIcon><FaCode /></StepIcon>
          {t('projects.functionalRequirements', 'Detailed Functional Requirements')}
        </StepTitle>
        <StepDescription>
          {t('projects.functionalRequirementsDesc', 'Select the features and functionality you need for your application.')}
        </StepDescription>
        
        <CategorySection>
          <CategoryTitle>
            <CategoryIcon><FaUsers /></CategoryIcon>
            {t('projects.authenticationFeatures', 'User Authentication & Accounts')}
          </CategoryTitle>
          <CheckboxGroup>
            {authFeatureOptions.map(option => (
              <CheckboxItem key={option.id}>
                <Checkbox
                  type="checkbox"
                  id={`auth-${option.id}`}
                  checked={formData.authenticationFeatures.includes(option.id)}
                  onChange={() => handleCheckboxChange('authenticationFeatures', option.id)}
                />
                <CheckboxLabel htmlFor={`auth-${option.id}`}>
                  {option.label}
                </CheckboxLabel>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </CategorySection>
        
        <CategorySection>
          <CategoryTitle>
            <CategoryIcon><FaDatabase /></CategoryIcon>
            {t('projects.dataManagement', 'Data & File Management')}
          </CategoryTitle>
          <CheckboxGroup>
            {dataFeatureOptions.map(option => (
              <CheckboxItem key={option.id}>
                <Checkbox
                  type="checkbox"
                  id={`data-${option.id}`}
                  checked={formData.dataManagementFeatures.includes(option.id)}
                  onChange={() => handleCheckboxChange('dataManagementFeatures', option.id)}
                />
                <CheckboxLabel htmlFor={`data-${option.id}`}>
                  {option.label}
                </CheckboxLabel>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </CategorySection>
        
        <CategorySection>
          <CategoryTitle>
            <CategoryIcon><FaLightbulb /></CategoryIcon>
            {t('projects.coreFeatures', 'Core Application Features')}
          </CategoryTitle>
          <CheckboxGroup>
            {coreFeatureOptions.map(option => (
              <CheckboxItem key={option.id}>
                <Checkbox
                  type="checkbox"
                  id={`core-${option.id}`}
                  checked={formData.coreApplicationFeatures.includes(option.id)}
                  onChange={() => handleCheckboxChange('coreApplicationFeatures', option.id)}
                />
                <CheckboxLabel htmlFor={`core-${option.id}`}>
                  {option.label}
                </CheckboxLabel>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </CategorySection>
        
        <FormGroup>
          <FormLabel>{t('projects.otherFeatures', 'Other custom features')}</FormLabel>
          <FormTextarea
            name="otherFeatures"
            value={formData.otherFeatures}
            onChange={handleInputChange}
            placeholder={t('projects.otherFeaturesPlaceholder', 'Describe any other custom features you need')}
            rows={3}
          />
        </FormGroup>
        
        <AIButtonContainer>
          <AIFeatureIcon><FaMagic /></AIFeatureIcon>
          <AIFeatureTitle>{t('projects.aiAssistant', 'AI Requirements Assistant')}</AIFeatureTitle>
          <AIButtonDescription>
            {t('projects.generateWithAIDesc', 'Let AI suggest functional requirements based on your project description and goals.')}
          </AIButtonDescription>
          <AIButton onClick={handleGenerateWithAI}>
            <FaMagic />
            {t('projects.generateWithAI', 'Generate with AI')}
          </AIButton>
        </AIButtonContainer>
      </StepContainer>
    );
  };

  // Step 4: Technical & Platform Preferences
  const renderTechnicalPreferencesStep = () => {
    return (
      <StepContainer>
        <StepTitle>
          <StepIcon><FaLaptopCode /></StepIcon>
          {t('projects.technicalPreferences', 'Technical & Platform Preferences')}
        </StepTitle>
        <StepDescription>
          {t('projects.technicalPreferencesDesc', 'Tell us about your technical requirements and platform preferences.')}
        </StepDescription>
        
        <CategorySection>
          <CategoryTitle>
            <CategoryIcon><FaDesktop /></CategoryIcon>
            {t('projects.targetPlatforms', 'Target Platforms')}
          </CategoryTitle>
          <CheckboxGroup>
            {platformOptions.map(option => (
              <CheckboxItem key={option.id}>
                <Checkbox
                  type="checkbox"
                  id={`platform-${option.id}`}
                  checked={formData.targetPlatforms.includes(option.id)}
                  onChange={() => handleCheckboxChange('targetPlatforms', option.id)}
                />
                <CheckboxLabel htmlFor={`platform-${option.id}`}>
                  {option.label}
                </CheckboxLabel>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </CategorySection>
        
        <FormRow>
          <FormGroup>
            <FormLabel>{t('projects.preferredFrontend', 'Preferred Frontend Technology')}</FormLabel>
            <FormSelect
              name="preferredFrontend"
              value={formData.preferredFrontend}
              onChange={handleInputChange}
            >
              <option value="">{t('projects.selectOption', 'Select an option')}</option>
              {frontendOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </FormSelect>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>{t('projects.preferredBackend', 'Preferred Backend Technology')}</FormLabel>
            <FormSelect
              name="preferredBackend"
              value={formData.preferredBackend}
              onChange={handleInputChange}
            >
              <option value="">{t('projects.selectOption', 'Select an option')}</option>
              {backendOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </FormSelect>
          </FormGroup>
        </FormRow>
        
        <FormGroup>
          <FormLabel>{t('projects.responsiveDesign', 'Responsive Design Requirements')}</FormLabel>
          <RadioGroup>
            <RadioItem>
              <RadioInput
                type="radio"
                id="responsive-all"
                name="responsiveDesign"
                value="all"
                checked={formData.responsiveDesign === 'all'}
                onChange={handleInputChange}
              />
              <RadioLabel htmlFor="responsive-all">
                {t('projects.responsiveAll', 'Fully responsive (All devices)')}
              </RadioLabel>
            </RadioItem>
            <RadioItem>
              <RadioInput
                type="radio"
                id="responsive-desktop"
                name="responsiveDesign"
                value="desktop"
                checked={formData.responsiveDesign === 'desktop'}
                onChange={handleInputChange}
              />
              <RadioLabel htmlFor="responsive-desktop">
                {t('projects.responsiveDesktop', 'Desktop-focused')}
              </RadioLabel>
            </RadioItem>
            <RadioItem>
              <RadioInput
                type="radio"
                id="responsive-mobile"
                name="responsiveDesign"
                value="mobile"
                checked={formData.responsiveDesign === 'mobile'}
                onChange={handleInputChange}
              />
              <RadioLabel htmlFor="responsive-mobile">
                {t('projects.responsiveMobile', 'Mobile-focused')}
              </RadioLabel>
            </RadioItem>
          </RadioGroup>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>{t('projects.hostingPreference', 'Hosting & Deployment Preference')}</FormLabel>
          <RadioGroup>
            <RadioItem>
              <RadioInput
                type="radio"
                id="hosting-cloud"
                name="hostingPreference"
                value="cloud"
                checked={formData.hostingPreference === 'cloud'}
                onChange={handleInputChange}
              />
              <RadioLabel htmlFor="hosting-cloud">
                <FaCloud style={{ marginRight: '8px', color: colors.accent.primary }} />
                {t('projects.hostingCloud', 'Cloud hosting (AWS, Google Cloud, Azure, etc.)')}
              </RadioLabel>
            </RadioItem>
            <RadioItem>
              <RadioInput
                type="radio"
                id="hosting-managed"
                name="hostingPreference"
                value="managed"
                checked={formData.hostingPreference === 'managed'}
                onChange={handleInputChange}
              />
              <RadioLabel htmlFor="hosting-managed">
                <FaServer style={{ marginRight: '8px', color: colors.accent.primary }} />
                {t('projects.hostingManaged', 'Managed hosting (Netlify, Vercel, Heroku, etc.)')}
              </RadioLabel>
            </RadioItem>
            <RadioItem>
              <RadioInput
                type="radio"
                id="hosting-selfhosted"
                name="hostingPreference"
                value="selfhosted"
                checked={formData.hostingPreference === 'selfhosted'}
                onChange={handleInputChange}
              />
              <RadioLabel htmlFor="hosting-selfhosted">
                {t('projects.hostingSelfHosted', 'Self-hosted / On-premise')}
              </RadioLabel>
            </RadioItem>
            <RadioItem>
              <RadioInput
                type="radio"
                id="hosting-undecided"
                name="hostingPreference"
                value="undecided"
                checked={formData.hostingPreference === 'undecided'}
                onChange={handleInputChange}
              />
              <RadioLabel htmlFor="hosting-undecided">
                {t('projects.hostingUndecided', 'Not sure / Need recommendations')}
              </RadioLabel>
            </RadioItem>
          </RadioGroup>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>{t('projects.additionalTechRequirements', 'Additional Technical Requirements')}</FormLabel>
          <FormTextarea
            name="additionalTechRequirements"
            value={formData.additionalTechRequirements}
            onChange={handleInputChange}
            placeholder={t('projects.additionalTechRequirementsPlaceholder', 'Any other technical requirements or preferences')}
            rows={3}
          />
        </FormGroup>
      </StepContainer>
    );
  };

  // Budget range options
  const budgetRangeOptions = [
    { id: 'under5k', label: t('projects.under5k', 'Under $5,000') },
    { id: '5kTo10k', label: t('projects.5kTo10k', '$5,000 - $10,000') },
    { id: '10kTo25k', label: t('projects.10kTo25k', '$10,000 - $25,000') },
    { id: '25kTo50k', label: t('projects.25kTo50k', '$25,000 - $50,000') },
    { id: 'over50k', label: t('projects.over50k', 'Over $50,000') },
    { id: 'flexible', label: t('projects.flexible', 'Flexible / To be discussed') }
  ];
  
  // Timeframe options
  const timeframeOptions = [
    { id: 'under1month', label: t('projects.under1month', 'Less than 1 month') },
    { id: '1to3months', label: t('projects.1to3months', '1-3 months') },
    { id: '3to6months', label: t('projects.3to6months', '3-6 months') },
    { id: '6to12months', label: t('projects.6to12months', '6-12 months') },
    { id: 'over12months', label: t('projects.over12months', 'More than 12 months') },
    { id: 'ongoing', label: t('projects.ongoing', 'Ongoing / Continuous development') }
  ];
  
  // Existing assets options
  const existingAssetsOptions = [
    { id: 'design', label: t('projects.design', 'Design mockups/wireframes') },
    { id: 'content', label: t('projects.content', 'Content (text, images, videos)') },
    { id: 'branding', label: t('projects.branding', 'Branding materials') },
    { id: 'existingCode', label: t('projects.existingCode', 'Existing codebase') },
    { id: 'apis', label: t('projects.apis', 'APIs/integrations') },
    { id: 'domain', label: t('projects.domain', 'Domain name') },
    { id: 'hosting', label: t('projects.hosting', 'Hosting account') }
  ];

  // Step 5: Budget & Resources
  const renderBudgetResourcesStep = () => {
    return (
      <StepContainer>
        <StepTitle>
          <StepIcon><FaDollarSign /></StepIcon>
          {t('projects.budgetResources', 'Budget & Resources')}
        </StepTitle>
        <StepDescription>
          {t('projects.budgetResourcesDesc', 'Provide information about your budget, timeline, and existing resources.')}
        </StepDescription>
        
        <CategorySection>
          <CategoryTitle>
            <CategoryIcon><FaDollarSign /></CategoryIcon>
            {t('projects.budgetRange', 'Budget Range')}
          </CategoryTitle>
          <RadioGroup>
            {budgetRangeOptions.map(option => (
              <RadioItem key={option.id}>
                <RadioInput
                  type="radio"
                  id={`budget-${option.id}`}
                  name="budgetRange"
                  value={option.id}
                  checked={formData.budgetRange === option.id}
                  onChange={handleInputChange}
                />
                <RadioLabel htmlFor={`budget-${option.id}`}>
                  {option.label}
                </RadioLabel>
              </RadioItem>
            ))}
          </RadioGroup>
        </CategorySection>
        
        <CategorySection>
          <CategoryTitle>
            <CategoryIcon><FaCalendarAlt /></CategoryIcon>
            {t('projects.timeframe', 'Project Timeframe')}
          </CategoryTitle>
          <RadioGroup>
            {timeframeOptions.map(option => (
              <RadioItem key={option.id}>
                <RadioInput
                  type="radio"
                  id={`timeframe-${option.id}`}
                  name="timeframe"
                  value={option.id}
                  checked={formData.timeframe === option.id}
                  onChange={handleInputChange}
                />
                <RadioLabel htmlFor={`timeframe-${option.id}`}>
                  {option.label}
                </RadioLabel>
              </RadioItem>
            ))}
          </RadioGroup>
        </CategorySection>
        
        <CategorySection>
          <CategoryTitle>
            <CategoryIcon><FaFileAlt /></CategoryIcon>
            {t('projects.existingAssets', 'Existing Assets & Resources')}
          </CategoryTitle>
          <CheckboxGroup>
            {existingAssetsOptions.map(option => (
              <CheckboxItem key={option.id}>
                <Checkbox
                  type="checkbox"
                  id={`asset-${option.id}`}
                  checked={formData.existingAssets.includes(option.id)}
                  onChange={() => handleCheckboxChange('existingAssets', option.id)}
                />
                <CheckboxLabel htmlFor={`asset-${option.id}`}>
                  {option.label}
                </CheckboxLabel>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </CategorySection>
        
        <FormGroup>
          <FormLabel>{t('projects.maintenanceSupport', 'Maintenance & Support')}</FormLabel>
          <SwitchContainer>
            <SwitchInput 
              type="checkbox" 
              id="maintenanceSupport" 
              checked={formData.maintenanceSupport} 
              onChange={() => setFormData(prev => ({
                ...prev,
                maintenanceSupport: !prev.maintenanceSupport
              }))}
            />
            <SwitchSlider htmlFor="maintenanceSupport">
              <SwitchButton />
            </SwitchSlider>
            <SwitchLabel>
              {formData.maintenanceSupport ? 
                t('projects.maintenanceYes', 'Yes, I need ongoing maintenance and support') : 
                t('projects.maintenanceNo', 'No maintenance and support needed')}
            </SwitchLabel>
          </SwitchContainer>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>{t('projects.additionalBudgetInfo', 'Additional Budget Information')}</FormLabel>
          <FormTextarea
            name="additionalBudgetInfo"
            value={formData.additionalBudgetInfo || ''}
            onChange={handleInputChange}
            placeholder={t('projects.additionalBudgetInfoPlaceholder', 'Any other budget constraints, funding details, or resource information')}
            rows={3}
          />
        </FormGroup>
      </StepContainer>
    );
  };

  // Step 6: Additional Details & Attachments
  const renderAdditionalDetailsStep = () => {
    return (
      <StepContainer>
        <StepTitle>
          <StepIcon><FaFileAlt /></StepIcon>
          {t('projects.additionalDetails', 'Additional Details & Attachments')}
        </StepTitle>
        <StepDescription>
          {t('projects.additionalDetailsDesc', 'Provide any additional details and upload relevant files for your project.')}
        </StepDescription>
        
        <CategorySection>
          <CategoryTitle>
            <CategoryIcon><FaEdit /></CategoryIcon>
            {t('projects.projectContext', 'Project Context & Background')}
          </CategoryTitle>
          <FormGroup>
            <FormLabel>{t('projects.projectBackground', 'Project Background')}</FormLabel>
            <FormTextarea
              name="projectBackground"
              value={formData.projectBackground || ''}
              onChange={handleInputChange}
              placeholder={t('projects.projectBackgroundPlaceholder', 'Describe any relevant background or context for this project')}
              rows={3}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>{t('projects.competitorReferences', 'Competitor References')}</FormLabel>
            <FormTextarea
              name="competitorReferences"
              value={formData.competitorReferences || ''}
              onChange={handleInputChange}
              placeholder={t('projects.competitorReferencesPlaceholder', 'List any competitors or reference sites that inspire your vision')}
              rows={3}
            />
          </FormGroup>
        </CategorySection>
        
        <CategorySection>
          <CategoryTitle>
            <CategoryIcon><FaLightbulb /></CategoryIcon>
            {t('projects.priorities', 'Project Priorities')}
          </CategoryTitle>
          <FormGroup>
            <FormLabel>{t('projects.prioritySliders', 'Indicate the importance of each aspect for your project')}</FormLabel>
            <SliderContainer>
              <SliderLabel>
                <span>{t('projects.speedPriority', 'Development Speed')}</span>
                <SliderValue>{formData.speedPriority || 5}</SliderValue>
              </SliderLabel>
              <SliderInput
                type="range"
                min="1"
                max="10"
                name="speedPriority"
                value={formData.speedPriority || 5}
                onChange={handleInputChange}
              />
            </SliderContainer>
            
            <SliderContainer>
              <SliderLabel>
                <span>{t('projects.qualityPriority', 'Code Quality')}</span>
                <SliderValue>{formData.qualityPriority || 5}</SliderValue>
              </SliderLabel>
              <SliderInput
                type="range"
                min="1"
                max="10"
                name="qualityPriority"
                value={formData.qualityPriority || 5}
                onChange={handleInputChange}
              />
            </SliderContainer>
            
            <SliderContainer>
              <SliderLabel>
                <span>{t('projects.costPriority', 'Cost Efficiency')}</span>
                <SliderValue>{formData.costPriority || 5}</SliderValue>
              </SliderLabel>
              <SliderInput
                type="range"
                min="1"
                max="10"
                name="costPriority"
                value={formData.costPriority || 5}
                onChange={handleInputChange}
              />
            </SliderContainer>
          </FormGroup>
        </CategorySection>
        
        <CategorySection>
          <CategoryTitle>
            <CategoryIcon><FaFileAlt /></CategoryIcon>
            {t('projects.attachments', 'File Attachments')}
          </CategoryTitle>
          <AttachmentSection>
            <AttachmentInstructions>
              {t('projects.attachmentInstructions', 'Upload any relevant files such as design mockups, requirements documents, or reference materials.')}
            </AttachmentInstructions>
            
            <FileUploadContainer>
              <FileUploadLabel htmlFor="file-upload">
                <FileUploadIcon><FaFileAlt /></FileUploadIcon>
                {t('projects.dragDropFiles', 'Drag & Drop Files or Click to Browse')}
              </FileUploadLabel>
              <FileInput
                id="file-upload"
                type="file"
                name="attachments"
                onChange={handleFileChange}
                multiple
              />
            </FileUploadContainer>
            
            {formData.attachments && formData.attachments.length > 0 && (
              <AttachmentList>
                <AttachmentListTitle>
                  {t('projects.uploadedFiles', 'Uploaded Files')} ({formData.attachments.length})
                </AttachmentListTitle>
                {formData.attachments.map((file, index) => (
                  <AttachmentItem key={index}>
                    <AttachmentIcon><FaFileAlt /></AttachmentIcon>
                    <AttachmentName>{file.name}</AttachmentName>
                    <AttachmentSize>{(file.size / 1024).toFixed(1)} KB</AttachmentSize>
                    <RemoveAttachmentButton
                      onClick={() => handleRemoveAttachment(index)}
                      aria-label="Remove attachment"
                    >
                      <FaTimes />
                    </RemoveAttachmentButton>
                  </AttachmentItem>
                ))}
              </AttachmentList>
            )}
          </AttachmentSection>
        </CategorySection>
        
        <CategorySection>
          <CategoryTitle>
            <CategoryIcon><FaLightbulb /></CategoryIcon>
            {t('projects.additionalRequirements', 'Additional Requirements')}
          </CategoryTitle>
          <FormGroup>
            <FormLabel>{t('projects.additionalComments', 'Additional Comments')}</FormLabel>
            <FormTextarea
              name="additionalComments"
              value={formData.additionalComments || ''}
              onChange={handleInputChange}
              placeholder={t('projects.additionalCommentsPlaceholder', 'Any other requirements, preferences, or information not covered in previous steps')}
              rows={4}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>{t('projects.projectPriorities', 'Project Priorities')}</FormLabel>
            <PriorityContainer>
              <PriorityItem>
                <PriorityLabel>{t('projects.speed', 'Speed')}</PriorityLabel>
                <PrioritySlider
                  type="range"
                  min="1"
                  max="5"
                  name="prioritySpeed"
                  value={formData.prioritySpeed || 3}
                  onChange={handleInputChange}
                />
                <PriorityValue>{formData.prioritySpeed || 3}/5</PriorityValue>
              </PriorityItem>
              
              <PriorityItem>
                <PriorityLabel>{t('projects.quality', 'Quality')}</PriorityLabel>
                <PrioritySlider
                  type="range"
                  min="1"
                  max="5"
                  name="priorityQuality"
                  value={formData.priorityQuality || 3}
                  onChange={handleInputChange}
                />
                <PriorityValue>{formData.priorityQuality || 3}/5</PriorityValue>
              </PriorityItem>
              
              <PriorityItem>
                <PriorityLabel>{t('projects.cost', 'Cost')}</PriorityLabel>
                <PrioritySlider
                  type="range"
                  min="1"
                  max="5"
                  name="priorityCost"
                  value={formData.priorityCost || 3}
                  onChange={handleInputChange}
                />
                <PriorityValue>{formData.priorityCost || 3}/5</PriorityValue>
              </PriorityItem>
            </PriorityContainer>
          </FormGroup>
        </CategorySection>
      </StepContainer>
    );
  };

  // Step 7: Review & Confirmation
  const renderReviewConfirmationStep = () => {
    return (
      <StepContainer>
        <StepTitle>
          <StepIcon><FaCheckCircle /></StepIcon>
          {t('projects.reviewConfirmation', 'Review & Confirmation')}
        </StepTitle>
        <StepDescription>
          {t('projects.reviewConfirmationDesc', 'Review your project details and confirm submission.')}
        </StepDescription>
        
        <ReviewSummary>
          {/* Basic Project Details Summary */}
          <SummarySection>
            <SummarySectionHeader>
              <SummarySectionIcon><FaUser /></SummarySectionIcon>
              <SummarySectionTitle>{t('projects.basicDetails', 'Basic Project Details')}</SummarySectionTitle>
              <EditSectionButton onClick={() => setCurrentStep(1)}>
                <FaEdit />
                {t('projects.edit', 'Edit')}
              </EditSectionButton>
            </SummarySectionHeader>
            
            <SummaryContent>
              <SummaryItem>
                <SummaryLabel>{t('projects.projectName', 'Project Name')}:</SummaryLabel>
                <SummaryValue>{formData.projectName}</SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>{t('projects.clientName', 'Client Name')}:</SummaryLabel>
                <SummaryValue>{formData.clientName}</SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>{t('projects.projectDescription', 'Project Description')}:</SummaryLabel>
                <SummaryValue>{formData.projectDescription}</SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>{t('projects.deadline', 'Deadline')}:</SummaryLabel>
                <SummaryValue>{formData.deadline}</SummaryValue>
              </SummaryItem>
            </SummaryContent>
          </SummarySection>
          
          {/* Target Audience Summary */}
          <SummarySection>
            <SummarySectionHeader>
              <SummarySectionIcon><FaUsers /></SummarySectionIcon>
              <SummarySectionTitle>{t('projects.targetAudience', 'Target Audience')}</SummarySectionTitle>
              <EditSectionButton onClick={() => setCurrentStep(2)}>
                <FaEdit />
                {t('projects.edit', 'Edit')}
              </EditSectionButton>
            </SummarySectionHeader>
            
            <SummaryContent>
              <SummaryItem>
                <SummaryLabel>{t('projects.audienceTypes', 'Audience Types')}:</SummaryLabel>
                <SummaryValue>
                  {formData.targetAudience.length > 0 
                    ? formData.targetAudience.join(', ') 
                    : t('projects.notSpecified', 'Not specified')}
                </SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>{t('projects.ageRange', 'Age Range')}:</SummaryLabel>
                <SummaryValue>{formData.ageRange || t('projects.notSpecified', 'Not specified')}</SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>{t('projects.geographicFocus', 'Geographic Focus')}:</SummaryLabel>
                <SummaryValue>{formData.geographicFocus || t('projects.notSpecified', 'Not specified')}</SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>{t('projects.languages', 'Languages')}:</SummaryLabel>
                <SummaryValue>
                  {formData.primaryLanguage}
                  {formData.secondaryLanguages.length > 0 && `, ${formData.secondaryLanguages.join(', ')}`}
                </SummaryValue>
              </SummaryItem>
            </SummaryContent>
          </SummarySection>
          
          {/* Functional Requirements Summary */}
          <SummarySection>
            <SummarySectionHeader>
              <SummarySectionIcon><FaCode /></SummarySectionIcon>
              <SummarySectionTitle>{t('projects.functionalRequirements', 'Functional Requirements')}</SummarySectionTitle>
              <EditSectionButton onClick={() => setCurrentStep(3)}>
                <FaEdit />
                {t('projects.edit', 'Edit')}
              </EditSectionButton>
            </SummarySectionHeader>
            
            <SummaryContent>
              {formData.authenticationFeatures.length > 0 && (
                <SummaryItem>
                  <SummaryLabel>{t('projects.authenticationFeatures', 'Authentication & Accounts')}:</SummaryLabel>
                  <SummaryValue>{formData.authenticationFeatures.join(', ')}</SummaryValue>
                </SummaryItem>
              )}
              
              {formData.dataManagementFeatures.length > 0 && (
                <SummaryItem>
                  <SummaryLabel>{t('projects.dataManagementFeatures', 'Data Management')}:</SummaryLabel>
                  <SummaryValue>{formData.dataManagementFeatures.join(', ')}</SummaryValue>
                </SummaryItem>
              )}
              
              {formData.coreApplicationFeatures.length > 0 && (
                <SummaryItem>
                  <SummaryLabel>{t('projects.coreApplicationFeatures', 'Core Features')}:</SummaryLabel>
                  <SummaryValue>{formData.coreApplicationFeatures.join(', ')}</SummaryValue>
                </SummaryItem>
              )}
              
              {formData.otherFeatures && (
                <SummaryItem>
                  <SummaryLabel>{t('projects.otherFeatures', 'Other Features')}:</SummaryLabel>
                  <SummaryValue>{formData.otherFeatures}</SummaryValue>
                </SummaryItem>
              )}
            </SummaryContent>
          </SummarySection>
          
          {/* Technical Preferences Summary */}
          <SummarySection>
            <SummarySectionHeader>
              <SummarySectionIcon><FaLaptopCode /></SummarySectionIcon>
              <SummarySectionTitle>{t('projects.technicalPreferences', 'Technical Preferences')}</SummarySectionTitle>
              <EditSectionButton onClick={() => setCurrentStep(4)}>
                <FaEdit />
                {t('projects.edit', 'Edit')}
              </EditSectionButton>
            </SummarySectionHeader>
            
            <SummaryContent>
              <SummaryItem>
                <SummaryLabel>{t('projects.targetPlatforms', 'Target Platforms')}:</SummaryLabel>
                <SummaryValue>
                  {formData.targetPlatforms.length > 0 
                    ? formData.targetPlatforms.join(', ') 
                    : t('projects.notSpecified', 'Not specified')}
                </SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>{t('projects.preferredTechnologies', 'Preferred Technologies')}:</SummaryLabel>
                <SummaryValue>
                  {formData.preferredFrontend && `Frontend: ${formData.preferredFrontend}`}
                  {formData.preferredBackend && formData.preferredFrontend && ', '}
                  {formData.preferredBackend && `Backend: ${formData.preferredBackend}`}
                  {!formData.preferredFrontend && !formData.preferredBackend && t('projects.notSpecified', 'Not specified')}
                </SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>{t('projects.responsiveDesign', 'Responsive Design')}:</SummaryLabel>
                <SummaryValue>
                  {formData.responsiveDesign === 'all' && t('projects.allDevices', 'All devices')}
                  {formData.responsiveDesign === 'desktop' && t('projects.desktopOnly', 'Desktop only')}
                  {formData.responsiveDesign === 'mobile' && t('projects.mobileOnly', 'Mobile only')}
                </SummaryValue>
              </SummaryItem>
            </SummaryContent>
          </SummarySection>
          
          {/* Budget & Resources Summary */}
          <SummarySection>
            <SummarySectionHeader>
              <SummarySectionIcon><FaDollarSign /></SummarySectionIcon>
              <SummarySectionTitle>{t('projects.budgetResources', 'Budget & Resources')}</SummarySectionTitle>
              <EditSectionButton onClick={() => setCurrentStep(5)}>
                <FaEdit />
                {t('projects.edit', 'Edit')}
              </EditSectionButton>
            </SummarySectionHeader>
            
            <SummaryContent>
              <SummaryItem>
                <SummaryLabel>{t('projects.budgetRange', 'Budget Range')}:</SummaryLabel>
                <SummaryValue>
                  {budgetRangeOptions.find(option => option.id === formData.budgetRange)?.label || 
                    t('projects.notSpecified', 'Not specified')}
                </SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>{t('projects.timeframe', 'Timeframe')}:</SummaryLabel>
                <SummaryValue>
                  {timeframeOptions.find(option => option.id === formData.timeframe)?.label || 
                    t('projects.notSpecified', 'Not specified')}
                </SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>{t('projects.existingAssets', 'Existing Assets')}:</SummaryLabel>
                <SummaryValue>
                  {formData.existingAssets.length > 0 
                    ? formData.existingAssets.map(assetId => 
                        existingAssetsOptions.find(option => option.id === assetId)?.label
                      ).join(', ')
                    : t('projects.notSpecified', 'Not specified')}
                </SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>{t('projects.maintenanceSupport', 'Maintenance & Support')}:</SummaryLabel>
                <SummaryValue>
                  {formData.maintenanceSupport 
                    ? t('projects.maintenanceYes', 'Yes, ongoing maintenance required')
                    : t('projects.maintenanceNo', 'No maintenance required')}
                </SummaryValue>
              </SummaryItem>
            </SummaryContent>
          </SummarySection>
          
          {/* Additional Details Summary */}
          <SummarySection>
            <SummarySectionHeader>
              <SummarySectionIcon><FaFileAlt /></SummarySectionIcon>
              <SummarySectionTitle>{t('projects.additionalDetails', 'Additional Details')}</SummarySectionTitle>
              <EditSectionButton onClick={() => setCurrentStep(6)}>
                <FaEdit />
                {t('projects.edit', 'Edit')}
              </EditSectionButton>
            </SummarySectionHeader>
            
            <SummaryContent>
              {formData.projectBackground && (
                <SummaryItem>
                  <SummaryLabel>{t('projects.projectBackground', 'Project Background')}:</SummaryLabel>
                  <SummaryValue>{formData.projectBackground}</SummaryValue>
                </SummaryItem>
              )}
              
              {formData.competitorReferences && (
                <SummaryItem>
                  <SummaryLabel>{t('projects.competitorReferences', 'Competitor References')}:</SummaryLabel>
                  <SummaryValue>{formData.competitorReferences}</SummaryValue>
                </SummaryItem>
              )}
              
              {formData.additionalComments && (
                <SummaryItem>
                  <SummaryLabel>{t('projects.additionalComments', 'Additional Comments')}:</SummaryLabel>
                  <SummaryValue>{formData.additionalComments}</SummaryValue>
                </SummaryItem>
              )}
              
              <SummaryItem>
                <SummaryLabel>{t('projects.attachments', 'Attachments')}:</SummaryLabel>
                <SummaryValue>
                  {formData.attachments && formData.attachments.length > 0 
                    ? `${formData.attachments.length} ${t('projects.filesAttached', 'files attached')}`
                    : t('projects.noAttachments', 'No attachments')}
                </SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>{t('projects.projectPriorities', 'Project Priorities')}:</SummaryLabel>
                <SummaryValue>
                  {t('projects.speed', 'Speed')}: {formData.prioritySpeed}/5, 
                  {t('projects.quality', 'Quality')}: {formData.priorityQuality}/5, 
                  {t('projects.cost', 'Cost')}: {formData.priorityCost}/5
                </SummaryValue>
              </SummaryItem>
            </SummaryContent>
          </SummarySection>
        </ReviewSummary>
        
        <ConfirmationSection>
          <Checkbox
            type="checkbox"
            id="confirmSubmission"
            checked={formData.confirmSubmission}
            onChange={() => setFormData(prev => ({
              ...prev,
              confirmSubmission: !prev.confirmSubmission
            }))}
          />
          <CheckboxLabel htmlFor="confirmSubmission">
            {t('projects.confirmSubmission', 'I confirm that all the information provided is accurate and I am ready to submit this project request.')}
          </CheckboxLabel>
        </ConfirmationSection>
      </StepContainer>
    );
  };

  // This section was removed to fix duplicate handleSubmit declaration

  // Step titles for the wizard
  const stepTitles = [
    t('projects.steps.basicDetails', 'Basic Details'),
    t('projects.steps.targetAudience', 'Target Audience'),
    t('projects.steps.functionalRequirements', 'Requirements'),
    t('projects.steps.technicalPreferences', 'Tech Stack'),
    t('projects.steps.budgetResources', 'Budget'),
    t('projects.steps.designPreferences', 'Design'),
    t('projects.steps.reviewSubmit', 'Review')
  ];

  // Render design preferences step
  const renderDesignPreferencesStep = () => {
    return (
      <StepContainer>
        <StepTitle>
          <FaMagic />
          {t('projects.steps.designPreferences', 'Design Preferences')}
        </StepTitle>
        <StepDescription>
          {t('projects.designPreferencesDescription', 'Tell us about your design preferences and visual style.')}
        </StepDescription>
        
        <FormRow>
          <FormLabel htmlFor="designStyle">
            {t('projects.designStyle', 'Design Style')}
            <Required>*</Required>
          </FormLabel>
          <FormSelect
            id="designStyle"
            value={formData.designStyle}
            onChange={(e) => handleInputChange('designStyle', e.target.value)}
            required
          >
            <option value="">{t('projects.selectOption', 'Select an option')}</option>
            <option value="minimalist">{t('projects.designStyles.minimalist', 'Minimalist & Clean')}</option>
            <option value="modern">{t('projects.designStyles.modern', 'Modern & Sleek')}</option>
            <option value="corporate">{t('projects.designStyles.corporate', 'Corporate & Professional')}</option>
            <option value="creative">{t('projects.designStyles.creative', 'Creative & Artistic')}</option>
            <option value="playful">{t('projects.designStyles.playful', 'Playful & Colorful')}</option>
            <option value="luxury">{t('projects.designStyles.luxury', 'Luxury & Elegant')}</option>
            <option value="retro">{t('projects.designStyles.retro', 'Retro & Vintage')}</option>
            <option value="futuristic">{t('projects.designStyles.futuristic', 'Futuristic & High-tech')}</option>
          </FormSelect>
        </FormRow>
        
        <FormRow>
          <FormLabel htmlFor="colorPreferences">
            {t('projects.colorPreferences', 'Color Preferences')}
          </FormLabel>
          <FormTextarea
            id="colorPreferences"
            value={formData.colorPreferences}
            onChange={(e) => handleInputChange('colorPreferences', e.target.value)}
            placeholder={t('projects.colorPreferencesPlaceholder', 'Describe your color preferences or specific color palette if you have one in mind.')}
            rows={3}
          />
        </FormRow>
        
        <FormRow>
          <FormLabel htmlFor="inspirationalWebsites">
            {t('projects.inspirationalWebsites', 'Inspirational Websites')}
          </FormLabel>
          <FormTextarea
            id="inspirationalWebsites"
            value={formData.inspirationalWebsites}
            onChange={(e) => handleInputChange('inspirationalWebsites', e.target.value)}
            placeholder={t('projects.inspirationalWebsitesPlaceholder', 'List any websites that you like the design of, or that have elements you would like to incorporate.')}
            rows={3}
          />
        </FormRow>
      </StepContainer>
    );
  };

  // Render review and submit step
  const renderReviewSubmitStep = () => {
    return (
      <StepContainer>
        <StepTitle>
          <FaFileAlt />
          {t('projects.steps.reviewSubmit', 'Review & Submit')}
        </StepTitle>
        <StepDescription>
          {t('projects.reviewSubmitDescription', 'Review your project details before submission.')}
        </StepDescription>
        
        <SummarySection>
          <SummarySectionHeader>
            <SummarySectionTitle>
              <FaClipboardList />
              {t('projects.basicDetails', 'Basic Details')}
            </SummarySectionTitle>
            <EditButton onClick={() => setCurrentStep(1)}>
              <FaEdit />
              {t('common.edit', 'Edit')}
            </EditButton>
          </SummarySectionHeader>
          
          <SummaryItem>
            <SummaryLabel>{t('projects.projectName', 'Project Name')}:</SummaryLabel>
            <SummaryValue>{formData.projectName}</SummaryValue>
          </SummaryItem>
          
          <SummaryItem>
            <SummaryLabel>{t('projects.projectDescription', 'Description')}:</SummaryLabel>
            <SummaryValue>{formData.projectDescription}</SummaryValue>
          </SummaryItem>
        </SummarySection>
        
        <FormRow>
          <FormCheckboxWrapper>
            <FormCheckbox
              id="confirmSubmission"
              checked={formData.confirmSubmission}
              onChange={(e) => handleInputChange('confirmSubmission', e.target.checked)}
            />
            <FormCheckboxLabel htmlFor="confirmSubmission">
              {t('projects.confirmSubmission', 'I confirm that the information provided is accurate and I am ready to submit this project request.')}
              <Required>*</Required>
            </FormCheckboxLabel>
          </FormCheckboxWrapper>
        </FormRow>
      </StepContainer>
    );
  };

  return (
    <WizardContainer>
      <WizardModal>
        <ModalHeader>
          <HeaderContent>
            <HeaderTitle>
              <FaClipboardList />
              {t('projects.createProject', 'Create New Project')}
            </HeaderTitle>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </HeaderContent>
        </ModalHeader>
        
        <ProgressContainer>
          <StepIndicatorContainer>
            <StepConnector />
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;
              
              return (
                <StepIndicator key={stepNumber}>
                  <StepDot active={isActive} completed={isCompleted}>
                    {isCompleted ? <FaCheck size={12} /> : stepNumber}
                  </StepDot>
                  <StepLabel active={isActive}>{title}</StepLabel>
                </StepIndicator>
              );
            })}
          </StepIndicatorContainer>
          
          <ProgressBar>
            <ProgressFill progress={(currentStep - 1) / (totalSteps - 1) * 100} />
          </ProgressBar>
        </ProgressContainer>
        
        <ContentScrollWrapper>
          {error && (
            <ErrorMessage>
              <FaExclamationCircle />
              {error}
            </ErrorMessage>
          )}
          
          {success && (
            <SuccessMessage>
              <FaCheckCircle />
              {success}
            </SuccessMessage>
          )}
          
          {currentStep === 1 && renderBasicDetailsStep()}
          {currentStep === 2 && renderTargetAudienceStep()}
          {currentStep === 3 && renderFunctionalRequirementsStep()}
          {currentStep === 4 && renderTechnicalPreferencesStep()}
          {currentStep === 5 && renderBudgetResourcesStep()}
          {currentStep === 6 && renderDesignPreferencesStep()}
          {currentStep === 7 && renderReviewSubmitStep()}
        </ContentScrollWrapper>
        
        <WizardFooter>
          <FooterContent>
            {currentStep > 1 ? (
              <SecondaryButton onClick={handlePrevStep} disabled={isSubmitting}>
                <FaArrowLeft />
                {t('common.previous', 'Previous')}
              </SecondaryButton>
            ) : (
              <SecondaryButton onClick={onClose} disabled={isSubmitting}>
                <FaTimes />
                {t('common.cancel', 'Cancel')}
              </SecondaryButton>
            )}
            
            <PrimaryButton 
              onClick={handleNextStep}
              disabled={!isStepComplete() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spin" />
                  {t('common.submitting', 'Submitting...')}
                </>
              ) : currentStep === totalSteps ? (
                <>
                  {t('common.submit', 'Submit')}
                  <FaCheck />
                </>
              ) : (
                <>
                  {t('common.next', 'Next')}
                  <FaArrowRight />
                </>
              )}
            </PrimaryButton>
          </FooterContent>
        </WizardFooter>
      </WizardModal>
    </WizardContainer>
  );
};

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const WizardContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(81, 58, 82, 0.7); /* Dark purple with higher opacity for better focus */
  backdrop-filter: blur(15px); /* Stronger blur effect for modern look */
  z-index: 1000;
  padding: ${spacing.md};
  animation: ${fadeIn} 0.4s ease;
  
  @media (max-width: ${breakpoints.md}) {
    padding: ${spacing.xs};
    align-items: flex-start;
    padding-top: 2rem;
  }
`;

const ProgressContainer = styled.div`
  padding: ${spacing.md} ${spacing.xl};
  background: white;
  border-bottom: 1px solid rgba(130, 161, 191, 0.15);
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${breakpoints.md}) {
    padding: ${spacing.md};
  }
`;

const StepIndicatorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${spacing.md};
  position: relative;
  padding: 0 ${spacing.xs};
`;

const StepConnector = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(130, 161, 191, 0.2);
  transform: translateY(-50%);
  z-index: 1;
`;

const StepDot = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.active ? 'linear-gradient(135deg, #faaa93, #82a1bf)' : 'white'};
  border: 2px solid ${props => props.completed ? '#82a1bf' : props.active ? '#faaa93' : 'rgba(130, 161, 191, 0.3)'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  color: ${props => props.completed || props.active ? 'white' : '#513a52'};
  font-weight: ${props => props.active ? '600' : '400'};
  box-shadow: ${props => props.active ? '0 0 0 4px rgba(250, 170, 147, 0.2)' : 'none'};
  
  ${props => props.completed && css`
    background: #82a1bf;
  `}
`;

const StepLabel = styled.div`
  font-size: 0.8rem;
  color: #513a52;
  margin-top: ${spacing.xs};
  text-align: center;
  font-weight: ${props => props.active ? '600' : '400'};
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(130, 161, 191, 0.15);
  border-radius: ${borderRadius.pill};
  margin: ${spacing.md} 0 ${spacing.xs};
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => `${props.progress}%`};
  background: linear-gradient(90deg, #faaa93, #82a1bf);
  border-radius: ${borderRadius.pill};
  transition: width 0.5s ease;
  position: relative;
  box-shadow: 0 1px 3px rgba(250, 170, 147, 0.3);
`;

// Styled Components for Modal Header and Content
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.md} ${spacing.xl};
  border-bottom: 1px solid rgba(130, 161, 191, 0.2);
  background: white;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const HeaderTitle = styled.h2`
  display: flex;
  align-items: center;
  font-size: ${typography.fontSizes.lg};
  color: #513a52;
  margin: 0;
  font-weight: 600;
  
  svg {
    margin-right: ${spacing.sm};
    color: #faaa93;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #513a52;
  font-size: 1.2rem;
  cursor: pointer;
  padding: ${spacing.xs};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    color: #faaa93;
    transform: scale(1.1);
    background: rgba(250, 170, 147, 0.1);
  }
`;

const ContentScrollWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${spacing.md} 0;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(130, 161, 191, 0.1);
    border-radius: ${borderRadius.pill};
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(130, 161, 191, 0.4);
    border-radius: ${borderRadius.pill};
    
    &:hover {
      background: rgba(130, 161, 191, 0.6);
    }
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.md};
  margin: ${spacing.md} ${spacing.xl};
  background: rgba(255, 99, 71, 0.1);
  border-left: 4px solid tomato;
  border-radius: ${borderRadius.sm};
  color: #d63031;
  font-size: 0.9rem;
  
  svg {
    margin-right: ${spacing.sm};
    font-size: 1.2em;
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.md};
  margin: ${spacing.md} ${spacing.xl};
  background: rgba(46, 213, 115, 0.1);
  border-left: 4px solid #2ed573;
  border-radius: ${borderRadius.sm};
  color: #20bf6b;
  font-size: 0.9rem;
  
  svg {
    margin-right: ${spacing.sm};
    font-size: 1.2em;
  }
`;

const WizardFooter = styled.div`
  padding: ${spacing.md} ${spacing.xl};
  border-top: 1px solid rgba(130, 161, 191, 0.2);
  background: white;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Additional styled components needed for the wizard
const Required = styled.span`
  color: #faaa93;
  margin-left: ${spacing.xs};
`;

const FormCheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const FormCheckbox = styled.input.attrs({ type: 'checkbox' })`
  margin-top: 0.25rem;
  margin-right: ${spacing.sm};
  cursor: pointer;
  accent-color: #faaa93;
`;

const FormCheckboxLabel = styled.label`
  font-size: ${typography.fontSizes.md};
  color: #513a52;
  cursor: pointer;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #82a1bf;
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  padding: ${spacing.xs};
  border-radius: ${borderRadius.sm};
  transition: ${transitions.default};
  
  svg {
    margin-right: ${spacing.xs};
    font-size: 0.9em;
  }
  
  &:hover {
    color: #faaa93;
    background: rgba(250, 170, 147, 0.05);
  }
`;



const NoScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: white;
`;

const FormRow = styled.div`
  display: flex;
  gap: ${spacing.lg};
  margin-bottom: ${spacing.lg};
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;





const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${colors.dark};
  font-size: ${typography.fontSizes.sm};
  margin-bottom: ${spacing.xs};
  padding: 0 ${spacing.xs};
  letter-spacing: 0.5px;
  
  span:first-child {
    font-weight: 500;
    color: ${colors.accent.secondary};
    letter-spacing: 0.5px;
  }
  
  span.step-name {
    font-weight: 600;
    color: ${colors.dark};
    font-size: ${typography.fontSizes.md};
  }
`;

const StepContentWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing.lg} 0;
  margin: ${spacing.md} 0;
  background: #feefc4;
  border-radius: ${borderRadius.lg};
  box-shadow: 0 8px 15px rgba(81, 58, 82, 0.1);
  border: 1px solid rgba(250, 170, 147, 0.2);
  border: 1px solid rgba(123, 44, 191, 0.1);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(205, 62, 253, 0.3), transparent);
  }
`;

const StepContainer = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding: ${spacing.lg} ${spacing.xl};
  animation: ${fadeIn} 0.5s ease;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: rgba(123, 44, 191, 0.3) transparent;
  border-radius: ${borderRadius.lg};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  background: rgba(30, 30, 40, 0.2);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(30, 30, 40, 0.2);
    border-radius: ${borderRadius.pill};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(123, 44, 191, 0.3);
    border-radius: ${borderRadius.pill};
    border: 2px solid rgba(30, 30, 40, 0.2);
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(205, 62, 253, 0.4);
  }
  
  @media (max-width: ${breakpoints.md}) {
    padding: ${spacing.md} ${spacing.lg};
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to top, rgba(30, 20, 60, 0.9), rgba(30, 20, 60, 0));
    pointer-events: none;
    z-index: 1;
  }
`;

const StepTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #513a52;
  margin-bottom: ${spacing.lg};
  text-align: center;
  position: relative;
  padding-bottom: ${spacing.sm};
  letter-spacing: 0.5px;
  font-family: inherit;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #faaa93, #82a1bf);
    border-radius: ${borderRadius.pill};
    box-shadow: 0 2px 10px rgba(130, 161, 191, 0.3);
  }
  
  svg {
    margin-right: ${spacing.sm};
    color: #faaa93;
    filter: drop-shadow(0 0 5px rgba(250, 170, 147, 0.5));
  }
  
  @media (max-width: ${breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const StepIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
  font-size: 1.5rem;
  color: ${colors.accent.primary};
  animation: ${pulse} 2s infinite ease-in-out;
  opacity: 0.9;
`;

const StepDescription = styled.p`
  margin-bottom: ${spacing.xl};
  color: #513a52;
  font-size: ${typography.fontSizes.md};
  line-height: 1.6;
  text-align: center;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  &:after {
    content: '';
    display: block;
    width: 40px;
    height: 1px;
    background: linear-gradient(90deg, #faaa93, transparent);
    margin: ${spacing.md} auto 0;
    opacity: 0.5;
  }
`;

const CategorySection = styled.div`
  margin-bottom: ${spacing.xl};
  padding: ${spacing.lg};
  background: rgba(254, 239, 196, 0.7);
  border-radius: ${borderRadius.lg};
  border: 1px solid rgba(250, 170, 147, 0.2);
  transition: all ${transitions.medium};
  overflow: hidden;
  position: relative;
  box-shadow: 0 5px 15px rgba(81, 58, 82, 0.1);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, rgba(250, 170, 147, 0), rgba(250, 170, 147, 0.5), rgba(250, 170, 147, 0));
    border-radius: ${borderRadius.lg} ${borderRadius.lg} 0 0;
    opacity: 0.5;
  }
  
  &:hover {
    box-shadow: 0 8px 25px rgba(81, 58, 82, 0.15);
    border-color: rgba(130, 161, 191, 0.3);
    transform: translateY(-2px);
    
    &:before {
      opacity: 1;
    }
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to top, rgba(254, 239, 196, 0.3), transparent);
    pointer-events: none;
    opacity: 0.5;
  }
`;

const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #faaa93, #82a1bf);
  color: white;
  margin-right: ${spacing.sm};
  font-size: ${typography.fontSizes.md};
  box-shadow: 0 2px 8px rgba(81, 58, 82, 0.2);
`;

const CategoryTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: ${typography.fontSizes.lg};
  margin-bottom: ${spacing.md};
  color: #513a52;
  font-weight: ${typography.fontWeights.semiBold};
  letter-spacing: 0.5px;
  position: relative;
  padding-bottom: ${spacing.xs};
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 2px;
    background: linear-gradient(90deg, #faaa93, transparent);
    border-radius: ${borderRadius.pill};
    transition: width ${transitions.medium};
  }
  
  ${CategorySection}:hover &:after {
    width: 80px;
  }
`;

// Option card components for selection interfaces
const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${spacing.lg};
  margin-top: ${spacing.lg};
  margin-bottom: ${spacing.xl};
  width: 100%;
`;

const OptionCard = styled.div`
  background: rgba(254, 239, 196, 0.9);
  border-radius: ${borderRadius.lg};
  padding: ${spacing.md};
  cursor: pointer;
  transition: all ${transitions.medium};
  border: 2px solid ${props => props.selected ? '#faaa93' : 'rgba(130, 161, 191, 0.2)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.selected ? 
    '0 5px 15px rgba(250, 170, 147, 0.2), 0 0 0 2px rgba(250, 170, 147, 0.4)' : 
    '0 5px 15px rgba(81, 58, 82, 0.1)'};
  height: 180px;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(130, 161, 191, 0.4), transparent);
    transform: translateX(-100%);
    transition: transform 0.8s ease;
  }
  
  &:hover {
    background: rgba(254, 239, 196, 1);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(81, 58, 82, 0.15), 0 0 0 2px rgba(130, 161, 191, 0.3);
    
    &:before {
      transform: translateX(100%);
    }
  }
  
  ${props => props.selected && css`
    background: rgba(254, 239, 196, 1);
    box-shadow: 0 8px 25px rgba(250, 170, 147, 0.3), 0 0 0 2px #faaa93;
    transform: translateY(-3px);
    
    &:after {
      content: '✓';
      position: absolute;
      top: 10px;
      right: 10px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: linear-gradient(135deg, #cd3efd, #7b2cbf);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(205, 62, 253, 0.2);
    }
  `}
`;

const OptionIcon = styled.div`
  font-size: 2rem;
  color: ${colors.accent.primary};
  margin-bottom: ${spacing.sm};
`;

const OptionLabel = styled.div`
  font-weight: ${typography.fontWeights.semiBold};
  margin-bottom: ${spacing.xs};
  color: white;
`;

const OptionDescription = styled.div`
  font-size: ${typography.fontSizes.sm};
  color: rgba(255, 255, 255, 0.7);
`;

const FormGroup = styled.div`
  margin-bottom: ${spacing.lg};
  width: 100%;
  position: relative;
  transition: all ${transitions.medium};
  
  &:hover label {
    color: rgba(255, 255, 255, 0.9);
  }
  
  &:focus-within label {
    color: #cd3efd;
  }
  
  @media (max-width: ${breakpoints.md}) {
    margin-bottom: ${spacing.md};
    background: rgba(255, 255, 255, 0.02);
    
    label {
      color: ${colors.accent.primary};
      transform: translateY(-1px);
    }
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${spacing.xs};
  font-size: 0.95rem;
  color: #513a52;
  font-weight: 500;
  transition: color ${transitions.fast};
  letter-spacing: 0.3px;
  
  &:after {
    content: ${props => props.required ? '" *"' : '""'};
    color: #faaa93;
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, #faaa93, transparent);
    transition: width ${transitions.medium};
  }
  
  ${FormGroup}:hover &::after {
    width: 30px;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${spacing.md};
  background: rgba(254, 239, 196, 0.8);
  border: 1px solid rgba(250, 170, 147, 0.3);
  border-radius: ${borderRadius.md};
  color: #513a52;
  font-size: 0.95rem;
  transition: all ${transitions.fast};
  box-shadow: inset 0 2px 4px rgba(81, 58, 82, 0.1);
  height: 48px;
  letter-spacing: 0.3px;
  
  &:hover {
    background-color: rgba(254, 239, 196, 0.9);
    border-color: rgba(250, 170, 147, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #faaa93;
    box-shadow: 0 0 0 2px rgba(250, 170, 147, 0.2), 0 4px 10px rgba(81, 58, 82, 0.1);
    background-color: rgba(254, 239, 196, 1);
  }
  
  &::placeholder {
    color: rgba(81, 58, 82, 0.4);
    font-style: italic;
    font-size: ${typography.fontSizes.sm};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: ${spacing.md};
  background: rgba(254, 239, 196, 0.8);
  border: 1px solid rgba(250, 170, 147, 0.3);
  border-radius: ${borderRadius.md};
  color: #513a52;
  font-size: ${typography.fontSizes.md};
  resize: vertical;
  min-height: 120px;
  transition: all ${transitions.fast};
  box-shadow: inset 0 2px 4px rgba(81, 58, 82, 0.1);
  line-height: 1.5;
  
  &:hover {
    background-color: rgba(254, 239, 196, 0.9);
    border-color: rgba(250, 170, 147, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #faaa93;
    box-shadow: 0 0 0 2px rgba(250, 170, 147, 0.2), 0 4px 10px rgba(81, 58, 82, 0.1);
    background-color: rgba(254, 239, 196, 1);
  }
  
  &::placeholder {
    color: rgba(81, 58, 82, 0.4);
    font-style: italic;
    font-size: ${typography.fontSizes.sm};
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  
  &::after {
    content: '▼';
    font-size: 0.7rem;
    color: #faaa93;
    position: absolute;
    right: ${spacing.md};
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    transition: all ${transitions.fast};
    opacity: 0.8;
  }
  
  &:hover::after {
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
    color: #82a1bf;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: ${spacing.md};
  background: rgba(254, 239, 196, 0.8);
  border: 1px solid rgba(250, 170, 147, 0.3);
  border-radius: ${borderRadius.md};
  color: #513a52;
  font-size: ${typography.fontSizes.md};
  appearance: none;
  transition: all ${transitions.fast};
  box-shadow: inset 0 2px 4px rgba(81, 58, 82, 0.1);
  cursor: pointer;
  height: 48px;
  
  &:hover {
    background-color: rgba(254, 239, 196, 0.9);
    border-color: rgba(250, 170, 147, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #faaa93;
    box-shadow: 0 0 0 2px rgba(250, 170, 147, 0.2), 0 4px 10px rgba(81, 58, 82, 0.1);
    background-color: rgba(254, 239, 196, 1);
  }
  
  option {
    background-color: #1e1e2f;
    color: white;
    padding: ${spacing.sm};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  margin-top: ${spacing.xs};
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.sm};
  transition: all ${transitions.fast};
  background: rgba(30, 30, 40, 0.3);
  border: 1px solid rgba(123, 44, 191, 0.2);
  margin-bottom: ${spacing.xs};
  
  &:hover {
    background-color: rgba(50, 40, 70, 0.4);
    border-color: rgba(123, 44, 191, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 22px;
  height: 22px;
  border: 2px solid rgba(123, 44, 191, 0.4);
  border-radius: ${borderRadius.sm};
  background-color: rgba(30, 30, 40, 0.5);
  cursor: pointer;
  position: relative;
  margin-right: ${spacing.md};
  transition: all ${transitions.fast};
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  
  &:hover {
    border-color: #cd3efd;
    box-shadow: 0 0 8px rgba(205, 62, 253, 0.3);
    background-color: rgba(50, 40, 70, 0.5);
  }
  
  &:checked {
    background-color: rgba(50, 40, 70, 0.8);
    border-color: #cd3efd;
    box-shadow: 0 0 10px rgba(205, 62, 253, 0.4);
    
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #cd3efd;
      font-size: 14px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
  }
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px rgba(205, 62, 253, 0.2);
  }
`;

const CheckboxLabel = styled.label`
  font-size: ${typography.fontSizes.md};
  color: ${colors.text.primary};
  cursor: pointer;
  transition: all ${transitions.fast};
  user-select: none;
  font-weight: ${typography.fontWeights.medium};
  letter-spacing: 0.2px;
  
  &:hover {
    color: ${colors.accent.primary};
    text-shadow: 0 0 8px rgba(205, 62, 253, 0.2);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  margin-top: ${spacing.xs};
`;

const RadioItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.sm};
  transition: all ${transitions.fast};
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: ${spacing.xs};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Radio = styled.input.attrs({ type: 'radio' })`
  appearance: none;
  width: 22px;
  height: 22px;
  border: 2px solid rgba(123, 44, 191, 0.4);
  border-radius: ${borderRadius.circle};
  background-color: rgba(30, 30, 40, 0.5);
  cursor: pointer;
  position: relative;
  margin-right: ${spacing.md};
  transition: all ${transitions.fast};
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  
  &:hover {
    border-color: #cd3efd;
    box-shadow: 0 0 8px rgba(205, 62, 253, 0.3);
    background-color: rgba(50, 40, 70, 0.5);
  }
  
  &:checked {
    background-color: rgba(50, 40, 70, 0.8);
    border-color: #cd3efd;
    box-shadow: 0 0 10px rgba(205, 62, 253, 0.4);
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 10px;
      height: 10px;
      border-radius: ${borderRadius.circle};
      background-color: #cd3efd;
      box-shadow: 0 0 4px rgba(205, 62, 253, 0.5);
    }
  }
  
  &:focus {
    outline: none;
    border-color: #cd3efd;
    box-shadow: 0 0 0 2px rgba(205, 62, 253, 0.2);
  }
`;

const RadioLabel = styled.label`
  font-size: ${typography.fontSizes.md};
  color: ${colors.text.primary};
  cursor: pointer;
  transition: all ${transitions.fast};
  user-select: none;
  font-weight: ${typography.fontWeights.medium};
  letter-spacing: 0.2px;
  
  &:hover {
    color: ${colors.accent.primary};
    text-shadow: 0 0 8px rgba(205, 62, 253, 0.2);
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
  background: rgba(30, 30, 40, 0.3);
  border: 1px solid rgba(123, 44, 191, 0.2);
  border-radius: ${borderRadius.sm};
  transition: all ${transitions.fast};
  
  &:hover {
    background: rgba(50, 40, 70, 0.4);
    border-color: rgba(123, 44, 191, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const SwitchInput = styled.input.attrs({ type: 'checkbox' })`
  height: 0;
  width: 0;
  visibility: hidden;
  position: absolute;
`;

const SwitchSlider = styled.span`
  position: relative;
  cursor: pointer;
  width: 52px;
  height: 26px;
  background: rgba(30, 30, 40, 0.5);
  border-radius: 100px;
  transition: all ${transitions.medium};
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(123, 44, 191, 0.2);
  backdrop-filter: blur(5px);
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    background: #e0e0e0;
    border-radius: 90px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    transition: all 0.3s;
  }
  
  ${SwitchInput}:checked + & {
    background: linear-gradient(to right, #7b2cbf, #cd3efd);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2), 0 0 0 1px #cd3efd;
  }
  
  ${SwitchInput}:checked + &::after {
    left: calc(100% - 3px);
    transform: translateX(-100%);
    background: white;
  }
  
  &:hover {
    background: ${props => props.checked ? 'linear-gradient(to right, #7b2cbf, #cd3efd)' : 'rgba(50, 40, 70, 0.5)'};
  }
  
  &:active::after {
    width: 26px;
  }
  
  &:hover::after {
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.3), 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  ${SwitchInput}:focus + & {
    box-shadow: 0 0 0 2px rgba(205, 62, 253, 0.2), inset 0 0 5px rgba(0, 0, 0, 0.2);
  }
`;

const SwitchButton = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const SwitchLabel = styled.span`
  margin-left: ${spacing.md};
  font-size: ${typography.fontSizes.md};
  color: ${colors.text.primary};
  transition: all ${transitions.fast};
  
  ${SwitchButton}:hover & {
    color: ${colors.accent.primary};
  }
`;

const SliderContainer = styled.div`
  margin-top: ${spacing.xs};
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.xs};
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
`;

const SliderValue = styled.span`
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.accent.primary};
  min-width: 40px;
  text-align: right;
`;

const SliderInput = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: ${borderRadius.circle};
  background: linear-gradient(to right, #cd3efd 0%, #cd3efd ${props => props.value}%, rgba(30, 30, 40, 0.5) ${props => props.value}%, rgba(30, 30, 40, 0.5) 100%);
  outline: none;
  transition: all ${transitions.fast};
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg, #cd3efd, #7b2cbf);
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    transition: all ${transitions.fast};
    border: 2px solid rgba(255, 255, 255, 0.8);
  }
  
  &::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg, #cd3efd, #7b2cbf);
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    transition: all ${transitions.fast};
    border: 2px solid rgba(255, 255, 255, 0.8);
  }
  
  &:hover::-webkit-slider-thumb {
    background: linear-gradient(135deg, #e17cff, #9b4ee0);
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(205, 62, 253, 0.5);
  }
  
  &:hover::-moz-range-thumb {
    background: linear-gradient(135deg, #e17cff, #9b4ee0);
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(205, 62, 253, 0.5);
  }
  
  &:active::-webkit-slider-thumb {
    transform: scale(1.2);
    box-shadow: 0 0 15px rgba(205, 62, 253, 0.7);
  }
  
  &:active::-moz-range-thumb {
    transform: scale(1.2);
    box-shadow: 0 0 15px rgba(205, 62, 253, 0.7);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 2px solid rgba(123, 44, 191, 0.2);
  border-radius: 50%;
  border-top-color: #cd3efd;
  animation: ${spin} 0.8s linear infinite;
  box-shadow: 0 0 10px rgba(205, 62, 253, 0.2);
`;

const AttachmentSection = styled.div`
  margin-top: ${spacing.md};
  padding: ${spacing.md};
  border: 1px dashed rgba(123, 44, 191, 0.4);
  border-radius: ${borderRadius.md};
  background-color: rgba(30, 30, 40, 0.3);
  transition: all ${transitions.fast};
  backdrop-filter: blur(5px);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  
  &:hover {
    border-color: #cd3efd;
    background-color: rgba(50, 40, 70, 0.4);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2), inset 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const AIButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.xs};
  padding: ${spacing.xs} ${spacing.sm};
  background: linear-gradient(135deg, #cd3efd, #7b2cbf);
  border: none;
  border-radius: ${borderRadius.md};
  color: white;
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${transitions.fast};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(205, 62, 253, 0.4), 0 0 15px rgba(123, 44, 191, 0.2);
    filter: brightness(1.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  }
  
  svg {
    font-size: 1rem;
  }
`;

const AIButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: rgba(255, 255, 255, 0.03);
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: ${spacing.lg};
  transition: all ${transitions.medium};
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const AIFeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #9c27b0, #673ab7);
  border-radius: ${borderRadius.circle};
  margin-right: ${spacing.md};
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 2px 10px rgba(156, 39, 176, 0.3);
`;

const AIFeatureTitle = styled.h4`
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing.xs} 0;
`;

const AIButtonDescription = styled.p`
  font-size: ${typography.fontSizes.md};
  color: ${colors.text.secondary};
  margin: 0 0 ${spacing.md} 0;
  line-height: 1.5;
`;

const ReviewSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};
`;

// Summary section components with enhanced styling
const SummarySection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  transition: all ${transitions.medium};
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: ${spacing.md};
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const SummarySectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.md};
  padding-bottom: ${spacing.sm};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SummarySectionIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  color: ${colors.accent.primary};
  margin-right: ${spacing.sm};
`;

const SummarySectionTitle = styled.h3`
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
`;

const EditSectionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${borderRadius.md};
  color: ${colors.text.secondary};
  padding: ${spacing.xs} ${spacing.sm};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: all ${transitions.fast};
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: ${colors.text.primary};
    border-color: ${colors.accent.primary};
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const SummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const SummaryLabel = styled.div`
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  font-weight: ${typography.fontWeights.medium};
`;

const SummaryValue = styled.div`
  font-size: ${typography.fontSizes.md};
  color: ${colors.text.primary};
  line-height: 1.5;
  word-break: break-word;
`;

const ConfirmationSection = styled.div`
  text-align: center;
  padding: ${spacing.xl} 0;
  
  h3 {
    font-size: ${typography.fontSizes.xl};
    color: ${colors.accent.primary};
    margin-bottom: ${spacing.md};
  }
  
  p {
    font-size: ${typography.fontSizes.lg};
    color: ${colors.text.secondary};
    margin-bottom: ${spacing.xl};
    line-height: 1.6;
  }
  
  svg {
    font-size: 4rem;
    color: ${colors.accent.success};
    margin-bottom: ${spacing.lg};
  }
`;

const PriorityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  margin-top: ${spacing.md};
`;

const PriorityItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const PriorityLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${typography.fontSizes.md};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const PrioritySlider = styled.input.attrs({ type: 'range', min: '1', max: '10' })`
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: ${borderRadius.circle};
  background: linear-gradient(to right, ${colors.accent.primary} 0%, ${colors.accent.primary} ${props => props.value * 10}%, rgba(255, 255, 255, 0.1) ${props => props.value * 10}%, rgba(255, 255, 255, 0.1) 100%);
  outline: none;
  transition: all ${transitions.fast};
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all ${transitions.fast};
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all ${transitions.fast};
  }
  
  &:hover::-webkit-slider-thumb {
    background: ${colors.accent.primary};
    transform: scale(1.1);
  }
  
  &:hover::-moz-range-thumb {
    background: ${colors.accent.primary};
    transform: scale(1.1);
  }
`;

const PriorityValue = styled.span`
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.accent.primary};
`;

const AttachmentInstructions = styled.p`
  font-size: ${typography.fontSizes.md};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.md};
  line-height: 1.5;
`;

const FileUploadContainer = styled.div`
  position: relative;
  margin-bottom: ${spacing.lg};
`;

const FileUploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all ${transitions.medium};
  
  &:hover {
    border-color: ${colors.accent.primary};
    background: rgba(255, 255, 255, 0.02);
  }
`;

const FileUploadIcon = styled.div`
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: ${spacing.md};
  transition: all ${transitions.medium};
  
  ${FileUploadLabel}:hover & {
    color: ${colors.accent.primary};
    transform: scale(1.1);
  }
`;

const FileInput = styled.input.attrs({ type: 'file', multiple: true })`
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
`;

const AttachmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const AttachmentListTitle = styled.h4`
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.sm};
  background: rgba(255, 255, 255, 0.03);
  border-radius: ${borderRadius.sm};
  transition: all ${transitions.fast};
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const AttachmentIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: ${colors.accent.primary};
  margin-right: ${spacing.sm};
`;

const AttachmentName = styled.div`
  flex: 1;
  font-size: ${typography.fontSizes.md};
  color: ${colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: ${spacing.md};
`;

const AttachmentSize = styled.div`
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  margin-right: ${spacing.md};
`;

const RemoveAttachmentButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${colors.text.secondary};
  font-size: 1rem;
  cursor: pointer;
  padding: ${spacing.xs};
  border-radius: ${borderRadius.circle};
  transition: all ${transitions.fast};
  
  &:hover {
    color: ${colors.accent.danger};
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${spacing.lg};
  padding: ${spacing.md} ${spacing.xl};
  border-top: 1px solid rgba(123, 44, 191, 0.2);
  background: rgba(30, 30, 40, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 0 0 ${borderRadius.lg} ${borderRadius.lg};
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
  
  @media (max-width: ${breakpoints.md}) {
    padding: ${spacing.md};
    flex-direction: column-reverse;
    gap: ${spacing.sm};
  }
  
  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(205, 62, 253, 0.2), transparent);
  }
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.sm} ${spacing.xl};
  background: linear-gradient(135deg, #faaa93, #82a1bf);
  color: #513a52;
  border: none;
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${transitions.fast};
  box-shadow: 0 4px 15px rgba(250, 170, 147, 0.3);
  min-width: 140px;
  height: 46px;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(254, 239, 196, 0.5), transparent);
    transform: translateX(-100%);
    transition: transform 0.8s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(250, 170, 147, 0.4), 0 0 15px rgba(130, 161, 191, 0.3);
    filter: brightness(1.05);
    
    &:before {
      transform: translateX(100%);
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(250, 170, 147, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(250, 170, 147, 0.2);
    box-shadow: none;
  }
  
  svg {
    margin-right: ${spacing.xs};
    font-size: 0.9em;
  }
`;

// Export the component
export default ProjectWizard;
