import React, { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import { collection, query, getDocs, onSnapshot, orderBy, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../../firebase';
import styled, { keyframes, css } from 'styled-components';
import { useAuth } from '../../../contexts/AuthContext';
import { useMockupUI } from './MockupUIContext';
import { useTranslation } from 'react-i18next';
import { FaComment, FaFlag, FaHeart, FaTimes, FaDownload, FaCheck, FaTimes as FaX } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { RiThumbUpFill, RiThumbUpLine } from 'react-icons/ri';
import { Comment } from './types';
import { addMockupComment, getMockupComments, MockupComment } from '../../../firebase/services/forums';

// Define all animations at the top
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
`;

const commentHoverGlow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(205, 62, 253, 0.5), 0 0 10px rgba(205, 62, 253, 0.3);
  }
  50% {
    box-shadow: 0 0 10px rgba(205, 62, 253, 0.7), 0 0 20px rgba(205, 62, 253, 0.5);
  }
  100% {
    box-shadow: 0 0 5px rgba(205, 62, 253, 0.5), 0 0 10px rgba(205, 62, 253, 0.3);
  }
`;

const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// Use MockupComment from Firebase services instead of local interface
type CommentWithCoordinates = MockupComment;

interface MockupModalProps {
  projectId?: string;
}

interface FloatingCommentProps {
  comment: CommentWithCoordinates;
  isActive: boolean;
  onToggle: () => void;
  index: number;
  isRTL: boolean;
}

// Floating Comment component that can be expanded/collapsed
const FloatingComment: React.FC<FloatingCommentProps> = ({ comment, isActive, onToggle, index, isRTL }) => {
  const { t } = useTranslation();
  
  return (
    <CommentPin 
      style={{
        left: `${comment.coordinates?.x}%`,
        top: `${comment.coordinates?.y}%`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-expanded={isActive}
      aria-label={isActive ? t('mockups.collapseComment') : t('mockups.expandComment', { number: index + 1 })}
    >
      {isActive ? (
        <CommentBubble $isRTL={isRTL}>
          <CommentHeader>
            <UserInfo>
              <UserName>{comment.user.displayName || 'Anonymous'}</UserName>
              <CommentTime>{new Date(comment.createdAt as any).toLocaleString()}</CommentTime>
            </UserInfo>
            <CloseCommentButton 
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              aria-label={t('mockups.collapseComment')}
            >
              <FaTimes size={12} />
            </CloseCommentButton>
          </CommentHeader>
          <CommentContent>{comment.content}</CommentContent>
        </CommentBubble>
      ) : (
        <MinimizedComment>
          <FaComment size={14} />
          <CommentNumber>{index + 1}</CommentNumber>
        </MinimizedComment>
      )}
    </CommentPin>
  );
};

const MockupModal: React.FC<MockupModalProps> = ({ projectId = 'default' }) => {
  const { t, i18n } = useTranslation();
  const { selectedMockup, clearSelectedMockup } = useMockupUI();
  const { currentUser } = useAuth();
  const [newCommentCoords, setNewCommentCoords] = useState<{x: number, y: number} | null>(null);
  const [existingComments, setExistingComments] = useState<CommentWithCoordinates[]>([]);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [activePinId, setActivePinId] = useState<string | null>(null); // For tracking active comment pin
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  
  // Track viewed and feedback status for current user
  const [hasViewed, setHasViewed] = useState(false);
  const [hasFeedback, setHasFeedback] = useState(false);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const commentFormRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.language === 'ar';
  
  const handleClose = () => {
    clearSelectedMockup();
  };
  
  // Calculate popover position based on pixel coordinates
  const calculatePopoverPosition = (x: number, y: number) => {
    const imageContainer = document.querySelector('.mockup-image');
    if (!imageContainer) return '';
    
    const containerRect = imageContainer.getBoundingClientRect();
    const popoverWidth = 250;
    const popoverHeight = 120;
    const classes = [];
    
    // Vertical positioning based on available space
    const spaceBelow = containerRect.height - y;
    const spaceAbove = y;
    
    if (spaceBelow < popoverHeight && spaceAbove > popoverHeight) {
      classes.push('position-above');
    } else {
      classes.push('position-below');
    }
    
    // Horizontal positioning based on available space
    const spaceRight = containerRect.width - x;
    const spaceLeft = x;
    
    if (spaceRight < popoverWidth && spaceLeft > popoverWidth) {
      classes.push('position-left');
    } else if (spaceLeft < 100) {
      classes.push('position-right');
    }
    
    return classes.join(' ');
  };
  
  // Add event listener for Escape key
  useEffect(() => {
    if (!selectedMockup) return;
    
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [selectedMockup, clearSelectedMockup]);
  
  // Handle toggling a comment's expanded/collapsed state
  const toggleComment = (commentId: string) => {
    setActiveCommentId(activeCommentId === commentId ? null : commentId);
  };

  // Calculate position for the comment form using pixel coordinates
  const calculateCommentFormPosition = (coords: { x: number; y: number }) => {
    const imageContainer = document.querySelector('.mockup-image');
    if (!imageContainer) {
      return {
        left: `${coords.x}px`,
        top: `${coords.y + 30}px`
      };
    }
    
    const containerRect = imageContainer.getBoundingClientRect();
    const formWidth = 280;
    const formHeight = 180;
    const padding = 15;
    const pinOffset = 26; // Pin diameter for positioning offset
    
    // Calculate available space
    const spaceRight = containerRect.width - coords.x;
    const spaceLeft = coords.x;
    const spaceBelow = containerRect.height - coords.y;
    const spaceAbove = coords.y;
    
    let left = coords.x - formWidth / 2; // Center horizontally by default
    let top = coords.y + pinOffset + 10; // Position below the pin by default
    
    // Horizontal boundary detection with improved logic
    if (left < padding) {
      left = padding; // Align to left edge with padding
    } else if (left + formWidth > containerRect.width - padding) {
      left = containerRect.width - formWidth - padding; // Align to right edge with padding
    }
    
    // Vertical boundary detection with improved logic
    if (spaceBelow < formHeight + 50 && spaceAbove > formHeight + 50) {
      // Position above the pin if there's more space above
      top = coords.y - formHeight - pinOffset - 10;
    } else if (top + formHeight > containerRect.height - padding) {
      // If form would go below container bottom, align to bottom
      top = containerRect.height - formHeight - padding;
    }
    
    // Ensure form doesn't go above container top
    if (top < padding) {
      top = padding;
    }
    
    // Ensure coordinates are never negative
    left = Math.max(padding, left);
    top = Math.max(padding, top);
    
    return {
      left: `${left}px`,
      top: `${top}px`
    };
  };

  // Function to add a new comment to Firebase
  const handleAddComment = async () => {
    if (!commentText.trim() || !newCommentCoords || !commentInputRef.current || !selectedMockup?.id) {
      return;
    }

    if (!currentUser) {
      setCommentError('You must be logged in to add comments');
      return;
    }

    setIsSubmittingComment(true);
    setCommentError(null);

    try {
      // Create comment data for Firebase
      const commentData: MockupComment = {
        content: commentText.trim(),
        coordinates: { ...newCommentCoords },
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userEmail: currentUser.email || '',
        userPhotoURL: currentUser.photoURL || ''
      };

      // Save to Firebase
      const commentId = await addMockupComment(projectId || 'default', selectedMockup.id, commentData);
      
      console.log(`Comment added successfully with ID: ${commentId}`);

      // Optimistically add to local state (with the ID from Firebase)
      const newComment: CommentWithCoordinates = {
        ...commentData,
        id: commentId,
        likes: 0,
        likedBy: [],
        createdAt: new Date() as any // Will be updated when we fetch from Firebase
      };

      setExistingComments(prev => [...prev, newComment]);
      
      // Update feedback status since user just added feedback
      setHasFeedback(true);

      // Clear form
      setCommentText('');
      setIsCommentFormVisible(false);
      setNewCommentCoords(null);

      // Focus back on the image
      setTimeout(() => {
        const mockupImage = document.querySelector('.mockup-image');
        if (mockupImage) {
          (mockupImage as HTMLElement).focus();
        }
      }, 0);

    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentError(error instanceof Error ? error.message : 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Cancel adding a new comment
  const cancelAddComment = () => {
    setIsCommentFormVisible(false);
    setNewCommentCoords(null);
    setCommentText('');
  };

  // Focus the comment input when coordinates are set
  useEffect(() => {
    if (!selectedMockup) return;
    
    // Only proceed if we have coordinates and comments are showing
    if (newCommentCoords && showComments) {
      // Short timeout to ensure the comment box is rendered
      setTimeout(() => {
        const textArea = document.querySelector('.comment-text-area') as HTMLTextAreaElement;
        if (textArea) {
          textArea.focus();
        }
      }, 100);
    }
  }, [newCommentCoords, showComments, selectedMockup]);

  // Check if current user has given feedback on this mockup
  const checkUserFeedbackStatus = (comments: CommentWithCoordinates[]) => {
    if (!currentUser?.uid) {
      setHasFeedback(false);
      return;
    }
    
    const userHasFeedback = comments.some(comment => comment.userId === currentUser.uid);
    setHasFeedback(userHasFeedback);
  };
  
  // Mark mockup as viewed (in real app, this would save to Firebase)
  const markAsViewed = () => {
    if (currentUser?.uid) {
      setHasViewed(true);
      // In production: save view status to Firebase
      // await markMockupAsViewed(projectId, selectedMockup.id, currentUser.uid);
    }
  };
  
  // Fetch comments from Firebase using the service
  const fetchComments = async () => {
    if (!selectedMockup?.id) return;
    
    setIsLoadingComments(true);
    setCommentError(null);
    
    try {
      const comments = await getMockupComments(projectId || 'default', selectedMockup.id);
      setExistingComments(comments);
      
      // Check if current user has given feedback
      checkUserFeedbackStatus(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setCommentError('Failed to load comments');
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Fetch existing comments and mark as viewed when selectedMockup changes
  useEffect(() => {
    if (!selectedMockup?.id) {
      setExistingComments([]);
      setHasViewed(false);
      setHasFeedback(false);
      return;
    }
    
    fetchComments();
    markAsViewed();
  }, [selectedMockup?.id, projectId]);

  // Toggle comments visibility
  const toggleComments = () => {
    setShowComments(!showComments);
    // Hide any active comment popovers when toggling
    if (showComments) {
      setActivePinId(null);
    }
  };

  // If no mockup is selected, don't render anything
  if (!selectedMockup) {
    return null;
  }

  return (
    <ModalOverlay onClick={() => setActivePinId(null)}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose} aria-label={t('common.close')}>
          <FaTimes />
        </CloseButton>
        
        <ModalHeader>
          <h2>{selectedMockup?.title ? selectedMockup.title.charAt(0).toUpperCase() + selectedMockup.title.slice(1) : 'Untitled Design'}</h2>
          <ModalActions>
            <ActionButton 
              onClick={toggleComments}
              className={showComments ? 'active' : ''}
            >
              <FaComment />
              <span>{showComments ? t('mockups.hideComments') : t('mockups.showComments')}</span>
              {existingComments.length > 0 && !showComments && (
                <CommentBadge>{existingComments.length}</CommentBadge>
              )}
            </ActionButton>
            <ActionButton onClick={() => window.open(selectedMockup?.imageUrl || selectedMockup?.imageURL, '_blank')}>
              <FaDownload />
              <span>{t('mockups.download')}</span>
            </ActionButton>
          </ModalActions>
        </ModalHeader>
        
        <MockupImageContainer>
          <MockupImage
            style={{ backgroundImage: `url(${selectedMockup?.imageUrl || selectedMockup?.imageURL})` }}
            className="mockup-image"
            tabIndex={0}
            role="img"
            aria-label={selectedMockup?.title || 'Mockup image'}
            onClick={(event) => {
              // Close any active comment popovers first
              setActivePinId(null);
              
              const target = event.currentTarget;
              const rect = target.getBoundingClientRect();
              
              // Calculate pixel coordinates relative to the image container
              const clickX = event.clientX - rect.left;
              const clickY = event.clientY - rect.top;
              
              // Store coordinates accounting for the pin centering (transform: translate(-50%, -50%))
              // We need to add half the pin size (13px) to compensate for the centering
              const x = Math.max(13, Math.min(rect.width - 13, clickX));
              const y = Math.max(13, Math.min(rect.height - 13, clickY));
              
              // Store pixel coordinates directly
              setNewCommentCoords({ x, y });
              setIsCommentFormVisible(true);
              
              // Automatically show comments panel when clicking on the image
              if (!showComments) {
                setShowComments(true);
              }
            }}
          />
          
          {/* Comments disabled overlay */}
          {!showComments && existingComments.length > 0 && (
            <CommentsDisabledOverlay onClick={() => setShowComments(true)}>
              <OverlayContent>
                <FaComment size={24} />
                <OverlayText>
                  {existingComments.length} feedback item{existingComments.length !== 1 ? 's' : ''} hidden
                </OverlayText>
                <OverlaySubtext>Click "{t('mockups.showComments')}" to view feedback</OverlaySubtext>
              </OverlayContent>
            </CommentsDisabledOverlay>
          )}
          {/* MOVED: Comment pins will be rendered inside MockupImage */}
          
          {/* Display new comment pin only when comments are visible */}
          {showComments && newCommentCoords && (
            <PulsingCommentPin 
              style={{
                left: `${newCommentCoords.x}px`,
                top: `${newCommentCoords.y}px`
              }}
            />
          )}
          

          {/* Comment pins */}
          {showComments && existingComments.filter(comment => comment.coordinates).map((comment, index) => (
            <Fragment key={comment.id}>
              <div style={{
                position: 'absolute',
                left: `${comment.coordinates?.x}px`,
                top: `${comment.coordinates?.y}px`,
                width: '26px',
                height: '26px',
                background: 'rgba(205, 62, 253, 0.95)',
                borderRadius: '50%',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'white',
                border: '2px solid white',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s ease'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActivePinId(activePinId === comment.id ? null : comment.id);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)';
                e.currentTarget.style.background = 'rgba(205, 62, 253, 1)';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.3), 0 3px 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(205, 62, 253, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                e.currentTarget.style.background = 'rgba(205, 62, 253, 0.95)';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.4)';
              }}
              title={`${comment.userName}: ${comment.content.substring(0, 30)}${comment.content.length > 30 ? '...' : ''}`}
              aria-label={`Feedback item ${index + 1}`}
              >
                {index + 1}
              </div>
              
              {/* Show comment popover when pin is active and comments are visible */}
              {activePinId === comment.id && showComments && (
                <CommentPopover
                  style={{
                    left: `${comment.coordinates?.x}px`,
                    top: `${comment.coordinates?.y}px`
                  }}
                  className={calculatePopoverPosition(comment.coordinates?.x || 0, comment.coordinates?.y || 0)}
                  $isRTL={isRTL}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CommentPopoverHeader>
                    <CommentAuthor>{comment.userName || 'Anonymous'}</CommentAuthor>
                    <CommentDate>
                      {new Date(comment.createdAt as any).toLocaleDateString()}
                    </CommentDate>
                    <ClosePopoverButton 
                      onClick={() => setActivePinId(null)}
                      aria-label={t('common.close')}
                    >
                      <FaTimes size={12} />
                    </ClosePopoverButton>
                  </CommentPopoverHeader>
                  <CommentPopoverContent>
                    {comment.content}
                  </CommentPopoverContent>
                </CommentPopover>
              )}
            </Fragment>
          ))}
        </MockupImageContainer>
        
        <MockupDetails>
          <p>{selectedMockup?.description || 'No description available'}</p>
          <MockupMeta>
            <MetaItem>
              <strong>{t('mockups.status.createdBy')}</strong> {currentUser?.displayName || currentUser?.email || 'Unknown User'}
            </MetaItem>
            <MetaItem>
              <strong>{t('mockups.status.viewed')}</strong> 
              <StatusIcon $status={hasViewed}>
                {hasViewed ? <FaCheck /> : <FaX />}
              </StatusIcon>
            </MetaItem>
            <MetaItem>
              <strong>{t('mockups.status.feedbackGiven')}</strong> 
              <StatusIcon $status={hasFeedback}>
                {hasFeedback ? <FaCheck /> : <FaX />}
              </StatusIcon>
            </MetaItem>
          </MockupMeta>
        </MockupDetails>
        
        
        {/* Comment form only shows when comments are visible */}
        {showComments && newCommentCoords && isCommentFormVisible && (
          <CommentForm 
            ref={commentFormRef}
            style={calculateCommentFormPosition(newCommentCoords)}
            className="comment-form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              handleAddComment();
            }}
          >
            {commentError && (
              <CommentErrorMessage>
                {commentError}
              </CommentErrorMessage>
            )}
            <CommentTextArea
              ref={commentInputRef}
              placeholder={t('mockups.addFeedback')}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="comment-text-area"
              $isRTL={isRTL}
              disabled={isSubmittingComment}
            />
            <CommentFormActions>
              <SubmitButton type="submit" disabled={!commentText.trim() || isSubmittingComment}>
                {isSubmittingComment ? t('mockups.posting') || 'Posting...' : t('mockups.post')}
              </SubmitButton>
              <CancelButton type="button" onClick={cancelAddComment} disabled={isSubmittingComment}>
                {t('common.cancel')}
              </CancelButton>
            </CommentFormActions>
          </CommentForm>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: ${fadeIn} 0.3s ease;
  padding: 2vh 2vw;
  
  @media (max-width: 768px) {
    padding: 0;
  }
  
  @media (max-height: 600px) {
    padding: 1vh 1vw;
  }
`;

const ModalContainer = styled.div`
  background: linear-gradient(135deg, #1a1d3a 0%, #1e1237 100%);
  border-radius: 16px;
  width: min(92vw, 1200px);
  height: min(88vh, 800px);
  max-height: 88vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7), 0 0 100px rgba(205, 62, 253, 0.1);
  position: relative;
  border: 1px solid rgba(205, 62, 253, 0.3);
  animation: ${slideUp} 0.3s ease;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 1024px) {
    width: 95vw;
    height: 90vh;
    max-height: 90vh;
  }
  
  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }
  
  @media (max-width: 480px) {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
  
  @media (max-height: 700px) {
    height: 95vh;
    max-height: 95vh;
  }
  
  @media (max-height: 600px) {
    height: 100vh;
    max-height: 100vh;
  }
`;

// Comment Pin styled components
const CommentPin = styled.div`
  position: absolute;
  z-index: 20;
  cursor: pointer;
  transform: translate(-50%, -50%);
`;

const MinimizedComment = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #CBBC9F;
  color: #1a1d3a;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
  }
`;

const CommentNumber = styled.span`
  font-size: 12px;
  font-weight: bold;
`;


// Animation already defined at the top of the file

const CommentBubble = styled.div<{ $isRTL: boolean }>`
  position: absolute;
  width: 250px;
  background: #2a2e57;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 30;
  ${props => props.$isRTL ? 'right: 30px;' : 'left: 30px;'}
  top: -10px;
  border: 1px solid rgba(203, 188, 159, 0.5);
  animation: ${fadeIn} 0.2s ease;
  
  &:before {
    content: '';
    position: absolute;
    ${props => props.$isRTL ? 'right: -10px;' : 'left: -10px;'}
    top: 15px;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    ${props => props.$isRTL ? 'border-left: 10px solid #2a2e57;' : 'border-right: 10px solid #2a2e57;'}
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: bold;
  color: white;
  font-size: 14px;
`;

const CommentTime = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  margin-top: 2px;
`;

const CloseCommentButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const CommentContent = styled.div`
  color: white;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CommentForm = styled.form`
  position: absolute;
  background: linear-gradient(135deg, rgba(41, 23, 70, 0.98) 0%, rgba(30, 18, 60, 0.98) 100%);
  border-radius: 12px;
  padding: 18px;
  width: 300px;
  max-width: calc(100% - 30px);
  z-index: 40;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(205, 62, 253, 0.5);
  border: 2px solid rgba(205, 62, 253, 0.6);
  animation: ${fadeIn} 0.3s ease forwards;
  backdrop-filter: blur(20px);
  
  /* Ensure form doesn't go outside the image container */
  min-width: 250px;
  min-height: 120px;
  
  /* Add pointer cursor and prevent text selection on the form container */
  cursor: default;
  user-select: none;
  
  /* Ensure the form is always visible */
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 16px;
    z-index: -1;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    width: 280px;
    padding: 15px;
    max-width: calc(100% - 20px);
  }
  
  @media (max-width: 480px) {
    width: 260px;
    padding: 12px;
    min-width: 200px;
    max-width: calc(100% - 10px);
  }
  
  @media (max-width: 360px) {
    width: 240px;
    padding: 10px;
    min-width: 180px;
    max-width: calc(100% - 5px);
    min-height: 100px;
  }
`;

const CommentErrorMessage = styled.div`
  background: rgba(255, 59, 48, 0.15);
  border: 1px solid rgba(255, 59, 48, 0.3);
  color: #ff6b6b;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 0.9rem;
  line-height: 1.4;
  animation: ${fadeIn} 0.3s ease;
`;

// The commentHoverGlow animation is already defined earlier in the file

// These components are already defined elsewhere in the file,
// so we don't need to redefine them

const CommentFormContainer = styled.div`
  position: absolute;
  background: rgba(42, 46, 87, 0.95);
  border-radius: 8px;
  padding: 15px;
  width: 300px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  z-index: 100;
  border: 1px solid rgba(203, 188, 159, 0.5);
`;

const CommentTextArea = styled.textarea<{ $isRTL: boolean }>`
  width: 100%;
  min-height: 80px;
  background: rgba(26, 29, 58, 0.9);
  border: 1px solid rgba(205, 62, 253, 0.4);
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-family: inherit;
  resize: none;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.$isRTL ? 'right' : 'left'};
  font-size: 0.95rem;
  box-sizing: border-box;
  cursor: text;
  user-select: text;
  
  &:focus {
    outline: none;
    border-color: rgba(205, 62, 253, 0.8);
    background: rgba(30, 18, 60, 0.95);
    box-shadow: 0 0 0 2px rgba(205, 62, 253, 0.3), 0 0 15px rgba(123, 44, 191, 0.4);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
    opacity: 1;
  }
`;

const CommentFormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 10px;
`;

const CommentFormButton = styled.button`
  padding: 6px 15px;
  background: rgba(205, 62, 253, 0.85);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(205, 62, 253, 1);
    transform: translateY(-1px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.25);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(CommentFormButton)`
  font-weight: 600;
  background: rgba(205, 62, 253, 0.85);
  color: white;
  
  &:hover:not(:disabled) {
    background: rgba(205, 62, 253, 1);
  }
`;

const CancelButton = styled.button`
  padding: 6px 15px;
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 25;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  outline: none;
  backdrop-filter: blur(10px);
  
  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(205, 62, 253, 0.4);
    border-color: rgba(205, 62, 253, 0.5);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    width: 36px;
    height: 36px;
  }
  
  @media (max-width: 480px) {
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
  
  @media (max-width: 360px) {
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
`;

const ModalHeader = styled.header`
  padding: 1.25rem 1.75rem;
  padding-right: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(30, 18, 60, 0.98) 0%, rgba(41, 23, 70, 0.98) 100%);
  border-bottom: 1px solid rgba(205, 62, 253, 0.2);
  flex-shrink: 0;
  z-index: 15;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #cd3efd, #f4c8ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-transform: capitalize;
    letter-spacing: 0.5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 60%;
  }

  @media (max-width: 768px) {
    padding: 1rem 1.25rem;
    padding-right: 3.5rem;
    
    h2 {
      font-size: 1.2rem;
      max-width: 50%;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem 1rem;
    padding-right: 3rem;
    
    h2 {
      font-size: 1rem;
      max-width: 40%;
    }
  }
  
  @media (max-width: 360px) {
    padding: 0.75rem 0.875rem;
    padding-right: 2.75rem;
    
    h2 {
      font-size: 0.9rem;
      max-width: 35%;
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.25rem;
    flex-wrap: wrap;
  }
`;

const ActionButton = styled.button`
  border-radius: 8px;
  font-size: 0.95rem;
  color: white;
  background: linear-gradient(135deg, rgba(205, 62, 253, 0.15), rgba(205, 62, 253, 0.25));
  border: 1px solid rgba(205, 62, 253, 0.4);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
  position: relative;
  
  span {
    display: inline-block;
  }
  
  &:hover {
    background: linear-gradient(135deg, rgba(205, 62, 253, 0.25), rgba(205, 62, 253, 0.35));
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(205, 62, 253, 0.3);
    border-color: rgba(205, 62, 253, 0.6);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &.active {
    background: linear-gradient(135deg, rgba(205, 62, 253, 0.4), rgba(205, 62, 253, 0.5));
    border-color: rgba(205, 62, 253, 0.7);
    box-shadow: 0 0 20px rgba(205, 62, 253, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.85rem;
    gap: 6px;
    
    span {
      display: none; /* Hide text on small screens */
    }
  }
  
  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 0.8rem;
    min-width: 40px;
  }
`;

const MockupImageContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
  flex: 1;
  min-height: 0; /* Allow flex item to shrink */
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(205, 62, 253, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(205, 62, 253, 0.5);
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
  
  @media (max-width: 360px) {
    padding: 0.375rem;
  }
`;

const MockupImage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  cursor: crosshair;
  transition: all 0.2s ease;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  background-color: rgba(0, 0, 0, 0.1);
  min-height: 300px;
  
  &:hover {
    filter: brightness(1.05);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
  }
  
  @media (max-width: 768px) {
    height: 100%;
    min-height: 250px;
  }
  
  @media (max-width: 480px) {
    min-height: 200px;
  }
  
  @media (max-width: 360px) {
    min-height: 180px;
  }
  
  @media (max-height: 600px) {
    min-height: 200px;
  }
  
  @media (max-height: 500px) {
    min-height: 150px;
  }
`;

const MockupDetails = styled.div`
  padding: 1.25rem 1.75rem;
  border-top: 1px solid rgba(205, 62, 253, 0.2);
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
  max-height: 25vh;
  overflow-y: auto;
  
  p {
    margin-top: 0;
    margin-bottom: 1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
  }
  
  @media (max-width: 768px) {
    padding: 1rem 1.25rem;
    max-height: 20vh;
    
    p {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem 1rem;
    max-height: 18vh;
    
    p {
      font-size: 0.85rem;
    }
  }
  
  @media (max-width: 360px) {
    padding: 0.75rem 0.875rem;
    max-height: 16vh;
    
    p {
      font-size: 0.8rem;
    }
  }
  
  @media (max-height: 600px) {
    padding: 0.75rem 1.25rem;
    max-height: 15vh;
  }
  
  @media (max-height: 500px) {
    padding: 0.5rem 1rem;
    max-height: 12vh;
  }
`;

const MockupMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  
  span {
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(205, 62, 253, 0.3);
    }
  }
  
  @media (max-width: 768px) {
    gap: 1rem;
    margin-top: 1rem;
    
    span {
      padding: 6px 12px;
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    margin-top: 0.875rem;
    flex-direction: column;
    align-items: flex-start;
  }
  
  @media (max-width: 360px) {
    gap: 0.5rem;
    margin-top: 0.75rem;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  
  strong {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(205, 62, 253, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 0.85rem;
    width: 100%;
    justify-content: flex-start;
  }
  
  @media (max-width: 360px) {
    padding: 4px 8px;
    font-size: 0.8rem;
  }
`;

const StatusIcon = styled.span<{ $status: boolean }>`
  color: ${props => props.$status ? '#4CAF50' : '#FF5722'};
  font-size: 0.9rem;
  margin-left: 4px;
`;

const StatusText = styled.span<{ $status: boolean }>`
  color: ${props => props.$status ? '#4CAF50' : '#FF5722'};
  font-weight: 500;
  font-size: 0.85rem;
`;

const CommentsSection = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.2);
`;

const CommentsSectionHeader = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
`;

const CommentsContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(123, 44, 191, 0.5);
    border-radius: 3px;
  }
`;

const CommentInputContainer = styled.div`
  margin-top: 1rem;
`;

const PinWrapper = styled.div<{ theme?: { rtl?: boolean } }>`
  position: relative;
  width: 24px;
  height: 24px;
  padding: 0;
  
  &:hover, &:focus {
    background-color: #a49d88;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.9);
  }
  
  ${props => props.theme?.rtl && css`
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  `}
`;

// This CommentPin definition has been moved up to line ~478

// Pulsing comment pin with animation
const PulsingCommentPin = styled(CommentPin)`
  animation: ${pulse} 2s ease-out infinite;
  background-color: #CBBC9F;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  box-shadow: 0 0 0 4px rgba(203, 188, 159, 0.3), 0 5px 15px rgba(0, 0, 0, 0.4);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(203, 188, 159, 0.5);
    border-radius: 50%;
    transform: scale(1.5);
    z-index: -1;
    animation: ${commentHoverGlow} 2s infinite;
  }
`;

// Comment pin wrapper for positioning popovers
const CommentPinWrapper = styled.div`
  position: relative;
  z-index: 30;
`;

// Comment popover for showing existing comments
const CommentPopover = styled.div<{ $isRTL: boolean }>`
  position: absolute;
  background: linear-gradient(135deg, rgba(26, 29, 58, 0.98), rgba(30, 18, 60, 0.98));
  border: 1px solid rgba(205, 62, 253, 0.4);
  border-radius: 12px;
  padding: 0;
  min-width: 280px;
  max-width: 320px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(205, 62, 253, 0.3);
  z-index: 35;
  animation: ${fadeIn} 0.2s ease;
  backdrop-filter: blur(10px);
  transform: translate(-50%, -50%);
  
  &.position-above {
    transform: translate(-50%, -120%);
  }
  
  &.position-below {
    transform: translate(-50%, 20px);
  }
  
  &.position-left {
    transform: translate(-90%, -50%);
  }
  
  &.position-right {
    transform: translate(-10%, -50%);
  }
  
  &.position-above.position-left {
    transform: translate(-90%, -120%);
  }
  
  &.position-above.position-right {
    transform: translate(-10%, -120%);
  }
  
  &.position-below.position-left {
    transform: translate(-90%, 20px);
  }
  
  &.position-below.position-right {
    transform: translate(-10%, 20px);
  }
  
  @media (max-width: 768px) {
    min-width: 250px;
    max-width: 280px;
  }
  
  @media (max-width: 480px) {
    min-width: 220px;
    max-width: 260px;
  }
  
  @media (max-width: 360px) {
    min-width: 200px;
    max-width: 240px;
  }
`;

const CommentPopoverHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px 18px 12px;
  border-bottom: 1px solid rgba(205, 62, 253, 0.2);
  background: linear-gradient(135deg, rgba(205, 62, 253, 0.1), rgba(205, 62, 253, 0.05));
  border-radius: 12px 12px 0 0;
`;

const CommentAuthor = styled.div`
  font-weight: 600;
  color: white;
  font-size: 0.95rem;
  flex: 1;
`;

const CommentDate = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-right: 12px;
  margin-top: 2px;
`;

const ClosePopoverButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const CommentPopoverContent = styled.div`
  padding: 15px 18px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
`;

// Comments disabled overlay
const CommentsDisabledOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, rgba(205, 62, 253, 0.15), rgba(205, 62, 253, 0.25));
  border: 2px dashed rgba(205, 62, 253, 0.4);
  border-radius: 16px;
  padding: 20px 30px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: linear-gradient(135deg, rgba(205, 62, 253, 0.25), rgba(205, 62, 253, 0.35));
    border-color: rgba(205, 62, 253, 0.6);
    transform: translate(-50%, -50%) scale(1.05);
  }
  
  @media (max-width: 768px) {
    padding: 15px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px;
    border-radius: 12px;
  }
  
  @media (max-width: 360px) {
    padding: 10px 14px;
    border-radius: 10px;
    transform: translate(-50%, -50%) scale(0.9);
    
    &:hover {
      transform: translate(-50%, -50%) scale(0.95);
    }
  }
`;

const OverlayContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
`;

const OverlayText = styled.div`
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 4px;
`;

const OverlaySubtext = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  font-style: italic;
`;

// Comment count badge
const CommentBadge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 6px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 18px;
  text-align: center;
`;

export default MockupModal;
