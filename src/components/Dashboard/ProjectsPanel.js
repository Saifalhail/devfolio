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
  FaEllipsisV
} from 'react-icons/fa';
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import useFirebaseListener from '../../hooks/useFirebaseListener';
import SkeletonLoader from '../Common/SkeletonLoader';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  ActionButton,
  EmptyState,
  Card,
  FilterButton,
  SearchInput,
  Badge,
  IconButton
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
      <PanelHeader>
        <PanelTitle>{t('projects.title', 'Projects')}</PanelTitle>
        <ControlsGroup>
          <AddProjectButton onClick={openAddProjectModal}>
            <FaPlus />
            {t('projects.addProject', 'Add Project')}
          </AddProjectButton>
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
          
          <FilterContainer>
            <FilterIcon>
              <FaFilter />
            </FilterIcon>
            <Select 
              value={filterStatus} 
              onChange={handleFilterChange}
              aria-label={t('projects.filterByStatus', 'Filter by Status')}
            >
              <option value="all">{t('projects.allStatuses', 'All Statuses')}</option>
              <option value="inProgress">{t('projects.inProgress', 'In Progress')}</option>
              <option value="done">{t('projects.done', 'Done')}</option>
              <option value="awaitingFeedback">{t('projects.awaitingFeedback', 'Awaiting Feedback')}</option>
            </Select>
          </FilterContainer>
          
          <SortContainer>
            <SortIcon>
              <FaSort />
            </SortIcon>
            <Select 
              value={sortBy} 
              onChange={handleSortChange}
              aria-label={t('projects.sortBy', 'Sort By')}
            >
              <option value="deadline">{t('projects.deadline', 'Deadline')}</option>
              <option value="name">{t('projects.name', 'Name')}</option>
              <option value="status">{t('projects.status', 'Status')}</option>
            </Select>
          </SortContainer>
        </ControlsGroup>
      </PanelHeader>
      
      {isLoading ? (
        <ProjectsContainer isGridView={isGridView} aria-hidden="true">
          {Array.from({ length: 4 }).map((_, idx) => (
            <ProjectCardSkeleton key={idx} isGridView={isGridView}>
              <SkeletonHeader>
                <SkeletonLoader width="60%" height="1.2rem" />
                <SkeletonLoader width="30%" height="1rem" />
              </SkeletonHeader>
              <SkeletonBody>
                <SkeletonLoader height="0.8rem" style={{ marginBottom: '0.5rem' }} />
                <SkeletonLoader height="0.8rem" style={{ marginBottom: '0.5rem' }} />
                <SkeletonLoader height="0.8rem" />
              </SkeletonBody>
            </ProjectCardSkeleton>
          ))}
        </ProjectsContainer>
      ) : projects.length === 0 ? (
        <ProjectEmptyState>
          <h3>{t('projects.noProjects', 'No projects found')}</h3>
          <p>{t('projects.createProject', 'Create your first project to get started')}</p>
          <ActionButton>
            <FaPlus />
            {t('projects.addProject', 'Add Project')}
          </ActionButton>
        </ProjectEmptyState>
      ) : (
        <ProjectsContainer isGridView={isGridView}>
          {projects.map(project => (
            <ProjectCard key={project.id} isGridView={isGridView}>
              <ProjectHeader>
                <ProjectTitle>{project.name}</ProjectTitle>
                <StatusChip status={project.status}>
                  {getStatusEmoji(project.status)} {getStatusLabel(project.status)}
                </StatusChip>
              </ProjectHeader>
              
              <ProjectDetails>
                <DetailItem>
                  <DetailLabel>{t('projects.client', 'Client')}:</DetailLabel>
                  <DetailValue>{project.client}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>{t('projects.deadline', 'Deadline')}:</DetailLabel>
                  <DetailValue>
                    {new Date(project.deadline?.toDate()).toLocaleDateString()}
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>{t('projects.description', 'Description')}:</DetailLabel>
                  <DetailValue>{project.description}</DetailValue>
                </DetailItem>
              </ProjectDetails>
              
              <ProjectFooter>
                <MoodMeter>
                  <MoodLabel>{t('projects.clientMood', 'Client Mood')}:</MoodLabel>
                  <MoodValue>{getMoodEmoji(project.clientMood)}</MoodValue>
                </MoodMeter>
                
                <ProjectActions>
                  <ProjectActionButton aria-label={t('projects.viewProject', 'View Project')}>
                    {t('projects.view', 'View')}
                  </ProjectActionButton>
                  <ProjectActionButton aria-label={t('projects.addNote', 'Add Note')}>
                    {t('projects.note', 'Note')}
                  </ProjectActionButton>
                </ProjectActions>
              </ProjectFooter>
            </ProjectCard>
          ))}
        </ProjectsContainer>
      )}
      
      {/* Add Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={t('projects.addProject', 'Add Project')}
        size="lg"
        animation="zoom"
        footer={
          <>
            <CancelButton onClick={closeModal} disabled={isSubmitting}>
              {t('common.cancel', 'Cancel')}
            </CancelButton>
            <SubmitButton form="add-project-form" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.creating', 'Creating...') : t('common.create', 'Create')}
            </SubmitButton>
          </>
        }
      >
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ProjectForm 
          onSubmit={handleAddProject} 
          onCancel={closeModal}
          id="add-project-form"
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
  padding: ${spacing.lg};
  transition: ${transitions.medium};
  height: ${props => props.isGridView ? 'auto' : 'auto'};
  
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
  ${mixins.flexBetween}
  margin-bottom: ${spacing.md};
  flex-wrap: wrap;
  gap: ${spacing.sm};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const ProjectTitle = styled.h3`
  margin: 0;
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${colors.text.primary};
  ${mixins.truncate}
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

const ProjectDetails = styled.div`
  flex: 1;
  margin-bottom: ${spacing.md};
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

export default ProjectsPanel;
