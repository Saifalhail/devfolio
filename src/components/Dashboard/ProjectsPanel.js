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
  FaUserAlt
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
import { db } from '../../firebase';
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

const ProjectsPanel = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  // Search functionality removed as requested
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
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
        let projectQuery = query(projectsRef, where('userId', '==', currentUser.uid));

        // Apply sorting
        if (sortBy === 'deadline') {
          projectQuery = query(projectQuery, orderBy('deadline', 'asc'));
        } else if (sortBy === 'name') {
          projectQuery = query(projectQuery, orderBy('name', 'asc'));
        } else if (sortBy === 'status') {
          projectQuery = query(projectQuery, orderBy('statusPriority', 'asc'));
        }

        unsubscribe = onSnapshot(projectQuery, (querySnapshot) => {
          let projectsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            statusPriority: getStatusPriority(doc.data().status)
          }));
          
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
  
  // Handle form submission
  const handleAddProject = useCallback(async (projectData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const projectsRef = collection(db, 'projects');
      await addDoc(projectsRef, {
        ...projectData,
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      });
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding project:', error);
      setError(t('projects.addError', 'Error adding project. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }, [currentUser]);

  // Styled component for gradient title text
const GradientTitleText = styled.span`
  ${mixins.gradientText}
  font-size: ${typography.fontSizes.xxl};
  font-weight: ${typography.fontWeights.semiBold};
  
  @media (max-width: 768px) {
    font-size: ${typography.fontSizes.xl};
  }
`;

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
          <ActionButton glow onClick={openAddProjectModal}>
            <IconContainer 
              icon={FaPlus} 
              size="1em" 
              margin={isRTL ? `0 0 0 ${spacing.xs}` : `0 ${spacing.xs} 0 0`} 
            />
            {t('projects.addProject', 'Add New Project')}
          </ActionButton>
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
        <ProjectsContainer isGridView={isGridView} aria-hidden="true">
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
              <GradientButton 
                onClick={() => setFilterStatus('all')}
                className={isRTL ? 'rtl-button' : ''}
              >
                {t('projects.clearFilters', 'Clear Filters')}
              </GradientButton>
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
          <ProjectsContainer isGrid={isGridView}>
            {currentPageItems.map(project => (
              <ProjectCard key={project.id} isGrid={isGridView}>
                <ProjectCardInner>
                  <ProjectHeader>
                    <ProjectName>{project.name}</ProjectName>
                    <ActionButtonsGroup>
                      <ActionIcon title={t('projects.editProject', 'Edit Project')}>
                        <FaPencilAlt />
                      </ActionIcon>
                      <ActionIcon title={t('projects.moreOptions', 'More Options')}>
                        <FaEllipsisV />
                      </ActionIcon>
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
                            {project.deadline ? new Date(project.deadline.toDate()).toLocaleDateString() : '—'}
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
                <PaginationButton 
                  onClick={() => handlePageChange(Math.max(1, activePage - 1))}
                  disabled={activePage === 1}
                  aria-label={t('pagination.previous', 'Previous page')}
                >
                  {isRTL ? <FaArrowRight /> : <FaArrowLeft />}
                </PaginationButton>
                
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationButton
                    key={index + 1}
                    active={activePage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    aria-label={t('pagination.page', 'Page {{number}}', { number: index + 1 })}
                  >
                    {index + 1}
                  </PaginationButton>
                ))}
                
                <PaginationButton 
                  onClick={() => handlePageChange(Math.min(totalPages, activePage + 1))}
                  disabled={activePage === totalPages}
                  aria-label={t('pagination.next', 'Next page')}
                >
                  {isRTL ? <FaArrowLeft /> : <FaArrowRight />}
                </PaginationButton>
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
    </PanelContainer>
  );
};

// Styled component for IconContainer
const StyledIconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || 'inherit'};
  font-size: ${props => props.size || '1em'};
  background: ${props => props.background || 'transparent'};
  padding: ${props => props.padding || '0'};
  margin: ${props => props.margin || '0'};
  border-radius: ${props => props.round ? '50%' : '0'};
  cursor: ${props => props.onClick && !props.disabled ? 'pointer' : 'default'};
  opacity: ${props => props.disabled ? '0.5' : '1'};
  transition: ${transitions.medium};
  
  &:hover {
    opacity: ${props => props.onClick && !props.disabled ? '0.8' : '1'};
  }
`;

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

// ActionButtonWrapper for consistent button styling
const ActionButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  
  /* RTL Support */
  ${props => props.isRTL && css`
    flex-direction: row-reverse;
  `}
  
  @media (max-width: ${breakpoints.md}) {
    width: 100%;
    justify-content: flex-end;
  }
`;

// Additional Styled Components

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  flex-grow: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.sm};
    width: 100%;
  }
`;

const AddButtonWrapper = styled.div`
  margin-left: auto;
  margin-right: ${props => props.isRTL ? 'auto' : '0'};
  
  @media (max-width: 768px) {
    margin-top: ${spacing.md};
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
`;

const ProjectCount = styled.span`
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  font-weight: 500;
  margin-left: ${spacing.xs};
  white-space: nowrap;
`;

const ViewToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const ControlsGroup = styled.div`
  ${mixins.flexBetween}
  flex-wrap: wrap;
  gap: ${spacing.md};

  @media (max-width: 768px) {
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    margin-top: ${spacing.md};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: ${spacing.sm};
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  position: relative;
  transition: ${transitions.medium};
  border: none;
  cursor: pointer;
  background: transparent;
  padding: 0;
  box-shadow: none;
  border-radius: 0;
  color: ${props => props.active ? colors.accent.primary : colors.text.secondary};
  
  /* Remove any potential background or decoration */
  &::before, &::after {
    display: none;
  }
  
  svg {
    font-size: 1.25rem;
  }
  
  &:hover {
    transform: scale(1.15);
    background: transparent;
    color: ${colors.accent.primary};
  }
  
  /* Add tooltip */
  &:after {
    content: '${props => props.tooltip || (props.active ? "Active" : "")}'; 
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: ${colors.background.dark};
    color: ${colors.text.primary};
    padding: ${spacing.xs} ${spacing.sm};
    border-radius: ${borderRadius.sm};
    font-size: ${typography.fontSizes.xs};
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    box-shadow: ${shadows.md};
    z-index: 10;
    pointer-events: none;
    display: block;
  }
  
  &:hover:after {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
`;

const FilterContainerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: transparent;
  padding: 0;
  border: none;
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const SortContainer = styled(FilterContainerWrapper)`
  /* Additional styles specific to sort container if needed */
`;

const FilterIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${colors.accent.primary};
  background: transparent;
  width: 32px;
  height: 32px;
  transition: ${transitions.medium};
  
  svg {
    font-size: 1.25rem;
  }
  
  &:hover {
    transform: scale(1.15);
  }
`;

const SortIcon = styled(FilterIcon)`
  /* Additional styles specific to sort icon if needed */
`;

const Select = styled.select`
  background: transparent;
  color: ${colors.text.primary};
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${spacing.xs} ${spacing.sm};
  appearance: none;
  cursor: pointer;
  transition: ${transitions.medium};
  font-size: ${typography.fontSizes.sm};
  min-width: 120px;
  font-weight: ${typography.fontWeights.medium};
  
  &:focus {
    outline: none;
    border-bottom-color: ${colors.accent.primary};
  }
  
  &:hover {
    border-bottom-color: ${colors.accent.primary};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    padding: ${spacing.xs} ${spacing.sm};
  }
  
  @media (max-width: 768px) {
    min-width: 120px;
  }
  
  option {
    background: ${colors.background.secondary};
    color: ${colors.text.secondary};
  }
`;

const ProjectsContainer = styled.div`
  display: ${props => props.isGridView ? 'grid' : 'flex'};
  ${props => props.isGridView 
    ? css`
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: ${spacing.lg};
      @media (max-width: 1200px) {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    ` 
    : css`
      flex-direction: column;
      gap: ${spacing.md};
    `
  }
  margin-top: ${spacing.lg};
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

const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  margin-bottom: ${spacing.md};
`;

const DetailRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.lg};
  
  @media (max-width: ${breakpoints.sm}) {
    flex-direction: column;
    gap: ${spacing.sm};
  }
`;

const LoadingContainer = styled.div`
  margin-top: ${spacing.lg};
`;

const ProjectFooter = styled.div`
  ${mixins.flexBetween}
  margin-top: auto;
  padding-top: ${spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const MoodMeter = styled.div`
  ${mixins.flexCenter}
  gap: ${spacing.xs};
`;

const MoodLabel = styled.span`
  color: ${colors.text.secondary}; /* Brighter text for better contrast */
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
`;

const MoodValue = styled.div`
  font-size: ${typography.fontSizes.md};
`;

const ActionButtonsGroup = styled.div`
  display: flex;
  gap: ${spacing.sm};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const ProjectActionButton = styled(ActionButton)`
  font-size: ${typography.fontSizes.xs};
  padding: ${spacing.xs} ${spacing.sm};
  color: ${colors.text.primary}; /* Ensure white text for better contrast */
  font-weight: ${typography.fontWeights.medium};
  background: ${colors.gradients.accent};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }
`;

const SkeletonHeader = styled(ProjectHeader)`
  align-items: center;
`;

const SkeletonBody = styled(ProjectDetails)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const EmptyStateIllustration = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${spacing.lg};
  
  svg {
    width: 120px;
    height: 120px;
  }
  
  @media (max-width: 768px) {
    svg {
      width: 100px;
      height: 100px;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
  background-color: ${colors.background.card};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.sm};
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

const ErrorMessageAlert = styled.div`
  background: rgba(244, 67, 54, 0.1);
  color: ${colors.status.error};
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.md};
  border-left: 4px solid ${colors.status.error};
  font-size: ${typography.fontSizes.sm};
  animation: ${fadeIn} 0.3s ease-out;
`;

const Button = styled.button`
  padding: ${spacing.md} ${spacing.lg};
  border-radius: ${borderRadius.md};
  font-weight: ${typography.fontWeights.medium};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: ${transitions.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SubmitButton = styled(Button)`
  background: ${colors.gradients.button};
  color: ${colors.text.primary};
  border: none;
  box-shadow: ${shadows.sm};
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
  }
`;

const CancelButton = styled(Button)`
  background: transparent;
  color: ${colors.text.secondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.05);
    color: ${colors.text.primary};
  }
`;


const ActionIconButton = styled.button`
  ${mixins.flexCenter}
  background: transparent;
  color: ${colors.text.secondary};
  border: none;
  width: 32px;
  height: 32px;
  border-radius: ${borderRadius.round};
  cursor: pointer;
  transition: ${transitions.medium};
  
  svg {
    font-size: 1.25rem;
  }
  
  &:hover {
    background: transparent;
    color: ${colors.accent.primary};
    transform: scale(1.15);
  }
`;

// Custom filter tabs container - completely clean implementation
const CustomFilterTabs = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  margin-right: ${spacing.lg};
  
  /* RTL Support */
  [dir="rtl"] & {
    margin-right: 0;
    margin-left: ${spacing.lg};
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-left: 0;
    margin-bottom: ${spacing.md};
    width: 100%;
    justify-content: space-around;
  }
`;

// Status filter tab with tooltip - completely clean implementation
const StatusFilterTab = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  position: relative;
  transition: ${transitions.medium};
  border: none;
  cursor: pointer;
  background: transparent;
  padding: 0;
  box-shadow: none;
  border-radius: 0;
  
  /* Remove any potential background or decoration */
  &::before, &::after {
    display: none;
  }
  
  color: ${props => {
    if (props.active) {
      switch(props.status) {
        case 'inProgress': return '#4a6cf7'; // blue for in-progress
        case 'done': return '#27ae60'; // green for done
        case 'awaitingFeedback': return '#e74c3c'; // red for feedback
        default: return '#666'; // gray for neutral
      }
    } else {
      return colors.text.secondary;
    }
  }};
  
  svg {
    font-size: 1.25rem;
  }
  
  &:hover {
    transform: scale(1.15);
    background: transparent;
    color: ${props => {
      switch(props.status) {
        case 'inProgress': return '#4a6cf7';
        case 'done': return '#27ae60';
        case 'awaitingFeedback': return '#e74c3c';
        default: return colors.accent.primary;
      }
    }};
  }
  
  /* Tooltip implementation */
  &:after {
    content: '${props => props.tooltip}';
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: ${colors.background.dark};
    color: ${colors.text.primary};
    padding: ${spacing.xs} ${spacing.sm};
    border-radius: ${borderRadius.sm};
    font-size: ${typography.fontSizes.xs};
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    box-shadow: ${shadows.md};
    z-index: 10;
    pointer-events: none;
    display: block;
  }
  
  &:hover:after {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
`;

// Helper function to get status background colors
const getStatusBackground = (status) => {
  switch(status) {
    case 'inProgress': return 'linear-gradient(90deg, #82a1bf, #5a8bbf)';
    case 'done': return 'linear-gradient(90deg, #4CAF50, #2E7D32)';
    case 'awaitingFeedback': return 'linear-gradient(90deg, #faaa93, #e57373)';
    default: return 'linear-gradient(90deg, #9E9E9E, #616161)';
  }
};

// Status indicator with tooltip
const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  position: relative;
  transition: ${transitions.medium};
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  color: ${props => {
    switch(props.status) {
      case 'inProgress': return '#4a6cf7'; // blue for in-progress
      case 'done': return '#27ae60'; // green for done
      case 'awaitingFeedback': return '#e74c3c'; // red for feedback
      case 'edit': return '#FFC107'; // yellow for edit
      case 'delete': return '#e74c3c'; // red for delete
      case 'view': return '#4a6cf7'; // blue for view
      default: return '#666'; // gray for neutral
    }
  }};

  svg {
    font-size: 1.25rem;
  }

  &:hover {
    transform: scale(1.15);
  }

  span {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const StatusTooltip = styled.span`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: ${colors.background.dark};
  color: ${colors.text.primary};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.xs};
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  box-shadow: ${shadows.md};
  z-index: 10;
  pointer-events: none;
  
  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${colors.background.dark} transparent transparent transparent;
  }
`;

// Using LoadingSkeleton from Common directory

export default React.memo(ProjectsPanel);
