import React from 'react';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';

interface CommentProps {
  c: {
    id: string;
    commentText: string;
    userName: string;
    createdAt: {
      toDate: () => Date;
    };
  };
}

const CommentRow: React.FC<CommentProps> = ({ c }) => {
  const timestamp = c.createdAt?.toDate ? c.createdAt.toDate() : new Date();
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });
  
  return (
    <CommentContainer>
      <CommentHeader>
        <UserName>{c.userName}</UserName>
        <TimeStamp>{timeAgo}</TimeStamp>
      </CommentHeader>
      <CommentText>{c.commentText}</CommentText>
    </CommentContainer>
  );
};

const CommentContainer = styled.div`
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const UserName = styled.span`
  font-weight: 600;
  color: var(--clr-accent);
  font-size: 0.9rem;
`;

const TimeStamp = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
`;

const CommentText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  word-break: break-word;
`;

export default CommentRow;
