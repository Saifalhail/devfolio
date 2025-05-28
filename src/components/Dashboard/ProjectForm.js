import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaUser, FaBuilding, FaFileAlt, FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import { Timestamp } from 'firebase/firestore';
import { colors, spacing, borderRadius, shadows, mixins, transitions, typography } from '../../styles/GlobalTheme';

/**
 * ProjectForm component - For creating and editing projects
 * Supports RTL layout and has proper form validation
 */
const ProjectForm = ({ onSubmit, initialData, onCancel }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    client: initialData?.client || '',
    description: initialData?.description || '',
    deadline: initialData?.deadline ? new Date(initialData.deadline.toDate()).toISOString().split('T')[0] : '',
    status: initialData?.status || 'notStarted',
    clientMood: initialData?.clientMood || 'neutral'
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('validation.required', 'This field is required');
    if (!formData.client.trim()) newErrors.client = t('validation.required', 'This field is required');
    if (!formData.description.trim()) newErrors.description = t('validation.required', 'This field is required');
    if (!formData.deadline) newErrors.deadline = t('validation.required', 'This field is required');
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Convert deadline string to Timestamp
    const projectData = {
      ...formData,
      deadline: formData.deadline ? Timestamp.fromDate(new Date(formData.deadline)) : null
    };
    
    onSubmit(projectData);
  };
  
  const statuses = [
    { value: 'notStarted', label: t('projects.notStarted', 'Not Started') },
    { value: 'inProgress', label: t('projects.inProgress', 'In Progress') },
    { value: 'awaitingFeedback', label: t('projects.awaitingFeedback', 'Awaiting Feedback') },
    { value: 'done', label: t('projects.done', 'Done') }
  ];
  
  const moods = [
    { value: 'happy', label: t('projects.moods.happy', 'Happy'), icon: <FaSmile /> },
    { value: 'neutral', label: t('projects.moods.neutral', 'Neutral'), icon: <FaMeh /> },
    { value: 'unhappy', label: t('projects.moods.unhappy', 'Unhappy'), icon: <FaFrown /> }
  ];
  
  return (
    <FormContainer onSubmit={handleSubmit} isRTL={isRTL}>
      <FormRow>
        <FormGroup isFullWidth>
          <Label htmlFor="name">
            <span className="icon-wrapper"><FaFileAlt /></span>
            {t('projects.name', 'Project Name')}
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('projects.namePlaceholder', 'Enter project name')}
            isRTL={isRTL}
            hasError={!!errors.name}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>
      </FormRow>
      
      <FormRow>
        <FormGroup>
          <Label htmlFor="client">
            <span className="icon-wrapper"><FaUser /></span>
            {t('projects.client', 'Client')}
          </Label>
          <Input
            id="client"
            name="client"
            value={formData.client}
            onChange={handleChange}
            placeholder={t('projects.clientPlaceholder', 'Enter client name')}
            isRTL={isRTL}
            hasError={!!errors.client}
          />
          {errors.client && <ErrorMessage>{errors.client}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="deadline">
            <span className="icon-wrapper"><FaCalendarAlt /></span>
            {t('projects.deadline', 'Deadline')}
          </Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            isRTL={isRTL}
            hasError={!!errors.deadline}
          />
          {errors.deadline && <ErrorMessage>{errors.deadline}</ErrorMessage>}
        </FormGroup>
      </FormRow>
      
      <FormRow>
        <FormGroup isFullWidth>
          <Label htmlFor="description">
            <span className="icon-wrapper"><FaFileAlt /></span>
            {t('projects.description', 'Description')}
          </Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t('projects.descriptionPlaceholder', 'Enter project description')}
            rows={4}
            isRTL={isRTL}
            hasError={!!errors.description}
          />
          {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
        </FormGroup>
      </FormRow>
      
      <FormRow>
        <FormGroup>
          <Label htmlFor="status">
            <span className="icon-wrapper"><FaBuilding /></span>
            {t('projects.status', 'Status')}
          </Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            isRTL={isRTL}
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>
            <span className="icon-wrapper"><FaSmile /></span>
            {t('projects.clientMood', 'Client Mood')}
          </Label>
          <MoodSelector>
            {moods.map(mood => (
              <MoodOption 
                key={mood.value}
                isSelected={formData.clientMood === mood.value}
                onClick={() => setFormData({...formData, clientMood: mood.value})}
                title={mood.label}
                data-testid={`mood-${mood.value}`}
                type="button"
              >
                {mood.icon}
                <span>{mood.label}</span>
              </MoodOption>
            ))}
          </MoodSelector>
        </FormGroup>
      </FormRow>
      
      <FormActions>
        <div>
          <CancelButton 
            type="button" 
            onClick={onCancel}
            data-testid="cancel-button"
          >
            {t('common.cancel', 'Cancel')}
          </CancelButton>
        </div>
        <div>
          <SubmitButton 
            type="submit"
            data-testid="submit-button"
          >
            {initialData ? t('common.update', 'Update') : t('common.create', 'Create')}
          </SubmitButton>
        </div>
      </FormActions>
    </FormContainer>
  );
};

// Styled Components
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  width: 100%;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  max-height: 60vh;
  overflow-y: auto;
  padding-right: ${spacing.sm};
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.03);
    border-radius: ${borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: ${borderRadius.sm};
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
  
  /* RTL scrollbar positioning */
  [dir="rtl"] & {
    padding-right: 0;
    padding-left: ${spacing.sm};
    
    &::-webkit-scrollbar {
      position: absolute;
      left: 0;
    }
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: ${spacing.md};
  width: 100%;
  margin-bottom: ${spacing.xs};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${spacing.sm};
  }
`;

const FormGroup = styled.div`
  flex: ${props => props.isFullWidth ? '1 0 100%' : '1'};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  position: relative;
`;

const Label = styled.label`
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #fff, #8338ec);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(131, 56, 236, 0.2);
  display: flex;
  align-items: center;
  
  /* Icon wrapper styling */
  .icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: ${spacing.md};
  }
  
  /* Style for the icon */
  svg {
    font-size: ${typography.fontSizes.lg};
    color: #8338ec;
  }
`;

const Input = styled.input`
  background: ${colors.background.secondary};
  border: 1px solid ${props => props.hasError ? colors.status.error : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  color: ${colors.text.primary};
  width: 100%;
  font-size: ${typography.fontSizes.sm};
  transition: ${transitions.medium};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  height: 48px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px rgba(130, 161, 191, 0.3);
  }
  
  &::placeholder {
    color: ${colors.text.disabled};
    opacity: 0.7;
  }
`;

const TextArea = styled.textarea`
  background: ${colors.background.secondary};
  border: 1px solid ${props => props.hasError ? colors.status.error : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  color: ${colors.text.primary};
  width: 100%;
  font-size: ${typography.fontSizes.sm};
  transition: ${transitions.medium};
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px rgba(130, 161, 191, 0.3);
  }
  
  &::placeholder {
    color: ${colors.text.disabled};
    opacity: 0.7;
  }
`;

const Select = styled.select`
  background: ${colors.background.secondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  color: ${colors.text.primary};
  width: 100%;
  font-size: ${typography.fontSizes.sm};
  transition: ${transitions.medium};
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: ${props => props.isRTL ? '8px center' : 'calc(100% - 8px) center'};
  padding-right: ${props => props.isRTL ? '0.5rem' : '2rem'};
  padding-left: ${props => props.isRTL ? '2rem' : '0.5rem'};
  cursor: pointer;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  height: 48px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px rgba(130, 161, 191, 0.3);
  }
  
  /* Adjust the arrow position for RTL */
  [dir="rtl"] & {
    background-position: 8px center;
  }
`;

const MoodSelector = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;
  justify-content: flex-start;
  margin-top: ${spacing.xs};
  
  @media (max-width: 480px) {
    justify-content: space-around;
  }
`;

const MoodOption = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
  border-radius: 0;
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: ${transitions.medium};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.isSelected ? '24px' : '0'};
    height: 2px;
    background: ${props => {
      switch(props.title) {
        case 'Happy': return '#4CAF50';
        case 'Neutral': return '#FFC107';
        case 'Unhappy': return '#F44336';
        default: return colors.accent.primary;
      }
    }};
    transition: width 0.2s ease;
  }
  
  svg {
    font-size: 1.75rem;
    color: ${props => {
      if (!props.isSelected) return colors.text.secondary;
      
      switch(props.title) {
        case 'Happy': return '#4CAF50';
        case 'Neutral': return '#FFC107';
        case 'Unhappy': return '#F44336';
        default: return colors.text.secondary;
      }
    }};
  }
  
  &:hover {
    transform: translateY(-2px);
    
    &::before {
      width: 24px;
    }
    
    svg {
      color: ${props => {
        switch(props.title) {
          case 'Happy': return '#4CAF50';
          case 'Neutral': return '#FFC107';
          case 'Unhappy': return '#F44336';
          default: return colors.text.secondary;
        }
      }};
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  span {
    display: none;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${spacing.lg};
  margin-top: ${spacing.xl};
  padding-top: ${spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: ${spacing.sm};
  }
`;

const Button = styled.button`
  padding: ${spacing.md} ${spacing.lg};
  border-radius: ${borderRadius.md};
  font-weight: ${typography.fontWeights.bold};
  font-size: ${typography.fontSizes.md};
  cursor: pointer;
  transition: ${transitions.medium};
  letter-spacing: 0.5px;
  min-width: 140px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(90deg, #cd3efd, #7b2cbf);
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 12px rgba(123, 44, 191, 0.3);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.2));
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(123, 44, 191, 0.4);
    
    &:before {
      transform: translateX(100%);
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(123, 44, 191, 0.3);
  }
`;

const CancelButton = styled(Button)`
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    margin-right: 0;
    margin-left: ${spacing.md};
  }
`;

const ErrorMessage = styled.p`
  font-size: ${typography.fontSizes.xs};
  color: ${colors.status.error};
  margin: 4px 0 0 0;
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  
  &::before {
    content: '⚠️';
    font-size: 10px;
  }
`;

export default ProjectForm;
