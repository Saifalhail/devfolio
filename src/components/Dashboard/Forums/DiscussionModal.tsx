import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDiscussionUI } from './DiscussionUIContext';
import { doc, collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { firestore } from '../../../firebase/config';
import { useFirestoreSnapshot } from '../../../hooks/useFirestoreSnapshot';
import CommentRow from './CommentRow';
import { useAuth } from '../../../contexts/AuthContext';

export default function DiscussionModal() {
  const { selectedId, setSelectedId } = useDiscussionUI();
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  // Default project ID for discussions
  const DEFAULT_PROJECT_ID = 'default';
  
  // Only create references when we have a valid selectedId
  const postRef = selectedId 
    ? doc(firestore, `projectDiscussions/${DEFAULT_PROJECT_ID}/messages`, selectedId) 
    : null;
  
  // Use the improved hook with proper error handling
  const postSnap = useFirestoreSnapshot<any>(postRef, !!selectedId);
  
  // Only create the comments query if we have a valid post reference
  const commentsQuery = postRef ? query(collection(postRef, 'comments'), orderBy('createdAt', 'asc')) : null;
  const comments = useFirestoreSnapshot<any>(commentsQuery, !!selectedId);
  
  // Handle errors - MUST be called before any conditional returns
  useEffect(() => {
    if (postSnap.length === 0 && selectedId) {
      console.log(`No post found with ID: ${selectedId}`);
    }
  }, [postSnap, selectedId]);
  
  // Early return after hooks are called
  if (!selectedId) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const text = form.comment.value.trim();
    if (!text || !currentUser) return;
    
    await addDoc(collection(postRef, 'comments'), {
      commentText: text,
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Anonymous',
      createdAt: serverTimestamp()
    });
    
    form.reset();
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{postSnap[0]?.title}</ModalTitle>
            <CloseButton
              onClick={() => setSelectedId(null)}
              aria-label="Close"
            >
              ✕
            </CloseButton>
          </ModalHeader>

          <PostContent>{postSnap[0]?.body}</PostContent>

          <CommentsContainer>
            {comments.map(c => <CommentRow key={c.id} c={c} />)}
          </CommentsContainer>

          <CommentForm onSubmit={submit}>
            <CommentInput 
              name="comment" 
              placeholder="Add a comment…"
              required
            />
            <SubmitButton type="submit">Send</SubmitButton>
          </CommentForm>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 48rem;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: var(--clr-glass);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ModalHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(135deg, #cd3efd, #7b2cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const CloseButton = styled.button.attrs({ className: 'btn-outline-accent' })`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 1rem;
`;

const PostContent = styled.p`
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-wrap;
`;

const CommentsContainer = styled.div`
  height: 15rem;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 0.5rem;
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(123, 44, 191, 0.5);
    border-radius: 3px;
  }
`;

const CommentForm = styled.form`
  display: flex;
  gap: 0.5rem;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem 0 0 0.5rem;
  background: rgba(35, 38, 85, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: white;
  
  &:focus {
    outline: 2px solid var(--clr-accent);
    outline-offset: 0;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SubmitButton = styled.button.attrs({ className: 'btn-outline-accent' })`
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 0 1rem;
`;
