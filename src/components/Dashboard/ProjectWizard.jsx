import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaPlus, FaCheck, FaInfoCircle, FaLaptopCode, FaDesktop, FaMobileAlt, 
  FaTabletAlt, FaServer, FaDatabase, FaUserLock, FaUsers, FaGlobe, FaBuilding, 
  FaShoppingCart, FaChartBar, FaGamepad, FaCalendarAlt, FaBook, FaTools, 
  FaPalette, FaFileAlt, FaChartPie, FaMapMarkerAlt, FaRegClock, FaMoneyBillWave, 
  FaUserFriends, FaRegLightbulb, FaCode, FaUserCog, FaUserShield, FaRegCommentDots, 
  FaMobile, FaFileUpload, FaCloud, FaCreditCard, FaComments, 
  FaRegListAlt, FaRegEdit, FaRegImages, FaRegEnvelope, FaRegBell, FaRegStar, 
  FaRegCreditCard, FaRegCalendarAlt, FaRegChartBar, FaRegMap, FaRegAddressCard,
  FaLink, FaTrashAlt, FaPaperclip, FaUpload, FaRocket, FaGraduationCap, FaMedkit,
  FaMoneyBillAlt, FaFilm, FaTasks, FaEllipsisH, FaBolt, FaClock, FaUserTie,
  FaUserGraduate, FaUserMd, FaChild, FaMapMarker, FaMapMarked, FaFlag, FaKey,
  FaSignInAlt, FaUsersCog, FaUndo, FaBell, FaShareAlt, FaPlusCircle, FaApple,
  FaAndroid, FaLayerGroup, FaStar, FaJs, FaPython, FaChartLine
} from 'react-icons/fa';
import Modal from '../Common/Modal';
import { colors, spacing, borderRadius, shadows, transitions, typography, breakpoints } from '../../styles/GlobalTheme';
import { createProject, updateProject, uploadProjectFile, generateProjectSummary } from '../../firebase/services/projects';
import { useToast } from '../../contexts/ToastContext';

// Import all wizard components from the barrel file
import { 
  TextInput, 
  SelectableCards, 
  SearchableDropdown, 
  TimelineSelector,
  CheckboxCardSelector,
  UserScaleSelector,
  MultiSelectDropdown,
  Tooltip,
  ExpandableTextarea,
  LinkInputList,
  DragDropUploader,
  SummaryAccordion,
  SuccessScreen
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
  const { showToast } = useToast();
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [aiInsights, setAiInsights] = useState(null);
  
  // Initialize form data
  const [formData, setFormData] = useState({
    // Step 1 - Project Basics
    name: '',
    type: '',
    customType: '',
    industry: '',
    customIndustry: '',
    timeline: '',
    
    // Step 2 - Target Audience & Users
    targetUserGroups: [],
    userScale: '',
    geographicLocations: [],
    specificLocation: '',
    
    // Step 3 - Functional Requirements
    authFeatures: [],
    dataStorageFeatures: [],
    coreFeatures: [],
    otherFeatureText: '',
    
    // Step 4 - Technical Preferences & Infrastructure
    platforms: [],
    techStack: 'recommended',
    customTechStack: '',
    hosting: 'recommended',
    
    // Step 5 - Budget & Existing Resources
    budgetRange: '',
    existingResources: [],
    existingMaterials: [],
    
    // Step 6 - Additional Details & Attachments
    additionalNotes: '',
    relevantLinks: [],
    uploadedFiles: [],
    
    // Step 7 - Review & Final Submission
    confirmationChecked: false
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset form data when modal closes
      setFormData({
        name: '',
        type: '',
        customType: '',
        industry: '',
        customIndustry: '',
        timeline: '',
        targetUserGroups: [],
        userScale: '',
        geographicLocations: [],
        specificLocation: '',
        authFeatures: [],
        dataStorageFeatures: [],
        coreFeatures: [],
        otherFeatureText: '',
        platforms: [],
        techStack: 'recommended',
        customTechStack: '',
        hosting: 'recommended',
        budgetRange: '',
        existingResources: [],
        existingMaterials: [],
        additionalNotes: '',
        relevantLinks: [],
        uploadedFiles: [],
        confirmationChecked: false
      });
      setCurrentStep(1);
      setError(null);
      setIsSubmitting(false);
      setIsSubmitSuccess(false);
      setProjectId('');
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
    setError(null);
    
    // Validation for step 1
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setError(t('projects.wizard.errors.nameRequired', 'Project name is required'));
        return false;
      }
      
      if (!formData.type) {
        setError(t('projects.wizard.errors.typeRequired', 'Project type is required'));
        return false;
      }
      
      if (formData.type === 'custom' && !formData.customType.trim()) {
        setError(t('projects.wizard.errors.customTypeRequired', 'Custom project type is required'));
        return false;
      }
      
      if (!formData.industry) {
        setError(t('projects.wizard.errors.industryRequired', 'Project industry is required'));
        return false;
      }
      
      if (formData.industry === 'other' && !formData.customIndustry.trim()) {
        setError(t('projects.wizard.errors.customIndustryRequired', 'Custom industry is required'));
        return false;
      }
      
      if (!formData.timeline) {
        setError(t('projects.wizard.errors.timelineRequired', 'Project timeline is required'));
        return false;
      }
    }
    
    // Validation for step 2
    if (currentStep === 2) {
      if (formData.targetUserGroups.length === 0) {
        setError(t('projects.wizard.errors.targetUserGroupsRequired', 'At least one target user group is required'));
        return false;
      }
      
      if (!formData.userScale) {
        setError(t('projects.wizard.errors.userScaleRequired', 'Expected user scale is required'));
        return false;
      }
      
      if (formData.geographicLocations.length === 0) {
        setError(t('projects.wizard.errors.geographicLocationsRequired', 'At least one geographic location is required'));
        return false;
      }
      
      if (formData.geographicLocations.includes('specific') && !formData.specificLocation.trim()) {
        setError(t('projects.wizard.errors.specificLocationRequired', 'Specific location details are required'));
        return false;
      }
    }
    
    // Validation for step 3
    if (currentStep === 3) {
      if (formData.authFeatures.length === 0) {
        setError(t('projects.wizard.errors.authFeaturesRequired', 'At least one authentication feature is required'));
        return false;
      }
      
      if (formData.dataStorageFeatures.length === 0) {
        setError(t('projects.wizard.errors.dataStorageFeaturesRequired', 'At least one data storage feature is required'));
        return false;
      }
      
      if (formData.coreFeatures.length === 0) {
        setError(t('projects.wizard.errors.coreFeaturesRequired', 'At least one core application feature is required'));
        return false;
      }
      
      if (formData.coreFeatures.includes('other') && !formData.otherFeatureText.trim()) {
        setError(t('projects.wizard.errors.otherFeatureTextRequired', 'Please specify the other feature'));
        return false;
      }
    }
    
    // Validation for step 4
    if (currentStep === 4) {
      if (formData.platforms.length === 0) {
        setError(t('projects.wizard.errors.platformsRequired', 'At least one application platform is required'));
        return false;
      }
      
      if (formData.techStack === 'custom' && !formData.customTechStack.trim()) {
        setError(t('projects.wizard.errors.customTechStackRequired', 'Please specify your preferred technology stack'));
        return false;
      }
      
      if (!formData.hosting) {
        setError(t('projects.wizard.errors.hostingRequired', 'Hosting preference is required'));
        return false;
      }
    }
    
    // Validation for step 5
    if (currentStep === 5) {
      if (!formData.budgetRange) {
        setError(t('projects.wizard.errors.budgetRangeRequired', 'Budget range is required'));
        return false;
      }
    }
    
    // Validation for step 6
    // No required fields for step 6
    
    // Validation for step 7
    if (currentStep === 7) {
      if (!formData.confirmationChecked) {
        setError(t('projects.wizard.errors.confirmationRequired', 'Please confirm that the information provided is accurate and complete'));
        return false;
      }
    }
    
    return true;
  };

  // Function to scroll to the top of the wizard
  const scrollToTop = () => {
    // Looking at the Modal component, we know the content is in a styled component
    // that follows the Header. We'll try to find it directly and through parent-child relationships
    setTimeout(() => {
      // Try multiple approaches to ensure scrolling works in all cases
      
      // First approach - try to find the modal content directly
      const modalContent = document.querySelector('[role="dialog"] > div:nth-child(3)');
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
      
      // Second approach - try to find any element in the modal that might be scrollable
      const modalDialog = document.querySelector('[role="dialog"]');
      if (modalDialog) {
        // Get all direct children of the dialog
        const children = Array.from(modalDialog.children);
        
        // Try each child - the content is usually the 3rd child after close button and header
        children.forEach(child => {
          if (child.scrollHeight > child.clientHeight) {
            child.scrollTop = 0;
          }
        });
        
        // If we have at least 3 children, the 3rd one is likely the content
        if (children.length >= 3) {
          children[2].scrollTop = 0;
        }
      }
      
      // Third approach - try the wizard container directly
      const wizardContainer = document.querySelector('.wizard-container');
      if (wizardContainer) {
        wizardContainer.scrollTop = 0;
      }
      
      // Fourth approach - try the modal body if it exists
      const modalBody = document.querySelector('.modal-body');
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
      
      // Fifth approach - try scrolling the document itself as a fallback
      window.scrollTo(0, 0);
    }, 100); // Slightly longer delay to ensure the DOM has updated
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      if (currentStep < 7) {
        setCurrentStep(prev => prev + 1);
        // Scroll back to top after state update
        setTimeout(scrollToTop, 100);
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
      // Scroll back to top after state update
      setTimeout(scrollToTop, 100);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare project data without files
      const projectData = {
        // Step 1 - Project Basics
        name: formData.name,
        type: formData.type === 'custom' ? formData.customType : formData.type,
        industry: formData.industry === 'other' ? formData.customIndustry : formData.industry,
        timeline: formData.timeline,
        
        // Step 2 - Target Audience & Users
        targetUserGroups: formData.targetUserGroups,
        userScale: formData.userScale,
        geographicLocations: formData.geographicLocations,
        specificLocation: formData.specificLocation,
        
        // Step 3 - Functional Requirements
        authFeatures: formData.authFeatures,
        dataStorageFeatures: formData.dataStorageFeatures,
        coreFeatures: formData.coreFeatures,
        otherFeatureText: formData.otherFeatureText,
        
        // Step 4 - Technical Preferences & Infrastructure
        platforms: formData.platforms,
        techStack: formData.techStack,
        customTechStack: formData.techStack === 'custom' ? formData.customTechStack : '',
        hosting: formData.hosting,
        
        // Step 5 - Budget & Existing Resources
        budgetRange: formData.budgetRange,
        existingResources: formData.existingResources,
        existingMaterials: formData.existingMaterials,
        
        // Step 6 - Additional Details & Attachments
        additionalNotes: formData.additionalNotes,
        relevantLinks: formData.relevantLinks,
        uploadedFiles: [], // Will be populated after file upload
        
        // Default values
        status: 'inProgress',
        
        // Additional fields for ProjectsPanel display
        description: formData.additionalNotes || `${formData.type} project for ${formData.industry} industry`,
        client: formData.name, // Using project name as client name for now
        deadline: null // Can be set later
      };
      
      // Create the project in Firebase
      const projectId = await createProject(projectData);
      setProjectId(projectId);
      
      // Upload files if any
      const uploadedFileData = [];
      const failedUploads = [];
      
      if (formData.uploadedFiles && formData.uploadedFiles.length > 0) {
        showToast(t('projects.wizard.uploadingFiles', 'Uploading files...'), 'info');
        
        for (const fileWrapper of formData.uploadedFiles) {
          try {
            // Debug logging to understand file structure
            console.log('File wrapper:', fileWrapper);
            console.log('File wrapper type:', typeof fileWrapper);
            console.log('File wrapper keys:', Object.keys(fileWrapper));
            
            // Extract the actual file object from the wrapper
            // DragDropUploader wraps files with {id, name, size, type, file}
            const actualFile = fileWrapper.file || fileWrapper;
            const fileName = fileWrapper.name || actualFile.name || 'unknown';
            
            // More debug logging
            console.log('Actual file:', actualFile);
            console.log('Is File instance:', actualFile instanceof File);
            console.log('Is Blob instance:', actualFile instanceof Blob);
            
            // Ensure we have a valid File/Blob object
            if (!(actualFile instanceof File) && !(actualFile instanceof Blob)) {
              console.error('Invalid file object in wrapper:', fileWrapper);
              console.error('Actual file object:', actualFile);
              failedUploads.push(fileName);
              continue;
            }
            
            // Debug logging
            console.log('Processing file upload:', {
              fileName: fileName,
              fileSize: actualFile.size,
              fileType: actualFile.type,
              isFile: actualFile instanceof File,
              isBlob: actualFile instanceof Blob
            });
            
            const fileData = await uploadProjectFile(projectId, actualFile, (progress) => {
              const progressText = progress > 0 
                ? `${fileName}: ${Math.round(progress)}%`
                : `${fileName}: Preparing upload...`;
              console.log(progressText);
            });
            uploadedFileData.push(fileData);
          } catch (uploadError) {
            console.error(`Error uploading file ${fileWrapper.name || 'unknown'}:`, uploadError);
            failedUploads.push(fileWrapper.name || 'unknown');
            // Continue with other files even if one fails
          }
        }
        
        // Show upload results
        if (failedUploads.length > 0) {
          const failedFiles = failedUploads.join(', ');
          showToast(
            t('projects.wizard.someFilesFailedUpload', `Failed to upload: ${failedFiles}. The project was created but some files could not be uploaded.`),
            'warning'
          );
        }
        
        // Update project with successfully uploaded files
        if (uploadedFileData.length > 0) {
          await updateProject(projectId, { uploadedFiles: uploadedFileData });
        }
      }
      
      // Generate AI summary (optional - can be done asynchronously)
      try {
        showToast(t('projects.wizard.generatingInsights', 'Generating AI insights...'), 'info');
        const insights = await generateProjectSummary(projectData);
        setAiInsights(insights);
        await updateProject(projectId, { 
          summary: insights.executiveSummary,
          aiInsights: insights 
        });
        showToast(t('projects.wizard.insightsReady', 'AI insights generated successfully!'), 'success');
      } catch (summaryError) {
        console.error('Error generating summary:', summaryError);
        // Continue without summary - it's not critical
        showToast(t('projects.wizard.insightsError', 'AI insights could not be generated, but your project was created successfully.'), 'warning');
      }
      
      // Call the onProjectAdded callback
      if (onProjectAdded) {
        onProjectAdded({
          ...projectData,
          id: projectId,
          uploadedFiles: uploadedFileData
        });
      }
      
      // Set success state
      setIsSubmitSuccess(true);
      setIsSubmitting(false);
      showToast(t('projects.wizard.submitSuccess', 'Project created successfully!'), 'success');
      
    } catch (err) {
      console.error('Error creating project:', err);
      let errorMessage = t('projects.wizard.submitError', 'Error creating project. Please try again.');
      
      // Provide more specific error messages
      if (err.code === 'permission-denied' || err.code === 'PERMISSION_DENIED' || err.message?.includes('permission')) {
        errorMessage = t('projects.wizard.permissionDenied', 'You do not have permission to create projects. Please ensure you are logged in.');
      } else if (err.code === 'unauthenticated' || err.code === 'UNAUTHENTICATED') {
        errorMessage = t('projects.wizard.unauthenticated', 'You must be logged in to create projects.');
      } else if (err.message && err.message.includes('Network')) {
        errorMessage = t('projects.wizard.networkError', 'Network error. Please check your internet connection and try again.');
      } else if (err.message && err.message.includes('CORS')) {
        errorMessage = t('projects.wizard.corsError', 'Service configuration issue. Project was created but some features may be limited.');
      } else if (err.message && err.message.includes('Cloud Functions')) {
        errorMessage = t('projects.wizard.functionsError', 'AI insights service is unavailable. Your project was created successfully but without AI analysis.');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setIsSubmitting(false);
      
      // Log detailed error for debugging
      console.error('Project creation error details:', {
        code: err.code,
        message: err.message,
        details: err.details,
        stack: err.stack
      });
    }
  };
  
  // Handle return to dashboard
  const handleReturnToDashboard = () => {
    onClose();
  };

  // Total number of steps in the wizard
  const totalSteps = 7;
  
  // Render progress bar
  const renderProgressBar = () => {
    // Calculate progress percentage for the progress line
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    
    return (
      <ProgressBar isRTL={isRTL}>
        {/* Decorative elements */}
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
    { id: 'ecommerce', label: t('projects.wizard.industries.ecommerce', 'E-commerce'), icon: <FaShoppingCart /> },
    { id: 'education', label: t('projects.wizard.industries.education', 'Education'), icon: <FaGraduationCap /> },
    { id: 'healthcare', label: t('projects.wizard.industries.healthcare', 'Healthcare'), icon: <FaMedkit /> },
    { id: 'finance', label: t('projects.wizard.industries.finance', 'Finance'), icon: <FaMoneyBillAlt /> },
    { id: 'entertainment', label: t('projects.wizard.industries.entertainment', 'Entertainment'), icon: <FaFilm /> },
    { id: 'social', label: t('projects.wizard.industries.social', 'Social Media'), icon: <FaUsers /> },
    { id: 'productivity', label: t('projects.wizard.industries.productivity', 'Productivity'), icon: <FaTasks /> },
    { id: 'other', label: t('projects.wizard.industries.other', 'Other'), icon: <FaEllipsisH /> }
  ];

  // Timeline options
  const timelineOptions = [
    { id: 'urgent', label: t('projects.wizard.timeline.urgent', 'Urgent (< 1 month)'), icon: <FaBolt /> },
    { id: 'short', label: t('projects.wizard.timeline.short', 'Short (1-3 months)'), icon: <FaCalendarAlt /> },
    { id: 'medium', label: t('projects.wizard.timeline.medium', 'Medium (3-6 months)'), icon: <FaCalendarAlt /> },
    { id: 'long', label: t('projects.wizard.timeline.long', 'Long (6+ months)'), icon: <FaCalendarAlt /> },
    { id: 'flexible', label: t('projects.wizard.timeline.flexible', 'Flexible'), icon: <FaClock /> }
  ];

  // User group options
  const userGroupOptions = [
    { id: 'general', label: t('projects.wizard.userGroups.general', 'General Public'), icon: <FaUsers /> },
    { id: 'professionals', label: t('projects.wizard.userGroups.professionals', 'Professionals'), icon: <FaUserTie /> },
    { id: 'students', label: t('projects.wizard.userGroups.students', 'Students'), icon: <FaUserGraduate /> },
    { id: 'seniors', label: t('projects.wizard.userGroups.seniors', 'Seniors'), icon: <FaUserMd /> },
    { id: 'children', label: t('projects.wizard.userGroups.children', 'Children'), icon: <FaChild /> },
    { id: 'specialized', label: t('projects.wizard.userGroups.specialized', 'Specialized Group'), icon: <FaUserCog /> }
  ];

  // User scale options
  const userScaleOptions = [
    { id: 'small', label: t('projects.wizard.userScale.small', 'Small (< 100 users)'), value: 'small' },
    { id: 'medium', label: t('projects.wizard.userScale.medium', 'Medium (100-1,000 users)'), value: 'medium' },
    { id: 'large', label: t('projects.wizard.userScale.large', 'Large (1,000-10,000 users)'), value: 'large' },
    { id: 'enterprise', label: t('projects.wizard.userScale.enterprise', 'Enterprise (10,000+ users)'), value: 'enterprise' }
  ];

  // Location options
  const locationOptions = [
    { id: 'local', label: t('projects.wizard.location.local', 'Local'), icon: <FaMapMarker /> },
    { id: 'regional', label: t('projects.wizard.location.regional', 'Regional'), icon: <FaMapMarked /> },
    { id: 'national', label: t('projects.wizard.location.national', 'National'), icon: <FaFlag /> },
    { id: 'international', label: t('projects.wizard.location.international', 'International'), icon: <FaGlobe /> },
    { id: 'online', label: t('projects.wizard.location.online', 'Online Only'), icon: <FaCloud /> }
  ];

  // Authentication & User Management options
  const authFeatureOptions = [
    { id: 'basicAuth', label: t('projects.features.auth.basicAuth', 'Basic Authentication'), icon: <FaKey />, description: t('projects.features.auth.basicAuthDesc', 'Username/password login') },
    { id: 'socialAuth', label: t('projects.features.auth.socialAuth', 'Social Login'), icon: <FaSignInAlt />, description: t('projects.features.auth.socialAuthDesc', 'Login with Google, Facebook, etc.') },
    { id: 'userRoles', label: t('projects.features.auth.userRoles', 'User Roles & Permissions'), icon: <FaUsersCog />, description: t('projects.features.auth.userRolesDesc', 'Different access levels') },
    { id: 'passwordRecovery', label: t('projects.features.auth.passwordRecovery', 'Password Recovery'), icon: <FaUndo />, description: t('projects.features.auth.passwordRecoveryDesc', 'Reset forgotten passwords') }
  ];
  
  // Data & Storage Needs options
  const dataStorageOptions = [
    { id: 'database', label: t('projects.features.data.database', 'Database Storage'), icon: <FaDatabase />, description: t('projects.features.data.databaseDesc', 'Structured data storage') },
    { id: 'realtime', label: t('projects.features.data.realtime', 'Real-time Data'), icon: <FaBolt />, description: t('projects.features.data.realtimeDesc', 'Live updates and sync') },
    { id: 'offlineData', label: t('projects.features.data.offlineData', 'Offline Data Access'), icon: <FaMobile />, description: t('projects.features.data.offlineDataDesc', 'Work without internet') },
    { id: 'fileUploads', label: t('projects.features.data.fileUploads', 'File Uploads'), icon: <FaFileUpload />, description: t('projects.features.data.fileUploadsDesc', 'User file uploads') },
    { id: 'cloudStorage', label: t('projects.features.data.cloudStorage', 'Cloud Storage'), icon: <FaCloud />, description: t('projects.features.data.cloudStorageDesc', 'Store files in the cloud') }
  ];
  
  // Core Application Features options
  const coreFeatureOptions = [
    { id: 'payments', label: t('projects.features.core.payments', 'Payment Processing'), icon: <FaCreditCard />, description: t('projects.features.core.paymentsDesc', 'Accept online payments') },
    { id: 'messaging', label: t('projects.features.core.messaging', 'Messaging/Chat'), icon: <FaComments />, description: t('projects.features.core.messagingDesc', 'User-to-user communication') },
    { id: 'notifications', label: t('projects.features.core.notifications', 'Notifications'), icon: <FaBell />, description: t('projects.features.core.notificationsDesc', 'Push, email, or in-app alerts') },
    { id: 'maps', label: t('projects.features.core.maps', 'Maps & Location'), icon: <FaMapMarked />, description: t('projects.features.core.mapsDesc', 'Geographic features') },
    { id: 'calendar', label: t('projects.features.core.calendar', 'Calendar/Scheduling'), icon: <FaCalendarAlt />, description: t('projects.features.core.calendarDesc', 'Date-based features') },
    { id: 'analytics', label: t('projects.features.core.analytics', 'Analytics/Reporting'), icon: <FaChartPie />, description: t('projects.features.core.analyticsDesc', 'Data insights and reports') },
    { id: 'api', label: t('projects.features.core.api', 'API Integration'), icon: <FaLink />, description: t('projects.features.core.apiDesc', 'Connect with external services') },
    { id: 'sharing', label: t('projects.features.core.sharing', 'Social Sharing'), icon: <FaShareAlt />, description: t('projects.features.core.sharingDesc', 'Share content to social media') },
    { id: 'other', label: t('projects.features.core.other', 'Other (Specify)'), icon: <FaPlusCircle />, description: t('projects.features.core.otherDesc', 'Custom functionality') }
  ];
  
  // Platform options for Step 4
  const platformOptions = [
    { id: 'ios', label: t('projects.wizard.step4.platforms.ios', 'iOS (Mobile)'), icon: <FaApple /> },
    { id: 'android', label: t('projects.wizard.step4.platforms.android', 'Android (Mobile)'), icon: <FaAndroid /> },
    { id: 'web', label: t('projects.wizard.step4.platforms.web', 'Web (Browser-based)'), icon: <FaGlobe /> },
    { id: 'desktop', label: t('projects.wizard.step4.platforms.desktop', 'Desktop (Windows/macOS/Linux)'), icon: <FaDesktop /> },
    { id: 'crossPlatform', label: t('projects.wizard.step4.platforms.crossPlatform', 'Cross-platform (Multiple Platforms)'), icon: <FaLayerGroup /> }
  ];
  
  // Tech stack options for Step 4
  const techStackOptions = [
    { id: 'recommended', label: t('projects.wizard.step4.techStack.recommended', 'Recommended by Developer'), icon: <FaStar /> },
    { id: 'javascript', label: t('projects.wizard.step4.techStack.javascript', 'JavaScript (React, Node.js, Express)'), icon: <FaJs /> },
    { id: 'python', label: t('projects.wizard.step4.techStack.python', 'Python (Django, Flask)'), icon: <FaPython /> },
    { id: 'mobile', label: t('projects.wizard.step4.techStack.mobile', 'Mobile-focused (Flutter, React Native)'), icon: <FaMobile /> },
    { id: 'custom', label: t('projects.wizard.step4.techStack.custom', 'Custom'), icon: <FaCode /> }
  ];
  
  // Hosting options for Step 4
  const hostingOptions = [
    { id: 'recommended', label: t('projects.wizard.step4.hosting.recommended', 'Recommended by Developer'), icon: <FaStar /> },
    { id: 'cloud', label: t('projects.wizard.step4.hosting.cloud', 'Cloud-based (AWS, Azure, GCP, Firebase)'), icon: <FaCloud /> },
    { id: 'selfHosted', label: t('projects.wizard.step4.hosting.selfHosted', 'Self-hosted / On-premises'), icon: <FaServer /> }
  ];
  
  // Budget range options for Step 5
  const budgetOptions = [
    { id: 'small', label: t('projects.wizard.step5.budget.small', 'Small ($1,000 - $5,000)'), icon: <FaMoneyBillAlt /> },
    { id: 'medium', label: t('projects.wizard.step5.budget.medium', 'Medium ($5,000 - $15,000)'), icon: <FaMoneyBillAlt /> },
    { id: 'large', label: t('projects.wizard.step5.budget.large', 'Large ($15,000 - $50,000)'), icon: <FaMoneyBillAlt /> },
    { id: 'enterprise', label: t('projects.wizard.step5.budget.enterprise', 'Enterprise ($50,000+)'), icon: <FaMoneyBillAlt /> },
    { id: 'flexible', label: t('projects.wizard.step5.budget.flexible', 'Flexible / To Be Discussed'), icon: <FaComments /> }
  ];
  
  // Existing resources options for Step 5
  const resourcesOptions = [
    { id: 'inHouseTeam', label: t('projects.wizard.step5.resources.inHouseTeam', 'In-house Development Team'), icon: <FaUsersCog /> },
    { id: 'designer', label: t('projects.wizard.step5.resources.designer', 'UI/UX Designer'), icon: <FaPython /> },
    { id: 'projectManager', label: t('projects.wizard.step5.resources.projectManager', 'Project Manager'), icon: <FaTasks /> },
    { id: 'qaTeam', label: t('projects.wizard.step5.resources.qaTeam', 'QA/Testing Team'), icon: <FaCode /> },
    { id: 'contentCreator', label: t('projects.wizard.step5.resources.contentCreator', 'Content Creator'), icon: <FaFileUpload /> },
    { id: 'marketingTeam', label: t('projects.wizard.step5.resources.marketingTeam', 'Marketing Team'), icon: <FaChartLine /> }
  ];
  
  // Existing materials options for Step 5
  const materialsOptions = [
    { id: 'wireframes', label: t('projects.wizard.step5.materials.wireframes', 'Wireframes/Mockups'), icon: <FaDesktop /> },
    { id: 'brandAssets', label: t('projects.wizard.step5.materials.brandAssets', 'Brand Assets/Guidelines'), icon: <FaPalette /> },
    { id: 'contentPlan', label: t('projects.wizard.step5.materials.contentPlan', 'Content Plan/Copy'), icon: <FaFileAlt /> },
    { id: 'marketResearch', label: t('projects.wizard.step5.materials.marketResearch', 'Market Research'), icon: <FaChartPie /> },
    { id: 'technicalDocs', label: t('projects.wizard.step5.materials.technicalDocs', 'Technical Documentation'), icon: <FaBook /> }
  ];

  // Render step content based on current step
  const renderStepContent = () => {
    // If submission was successful, show success screen instead of steps
    if (isSubmitSuccess) {
      return (
        <SuccessScreen 
          projectId={projectId}
          onReturnToDashboard={handleReturnToDashboard}
          isRTL={isRTL}
          aiInsights={aiInsights}
        />
      );
    }
    
    switch (currentStep) {
      case 1:
        return (
          <StepContainer>
            <StepTitle isRTL={isRTL} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('projects.wizard.step1.title', 'Step 1: Project Info')}</StepTitle>
            
            {/* Project Name */}
            <FormGroup isRTL={isRTL}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step1.projectName', 'Project Name')}
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step1.projectNameSubtext', 'Enter a unique name that clearly identifies your project')}
              </FormSubtext>
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
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step1.projectTypeSubtext', 'Select the category that best describes your project')}
              </FormSubtext>
              <SelectableCards
                options={projectTypes.map(type => ({
                  id: type.id,
                  label: type.label,
                  icon: type.icon
                }))}
                selectedValue={formData.type}
                onChange={(value) => handleChange('type', value)}
                required
                isRTL={isRTL}
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
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step1.projectIndustrySubtext', 'Choose the industry or sector your project serves')}
              </FormSubtext>
              <SearchableDropdown
                options={industryOptions.map(industry => ({
                  id: industry.id,
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
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step1.estimatedTimelineSubtext', 'Select the expected timeframe for completing your project')}
              </FormSubtext>
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
      case 2:
        return (
          <StepContainer>
            <StepTitle isRTL={isRTL} style={{ textAlign: isRTL ? 'right' : 'left' }}>
              {t('projects.wizard.step2.title', 'Target Audience Information')}
            </StepTitle>
            
            {/* Target User Groups */}
            <FormGroup isRTL={isRTL} marginBottom={spacing.md}>
              <FormLabel isRTL={isRTL}>
                {
                  t('projects.wizard.step2.targetUserGroups', 'Target User Groups')
                }
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step2.targetUserGroupsTooltip', 'Select all user groups that will use your application')}
              </FormSubtext>
              <CheckboxCardSelector
                options={userGroupOptions}
                selectedValues={formData.targetUserGroups}
                onChange={(values) => handleChange('targetUserGroups', values)}
                isRTL={isRTL}
              />
            </FormGroup>
            
            {/* Expected User Scale */}
            <FormGroup isRTL={isRTL} marginBottom={spacing.md}>
              <FormLabel isRTL={isRTL}>
                {
                  t('projects.wizard.step2.userScale', 'Expected User Scale')
                }
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step2.userScaleTooltip', 'Estimate how many users will be using your application')}
              </FormSubtext>
              <UserScaleSelector
                options={userScaleOptions}
                selectedValue={formData.userScale}
                onChange={(value) => handleChange('userScale', value)}
                required
                isRTL={isRTL}
              />
            </FormGroup>
            
            {/* Geographic Locations */}
            <FormGroup isRTL={isRTL} marginBottom={spacing.md}>
              <FormLabel isRTL={isRTL}>
                {
                  t('projects.wizard.step2.geographicLocations', 'Geographic Locations')
                }
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step2.geographicLocationsTooltip', 'Select all regions where your application will be used')}
              </FormSubtext>
              <MultiSelectDropdown
                options={locationOptions}
                selectedValues={formData.geographicLocations}
                onChange={(values) => handleChange('geographicLocations', values)}
                placeholder={t('projects.wizard.step2.locationsPlaceholder', 'Select geographic locations')}
                isRTL={isRTL}
                allowCustom={true}
                required
              />
              {formData.geographicLocations.includes('specific') && (
                <TextInput
                  value={formData.specificLocation}
                  onChange={(value) => handleChange('specificLocation', value)}
                  placeholder={t('projects.wizard.step2.specificLocationPlaceholder', 'Specify countries or regions')}
                  maxLength={200}
                  style={{ marginTop: spacing.sm }}
                />
              )}
            </FormGroup>
          </StepContainer>
        );
      case 3:
        return (
          <StepContainer>
            <StepTitle isRTL={isRTL} style={{ textAlign: isRTL ? 'right' : 'left' }}>
              {t('projects.wizard.step3.title', 'Functional Requirements')}
            </StepTitle>
            
            {/* Authentication & User Management */}
            <FormGroup isRTL={isRTL} marginBottom={spacing.md}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step3.authFeatures', 'Authentication & User Management')}
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step3.authFeaturesTooltip', 'Select the authentication and user management features needed for your project')}
              </FormSubtext>
              <CheckboxCardSelector
                options={authFeatureOptions}
                selectedValues={formData.authFeatures}
                onChange={(values) => handleChange('authFeatures', values)}
                isRTL={isRTL}
              />
            </FormGroup>
            
            {/* Data Storage & Management */}
            <FormGroup isRTL={isRTL} marginBottom={spacing.md}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step3.dataStorageFeatures', 'Data Storage & Management')}
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step3.dataStorageFeaturesToolTip', 'Select the data storage and management features your application needs')}
              </FormSubtext>
              <CheckboxCardSelector
                options={dataStorageOptions}
                selectedValues={formData.dataStorageFeatures}
                onChange={(values) => handleChange('dataStorageFeatures', values)}
                isRTL={isRTL}
              />
            </FormGroup>
            
            {/* Core Application Features */}
            <FormGroup isRTL={isRTL} marginBottom={spacing.md}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step3.coreFeatures', 'Core Application Features')}
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step3.coreFeaturesToolTip', 'Select the main functional features your application will need')}
              </FormSubtext>
              <CheckboxCardSelector
                options={coreFeatureOptions}
                selectedValues={formData.coreFeatures}
                onChange={(values) => handleChange('coreFeatures', values)}
                isRTL={isRTL}
              />
              {formData.coreFeatures.includes('other') && (
                <TextInput
                  value={formData.otherFeatureText}
                  onChange={(value) => handleChange('otherFeatureText', value)}
                  placeholder={t('projects.wizard.step3.otherFeaturePlaceholder', 'Please specify the other feature(s) you need')}
                  maxLength={200}
                  style={{ marginTop: spacing.sm }}
                />
              )}
            </FormGroup>
          </StepContainer>
        );
      case 4:
        return (
          <StepContainer>
            <StepTitle isRTL={isRTL} style={{ textAlign: isRTL ? 'right' : 'left' }}>
              {t('projects.wizard.step4.title', 'Technical Preferences & Infrastructure')}
            </StepTitle>
            
            {/* Preferred Application Platforms */}
            <FormGroup isRTL={isRTL} marginBottom={spacing.md}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step4.platforms', 'Preferred Application Platforms')}
                <Tooltip content={t('projects.wizard.step4.platformsTooltip', 'Where should your application be available?')}>
                  <InfoIcon isRTL={isRTL}>ℹ️</InfoIcon>
                </Tooltip>
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step4.platformsSubtext', 'Select all platforms where your application should be accessible')}
              </FormSubtext>
              <CheckboxCardSelector
                options={platformOptions}
                selectedValues={formData.platforms}
                onChange={(values) => handleChange('platforms', values)}
                isRTL={isRTL}
              />
            </FormGroup>
            
            {/* Technology Stack Preference */}
            <FormGroup isRTL={isRTL} marginBottom={spacing.md}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step4.techStack', 'Technology Stack Preference')}
                <Tooltip content={t('projects.wizard.step4.techStackTooltip', 'Preferred technologies used to build your app')}>
                  <InfoIcon isRTL={isRTL}>ℹ️</InfoIcon>
                </Tooltip>
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step4.techStackSubtext', 'Choose the technology stack that best fits your project requirements')}
              </FormSubtext>
              <SelectableCards
                options={techStackOptions}
                selectedValue={formData.techStack}
                onChange={(value) => handleChange('techStack', value)}
                isRTL={isRTL}
              />
              {formData.techStack === 'custom' && (
                <TextInput
                  value={formData.customTechStack}
                  onChange={(value) => handleChange('customTechStack', value)}
                  placeholder={t('projects.wizard.step4.customStackPlaceholder', 'Specify your preferred technology stack')}
                  maxLength={200}
                  style={{ marginTop: spacing.sm }}
                />
              )}
            </FormGroup>
            
            {/* Preferred Hosting & Infrastructure */}
            <FormGroup isRTL={isRTL} marginBottom={spacing.md}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step4.hosting', 'Preferred Hosting & Infrastructure')}
                <Tooltip content={t('projects.wizard.step4.hostingTooltip', 'Where would you prefer your application to be hosted?')}>
                  <InfoIcon isRTL={isRTL}>ℹ️</InfoIcon>
                </Tooltip>
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step4.hostingSubtext', 'Select your preferred hosting environment for deployment')}
              </FormSubtext>
              <SelectableCards
                options={hostingOptions}
                selectedValue={formData.hosting}
                onChange={(value) => handleChange('hosting', value)}
                isRTL={isRTL}
              />
            </FormGroup>
          </StepContainer>
        );
      case 5:
        return (
          <StepContainer>
            <StepTitle isRTL={isRTL} style={{ textAlign: isRTL ? 'right' : 'left' }}>
              {t('projects.wizard.step5.title', 'Budget & Existing Resources')}
            </StepTitle>
            
            {/* Budget Range */}
            <FormGroup isRTL={isRTL}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step5.budgetRange', 'Estimated Budget Range')}
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step5.budgetRangeSubtext', 'Select the budget range that best fits your project')}
              </FormSubtext>
              <SelectableCards
                options={budgetOptions}
                selectedValue={formData.budgetRange}
                onChange={(value) => handleChange('budgetRange', value)}
                required
                isRTL={isRTL}
              />
            </FormGroup>
            
            {/* Existing Resources & Team Availability */}
            <FormGroup isRTL={isRTL}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step5.existingResources', 'Existing Resources & Team Availability')}
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step5.existingResourcesSubtext', 'Select any resources or team members you already have available')}
              </FormSubtext>
              <CheckboxCardSelector
                options={resourcesOptions}
                selectedValues={formData.existingResources}
                onChange={(values) => handleChange('existingResources', values)}
                isRTL={isRTL}
              />
            </FormGroup>
            
            {/* Existing Materials or Documentation */}
            <FormGroup isRTL={isRTL}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step5.existingMaterials', 'Existing Materials or Documentation')}
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step5.existingMaterialsSubtext', 'Select any materials or documentation you already have prepared')}
              </FormSubtext>
              <CheckboxCardSelector
                options={materialsOptions}
                selectedValues={formData.existingMaterials}
                onChange={(values) => handleChange('existingMaterials', values)}
                isRTL={isRTL}
              />
            </FormGroup>
          </StepContainer>
        );
      case 6:
        return (
          <StepContainer>
            <StepTitle isRTL={isRTL} style={{ textAlign: isRTL ? 'right' : 'left' }}>
              {t('projects.wizard.step6.title', 'Additional Details & Attachments')}
            </StepTitle>
            
            {/* Additional Notes */}
            <FormGroup isRTL={isRTL} marginBottom={spacing.md}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step6.additionalNotes', 'Anything else we should know?')}
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step6.additionalNotesSubtext', 'Use this space to share extra info, special requests, or instructions')}
              </FormSubtext>
              <ExpandableTextarea
                value={formData.additionalNotes}
                onChange={(value) => handleChange('additionalNotes', value)}
                placeholder={t('projects.wizard.step6.additionalNotesPlaceholder', 'Please make sure the app supports RTL languages...')}
                maxLength={500}
                isRTL={isRTL}
              />
            </FormGroup>
            
            {/* Relevant Links */}
            <FormGroup isRTL={isRTL} marginBottom={spacing.md}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step6.relevantLinks', 'Do you have any links to share?')}
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step6.relevantLinksSubtext', 'Links to designs, docs, or similar products are welcome!')}
              </FormSubtext>
              <LinkInputList
                links={formData.relevantLinks}
                onChange={(links) => handleChange('relevantLinks', links)}
                isRTL={isRTL}
              />
            </FormGroup>
            
            {/* File Uploads */}
            <FormGroup isRTL={isRTL} marginBottom={spacing.md}>
              <FormLabel isRTL={isRTL}>
                {t('projects.wizard.step6.fileUploads', 'File Uploads')}
              </FormLabel>
              <FormSubtext isRTL={isRTL}>
                {t('projects.wizard.step6.fileUploadsSubtext', 'You can upload documents, images, spreadsheets, or ZIPs of existing assets')}
              </FormSubtext>
              <DragDropUploader
                files={formData.uploadedFiles}
                onChange={(files) => handleChange('uploadedFiles', files)}
                isRTL={isRTL}
                maxFileSize={20} // 20MB
                acceptedFileTypes={['pdf', 'docx', 'xlsx', 'png', 'jpg', 'svg', 'zip', 'txt']}
              />
            </FormGroup>
          </StepContainer>
        );
      case 7:
        return (
          <StepContainer>
            <StepTitle isRTL={isRTL} style={{ textAlign: isRTL ? 'right' : 'left' }}>
              {t('projects.wizard.step7.title', 'Review & Final Submission')}
            </StepTitle>
            
            <FormGroup isRTL={isRTL}>
              <FormSubtext isRTL={isRTL} style={{ textAlign: isRTL ? 'right' : 'left', direction: isRTL ? 'rtl' : 'ltr' }}>
                {t('projects.wizard.step7.reviewSubtext', 'Please review all the information you have provided. You can edit any section by clicking the edit button.')}
              </FormSubtext>
              
              {/* Step 1 Summary */}
              <SummaryAccordion
                title={t('projects.wizard.step1.title', 'Project Info')}
                isCompleted={true}
                onEdit={() => setCurrentStep(1)}
                isRTL={isRTL}
                defaultOpen={true}
                className={isRTL ? 'rtl-accordion' : ''}
              >
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step1.projectName', 'Project Name')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>{formData.name}</SummaryValue>
                </SummaryItem>
                
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step1.projectType', 'Project Type')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.type === 'custom' ? formData.customType : projectTypes.find(type => type.id === formData.type)?.label || formData.type}
                  </SummaryValue>
                </SummaryItem>
                
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step1.projectIndustry', 'Industry')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.industry === 'other' ? formData.customIndustry : industryOptions.find(ind => ind.id === formData.industry)?.label || formData.industry}
                  </SummaryValue>
                </SummaryItem>
                
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step1.estimatedTimeline', 'Timeline')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>{formData.timeline}</SummaryValue>
                </SummaryItem>
              </SummaryAccordion>
              
              {/* Step 2 Summary */}
              <SummaryAccordion
                title={t('projects.wizard.step2.title', 'Target Audience & Users')}
                isCompleted={true}
                onEdit={() => setCurrentStep(2)}
                isRTL={isRTL}
                className={isRTL ? 'rtl-accordion' : ''}
              >
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step2.targetUserGroups', 'Target User Groups')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.targetUserGroups.map(group => userGroupOptions.find(opt => opt.id === group)?.label || group).join(', ')}
                  </SummaryValue>
                </SummaryItem>
                
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step2.userScale', 'User Scale')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>{formData.userScale}</SummaryValue>
                </SummaryItem>
                
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step2.geographicLocations', 'Geographic Locations')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.geographicLocations.includes('specific') 
                      ? `${formData.geographicLocations.filter(loc => loc !== 'specific').join(', ')}${formData.geographicLocations.filter(loc => loc !== 'specific').length > 0 ? ', ' : ''}${formData.specificLocation}` 
                      : formData.geographicLocations.join(', ')}
                  </SummaryValue>
                </SummaryItem>
              </SummaryAccordion>
              
              {/* Step 3 Summary */}
              <SummaryAccordion
                title={t('projects.wizard.step3.title', 'Functional Requirements')}
                isCompleted={true}
                onEdit={() => setCurrentStep(3)}
                isRTL={isRTL}
                className={isRTL ? 'rtl-accordion' : ''}
              >
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step3.authFeatures', 'Authentication Features')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.authFeatures.join(', ')}
                  </SummaryValue>
                </SummaryItem>
                
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step3.dataStorageFeatures', 'Data Storage Features')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.dataStorageFeatures.join(', ')}
                  </SummaryValue>
                </SummaryItem>
                
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step3.coreFeatures', 'Core Features')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.coreFeatures.includes('other') 
                      ? `${formData.coreFeatures.filter(f => f !== 'other').join(', ')}${formData.coreFeatures.filter(f => f !== 'other').length > 0 ? ', ' : ''}${formData.otherFeatureText}` 
                      : formData.coreFeatures.join(', ')}
                  </SummaryValue>
                </SummaryItem>
              </SummaryAccordion>
              
              {/* Step 4 Summary */}
              <SummaryAccordion
                title={t('projects.wizard.step4.title', 'Technical Preferences')}
                isCompleted={true}
                onEdit={() => setCurrentStep(4)}
                isRTL={isRTL}
                className={isRTL ? 'rtl-accordion' : ''}
              >
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step4.platforms', 'Platforms')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.platforms.join(', ')}
                  </SummaryValue>
                </SummaryItem>
                
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step4.techStack', 'Tech Stack')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.techStack === 'custom' ? formData.customTechStack : formData.techStack}
                  </SummaryValue>
                </SummaryItem>
                
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step4.hosting', 'Hosting')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>{formData.hosting}</SummaryValue>
                </SummaryItem>
              </SummaryAccordion>
              
              {/* Step 5 Summary */}
              <SummaryAccordion
                title={t('projects.wizard.step5.title', 'Budget & Resources')}
                isCompleted={true}
                onEdit={() => setCurrentStep(5)}
                isRTL={isRTL}
                className={isRTL ? 'rtl-accordion' : ''}
              >
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step5.budgetRange', 'Budget Range')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>{formData.budgetRange}</SummaryValue>
                </SummaryItem>
                
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step5.existingResources', 'Existing Resources')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.existingResources.length > 0 ? formData.existingResources.join(', ') : t('common.none', 'None')}
                  </SummaryValue>
                </SummaryItem>
                
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step5.existingMaterials', 'Existing Materials')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.existingMaterials.length > 0 ? formData.existingMaterials.join(', ') : t('common.none', 'None')}
                  </SummaryValue>
                </SummaryItem>
              </SummaryAccordion>
              
              {/* Step 6 Summary */}
              <SummaryAccordion
                title={t('projects.wizard.step6.title', 'Additional Details')}
                isCompleted={true}
                onEdit={() => setCurrentStep(6)}
                isRTL={isRTL}
                className={isRTL ? 'rtl-accordion' : ''}
              >
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step6.additionalNotes', 'Additional Notes')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.additionalNotes ? formData.additionalNotes : t('common.none', 'None')}
/* ... */
                  </SummaryValue>
                </SummaryItem>
                
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step6.relevantLinks', 'Relevant Links')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.relevantLinks.length > 0 
                      ? formData.relevantLinks.map((link, index) => (
                          <div key={index}>{link.title}: {link.url}</div>
                        ))
                      : t('common.none', 'None')
                    }
                  </SummaryValue>
                </SummaryItem>
                
                <SummaryItem isRTL={isRTL}>
                  <SummaryLabel isRTL={isRTL}>{t('projects.wizard.step6.fileUploads', 'Uploaded Files')}:</SummaryLabel>
                  <SummaryValue isRTL={isRTL}>
                    {formData.uploadedFiles.length > 0 
                      ? formData.uploadedFiles.map((file, index) => (
                          <div key={index}>{file.name}</div>
                        ))
                      : t('common.none', 'None')
                    }
                  </SummaryValue>
                </SummaryItem>
                
              </SummaryAccordion>
              
              {/* Confirmation section */}
              <div style={{ 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: isRTL ? 'flex-end' : 'flex-start', 
                marginTop: spacing.lg,
                direction: isRTL ? 'rtl' : 'ltr'
              }}>
                <ConfirmationContainer isRTL={isRTL}>
                  <CheckboxWrapper isRTL={isRTL}>
                    <ConfirmationCheckbox 
                      id="confirmationCheckbox"
                      checked={formData.confirmationChecked}
                      onChange={(e) => handleChange('confirmationChecked', e.target.checked)}
                      isRTL={isRTL}
                    />
                  </CheckboxWrapper>
                  <ConfirmationLabel htmlFor="confirmationCheckbox" isRTL={isRTL}>
                    {t('projects.wizard.step7Info.confirmationText', 'I confirm that all information is accurate.')}
                  </ConfirmationLabel>
                </ConfirmationContainer>
                
                <SubmitNote isRTL={isRTL}>
                  {t('projects.wizard.step7Info.submitNote', 'By submitting, you agree to our Terms of Service.')}
                </SubmitNote>
              </div>
            </FormGroup>
          </StepContainer>
        );
      default:
        return null;
    }
  };

  // Force re-render on language change
  useEffect(() => {
    // This will trigger a re-render when language changes
    // ensuring all translations update properly
    
    // Apply RTL-specific document styles when language is Arabic
    if (isRTL) {
      document.body.classList.add('rtl-mode');
    } else {
      document.body.classList.remove('rtl-mode');
    }
  }, [i18n.language, isRTL]);
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('projects.wizard.title', 'Create New Project')}
      titleStyle={{ textAlign: 'center' }}
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
          
          {!isSubmitSuccess && (
            <>
              <ModalButton 
                secondary 
                onClick={handlePrevStep}
                isRTL={isRTL}
                disabled={currentStep === 1}
                style={{
                  opacity: currentStep === 1 ? '0.5' : '1',
                  cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                {t('common.back', 'Back')}
              </ModalButton>
              
              <ModalButton 
                primary 
                onClick={handleNextStep}
                isRTL={isRTL}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner />
                ) : currentStep === totalSteps ? (
                  t('projects.wizard.submit', 'Submit')
                ) : (
                  t('projects.wizard.continue', 'Continue')
                )}
              </ModalButton>
            </>
          )}
        </ModalFooter>
      }
    >
      <WizardContainer className="wizard-container" isRTL={isRTL}>
        {/* Progress indicator */}
        {renderProgressBar()}
        
        {/* Step content */}
        {renderStepContent()}
      </WizardContainer>
    </Modal>
  );
};

// Styled components for Step 7 Review
const SummaryItem = styled.div`
  display: flex;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  margin-bottom: ${spacing.sm};
  padding: ${spacing.xs} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  /* Ensure proper alignment of dropdown menus */
  .dropdown-menu,
  .select-dropdown {
    text-align: ${props => props.isRTL ? 'right' : 'left'};
    direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
    left: ${props => props.isRTL ? 'auto' : '0'};
    right: ${props => props.isRTL ? '0' : 'auto'};
  }
  
  /* Fix alignment of links and buttons */
  a, button {
    text-align: ${props => props.isRTL ? 'right' : 'left'};
    direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: ${props => props.isRTL ? 'flex-end' : 'flex-start'};
    padding: ${spacing.sm} 0;
  }
`;

const SummaryLabel = styled.span`
  font-weight: 600;
  color: ${colors.text.primary};
  margin-${props => props.isRTL ? 'left' : 'right'}: ${spacing.sm};
  min-width: 120px;
  font-size: ${props => props.isRTL ? '0.95rem' : '0.9rem'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    margin-${props => props.isRTL ? 'left' : 'right'}: 0;
    margin-bottom: ${spacing.xs};
    min-width: auto;
    font-size: 0.9rem;
  }
`;

const SummaryValue = styled.span`
  color: ${colors.text.secondary};
  flex: 1;
  font-size: ${props => props.isRTL ? '0.95rem' : '0.9rem'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  /* Fix dropdown alignment in RTL mode */
  div, ul, li, a {
    text-align: ${props => props.isRTL ? 'right' : 'left'};
    direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  }
  
  /* Ensure proper alignment of nested content */
  div[role="button"],
  button {
    text-align: ${props => props.isRTL ? 'right' : 'left'};
    direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    font-size: 0.95rem;
  }
`;

const ConfirmationContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  align-items: center;
  justify-content: ${props => props.isRTL ? 'flex-end' : 'flex-start'};
  margin: ${spacing.lg} 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: ${borderRadius.sm};
  padding: ${spacing.lg} ${spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 60px;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  position: relative;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  box-shadow: ${props => props.isRTL ? 
    '-2px 0 5px rgba(0, 0, 0, 0.1)' : 
    '2px 0 5px rgba(0, 0, 0, 0.1)'};
`;

const CheckboxWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, ${colors.accent.primary}, ${colors.accent.secondary});
  border-radius: 4px;
  margin-${props => props.isRTL ? 'left' : 'right'}: ${spacing.md};
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  top: 0;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  }
`;

const ConfirmationCheckbox = styled.input.attrs({ type: 'checkbox' })`
  cursor: pointer;
  width: 14px;
  height: 14px;
  accent-color: white;
  margin: 0;
  opacity: 1;
  position: relative;
  ${props => props.isRTL ? 'right: 0;' : 'left: 0;'}
  transform: ${props => props.isRTL ? 'scale(1.05)' : 'scale(1)'};
`;

const ConfirmationLabel = styled.label`
  font-weight: 400;
  cursor: pointer;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  font-size: ${props => props.isRTL ? '0.95rem' : '0.9rem'};
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  display: inline-flex;
  align-items: center;
  height: 20px;
  letter-spacing: ${props => props.isRTL ? '0' : '0.2px'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const SubmitNote = styled.p`
  font-size: ${props => props.isRTL ? '0.8rem' : '0.75rem'};
  color: ${colors.text.muted};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  font-style: ${props => props.isRTL ? 'normal' : 'italic'};
  line-height: 1.3;
  margin-top: ${spacing.xs};
  opacity: 0.7;
  padding: 0 ${spacing.sm};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  width: 100%;
`;

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
  
  /* RTL-specific adjustments */
  & * {
    letter-spacing: ${props => props.isRTL ? '0' : 'inherit'};
  }
  
  /* Arabic text typically needs more space */
  & input, & textarea, & select, & button {
    font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.md} * 1.05)` : typography.fontSizes.md};
    line-height: ${props => props.isRTL ? '1.6' : '1.5'};
  }
  
  /* Improved mobile responsiveness */
  @media (max-width: ${breakpoints.md}) {
    padding: 0 ${spacing.md} ${spacing.md};
  }
  
  @media (max-width: ${breakpoints.sm}) {
    padding: 0 ${spacing.sm} ${spacing.sm};
    margin: 0;
    & input, & textarea, & select, & button {
      font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.sm} * 1.05)` : typography.fontSizes.sm};
    }
  }
  
  @media (max-width: ${breakpoints.xs}) {
    padding: ${spacing.xs};
    gap: ${spacing.xs};
    & input, & textarea, & select, & button {
      font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.xs} * 1.05)` : typography.fontSizes.xs};
    }
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

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.md} ${spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  width: 100%;
  gap: ${spacing.md};
  
  @media (max-width: ${breakpoints.sm}) {
    flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
    justify-content: space-between;
    padding: ${spacing.md} ${spacing.lg};
    gap: ${spacing.sm};
  }
  
  @media (max-width: ${breakpoints.xs}) {
    padding: ${spacing.sm};
    gap: ${spacing.xs};
  }
`;

const ModalButton = styled.button`
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-weight: ${typography.fontWeights.semiBold};
  font-family: ${typography.fontFamily};
  font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.md} * 1.05)` : typography.fontSizes.md};
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 120px;
  position: relative;
  margin: 0;
  flex: 1;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* RTL-specific adjustments */
  & svg {
    margin-right: ${props => props.isRTL ? '0' : spacing.xs};
    margin-left: ${props => props.isRTL ? spacing.xs : '0'};
    order: ${props => props.isRTL ? '1' : '0'};
  }
  
  @media (max-width: ${breakpoints.sm}) {
    padding: ${spacing.sm} ${spacing.md};
    font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.sm} * 1.05)` : typography.fontSizes.sm};
    min-width: 100px;
    height: 50px;
    max-width: 48%;
  }
  
  @media (max-width: ${breakpoints.xs}) {
    padding: ${spacing.xs} ${spacing.sm};
    font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.xs} * 1.05)` : typography.fontSizes.xs};
    border-radius: ${borderRadius.sm};
    min-width: 80px;
    height: 40px;
    max-width: 48%;
  }
  
  ${props => props.primary && `
    background: ${colors.accent.primary};
    color: white;
    
    &:hover {
      background: ${colors.accent.secondary};
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  ${props => props.secondary && `
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    &:active {
      background: rgba(255, 255, 255, 0.1);
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
  padding: ${spacing.lg};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: ${breakpoints.sm}) {
    margin: 0 0 ${spacing.lg} 0;
    padding: ${spacing.md};
    justify-content: space-around;
  }
  
  @media (max-width: ${breakpoints.xs}) {
    margin: 0 0 ${spacing.md} 0;
    padding: ${spacing.sm};
  }
  
  /* Simple timeline line */
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: ${spacing.xl};
    right: ${spacing.xl};
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-50%);
    z-index: 0;
  }
`;

/* Removed decorative elements for better performance */

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
  
  /* RTL optimization for Arabic */
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  
  /* Mobile responsiveness improvements */
  @media (max-width: ${breakpoints.sm}) {
    margin-top: ${spacing.md};
    gap: ${spacing.sm};
  }
  
  /* Optimize for Arabic text which may need more space */
  & .rtl-optimized {
    font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.lg} * 1.05)` : typography.fontSizes.lg};
    line-height: ${props => props.isRTL ? '1.6' : '1.5'};
  }
  
  & .rtl-optimized-cards {
    margin: ${props => props.isRTL ? `0 ${spacing.xs} 0 0` : `0 0 0 ${spacing.xs}`};
  }
  padding: ${spacing.md};
  background: linear-gradient(135deg, rgba(25, 25, 50, 0.2), rgba(35, 35, 70, 0.2));
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(74, 108, 247, 0.05);
  position: relative;
  transition: all ${transitions.fast};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  width: 100%;
  max-width: 100%;
  
  @media (max-width: 768px) {
    padding: ${spacing.sm};
    gap: ${spacing.sm};
    margin-top: ${spacing.md};
  }
  
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
  font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.lg} * 1.05)` : typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.semiBold};
  margin-bottom: ${spacing.md};
  color: ${colors.accent.primary};
  text-align: center;
  font-family: ${typography.fontFamily};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  width: 100%;
  
  @media (max-width: ${breakpoints.sm}) {
    font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.md} * 1.05)` : typography.fontSizes.md};
    margin-bottom: ${spacing.sm};
  }
  
  @media (max-width: ${breakpoints.xs}) {
    font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.sm} * 1.05)` : typography.fontSizes.sm};
    margin-bottom: ${spacing.xs};
  }
  
  /* Add gradient text effect */
  background: linear-gradient(${props => props.isRTL ? '-90deg' : '90deg'}, ${colors.accent.primary}, ${colors.accent.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FormGroup = styled.div`
  margin-bottom: ${spacing.lg};
  width: 100%;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const FormSubtext = styled.p`
  margin-top: ${spacing.xs};
  color: ${colors.text.secondary};
  font-size: ${props => props.isRTL ? '0.9rem' : '0.85rem'};
  opacity: 0.8;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${spacing.xs};
  font-weight: 500;
  color: ${colors.text.primary};
  font-size: ${props => props.isRTL ? '1rem' : '0.95rem'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  padding-right: ${props => props.isRTL ? spacing.xs : '0'};
  padding-left: ${props => props.isRTL ? '0' : spacing.xs};
  
  /* Mobile responsiveness */
  @media (max-width: ${breakpoints.sm}) {
    font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.xs} * 1.05)` : typography.fontSizes.xs};
    margin-bottom: ${spacing.xs};
  }
  
  /* Arabic doesn't use italics */
  font-style: ${props => props.isRTL ? 'normal' : 'inherit'};
  line-height: 1.5;
  
  @media (max-width: ${breakpoints.xs}) {
    font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.xs} * 1.05)` : typography.fontSizes.xs};
  }
`;

const ErrorMessage = styled.div`
  color: ${colors.error};
  font-size: ${typography.fontSizes.sm};
  margin-right: auto;
  margin-left: ${props => props.isRTL ? 'auto' : '0'};
  margin-right: ${props => props.isRTL ? '0' : 'auto'};
  padding: ${spacing.xs} 0;
`;

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-${props => props.isRTL ? 'right' : 'left'}: ${spacing.xs};
  font-size: 0.9em;
  cursor: help;
  color: ${colors.accent.primary};
  vertical-align: middle;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
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