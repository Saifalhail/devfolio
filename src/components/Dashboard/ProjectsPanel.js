import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { fadeIn, slideUp } from '../../styles/animations';
import { 
  FaClock, 
  FaCheck, 
  FaPencilAlt, 
  FaPlus,
  FaEllipsisV,
  FaCalendarAlt,
  FaTags,
  FaListUl,
  FaSmile,
  FaMeh,
  FaFrown,
  FaThLarge,
  FaList,
  FaFilter,
  FaSort,
  FaArrowLeft,
  FaArrowRight,
  FaUserAlt,
  FaLightbulb,
  FaChevronDown,
  FaChevronUp,
  FaCode,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaTrophy,
  FaArrowCircleRight,
  FaChevronRight
} from 'react-icons/fa';
import StarryBackground from '../Common/StarryBackground';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { firestore as db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import Modal from '../Common/Modal';
import LoadingSkeleton from '../Common/LoadingSkeleton';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  ActionButton,
  Card,
  FilterButton,
  SortButton,
  ViewToggleButton,
  ProjectsGrid,
  ProjectsList,
  ProjectCard,
  ProjectTitle,
  ProjectType,
  StatusBadge,
  ClientInfo,
  MoodIcon,
  ProjectCardFooter,
  ProjectCardHeader,
  ProjectCardContent,
  ProjectDeadline,
  ProjectActions,
  ActionIcon,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  EmptyStateButton,
  FilterContainer,
  PaginationContainer,
  PaginationButton,
  PaginationInfo,
  ErrorMessage
} from './ProjectsPanel.styles';
import {
  DashboardHeader,
  HeaderContent,
  TitleSection,
  Subtitle,
  SearchContainer,
  SearchInputWrapper,
  SearchIcon,
  StyledSearchInput,
  ActionsRow,
  FilterGroup,
  FilterLabel,
  GradientButton,
  ProjectCardInner,
  ProjectHeader,
  ProjectName,
  StatusChip,
  Pagination,
  PaginationText,
  PaginationControls,
  DetailItem,
  DetailIcon,
  DetailContent,
  DetailLabel,
  DetailValue,
  ProjectDescription
} from '../../styles/GlobalComponents';
import { 
  colors, 
  spacing, 
  borderRadius, 
  shadows, 
  mixins, 
  transitions, 
  typography,
  breakpoints 
} from '../../styles/GlobalTheme';

// Import ProjectWizard directly to fix the default export issue
import ProjectWizard from './ProjectWizard.jsx';

// Styled components moved outside to prevent dynamic creation warnings
const GradientTitleText = styled.span`
  ${mixins.gradientText}
  font-size: ${typography.fontSizes.xxl};
  font-weight: ${typography.fontWeights.semiBold};
  
  @media (max-width: 768px) {
    font-size: ${typography.fontSizes.xl};
  }
`;

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(
    135deg,
    ${colors.accent.secondary} 0%,
    ${colors.accent.primary} 100%
  );
  border-radius: ${borderRadius.md};
  color: white;
  font-size: 1.5rem;
  box-shadow: ${shadows.md};
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const ActionButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.md};
  
  @media (max-width: 768px) {
    gap: ${spacing.sm};
  }
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    gap: ${spacing.sm};
  }
`;

const AddButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;
  
  @media (max-width: 768px) {
    gap: ${spacing.sm};
  }
`;

const ProjectCount = styled.span`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.normal};
  white-space: nowrap;
`;

const ViewToggleContainer = styled.div`
  display: flex;
  gap: ${spacing.sm};
  background: rgba(74, 108, 247, 0.1);
  padding: 4px;
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(74, 108, 247, 0.2);
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  flex-wrap: wrap;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    gap: ${spacing.md};
    width: 100%;
    justify-content: space-between;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: ${spacing.xs};
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: ${borderRadius.md};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ToggleButton = styled.button`
  padding: 8px 12px;
  background: ${props => props.active ? 'rgba(74, 108, 247, 0.2)' : 'transparent'};
  color: ${props => props.active ? colors.accent.primary : colors.text.secondary};
  border: none;
  border-radius: ${borderRadius.sm};
  cursor: pointer;
  transition: ${transitions.fast};
  font-size: ${typography.fontSizes.sm};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  
  &:hover {
    background: ${props => props.active ? 'rgba(74, 108, 247, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
    color: ${props => props.active ? colors.accent.primary : colors.text.primary};
  }
  
  svg {
    font-size: 1rem;
  }
`;

const FilterContainerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    gap: ${spacing.sm};
  }
`;

const FilterIcon = styled.div`
  color: ${colors.text.secondary};
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  color: ${colors.text.primary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: ${transitions.fast};
  min-width: 120px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }
  
  option {
    background: ${colors.background.secondary};
    color: ${colors.text.primary};
  }
  
  @media (max-width: 768px) {
    min-width: 100px;
    font-size: ${typography.fontSizes.xs};
  }
`;

const ProjectsContainer = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$isGrid 
    ? 'repeat(auto-fill, minmax(320px, 1fr))' 
    : '1fr'};
  gap: ${spacing.lg};
  animation: fadeIn 0.3s ease-in-out;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${spacing.md};
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${spacing.xxl};
`;

const ProjectFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: ${spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const MoodMeter = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const MoodLabel = styled.span`
  font-size: ${typography.fontSizes.xs};
  color: ${colors.text.secondary};
`;

const MoodValue = styled.div`
  font-size: ${typography.fontSizes.lg};
`;

const ActionButtonsGroup = styled.div`
  display: flex;
  gap: ${spacing.xs};
`;

// Custom white icon button for projects page
const WhiteIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    font-size: 1rem;
    color: #ffffff;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Custom white action button for text + icon buttons
const WhiteActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.xs};
  padding: ${spacing.sm} ${spacing.md};
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${borderRadius.md};
  color: #ffffff;
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    font-size: 1rem;
    color: #ffffff;
  }
`;

// Custom white pagination button
const WhitePaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 ${spacing.sm};
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: ${borderRadius.sm};
  color: #ffffff;
  font-size: ${typography.fontSizes.sm};
  font-weight: ${props => props.active ? typography.fontWeights.medium : typography.fontWeights.normal};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s ease;
  
  &:not(:disabled):hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  svg {
    font-size: 1rem;
    color: #ffffff;
  }
`;

const EmptyStateIllustration = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto ${spacing.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
    opacity: 0.3;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing.xxl};
  
  h3 {
    color: ${colors.text.primary};
    font-size: ${typography.fontSizes.xl};
    margin-bottom: ${spacing.sm};
  }
  
  p {
    color: ${colors.text.secondary};
    font-size: ${typography.fontSizes.md};
    margin-bottom: ${spacing.xl};
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  @media (max-width: 768px) {
    padding: ${spacing.xl};
    
    h3 {
      font-size: ${typography.fontSizes.lg};
    }
    
    p {
      font-size: ${typography.fontSizes.sm};
    }
  }
`;

const ErrorMessageAlert = styled.div`
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  color: ${colors.status.error};
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.lg};
  text-align: center;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, ${colors.accent.primary}, ${colors.accent.secondary});
  color: white;
  border: none;
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: ${transitions.fast};
  display: inline-flex;
  align-items: center;
  gap: ${spacing.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: ${shadows.md};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const ActionIconButton = styled.button`
  padding: 8px;
  background: transparent;
  color: ${colors.text.secondary};
  border: none;
  border-radius: ${borderRadius.sm};
  cursor: pointer;
  transition: ${transitions.fast};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${colors.text.primary};
  }
`;

const CustomFilterTabs = styled.div`
  display: flex;
  gap: ${spacing.xs};
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: ${borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.1);
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    padding: 2px;
  }
`;

const StatusFilterTab = styled.button`
  position: relative;
  padding: 8px 16px;
  background: ${props => props.active ? 'rgba(74, 108, 247, 0.2)' : 'transparent'};
  color: ${props => {
    if (props.active) {
      if (props.status === 'inProgress') return colors.status.warning;
      if (props.status === 'done') return colors.status.success;
      return colors.accent.primary;
    }
    return colors.text.secondary;
  }};
  border: none;
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.active ? 'rgba(74, 108, 247, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
    color: ${props => {
      if (props.status === 'inProgress') return colors.status.warning;
      if (props.status === 'done') return colors.status.success;
      return props.active ? colors.accent.primary : colors.text.primary;
    }};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    font-size: 1rem;
  }
  
  /* Indicator dot for active state */
  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: ${
        props.status === 'inProgress' ? colors.status.warning :
        props.status === 'done' ? colors.status.success :
        colors.accent.primary
      };
    }
  `}
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: ${typography.fontSizes.xs};
    
    svg {
      font-size: 0.875rem;
    }
  }
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'active':
        return colors.status.success;
      case 'inProgress':
        return colors.status.warning;
      case 'done':
        return colors.status.info;
      case 'onHold':
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  }};
  display: inline-block;
  margin-left: ${spacing.xs};
  position: relative;
  
  /* Pulse animation for active projects */
  ${props => props.status === 'active' && `
    animation: pulse 2s infinite;
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
      }
      70% {
        box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
      }
    }
  `}
`;

const StatusTooltip = styled.span`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${colors.background.tertiary};
  color: ${colors.text.primary};
  padding: 4px 8px;
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.xs};
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  margin-bottom: 4px;
  
  ${StatusIndicator}:hover & {
    opacity: 1;
  }
`;

const ProjectCardSkeleton = styled(Card)`
  ${mixins.card(false)}
  padding: ${spacing.lg};
  pointer-events: none;
  
  ${props => !props.isGridView && css`
    display: flex;
    flex-direction: column;
  `}
`;

const SkeletonHeader = styled(ProjectHeader)`
  align-items: center;
`;

const SkeletonBody = styled(ProjectDetails)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const CustomEmptyState = styled(EmptyState)`
  max-width: 500px;
  margin: 3rem auto;
  text-align: center;
  
  h3 {
    margin-top: ${spacing.md};
    margin-bottom: ${spacing.sm};
    font-size: ${typography.fontSizes.xl};
    color: ${colors.text.primary};
  }
  
  p {
    margin-bottom: ${spacing.md};
    color: ${colors.text.secondary};
  }
  
  button {
    margin-top: ${spacing.md};
  }
  
  /* RTL Support */
  &.rtl-content {
    direction: rtl;
    text-align: center;
    
    h3, p {
      text-align: center;
    }
    
    button svg {
      margin-left: 0;
      margin-right: ${spacing.xs};
    }
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    margin: 2rem auto;
    padding: ${spacing.md};
    
    h3 {
      font-size: ${typography.fontSizes.lg};
    }
  }
`;

const AIInsightsButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  background: linear-gradient(135deg, ${colors.accent.primary}20, ${colors.accent.secondary}20);
  color: ${colors.accent.primary};
  border: 1px solid ${colors.accent.primary}40;
  border-radius: ${borderRadius.md};
  padding: ${spacing.xs} ${spacing.sm};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: ${spacing.sm};
  
  &:hover {
    background: linear-gradient(135deg, ${colors.accent.primary}30, ${colors.accent.secondary}30);
    transform: translateY(-1px);
    box-shadow: ${shadows.sm};
  }
  
  svg {
    font-size: 1rem;
  }
`;

const InsightsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg};
  overflow: auto;
`;

const InsightsContent = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: ${shadows.xl};
  position: relative;
`;

const InsightsHeader = styled.div`
  padding: ${spacing.lg};
  border-bottom: 1px solid ${colors.background.secondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
    color: ${colors.text.primary};
    font-size: ${typography.fontSizes.xl};
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.text.secondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${spacing.xs};
  
  &:hover {
    color: ${colors.text.primary};
  }
`;

const InsightsBody = styled.div`
  padding: ${spacing.lg};
`;

const InsightSection = styled.div`
  margin-bottom: ${spacing.lg};
  
  h3 {
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
    color: ${colors.accent.primary};
    font-size: ${typography.fontSizes.lg};
    margin-bottom: ${spacing.md};
  }
`;

const InsightCard = styled.div`
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  margin-bottom: ${spacing.sm};
`;

const TechBadge = styled.span`
  display: inline-block;
  background: ${colors.accent.primary}20;
  color: ${colors.accent.primary};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.sm};
  margin: ${spacing.xs};
`;

const FeasibilityScore = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSizes.xl};
  font-weight: bold;
  color: ${props => props.score >= 7 ? colors.success : props.score >= 5 ? colors.warning : colors.error};
`;

const NextStepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.sm};
  
  span {
    flex: 1;
  }
`;

const ProjectsPanel = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  // Search functionality removed as requested
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProjectInsights, setSelectedProjectInsights] = useState(null);
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);

  // Get status priority for sorting
  const getStatusPriority = (status) => {
    switch(status) {
      case 'inProgress': return 1;
      case 'done': return 2;
      case 'awaitingFeedback': return 3;
      default: return 4;
    }
  };

  // Using the existing error state for handling Firebase errors
  
  // Fetch projects from Firestore
  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);
    setError(null);
    let unsubscribe = null;

    const fetchProjects = async () => {
      try {
        const projectsRef = collection(db, 'projects');
        // Simple query without orderBy to avoid index requirements
        const projectQuery = query(projectsRef, where('userId', '==', currentUser.uid));

        unsubscribe = onSnapshot(projectQuery, (querySnapshot) => {
          console.log('Projects snapshot received:', querySnapshot.size, 'projects');
          let projectsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            statusPriority: getStatusPriority(doc.data().status)
          }));
          
          // Apply client-side sorting
          if (sortBy === 'deadline') {
            projectsList.sort((a, b) => {
              const dateA = a.deadline?.toDate ? new Date(a.deadline.toDate()) : new Date('9999-12-31');
              const dateB = b.deadline?.toDate ? new Date(b.deadline.toDate()) : new Date('9999-12-31');
              return dateA - dateB;
            });
          } else if (sortBy === 'name') {
            projectsList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          } else if (sortBy === 'status') {
            projectsList.sort((a, b) => a.statusPriority - b.statusPriority);
          }
          
          console.log('Projects list:', projectsList);
          setProjects(projectsList);
          setError(null); // Clear any previous errors
          setIsLoading(false);
        }, (error) => {
          console.error('Error fetching projects:', error);
          // Don't show error for empty collections
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error setting up projects listener:', error);
        setIsLoading(false);
      }
    };

    fetchProjects();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from projects listener:', error);
        }
      }
    };
  }, [currentUser, sortBy]);
  
  // Filter projects based on status only
  useEffect(() => {
    let result = [...projects];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(project => project.status === filterStatus);
    }
    
    setFilteredProjects(result);
    
    // Calculate total pages
    setTotalPages(Math.max(1, Math.ceil(result.length / itemsPerPage)));
    
    // Reset to first page when filters change
    if (activePage > 1) {
      setActivePage(1);
    }
  }, [projects, filterStatus, itemsPerPage, activePage]);
  
  // Get RTL status from i18n - removed duplicate declaration
  
  // Get icon for status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'inProgress': return <FaClock />;
      case 'done': return <FaCheck />;
      case 'awaitingFeedback': return <FaPencilAlt />;
      default: return <FaClock />;
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch(status) {
      case 'inProgress': return t('projects.inProgress', 'In Progress');
      case 'done': return t('projects.done', 'Done');
      case 'awaitingFeedback': return t('projects.awaitingFeedback', 'Awaiting Feedback');
      default: return t('projects.notStarted', 'Not Started');
    }
  };

  // Get mood emoji and translated label
  const getMoodEmoji = (mood) => {
    switch(mood) {
      case 'happy': return <FaSmile color="#4CAF50" />;
      case 'neutral': return <FaMeh color="#FFC107" />;
      case 'unhappy': return <FaFrown color="#F44336" />;
      default: return null;
    }
  };
  
  // Get mood label
  const getMoodLabel = (mood) => {
    switch(mood) {
      case 'happy': return t('projects.moods.happy', 'Happy');
      case 'neutral': return t('projects.moods.neutral', 'Neutral');
      case 'unhappy': return t('projects.moods.unhappy', 'Unhappy');
      default: return '';
    }
  };

  // Handle view toggle
  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  // Handle filter change
  const handleFilterChange = useCallback((e) => {
    setFilterStatus(e.target.value);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);
  
  // Get current page items
  const currentPageItems = useMemo(() => {
    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  }, [activePage, itemsPerPage, filteredProjects]);

  // Pagination handlers
  const handlePageChange = useCallback((pageNumber) => {
    setActivePage(pageNumber);
  }, []);

  // Open modal
  const openAddProjectModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);
  
  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
  }, []);
  
  // Open AI insights modal
  const openInsightsModal = useCallback((project) => {
    setSelectedProjectInsights(project);
    setIsInsightsModalOpen(true);
  }, []);
  
  // Close AI insights modal
  const closeInsightsModal = useCallback(() => {
    setSelectedProjectInsights(null);
    setIsInsightsModalOpen(false);
  }, []);
  
  // Handle form submission - Project is already created by ProjectWizard
  const handleAddProject = useCallback(async (projectData) => {
    console.log('Project added successfully:', projectData);
    // Just close the modal - the project is already created
    setIsModalOpen(false);
    setError(null);
  }, []);

  // Detect RTL direction
  const isRTL = i18n.language === 'ar';
  
  return (
    <PanelContainer>
      <StarryBackground intensity={0.5} />
      
      <PanelHeader>
        <PanelTitle>
          <IconContainer 
            icon={FaThLarge} 
            color="#8338ec" 
            size="1.2em" 
            margin={isRTL ? `0 0 0 ${spacing.sm}` : `0 ${spacing.sm} 0 0`} 
          />
          <GradientTitleText>
            {t('projects.yourProjects', 'Your Projects')}
          </GradientTitleText>
        </PanelTitle>
        
        <ActionButtonWrapper>
          <WhiteActionButton onClick={openAddProjectModal}>
            <FaPlus />
            {t('projects.addProject', 'Add New Project')}
          </WhiteActionButton>
        </ActionButtonWrapper>
      </PanelHeader>
      
      <ActionsRow isRTL={isRTL}>
        {isRTL ? (
            <>
              <FilterSection isRTL={isRTL}>
                <CustomFilterTabs isRTL={isRTL}>
                  <StatusFilterTab 
                    active={filterStatus === 'all'} 
                    onClick={() => setFilterStatus('all')}
                    title={t('projects.filters.all', 'All')}
                    aria-label={t('projects.filters.all', 'All')}
                  >
                    <FaListUl />
                  </StatusFilterTab>
                  <StatusFilterTab 
                    active={filterStatus === 'inProgress'} 
                    onClick={() => setFilterStatus('inProgress')}
                    status="inProgress"
                    title={t('projects.inProgress', 'In Progress')}
                    aria-label={t('projects.inProgress', 'In Progress')}
                  >
                    <FaClock />
                  </StatusFilterTab>
                  <StatusFilterTab 
                    active={filterStatus === 'done'} 
                    onClick={() => setFilterStatus('done')}
                    status="done"
                    title={t('projects.done', 'Done')}
                    aria-label={t('projects.done', 'Done')}
                  >
                    <FaCheck />
                  </StatusFilterTab>
                </CustomFilterTabs>
                <ProjectCount isRTL={isRTL}>
                  {`${filteredProjects.length} ${filteredProjects.length === 1 
                    ? t('projects.project', 'Project') 
                    : t('projects.projects', 'Projects')}`}
                </ProjectCount>
              </FilterSection>
            </>
          ) : (
            <>
              <FilterSection>
                <CustomFilterTabs>
                  <StatusFilterTab 
                    active={filterStatus === 'all'} 
                    onClick={() => setFilterStatus('all')}
                    title={t('projects.filters.all', 'All')}
                    aria-label={t('projects.filters.all', 'All')}
                  >
                    <FaListUl />
                  </StatusFilterTab>
                  <StatusFilterTab 
                    active={filterStatus === 'inProgress'} 
                    onClick={() => setFilterStatus('inProgress')}
                    status="inProgress"
                    title={t('projects.inProgress', 'In Progress')}
                    aria-label={t('projects.inProgress', 'In Progress')}
                  >
                    <FaClock />
                  </StatusFilterTab>
                  <StatusFilterTab 
                    active={filterStatus === 'done'} 
                    onClick={() => setFilterStatus('done')}
                    status="done"
                    tooltip={t('projects.done', 'Done')}
                    title={t('projects.done', 'Done')}
                    aria-label={t('projects.done', 'Done')}
                  >
                    <FaCheck />
                  </StatusFilterTab>
                </CustomFilterTabs>
                <ProjectCount>
                  {`${filteredProjects.length} ${filteredProjects.length === 1 
                    ? t('projects.project', 'Project') 
                    : t('projects.projects', 'Projects')}`}
                </ProjectCount>
              </FilterSection>

            </>
          )}
        </ActionsRow>
      
      {isLoading ? (
        <ProjectsContainer $isGrid={isGridView} aria-hidden="true">
          {Array.from({ length: 4 }).map((_, idx) => (
            <ProjectCardSkeleton key={idx} isGridView={isGridView}>
              <SkeletonHeader>
                <LoadingSkeleton width="60%" height="1.2rem" />
                <LoadingSkeleton width="30%" height="1rem" />
              </SkeletonHeader>
              <SkeletonBody>
                <LoadingSkeleton height="0.8rem" style={{ marginBottom: '0.5rem' }} />
                <LoadingSkeleton height="0.8rem" style={{ marginBottom: '0.5rem' }} />
                <LoadingSkeleton height="0.8rem" />
              </SkeletonBody>
            </ProjectCardSkeleton>
          ))}
        </ProjectsContainer>
      ) : filteredProjects.length === 0 ? (
        <CustomEmptyState className={isRTL ? 'rtl-content' : ''}>
          {filterStatus !== 'all' ? (
            <>
              <EmptyStateIllustration>
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10ZM60 100C37.9 100 20 82.1 20 60C20 37.9 37.9 20 60 20C82.1 20 100 37.9 100 60C100 82.1 82.1 100 60 100Z" fill="rgba(255,255,255,0.1)"/>
                  <path d="M65 40H55V65H65V40Z" fill="rgba(255,255,255,0.2)"/>
                  <path d="M65 75H55V85H65V75Z" fill="rgba(255,255,255,0.2)"/>
                </svg>
              </EmptyStateIllustration>
              <h3>{t('projects.noMatchingProjects', 'No matching projects')}</h3>
              <p>{t('projects.noMatchingMessage', 'Try adjusting your filters')}</p>
              <WhiteActionButton onClick={() => setFilterStatus('all')}>
                {t('projects.clearFilters', 'Clear Filters')}
              </WhiteActionButton>
            </>
          ) : (
            <>
              <EmptyStateIllustration>
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20" y="20" width="80" height="80" rx="4" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none"/>
                  <path d="M35 40H85" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
                  <path d="M35 60H85" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
                  <path d="M35 80H85" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
                </svg>
              </EmptyStateIllustration>
              <h3>{t('projects.noProjects', 'No projects yet')}</h3>
              <p>{t('projects.createNewProject', 'Create a new project using the button in the header')}</p>
            </>
          )}
        </CustomEmptyState>
      ) : (
        <>
          <ProjectsContainer $isGrid={isGridView}>
            {currentPageItems.map(project => (
              <ProjectCard key={project.id} isGrid={isGridView}>
                <ProjectCardInner>
                  <ProjectHeader>
                    <div>
                      <ProjectName>{project.name}</ProjectName>
                      <ProjectType>{project.type} • {project.industry}</ProjectType>
                    </div>
                    <ActionButtonsGroup>
                      <WhiteIconButton title={t('projects.editProject', 'Edit Project')}>
                        <FaPencilAlt />
                      </WhiteIconButton>
                      <WhiteIconButton title={t('projects.moreOptions', 'More Options')}>
                        <FaEllipsisV />
                      </WhiteIconButton>
                    </ActionButtonsGroup>
                  </ProjectHeader>
                  
                  <ProjectDetails>
                    <DetailRow>
                      <DetailItem>
                        <DetailIcon><FaUserAlt /></DetailIcon>
                        <DetailContent>
                          <DetailLabel>{t('projects.client', 'Client')}</DetailLabel>
                          <DetailValue>{project.client || '—'}</DetailValue>
                        </DetailContent>
                      </DetailItem>
                      <DetailItem>
                        <DetailIcon><FaCalendarAlt /></DetailIcon>
                        <DetailContent>
                          <DetailLabel>{t('projects.deadline', 'Deadline')}</DetailLabel>
                          <DetailValue>
                            {project.deadline && project.deadline.toDate ? new Date(project.deadline.toDate()).toLocaleDateString() : '—'}
                          </DetailValue>
                        </DetailContent>
                      </DetailItem>
                    </DetailRow>
                    
                    <DetailRow>
                      <DetailItem>
                        <DetailIcon><FaTags /></DetailIcon>
                        <DetailContent>
                          <DetailLabel>{t('projects.status', 'Status')}</DetailLabel>
                          <StatusIndicator 
                            status={project.status} 
                            title={getStatusLabel(project.status)}
                            aria-label={getStatusLabel(project.status)}
                          >
                            {getStatusIcon(project.status)}
                            <StatusTooltip>{getStatusLabel(project.status)}</StatusTooltip>
                          </StatusIndicator>
                        </DetailContent>
                      </DetailItem>
                      {project.mood && (
                        <DetailItem>
                          <DetailIcon>
                            {getMoodEmoji(project.mood)}
                          </DetailIcon>
                          <DetailContent>
                            <DetailLabel>{t('projects.clientMood', 'Client Mood')}</DetailLabel>
                            <DetailValue>{getMoodLabel(project.mood)}</DetailValue>
                          </DetailContent>
                        </DetailItem>
                      )}
                    </DetailRow>
                    
                    <ProjectDescription>
                      {project.description || t('projects.noDescription', 'No description provided.')}
                    </ProjectDescription>
                    
                    {project.aiInsights && (
                      <AIInsightsButton onClick={() => openInsightsModal(project)}>
                        <FaLightbulb />
                        {t('projects.viewAIInsights', 'View AI Insights')}
                      </AIInsightsButton>
                    )}
                  </ProjectDetails>
                </ProjectCardInner>
              </ProjectCard>
            ))}
          </ProjectsContainer>
          
          {/* Pagination */}
          {filteredProjects.length > itemsPerPage && (
            <Pagination>
              <PaginationText>
                {t('pagination.showing', 'Showing')} {(activePage - 1) * itemsPerPage + 1}-
                {Math.min(activePage * itemsPerPage, filteredProjects.length)} {t('pagination.of', 'of')} {filteredProjects.length}
              </PaginationText>
              
              <PaginationControls className={isRTL ? 'rtl-pagination' : ''}>
                <WhitePaginationButton 
                  onClick={() => handlePageChange(Math.max(1, activePage - 1))}
                  disabled={activePage === 1}
                  aria-label={t('pagination.previous', 'Previous page')}
                >
                  {isRTL ? <FaArrowRight /> : <FaArrowLeft />}
                </WhitePaginationButton>
                
                {[...Array(totalPages)].map((_, index) => (
                  <WhitePaginationButton
                    key={index + 1}
                    active={activePage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    aria-label={t('pagination.page', 'Page {{number}}', { number: index + 1 })}
                  >
                    {index + 1}
                  </WhitePaginationButton>
                ))}
                
                <WhitePaginationButton 
                  onClick={() => handlePageChange(Math.min(totalPages, activePage + 1))}
                  disabled={activePage === totalPages}
                  aria-label={t('pagination.next', 'Next page')}
                >
                  {isRTL ? <FaArrowLeft /> : <FaArrowRight />}
                </WhitePaginationButton>
              </PaginationControls>
            </Pagination>
          )}
        </>
      )}
      {/* Add Project Modal */}
      {error && isModalOpen && (
        <ErrorMessage role="alert" aria-live="assertive">{t('projects.addError', 'Error adding project. Please try again.')}</ErrorMessage>
      )}
      
      {/* Render ProjectWizard directly */}
      {isModalOpen && (
        <ProjectWizard
          isOpen={isModalOpen}
          onClose={closeModal}
          onProjectAdded={handleAddProject}
        />
      )}
      
      {/* AI Insights Modal */}
      {isInsightsModalOpen && selectedProjectInsights && (
        <InsightsModal onClick={closeInsightsModal}>
          <InsightsContent onClick={(e) => e.stopPropagation()}>
            <InsightsHeader>
              <h2>
                <FaLightbulb />
                {t('projects.aiInsights.title', 'AI Project Insights')}
              </h2>
              <CloseButton onClick={closeInsightsModal}>&times;</CloseButton>
            </InsightsHeader>
            
            <InsightsBody>
              {selectedProjectInsights.aiInsights && (
                <>
                  {/* Executive Summary */}
                  {selectedProjectInsights.aiInsights.executiveSummary && (
                    <InsightSection>
                      <h3>{t('projects.aiInsights.executiveSummary', 'Executive Summary')}</h3>
                      <InsightCard>
                        <p>{selectedProjectInsights.aiInsights.executiveSummary}</p>
                      </InsightCard>
                    </InsightSection>
                  )}
                  
                  {/* Project Feasibility */}
                  {selectedProjectInsights.aiInsights.projectFeasibility && (
                    <InsightSection>
                      <h3>
                        <FaTrophy />
                        {t('projects.aiInsights.feasibility', 'Project Feasibility')}
                      </h3>
                      <InsightCard>
                        <FeasibilityScore score={parseInt(selectedProjectInsights.aiInsights.projectFeasibility.score)}>
                          {t('projects.aiInsights.score', 'Score')}: {selectedProjectInsights.aiInsights.projectFeasibility.score}/10
                        </FeasibilityScore>
                        <p>{selectedProjectInsights.aiInsights.projectFeasibility.assessment}</p>
                        {selectedProjectInsights.aiInsights.projectFeasibility.keyConsiderations && (
                          <ul>
                            {selectedProjectInsights.aiInsights.projectFeasibility.keyConsiderations.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </InsightCard>
                    </InsightSection>
                  )}
                  
                  {/* Technical Recommendations */}
                  {selectedProjectInsights.aiInsights.technicalRecommendations && (
                    <InsightSection>
                      <h3>
                        <FaCode />
                        {t('projects.aiInsights.technicalRecommendations', 'Technical Recommendations')}
                      </h3>
                      <InsightCard>
                        {selectedProjectInsights.aiInsights.technicalRecommendations.suggestedTechStack && (
                          <div>
                            <h4>{t('projects.aiInsights.suggestedStack', 'Suggested Tech Stack')}</h4>
                            {Object.entries(selectedProjectInsights.aiInsights.technicalRecommendations.suggestedTechStack).map(([category, techs]) => (
                              <div key={category}>
                                <h5>{category.charAt(0).toUpperCase() + category.slice(1)}:</h5>
                                {techs.map((tech, index) => (
                                  <TechBadge key={index}>{tech}</TechBadge>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                        {selectedProjectInsights.aiInsights.technicalRecommendations.architecturePattern && (
                          <p><strong>{t('projects.aiInsights.architecture', 'Architecture')}:</strong> {selectedProjectInsights.aiInsights.technicalRecommendations.architecturePattern}</p>
                        )}
                      </InsightCard>
                    </InsightSection>
                  )}
                  
                  {/* Timeline & Budget */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                    {selectedProjectInsights.aiInsights.timelineEstimate && (
                      <InsightSection>
                        <h3>
                          <FaClock />
                          {t('projects.aiInsights.timeline', 'Timeline')}
                        </h3>
                        <InsightCard>
                          <p><strong>{t('projects.aiInsights.duration', 'Duration')}:</strong> {selectedProjectInsights.aiInsights.timelineEstimate.totalDuration}</p>
                        </InsightCard>
                      </InsightSection>
                    )}
                    
                    {selectedProjectInsights.aiInsights.budgetAnalysis && (
                      <InsightSection>
                        <h3>
                          <FaMoneyBillWave />
                          {t('projects.aiInsights.budget', 'Budget')}
                        </h3>
                        <InsightCard>
                          <p><strong>{t('projects.aiInsights.estimate', 'Estimate')}:</strong> {selectedProjectInsights.aiInsights.budgetAnalysis.estimatedCost}</p>
                        </InsightCard>
                      </InsightSection>
                    )}
                  </div>
                  
                  {/* Next Steps */}
                  {selectedProjectInsights.aiInsights.nextSteps && selectedProjectInsights.aiInsights.nextSteps.length > 0 && (
                    <InsightSection>
                      <h3>
                        <FaArrowCircleRight />
                        {t('projects.aiInsights.nextSteps', 'Next Steps')}
                      </h3>
                      <InsightCard>
                        {selectedProjectInsights.aiInsights.nextSteps.map((step, index) => (
                          <NextStepItem key={index}>
                            <FaChevronRight style={{ marginTop: '2px', color: colors.accent.primary }} />
                            <span>{step}</span>
                          </NextStepItem>
                        ))}
                      </InsightCard>
                    </InsightSection>
                  )}
                </>
              )}
            </InsightsBody>
          </InsightsContent>
        </InsightsModal>
      )}
    </PanelContainer>
  );
};

// Custom IconContainer component for ProjectsPanel
const IconContainer = ({ icon: Icon, color, size, background, round, padding, margin, onClick, disabled, className, ...props }) => {
  return (
    <StyledIconWrapper 
      color={color}
      size={size}
      background={background}
      round={round}
      padding={padding}
      margin={margin}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={className} 
      {...props}
    >
      <Icon />
    </StyledIconWrapper>
  );
};

// Helper function to get status background colors
const getStatusBackground = (status) => {
  switch(status) {
    case 'inProgress': return 'linear-gradient(90deg, #82a1bf, #5a8bbf)';
    case 'done': return 'linear-gradient(90deg, #4CAF50, #2E7D32)';
    case 'awaitingFeedback': return 'linear-gradient(90deg, #faaa93, #e57373)';
    default: return 'linear-gradient(90deg, #9E9E9E, #616161)';
  }
};

export default React.memo(ProjectsPanel);
