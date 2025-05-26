import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { 
  FaThLarge, 
  FaList, 
  FaFilter, 
  FaSort, 
  FaClock, 
  FaCheck, 
  FaPencilAlt, 
  FaSmile, 
  FaMeh, 
  FaFrown, 
  FaPlus,
  FaSearch,
  FaMagic,
  FaEllipsisV,
  FaArrowRight,
  FaArrowLeft,
  FaCalendarAlt,
  FaUserAlt,
  FaTags
} from 'react-icons/fa';
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import useFirebaseListener from '../../hooks/useFirebaseListener';
import LoadingSkeleton from '../Common/LoadingSkeleton';
import Modal from '../Common/Modal';
import ProjectForm from './ProjectForm';
import { fadeIn, slideUp, pulse, slideInRight, slideInLeft, float } from '../../styles/animations';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  ActionButton,
  EmptyState,
  Card,
  FilterButton,
  IconButton,
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
  FilterTabs,
  FilterTab,
  GradientButton,
  EmptyStateIcon,
  ProjectCard,
  ProjectCardInner,
  ProjectHeader,
  ProjectName,
  StatusChip,
  Pagination,
  PaginationText,
  PaginationControls,
  PaginationButton,
  ModalFooter
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

const ProjectsPanel = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch projects from Firestore
  useFirebaseListener(() => {
    if (!currentUser) return () => {};

    setIsLoading(true);

    const projectsRef = collection(db, 'projects');
    let projectQuery = query(projectsRef, where('userId', '==', currentUser.uid));

    // Apply sorting
    if (sortBy === 'deadline') {
      projectQuery = query(projectQuery, orderBy('deadline', 'asc'));
    } else if (sortBy === 'name') {
      projectQuery = query(projectQuery, orderBy('name', 'asc'));
    } else if (sortBy === 'status') {
      projectQuery = query(projectQuery, orderBy('status', 'asc'));
    }

    const unsubscribe = onSnapshot(projectQuery, (querySnapshot) => {
      let projectsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProjects(projectsList);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching projects:', error);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [currentUser, sortBy]);
  
  // Filter and search projects
  useEffect(() => {
    let result = [...projects];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(project => project.status === filterStatus);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.name?.toLowerCase().includes(searchLower) ||
        project.client?.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredProjects(result);
    
    // Calculate total pages
    setTotalPages(Math.max(1, Math.ceil(result.length / itemsPerPage)));
    
    // Reset to first page when filters change
    if (activePage > 1) {
      setActivePage(1);
    }
  }, [projects, filterStatus, searchTerm, itemsPerPage]);

  // Get emoji for status
  const getStatusEmoji = (status) => {
    switch(status) {
      case 'inProgress': return '⏳';
      case 'done': return '✅';
      case 'awaitingFeedback': return '✍️';
      default: return '🔄';
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

  // Get mood emoji
  const getMoodEmoji = (mood) => {
    switch(mood) {
      case 'happy': return <FaSmile color="#4CAF50" />;
      case 'neutral': return <FaMeh color="#FFC107" />;
      case 'unhappy': return <FaFrown color="#F44336" />;
      default: return null;
    }
  };

  // Handle view toggle
  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Get current page items
  const getCurrentPageItems = () => {
    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  // Open modal
  const openAddProjectModal = () => {
    setIsModalOpen(true);
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };
  
  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle form submission
  const handleAddProject = async (projectData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const projectsRef = collection(db, 'projects');
      await addDoc(projectsRef, {
        ...projectData,
        userId: currentUser.uid,
        createdAt: Timestamp.now()
      });
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding project:', error);
      setError(t('projects.addError', 'Error adding project. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PanelContainer>
      <DashboardHeader>
        <HeaderContent>
          <TitleSection>
            <PanelTitle>
              {t('projects.title', 'Projects')}
            </PanelTitle>
            <Subtitle>
              {filteredProjects.length} {filteredProjects.length === 1 
                ? t('projects.project', 'Project') 
                : t('projects.projects', 'Projects')}
            </Subtitle>
          </TitleSection>
          
          <SearchContainer>
            <SearchInputWrapper>
              <SearchIcon><FaSearch /></SearchIcon>
              <StyledSearchInput 
                type="text" 
                placeholder={t('projects.searchPlaceholder', 'Search projects...')} 
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label={t('projects.searchAriaLabel', 'Search projects')}
              />
            </SearchInputWrapper>
          </SearchContainer>
        </HeaderContent>
        
        <ActionsRow>
          <FilterGroup>
            <FilterTabs>
              <FilterTab 
                active={filterStatus === 'all'} 
                onClick={() => setFilterStatus('all')}
              >
                {t('projects.filters.all', 'All')}
              </FilterTab>
              <FilterTab 
                active={filterStatus === 'inProgress'} 
                onClick={() => setFilterStatus('inProgress')}
                color={colors.status.info}
              >
                <FaClock />
                {t('projects.inProgress', 'In Progress')}
              </FilterTab>
              <FilterTab 
                active={filterStatus === 'done'} 
                onClick={() => setFilterStatus('done')}
                color={colors.status.success}
              >
                <FaCheck />
                {t('projects.done', 'Done')}
              </FilterTab>
              <FilterTab 
                active={filterStatus === 'awaitingFeedback'} 
                onClick={() => setFilterStatus('awaitingFeedback')}
                color={colors.status.warning}
              >
                <FaPencilAlt />
                {t('projects.awaitingFeedback', 'Feedback')}
              </FilterTab>
            </FilterTabs>
            
            <ViewToggleContainer>
              <ViewToggleLabel>{t('projects.layout', 'Layout')}:</ViewToggleLabel>
              <ViewToggle>
                <ToggleButton 
                  active={isGridView} 
                  onClick={() => setIsGridView(true)}
                  aria-label={t('projects.gridView', 'Grid View')}
                >
                  <FaThLarge />
                </ToggleButton>
                <ToggleButton 
                  active={!isGridView} 
                  onClick={() => setIsGridView(false)}
                  aria-label={t('projects.listView', 'List View')}
                >
                  <FaList />
                </ToggleButton>
              </ViewToggle>
            </ViewToggleContainer>
            
            <SortContainer>
              <SortIcon>
                <FaSort />
              </SortIcon>
              <Select 
                value={sortBy} 
                onChange={handleSortChange}
                aria-label={t('projects.sortBy', 'Sort By')}
              >
                <option value="deadline">{t('projects.sortOptions.deadline', 'Deadline')}</option>
                <option value="name">{t('projects.sortOptions.alphabetical', 'Alphabetical')}</option>
                <option value="status">{t('projects.sortOptions.status', 'Status')}</option>
              </Select>
            </SortContainer>
          </FilterGroup>
          
          <GradientButton onClick={openAddProjectModal}>
            <FaPlus />
            <span>{t('projects.createNew', 'Create New Project')}</span>
          </GradientButton>
        </ActionsRow>
      </DashboardHeader>
      
      {isLoading ? (
        <LoadingContainer>
          <LoadingSkeleton type="projects" count={6} />
        </LoadingContainer>
      ) : filteredProjects.length === 0 ? (
        <ProjectEmptyState>
          {searchTerm || filterStatus !== 'all' ? (
            <>
              <EmptyStateIcon><FaSearch /></EmptyStateIcon>
              <h3>{t('projects.noMatchingProjects', 'No matching projects')}</h3>
              <p>{t('projects.noMatchingMessage', 'Try adjusting your search or filters')}</p>
              <GradientButton onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}>
                <FaMagic />
                {t('projects.clearFilters', 'Clear Filters')}
              </GradientButton>
            </>
          ) : (
            <>
              <EmptyStateIcon><FaPlus /></EmptyStateIcon>
              <h3>{t('projects.noProjects', 'No projects yet')}</h3>
              <p>{t('projects.emptyStateMessage', 'Create your first project to get started')}</p>
              <GradientButton onClick={openAddProjectModal}>
                <FaPlus />
                {t('projects.createNew', 'Create New Project')}
              </GradientButton>
            </>
          )}
        </ProjectEmptyState>
      ) : (
        <>
          <ProjectsContainer isGrid={isGridView}>
            {getCurrentPageItems().map(project => (
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
                          <StatusChip status={project.status}>
                            {getStatusEmoji(project.status)} {getStatusLabel(project.status)}
                          </StatusChip>
                        </DetailContent>
                      </DetailItem>
                      {project.mood && (
                        <DetailItem>
                          <DetailIcon>
                            {getMoodEmoji(project.mood)}
                          </DetailIcon>
                          <DetailContent>
                            <DetailLabel>{t('projects.clientMood', 'Client Mood')}</DetailLabel>
                            <DetailValue>{project.mood}</DetailValue>
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
              
              <PaginationControls>
                <PaginationButton 
                  onClick={() => handlePageChange(Math.max(1, activePage - 1))}
                  disabled={activePage === 1}
                  aria-label={t('pagination.previous', 'Previous page')}
                >
                  <FaArrowLeft />
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
                  <FaArrowRight />
                </PaginationButton>
              </PaginationControls>
            </Pagination>
          )}
        </>
      )}
      
      {/* Add Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={t('projects.createNew', 'Create New Project')}
        size="lg"
        animation="zoom"
        theme="gradient"
        centered
      >
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ProjectForm 
          onSubmit={handleAddProject} 
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </PanelContainer>
  );
};

// Styled Components
const AddProjectButton = styled(ActionButton)`
  ${mixins.rtlMargin('0', spacing.md, '0', 0)};
  box-shadow: ${shadows.md};
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
  border-radius: ${borderRadius.md};
  overflow: hidden;
  background: ${colors.background.secondary};
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const ToggleButton = styled.button`
  ${mixins.flexCenter}
  background: ${props => props.active ? colors.accent.secondary : 'transparent'};
  color: ${props => props.active ? colors.text.primary : colors.text.secondary};
  border: none;
  padding: ${spacing.sm} ${spacing.md};
  cursor: pointer;
  transition: ${transitions.medium};
  font-size: ${typography.fontSizes.sm};
  
  svg {
    font-size: ${typography.fontSizes.sm};
  }
  
  &:hover {
    background: ${colors.background.hover};
    color: ${props => props.active ? colors.accent.primary : colors.text.secondary};
  }
`;

const FilterContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.md};
  padding: 0 ${spacing.sm};
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const SortContainer = styled(FilterContainer)`
  /* Additional styles specific to sort container if needed */
`;

const FilterIcon = styled.div`
  ${mixins.flexCenter}
  position: absolute;
  ${props => props.isRTL ? css`right: ${spacing.sm};` : css`left: ${spacing.sm};`}
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.accent.primary};
  background-color: rgba(123, 44, 191, 0.1);
  border-radius: ${borderRadius.round};
  width: 24px;
  height: 24px;
  z-index: 1;
  pointer-events: none;
  
  svg {
    font-size: ${typography.fontSizes.xs};
  }
`;

const SortIcon = styled(FilterIcon)`
  /* Additional styles specific to sort icon if needed */
`;

const Select = styled.select`
  background: ${colors.background.secondary};
  color: ${colors.text.primary}; /* Brighter text for better contrast */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.md} ${spacing.sm} ${spacing.xl};
  appearance: none;
  cursor: pointer;
  transition: ${transitions.medium};
  font-size: ${typography.fontSizes.sm};
  min-width: 150px;
  font-weight: ${typography.fontWeights.medium};
  
  &:focus {
    outline: none;
    border-color: rgba(205, 62, 253, 0.5);
    box-shadow: ${shadows.sm};
  }
  
  &:hover {
    border-color: rgba(205, 62, 253, 0.3);
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    padding: ${spacing.sm} ${spacing.xl} ${spacing.sm} ${spacing.md};
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

const ProjectCard = styled(Card)`
  display: flex;
  flex-direction: column;
  transition: ${transitions.medium};
  height: ${props => props.isGridView ? 'auto' : 'auto'};  
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.lg};
    border-color: rgba(205, 62, 253, 0.2);
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.lg};
    border-color: rgba(205, 62, 253, 0.2);
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

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.md};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -${spacing.sm};
    left: 0;
    width: 60px;
    height: 2px;
    background: ${colors.gradients.accent};
    border-radius: ${borderRadius.sm};
  }
`;

const ProjectName = styled.h3`
  margin: 0;
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text.primary};
  background: ${colors.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatusChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${borderRadius.round};
  font-size: ${typography.fontSizes.xs};
  font-weight: ${typography.fontWeights.medium};
  
  ${props => {
    switch(props.status) {
      case 'inProgress': return css`
        background-color: rgba(255, 193, 7, 0.15);
        color: ${colors.status.warning};
      `;
      case 'done': return css`
        background-color: rgba(76, 175, 80, 0.15);
        color: ${colors.status.success};
      `;
      case 'awaitingFeedback': return css`
        background-color: rgba(33, 150, 243, 0.15);
        color: ${colors.status.info};
      `;
      default: return css`
        background-color: rgba(158, 158, 158, 0.15);
        color: ${colors.status.neutral};
      `;
    }
  }}
`;

const ProjectCardInner = styled.div`
  padding: ${spacing.lg};
  display: flex;
  flex-direction: column;
  height: 100%;
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

const ProjectDescription = styled.p`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
  line-height: 1.5;
  margin-top: auto;
  background: linear-gradient(to bottom, rgba(26, 26, 32, 0) 0%, rgba(26, 26, 32, 0.8) 15%);
  padding-top: ${spacing.md};
  margin-bottom: 0;
`;

const LoadingContainer = styled.div`
  margin-top: ${spacing.lg};
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${spacing.xl};
  padding-top: ${spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: ${breakpoints.sm}) {
    flex-direction: column;
    gap: ${spacing.md};
  }
`;

const PaginationText = styled.div`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
`;

const PaginationControls = styled.div`
  display: flex;
  gap: ${spacing.xs};
`;

const PaginationButton = styled.button`
  ${mixins.flexCenter}
  width: 36px;
  height: 36px;
  border-radius: ${borderRadius.sm};
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: ${props => props.active ? colors.accent.secondary : colors.background.secondary};
  color: ${props => props.active ? colors.text.primary : colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: ${transitions.medium};
  
  &:hover {
    background: ${props => props.active ? colors.accent.secondary : colors.background.hover};
    transform: translateY(-2px);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.md};
`;

const DetailItem = styled.div`
  margin-bottom: ${spacing.sm};
  
  &:last-child {
    margin-bottom: 0;
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
`;

const DetailLabel = styled.span`
  color: ${colors.text.secondary}; /* Brighter text for better contrast */
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  margin-right: ${spacing.xs};
  
  /* RTL Support */
  [dir="rtl"] & {
    margin-right: 0;
    margin-left: ${spacing.xs};
  }
`;

const DetailValue = styled.span`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
  word-break: break-word;
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

const ProjectActions = styled.div`
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

const ProjectEmptyState = styled(EmptyState)`
  padding: ${spacing.xl};
  margin: ${spacing.md} 0;
  animation: ${fadeIn} 0.5s ease-out, ${slideUp} 0.5s ease-out;
  
  h3 {
    font-size: ${typography.fontSizes.xl};
    margin-bottom: ${spacing.sm};
    color: ${colors.text.primary};
  }
  
  p {
    color: ${colors.text.secondary};
    margin-bottom: ${spacing.lg};
  }
`;

const ErrorMessage = styled.div`
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

const DashboardHeader = styled.div`
  margin-bottom: ${spacing.lg};
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.md};
  
  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.md};
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${spacing.md};
`;

const ProjectsCount = styled.span`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
`;

const SearchContainer = styled.div`
  width: 300px;
  
  @media (max-width: ${breakpoints.md}) {
    width: 100%;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.text.secondary};
  
  [dir="rtl"] & {
    left: auto;
    right: ${spacing.sm};
  }
`;

const StyledSearchInput = styled.input`
  width: 100%;
  background: ${colors.background.secondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.sm} ${spacing.sm} ${spacing.xl};
  color: ${colors.text.primary};
  font-size: ${typography.fontSizes.sm};
  transition: ${transitions.medium};
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px rgba(205, 62, 253, 0.2);
  }
  
  &::placeholder {
    color: ${colors.text.muted};
  }
  
  [dir="rtl"] & {
    padding: ${spacing.sm} ${spacing.xl} ${spacing.sm} ${spacing.sm};
  }
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${spacing.md};
  
  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  flex-wrap: wrap;
  
  @media (max-width: ${breakpoints.md}) {
    width: 100%;
    justify-content: space-between;
  }
`;

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
  
  svg {
    color: ${colors.accent.primary};
    font-size: ${typography.fontSizes.sm};
  }
`;

const FilterTabs = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.md};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const FilterTab = styled.button`
  background: ${props => props.active ? colors.background.hover : 'transparent'};
  color: ${props => props.active ? colors.text.primary : colors.text.secondary};
  border: none;
  padding: ${spacing.xs} ${spacing.md};
  cursor: pointer;
  font-size: ${typography.fontSizes.sm};
  transition: ${transitions.medium};
  position: relative;
  
  &:hover {
    background: ${colors.background.hover};
  }
  
  ${props => props.active && props.color && css`
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: ${props.color};
    }
  `}
`;

const GradientButton = styled.button`
  ${mixins.flexCenter}
  background: ${colors.gradients.button};
  color: ${colors.text.primary};
  border: none;
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.lg};
  cursor: pointer;
  transition: ${transitions.medium};
  font-weight: ${typography.fontWeights.medium};
  gap: ${spacing.sm};
  box-shadow: ${shadows.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  svg {
    font-size: ${typography.fontSizes.md};
  }
`;

const EmptyStateIcon = styled.div`
  ${mixins.flexCenter}
  font-size: ${typography.fontSizes.xxl};
  color: ${colors.accent.primary};
  background: rgba(205, 62, 253, 0.1);
  width: 80px;
  height: 80px;
  border-radius: ${borderRadius.round};
  margin-bottom: ${spacing.md};
`;

const MoodContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: ${typography.fontSizes.md};
  gap: ${spacing.xs};
`;

const ActionIcon = styled.button`
  ${mixins.flexCenter}
  background: transparent;
  color: ${colors.text.secondary};
  border: none;
  width: 32px;
  height: 32px;
  border-radius: ${borderRadius.round};
  cursor: pointer;
  transition: ${transitions.medium};
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: ${colors.accent.primary};
    transform: rotate(15deg);
  }
`;

export default ProjectsPanel;
