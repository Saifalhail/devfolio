import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaComment, FaPaperPlane } from 'react-icons/fa';
import { collection, query, orderBy, limit, onSnapshot, Timestamp, addDoc, Unsubscribe, startAfter, getDocs, DocumentData } from 'firebase/firestore';
import { firestore, auth } from '../../../firebase/config';
import { useFirestoreSnapshot } from '../../../hooks/useFirestoreSnapshot';
import CommentRow from './CommentRow';
import ChatInput from './ChatInput';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import { useAuth } from '../../../contexts/AuthContext';
import { Post } from '../../../firebase/services/forums';

// Extended Message type for chat messages
interface ChatMessage extends Post {
  id?: string;
  replyTo?: string;
  replies?: ChatMessage[];
  body: string;
  userId: string;
  userName: string;
  createdAt: any;
}

interface DiscussionListProps {
  projectId?: string;
}

// Constants for pagination and real-time updates
const MESSAGES_PER_PAGE = 50;
const REAL_TIME_MESSAGE_LIMIT = 50;

const DiscussionList: React.FC<DiscussionListProps> = ({ projectId = 'default' }) => {
  const { currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const lastScrollHeightRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  
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
    const minTimeBetweenFetches = 2000; // 2 seconds minimum between fetches
    
    // Initial fetch to get messages quickly
    const fetchInitialMessages = async () => {
      try {
        // Create a query for the initial messages
        const messagesQuery = query(
          collection(firestore, `projectDiscussions/${projectId}/messages`),
          orderBy('createdAt', 'desc'),
          limit(MESSAGES_PER_PAGE)
        );
        
        const querySnapshot = await getDocs(messagesQuery);
        
        if (!querySnapshot.empty) {
          // Extract the messages from the snapshot
          const initialMessages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as unknown as ChatMessage[];
          
          // Set the messages and last document
          setMessages(initialMessages);
          setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
          
          // After initial load, scroll to bottom
          setTimeout(() => {
            if (messagesEndRef.current && containerRef.current) {
              containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
          }, 100);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching initial messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialMessages();
    
    // Set up real-time listener with throttling
    const messagesQuery = query(
      collection(firestore, `projectDiscussions/${projectId}/messages`),
      orderBy('createdAt', 'asc'),
      limit(REAL_TIME_MESSAGE_LIMIT)
    );
    
    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    
    // Set up new subscription with optimized updates
    const debouncedUpdate = debounce((snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as ChatMessage[];
      
      setMessages(prevMessages => {
        // Merge new messages with existing ones, avoiding duplicates
        const messageMap = new Map();
        
        // Add existing messages to the map
        prevMessages.forEach(msg => {
          if (msg.id) messageMap.set(msg.id, msg);
        });
        
        // Add or update with new messages
        newMessages.forEach(msg => {
          if (msg.id) messageMap.set(msg.id, msg);
        });
        
        // Convert map back to array and sort by createdAt
        return Array.from(messageMap.values())
          .sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return a.createdAt.seconds - b.createdAt.seconds;
          });
      });
      
      // After messages update, scroll to bottom if needed
      if (shouldScrollToBottom && containerRef.current) {
        setTimeout(() => {
          if (messagesEndRef.current && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }
        }, 100);
      }
      
      setIsLoading(false);
    }, 300);
    
    try {
      unsubscribeRef.current = onSnapshot(messagesQuery, (snapshot) => {
        debouncedUpdate(snapshot);
      }, (error) => {
        console.error('Error in messages subscription:', error);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error setting up subscription:', error);
      setIsLoading(false);
    }
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
  
  // Handle comment submission
  const handleCommentSubmit = async (replyToId: string) => {
    if (!commentText.trim() || !currentUser) return;
    
    try {
      const commentData = {
        body: commentText.trim(),
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        createdAt: Timestamp.now(),
        replyTo: replyToId
      };
      
      await addDoc(
        collection(firestore, `projectDiscussions/${projectId}/messages`),
        commentData
      );
      
      setCommentText('');
      
      // Scroll to bottom after adding a comment
      setTimeout(() => {
        if (messagesEndRef.current && containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  // Handle keyboard submission with Enter key
  const handleKeyDown = (e: React.KeyboardEvent, messageId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(messageId);
    }
  };
  
  // Track which input is focused
  const [focusedInputId, setFocusedInputId] = useState<string | null>(null);
  
  // Handle focus and blur events for inputs
  const handleInputFocus = (messageId: string) => {
    setFocusedInputId(messageId);
  };
  
  const handleInputBlur = () => {
    // Small delay to allow for click events to process
    setTimeout(() => {
      setFocusedInputId(null);
    }, 100);
  };
  
  // Focus the input when clicked
  const focusCommentInput = (messageId: string) => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };
  
  // Load messages with pagination
  const loadMessages = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    try {
      // Create a query to get the next batch of messages
      const messagesQuery = query(
        collection(firestore, `projectDiscussions/${projectId}/messages`),
        orderBy('createdAt', 'desc'),
        limit(MESSAGES_PER_PAGE)
      );
      
      // If we have a last document, start after it
      const q = lastDoc
        ? query(messagesQuery, startAfter(lastDoc))
        : messagesQuery;
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      
      // Extract the messages from the snapshot
      const newMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as ChatMessage[];
      
      // Update state with the new messages
      setMessages(prevMessages => [...prevMessages, ...newMessages]);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, projectId, lastDoc]);
  
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
      if (scrollTop < 50 && messages.length >= MESSAGES_PER_PAGE && !isLoading) {
        console.log('Loading more messages, current limit:', messages.length);
        loadMessages();
      }
      
      // Clear scrolling flag after a short delay
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    }
  }, [messages.length, isLoading, shouldScrollToBottom, loadMessages]);

  // Group messages by date for display
  const messagesByDate = useMemo(() => {
    const grouped: Record<string, ChatMessage[]> = {};
    
    // Sort messages by createdAt in ascending order
    const sortedMessages = [...messages].sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return a.createdAt.seconds - b.createdAt.seconds;
    });
    
    sortedMessages.forEach(message => {
      if (!message.createdAt) return;
      
      const date = message.createdAt.toDate ? message.createdAt.toDate() : new Date(message.createdAt.seconds * 1000);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      
      grouped[dateStr].push(message);
    });
    
    return grouped;
  }, [messages]);

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
          {Object.keys(messagesByDate).map(date => (
            <React.Fragment key={date}>
              <DateSeparator>
                <DateText>
                  {format(new Date(date), 'MMMM d, yyyy')}
                </DateText>
              </DateSeparator>
              {messagesByDate[date].map((message) => {
                const isSelf = currentUser && message.userId === currentUser.uid;
                const isReply = message.replyTo !== undefined;
                
                // Find parent message if this is a reply
                const parentMessage = isReply ? 
                  messages.find(m => m.id === message.replyTo) : null;
                
                return (
                  <MessageContainer key={message.id}>
                    <MessageWrapper $isSelf={isSelf} $isReply={isReply}>
                      {isReply && parentMessage && (
                        <ReplyIndicator>
                          <ReplyLine />
                          <ReplyInfo>
                            Replying to <ReplyName>{parentMessage.userName}</ReplyName>
                          </ReplyInfo>
                        </ReplyIndicator>
                      )}
                      <div className="comment-row">
                        <CommentRow 
                          c={{
                            id: message.id || '',
                            commentText: message.body || '',
                            userName: message.userName || 'Anonymous',
                            createdAt: message.createdAt
                          }}
                          isSelf={isSelf}
                        />
                      </div>
                    </MessageWrapper>
                    
                    {/* Always visible reply input */}
                    {!isReply && (
                      <MessageActionBar>
                        <ReplyForm $isFocused={focusedInputId === message.id}>
                          <ReplyIcon>
                             <FaComment size={12} />
                          </ReplyIcon>
                          <ReplyInput
                            type="text"
                            placeholder="Write a reply..."
                            value={message.id === focusedInputId ? commentText : ''}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, message.id || '')}
                            onFocus={() => handleInputFocus(message.id || '')}
                            onBlur={handleInputBlur}
                          />
                          <SendButton 
                            onClick={() => handleCommentSubmit(message.id || '')}
                            disabled={!commentText.trim() || focusedInputId !== message.id}
                            title="Send reply"
                          >
                            <FaPaperPlane size={14} />
                          </SendButton>
                        </ReplyForm>
                      </MessageActionBar>
                    )}
                  </MessageContainer>
                );
              })}
            </React.Fragment>
          ))}
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

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;
`;

const MessageWrapper = styled.div<{ $isSelf: boolean; $isReply?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isSelf ? 'flex-end' : 'flex-start'};
  width: 100%;
  margin: 2px 0;
  padding-left: ${props => props.$isReply ? '20px' : '0'};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${props => props.$isReply ? 'rgba(130, 161, 191, 0.15)' : 'transparent'};
    border-radius: 1px;
  }
  
  /* Style CommentRow to look like a chat bubble */
  .comment-row {
    background: ${props => props.$isSelf ? 'rgba(90, 120, 190, 0.2)' : 'rgba(35, 38, 85, 0.3)'};
    border-radius: 18px;
    padding: 10px 14px;
    border: 1px solid ${props => props.$isSelf ? 'rgba(130, 161, 191, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
    width: 100%;
    max-width: 95%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const CommentActionRow = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 2px 0;
  margin-top: 2px;
  margin-bottom: 2px;
  opacity: 0.8;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const CommentButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${props => props.$isActive ? 'rgba(130, 161, 191, 0.3)' : 'transparent'};
  color: ${props => props.$isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)'};
  border: none;
  font-size: 0.75rem;
  padding: ${props => props.$isActive ? '4px 8px' : '2px 8px'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: ${props => props.$isActive ? '32px' : 'auto'};
  
  &:hover {
    background: rgba(130, 161, 191, 0.2);
    color: rgba(255, 255, 255, 0.9);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const InlineCommentForm = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 90%;
  background: rgba(35, 38, 85, 0.3);
  border-radius: 18px;
  padding: 2px 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &:focus-within {
    border-color: rgba(130, 161, 191, 0.5);
    box-shadow: 0 2px 8px rgba(130, 161, 191, 0.2);
  }
`;

const InlineCommentInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  padding: 6px 4px;
  outline: none;
  min-width: 0; /* Prevents flex item from overflowing */
  transition: all 0.2s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    color: rgba(255, 255, 255, 1);
  }
`;

const SendButton = styled.button<{ disabled?: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)'};
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 50%;
  
  &:hover:not(:disabled) {
    color: white;
    background: rgba(90, 120, 190, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
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

// Reply styling components
const ReplyIndicator = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 2px;
`;

const ReplyLine = styled.div`
  height: 1px;
  width: 20px;
  background: rgba(130, 161, 191, 0.4);
  margin-bottom: 2px;
  margin-left: 8px;
`;

const ReplyInfo = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 8px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
`;

const ReplyName = styled.span`
  color: rgba(130, 161, 191, 0.9);
  margin-left: 4px;
  font-weight: 500;
`;

const ActiveReplyIndicator = styled.div`
  position: absolute;
  font-size: 0.65rem;
  color: rgba(130, 161, 191, 0.7);
  top: -14px;
  left: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

// New styled components for the integrated reply UI
const MessageActionBar = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2px;
  margin-left: 8px;
  margin-bottom: 12px;
  width: 100%;
  max-width: 95%;
  position: relative;
`;


const ReplyInput = styled.input`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  padding: 8px 4px;
  flex: 1;
  min-width: 200px;
  outline: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    transition: color 0.2s ease;
  }
  
  &:focus {
    outline: none;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

const ReplyForm = styled.div<{ $isFocused: boolean }>`
  display: flex;
  align-items: center;
  background: ${props => props.$isFocused ? 'rgba(35, 38, 85, 0.4)' : 'rgba(35, 38, 85, 0.2)'};
  border-radius: 18px;
  padding: 6px 10px;
  border: 1px solid ${props => props.$isFocused ? 'rgba(130, 161, 191, 0.4)' : 'rgba(130, 161, 191, 0.1)'};
  width: 100%;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$isFocused ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none'};
  margin-top: 6px;
  
  &:hover {
    background: ${props => props.$isFocused ? 'rgba(35, 38, 85, 0.4)' : 'rgba(35, 38, 85, 0.25)'};
    border-color: rgba(130, 161, 191, 0.2);
  }
`;

const ReplyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  margin-right: 8px;
  width: 16px;
  height: 16px;
  transition: color 0.2s ease;
  
  ${ReplyForm}:hover & {
    color: rgba(255, 255, 255, 0.8);
  }
`;

export default DiscussionList;
