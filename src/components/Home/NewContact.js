import React, { useState, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { mixins } from '../../styles/GlobalTheme';
import { useTranslation } from 'react-i18next';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase/config';
import { logFirebaseFunctionError } from '../../utils/errorHandling';
import {
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  InputGroup,
} from '../Common/FormComponents';

const NewContact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Refs for keyboard navigation
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const projectTypeRef = useRef(null);
  const messageRef = useRef(null);
  const submitRef = useRef(null);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };
  
  // Project type options
  const projectTypes = [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'ai', label: 'AI Integration' },
    { value: 'dashboard', label: 'Admin Dashboard' },
    { value: 'qr', label: 'QR Code Solution' },
    { value: 'custom', label: 'Custom Software' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateField = (field) => {
    let error = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (field === 'name' && !formData.name.trim()) {
      error = t('contact.form.validationError');
    }

    if (field === 'email') {
      if (!formData.email.trim()) {
        error = t('contact.form.validationError');
      } else if (!emailRegex.test(formData.email)) {
        error = t('contact.form.emailError');
      }
    }

    if (field === 'message' && !formData.message.trim()) {
      error = t('contact.form.validationError');
    }

    if (field === 'projectType' && !formData.projectType.trim()) {
      error = t('contact.form.projectTypeError', t('contact.form.validationError'));
    }

    setFieldErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };
  
  const handleFocus = (field) => {
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleBlur = (field) => {
    validateField(field);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      console.log('Starting form submission...');

      // Validate form data
      const nameValid = validateField('name');
      const emailValid = validateField('email');
      const messageValid = validateField('message');

      if (!nameValid || !emailValid || !messageValid) {
        setIsSubmitting(false);
        return;
      }

      // Get a reference to the Cloud Function
      const submitFormData = httpsCallable(functions, 'submitFormData');
      console.log('Cloud Function reference created');
      
      // Call the function with our form data
      console.log('Submitting form data:', formData);
      const result = await submitFormData({
        name: formData.name,
        email: formData.email,
        subject: formData.projectType || 'New Project Inquiry', // Map projectType to subject
        message: formData.message
      });
      
      console.log('Form submission result:', result.data);
      
      // Show success message
      setFormSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        projectType: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormSuccess(false);
      }, 5000);
    } catch (error) {
      logFirebaseFunctionError('submitFormData', error, { formData });
      
      // Extract detailed error information
      let errorMessage = t('contact.form.errorMessage') || 'There was an error submitting your form. Please try again.';
      
      if (error.code) {
        errorMessage = `Error type: ${error.code}. `;
      }
      
      if (error.message) {
        errorMessage += error.message;
      }
      
      if (error.details) {
        errorMessage += ` Details: ${JSON.stringify(error.details)}`;
      }
      
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ContactSection>
      <GradientOverlay />
      <FloatingCircle top="10%" left="5%" size="80px" delay="0s" />
      <FloatingCircle top="20%" right="10%" size="120px" delay="0.5s" />
      <FloatingCircle bottom="15%" left="15%" size="90px" delay="1s" />
      <FloatingCircle top="60%" right="5%" size="60px" delay="1.5s" />
      <FloatingCircle bottom="40%" left="40%" size="40px" delay="0.8s" />
      
      <ShapeDivider>
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </ShapeDivider>
      
      <Container>
        <SectionHeader isRTL={isRTL}>
          <SectionTitle as="h2">{t('contact.title')}</SectionTitle>
          <SectionSubtitle isRTL={isRTL}>{t('contact.subtitle')}</SectionSubtitle>
          <SectionDescription isRTL={isRTL}>
            {t('contact.description')}
          </SectionDescription>
        </SectionHeader>
        
        <ContactWrapper isRTL={isRTL}>
          <ContactInfo>
            <InfoContent>
              <InfoHeading>{t('contact.info.heading')}</InfoHeading>
              <InfoText>
                {t('contact.info.text')}
              </InfoText>
              
              <ContactMethods>
                <ContactMethod isRTL={isRTL}>
                  <MethodIcon isRTL={isRTL} role="img" aria-label={t('contact.iconAlt.email')}>📧</MethodIcon>
                  <MethodText isRTL={isRTL}>contact@devfolio.com</MethodText>
                </ContactMethod>
                
                <ContactMethod isRTL={isRTL}>
                  <MethodIcon isRTL={isRTL} role="img" aria-label={t('contact.iconAlt.phone')}>📱</MethodIcon>
                  <MethodText isRTL={isRTL}>+974 1234 5678</MethodText>
                </ContactMethod>
                
                <ContactMethod isRTL={isRTL}>
                  <MethodIcon isRTL={isRTL} role="img" aria-label={t('contact.iconAlt.location')}>📍</MethodIcon>
                  <MethodText isRTL={isRTL}>Doha, Qatar</MethodText>
                </ContactMethod>
              </ContactMethods>
              
              <ContactGraphic>
                <GraphicElement />
              </ContactGraphic>
            </InfoContent>
          </ContactInfo>
          
          <FormContainer>
            <ContactForm onSubmit={handleSubmit} isRTL={isRTL}>
              <FormHeader isRTL={isRTL}>
                <FormHeaderIcon isRTL={isRTL} role="img" aria-label={t('contact.iconAlt.message')}>✉️</FormHeaderIcon>
                <FormHeaderText isRTL={isRTL}>{t('contact.form.title')}</FormHeaderText>
              </FormHeader>
              
              <InputGroup isRTL={isRTL}>
                <FormLabel htmlFor="name" isRTL={isRTL}>{t('contact.form.name')}</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={() => handleBlur('name')}
                  onKeyDown={(e) => handleKeyDown(e, emailRef)}
                  ref={nameRef}
                  required
                  isRTL={isRTL}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  aria-errormessage={fieldErrors.name ? 'name-error' : undefined}
                  hasError={!!fieldErrors.name}
                />
                {fieldErrors.name && (
                  <FieldError id="name-error" isRTL={isRTL}>{fieldErrors.name}</FieldError>
                )}
              </InputGroup>
              
              <InputGroup isRTL={isRTL}>
                <FormLabel htmlFor="email" isRTL={isRTL}>{t('contact.form.email')}</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  onKeyDown={(e) => handleKeyDown(e, projectTypeRef)}
                  ref={emailRef}
                  required
                  isRTL={isRTL}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  aria-errormessage={fieldErrors.email ? 'email-error' : undefined}
                  hasError={!!fieldErrors.email}
                />
                {fieldErrors.email && (
                  <FieldError id="email-error" isRTL={isRTL}>{fieldErrors.email}</FieldError>
                )}
              </InputGroup>
              
              <InputGroup isRTL={isRTL}>
                <FormLabel htmlFor="projectType" isRTL={isRTL}>{t('contact.form.projectType')}</FormLabel>
              <FormSelect
                tabIndex="0"
                id="projectType"
                name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  onFocus={() => handleFocus('projectType')}
                  onBlur={() => handleBlur('projectType')}
                  onKeyDown={(e) => handleKeyDown(e, messageRef)}
                  ref={projectTypeRef}
                  isRTL={isRTL}
                  aria-invalid={!!fieldErrors.projectType}
                  aria-describedby={fieldErrors.projectType ? 'projectType-error' : undefined}
                  aria-errormessage={fieldErrors.projectType ? 'projectType-error' : undefined}
                >
                  <option value="">{isRTL ? 'اختر نوع المشروع' : 'Select project type'}</option>
                  {projectTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {isRTL ? type.label : type.label}
                    </option>
                  ))}
                </FormSelect>
                {fieldErrors.projectType && (
                  <FieldError id="projectType-error" isRTL={isRTL}>{fieldErrors.projectType}</FieldError>
                )}
              </InputGroup>
              
              <InputGroup isRTL={isRTL}>
                <FormLabel htmlFor="message" isRTL={isRTL}>{t('contact.form.message')}</FormLabel>
                <FormTextarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus('message')}
                  onBlur={() => handleBlur('message')}
                  onKeyDown={(e) => handleKeyDown(e, submitRef)}
                  ref={messageRef}
                  required
                  isRTL={isRTL}
                  aria-invalid={!!fieldErrors.message}
                  aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                  aria-errormessage={fieldErrors.message ? 'message-error' : undefined}
                  hasError={!!fieldErrors.message}
                />
                {fieldErrors.message && (
                  <FieldError id="message-error" isRTL={isRTL}>{fieldErrors.message}</FieldError>
                )}
              </InputGroup>
              
              {formSuccess && (
                <SuccessMessage
                  isRTL={isRTL}
                  role="status"
                  aria-live="polite"
                >
                  <SuccessIcon>✓</SuccessIcon>
                  <SuccessText>{t('contact.form.success')}</SuccessText>
                </SuccessMessage>
              )}
              
              {formError && (
                <ErrorMessage
                  isRTL={isRTL}
                  role="alert"
                  aria-live="assertive"
                >
                  <ErrorIcon>⚠️</ErrorIcon>
                  <ErrorText>{formError}</ErrorText>
                </ErrorMessage>
              )}
              
              <SubmitButtonWrapper>
                <SubmitButton
                  type="submit"
                  disabled={isSubmitting}
                  isRTL={isRTL}
                  ref={submitRef}
                >
                  {isSubmitting ? (
                    <>
                      <ButtonSpinner isRTL={isRTL} />
                      <span>{t('contact.form.sending')}</span>
                    </>
                  ) : (
                    t('contact.form.button')
                  )}
                </SubmitButton>
              </SubmitButtonWrapper>
            </ContactForm>
          </FormContainer>
        </ContactWrapper>
      </Container>
    </ContactSection>
  );
};

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const floatHorizontal = keyframes`
  0% { transform: translateX(0px); }
  50% { transform: translateX(10px); }
  100% { transform: translateX(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Reusable RTL styles for direction and alignment
const rtlStyles = css`
  direction: ${props => (props.isRTL ? 'rtl' : 'ltr')};
  text-align: ${props => (props.isRTL ? 'right' : 'left')};
`;

// Styled Components
const ContactSection = styled.section`
  position: relative;
  padding: 6rem 0 5rem;
  background-color: var(--white);
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 5rem 0 4rem;
  }
  
  @media (max-width: 480px) {
    padding: 4rem 0 3rem;
  }
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(205, 62, 253, 0.05) 0%, rgba(130, 161, 191, 0.05) 100%);
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle at 20% 30%, rgba(205, 62, 253, 0.05) 0%, transparent 50%), 
                     radial-gradient(circle at 80% 70%, rgba(130, 161, 191, 0.05) 0%, transparent 50%);
  }
`;

const FloatingCircle = styled.div`
  position: absolute;
  width: ${props => props.size || '100px'};
  height: ${props => props.size || '100px'};
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(205, 62, 253, 0.2) 0%, rgba(130, 161, 191, 0.2) 100%);
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  z-index: 1;
  backdrop-filter: blur(5px);
`;

const Container = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  z-index: 2;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  ${rtlStyles}
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #cd3efd;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 2px;
    background: linear-gradient(90deg, #cd3efd, #82a1bf);
  }
`;

const SectionSubtitle = styled.h3`
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 1.5rem;
  ${mixins.gradientText};
  ${rtlStyles}
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const SectionDescription = styled.p`
  max-width: 600px;
  margin: 0 auto;
  color: var(--dark-gray);
  font-size: 1.1rem;
  line-height: 1.6;
  ${rtlStyles}
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0 1rem;
  }
`;

const ContactWrapper = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 2rem;
  ${rtlStyles}
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

const ContactInfo = styled.div`
  position: relative;
  background: linear-gradient(135deg, #513a52 0%, #2d2235 100%);
  color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  height: 100%;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.3;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(205, 62, 253, 0.3) 0%, transparent 70%);
    animation: ${pulse} 3s infinite;
  }
`;

const InfoContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 2.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  ${rtlStyles}

  @media (max-width: 576px) {
    padding: 1.5rem;
  }
`;

const InfoHeading = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  ${mixins.gradientText};
  ${rtlStyles}
`;

const InfoText = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  ${rtlStyles}
`;

const ContactMethods = styled.div`
  margin-bottom: 1.5rem;
`;

const ContactMethod = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  
  &:hover {
    transform: translateX(${props => props.isRTL ? '-5px' : '5px'});
  }
`;

const MethodIcon = styled.span`
  font-size: 1.2rem;
  margin-${props => props.isRTL ? 'left' : 'right'}: 0.8rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(205, 62, 253, 0.2) 0%, rgba(130, 161, 191, 0.2) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
    
    &:before {
      opacity: 1;
    }
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
`;

const MethodText = styled.span`
  font-size: 1rem;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  color: rgba(255, 255, 255, 0.9);
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ContactGraphic = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GraphicElement = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(205, 62, 253, 0.3) 0%, rgba(130, 161, 191, 0.3) 100%);
  border-radius: 50%;
  position: relative;
  animation: ${pulse} 3s infinite ease-in-out;
  
  &:before, &:after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(205, 62, 253, 0.2) 0%, rgba(130, 161, 191, 0.2) 100%);
  }
  
  &:before {
    width: 70px;
    height: 70px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: ${pulse} 3s infinite ease-in-out 0.5s;
  }
  
  &:after {
    width: 35px;
    height: 35px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: ${pulse} 3s infinite ease-in-out 1s;
  }
`;

const FormContainer = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #cd3efd 0%, #82a1bf 100%);
    border-radius: 50%;
    z-index: 2;
    animation: ${pulse} 2s infinite;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: -5px;
    width: 15px;
    height: 15px;
    background: linear-gradient(135deg, #82a1bf 0%, #cd3efd 100%);
    border-radius: 50%;
    z-index: 2;
    animation: ${pulse} 2s infinite 1s;
  }
`;

const ContactForm = styled.form`
  padding: 2.5rem;
  ${rtlStyles}
  
  @media (max-width: 576px) {
    padding: 1.5rem;
  }
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
`;

const FormHeaderIcon = styled.span`
  font-size: 1.8rem;
  margin-${props => props.isRTL ? 'left' : 'right'}: 1rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const FormHeaderText = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--dark);
  ${rtlStyles}
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;


const SubmitButtonWrapper = styled.div`
  margin-top: 2rem;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ButtonSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-${props => (props.isRTL ? 'left' : 'right')}: 10px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 1s ease-in-out infinite;
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${props => (props.isRTL ? 'row-reverse' : 'row')};
  padding: 0.8rem 2rem;
  background: linear-gradient(90deg, #cd3efd, #82a1bf);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: ${shimmer} 2s infinite;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 10px;
    right: 10px;
    height: 5px;
    background: rgba(205, 62, 253, 0.5);
    border-radius: 50%;
    filter: blur(3px);
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(205, 62, 253, 0.3);
    
    &:after {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px dashed var(--accent-1);
    outline-offset: 3px;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    
    &:before, &:after {
      display: none;
    }
  }
`;

const MessageBase = styled.div`
  margin-bottom: 1.5rem;
  padding: 1.2rem;
  border-radius: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  animation: ${pulse} 2s ease-in-out;
  ${rtlStyles}
`;

const SuccessMessage = styled(MessageBase).attrs({
  role: 'status',
  'aria-live': 'polite',
})`
  background-color: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
  border-${props => (props.isRTL ? 'right' : 'left')}: 4px solid #2e7d32;
`;

const ErrorMessage = styled(MessageBase).attrs({
  role: 'alert',
  'aria-live': 'assertive',
})`
  background-color: rgba(198, 40, 40, 0.1);
  color: #c62828;
  border-${props => (props.isRTL ? 'right' : 'left')}: 4px solid #c62828;
`;

const IconBase = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-${props => (props.isRTL ? 'left' : 'right')}: 1rem;
  font-size: 1.2rem;
`;

const SuccessIcon = styled(IconBase)`
  background-color: #2e7d32;
  color: white;
`;

const ErrorIcon = styled(IconBase)`
  background-color: transparent;
`;

const SuccessText = styled.span``;

const ErrorText = styled.span``;

const FieldError = styled.span.attrs({
  role: 'alert',
  'aria-live': 'assertive',
})`
  color: #c62828;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
  ${rtlStyles}
`;

// Shape divider for the top of the section
const ShapeDivider = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background: linear-gradient(135deg, rgba(205, 62, 253, 0.1) 0%, rgba(130, 161, 191, 0.1) 100%);
    backdrop-filter: blur(5px);
  }
  
  svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 30px;
    transform: rotateY(180deg);
  }
  
  .shape-fill {
    fill: #FFFFFF;
  }
`;

export default NewContact;
