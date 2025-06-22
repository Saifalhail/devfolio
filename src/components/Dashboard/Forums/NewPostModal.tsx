import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore as db } from '../../../firebase/config';
import { useAuth } from '../../../contexts/AuthContext';
import { Post } from './types';
import { FaTimes, FaPlus, FaHashtag, FaTag } from 'react-icons/fa';

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
  const [tagInput, setTagInput] = useState('');
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

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
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
                customStyles={{}}
              />
              <CharacterCount>{content.length}/1000</CharacterCount>
            </InputWrapper>
          </FormGroup>
          
          <FormGroup>
            <SectionTitle>
              <HashtagIcon><FaTag /></HashtagIcon>
              Tags ({tags.length}/5)
            </SectionTitle>
            <InputWrapper>
              <TagInputContainer>
                {/* @ts-ignore */}
                <TextInput
                  value={tagInput}
                  onChange={(val) => setTagInput(val)}
                  onKeyDown={handleTagKeyDown as any}
                  placeholder="Add a tag and press Enter"
                  maxLength={20}
                  required={false}
                  isRTL={isRTL}
                />
                <CharacterCount style={{ right: '50px' }}>{tagInput.length}/20</CharacterCount>
                <AddTagButton 
                  type="button" 
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || tags.length >= 5 || loading}
                  aria-label="Add tag"
                >
                  <FaPlus />
                </AddTagButton>
              </TagInputContainer>
            </InputWrapper>
            
            <TagSuggestions>
              {tagSuggestions
                .filter(tag => !tags.includes(tag))
                .slice(0, 5)
                .map(tag => (
                  <TagSuggestion 
                    key={tag} 
                    onClick={() => {
                      if (tags.length < 5 && !tags.includes(tag)) {
                        setTags([...tags, tag]);
                      }
                    }}
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0;
  margin: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  color: #cd3efd;
  
  svg {
    font-size: 1.25rem;
  }
  
  &:hover {
    transform: rotate(90deg) scale(1.1);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
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

const HashtagIcon = styled.span`
  color: #cd3efd;
  display: flex;
  align-items: center;
`;

const CharacterCount = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const TagInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(205, 62, 253, 0.2);
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(205, 62, 253, 0.3);
  }
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 5px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    color: white;
  }
`;

const TagSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const AddTagButton = styled.button<ButtonProps>`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(205, 62, 253, 0.2);
  border: 1px solid rgba(205, 62, 253, 0.3);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: rgba(205, 62, 253, 0.4);
    transform: translateY(-50%) scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TagSuggestion = styled.button<{ disabled?: boolean }>`
  background-color: rgba(205, 62, 253, 0.1);
  color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.8)'};
  border: 1px solid rgba(205, 62, 253, 0.3);
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: rgba(205, 62, 253, 0.2);
    color: white;
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
