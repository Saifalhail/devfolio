import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { FaComment, FaDownload, FaTimes } from 'react-icons/fa';
import { FiPlus, FiUpload } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../contexts/ToastContext';
import { useAuth } from '../../../contexts/AuthContext';
import { HeaderStyles, SectionTitle } from './ForumStyles';
import { Mockup, MockupComment } from './types';
import { useMockupUI } from './MockupUIContext';
import MockupModal from './MockupModal';
import { getAllPosts, Post, createPost, uploadImage } from '../../../firebase/services/forums';

// Transform a forum post with image into a mockup
const postToMockup = (post: Post): Mockup => ({
  id: post.id || '',
  title: post.title || post.body?.substring(0, 50) + '...' || 'Untitled',
  description: post.body || 'No description',
  imageURL: post.imageURL || '',
  userId: 1, // Default userId since Post uses string but Mockup expects number
  userName: post.userName || 'Anonymous',
  createdAt: post.createdAt?.toDate ? post.createdAt.toDate() : new Date(),
  commentCount: post.commentCount || 0,
  views: post.views || 0
});


// Default project ID for mockups
const DEFAULT_PROJECT_ID = 'default';

interface MockupProps {
  onAddMockup: () => void;
  projectId?: string;
}

const MockupGallery: React.FC<MockupProps> = ({ onAddMockup, projectId = DEFAULT_PROJECT_ID }) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  const { selectedMockup, handleSelectMockup, isAddModalOpen, openAddModal, closeAddModal } = useMockupUI();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Fetch forum posts and filter for ones with images (mockups)
  useEffect(() => {
    const fetchMockupPosts = async () => {
      setIsLoading(true);
      try {
        console.log('🔥 FETCHING MOCKUPS FROM FIREBASE...');
        console.log('Project ID:', projectId);
        console.log('Current user state:', currentUser ? `Logged in as ${currentUser.email}` : 'Not logged in');
        console.log('getAllPosts function:', getAllPosts);
        console.log('typeof getAllPosts:', typeof getAllPosts);
        
        const allPosts = await getAllPosts(projectId);
        console.log('🔥 RAW FIREBASE RESPONSE - All posts:', allPosts);
        console.log('🔥 Number of posts returned:', allPosts.length);
        console.log('Raw post data (first 3):');
        allPosts.slice(0, 3).forEach((post, index) => {
          console.log(`Post ${index}:`, {
            id: post.id,
            title: post.title,
            body: post.body,
            imageURL: post.imageURL,
            userId: post.userId,
            userName: post.userName,
            createdAt: post.createdAt
          });
        });
        
        // Filter posts that have images and convert them to mockups
        const postsWithImages = allPosts
          .filter(post => {
            const hasImage = post.imageURL && post.imageURL.trim() !== '';
            const title = post.title || post.body || 'Untitled';
            console.log(`Post "${title}" has image:`, hasImage, 'imageURL:', post.imageURL);
            return hasImage;
          })
          .map(postToMockup);
        
        console.log(`Found ${postsWithImages.length} posts with images (mockups)`);
        console.log('Posts with images:', postsWithImages);
        
        // Set the mockups from real posts only
        console.log(`Setting ${postsWithImages.length} real mockups`);
        setMockups(postsWithImages);
      } catch (error) {
        console.error('Error fetching mockup posts:', error);
        setMockups([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMockupPosts();
  }, [projectId, refreshTrigger]);
  
  const handleAddMockupClick = () => {
    openAddModal();
    if (onAddMockup) {
      onAddMockup();
    }
  };
  
  const handleMockupAdded = () => {
    console.log('🔄 Mockup added, refreshing list...');
    closeAddModal();
    
    // Force immediate refresh and show loading
    setIsLoading(true);
    setRefreshTrigger(prev => prev + 1);
    
    // Also refresh after a delay to ensure Firebase sync
    setTimeout(() => {
      console.log('🔄 Secondary refresh after delay...');
      setRefreshTrigger(prev => prev + 1);
    }, 2000);
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
          <EmptyStateIcon>+</EmptyStateIcon>
          <EmptyStateText>{t('mockups.empty.title')}</EmptyStateText>
          <EmptyStateSubtext>{t('mockups.empty.subtitle')}</EmptyStateSubtext>
        </EmptyState>
      ) : (
        <MockupGrid>
          {mockups.map(mockup => (
            <MockupCard 
              key={mockup.id} 
              onClick={() => handleSelectMockup(mockup)}
              $isSelected={selectedMockup?.id === mockup.id}
            >
              <MockupImage $imageUrl={mockup.imageURL} />
              <MockupInfo>
                <div>
                  <MockupTitle>{mockup.title}</MockupTitle>
                  <MockupDescription>
                    {mockup.description}
                  </MockupDescription>
                </div>
                <MockupMeta>
                  <MockupDate>
                    {mockup.createdAt instanceof Date 
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
        <AddMockupModal onClose={handleMockupAdded} />
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
  const { showToast } = useToast();
  const { currentUser } = useAuth();
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
        const errorMessage = 'Please select an image file';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        const errorMessage = 'Image size should be less than 5MB';
        setError(errorMessage);
        showToast(errorMessage, 'error');
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
    
    console.log('🔥 REAL MOCKUP SUBMISSION STARTED - AUTH CHECK');
    console.log('Current user from useAuth:', currentUser);
    console.log('Current user ID:', currentUser?.uid);
    console.log('Current user name:', currentUser?.displayName);
    
    // Check if user is authenticated
    if (!currentUser) {
      const errorMessage = 'You must be logged in to upload a mockup';
      console.error('❌ AUTH ERROR:', errorMessage);
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return;
    }
    
    if (!selectedFile) {
      const errorMessage = 'Please select an image file';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return;
    }
    
    if (!title.trim()) {
      const errorMessage = 'Please enter a title';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return;
    }
    
    if (!description.trim()) {
      const errorMessage = 'Please enter a description';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('🎨 Creating real forum post with image...');
      console.log('📝 Title:', title.trim());
      console.log('📄 Description:', description.trim());
      console.log('🖼️ Image file:', selectedFile?.name, selectedFile?.size, selectedFile?.type);
      
      // Create the post data
      const postData: Post = {
        title: title.trim(),
        body: description.trim(),
        userId: '', // Will be set by createPost
        userName: '', // Will be set by createPost
        tags: ['mockup', 'design'],
        views: 0,
        likes: 0,
        likedBy: [],
        commentCount: 0
      };
      
      console.log('📊 Post data to create:', postData);
      
      // Create the post using the forums service
      console.log('🚀 CALLING FIREBASE createPost SERVICE...');
      console.log('createPost function:', createPost);
      console.log('typeof createPost:', typeof createPost);
      console.log('Arguments:', {
        projectId: 'default',
        postData,
        selectedFile: selectedFile ? `${selectedFile.name} (${selectedFile.size} bytes)` : null
      });
      
      const postId = await createPost('default', postData, selectedFile);
      
      console.log('✅ FIREBASE RESPONSE: Successfully created post with ID:', postId);
      console.log('✅ Post created successfully - should appear in Firebase and UI');
      
      // Show success message
      showToast('✅ Mockup added successfully! It will appear in the list shortly.', 'success');
      
      // Close modal after successful submission
      onClose();
    } catch (err) {
      console.error('❌ Error creating mockup post:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : 'No stack trace'
      });
      const errorMessage = `Failed to upload mockup: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      showToast(`❌ ${errorMessage}`, 'error');
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
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  overflow-y: auto;
  flex: 1;
  padding-right: 0.5rem;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(130, 161, 191, 0.5);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(130, 161, 191, 0.7);
  }
`;

const MockupCard = styled.div.attrs<{ $isSelected?: boolean }>(props => ({
  className: `card-glass border-2 ${props.$isSelected ? 'border-accent-1' : 'border-transparent'} cursor-pointer border-hover transition`
}))<{ $isSelected?: boolean }>`
  background: ${props => props.$isSelected ? 'rgba(66, 165, 245, 0.2)' : 'rgba(35, 38, 85, 0.4)'};
  border-radius: 12px;
  padding: 0;
  position: relative;
  box-shadow: ${props => props.$isSelected ? '0 4px 12px rgba(66, 165, 245, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.2)'};
  overflow: hidden;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  
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

const MockupImage = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 60%;
  background-image: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : 'linear-gradient(135deg, rgba(130, 161, 191, 0.3), rgba(35, 38, 85, 0.5))'};
  background-size: cover;
  background-position: center;
  border-radius: 12px 12px 0 0;
  position: relative;
  
  ${props => !props.$imageUrl && `
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:before {
      content: '🖼️';
      font-size: 2rem;
      opacity: 0.5;
    }
  `}
`;

const MockupInfo = styled.div`
  padding: 0.75rem;
  color: white;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  padding: 3rem 2rem;
  text-align: center;
  height: 300px;
  background: rgba(35, 38, 85, 0.1);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 1rem;
  font-weight: 300;
`;

const EmptyStateText = styled.h3`
  color: white;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const EmptyStateSubtext = styled.p`
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-size: 0.9rem;
`;


// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
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
