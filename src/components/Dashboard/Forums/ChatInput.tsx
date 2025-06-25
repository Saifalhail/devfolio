import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { addDoc, serverTimestamp, collection } from 'firebase/firestore';
import { firestore } from '../../../firebase/config';
import { useAuth } from '../../../contexts/AuthContext';
import { FaComment, FaPaperPlane } from 'react-icons/fa';

interface ChatInputProps {
  projectId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ projectId = 'default' }) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError(t('forums.mustBeLoggedIn'));
      return;
    }
    
    if (!message.trim()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const messageData = {
        body: message.trim(),
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        createdAt: serverTimestamp(),
      };
      
      // Add message to the projectDiscussions/{projectId}/messages collection
      const messagesRef = collection(firestore, `projectDiscussions/${projectId}/messages`);
      await addDoc(messagesRef, messageData);
      
      // Clear the input
      setMessage('');
      setError(null);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(t('forums.errorSendingMessage'));
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Enter key to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !loading) {
        handleSubmit(e);
      }
    }
  };

  const focusInput = () => {
    setIsActive(true);
    inputRef.current?.focus();
  };

  return (
    <ChatInputContainer dir={isRTL ? 'rtl' : 'ltr'}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!currentUser ? (
        <LoginPrompt>{t('forums.loginToChat')}</LoginPrompt>
      ) : (
        <Form onSubmit={handleSubmit}>
          <CommentLine 
            $isActive={isActive} 
            onClick={focusInput}
          >
            {!isActive ? (
              <CommentIcon>
                <FaComment />
                <CommentPlaceholder>{t('forums.addComment')}</CommentPlaceholder>
              </CommentIcon>
            ) : (
              <InputWrapper>
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => !message.trim() && setIsActive(false)}
                  placeholder={t('forums.typeMessage')}
                  disabled={loading}
                  autoComplete="off"
                />
                <SendButton type="submit" disabled={loading || !message.trim()}>
                  <FaPaperPlane />
                </SendButton>
              </InputWrapper>
            )}
          </CommentLine>
        </Form>
      )}
    </ChatInputContainer>
  );
};

// Styled Components
const ChatInputContainer = styled.div`
  background: rgba(35, 38, 85, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  flex-shrink: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: white;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SendButton = styled.button`
  background: transparent;
  color: #cd3efd;
  border: none;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    color: #7b2cbf;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: #ff6b6b;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const LoginPrompt = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const CommentLine = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  background: ${props => props.$isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.$isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  transition: all 0.2s ease;
  cursor: ${props => props.$isActive ? 'default' : 'pointer'};
  
  &:hover {
    background: ${props => props.$isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
    border-color: ${props => props.$isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const CommentIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  
  svg {
    font-size: 0.9rem;
  }
`;

const CommentPlaceholder = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
`;

export default ChatInput;
