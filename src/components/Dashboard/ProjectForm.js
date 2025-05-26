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
            <FaFileAlt />
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
            <FaUser />
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
            <FaCalendarAlt />
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
            <FaFileAlt />
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
            <FaBuilding />
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
        <CancelButton 
          type="button" 
          onClick={onCancel}
          data-testid="cancel-button"
        >
          {t('common.cancel', 'Cancel')}
        </CancelButton>
        <SubmitButton 
          type="submit"
          data-testid="submit-button"
        >
          {initialData ? t('common.update', 'Update') : t('common.create', 'Create')}
        </SubmitButton>
      </FormActions>
    </FormContainer>
  );
};

// Styled Components
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  width: 100%;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const FormRow = styled.div`
  display: flex;
  gap: ${spacing.lg};
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${spacing.md};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  flex: ${props => props.isFullWidth ? 1 : '1 1 0'};
`;

const Label = styled.label`
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  
  svg {
    color: ${colors.accent.primary};
    font-size: ${typography.fontSizes.sm};
  }
`;

const Input = styled.input`
  background: ${colors.background.card};
  border: 1px solid ${props => props.hasError ? colors.status.error : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  color: ${colors.text.primary};
  width: 100%;
  font-size: ${typography.fontSizes.sm};
  transition: ${transitions.medium};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px rgba(130, 161, 191, 0.3);
  }
  
  &::placeholder {
    color: ${colors.text.disabled};
  }
`;

const TextArea = styled.textarea`
  background: ${colors.background.card};
  border: 1px solid ${props => props.hasError ? colors.status.error : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  color: ${colors.text.primary};
  width: 100%;
  font-size: ${typography.fontSizes.sm};
  transition: ${transitions.medium};
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px rgba(130, 161, 191, 0.3);
  }
  
  &::placeholder {
    color: ${colors.text.disabled};
  }
`;

const Select = styled.select`
  background: ${colors.background.card};
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
  gap: ${spacing.xs};
  align-items: center;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

const MoodOption = styled.button`
  ${mixins.flexCenter}
  gap: ${spacing.xs};
  background: ${props => props.isSelected ? colors.accent.primary : colors.background.card};
  color: ${colors.text.primary};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  border: 1px solid ${props => props.isSelected ? colors.accent.primary : 'rgba(255, 255, 255, 0.1)'};
  transition: ${transitions.medium};
  cursor: pointer;
  flex: 1;
  
  svg {
    font-size: ${typography.fontSizes.md};
    color: ${props => {
      if (props.isSelected) return colors.text.primary;
      
      switch(props.title) {
        case 'Happy': return '#4CAF50';
        case 'Neutral': return '#FFC107';
        case 'Unhappy': return '#F44336';
        default: return colors.text.secondary;
      }
    }};
  }
  
  &:hover {
    background: ${colors.accent.secondary};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  @media (max-width: 768px) {
    span {
      display: none;
    }
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.md};
  margin-top: ${spacing.md};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: ${spacing.md} ${spacing.lg};
  border-radius: ${borderRadius.md};
  font-weight: ${typography.fontWeights.medium};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: ${transitions.medium};
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SubmitButton = styled(Button)`
  background: ${colors.gradients.button};
  color: ${colors.text.primary};
  border: none;
  box-shadow: ${shadows.sm};
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
  }
`;

const CancelButton = styled(Button)`
  background: transparent;
  color: ${colors.text.secondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.05);
    color: ${colors.text.primary};
  }
`;

const ErrorMessage = styled.p`
  font-size: ${typography.fontSizes.xs};
  color: ${colors.status.error};
  margin: 0;
`;

export default ProjectForm;
