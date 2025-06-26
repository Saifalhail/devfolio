import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { FaComment, FaDownload, FaTimes } from 'react-icons/fa';
import { FiPlus, FiUpload } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { HeaderStyles, SectionTitle } from './ForumStyles';
import { Mockup, MockupComment } from './types';
import { useMockupUI } from './MockupUIContext';
import MockupModal from './MockupModal';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestoreSnapshot } from '../../../hooks/useFirestoreSnapshot';
import { getFirestoreDb } from '../../../firebase';

// Dummy mockup data for UI demonstration
const dummyMockups: Mockup[] = [
  {
    id: 'dummy-1',
    title: 'Homepage Redesign',
    description: 'New homepage layout with improved navigation',
    imageURL: 'https://via.placeholder.com/300x200?text=Homepage+Mockup',
    userId: 1,
    userName: 'Sarah Designer',
    createdAt: new Date(2025, 5, 20),
    commentCount: 5,
    views: 28
  },
  {
    id: 'dummy-2',
    title: 'Mobile App UI',
    description: 'User interface for the new mobile application',
    imageURL: 'https://via.placeholder.com/300x200?text=Mobile+App+UI',
    userId: 2,
    userName: 'Mike Developer',
    createdAt: new Date(2025, 5, 18),
    commentCount: 3,
    views: 15
  },
  {
    id: 'dummy-3',
    title: 'Dashboard Analytics',
    description: 'Analytics dashboard with data visualization',
    imageURL: 'https://via.placeholder.com/300x200?text=Dashboard',
    userId: 1,
    userName: 'Sarah Designer',
    createdAt: new Date(2025, 5, 15),
    commentCount: 7,
    views: 42
  }
];

// Default project ID for mockups
const DEFAULT_PROJECT_ID = 'default';

interface MockupProps {
  onAddMockup: () => void;
  projectId?: string;
}

const MockupGallery: React.FC<MockupProps> = ({ onAddMockup, projectId = DEFAULT_PROJECT_ID }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { selectedMockup, handleSelectMockup, isAddModalOpen, openAddModal, closeAddModal } = useMockupUI();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firestore = getFirestoreDb();
  
  // Create a query to fetch mockups from Firestore
  const mockupsQuery = query(
    collection(firestore, `projects/${projectId}/mockups`),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  
  // Use the custom hook to fetch mockups with real-time updates
  const firestoreMockups = useFirestoreSnapshot<Mockup>(mockupsQuery);
  
  // Combine real and dummy mockups
  const mockups = firestoreMockups.length > 0 ? firestoreMockups : dummyMockups;
  
  // Update loading state when mockups are fetched
  useEffect(() => {
    // Short timeout to simulate loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [firestoreMockups]);
  
  const handleAddMockupClick = () => {
    openAddModal();
    if (onAddMockup) {
      onAddMockup();
    }
  };
  
  return (
    <MockupContainer dir={isRTL ? 'rtl' : 'ltr'}>
      <SectionHeader>
        <MockupHeader>
          <SectionTitle>{t('mockups.title')}</SectionTitle>
          <AddMockupButton onClick={handleAddMockupClick} aria-label={t('mockups.addNew')}>
            <FiPlus />
          </AddMockupButton>
        </MockupHeader>
      </SectionHeader>
      
      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : mockups.length === 0 ? (
        <EmptyState>
          <EmptyStateText>{t('mockups.empty.title')}</EmptyStateText>
          <EmptyStateSubtext>{t('mockups.empty.subtitle')}</EmptyStateSubtext>
          <AddMockupButtonLarge onClick={handleAddMockupClick}>
            <FiPlus /> {t('mockups.addNew')}
          </AddMockupButtonLarge>
        </EmptyState>
      ) : (
        <MockupGrid>
          {mockups.map(mockup => (
            <MockupCard 
              key={mockup.id} 
              onClick={() => handleSelectMockup(mockup)}
              $isSelected={selectedMockup?.id === mockup.id}
            >
              <MockupInfo>
                <MockupTitle>{mockup.title}</MockupTitle>
                <MockupDescription>
                  {mockup.description}
                </MockupDescription>
                <MockupMeta>
                  <MockupDate>
                    Updated {mockup.createdAt instanceof Date 
                      ? mockup.createdAt.toLocaleDateString() 
                      : new Date(mockup.createdAt).toLocaleDateString()}
                  </MockupDate>
                  <MockupStats>
                    <MockupStat>
                      <FaComment color="white" /> {mockup.commentCount || 0}
                    </MockupStat>
                  </MockupStats>
                </MockupMeta>
              </MockupInfo>
            </MockupCard>
          ))}
        </MockupGrid>
      )}
      
      {isAddModalOpen && (
        <AddMockupModal onClose={closeAddModal} />
      )}
      
      {/* Render the MockupModal with projectId */}
      <MockupModal projectId={projectId} />
    </MockupContainer>
  );
};

// Add Mockup Modal Component
interface AddMockupModalProps {
  onClose: () => void;
}

const AddMockupModal: React.FC<AddMockupModalProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError(null);
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real app, this would upload the file to storage and save mockup data to Firestore
      // For this mockup UI, we'll create a dummy mockup with the file preview URL
      
      // Create a new mockup object
      const newMockup = {
        id: `mockup-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        imageURL: previewUrl || 'https://via.placeholder.com/300x200?text=Mockup+Image',
        userId: 'current-user-id',
        userName: 'Current User',
        createdAt: new Date(),
        commentCount: 0,
        views: 0
      };
      
      console.log('Submitting mockup:', newMockup);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would add this to Firestore
      // For now, we'll just log it and close the modal
      
      // Close modal after successful submission
      onClose();
      
      // Show success message
      alert('Mockup added successfully!');
    } catch (err) {
      console.error('Error submitting mockup:', err);
      setError('Failed to upload mockup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ModalOverlay onClick={isSubmitting ? undefined : onClose} dir={isRTL ? 'rtl' : 'ltr'}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>{t('mockups.addNew.title')}</h2>
          {!isSubmitting && (
            <CloseButton onClick={onClose} aria-label={t('common.close')}>
              <FaTimes />
            </CloseButton>
          )}
        </ModalHeader>
        
        <ModalForm onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGroup>
            <FormLabel>{t('mockups.form.title')}</FormLabel>
            <FormInput 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('mockups.form.titlePlaceholder')}
              required
              disabled={isSubmitting}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>{t('mockups.form.description')}</FormLabel>
            <FormTextarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('mockups.form.descriptionPlaceholder')}
              required
              disabled={isSubmitting}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>{t('mockups.form.uploadImage')}</FormLabel>
            <UploadContainer>
              {previewUrl ? (
                <PreviewContainer>
                  <ImagePreview src={previewUrl} alt={t('mockups.form.preview')} />
                  <ChangeImageButton type="button" onClick={handleUploadClick} disabled={isSubmitting}>
                    {t('mockups.form.changeImage')}
                  </ChangeImageButton>
                </PreviewContainer>
              ) : (
                <UploadButton type="button" onClick={handleUploadClick} disabled={isSubmitting}>
                  <FiUpload /> {t('mockups.form.chooseFile')}
                </UploadButton>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </UploadContainer>
          </FormGroup>
          
          <ButtonGroup>
            <CancelButton 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </CancelButton>
            <SubmitButton 
              type="submit"
              disabled={isSubmitting || !selectedFile}
            >
              {isSubmitting ? t('mockups.form.uploading') : t('mockups.form.submit')}
            </SubmitButton>
          </ButtonGroup>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  );
};

const MockupContainer = styled.div`
  padding: 1rem;
  position: relative;
`;

const SectionHeader = styled.div`
  ${HeaderStyles.wrapper}
`;

const MockupHeader = styled.div`
  ${HeaderStyles.header}
  padding: 0 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddMockupButton = styled.button.attrs({ className: 'btn-outline-accent' })`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  padding: 0;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const MockupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const MockupCard = styled.div.attrs<{ $isSelected?: boolean }>(props => ({
  className: `card-glass border-2 ${props.$isSelected ? 'border-accent-1' : 'border-transparent'} cursor-pointer border-hover transition`
}))<{ $isSelected?: boolean }>`
  background: ${props => props.$isSelected ? 'rgba(66, 165, 245, 0.2)' : 'rgba(35, 38, 85, 0.4)'};
  border-radius: 12px;
  padding: 1rem;
  position: relative;
  margin-bottom: 1rem;
  box-shadow: ${props => props.$isSelected ? '0 4px 12px rgba(66, 165, 245, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.2)'};
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(123, 44, 191, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    
    &:before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const MockupImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const MockupInfo = styled.div`
  padding: 0.75rem;
  color: white;
`;

const MockupTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  background: linear-gradient(135deg, #cd3efd, #7b2cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MockupDescription = styled.p`
  margin: 0 0 0.75rem 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
`;

const MockupMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const MockupDate = styled.span`
  font-style: italic;
`;

const MockupStats = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const MockupStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// Loading spinner component
const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: var(--accent-1);
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  height: 200px;
`;

const EmptyStateText = styled.h3`
  color: white;
  margin-bottom: 0.5rem;
`;

const EmptyStateSubtext = styled.p`
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
`;

const AddMockupButtonLarge = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, var(--accent-1), var(--accent-2));
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: rgba(35, 38, 85, 0.9);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: modalFadeIn 0.3s ease-out;
  
  @keyframes modalFadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    background: linear-gradient(135deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: white;
    transform: scale(1.1);
  }
`;

const ModalForm = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #82a1bf;
    box-shadow: 0 0 0 2px rgba(130, 161, 191, 0.3);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #82a1bf;
    box-shadow: 0 0 0 2px rgba(130, 161, 191, 0.3);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

// Update UploadButton to be a button instead of a label to support disabled state
const UploadButton = styled.button<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover {
    background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #faaa93, #82a1bf);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// New styled components for file upload functionality
const ErrorMessage = styled.div`
  background-color: rgba(255, 0, 0, 0.1);
  color: #ff6b6b;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  object-fit: contain;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ChangeImageButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export default MockupGallery;
