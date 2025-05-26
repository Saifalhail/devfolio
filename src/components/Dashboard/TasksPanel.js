import React from 'react';
import styled, { css } from 'styled-components';
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
  PanelContainer, 
  PanelHeader, 
  PanelTitle,
  ActionButton,
  EmptyState,
  Card,
  StatusBadge
} from '../../styles/GlobalComponents';
import { colors, spacing, borderRadius, shadows, mixins, transitions, typography } from '../../styles/GlobalTheme';
import useTasks from '../../hooks/useTasks';

const TasksPanel = () => {
  const { t } = useTranslation();
  const tasks = useTasks();

  const parseDate = (d) => {
    if (!d) return null;
    if (typeof d.toDate === 'function') return d.toDate();
    return new Date(d);
  };

  // Filter tasks by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const doingTasks = tasks.filter(task => task.status === 'doing');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>
          <FaClipboardList style={{ marginRight: spacing.sm }} />
          {t('dashboard.tasks.title', 'Tasks & Milestones')}
        </PanelTitle>
        
        <ActionButtonWrapper>
          <ActionButton>
            <FaPlus />
            {t('dashboard.tasks.actions.addTask', 'Add Task')}
          </ActionButton>
        </ActionButtonWrapper>
      </PanelHeader>
      
      <KanbanBoard>
        {/* Todo Column */}
        <KanbanColumn>
          <ColumnHeader>
            <ColumnTitle>
              <FaListUl />
              <h3>{t('dashboard.tasks.todo', 'To Do')}</h3>
            </ColumnTitle>
            <TaskCount status="neutral">{todoTasks.length}</TaskCount>
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
                    <span>{parseDate(task.dueDate)?.toLocaleDateString()}</span>
                  </TaskMetaItem>
                  <TaskMetaItem>
                    <FaUserAlt />
                    <span>{task.assignedToName}</span>
                  </TaskMetaItem>
                </TaskMeta>
              </TaskCard>
            ))}
            
            {todoTasks.length === 0 && (
              <EmptyColumnState>
                {t('dashboard.tasks.emptyTodo', 'No tasks to do')}
              </EmptyColumnState>
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
            <TaskCount status="info">{doingTasks.length}</TaskCount>
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
                    <span>{parseDate(task.dueDate)?.toLocaleDateString()}</span>
                  </TaskMetaItem>
                  <TaskMetaItem>
                    <FaUserAlt />
                    <span>{task.assignedToName}</span>
                  </TaskMetaItem>
                </TaskMeta>
              </TaskCard>
            ))}
            
            {doingTasks.length === 0 && (
              <EmptyColumnState>
                {t('dashboard.tasks.emptyDoing', 'No tasks in progress')}
              </EmptyColumnState>
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
            <TaskCount status="success">{doneTasks.length}</TaskCount>
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
                    <span>{parseDate(task.dueDate)?.toLocaleDateString()}</span>
                  </TaskMetaItem>
                  <TaskMetaItem>
                    <FaUserAlt />
                    <span>{task.assignedToName}</span>
                  </TaskMetaItem>
                </TaskMeta>
              </TaskCard>
            ))}
            
            {doneTasks.length === 0 && (
              <EmptyColumnState>
                {t('dashboard.tasks.emptyDone', 'No completed tasks')}
              </EmptyColumnState>
            )}
          </ColumnContent>
        </KanbanColumn>
      </KanbanBoard>
    </PanelContainer>
  );
};

// Custom styled components extending from centralized styles
const ActionButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.md};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

// Kanban Board Components
const KanbanBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.lg};
  margin-top: ${spacing.lg};
  width: 100%;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: ${spacing.md};
  }
`;

const KanbanColumn = styled(Card)`
  display: flex;
  flex-direction: column;
  min-height: 300px;
  max-height: 600px;
  overflow-y: hidden;
  padding: 0;
  
  &:hover {
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }
  }
`;

const ColumnHeader = styled.div`
  ${mixins.flexBetween}
  padding: ${spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  background: ${colors.background.card};
  z-index: 10;
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const ColumnTitle = styled.div`
  ${mixins.flexCenter}
  gap: ${spacing.sm};
  
  h3 {
    margin: 0;
    font-size: ${typography.fontSizes.lg};
    font-weight: ${typography.fontWeights.medium};
    color: ${colors.text.primary};
  }
  
  svg {
    color: ${colors.accent.primary};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const TaskCount = styled(StatusBadge)`
  font-size: ${typography.fontSizes.sm};
`;

const ColumnContent = styled.div`
  padding: ${spacing.md};
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  overflow-y: auto;
`;

const TaskCard = styled(Card)`
  padding: ${spacing.md};
  cursor: pointer;
  transition: ${transitions.medium};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.md};
    border-color: rgba(205, 62, 253, 0.3);
  }
`;

const TaskCardHeader = styled.div`
  ${mixins.flexBetween}
  margin-bottom: ${spacing.sm};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const TaskTitle = styled.h4`
  margin: 0;
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.text.primary};
  ${mixins.truncate}
`;

// Custom priority badge that maps priority levels to status colors
const PriorityBadge = styled.span`
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.xs};
  font-weight: ${typography.fontWeights.medium};
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  ${props => {
    const getStatusType = () => {
      switch (props.priority) {
        case 'high': return 'error';
        case 'medium': return 'warning';
        case 'low': return 'info';
        default: return 'neutral';
      }
    };
    return css`
      ${mixins.statusBadge(getStatusType())}
    `;
  }}
`;

const TaskDescription = styled.p`
  margin: ${spacing.sm} 0;
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: ${typography.lineHeights.normal};
`;

const TaskMeta = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-top: ${spacing.sm};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const TaskMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: ${typography.fontSizes.xs};
  color: ${colors.text.muted};
  
  svg {
    font-size: ${typography.fontSizes.sm};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const EmptyColumnState = styled(EmptyState)`
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.muted};
  padding: ${spacing.md};
  min-height: 150px;
  display: flex;
  gap: ${spacing.sm};
  border-radius: ${borderRadius.md};
  background: rgba(255, 255, 255, 0.02);
`;

export default TasksPanel;