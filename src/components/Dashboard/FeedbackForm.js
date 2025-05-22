import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaPlus, FaTrash, FaSave, FaPaperPlane } from 'react-icons/fa';
import Button from '../Common/Button';

const FeedbackForm = ({ isOpen, onClose, existingForm = null }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const isEditing = !!existingForm;
  
  // Form state
  const [formData, setFormData] = useState({
    title: existingForm?.title || '',
    type: existingForm?.type || 'feedback',
    client: existingForm?.client || '',
    project: existingForm?.project || '',
    description: existingForm?.description || '',
    questions: existingForm?.questions || [
      { id: 1, type: 'text', label: '', required: false }
    ],
    allowScreenshots: existingForm?.allowScreenshots || true,
    allowAttachments: existingForm?.allowAttachments || true,
    status: existingForm?.status || 'draft'
  });
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle question change
  const handleQuestionChange = (id, field, value) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => 
        q.id === id ? { ...q, [field]: value } : q
      )
    });
  };
  
  // Add new question
  const addQuestion = () => {
    const newId = Math.max(0, ...formData.questions.map(q => q.id)) + 1;
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { id: newId, type: 'text', label: '', required: false }
      ]
    });
  };
  
  // Remove question
  const removeQuestion = (id) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== id)
    });
  };
  
  // Save form
  const saveForm = (asDraft = true) => {
    // Here you would typically send the form data to your backend
    console.log('Saving form:', { ...formData, status: asDraft ? 'draft' : 'active' });
    onClose();
  };
  
  return (
    <ModalOverlay isRTL={isRTL}>
      <ModalContent>
        <ModalHeader>
          <h2>
            {isEditing 
              ? t('forms.editForm', 'Edit Form') 
              : t('forms.createForm', 'Create New Form')}
          </h2>
          <ActionIcon 
            onClick={onClose}
            aria-label={t('common.close', 'Close')}
          >
            <FaTimes />
          </ActionIcon>
        </ModalHeader>
        
        <ModalBody>
          <FormGroup>
            <Label htmlFor="title">{t('forms.fields.title', 'Form Title')}</Label>
            <FormInput
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={t('forms.placeholders.title', 'Enter form title')}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>{t('forms.fields.type', 'Form Type')}</Label>
            <RadioGroup>
              <RadioOption>
                <input
                  type="radio"
                  id="feedback"
                  name="type"
                  value="feedback"
                  checked={formData.type === 'feedback'}
                  onChange={handleInputChange}
                />
                <RadioLabel htmlFor="feedback">
                  {t('forms.types.feedback', 'Feedback')}
                </RadioLabel>
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  id="revision"
                  name="type"
                  value="revision"
                  checked={formData.type === 'revision'}
                  onChange={handleInputChange}
                />
                <RadioLabel htmlFor="revision">
                  {t('forms.types.revision', 'Revision Request')}
                </RadioLabel>
              </RadioOption>
            </RadioGroup>
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="client">{t('forms.fields.client', 'Client')}</Label>
              <FormInput
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                placeholder={t('forms.placeholders.client', 'Select or enter client')}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="project">{t('forms.fields.project', 'Project')}</Label>
              <FormInput
                type="text"
                id="project"
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                placeholder={t('forms.placeholders.project', 'Select project')}
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="description">{t('forms.fields.description', 'Description')}</Label>
            <FormTextarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t('forms.placeholders.description', 'Enter form description')}
              rows={3}
            />
          </FormGroup>
          
          <QuestionsSection>
            <SectionHeader>
              <h3>{t('forms.questions.title', 'Form Questions')}</h3>
              <Button 
                variant="outline" 
                size="small" 
                leftIcon={<FaPlus />}
                onClick={addQuestion}
              >
                {t('forms.questions.add', 'Add Question')}
              </Button>
            </SectionHeader>
            
            {formData.questions.map((question, index) => (
              <QuestionCard key={question.id}>
                <QuestionHeader>
                  <QuestionNumber>{index + 1}</QuestionNumber>
                  <ActionIcon 
                    danger
                    onClick={() => removeQuestion(question.id)}
                    aria-label={t('forms.questions.remove', 'Remove Question')}
                  >
                    <FaTrash />
                  </ActionIcon>
                </QuestionHeader>
                
                <FormGroup>
                  <Label htmlFor={`question-${question.id}`}>
                    {t('forms.questions.label', 'Question')}
                  </Label>
                  <FormInput
                    type="text"
                    id={`question-${question.id}`}
                    value={question.label}
                    onChange={(e) => handleQuestionChange(question.id, 'label', e.target.value)}
                    placeholder={t('forms.questions.placeholder', 'Enter your question')}
                  />
                </FormGroup>
                
                <FormRow>
                  <FormGroup>
                    <Label htmlFor={`type-${question.id}`}>
                      {t('forms.questions.type', 'Answer Type')}
                    </Label>
                    <Select
                      id={`type-${question.id}`}
                      value={question.type}
                      onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value)}
                    >
                      <option value="text">{t('forms.questions.types.text', 'Text')}</option>
                      <option value="textarea">{t('forms.questions.types.textarea', 'Long Text')}</option>
                      <option value="rating">{t('forms.questions.types.rating', 'Rating')}</option>
                      <option value="select">{t('forms.questions.types.select', 'Select')}</option>
                    </Select>
                  </FormGroup>
                  
                  <CheckboxGroup>
                    <Checkbox>
                      <input
                        type="checkbox"
                        id={`required-${question.id}`}
                        checked={question.required}
                        onChange={(e) => handleQuestionChange(question.id, 'required', e.target.checked)}
                      />
                      <CheckboxLabel htmlFor={`required-${question.id}`}>
                        {t('forms.questions.required', 'Required')}
                      </CheckboxLabel>
                    </Checkbox>
                  </CheckboxGroup>
                </FormRow>
              </QuestionCard>
            ))}
          </QuestionsSection>
          
          <OptionsSection>
            <SectionHeader>
              <h3>{t('forms.options.title', 'Form Options')}</h3>
            </SectionHeader>
            
            <OptionsGrid>
              <Checkbox>
                <input
                  type="checkbox"
                  id="allowScreenshots"
                  name="allowScreenshots"
                  checked={formData.allowScreenshots}
                  onChange={handleInputChange}
                />
                <CheckboxLabel htmlFor="allowScreenshots">
                  {t('forms.options.allowScreenshots', 'Allow Screenshots')}
                </CheckboxLabel>
              </Checkbox>
              
              <Checkbox>
                <input
                  type="checkbox"
                  id="allowAttachments"
                  name="allowAttachments"
                  checked={formData.allowAttachments}
                  onChange={handleInputChange}
                />
                <CheckboxLabel htmlFor="allowAttachments">
                  {t('forms.options.allowAttachments', 'Allow File Attachments')}
                </CheckboxLabel>
              </Checkbox>
            </OptionsGrid>
          </OptionsSection>
        </ModalBody>
        
        <ModalFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <ButtonGroup>
            <Button 
              variant="outline" 
              leftIcon={<FaSave />}
              onClick={() => saveForm(true)}
            >
              {t('forms.actions.saveDraft', 'Save as Draft')}
            </Button>
            <Button 
              variant="primary" 
              leftIcon={<FaPaperPlane />}
              onClick={() => saveForm(false)}
            >
              {t('forms.actions.publish', 'Publish Form')}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f5f5f5;
  background-color: #fafafa;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #513a52;
    font-weight: 600;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid #f5f5f5;
  background-color: #fafafa;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  width: 100%;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #513a52;
  font-size: 0.95rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #513a52;
    box-shadow: 0 0 0 2px rgba(81, 58, 82, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #513a52;
    box-shadow: 0 0 0 2px rgba(81, 58, 82, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #513a52;
    box-shadow: 0 0 0 2px rgba(81, 58, 82, 0.1);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
`;

const RadioLabel = styled.label`
  margin-left: 0.5rem;
  cursor: pointer;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding-top: 1.5rem;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
`;

const CheckboxLabel = styled.label`
  margin-left: 0.5rem;
  cursor: pointer;
`;

const QuestionsSection = styled.div`
  margin: 1.5rem 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #513a52;
    margin: 0;
  }
`;

const QuestionCard = styled.div`
  background-color: #fafafa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #f5f5f5;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const QuestionNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #82a1bf;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;



const OptionsSection = styled.div`
  margin: 1.5rem 0;
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ActionIcon = styled.button`
  all: unset;
  color: ${props => props.danger ? '#e74c3c' : '#513a52'};
  font-size: 1.35rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.danger ? '#c0392b' : '#3d2c3d'};
    transform: translateY(-1px);
  }
`;





export default FeedbackForm;
