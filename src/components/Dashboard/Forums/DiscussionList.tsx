import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaComment, FaPaperPlane } from 'react-icons/fa';
import { collection, query, orderBy, limit, onSnapshot, Timestamp, addDoc, Unsubscribe, startAfter, getDocs, DocumentData } from 'firebase/firestore';
import { debounce } from 'lodash';
import { firestore } from '../../../firebase/config';
import { useAuth } from '../../../contexts/AuthContext';
import CommentRow from './CommentRow';
import { Post } from '../../../firebase/services/forums';
import { HeaderStyles } from './ForumStyles';
import { useDiscussionUI } from './DiscussionUIContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow, format } from 'date-fns';

// Extended Message type for chat messages
interface ChatMessage extends Post {
  id?: string;
  replyTo?: string;
  replies?: ChatMessage[];
  body: string; // Content of the message
  userId: string; // ID of the user who sent the message
  userName: string; // Name of the user who sent the message
  createdAt: any; // Timestamp of when the message was sent
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
    // Skip real-time updates if no project ID
    if (!projectId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const minTimeBetweenFetches = 2000; // 2 seconds minimum between fetches
    let lastFetchTime = 0;
    
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
        lastFetchTime = Date.now();
        
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
    
    // Set up real-time listener with throttling - only if we need real-time updates
    // For this mockup UI, we'll disable real-time updates to prevent constant POST requests
    // In a production app, you would conditionally enable this based on user needs
    const enableRealTimeUpdates = false; // Set to false to disable real-time updates
    
    if (!enableRealTimeUpdates) {
      return; // Skip setting up the listener
    }
    
    const messagesQuery = query(
      collection(firestore, `projectDiscussions/${projectId}/messages`),
      orderBy('createdAt', 'asc'),
      limit(REAL_TIME_MESSAGE_LIMIT)
    );
    
    // Clean up previous subscription if it exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    
    // Create heavily throttled update function - only process updates every 5 seconds at most
    const throttledUpdate = debounce((snapshot) => {
      // Check if enough time has passed since last fetch
      const now = Date.now();
      if (now - lastFetchTime < minTimeBetweenFetches) {
        return; // Skip this update if it's too soon
      }
      
      lastFetchTime = now;
      
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
    }, 5000); // Increase debounce time to 5 seconds
    
    // Set up the Firestore listener
    try {
      unsubscribeRef.current = onSnapshot(messagesQuery, (snapshot) => {
        throttledUpdate(snapshot);
      }, (error) => {
        console.error('Error in messages subscription:', error);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error setting up subscription:', error);
      setIsLoading(false);
    }
    
    // Clean up subscription on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      // Also cancel any pending throttled updates
      throttledUpdate.cancel();
    };
  }, [projectId]); // Remove shouldScrollToBottom dependency to prevent re-subscriptions
  
  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !currentUser) return;
    
    try {
      const newMessage = {
        body: commentText.trim(),
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        createdAt: Timestamp.now(),
        replyTo: focusedInputId || null
      };
      
      // Add the message to Firestore
      await addDoc(collection(firestore, `projectDiscussions/${projectId}/messages`), newMessage);
      
      // Clear the input and reset focused message
      setCommentText('');
      setFocusedInputId('');
      
      // Reset the placeholder text
      const inputElement = document.querySelector('.main-chat-input') as HTMLInputElement;
      if (inputElement) {
        inputElement.placeholder = 'Type a message...';
      }
      
      // Scroll to bottom after sending
      setShouldScrollToBottom(true);
      setTimeout(() => {
        if (messagesEndRef.current && containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Handle keyboard submission with Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };
  
  // Track which input is focused
  const [focusedInputId, setFocusedInputId] = useState<string>('');
  
  // Handle focus and blur events for inputs
  const handleInputFocus = (messageId: string) => {
    setFocusedInputId(messageId);
  };
  
  const handleInputBlur = () => {
    // Small delay to allow for click events to process
    setTimeout(() => {
      setFocusedInputId('');
      // Reset the placeholder text
      const inputElement = document.querySelector('.main-chat-input') as HTMLInputElement;
      if (inputElement) {
        inputElement.placeholder = 'Type a message...';
      }
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
    if (isLoading || !hasMore) return Promise.resolve();
    
    setIsLoading(true);
    
    return new Promise<void>((resolve) => {
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
        
        getDocs(q).then((querySnapshot) => {
          if (querySnapshot.empty) {
            setHasMore(false);
            setIsLoading(false);
            resolve();
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
          
          setIsLoading(false);
          resolve();
        }).catch(error => {
          console.error('Error loading messages:', error);
          setIsLoading(false);
          resolve();
        });
      } catch (error) {
        console.error('Error setting up query:', error);
        setIsLoading(false);
        resolve();
      }
    });
  }, [isLoading, hasMore, projectId, lastDoc]);
  
  // Track if we're currently loading more messages to prevent duplicate requests
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Debounced function to load more messages
  const debouncedLoadMore = useCallback(
    debounce(() => {
      if (!isLoading && !isLoadingMore && hasMore && messages.length >= MESSAGES_PER_PAGE) {
        setIsLoadingMore(true);
        console.log('Loading more messages, current count:', messages.length);
        loadMessages().finally(() => {
          setIsLoadingMore(false);
        });
      }
    }, 300),
    [isLoading, isLoadingMore, hasMore, messages.length, loadMessages]
  );
  
  // Track the last scroll position to prevent redundant calls
  const lastScrollTopRef = useRef<number>(0);
  const lastScrollTimeRef = useRef<number>(0);
  const isLoadingRef = useRef<boolean>(false);
  const loadingLockTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Create a properly throttled scroll handler to prevent excessive calls
  const handleScroll = useMemo(() => {
    return debounce(() => {
      if (!containerRef.current || isLoadingRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const now = Date.now();
      
      // Update shouldScrollToBottom state based on current scroll position
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (shouldScrollToBottom !== isNearBottom) {
        setShouldScrollToBottom(isNearBottom);
      }
      
      // Only check for loading more if we're near the top
      if (scrollTop < 50 && !isLoading && !isLoadingMore && hasMore) {
        // Prevent excessive calls by checking time difference
        const timeDiff = now - lastScrollTimeRef.current;
        
        // Only load more if it's been at least 2 seconds since the last load
        if (timeDiff > 2000) {
          // Set loading lock to prevent multiple concurrent requests
          isLoadingRef.current = true;
          
          // Update tracking refs
          lastScrollTopRef.current = scrollTop;
          lastScrollTimeRef.current = now;
          
          console.log('Triggering load more at scrollTop:', scrollTop, 'Time since last load:', timeDiff);
          setIsLoadingMore(true);
          
          loadMessages().finally(() => {
            setIsLoadingMore(false);
            
            // Release the loading lock after a delay to prevent rapid consecutive loads
            if (loadingLockTimeoutRef.current) {
              clearTimeout(loadingLockTimeoutRef.current);
            }
            
            loadingLockTimeoutRef.current = setTimeout(() => {
              isLoadingRef.current = false;
            }, 2000); // Keep lock for 2 seconds after loading completes
          });
        }
      } else {
        // Still update the last scroll position for tracking
        lastScrollTopRef.current = scrollTop;
      }
    }, 500, { leading: true, trailing: false, maxWait: 1000 });
  }, [shouldScrollToBottom, isLoading, isLoadingMore, hasMore, loadMessages]);

  // Add scroll event listener with proper cleanup
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        handleScroll.cancel(); // Cancel any pending debounced calls
        container.removeEventListener('scroll', handleScroll);
        
        // Clear any pending loading lock timeout
        if (loadingLockTimeoutRef.current) {
          clearTimeout(loadingLockTimeoutRef.current);
          loadingLockTimeoutRef.current = null;
        }
      };
    }
  }, [handleScroll]);
  
  // Group messages by date for better UI organization
  const groupedMessages = useMemo(() => {
    const grouped: { [key: string]: ChatMessage[] } = {};
    const sortedMessages = [...messages].sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return a.createdAt.seconds - b.createdAt.seconds;
    });
    
    sortedMessages.forEach(message => {
      if (!message.createdAt) return;
      
      const date = message.createdAt.toDate ? message.createdAt.toDate() : new Date(message.createdAt.seconds * 1000);
      const dateStr = format(date, 'MMMM d, yyyy');
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      
      grouped[dateStr].push(message);
    });
    
    return Object.keys(grouped).map(date => ({ date, messages: grouped[date] }));
  }, [messages]);

  return (
    <ChatContainer>
      {isLoading ? (
        <LoadingContainer>
          <LoadingText>Loading messages...</LoadingText>
        </LoadingContainer>
      ) : (
        <>
          <MessagesContainer ref={containerRef}>
            {messages.length === 0 ? (
              <NoMessagesContainer>
                <NoMessagesText>No messages yet. Start the conversation!</NoMessagesText>
              </NoMessagesContainer>
            ) : (
              groupedMessages.map((group) => (
                <React.Fragment key={group.date}>
                  <DateSeparator>
                    <DateText>{group.date}</DateText>
                  </DateSeparator>
                  {group.messages.map((message) => {
                    const isSelf = message.userId === currentUser?.uid;
                    return (
                      <MessageContainer key={message.id}>
                        <MessageWrapper $isSelf={isSelf}>
                          <CommentRow
                            c={{
                              id: message.id || '',
                              commentText: message.body || '',
                              userName: message.userName || 'Anonymous',
                              createdAt: message.createdAt
                            }}
                            isSelf={isSelf}
                            className="comment-row"
                          />
                        </MessageWrapper>
                        
                        {/* Display replies */}
                        {message.replies && message.replies.length > 0 && (
                          message.replies.map((reply) => {
                            const isReplySelf = reply.userId === currentUser?.uid;
                            return (
                              <MessageWrapper key={reply.id} $isSelf={isReplySelf} $isReply={true}>
                                <ReplyIndicator>
                                  <ReplyInfo>
                                    <FaComment size={8} />
                                    <ReplyName>{reply.userName}</ReplyName>
                                  </ReplyInfo>
                                </ReplyIndicator>
                                <CommentRow
                                  c={{
                                    id: reply.id || '',
                                    commentText: reply.body || '',
                                    userName: reply.userName || 'Anonymous',
                                    createdAt: reply.createdAt
                                  }}
                                  isSelf={isReplySelf}
                                  className="comment-row"
                                />
                              </MessageWrapper>
                            );
                          })
                        )}
                        
                        {/* Message action bar with reply button that transforms into input */}
                        {currentUser && (
                          <MessageActionBar>
                            {focusedInputId === message.id ? (
                              <ReplyInputContainer>
                                <CommentIcon>
                                  <FaComment size={14} />
                                </CommentIcon>
                                <ReplyInput 
                                  className="reply-input"
                                  type="text" 
                                  placeholder={`Reply to ${message.userName}...`}
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
                                      e.preventDefault();
                                      handleCommentSubmit();
                                    }
                                  }}
                                  autoFocus
                                />
                                <ReplySendButton 
                                  onClick={() => handleCommentSubmit()}
                                  disabled={!commentText.trim()}
                                  title="Send message"
                                >
                                  <span>+</span>
                                </ReplySendButton>
                              </ReplyInputContainer>
                            ) : (
                              <ReplyButtonMinimal 
                                onClick={() => {
                                  // Set the focused message ID
                                  setFocusedInputId(message.id || '');
                                }}
                              >
                                <span>+</span>
                              </ReplyButtonMinimal>
                            )}
                          </MessageActionBar>
                        )}
                      </MessageContainer>
                    );
                  })}
                </React.Fragment>
              ))
            )}
            <div ref={messagesEndRef} />
          </MessagesContainer>
          
          {/* No bottom input area - using reply buttons instead */}
        </>
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
  background: rgba(35, 38, 85, 0.15);
  border-radius: 16px;
  border: 1px solid rgba(130, 161, 191, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  gap: 1rem;
  scroll-behavior: smooth;
  background: rgba(35, 38, 85, 0.05);
  border-radius: 12px;
  margin: 0.75rem;
  
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
  margin-bottom: 24px;
  position: relative;
`;

const MessageWrapper = styled.div<{ $isSelf: boolean; $isReply?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isSelf ? 'flex-end' : 'flex-start'};
  width: 100%;
  margin: 4px 0;
  padding-left: ${props => props.$isReply ? '24px' : '0'};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${props => props.$isReply ? 'rgba(130, 161, 191, 0.25)' : 'transparent'};
    border-radius: 2px;
  }
  
  /* Style CommentRow to look like a chat bubble */
  .comment-row {
    background: ${props => props.$isSelf ? 'rgba(130, 90, 213, 0.2)' : 'rgba(35, 38, 85, 0.3)'};
    border-radius: ${props => props.$isSelf ? '18px 18px 0 18px' : '18px 18px 18px 0'};
    padding: 12px 16px;
    border: 1px solid ${props => props.$isSelf ? 'rgba(130, 161, 191, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
    width: 100%;
    max-width: 92%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
    
    &:hover {
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
      transform: translateY(-1px);
    }
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
  background: ${props => props.disabled ? 'transparent' : 'rgba(130, 161, 191, 0.2)'};
  border: none;
  color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)'};
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  
  &:hover:not(:disabled) {
    color: rgba(255, 255, 255, 1);
    background: rgba(130, 161, 191, 0.4);
    transform: scale(1.05);
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
  padding: 3rem;
  background: rgba(35, 38, 85, 0.1);
  border-radius: 12px;
  margin: 1rem;
`;

const NoMessagesText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  text-align: center;
  font-weight: 500;
  line-height: 1.5;
  max-width: 80%;
  
  &::before {
    content: '💬';
    display: block;
    font-size: 2rem;
    margin-bottom: 1rem;
    animation: pulse 2s infinite ease-in-out;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 3rem;
  background: rgba(35, 38, 85, 0.1);
  border-radius: 12px;
  margin: 1rem;
`;

const LoadingText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    width: 30px;
    height: 30px;
    border: 3px solid rgba(130, 161, 191, 0.3);
    border-top: 3px solid rgba(130, 161, 191, 0.8);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: block;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DateSeparator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
  width: 100%;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: rgba(130, 161, 191, 0.15);
    z-index: 0;
  }
`;

const DateText = styled.span`
  background: rgba(130, 161, 191, 0.25);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  padding: 0.35rem 0.85rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  font-weight: 500;
  letter-spacing: 0.5px;
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
  justify-content: flex-end;
  padding: 4px 0;
  width: 100%;
`;

const ReplyInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  padding: 6px 8px;
  outline: none;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
  }
  
  &:focus {
    &::placeholder {
      opacity: 0.8;
      transform: translateX(3px);
    }
  }
`;

const ReplyForm = styled.div<{ $isFocused: boolean }>`
  display: flex;
  align-items: center;
  background: ${props => props.$isFocused ? 'rgba(35, 38, 85, 0.5)' : 'rgba(35, 38, 85, 0.25)'};
  border-radius: 24px;
  padding: 8px 14px;
  border: 1px solid ${props => props.$isFocused ? 'rgba(130, 161, 191, 0.5)' : 'rgba(130, 161, 191, 0.15)'};
  width: 100%;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$isFocused ? '0 3px 8px rgba(0, 0, 0, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.1)'};
  margin-top: 8px;
  
  &:hover {
    background: ${props => props.$isFocused ? 'rgba(35, 38, 85, 0.5)' : 'rgba(35, 38, 85, 0.3)'};
    border-color: rgba(130, 161, 191, 0.3);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
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

// SendButton is already defined above

// Add a styled component for the input area at the bottom of the chat
const InputArea = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(35, 38, 85, 0.2);
  border-top: 1px solid rgba(130, 161, 191, 0.15);
  border-radius: 0 0 16px 16px;
  margin-top: auto;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  bottom: 0;
  z-index: 10;
`;

// Add a styled component for the main input field
const MainInput = styled.input`
  flex: 1;
  background: rgba(35, 38, 85, 0.3);
  border: 1px solid rgba(130, 161, 191, 0.2);
  border-radius: 24px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  padding: 10px 16px;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: rgba(130, 161, 191, 0.5);
    box-shadow: 0 0 0 2px rgba(130, 161, 191, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

// Add a styled component for the send button in the main input area
const MainSendButton = styled.button`
  background: rgba(130, 161, 191, 0.3);
  border: none;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.9);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(130, 161, 191, 0.5);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: default;
    transform: none;
  }
`;

// Styled component for the reply input container with three distinct styles
const ReplyInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  transition: all 0.3s ease;
  
  /* Default state - flat, minimal design */
  background: rgba(35, 38, 85, 0.1);
  border-radius: 4px;
  padding: 6px 12px;
  border-bottom: 1px dashed rgba(130, 161, 191, 0.2);
  
  /* Hover state - rounded with gradient */
  &:hover:not(:focus-within) {
    background: linear-gradient(to right, rgba(35, 38, 85, 0.2), rgba(35, 38, 85, 0.3));
    border-radius: 16px;
    border-bottom: none;
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2);
  }
  
  /* Focus/active state - pill shape with glow */
  &:focus-within {
    background: rgba(35, 38, 85, 0.4);
    border-radius: 24px;
    padding: 8px 16px;
    box-shadow: 0 0 12px rgba(130, 161, 191, 0.4);
    transform: translateY(-2px);
  }
`;

// Styled component for the reply send button
const ReplySendButton = styled.button`
  background: transparent !important;
  background-image: none !important;
  border: none;
  color: #ffffff;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  box-shadow: none !important;
  overflow: visible;
  z-index: auto;
  padding: 0;
  
  &:hover {
    opacity: 0.9;
    transform: none !important;
    box-shadow: none !important;
  }
  
  &:active {
    opacity: 0.7;
    transform: none !important;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
  
  &::before {
    display: none !important;
    content: none !important;
    background: none !important;
  }
`;

const ReplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(35, 38, 85, 0.15);
  border: none;
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.6);
  padding: 6px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;
  margin-top: 4px;
  opacity: 0.7;
  
  &:hover {
    background: rgba(35, 38, 85, 0.4);
    color: rgba(255, 255, 255, 0.9);
    opacity: 1;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    background: rgba(35, 38, 85, 0.5);
    transform: scale(0.98);
  }
  
  span {
    margin-top: 1px;
  }
`;

// Minimal reply button with just a + icon - absolutely no background or effects
const ReplyButtonMinimal = styled.button`
  display: inline;
  background: none !important;
  background-image: none !important;
  border: none;
  padding: 0;
  margin: 0;
  color: #ffffff;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
  box-shadow: none !important;
  overflow: visible;
  z-index: auto;
  
  &:hover {
    opacity: 0.9;
    transform: none !important;
    box-shadow: none !important;
  }
  
  &:active {
    opacity: 0.7;
    transform: none !important;
  }
  
  &::before {
    display: none !important;
    content: none !important;
    background: none !important;
  }
`;

const CommentIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  margin-right: 8px;
`;

export default DiscussionList;