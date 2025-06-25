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
  isSelf?: boolean;
  className?: string;
}

const CommentRow: React.FC<CommentProps> = ({ c, isSelf = false, className }) => {
  // Handle different timestamp formats safely
  let timestamp: Date;
  try {
    timestamp = c.createdAt?.toDate ? c.createdAt.toDate() : new Date();
  } catch (err) {
    // Fallback if toDate() fails or createdAt is in a different format
    timestamp = new Date();
  }
  
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });
  
  return (
    <CommentContainer $isSelf={isSelf} className={className}>
      <CommentHeader>
        <UserName>{c.userName}</UserName>
        <TimeStamp>{timeAgo}</TimeStamp>
      </CommentHeader>
      <CommentText>{c.commentText}</CommentText>
    </CommentContainer>
  );
};

const CommentContainer = styled.div<{ $isSelf: boolean }>`
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  background: ${props => props.$isSelf ? 'rgba(123, 44, 191, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: ${props => props.$isSelf ? '12px 12px 0 12px' : '12px 12px 12px 0'};
  transition: all 0.2s ease;
  width: 100%;
  
  &:hover {
    background: ${props => props.$isSelf ? 'rgba(123, 44, 191, 0.3)' : 'rgba(255, 255, 255, 0.08)'};
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const UserName = styled.span`
  font-weight: 600;
  color: var(--clr-accent);
  font-size: 0.9rem;
`;

const TimeStamp = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
`;

const CommentText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  word-break: break-word;
  white-space: pre-wrap;
`;

export default CommentRow;
