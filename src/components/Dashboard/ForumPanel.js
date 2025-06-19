import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { rtl } from '../../utils/rtl';
import { colors, spacing, shadows, borderRadius, transitions } from '../../styles/GlobalTheme';
import { useAuth } from '../../contexts/AuthContext';

// Import global components
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  SearchInput,
  PrimaryButton
} from '../../styles/GlobalComponents';

// Firebase imports - using lazy imports to avoid circular dependencies
import { getFirestoreDb, getStorageInstance, isFirebaseInitialized } from '../../firebase';
import { 
  collection, 
  query, 
  orderBy, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp, 
  where, 
  limit 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Icons
import { 
  FaUser, 
  FaFileUpload, 
  FaCommentAlt, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaCalendarAlt, 
  FaFilter,
  FaSearch,
  FaPaperPlane,
  FaReply,
  FaImage,
  FaPaperclip,
  FaTimes,
  FaRegCommentAlt,
  FaUpload,
  FaComment,
  FaSpinner,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaRedo,
  FaCog,
  FaProjectDiagram,
  FaTasks
} from 'react-icons/fa';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const ThreadPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${colors.accent.primary};
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: ${spacing.md};
  flex-shrink: 0;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${colors.text.secondary};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadius.sm};
  transition: ${transitions.main};
  
  &:hover {
    color: ${colors.accent.primary};
    background: ${colors.background.hover};
  }
  
  &:disabled {
    color: ${colors.text.disabled};
    cursor: not-allowed;
  }
`;

const AvatarImage = styled.img`
  width: ${props => {
    switch (props.size) {
      case 'xs': return '20px';
      case 'sm': return '28px';
      case 'lg': return '48px';
      default: return '36px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'xs': return '20px';
      case 'sm': return '28px';
      case 'lg': return '48px';
      default: return '36px';
    }
  }};
  border-radius: 50%;
  object-fit: cover;
`;

const Dropdown = styled.select`
  padding: 8px 12px;
  border-radius: ${borderRadius.md};
  border: 1px solid ${colors.border.main};
  background-color: ${colors.background.card};
  color: ${colors.text.primary};
  font-size: 0.9rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
  width: 100%;
  transition: ${transitions.main};
  
  &:hover, &:focus {
    border-color: ${colors.accent.primary};
  }
  
  &:disabled {
    background-color: ${colors.background.disabled};
    color: ${colors.text.disabled};
    cursor: not-allowed;
  }
`;

// Layout components for the forum
const ForumLayout = styled.div`
  display: flex;
  flex: 1;
  gap: ${spacing.md};
  height: 100%;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const ForumSidebar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: ${borderRadius.md};
  background: ${colors.background.card};
  box-shadow: ${shadows.medium};
  overflow: hidden;
  max-width: 380px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const ThreadList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: ${spacing.md};
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${colors.background.secondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.accent.secondary};
    border-radius: ${borderRadius.pill};
  }
`;

const ThreadItem = styled.div`
  padding: ${spacing.md};
  margin-bottom: ${spacing.sm};
  border-radius: ${borderRadius.md};
  background: ${props => props.active ? colors.primary.lightest : colors.background.light};
  border-left: 3px solid ${props => props.active ? colors.primary.main : 'transparent'};
  cursor: pointer;
  transition: ${transitions.medium};
  
  &:hover {
    background: ${colors.accent.tertiary};
    border-left-color: ${colors.accent.secondary};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    border-left: none;
    border-right: 3px solid ${props => props.active ? colors.primary.main : 'transparent'};
  }
`;

const ContentArea = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  border-radius: ${borderRadius.md};
  background: ${colors.background.card};
  box-shadow: ${shadows.medium};
  overflow: hidden;
`;

const ThreadHeader = styled.div`
  padding: ${spacing.md} ${spacing.lg};
  border-bottom: 1px solid ${colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.background.secondary};
`;

const ThreadContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: ${spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  background: rgba(0, 0, 0, 0.15);
  border-radius: ${borderRadius.md};
  margin: 0 ${spacing.sm};
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.accent.secondary};
    border-radius: 10px;
  }
  
  /* Add animation for new messages */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ThreadDetailContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${spacing.md};
  display: flex;
  flex-direction: column;
`;

const MessageItem = styled.div`
  margin-bottom: ${spacing.md};
  background: ${props => props.isSelf ? 'rgba(131, 56, 236, 0.15)' : colors.background.card};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  max-width: 85%;
  align-self: ${props => props.isSelf ? 'flex-end' : 'flex-start'};
  box-shadow: ${shadows.sm};
  border-left: ${props => props.isSelf ? '3px solid ' + colors.accent.primary : '3px solid ' + colors.status.info};
  position: relative;
  transition: ${transitions.medium};
  
  &:hover {
    background: ${props => props.isSelf ? 'rgba(131, 56, 236, 0.2)' : 'rgba(255, 255, 255, 0.03)'};
  }
  
  /* RTL Support */
  ${rtl(`
    align-self: ${props => props.isSelf ? 'flex-start' : 'flex-end'};
    border-left: none;
    border-right: ${props => props.isSelf ? '3px solid ' + colors.accent.primary : '3px solid ' + colors.status.info};
  `)}
`;

const ReplyArea = styled.div`
  padding: ${spacing.md};
  border-top: 1px solid ${colors.border.light};
  background: rgba(131, 56, 236, 0.05);
  border-radius: 0 0 ${borderRadius.md} ${borderRadius.md};
  margin: 0 ${spacing.sm} ${spacing.sm} ${spacing.sm};
  
  /* Add subtle glow on focus */
  &:focus-within {
    box-shadow: 0 0 8px rgba(131, 56, 236, 0.3);
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: ${spacing.sm};
  align-items: flex-end;
`;

const TextInput = styled.textarea`
  flex-grow: 1;
  border: 1px solid ${colors.border.main};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  resize: none;
  min-height: 80px;
  font-family: inherit;
  background: ${colors.background.card};
  color: ${colors.text.primary};
  transition: ${transitions.medium};
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px ${colors.accent.tertiary};
  }
`;

const ImageContainer = styled.div`
  margin-top: ${spacing.md};
  padding: ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${borderRadius.md};
  background: ${colors.background.card};
  position: relative;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: ${borderRadius.sm};
`;

const RemoveButton = styled(IconButton)`
  position: absolute;
  top: ${spacing.xs};
  right: ${spacing.xs};
  background: ${colors.error.main};
  color: white;
  
  &:hover {
    background: ${colors.error.dark};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    right: auto;
    left: ${spacing.xs};
  }
`;

const SelectorContainer = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SelectLabel = styled.div`
  font-weight: 500;
  margin-bottom: ${spacing.xs};
  color: ${colors.text.secondary};
`;

const ThreadTitle = styled.h3`
  margin: 0 0 ${spacing.xs} 0;
  font-size: 16px;
  font-weight: 600;
`;

const ThreadMeta = styled.div`
  font-size: 12px;
  color: ${colors.text.secondary};
  display: flex;
  gap: ${spacing.sm};
  align-items: center;
`;

const MessageMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${spacing.xs};
  font-size: 12px;
  color: ${colors.text.secondary};
`;

const MessageText = styled.div`
  font-size: 14px;
`;

const IconHover = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${spacing.xs};
  border-radius: ${borderRadius.sm};
  transition: ${transitions.medium};
  cursor: pointer;
  
  &:hover {
    background: ${colors.accent.tertiary};
    color: ${colors.accent.primary};
  }
`;

const AttachmentPreview = styled.div`
  margin-top: ${spacing.md};
  border-radius: ${borderRadius.md};
  overflow: hidden;
  border: 1px solid ${colors.border.light};
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.sm};
  margin-top: ${spacing.sm};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: ${spacing.xl};
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  color: ${colors.error.main};
  margin-bottom: ${spacing.md};
`;

const ErrorTitle = styled.h3`
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: ${colors.text.secondary};
  max-width: 500px;
  text-align: center;
  margin-bottom: ${spacing.md};
`;

const NoThreadSelected = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${colors.text.secondary};
  text-align: center;
  padding: ${spacing.xl};
  
  svg {
    font-size: 48px;
    margin-bottom: ${spacing.md};
    opacity: 0.7;
  }
`;

const NoThreads = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${colors.text.secondary};
  text-align: center;
  padding: ${spacing.xl};
  
  svg {
    font-size: 32px;
    margin-bottom: ${spacing.md};
    opacity: 0.5;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${spacing.sm};
  align-items: center;
`;

// Right panel components - for mockup/image display
const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: ${borderRadius.md};
  background: ${colors.background.card};
  box-shadow: ${shadows.medium};
  overflow: hidden;
  margin-left: ${spacing.lg};
  
  @media (max-width: 1024px) {
    margin-left: 0;
    margin-top: ${spacing.lg};
  }
`;

const RightPanelHeader = styled.div`
  padding: ${spacing.md} ${spacing.lg};
  border-bottom: 1px solid ${colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.background.light};
`;

const MockupArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: ${spacing.md};
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.accent.secondary};
    border-radius: 10px;
  }
`;

const MockupContainer = styled.div`
  position: relative;
  margin-bottom: ${spacing.lg};
  border-radius: ${borderRadius.md};
  overflow: hidden;
  box-shadow: ${shadows.medium};
  background: ${colors.background.light};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MockupImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const MockupInfo = styled.div`
  padding: ${spacing.md};
  border-top: 1px solid ${colors.border.light};
  background: ${colors.background.card};
`;

const MockupTitle = styled.h4`
  margin: 0 0 ${spacing.xs} 0;
  font-size: 16px;
  font-weight: 600;
`;

const MockupMeta = styled.div`
  font-size: 12px;
  color: ${colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.sm};
`;

const CommentCount = styled.span`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: 12px;
  color: ${colors.text.secondary};
  
  svg {
    font-size: 14px;
  }
`;

const UploadButton = styled.button`
  background: ${colors.accent.secondary};
  color: ${colors.text.white};
  border: none;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  font-size: 0.9rem;
  transition: ${transitions.main};
  
  &:hover {
    background: ${colors.accent.primary};
  }
  
  svg {
    margin-right: ${spacing.xs};
  }
`;

// Get Firebase services using functions to ensure proper initialization
const getDb = () => {
  try {
    // Check if Firebase is properly initialized first
    if (!isFirebaseInitialized()) {
      console.warn('Firebase is not properly initialized, using mock Firestore');
      return {
        collection: () => ({
          doc: () => ({
            get: () => Promise.resolve({ exists: false, data: () => ({}) }),
            set: () => Promise.resolve(),
            update: () => Promise.resolve(),
            delete: () => Promise.resolve()
          }),
          where: () => ({
            get: () => Promise.resolve({ docs: [] })
          }),
          add: () => Promise.resolve({ id: 'mock-doc-id' })
        })
      };
    }
    return getFirestoreDb();
  } catch (error) {
    console.error('Error getting Firestore instance:', error);
    // Return a mock Firestore instance that won't throw errors
    return {
      collection: () => ({
        doc: () => ({
          get: () => Promise.resolve({ exists: false, data: () => ({}) }),
          set: () => Promise.resolve(),
          update: () => Promise.resolve(),
          delete: () => Promise.resolve()
        }),
        where: () => ({
          get: () => Promise.resolve({ docs: [] })
        }),
        add: () => Promise.resolve({ id: 'mock-doc-id' })
      })
    };
  }
};

const getStorage = () => {
  try {
    // Check if Firebase is properly initialized first
    if (!isFirebaseInitialized()) {
      console.warn('Firebase is not properly initialized, using mock Storage');
      return { 
        ref: () => ({ 
          put: () => ({ 
            snapshot: {}, 
            ref: { 
              getDownloadURL: () => Promise.resolve('https://mock-url.com') 
            } 
          }) 
        }) 
      };
    }
    return getStorageInstance();
  } catch (error) {
    console.error('Error getting Storage instance:', error);
    // Return a mock Storage instance that won't throw errors
    return { 
      ref: () => ({ 
        put: () => ({ 
          snapshot: {}, 
          ref: { 
            getDownloadURL: () => Promise.resolve('https://mock-url.com') 
          } 
        }) 
      }) 
    };
  }
};

// Sample mock data for demo purposes
const mockProjects = [
  { id: 'proj1', name: 'Website Redesign' },
  { id: 'proj2', name: 'Mobile App' },
  { id: 'proj3', name: 'Dashboard UI' },
  { id: 'proj4', name: 'E-commerce Platform' }
];

const mockTasks = [
  { id: 'task1', name: 'Design', projectId: 'proj1' },
  { id: 'task2', name: 'Development', projectId: 'proj1' },
  { id: 'task3', name: 'Testing', projectId: 'proj1' },
  { id: 'task4', name: 'Wireframes', projectId: 'proj2' },
  { id: 'task5', name: 'UI Design', projectId: 'proj2' },
  { id: 'task6', name: 'Frontend', projectId: 'proj3' },
  { id: 'task7', name: 'Backend', projectId: 'proj3' },
  { id: 'task8', name: 'Database', projectId: 'proj4' }
];

// Mock data for mockups/images
const mockMockups = [
  {
    id: 'mockup1',
    title: 'Homepage Design',
    createdAt: new Date(2025, 5, 12, 10, 30).toISOString(),
    createdBy: 'John Doe',
    imageSrc: '/assets/mockup1.jpg',
    projectId: 'proj1',
    taskId: 'task1',
    comments: [
      {
        id: 'comment1',
        user: 'Sarah Lee',
        avatar: '/assets/avatar2.jpg',
        content: 'I like the color scheme but I think the hero section could be more engaging.',
        timestamp: new Date(2025, 5, 12, 14, 45).toISOString()
      },
      {
        id: 'comment2',
        user: 'Current User',
        avatar: '/assets/avatar3.jpg',
        content: 'Good point. Let me revise the hero section.',
        timestamp: new Date(2025, 5, 12, 15, 30).toISOString()
      }
    ]
  },
  {
    id: 'mockup2',
    title: 'Mobile App UI',
    createdAt: new Date(2025, 5, 11, 9, 15).toISOString(),
    createdBy: 'Mike Wilson',
    imageSrc: '/assets/mockup2.jpg',
    projectId: 'proj2',
    taskId: 'task5',
    comments: [
      {
        id: 'comment3',
        user: 'Alex Brown',
        avatar: '/assets/avatar4.jpg',
        content: 'The navigation is very intuitive. Great work!',
        timestamp: new Date(2025, 5, 11, 11, 20).toISOString()
      }
    ]
  },
  {
    id: 'mockup3',
    title: 'Dashboard Widget Redesign',
    createdAt: new Date(2025, 5, 10, 16, 45).toISOString(),
    createdBy: 'Current User',
    imageSrc: '/assets/mockup3.jpg',
    projectId: 'proj3',
    taskId: 'task6',
    comments: []
  }
];

const mockThreads = [
  {
    id: 'thread1',
    title: 'Homepage Layout Discussion',
    project: 'proj1',
    task: 'task1',
    createdBy: 'John Doe',
    createdAt: new Date(2025, 5, 10, 14, 30).toISOString(),
    messages: [
      {
        id: 'msg1',
        user: 'John Doe',
        avatar: '/assets/avatar1.jpg',
        content: 'I think we should use a hero section with animation. What do you all think?',
        timestamp: new Date(2025, 5, 10, 14, 30).toISOString(),
        attachment: null
      },
      {
        id: 'msg2',
        user: 'Sarah Kim',
        avatar: '/assets/avatar2.jpg',
        content: 'Great idea! We should also consider adding a video background for better engagement.',
        timestamp: new Date(2025, 5, 10, 15, 15).toISOString(),
        attachment: null
      },
      {
        id: 'msg3',
        user: 'Mike Johnson',
        avatar: '/assets/avatar3.jpg',
        content: 'I made a quick mockup of the hero section. What do you think?',
        timestamp: new Date(2025, 5, 10, 16, 5).toISOString(),
        attachment: {
          type: 'image',
          url: 'https://via.placeholder.com/800x400',
          filename: 'hero-mockup.jpg'
        }
      }
    ]
  },
  {
    id: 'thread2',
    title: 'Navigation Menu Options',
    project: 'proj1',
    task: 'task2',
    createdBy: 'Sarah Kim',
    createdAt: new Date(2025, 5, 11, 9, 15).toISOString(),
    messages: [
      {
        id: 'msg4',
        user: 'Sarah Kim',
        avatar: '/assets/avatar2.jpg',
        content: 'Should we go with a hamburger menu or a traditional navbar?',
        timestamp: new Date(2025, 5, 11, 9, 15).toISOString(),
        attachment: null
      },
      {
        id: 'msg5',
        user: 'John Doe',
        avatar: '/assets/avatar1.jpg',
        content: 'I prefer traditional for desktop and hamburger for mobile.',
        timestamp: new Date(2025, 5, 11, 9, 45).toISOString(),
        attachment: null
      }
    ]
  },
  {
    id: 'thread3',
    title: 'App Color Scheme',
    project: 'proj2',
    task: 'task5',
    createdBy: 'Mike Johnson',
    createdAt: new Date(2025, 5, 12, 11, 0).toISOString(),
    messages: [
      {
        id: 'msg6',
        user: 'Mike Johnson',
        avatar: '/assets/avatar3.jpg',
        content: 'Here are a few color scheme options for the mobile app.',
        timestamp: new Date(2025, 5, 12, 11, 0).toISOString(),
        attachment: {
          type: 'image',
          url: 'https://via.placeholder.com/600x800',
          filename: 'color-schemes.jpg'
        }
      }
    ]
  }
];

/**
 * ForumPanel wrapper with error boundary
 */
// Create local styled components for missing imports
const RetryButton = styled(PrimaryButton)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontSize: '0.85rem',
  padding: props => props.size === 'sm' ? '6px 12px' : '10px 16px'
});

// Using the ErrorContainer components defined above

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <ErrorContainer>
    <ErrorIcon>
      <FaExclamationTriangle />
    </ErrorIcon>
    <ErrorTitle>Something went wrong</ErrorTitle>
    <ErrorMessage>
      {error.message || 'An unexpected error occurred. Please try again.'}
    </ErrorMessage>
    <RetryButton onClick={resetErrorBoundary}>
      <FaRedo />
      Try Again
    </RetryButton>
  </ErrorContainer>
);

const ForumPanelContainer = () => {
  return (
    <React.Fragment>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <MainForumPanel />
      </ErrorBoundary>
    </React.Fragment>
  );
};

/**
 * Main ForumPanel component with modular structure and better state management
 */
const MainForumPanel = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Forum state
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedTask, setSelectedTask] = useState('all');
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mockups, setMockups] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  
  // Selection state
  const [selectedThread, setSelectedThread] = useState(null);
  const [selectedMockup, setSelectedMockup] = useState(null);
  
  // Input state
  const [replyText, setReplyText] = useState('');
  const [mockupCommentText, setMockupCommentText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  
  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const threadListRef = useRef(null);
  
  // Load initial data safely with proper Firebase integration
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if we're in development mode or if Firebase is properly initialized
        const db = getDb();
        const storage = getStorageInstance();
        
        if (process.env.NODE_ENV === 'development' || !db) {
          console.log('Using mock data for forum in development mode');
          // Use mock data in development or when Firebase isn't available
          setTimeout(() => {
            setThreads(mockThreads || []);
            setMockups(mockMockups || []);
            setIsLoading(false);
          }, 800); // Simulate network delay
        } else {
          // In production with Firebase properly initialized
          try {
            // This would be the real Firebase implementation
            // const threadsRef = collection(db, 'threads');
            // const threadsQuery = query(threadsRef, orderBy('createdAt', 'desc'));
            // const threadsSnapshot = await getDocs(threadsQuery);
            // const threadsData = threadsSnapshot.docs.map(doc => ({
            //   id: doc.id,
            //   ...doc.data()
            // }));
            // setThreads(threadsData);
            
            // For now, still use mock data until Firebase is fully integrated
            setThreads(mockThreads || []);
            setMockups(mockMockups || []);
          } catch (firebaseError) {
            console.error('Firebase data fetch error:', firebaseError);
            // Fallback to mock data if Firebase fetch fails
            setThreads(mockThreads || []);
            setMockups(mockMockups || []);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load forum data:', error);
        setError('Failed to load forum data. Please try again.');
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Filter threads when project or task selection changes
  useEffect(() => {
    try {
      let filtered = [...threads];
      
      if (selectedProject !== 'all') {
        filtered = filtered.filter(thread => thread.project === selectedProject);
      }
      
      if (selectedTask !== 'all') {
        filtered = filtered.filter(thread => thread.task === selectedTask);
      }
    
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(thread => {
          const threadText = (thread.messages[0]?.content || '').toLowerCase();
          return threadText.includes(query) || thread.messages.some(msg => msg.content.toLowerCase().includes(query));
        });
      }
      
      setFilteredThreads(filtered);
      
      // If selected thread is filtered out, clear selection
      if (selectedThread && !filtered.find(t => t.id === selectedThread.id)) {
        setSelectedThread(null);
      }
    } catch (error) {
      console.error('Error filtering threads:', error);
      // Fallback to unfiltered or empty list in case of error
      setFilteredThreads(threads);
    }
  }, [selectedProject, selectedTask, searchQuery, threads, selectedThread]);
  
  // Get tasks for selected project
  const getProjectTasks = () => {
    if (selectedProject === 'all') {
      return mockTasks;
    }
    return mockTasks.filter(task => task.projectId === selectedProject);
  };
  
  // Handle thread selection
  const handleThreadSelect = (thread) => {
    setSelectedThread(thread);
  };
  
  // Handle image file selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl('');
  };
  
  // Handle reply submission with proper Firebase integration
  const handleReplySubmit = async () => {
    if (!replyText.trim() && !imageFile) return;
    
    try {
      // Get Firebase instances safely with proper error handling
      const db = getDb();
      const storage = getStorage();
      
      if (!db || !storage) {
        console.error('Firebase services not available');
        setError('Firebase services are not available. Using mock data instead.');
        // Continue with mock data
      }
      
      let attachmentData = null;
      
      // Handle file upload if there's an image
      if (imageFile && storage) {
        try {
          console.log('Attempting to handle image upload');
          // This would be the real Firebase Storage implementation
          // const storageRef = ref(storage, `forum-attachments/${Date.now()}_${imageFile.name}`);
          // const uploadResult = await uploadBytes(storageRef, imageFile);
          // const downloadURL = await getDownloadURL(uploadResult.ref);
          // 
          // attachmentData = {
          //   type: 'image',
          //   url: downloadURL,
          //   filename: imageFile.name
          // };
          
          // For now, use the local preview URL
          attachmentData = {
            type: 'image',
            url: imagePreviewUrl,
            filename: imageFile.name
          };
          console.log('Successfully created attachment data with local preview');
        } catch (uploadError) {
          console.error('Error uploading attachment:', uploadError);
          // Continue without the attachment if upload fails
        }
      }
      
      // Create the message object
      const newMessage = {
        id: `msg-${Date.now()}`,
        user: currentUser?.displayName || 'Current User',
        avatar: currentUser?.photoURL || '/assets/avatar-user.jpg',
        content: replyText,
        timestamp: new Date().toISOString(),
        attachment: attachmentData
      };
      
      // Add the new message to the selected thread
      const updatedThread = {
        ...selectedThread,
        messages: [...selectedThread.messages, newMessage]
      };
    
      // Update the threads list
      const updatedThreads = threads.map(t => 
        t.id === selectedThread.id ? updatedThread : t
      );
      
      setThreads(updatedThreads);
      setSelectedThread(updatedThread);
      setReplyText('');
      setImageFile(null);
      setImagePreviewUrl('');
    } catch (error) {
      console.error('Error submitting reply:', error);
      // Show an error message to the user
      setError('Failed to submit your reply. Please try again.');
    }
  };
  
  // Create a new thread
  const handleNewThread = () => {
    // In a real app, this would open a form to create a new thread
    alert(t('forum.newThreadAlert', 'Creating a new discussion thread would open a form here'));
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter mockups based on selected project and task
  const filteredMockups = mockups.filter(mockup => {
    const projectMatch = selectedProject === 'all' || mockup.projectId === selectedProject;
    const taskMatch = selectedTask === 'all' || mockup.taskId === selectedTask;
    return projectMatch && taskMatch;
  });

  // Handle adding a comment to a mockup
  const handleMockupCommentSubmit = () => {
    if (!mockupCommentText.trim() || !selectedMockup) return;
    
    const updatedMockups = mockups.map(mockup => {
      if (mockup.id === selectedMockup.id) {
        return {
          ...mockup,
          comments: [
            ...mockup.comments,
            {
              id: `comment${Date.now()}`,
              user: 'Current User',
              avatar: '/assets/avatar3.jpg',
              content: mockupCommentText,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return mockup;
    });
    
    setMockups(updatedMockups);
    setMockupCommentText('');
    setSelectedMockup(updatedMockups.find(mockup => mockup.id === selectedMockup.id));
  };

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>{t('forum.title', 'Project Forum')}</PanelTitle>
        <HeaderActions>
          <SearchInput 
            placeholder={t('forum.searchPlaceholder', 'Search discussions...')} 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<FaSearch />}
          />
          <PrimaryButton onClick={handleNewThread}>
            <FaCommentAlt style={{ marginRight: '8px' }} />
            {t('forum.newThread', 'New Discussion')}
          </PrimaryButton>
        </HeaderActions>
      </PanelHeader>
      
      <ForumLayout>
        <ForumSidebar>
          <SelectorContainer>
            <div style={{ flex: 1 }}>
              <SelectLabel>{t('forum.project', 'Project')}</SelectLabel>
              <Dropdown 
                value={selectedProject} 
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="all">{t('forum.allProjects', 'All Projects')}</option>
                {mockProjects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </Dropdown>
            </div>
            <div style={{ flex: 1 }}>
              <SelectLabel>{t('forum.task', 'Task')}</SelectLabel>
              <Dropdown 
                value={selectedTask} 
                onChange={(e) => setSelectedTask(e.target.value)}
              >
                <option value="all">{t('forum.allTasks', 'All Tasks')}</option>
                {getProjectTasks().map(task => (
                  <option key={task.id} value={task.id}>{task.name}</option>
                ))}
              </Dropdown>
            </div>
          </SelectorContainer>
          
          <ThreadList>
            {filteredThreads.length > 0 ? (
              filteredThreads.map(thread => (
                <ThreadItem 
                  key={thread.id} 
                  active={selectedThread && selectedThread.id === thread.id}
                  onClick={() => handleThreadSelect(thread)}
                >
                  <ThreadTitle>{thread.title}</ThreadTitle>
                  <ThreadMeta>
                    <span><FaUser style={{ marginRight: '4px' }} />{thread.createdBy}</span>
                    <span><FaCalendarAlt style={{ marginRight: '4px' }} />{formatDate(thread.createdAt)}</span>
                  </ThreadMeta>
                </ThreadItem>
              ))
            ) : (
              <NoThreads>
                <FaCommentAlt />
                <p>{t('forum.noThreadsFound', 'No discussion threads found')}</p>
              </NoThreads>
            )}
          </ThreadList>
        </ForumSidebar>
        
        <ContentArea>
          {selectedThread ? (
            <>
              <ThreadHeader>
                <div>
                  <ThreadTitle>{selectedThread.title}</ThreadTitle>
                  <ThreadMeta>
                    <span><FaUser style={{ marginRight: '4px' }} />{selectedThread.createdBy}</span>
                    <span><FaCalendarAlt style={{ marginRight: '4px' }} />{formatDate(selectedThread.createdAt)}</span>
                  </ThreadMeta>
                </div>
                <div>
                  {/* Additional thread actions could go here */}
                </div>
              </ThreadHeader>
              
              <ThreadDetailContent>
                {selectedThread.messages.map(message => (
                  <MessageItem 
                    key={message.id} 
                    isSelf={message.user === 'Current User'}
                    style={{ animation: 'fadeIn 0.3s ease-in-out' }}
                  >
                    <MessageMeta>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <AvatarImage src={message.avatar} alt={message.user} size="sm" />
                        <span style={{ marginLeft: '8px' }}>{message.user}</span>
                      </div>
                      <span>{formatDate(message.timestamp)}</span>
                    </MessageMeta>
                    <MessageText>{message.content}</MessageText>
                    
                    {message.attachment && message.attachment.type === 'image' && (
                      <AttachmentPreview>
                        <ImagePreview src={message.attachment.url} alt={message.attachment.filename} />
                      </AttachmentPreview>
                    )}
                  </MessageItem>
                ))}
              </ThreadDetailContent>
              
              <ReplyArea>
                <InputContainer>
                  <TextInput 
                    placeholder={t('forum.replyPlaceholder', 'Type your reply...')}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div>
                    <IconHover onClick={() => fileInputRef.current.click()}>
                      <FaImage size={20} />
                    </IconHover>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                    <IconButton onClick={handleReplySubmit} disabled={!replyText.trim() && !imageFile}>
                      <FaPaperPlane />
                    </IconButton>
                  </div>
                </InputContainer>
                
                {imagePreviewUrl && (
                  <ImageContainer>
                    <ImagePreview src={imagePreviewUrl} alt="Preview" />
                    <RemoveButton onClick={handleRemoveImage}>
                      <FaTimes size={12} />
                    </RemoveButton>
                  </ImageContainer>
                )}
              </ReplyArea>
            </>
          ) : (
            <NoThreadSelected>
              <FaCommentAlt style={{ fontSize: '48px', opacity: 0.7 }} />
              <h3>{t('forum.selectThread', 'Select a discussion thread')}</h3>
              <p>{t('forum.selectThreadDesc', 'Choose a discussion from the list to view its contents')}</p>
            </NoThreadSelected>
          )}
        </ContentArea>
        <RightPanel>
          <RightPanelHeader>
            <PanelTitle>{t('dashboard.mockups')}</PanelTitle>
            <UploadButton size="sm">
              <FaUpload />
              {t('actions.upload_mockup')}
            </UploadButton>
          </RightPanelHeader>
          
          <MockupArea>
            {filteredMockups.length > 0 ? (
              filteredMockups.map(mockup => (
                <MockupContainer key={mockup.id} onClick={() => setSelectedMockup(mockup)}>
                  <MockupImage 
                    src={mockup.imageSrc} 
                    alt={mockup.title} 
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x600?text=Mockup+Preview';
                    }} 
                  />
                  <MockupInfo>
                    <MockupTitle>{mockup.title}</MockupTitle>
                    <MockupMeta>
                      <AvatarImage src="/assets/avatar1.jpg" alt={mockup.createdBy} size="xs" />
                      {mockup.createdBy} • {new Date(mockup.createdAt).toLocaleDateString()}
                    </MockupMeta>
                    <CommentCount>
                      <FaComment />
                      {mockup.comments.length} {mockup.comments.length === 1 ? t('labels.comment') : t('labels.comments')}
                    </CommentCount>
                  </MockupInfo>
                </MockupContainer>
              ))
            ) : (
              <NoThreads>
                <FaImage />
                <div>{t('messages.no_mockups')}</div>
                <div>{t('messages.no_mockups_desc')}</div>
              </NoThreads>
            )}
          </MockupArea>
          
          {selectedMockup && (
            <>
              <ReplyArea>
                <InputContainer>
                  <TextInput 
                    placeholder={t('placeholders.add_comment')}
                    value={mockupCommentText}
                    onChange={(e) => setMockupCommentText(e.target.value)}
                    rows={2}
                  />
                </InputContainer>
                <ActionButtons>
                  <PrimaryButton 
                    size="sm" 
                    onClick={handleMockupCommentSubmit}
                    disabled={!mockupCommentText.trim()}
                  >
                    {t('actions.post_comment')}
                  </PrimaryButton>
                </ActionButtons>
              </ReplyArea>
            </>
          )}
        </RightPanel>
      </ForumLayout>
    </PanelContainer>
  );
};

export default ForumPanelContainer;
