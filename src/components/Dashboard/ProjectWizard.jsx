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
  DragDropUploader
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
    uploadedFiles: []
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
        uploadedFiles: []
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
    setError(null);
    
    // Validation for step 1
    if (currentStep === 1) {
      // Temporarily commented out for testing purposes
      /*
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
      */
    }
    
    // Validation for step 2
    if (currentStep === 2) {
      // Temporarily commented out for testing purposes
      /*
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
      */
    }
    
    // Validation for step 3
    if (currentStep === 3) {
      // Temporarily commented out for testing purposes
      /*
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
      */
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
      if (currentStep < 6) {
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
      // Compile project data from all steps
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
        uploadedFiles: formData.uploadedFiles,
        
        // Default values
        status: 'inProgress',
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
  const totalSteps = 6;
  
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
    switch (currentStep) {
      case 1:
        return (
          <StepContainer>
            <StepTitle isRTL={isRTL}>{t('projects.wizard.step1.title', 'Step 1: Project Info')}</StepTitle>
            
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
            <StepTitle isRTL={isRTL}>
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
            <StepTitle isRTL={isRTL}>
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
            <StepTitle isRTL={isRTL}>
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
            <StepTitle isRTL={isRTL}>
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
            <StepTitle isRTL={isRTL}>
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
      default:
        return null;
    }
  };

  // Force re-render on language change
  useEffect(() => {
    // This will trigger a re-render when language changes
    // ensuring all translations update properly
  }, [i18n.language]);
  
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
  transition: all ${transitions.fast};
  border: none;
  min-width: 120px;
  position: relative;
  overflow: hidden;
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
  
  @media (max-width: 480px) {
    padding: ${spacing.xs};
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
  margin-bottom: ${props => props.marginBottom || spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  background: linear-gradient(${props => props.isRTL ? '-135deg' : '135deg'}, rgba(25, 25, 50, 0.2), rgba(35, 35, 70, 0.2));
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(74, 108, 247, 0.05);
  position: relative;
  transition: all ${transitions.fast};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  width: 100%;
  
  /* Add a subtle border accent on the right or left side based on RTL */
  border-${props => props.isRTL ? 'right' : 'left'}: 3px solid ${colors.accent.primary};
  
  /* RTL-specific adjustments for form elements */
  & label {
    text-align: ${props => props.isRTL ? 'right' : 'left'};
    font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.md} * 1.05)` : typography.fontSizes.md};
  }
  
  & input, & select, & textarea {
    text-align: ${props => props.isRTL ? 'right' : 'left'};
    direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
    padding-right: ${props => props.isRTL ? spacing.lg : spacing.md};
    padding-left: ${props => props.isRTL ? spacing.md : spacing.lg};
  }
  
  /* Adjust icon positioning in inputs for RTL */
  & .input-icon {
    left: ${props => props.isRTL ? 'auto' : spacing.sm};
    right: ${props => props.isRTL ? spacing.sm : 'auto'};
  }
  
  @media (max-width: ${breakpoints.sm}) {
    margin-bottom: ${spacing.md};
    padding: ${spacing.sm};
    gap: ${spacing.xs};
    border-radius: ${borderRadius.sm};
    
    & label {
      font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.sm} * 1.05)` : typography.fontSizes.sm};
    }
  }
  
  @media (max-width: ${breakpoints.xs}) {
    margin-bottom: ${spacing.sm};
    padding: ${spacing.xs};
    border-width: 1px;
    
    & label {
      font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.xs} * 1.05)` : typography.fontSizes.xs};
    }
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
  display: block;
  margin-bottom: ${spacing.xs};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.text.primary};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  display: flex;
  align-items: center;
  justify-content: ${props => props.isRTL ? 'flex-end' : 'flex-start'};
`;

const FormSubtext = styled.div`
  font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.sm} * 1.05)` : typography.fontSizes.sm};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.sm};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  
  /* Enhanced RTL support */
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  padding-right: ${props => props.isRTL ? spacing.xs : '0'};
  padding-left: ${props => props.isRTL ? '0' : spacing.xs};
  
  /* Mobile responsiveness */
  @media (max-width: ${breakpoints.sm}) {
    font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.xs} * 1.05)` : typography.fontSizes.xs};
    margin-bottom: ${spacing.xs};
  }
  font-style: ${props => props.isRTL ? 'normal' : 'italic'}; /* Arabic doesn't use italics */
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  line-height: 1.5;
  padding: ${props => props.isRTL ? `0 ${spacing.xs} 0 0` : `0 0 0 ${spacing.xs}`};
  border-${props => props.isRTL ? 'right' : 'left'}: 2px solid ${colors.accent.primary};
  opacity: 0.9;
  
  @media (max-width: ${breakpoints.sm}) {
    font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.xs} * 1.05)` : typography.fontSizes.xs};
    margin-bottom: ${spacing.xxs};
    padding: ${props => props.isRTL ? `0 ${spacing.xxs} 0 0` : `0 0 0 ${spacing.xxs}`};
  }
  
  /* Add gradient text effect for better visibility on mobile */
  @media (max-width: ${breakpoints.xs}) {
    background: linear-gradient(${props => props.isRTL ? '-90deg' : '90deg'}, ${colors.text.secondary}, ${colors.accent.primary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: ${typography.fontWeights.semiBold};
    border: none; /* Remove border on very small screens */
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