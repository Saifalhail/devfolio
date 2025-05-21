import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaPlus, 
  FaCalendarAlt, 
  FaUserAlt, 
  FaCheck, 
  FaClock, 
  FaListUl,
  FaClipboardList
} from 'react-icons/fa';

// Mock tasks data
const MOCK_TASKS = [
  {
    id: '1',
    title: 'Design homepage mockup',
    description: 'Create wireframes and high-fidelity mockups for the landing page',
    status: 'todo',
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    assignedToName: 'You',
    isClientTask: false
  },
  {
    id: '2',
    title: 'Implement authentication system',
    description: 'Set up user registration, login, and password reset functionality',
    status: 'doing',
    priority: 'high',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    assignedToName: 'You',
    isClientTask: false
  },
  {
    id: '3',
    title: 'Create responsive navigation',
    description: 'Build a responsive navbar with mobile menu',
    status: 'done',
    priority: 'medium',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    assignedToName: 'You',
    isClientTask: false
  },
  {
    id: '4',
    title: 'Provide content for About section',
    description: 'Write bio and list of services for the About page',
    status: 'todo',
    priority: 'low',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    assignedToName: 'Client',
    isClientTask: true
  },
  {
    id: '5',
    title: 'Set up contact form',
    description: 'Create form with validation and email notification',
    status: 'doing',
    priority: 'medium',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    assignedToName: 'You',
    isClientTask: false
  }
];

const TasksPanel = () => {
  const { t } = useTranslation();
  
  // Filter tasks by status
  const todoTasks = MOCK_TASKS.filter(task => task.status === 'todo');
  const doingTasks = MOCK_TASKS.filter(task => task.status === 'doing');
  const doneTasks = MOCK_TASKS.filter(task => task.status === 'done');

  return (
    <TasksPanelContainer>
      <PanelHeader>
        <h2>
          <FaClipboardList style={{ marginRight: '0.5rem' }} />
          {t('dashboard.tasks.title', 'Tasks & Milestones')}
        </h2>
        
        <ActionButtons>
          <AddButton>
            <FaPlus />
            {t('dashboard.tasks.actions.addTask', 'Add Task')}
          </AddButton>
        </ActionButtons>
      </PanelHeader>
      
      <KanbanBoard>
        {/* Todo Column */}
        <KanbanColumn>
          <ColumnHeader>
            <ColumnTitle>
              <FaListUl />
              <h3>{t('dashboard.tasks.todo', 'To Do')}</h3>
            </ColumnTitle>
            <TaskCount>{todoTasks.length}</TaskCount>
          </ColumnHeader>
          
          <ColumnContent>
            {todoTasks.map(task => (
              <TaskCard key={task.id}>
                <TaskCardHeader>
                  <TaskTitle>{task.title}</TaskTitle>
                  <PriorityBadge priority={task.priority}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </PriorityBadge>
                </TaskCardHeader>
                <TaskDescription>{task.description}</TaskDescription>
                <TaskMeta>
                  <TaskMetaItem>
                    <FaCalendarAlt />
                    <span>{task.dueDate.toLocaleDateString()}</span>
                  </TaskMetaItem>
                  <TaskMetaItem>
                    <FaUserAlt />
                    <span>{task.assignedToName}</span>
                  </TaskMetaItem>
                </TaskMeta>
              </TaskCard>
            ))}
            
            {todoTasks.length === 0 && (
              <EmptyColumnMessage>
                {t('dashboard.tasks.emptyTodo', 'No tasks to do')}
              </EmptyColumnMessage>
            )}
          </ColumnContent>
        </KanbanColumn>
        
        {/* Doing Column */}
        <KanbanColumn>
          <ColumnHeader>
            <ColumnTitle>
              <FaClock />
              <h3>{t('dashboard.tasks.doing', 'In Progress')}</h3>
            </ColumnTitle>
            <TaskCount>{doingTasks.length}</TaskCount>
          </ColumnHeader>
          
          <ColumnContent>
            {doingTasks.map(task => (
              <TaskCard key={task.id}>
                <TaskCardHeader>
                  <TaskTitle>{task.title}</TaskTitle>
                  <PriorityBadge priority={task.priority}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </PriorityBadge>
                </TaskCardHeader>
                <TaskDescription>{task.description}</TaskDescription>
                <TaskMeta>
                  <TaskMetaItem>
                    <FaCalendarAlt />
                    <span>{task.dueDate.toLocaleDateString()}</span>
                  </TaskMetaItem>
                  <TaskMetaItem>
                    <FaUserAlt />
                    <span>{task.assignedToName}</span>
                  </TaskMetaItem>
                </TaskMeta>
              </TaskCard>
            ))}
            
            {doingTasks.length === 0 && (
              <EmptyColumnMessage>
                {t('dashboard.tasks.emptyDoing', 'No tasks in progress')}
              </EmptyColumnMessage>
            )}
          </ColumnContent>
        </KanbanColumn>
        
        {/* Done Column */}
        <KanbanColumn>
          <ColumnHeader>
            <ColumnTitle>
              <FaCheck />
              <h3>{t('dashboard.tasks.done', 'Done')}</h3>
            </ColumnTitle>
            <TaskCount>{doneTasks.length}</TaskCount>
          </ColumnHeader>
          
          <ColumnContent>
            {doneTasks.map(task => (
              <TaskCard key={task.id}>
                <TaskCardHeader>
                  <TaskTitle>{task.title}</TaskTitle>
                  <PriorityBadge priority={task.priority}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </PriorityBadge>
                </TaskCardHeader>
                <TaskDescription>{task.description}</TaskDescription>
                <TaskMeta>
                  <TaskMetaItem>
                    <FaCalendarAlt />
                    <span>{task.dueDate.toLocaleDateString()}</span>
                  </TaskMetaItem>
                  <TaskMetaItem>
                    <FaUserAlt />
                    <span>{task.assignedToName}</span>
                  </TaskMetaItem>
                </TaskMeta>
              </TaskCard>
            ))}
            
            {doneTasks.length === 0 && (
              <EmptyColumnMessage>
                {t('dashboard.tasks.emptyDone', 'No completed tasks')}
              </EmptyColumnMessage>
            )}
          </ColumnContent>
        </KanbanColumn>
      </KanbanBoard>
    </TasksPanelContainer>
  );
};

// Styled Components
const TasksPanelContainer = styled.div`
  padding: 1.5rem;
  background-color: #f7f9fc;
  border-radius: 10px;
  width: 100%;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    color: #513a52;
    margin: 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #82a1bf;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #6b8cb1;
  }
`;

const KanbanBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const KanbanColumn = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
`;

const ColumnTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #513a52;
  }
  
  svg {
    color: #82a1bf;
  }
`;

const TaskCount = styled.div`
  background: #f0f0f0;
  color: #666;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
`;

const ColumnContent = styled.div`
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TaskCard = styled.div`
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const TaskCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const TaskTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: #513a52;
  font-weight: 600;
`;

const PriorityBadge = styled.span`
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-weight: 600;
  background-color: ${props => {
    switch (props.priority) {
      case 'high':
        return 'rgba(244, 67, 54, 0.1)';
      case 'medium':
        return 'rgba(255, 152, 0, 0.1)';
      case 'low':
        return 'rgba(76, 175, 80, 0.1)';
      default:
        return 'rgba(0, 0, 0, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#666';
    }
  }};
`;

const TaskDescription = styled.p`
  margin: 0 0 0.8rem 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #888;
`;

const TaskMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  svg {
    font-size: 0.8rem;
  }
`;

const EmptyColumnMessage = styled.div`
  text-align: center;
  color: #888;
  font-size: 0.9rem;
  padding: 2rem 0;
`;

export default TasksPanel;