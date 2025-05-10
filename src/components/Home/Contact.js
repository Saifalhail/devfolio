import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission - in a real app, you'd make an API call here
    setTimeout(() => {
      setFormSuccess(true);
      setIsSubmitting(false);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormSuccess(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <ContactSection>
      <Container>
        <SectionHeader>
          <SectionTitle>{t('contact.title')}</SectionTitle>
          <SectionSubtitle>{t('contact.subtitle')}</SectionSubtitle>
          <SectionDescription>
            {t('contact.description')}
          </SectionDescription>
        </SectionHeader>
        
        <ContactContainer>
          <ContactInfo>
            <InfoHeading>{t('contact.info.heading')}</InfoHeading>
            <InfoText>
              {t('contact.info.text')}
            </InfoText>
            
            <ContactMethod>
              <MethodIcon>📧</MethodIcon>
              <MethodText>contact@devfolio.com</MethodText>
            </ContactMethod>
            
            <ContactMethod>
              <MethodIcon>📱</MethodIcon>
              <MethodText>+123 456 7890</MethodText>
            </ContactMethod>
            
            <ContactMethod>
              <MethodIcon>📍</MethodIcon>
              <MethodText>Location, City, Country</MethodText>
            </ContactMethod>
          </ContactInfo>
          
          <ContactForm onSubmit={handleSubmit}>
            <InputGroup>
              <FormLabel htmlFor="name">{t('contact.form.name')}</FormLabel>
              <FormInput 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </InputGroup>
            
            <InputGroup>
              <FormLabel htmlFor="email">{t('contact.form.email')}</FormLabel>
              <FormInput 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </InputGroup>
            
            <InputGroup>
              <FormLabel htmlFor="subject">{t('contact.form.subject')}</FormLabel>
              <FormInput 
                type="text" 
                id="subject" 
                name="subject" 
                value={formData.subject}
                onChange={handleChange}
                required 
              />
            </InputGroup>
            
            <InputGroup>
              <FormLabel htmlFor="message">{t('contact.form.message')}</FormLabel>
              <FormTextarea 
                id="message" 
                name="message" 
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required 
              />
            </InputGroup>
            
            {formSuccess && (
              <SuccessMessage>{t('contact.form.success')}</SuccessMessage>
            )}
            
            {formError && (
              <ErrorMessage>{formError}</ErrorMessage>
            )}
            
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('contact.form.sending') : t('contact.form.button')}
            </SubmitButton>
          </ContactForm>
        </ContactContainer>
      </Container>
    </ContactSection>
  );
};

const ContactSection = styled.section`
  padding: 5rem 0;
  background-color: var(--white);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-1);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
`;

const SectionSubtitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionDescription = styled.p`
  max-width: 600px;
  margin: 0 auto;
  color: var(--dark-gray);
  font-size: 1.1rem;
`;

const ContactContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  background-color: var(--dark);
  color: white;
  padding: 3rem;
  
  @media (max-width: 576px) {
    padding: 2rem;
  }
`;

const InfoHeading = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const InfoText = styled.p`
  margin-bottom: 2rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
`;

const ContactMethod = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
`;

const MethodIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 1rem;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MethodText = styled.span`
  font-size: 1rem;
`;

const ContactForm = styled.form`
  padding: 3rem;
  
  @media (max-width: 576px) {
    padding: 2rem;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark);
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--accent-2);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--accent-2);
  }
`;

const SubmitButton = styled.button`
  display: inline-block;
  padding: 0.8rem 2rem;
  background-color: var(--accent-2);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--dark);
    transform: translateY(-3px);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #e6f7e6;
  color: #2e7d32;
  border-radius: 8px;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 8px;
  font-weight: 500;
`;

export default Contact;
