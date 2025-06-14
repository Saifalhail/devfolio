import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaPlus, 
  FaCalendarAlt, 
  FaUserAlt, 
  FaCheck, 
  FaClock, 
  FaListUl,
  FaClipboardList,
  FaExclamationCircle,
  FaTasks,
  FaSpinner,
  FaExclamationTriangle
} from 'react-icons/fa';
import { 
  PanelContainer, 
  PanelHeader, 
  PanelTitle,
  ActionButton,
  EmptyState,
  Card,
  StatusBadge,
  IconContainer
} from '../../styles/GlobalComponents';
import StarryBackground from '../Common/StarryBackground';
import DashboardCard from '../Common/CardSystem';
import { colors, spacing, borderRadius, shadows, mixins, transitions, typography } from '../../styles/GlobalTheme';
import useTasks from '../../hooks/useTasks';
import SkeletonLoader from '../Common/SkeletonLoader';
import TaskWizard from './TaskWizard';

const TasksPanel = () => {
  const { t } = useTranslation();
  const tasks = useTasks();
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskWizard, setShowTaskWizard] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const parseDate = (d) => {
    if (!d) return null;
    if (typeof d.toDate === 'function') return d.toDate();
    return new Date(d);
  };

  // Filter tasks by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const doingTasks = tasks.filter(task => task.status === 'doing');
  const doneTasks = tasks.filter(task => task.status === 'done');

  // Function to get colored icons based on status with enhanced styling
  const getColoredStatusIcon = (status) => {
    switch(status) {
      case 'done':
        return (
          <IconContainer 
            icon={FaCheck} 
            color="white" 
            size="1.2em" 
            background="#00c27a" 
            padding="8px" 
            round={true} 
          />
        );
      case 'doing':
        return (
          <IconContainer 
            icon={FaClock} 
            color="white" 
            size="1.2em" 
            background="#ffb100" 
            padding="8px" 
            round={true} 
          />
        );
      case 'todo':
        return (
          <IconContainer 
            icon={FaListUl} 
            color="white" 
            size="1.2em" 
            background="#6a1fd0" 
            padding="8px" 
            round={true} 
          />
        );
      case 'blocked':
        return (
          <IconContainer 
            icon={FaExclamationCircle} 
            color="white" 
            size="1.2em" 
            background="#d01f48" 
            padding="8px" 
            round={true} 
          />
        );
      default:
        return (
          <IconContainer 
            icon={FaListUl} 
            color="white" 
            size="1.2em" 
            background="#6a1fd0" 
            padding="8px" 
            round={true} 
          />
        );
    }
  };

  return (
    <PanelContainer>
      <StarryBackground intensity={0.5} />
      
      <PanelHeader>
        <PanelTitle>
          <IconContainer icon={FaClipboardList} color="#8338ec" size="1.2em" margin={`0 ${spacing.sm} 0 0`} />
          {t('dashboard.tasks.title', 'Tasks & Milestones')}
        </PanelTitle>
        
        <ActionButtonWrapper>
          <ActionButton glow onClick={() => setShowTaskWizard(true)}>
            <IconContainer icon={FaPlus} size="1em" margin={`0 ${spacing.xs} 0 0`} />
            {t('dashboard.tasks.actions.addTask', 'Add Task')}
          </ActionButton>
        </ActionButtonWrapper>
      </PanelHeader>
      
      <SummaryCardsContainer>
        <DashboardCard 
          variant="summary" 
          title={t('dashboard.tasks.summary.total', 'Total Tasks')} 
          value={tasks.length} 
          icon={<IconContainer icon={FaTasks} color="white" size="1.5em" background="#6a1fd0" padding="12px" round={true} />} 
          glow
          glowColor="rgba(106, 31, 208, 0.25)"
        />
        <DashboardCard 
          variant="summary" 
          title={t('dashboard.tasks.summary.inProgress', 'In Progress')} 
          value={doingTasks.length} 
          icon={<IconContainer icon={FaSpinner} color="white" size="1.5em" background="#ffb100" padding="12px" round={true} />}
          status="doing"
          glow
          glowColor="rgba(255, 177, 0, 0.25)"
        />
        <DashboardCard 
          variant="summary" 
          title={t('dashboard.tasks.summary.completed', 'Completed')} 
          value={doneTasks.length} 
          icon={<IconContainer icon={FaCheck} color="white" size="1.5em" background="#00c27a" padding="12px" round={true} />}
          status="done"
          glow
          glowColor="rgba(0, 194, 122, 0.25)"
        />
        <DashboardCard 
          variant="summary" 
          title={t('dashboard.tasks.summary.blocked', 'Blocked')} 
          value={tasks.filter(t => t.status === 'blocked').length} 
          icon={<IconContainer icon={FaExclamationTriangle} color="white" size="1.5em" background="#d01f48" padding="12px" round={true} />}
          status="blocked"
          glow
          glowColor="rgba(208, 31, 72, 0.25)"
        />
      </SummaryCardsContainer>
      
      <KanbanBoard>
        {/* Todo Column */}
        <KanbanColumn>
          <ColumnHeader status="todo">
            <ColumnTitle status="todo">
              {getColoredStatusIcon('todo')}
              <h3>{t('dashboard.tasks.todo', 'To Do')}</h3>
            </ColumnTitle>
            <TaskCount status="todo">{todoTasks.length}</TaskCount>
          </ColumnHeader>
          
          <ColumnContent>
            {isLoading ? (
              Array.from({ length: 2 }).map((_, idx) => (
                <TaskCard key={idx}>
                  <TaskCardHeader>
                    <SkeletonLoader width="60%" height="0.9rem" />
                    <SkeletonLoader width="30%" height="0.8rem" />
                  </TaskCardHeader>
                  <SkeletonLoader height="0.8rem" style={{ marginBottom: '0.3rem' }} />
                  <SkeletonLoader height="0.8rem" />
                </TaskCard>
              ))
            ) : todoTasks.map(task => (
              <DashboardCard
                key={task.id}
                variant="task"
                title={task.title}
                description={task.description}
                status="todo"
                priority={task.priority}
                dueDate={parseDate(task.dueDate)?.toLocaleDateString()}
                dueDateIcon={<FaCalendarAlt style={{ color: '#6a1fd0' }} />}
                assignee={task.assignedToName}
                assigneeIcon={<FaUserAlt style={{ color: '#6a1fd0' }} />}
                statusIcon={getColoredStatusIcon('todo')}
                statusText={t('dashboard.tasks.todo', 'To Do')}
                interactive
                glow
                glowColor="rgba(106, 31, 208, 0.25)"
                gradient={task.priority === 'high'}
                onClick={() => console.log(`Task clicked: ${task.title}`)}
              />
            ))}

            {!isLoading && todoTasks.length === 0 && (
              <EmptyColumnState>
                {t('dashboard.tasks.emptyTodo', 'No tasks to do')}
              </EmptyColumnState>
            )}
          </ColumnContent>
        </KanbanColumn>
        
        {/* Doing Column */}
        <KanbanColumn>
          <ColumnHeader status="doing">
            <ColumnTitle status="doing">
              {getColoredStatusIcon('doing')}
              <h3>{t('dashboard.tasks.doing', 'In Progress')}</h3>
            </ColumnTitle>
            <TaskCount status="doing">{doingTasks.length}</TaskCount>
          </ColumnHeader>
          
          <ColumnContent>
            {isLoading ? (
              Array.from({ length: 2 }).map((_, idx) => (
                <TaskCard key={idx}>
                  <TaskCardHeader>
                    <SkeletonLoader width="60%" height="0.9rem" />
                    <SkeletonLoader width="30%" height="0.8rem" />
                  </TaskCardHeader>
                  <SkeletonLoader height="0.8rem" style={{ marginBottom: '0.3rem' }} />
                  <SkeletonLoader height="0.8rem" />
                </TaskCard>
              ))
            ) : doingTasks.map(task => (
              <DashboardCard
                key={task.id}
                variant="task"
                title={task.title}
                description={task.description}
                status="doing"
                priority={task.priority}
                dueDate={parseDate(task.dueDate)?.toLocaleDateString()}
                dueDateIcon={<FaCalendarAlt style={{ color: '#ffb100' }} />}
                assignee={task.assignedToName}
                assigneeIcon={<FaUserAlt style={{ color: '#ffb100' }} />}
                statusIcon={getColoredStatusIcon('doing')}
                statusText={t('dashboard.tasks.doing', 'In Progress')}
                interactive
                glow
                glowColor="rgba(255, 177, 0, 0.25)"
                gradient={task.priority === 'high'}
                onClick={() => console.log(`Task clicked: ${task.title}`)}
              />
            ))}

            {!isLoading && doingTasks.length === 0 && (
              <EmptyColumnState>
                {t('dashboard.tasks.emptyDoing', 'No tasks in progress')}
              </EmptyColumnState>
            )}
          </ColumnContent>
        </KanbanColumn>
        
        {/* Done Column */}
        <KanbanColumn>
          <ColumnHeader status="done">
            <ColumnTitle status="done">
              {getColoredStatusIcon('done')}
              <h3>{t('dashboard.tasks.done', 'Done')}</h3>
            </ColumnTitle>
            <TaskCount status="done">{doneTasks.length}</TaskCount>
          </ColumnHeader>
          
          <ColumnContent>
            {isLoading ? (
              Array.from({ length: 2 }).map((_, idx) => (
                <TaskCard key={idx}>
                  <TaskCardHeader>
                    <SkeletonLoader width="60%" height="0.9rem" />
                    <SkeletonLoader width="30%" height="0.8rem" />
                  </TaskCardHeader>
                  <SkeletonLoader height="0.8rem" style={{ marginBottom: '0.3rem' }} />
                  <SkeletonLoader height="0.8rem" />
                </TaskCard>
              ))
            ) : doneTasks.map(task => (
              <DashboardCard
                key={task.id}
                variant="task"
                title={task.title}
                description={task.description}
                status="done"
                priority={task.priority}
                dueDate={parseDate(task.dueDate)?.toLocaleDateString()}
                dueDateIcon={<FaCalendarAlt style={{ color: '#00c27a' }} />}
                assignee={task.assignedToName}
                assigneeIcon={<FaUserAlt style={{ color: '#00c27a' }} />}
                statusIcon={getColoredStatusIcon('done')}
                statusText={t('dashboard.tasks.done', 'Done')}
                interactive
                glow
                glowColor="rgba(0, 194, 122, 0.25)"
                gradient={task.priority === 'high'}
                onClick={() => console.log(`Task clicked: ${task.title}`)}
              />
            ))}

            {!isLoading && doneTasks.length === 0 && (
              <EmptyColumnState>
                {t('dashboard.tasks.emptyDone', 'No completed tasks')}
              </EmptyColumnState>
            )}
          </ColumnContent>
        </KanbanColumn>
      </KanbanBoard>
      
      {/* Task Wizard Modal */}
      <TaskWizard 
        isOpen={showTaskWizard} 
        onClose={() => setShowTaskWizard(false)} 
        projectId={selectedProjectId}
        onTaskAdded={(newTask) => {
          // In a real app, this would refresh the task list or add the task directly to the state
          console.log('New task added:', newTask);
          // You could trigger a refresh of your tasks here
        }}
      />
    </PanelContainer>
  );
};

// Custom styled components extending from centralized styles
const SummaryCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${spacing.lg};
  margin-bottom: ${spacing.xl};
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

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
  background: rgba(35, 38, 85, 0.4);
  border-radius: ${borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  box-shadow: ${shadows.md};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.lg};
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    direction: rtl;
  }
`;

const ColumnHeader = styled.div`
  ${mixins.flexBetween}
  padding: ${spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.15;
    z-index: 0;
    
    ${props => {
      switch(props.status) {
        case 'done':
          return 'background: linear-gradient(135deg, rgba(76, 201, 240, 0.3), transparent);';
        case 'doing':
          return 'background: linear-gradient(135deg, rgba(247, 184, 1, 0.3), transparent);';
        case 'todo':
          return 'background: linear-gradient(135deg, rgba(131, 56, 236, 0.3), transparent);';
        default:
          return 'background: linear-gradient(135deg, rgba(131, 56, 236, 0.3), transparent);';
      }
    }}
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const ColumnTitle = styled.div`
  ${mixins.flexCenter}
  gap: ${spacing.sm};
  position: relative;
  z-index: 1;
  
  h3 {
    margin: 0;
    font-size: ${typography.fontSizes.lg};
    font-weight: ${typography.fontWeights.semibold};
    position: relative;
    z-index: 1;
    
    ${props => {
      switch(props.status) {
        case 'done':
          return `
            background: linear-gradient(90deg, #fff, #4cc9f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          `;
        case 'doing':
          return `
            background: linear-gradient(90deg, #fff, #f7b801);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          `;
        case 'todo':
          return `
            background: linear-gradient(90deg, #fff, #8338ec);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          `;
        default:
          return `color: ${colors.text.primary};`;
      }
    }}
  }
  
  svg {
    ${props => {
      switch(props.status) {
        case 'done':
          return 'color: #4cc9f0;';
        case 'doing':
          return 'color: #f7b801;';
        case 'todo':
          return 'color: #8338ec;';
        default:
          return `color: ${colors.accent.primary};`;
      }
    }}
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const TaskCount = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.semibold};
  position: relative;
  z-index: 1;
  
  ${props => {
    switch(props.status) {
      case 'done':
        return `
          background-color: rgba(76, 201, 240, 0.15);
          color: #4cc9f0;
        `;
      case 'doing':
        return `
          background-color: rgba(247, 184, 1, 0.15);
          color: #f7b801;
        `;
      case 'todo':
        return `
          background-color: rgba(131, 56, 236, 0.15);
          color: #8338ec;
        `;
      case 'blocked':
        return `
          background-color: rgba(239, 71, 111, 0.15);
          color: #ef476f;
        `;
      default:
        return `
          background-color: rgba(255, 255, 255, 0.1);
          color: #e0e0e0;
        `;
    }
  }}
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