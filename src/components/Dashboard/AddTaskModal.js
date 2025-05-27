import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaCalendarAlt, 
  FaUserAlt, 
  FaTimes, 
  FaExclamationTriangle,
  FaCheck,
  FaUserCog
} from 'react-icons/fa';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

// Task status options
const TASK_STATUS = {
  TODO: 'todo',
  DOING: 'doing',
  DONE: 'done'
};

// Priority levels
const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

const AddTaskModal = ({ isOpen, onClose, task = null, projectId = null, initialStatus = TASK_STATUS.TODO }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { currentUser } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: null,
    priority: PRIORITY_LEVELS.MEDIUM,
    status: initialStatus,
    isClientTask: false,
    assignedTo: currentUser?.uid || null,
    assignedToName: currentUser?.displayName || null,
    projectId: projectId || null
  });
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate || null,
        priority: task.priority || PRIORITY_LEVELS.MEDIUM,
        status: task.status || TASK_STATUS.TODO,
        isClientTask: task.isClientTask || false,
        assignedTo: task.assignedTo || currentUser?.uid || null,
        assignedToName: task.assignedToName || currentUser?.displayName || null,
        projectId: task.projectId || projectId || null
      });
    }
  }, [task, currentUser, projectId]);
  
  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);
  
  // Handle date change
  const handleDateChange = useCallback((e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      dueDate: value ? new Date(value) : null
    }));
  }, []);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      setError(t('tasks.errors.titleRequired', 'Task title is required'));
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (task) {
        // Update existing task
        const taskRef = doc(db, 'tasks', task.id);
        await updateDoc(taskRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new task
        await addDoc(collection(db, 'tasks'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: currentUser?.uid || null
        });
      }
      
      // Close modal and reset form
      onClose();
      setFormData({
        title: '',
        description: '',
        dueDate: null,
        priority: PRIORITY_LEVELS.MEDIUM,
        status: initialStatus,
        isClientTask: false,
        assignedTo: currentUser?.uid || null,
        assignedToName: currentUser?.displayName || null,
        projectId: projectId || null
      });
      
    } catch (err) {
      console.error('Error saving task:', err);
      setError(t('tasks.errors.saveFailed', 'Failed to save task. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, [t, currentUser, onClose, projectId, task]);
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent 
        onClick={e => e.stopPropagation()} 
        isRTL={isRTL}
      >
        <ModalHeader>
          <h2>
            {task 
              ? t('tasks.editTask', 'Edit Task') 
              : t('tasks.addTask', 'Add New Task')
            }
          </h2>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            {error && (
              <ErrorMessage>
                <FaExclamationTriangle />
                <span>{error}</span>
              </ErrorMessage>
            )}
            
            <FormGroup>
              <Label htmlFor="title">{t('tasks.form.title', 'Task Title')}*</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t('tasks.form.titlePlaceholder', 'Enter task title')}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="description">{t('tasks.form.description', 'Description')}</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t('tasks.form.descriptionPlaceholder', 'Enter task description')}
                rows={4}
              />
            </FormGroup>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="dueDate">{t('tasks.form.dueDate', 'Due Date')}</Label>
                <DatePickerWrapper>
                  <DateInput
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <DatePickerIcon>
                    <FaCalendarAlt />
                  </DatePickerIcon>
                </DatePickerWrapper>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="priority">{t('tasks.form.priority', 'Priority')}</Label>
                <Select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value={PRIORITY_LEVELS.LOW}>{t('tasks.priority.low', 'Low')}</option>
                  <option value={PRIORITY_LEVELS.MEDIUM}>{t('tasks.priority.medium', 'Medium')}</option>
                  <option value={PRIORITY_LEVELS.HIGH}>{t('tasks.priority.high', 'High')}</option>
                </Select>
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="status">{t('tasks.form.status', 'Status')}</Label>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value={TASK_STATUS.TODO}>{t('tasks.todo', 'To Do')}</option>
                  <option value={TASK_STATUS.DOING}>{t('tasks.doing', 'In Progress')}</option>
                  <option value={TASK_STATUS.DONE}>{t('tasks.done', 'Done')}</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="assignedTo">{t('tasks.form.assignedTo', 'Assigned To')}</Label>
                <AssigneeWrapper>
                  <AssigneeIcon>
                    <FaUserAlt />
                  </AssigneeIcon>
                  <AssigneeName>{formData.assignedToName || t('tasks.form.you', 'You')}</AssigneeName>
                </AssigneeWrapper>
              </FormGroup>
            </FormRow>
            
            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                id="isClientTask"
                name="isClientTask"
                checked={formData.isClientTask}
                onChange={handleChange}
              />
              <CheckboxLabel htmlFor="isClientTask">
                <FaUserCog />
                <span>{t('tasks.form.clientTask', 'This is a client task')}</span>
              </CheckboxLabel>
            </CheckboxGroup>
            
            <ButtonGroup>
              <CancelButton type="button" onClick={onClose}>
                {t('common.cancel', 'Cancel')}
              </CancelButton>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? (
                  t('common.saving', 'Saving...')
                ) : task ? (
                  t('common.update', 'Update')
                ) : (
                  t('common.create', 'Create')
                )}
              </SubmitButton>
            </ButtonGroup>
          </Form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    max-width: none;
    height: 100vh;
    max-height: none;
    border-radius: 0;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #513a52;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  
  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #513a52;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #82a1bf;
    outline: none;
    box-shadow: 0 0 0 2px rgba(130, 161, 191, 0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    border-color: #82a1bf;
    outline: none;
    box-shadow: 0 0 0 2px rgba(130, 161, 191, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    border-color: #82a1bf;
    outline: none;
    box-shadow: 0 0 0 2px rgba(130, 161, 191, 0.2);
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DateInput = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  width: 100%;
  padding-right: 2.5rem;
  
  &:focus {
    border-color: #82a1bf;
    outline: none;
    box-shadow: 0 0 0 2px rgba(130, 161, 191, 0.2);
  }
`;

const DatePickerIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #82a1bf;
  pointer-events: none;
`;

const AssigneeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
`;

const AssigneeIcon = styled.div`
  color: #82a1bf;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AssigneeName = styled.div`
  font-size: 1rem;
  color: #333;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  
  svg {
    color: #faaa93;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f5f5f5;
  border: 1px solid #ddd;
  color: #666;
  
  &:hover:not(:disabled) {
    background: #eee;
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, #cd3efd, #7b2cbf);
  border: none;
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 6px;
  color: #f44336;
  
  svg {
    font-size: 1.2rem;
  }
`;

export default React.memo(AddTaskModal);
