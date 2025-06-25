import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../contexts/AuthContext';
import { firestore } from '../../../firebase/config';
import { collection, query, orderBy, limit, getDocs, onSnapshot, Unsubscribe } from 'firebase/firestore';
import CommentRow from './CommentRow';
import { Post as ServicePost } from '../../../firebase/services/forums';

// Extended Message type for chat messages
interface ChatMessage extends ServicePost {
  body: string; // Content of the message
  userId: string; // ID of the user who sent the message
  userName: string; // Name of the user who sent the message
  createdAt: any; // Timestamp of when the message was sent
}

interface DiscussionListProps {
  projectId?: string;
}

const DiscussionList: React.FC<DiscussionListProps> = ({ projectId = 'default' }) => {
  const { currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const lastScrollHeightRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [messageLimit, setMessageLimit] = useState(50);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to check if user is at bottom of scroll
  const checkIfNearBottom = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // If user is at bottom or within 100px of bottom, auto-scroll
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldScrollToBottom(isNearBottom);
    }
  }, []);
  
  // Initial data fetch and subscription setup
  useEffect(() => {
    setIsLoading(true);
    
    // Initial fetch to get messages quickly
    const fetchInitialMessages = async () => {
      try {
        const messagesQuery = query(
          collection(firestore, `projectDiscussions/${projectId}/messages`),
          orderBy('createdAt', 'asc'),
          limit(messageLimit)
        );
        
        const snapshot = await getDocs(messagesQuery);
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChatMessage[];
        
        setMessages(fetchedMessages);
        setIsLoading(false);
        
        // After initial load, scroll to bottom
        setTimeout(() => {
          if (messagesEndRef.current && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }
        }, 100);
      } catch (error) {
        console.error('Error fetching initial messages:', error);
        setIsLoading(false);
      }
    };
    
    fetchInitialMessages();
    
    // Set up real-time listener with throttling
    const messagesQuery = query(
      collection(firestore, `projectDiscussions/${projectId}/messages`),
      orderBy('createdAt', 'asc'),
      limit(messageLimit)
    );
    
    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    
    // Set up new subscription with debounced updates
    let debounceTimeout: NodeJS.Timeout;
    unsubscribeRef.current = onSnapshot(messagesQuery, (snapshot) => {
      // Store current scroll position before updating
      if (containerRef.current) {
        lastScrollHeightRef.current = containerRef.current.scrollHeight;
      }
      
      // Debounce updates to prevent too many re-renders
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChatMessage[];
        
        // Check if we actually have new messages to avoid unnecessary re-renders
        if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
          setMessages(newMessages);
          checkIfNearBottom();
        }
      }, 300); // 300ms debounce
    }, (error) => {
      console.error('Error in messages snapshot:', error);
    });
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      clearTimeout(debounceTimeout);
    };
  }, [projectId, messageLimit, checkIfNearBottom, messages]);
  
  // Auto-scroll to bottom when messages update if user was at bottom
  useEffect(() => {
    if (!isScrollingRef.current && containerRef.current) {
      const container = containerRef.current;
      
      // If new content was added and user was at bottom, scroll to bottom
      if (shouldScrollToBottom && messagesEndRef.current && container.scrollHeight > lastScrollHeightRef.current) {
        // Use a small timeout to ensure DOM is fully updated
        setTimeout(() => {
          if (container && messagesEndRef.current) {
            container.scrollTop = container.scrollHeight;
          }
        }, 100);
      }
      
      // Update last scroll height
      lastScrollHeightRef.current = container.scrollHeight;
    }
  }, [messages, shouldScrollToBottom]);
  
  // Load more messages when scrolling to top
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      
      // Set scrolling flag
      isScrollingRef.current = true;
      
      // Update shouldScrollToBottom state based on current scroll position
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (shouldScrollToBottom !== isNearBottom) {
        setShouldScrollToBottom(isNearBottom);
      }
      
      // Load more messages when user scrolls to top
      if (scrollTop < 50 && messages.length >= messageLimit && !isLoading) {
        console.log('Loading more messages, current limit:', messageLimit);
        setMessageLimit(prev => prev + 50);
      }
      
      // Clear scrolling flag after a short delay
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    }
  }, [messages.length, messageLimit, shouldScrollToBottom, isLoading]);

  return (
    <ChatContainer>
      {isLoading ? (
        <LoadingContainer>
          <LoadingText>Loading messages...</LoadingText>
        </LoadingContainer>
      ) : messages.length === 0 ? (
        <NoMessagesContainer>
          <NoMessagesText>No messages yet. Start the conversation!</NoMessagesText>
        </NoMessagesContainer>
      ) : (
        <MessagesContainer ref={containerRef} onScroll={handleScroll}>
          {messages.map((message, index) => {
            const isSelf = currentUser && message.userId === currentUser.uid;
            const showDate = index === 0 || (
              message.createdAt && messages[index - 1]?.createdAt && 
              new Date(message.createdAt.toDate()).toDateString() !== 
              new Date(messages[index - 1].createdAt.toDate()).toDateString()
            );
            
            return (
              <React.Fragment key={message.id}>
                {showDate && message.createdAt && (
                  <DateSeparator>
                    <DateText>
                      {message.createdAt.toDate().toLocaleDateString()}
                    </DateText>
                  </DateSeparator>
                )}
                <MessageWrapper $isSelf={isSelf}>
                  <CommentRow 
                    c={{
                      id: message.id || '',
                      commentText: message.body || '',
                      userName: message.userName || 'Anonymous',
                      createdAt: message.createdAt
                    }}
                    isSelf={isSelf}
                  />
                </MessageWrapper>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </MessagesContainer>
      )}
    </ChatContainer>
  );
};

// Styled Components
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  height: 100%;
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  gap: 0.5rem;
  scroll-behavior: smooth;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(130, 161, 191, 0.5);
    border-radius: 10px;
  }
`;

const MessageWrapper = styled.div<{ $isSelf: boolean }>`
  display: flex;
  justify-content: ${props => props.$isSelf ? 'flex-end' : 'flex-start'};
  width: 100%;
  margin: 2px 0;
`;

const NoMessagesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
`;

const NoMessagesText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  text-align: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
`;

const LoadingText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  text-align: center;
`;

const DateSeparator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  width: 100%;
`;

const DateText = styled.span`
  background: rgba(130, 161, 191, 0.2);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
`;

export default DiscussionList;
