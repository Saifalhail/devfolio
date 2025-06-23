import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore as db } from '../../../firebase/config';
import { useAuth } from '../../../contexts/AuthContext';
import { Post } from './types';
import { FaTimes, FaPlus, FaHashtag, FaTag } from 'react-icons/fa';
import CustomScrollbar from '../../Common/CustomScrollbar';

// Import the components dynamically with proper typing
const TextInput = require('../WizardComponents/TextInput').default;
const ExpandableTextarea = require('../WizardComponents/ExpandableTextarea').default;


interface NewPostModalProps {
  onClose: () => void;
  onSubmit: (post: Omit<Post, 'id'>) => void;
}

const NewPostModal = ({ onClose, onSubmit }: NewPostModalProps) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  // Tag input removed as per redesign
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError(t('forums.mustBeLoggedIn'));
      return;
    }
    
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
      
      const newPost = {
        title: title.trim(),
        content: content.trim(),
        userId: currentUser.uid,
        user: {
          displayName: currentUser.displayName || 'Anonymous',
          photoURL: currentUser.photoURL || '',
          email: currentUser.email || '',
        },
        createdAt: serverTimestamp(),
        tags: tags,
        likes: 0,
        likedBy: [],
        commentCount: 0,
        views: 0,
      };
      
      const docRef = await addDoc(collection(db, 'posts'), newPost);
      
      // @ts-ignore - Adding id property after Firestore generates it
      onSubmit({ ...newPost, id: docRef.id });
      onClose();
    } catch (err) {
      console.error('Error creating post:', err);
      setError(t('forums.errorCreatingPost'));
      setLoading(false);
    }
  };

  const handleTagClick = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Common tag suggestions
  const tagSuggestions = [
    'react', 'javascript', 'typescript', 'css', 'html', 'node', 'firebase',
    'design', 'ui', 'ux', 'frontend', 'backend', 'fullstack', 'mobile'
  ];

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent isRTL={isRTL} onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Create New Post</h2>
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
              <HashtagIcon><FaTag /></HashtagIcon>
              Tags ({tags.length}/5)
            </SectionTitle>
            
            <TagSuggestions>
              {tagSuggestions
                .filter(tag => !tags.includes(tag))
                .map(tag => (
                  <TagSuggestion 
                    key={tag} 
                    onClick={() => handleTagClick(tag)}
                    disabled={tags.length >= 5}
                  >
                    #{tag}
                  </TagSuggestion>
                ))}
            </TagSuggestions>
            
            {tags.length > 0 && (
              <TagsContainer>
                {tags.map(tag => (
                  <Tag key={tag}>
                    #{tag}
                    <RemoveTagButton onClick={() => handleRemoveTag(tag)}>
                      <FaTimes size={10} />
                    </RemoveTagButton>
                  </Tag>
                ))}
              </TagsContainer>
            )}
          </FormGroup>
          
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
            >
              {loading ? 'Posting...' : 'Post'}
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
  background: #1e1e2d;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  color: white;
  display: flex;
  flex-direction: column;
  
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
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: white;
    font-weight: 600;
    background: linear-gradient(135deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const SubmitButton = styled(Button)<ButtonProps>`
  background: linear-gradient(135deg, #cd3efd, #7b2cbf);
  border: none;
  color: white;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #d85ffd, #8b3ccf);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
