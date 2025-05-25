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
import {
  KanbanBoard,
  KanbanColumn,
  ColumnHeader,
  ColumnTitle,
  TaskCount,
  ColumnContent,
  TaskCard,
  TaskCardHeader,
  TaskTitle,
  PriorityBadge,
  TaskDescription,
  TaskMeta,
  TaskMetaItem,
  EmptyColumnMessage,
  AddTaskButton
} from '../../styles/dashboardStyles';

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
          <AddTaskButton>
            <FaPlus />
            {t('dashboard.tasks.actions.addTask', 'Add Task')}
          </AddTaskButton>
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

// Custom styled components extending from centralized styles
const TasksPanelContainer = styled.div`
  padding: 1.5rem;
  border-radius: 10px;
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
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
    margin: 0;
    color: #fff;
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.8rem;
`;

export default TasksPanel;