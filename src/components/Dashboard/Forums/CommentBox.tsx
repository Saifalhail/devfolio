import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { firestore as db } from '../../../firebase/config';
import { useAuth } from '../../../contexts/AuthContext';
import { Comment } from './types';

interface CommentBoxProps {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}

const CommentBox = ({ postId, onCommentAdded }: CommentBoxProps) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError(t('forums.mustBeLoggedIn'));
      return;
    }
    
    if (!content.trim()) {
      setError(t('forums.commentRequired'));
      return;
    }
    
    try {
      setLoading(true);
      
      const newComment = {
        postId,
        userId: currentUser.uid,
        user: {
          id: currentUser.uid,
          displayName: currentUser.displayName || 'Anonymous',
          photoURL: currentUser.photoURL || '',
          email: currentUser.email || '',
        },
        content: content.trim(),
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
      };
      
      const commentRef = await addDoc(collection(db, 'comments'), newComment);
      
      // Update comment count in the post
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentCount: increment(1)
      });
      
      // Add the new comment to the UI
      onCommentAdded({ 
        ...newComment, 
        id: commentRef.id,
        createdAt: new Date().toISOString() // Use current date for immediate UI update
      });
      
      // Clear the form
      setContent('');
      setError(null);
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(t('forums.errorAddingComment'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommentBoxContainer dir={isRTL ? 'rtl' : 'ltr'}>
      <h4>{t('forums.addComment')}</h4>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!currentUser ? (
        <LoginPrompt>{t('forums.loginToComment')}</LoginPrompt>
      ) : (
        <Form onSubmit={handleSubmit}>
          <UserInfo>
            <UserAvatar 
              src={currentUser.photoURL || '/default-avatar.png'} 
              alt={currentUser.displayName || 'User'} 
            />
            <UserName>{currentUser.displayName || 'Anonymous'}</UserName>
          </UserInfo>
          
          <TextArea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={t('forums.commentPlaceholder')}
            disabled={loading}
            rows={4}
          />
          
          <ButtonContainer>
            <SubmitButton type="submit" disabled={loading || !content.trim()}>
              {loading ? t('common.submitting') : t('common.submit')}
            </SubmitButton>
          </ButtonContainer>
        </Form>
      )}
    </CommentBoxContainer>
  );
};

// Styled Components
const CommentBoxContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  
  h4 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    font-weight: 500;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #82a1bf;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubmitButton = styled.button.attrs({ className: 'btn-outline-accent' })`
  padding: 0.6rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #ff6b6b;
  margin-bottom: 1rem;
`;

const LoginPrompt = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
`;

export default CommentBox;
