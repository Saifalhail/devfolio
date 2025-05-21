import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaThLarge, FaList, FaFilter, FaSort, FaClock, FaCheck, FaPencilAlt, FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const ProjectsPanel = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
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
        
        const querySnapshot = await getDocs(projectQuery);
        const projectsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Apply filtering (done client-side since we can't combine where clauses with different fields easily)
        const filteredProjects = filterStatus === 'all' 
          ? projectsList 
          : projectsList.filter(project => project.status === filterStatus);
        
        setProjects(filteredProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser, filterStatus, sortBy]);

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

  return (
    <ProjectsPanelContainer>
      <PanelHeader>
        <h2>{t('projects.title', 'Projects')}</h2>
        <ControlsGroup>
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
        <LoadingContainer>
          <LoadingSpinner />
          <p>{t('projects.loading', 'Loading projects...')}</p>
        </LoadingContainer>
      ) : projects.length === 0 ? (
        <EmptyState>
          <h3>{t('projects.noProjects', 'No projects found')}</h3>
          <p>{t('projects.createProject', 'Create your first project to get started')}</p>
          <AddProjectButton>
            {t('projects.addProject', 'Add Project')}
          </AddProjectButton>
        </EmptyState>
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
                  <ActionButton aria-label={t('projects.viewProject', 'View Project')}>
                    {t('projects.view', 'View')}
                  </ActionButton>
                  <ActionButton aria-label={t('projects.addNote', 'Add Note')}>
                    {t('projects.note', 'Note')}
                  </ActionButton>
                </ProjectActions>
              </ProjectFooter>
            </ProjectCard>
          ))}
        </ProjectsContainer>
      )}
    </ProjectsPanelContainer>
  );
};

// Styled Components
const ProjectsPanelContainer = styled.div`
  background: rgba(18, 20, 44, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  height: 100%;
  overflow: auto;
  border: 1px solid rgba(205, 62, 253, 0.1);
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  h2 {
    color: #fff;
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ControlsGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
    width: 100%;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? 'rgba(205, 62, 253, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#cd3efd' : '#fff'};
  border: none;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(205, 62, 253, 0.1);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0 0.5rem;
`;

const FilterIcon = styled.div`
  color: #cd3efd;
  margin-right: 0.5rem;
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0 0.5rem;
`;

const SortIcon = styled.div`
  color: #cd3efd;
  margin-right: 0.5rem;
`;

const Select = styled.select`
  background: transparent;
  color: #fff;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  appearance: none;
  
  option {
    background: #121428;
    color: #fff;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #fff;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(205, 62, 253, 0.3);
  border-top: 3px solid #cd3efd;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  color: #fff;
  
  h3 {
    margin-bottom: 0.5rem;
  }
  
  p {
    margin-bottom: 1.5rem;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const AddProjectButton = styled.button`
  background: linear-gradient(90deg, #cd3efd, #7b2cbf);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(205, 62, 253, 0.3);
  }
`;

const ProjectsContainer = styled.div`
  display: ${props => props.isGridView ? 'grid' : 'flex'};
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  flex-direction: ${props => props.isGridView ? 'row' : 'column'};
`;

const ProjectCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(205, 62, 253, 0.05);
  display: flex;
  flex-direction: column;
  height: ${props => props.isGridView ? 'auto' : 'auto'};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(205, 62, 253, 0.2);
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ProjectTitle = styled.h3`
  margin: 0;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
`;

const StatusChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch(props.status) {
      case 'inProgress': return 'rgba(255, 193, 7, 0.15)';
      case 'done': return 'rgba(76, 175, 80, 0.15)';
      case 'awaitingFeedback': return 'rgba(33, 150, 243, 0.15)';
      default: return 'rgba(158, 158, 158, 0.15)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'inProgress': return '#FFC107';
      case 'done': return '#4CAF50';
      case 'awaitingFeedback': return '#2196F3';
      default: return '#9E9E9E';
    }
  }};
`;

const ProjectDetails = styled.div`
  flex: 1;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-right: 0.5rem;
`;

const DetailValue = styled.span`
  color: #fff;
  font-size: 0.9rem;
  word-break: break-word;
`;

const ProjectFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const MoodMeter = styled.div`
  display: flex;
  align-items: center;
`;

const MoodLabel = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-right: 0.5rem;
`;

const MoodValue = styled.div`
  font-size: 1.2rem;
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(205, 62, 253, 0.2);
  }
`;

export default ProjectsPanel;
