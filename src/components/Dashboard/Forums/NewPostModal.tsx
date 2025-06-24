import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { createPost, uploadImage } from '../../../firebase/services/forums';
import { useAuth } from '../../../contexts/AuthContext';
import { Post } from '../../../firebase/services/forums';
import { FaTimes, FaPlus, FaHashtag, FaTag, FaImage, FaUpload } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import CustomScrollbar from '../../Common/CustomScrollbar';

// Import the components dynamically with proper typing
const TextInput = require('../WizardComponents/TextInput').default;
const ExpandableTextarea = require('../WizardComponents/ExpandableTextarea').default;


interface NewPostModalProps {
  onClose: () => void;
  onSubmit: (post: Post) => void;
  modalTitle?: string;
}

const NewPostModal = ({ onClose, onSubmit, modalTitle }: NewPostModalProps) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError(t('forums.titleRequired'));
      return;
    }
    
    if (!content.trim()) {
      setError(t('forums.contentRequired'));
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload image if one is selected
      let imageURL = '';
      if (imageFile) {
        try {
          // Show progress during upload
          const onProgress = (progress: number) => {
            setUploadProgress(progress);
          };
          
          imageURL = await uploadImage(imageFile, onProgress);
          console.log('Image uploaded successfully:', imageURL);
        } catch (error) {
          console.error('Error uploading image:', error);
          setError(t('forums.imageUploadError'));
          setLoading(false);
          return;
        }
      }
      
      // Create a post object with just the required fields
      // The forums service will add userId, userName, and createdAt
      const newPost = {
        title: title.trim(),
        body: content.trim(),
        imageURL: imageURL, // Use the uploaded image URL
        tags: [] // Empty tags array as tags are removed
      };
      
      console.log('Creating post with data:', newPost);
      
      // Use the forums service to create the post
      const postId = await createPost(newPost as Post);
      
      console.log('Post created with ID:', postId);
      
      // Prepare the complete post with the generated ID for UI
      const completePost = {
        ...newPost,
        id: postId,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        // Add these fields for UI compatibility
        likes: 0,
        likedBy: [],
        views: 0,
        commentCount: 0
      };
      
      onSubmit(completePost);
      onClose();
    } catch (err) {
      console.error('Error creating post:', err);
      setError(t('forums.errorCreatingPost'));
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent isRTL={isRTL} onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>{modalTitle || t('forums.newPost')}</h2>
          <CloseButton onClick={onClose} aria-label="Close modal"><FaTimes /></CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <CustomScrollbar maxHeight="calc(80vh - 180px)" hideOnMobile={true}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Form onSubmit={handleSubmit}>
          <FormGroup>
            <SectionTitle>Title</SectionTitle>
            <InputWrapper>
              {/* @ts-ignore */}
              <TextInput
                value={title}
                onChange={(val) => setTitle(val)}
                placeholder="Enter post title..."
                maxLength={100}
                required
                isRTL={isRTL}
                hideCharCount={true}
              />
              <CharacterCount>{title.length}/100</CharacterCount>
            </InputWrapper>
          </FormGroup>
          
          <FormGroup>
            <SectionTitle>Content</SectionTitle>
            <InputWrapper>
              {/* @ts-ignore */}
              <ExpandableTextarea
                value={content}
                onChange={(val) => setContent(val)}
                placeholder="Share your thoughts, questions, or ideas..."
                maxLength={1000}
                isRTL={isRTL}
                hideCharCount={true}
              />
              <CharacterCount>{content.length}/1000</CharacterCount>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <SectionTitle>
              <ImageIcon><FaImage /></ImageIcon>
              Add Image (Optional)
            </SectionTitle>
            <ImageUploadContainer>
              {imagePreview ? (
                <ImagePreviewWrapper>
                  <ImagePreview src={imagePreview} alt="Preview" />
                  <RemoveImageButton onClick={handleRemoveImage}>
                    <FaTimes />
                  </RemoveImageButton>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <UploadProgressBar>
                      <ProgressFill style={{ width: `${uploadProgress}%` }} />
                      <ProgressText>{Math.round(uploadProgress)}%</ProgressText>
                    </UploadProgressBar>
                  )}
                </ImagePreviewWrapper>
              ) : (
                <ImageUploadButton onClick={() => fileInputRef.current?.click()}>
                  <FaUpload />
                  <span>Upload Image</span>
                </ImageUploadButton>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </ImageUploadContainer>
          </FormGroup>
          
          {/* Tags section removed as requested */}
          
          <ButtonGroup>
            <CancelButton 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              aria-label="Cancel"
            >
              Cancel
            </CancelButton>
            <SubmitButton 
              type="submit" 
              disabled={loading || !title.trim() || !content.trim()}
              aria-label="Submit post"
              className="btn-outline-accent rounded-lg gap-2"
            >
              <FiSend aria-label="Publish post" /> {loading ? 'Posting...' : 'Publish'}
            </SubmitButton>
          </ButtonGroup>
        </Form>
        </CustomScrollbar>
      </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled Components
const TagInputContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  height: 32px;
`;

const TagInputPrefix = styled.span`
  color: #82a1bf;
  margin-right: 4px;
`;

const TagInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  font-size: 0.9rem;
  padding: 0;
  width: 100px;
  outline: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const AddTagButton = styled.button`
  background: transparent;
  border: none;
  color: #82a1bf;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: 4px;
  font-size: 0.8rem;
  
  &:hover {
    color: white;
  }
`;

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

const ModalContent = styled.div<{ isRTL?: boolean }>`
  background: rgba(30, 30, 45, 0.95);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  color: white;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(123, 44, 191, 0.3);
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    width: 95%;
    max-height: 75vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  background: linear-gradient(90deg, rgba(123, 44, 191, 0.1), rgba(205, 62, 253, 0.1));
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: white;
    font-weight: 600;
    background: linear-gradient(135deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 10px rgba(205, 62, 253, 0.3);
  }
`;

interface ButtonProps {
  isRTL?: boolean;
  disabled?: boolean;
}

const CloseButton = styled.button<ButtonProps>`
  position: absolute;
  top: ${props => props.isRTL ? '1rem' : '1rem'};
  right: ${props => props.isRTL ? 'auto' : '1rem'};
  left: ${props => props.isRTL ? '1rem' : 'auto'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0;
  margin: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  color: white;
  
  svg {
    font-size: 1.25rem;
  }
  
  &:hover {
    transform: rotate(90deg) scale(1.1);
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem 1.5rem 1.5rem 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  padding-right: 0.5rem;
  
  @media (max-width: 768px) {
    padding-right: 0;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  position: relative;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;



const ImageIcon = styled.span`
  margin-right: 0.5rem;
  color: #7b2cbf;
  display: inline-flex;
  align-items: center;
`;

const ImageUploadContainer = styled.div`
  margin-top: 0.5rem;
  width: 100%;
  min-height: 80px;
  border: 2px dashed rgba(123, 44, 191, 0.4);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: rgba(35, 38, 85, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(123, 44, 191, 0.8);
    box-shadow: 0 0 15px rgba(123, 44, 191, 0.2);
  }
`;

const ImagePreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const ImageUploadButton = styled.button`
  background: none;
  border: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: white;
  cursor: pointer;
  padding: 15px;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  
  svg {
    font-size: 1.5rem;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
  }
  
  span {
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
  
  &:hover {
    background-color: rgba(123, 44, 191, 0.3);
    transform: scale(1.02);
  }
`;

const UploadProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  backdrop-filter: blur(2px);
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #7b2cbf, #cd3efd);
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(205, 62, 253, 0.5);
`;

const ProgressText = styled.span`
  position: absolute;
  width: 100%;
  text-align: center;
  color: white;
  font-weight: bold;
`;

const SectionTitleWithCount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const TitleCount = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(30, 30, 45, 0.7);
  padding: 2px 8px;
  border-radius: 4px;
  backdrop-filter: blur(2px);
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const CharacterCount = styled.span`
  position: absolute;
  bottom: -1.5rem;
  right: 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  
  /* RTL Support */
  [dir="rtl"] & {
    right: auto;
    left: 0;
  }
`;

const HashtagIcon = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(205, 62, 253, 0.4);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  color: white;
  font-weight: 500;

  &:hover {
    background-color: rgba(205, 62, 253, 0.5);
  }
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: rgba(205, 62, 253, 0.6);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  margin: 0.25rem;
  font-size: 0.9rem;
  color: white;
  font-weight: 500;
  transition: all 0.2s ease;
`;

const RemoveTagButton = styled.button`
  background: rgba(0, 0, 0, 0.2);
  border: none;
  color: white;
  margin-left: 5px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.4);
    transform: scale(1.1);
  }
`;

const TagSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

// AddTagButton removed as per redesign

const TagSuggestion = styled.button<{ disabled?: boolean }>`
  background-color: rgba(205, 62, 253, 0.2);
  color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.4)' : 'white'};
  border: 1px solid rgba(205, 62, 253, 0.3);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: rgba(205, 62, 253, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)<ButtonProps>`
  background-color: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  
  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  &:active:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(1px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const SubmitButton = styled(Button).attrs({ className: 'btn-outline-accent' })<ButtonProps>`
  border-radius: 8px;
  font-size: 1rem;
  
  /* We're using the global btn-outline-accent class for styling */
  /* Only add specific overrides if needed */
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`;


const ErrorMessage = styled.div`
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #ff6b6b;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

export default NewPostModal;
