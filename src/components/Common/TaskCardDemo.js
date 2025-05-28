import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaCalendarAlt, 
  FaUserAlt, 
  FaCode, 
  FaPalette, 
  FaMobileAlt,
  FaDatabase,
  FaServer,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaListUl,
  FaChartLine,
  FaRocket,
  FaLightbulb,
  FaBug,
  FaShieldAlt,
  FaCloudUploadAlt,
  FaGlobe
} from 'react-icons/fa';
import DashboardCard from './CardSystem';
import { PanelContainer, PanelHeader, PanelTitle, CardGrid } from '../../styles/GlobalComponents';
import { colors, spacing, shadows, borderRadius } from '../../styles/GlobalTheme';
import StarryBackground from '../Common/StarryBackground';

const TaskCardDemo = () => {
  const { t } = useTranslation();
  
  // Dummy tasks data
  const tasks = [
    {
      id: 1,
      title: 'Design Homepage Mockup',
      description: 'Create wireframes and high-fidelity mockups for the new homepage design with dark theme.',
      status: 'done',
      priority: 'high',
      dueDate: '2025-05-20',
      assignee: 'Sarah Chen',
      category: 'design',
      tags: ['UI/UX', 'Homepage']
    },
    {
      id: 2,
      title: 'Implement Authentication API',
      description: 'Develop RESTful API endpoints for user authentication including login, register, and password reset.',
      status: 'doing',
      priority: 'high',
      dueDate: '2025-05-30',
      assignee: 'Michael Johnson',
      category: 'backend',
      tags: ['API', 'Auth']
    },
    {
      id: 3,
      title: 'Mobile Responsive Layout',
      description: 'Ensure all dashboard components are fully responsive on mobile devices and tablets.',
      status: 'todo',
      priority: 'medium',
      dueDate: '2025-06-05',
      assignee: 'Alex Wong',
      category: 'frontend',
      tags: ['Responsive', 'CSS']
    },
    {
      id: 4,
      title: 'Database Schema Optimization',
      description: 'Optimize database queries and schema for better performance with large datasets.',
      status: 'blocked',
      priority: 'high',
      dueDate: '2025-05-25',
      assignee: 'Priya Patel',
      category: 'backend',
      tags: ['Database', 'Performance']
    },
    {
      id: 5,
      title: 'Create User Dashboard',
      description: 'Implement the user dashboard with analytics charts and activity feed.',
      status: 'todo',
      priority: 'medium',
      dueDate: '2025-06-10',
      assignee: 'James Wilson',
      category: 'frontend',
      tags: ['Dashboard', 'Charts']
    },
    {
      id: 6,
      title: 'Deploy to Production',
      description: 'Configure CI/CD pipeline and deploy the application to production environment.',
      status: 'done',
      priority: 'high',
      dueDate: '2025-05-15',
      assignee: 'Emily Rodriguez',
      category: 'devops',
      tags: ['Deployment', 'CI/CD']
    },
    {
      id: 7,
      title: 'Implement Dark Mode',
      description: 'Add dark mode toggle and ensure consistent styling across all components.',
      status: 'doing',
      priority: 'low',
      dueDate: '2025-06-08',
      assignee: 'David Kim',
      category: 'frontend',
      tags: ['UI', 'Theming']
    },
    {
      id: 8,
      title: 'User Testing Session',
      description: 'Conduct user testing sessions to gather feedback on the new features.',
      status: 'todo',
      priority: 'medium',
      dueDate: '2025-06-15',
      assignee: 'Lisa Thompson',
      category: 'research',
      tags: ['Testing', 'UX']
    }
  ];

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'done': return <FaCheckCircle />;
      case 'doing': return <FaClock />;
      case 'todo': return <FaListUl />;
      case 'blocked': return <FaExclamationCircle />;
      default: return null;
    }
  };
  
  // Get category icon based on category
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'design': return <FaPalette />;
      case 'frontend': return <FaCode />;
      case 'backend': return <FaServer />;
      case 'devops': return <FaDatabase />;
      case 'research': return <FaMobileAlt />;
      default: return <FaCode />;
    }
  };
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <PanelContainer>
      {/* Starry background effect */}
      <BackgroundWrapper>
        <StarryBackground color="#a78bfa" starCount={200} blurAmount={8} opacity={1} />
      </BackgroundWrapper>
      
      <PanelHeader>
        <PanelTitle>
          <GradientText>{t('dashboard.taskDemo.title', 'Enhanced Task Cards')}</GradientText>
        </PanelTitle>
      </PanelHeader>
      
      <SummaryCardsContainer>
        <DashboardCard 
          variant="summary"
          icon={<FaListUl />}
          title={t('dashboard.taskDemo.totalTasks', 'Total Tasks')}
          value={tasks.length}
          status="info"
          gradient
          glow
        />
        <DashboardCard 
          variant="summary"
          icon={<FaClock />}
          title={t('dashboard.taskDemo.inProgress', 'In Progress')}
          value={tasks.filter(t => t.status === 'doing').length}
          status="warning"
          gradient
          glow
        />
        <DashboardCard 
          variant="summary"
          icon={<FaCheckCircle />}
          title={t('dashboard.taskDemo.completed', 'Completed')}
          value={tasks.filter(t => t.status === 'done').length}
          status="success"
          gradient
          glow
        />
        <DashboardCard 
          variant="summary"
          icon={<FaExclamationCircle />}
          title={t('dashboard.taskDemo.blocked', 'Blocked')}
          value={tasks.filter(t => t.status === 'blocked').length}
          status="error"
          gradient
          glow
        />
      </SummaryCardsContainer>
      
      <SectionTitle>
        <GradientText>{t('dashboard.taskDemo.allTasks', 'All Tasks')}</GradientText>
      </SectionTitle>
      
      <TaskFilters>
        <FilterButton active>All</FilterButton>
        <FilterButton>Design</FilterButton>
        <FilterButton>Development</FilterButton>
        <FilterButton>DevOps</FilterButton>
      </TaskFilters>
      
      <CardGrid>
        {tasks.map(task => (
          <DashboardCard 
            key={task.id}
            variant="task"
            title={task.title}
            description={task.description}
            status={task.status}
            priority={task.priority}
            dueDate={formatDate(task.dueDate)}
            dueDateIcon={<FaCalendarAlt />}
            assignee={task.assignee}
            assigneeIcon={<FaUserAlt />}
            statusIcon={getStatusIcon(task.status)}
            interactive
            glow
            glowColor={task.status === 'done' ? 'rgba(76, 201, 240, 0.3)' : 
                      task.status === 'doing' ? 'rgba(247, 184, 1, 0.3)' : 
                      task.status === 'blocked' ? 'rgba(239, 71, 111, 0.3)' : 
                      'rgba(131, 56, 236, 0.3)'}
            gradient={task.priority === 'high'}
            onClick={() => console.log(`Task clicked: ${task.title}`)}
          >
            <TaskTags>
              <CategoryTag category={task.category}>
                {getCategoryIcon(task.category)}
                <span>{task.category}</span>
              </CategoryTag>
              
              {task.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TaskTags>
          </DashboardCard>
        ))}
      </CardGrid>
      
      <SectionTitle>{t('dashboard.taskDemo.tasksByStatus', 'Tasks by Status')}</SectionTitle>
      
      <StatusColumns>
        <StatusColumn>
          <StatusHeader status="todo">
            <StatusIcon status="todo">{getStatusIcon('todo')}</StatusIcon>
            <h3>To Do</h3>
            <StatusCount status="todo">{tasks.filter(t => t.status === 'todo').length}</StatusCount>
          </StatusHeader>
          
          <ColumnContent>
            {tasks.filter(t => t.status === 'todo').map(task => (
              <DashboardCard 
                key={task.id}
                variant="task"
                title={task.title}
                status={task.status}
                priority={task.priority}
                dueDate={formatDate(task.dueDate)}
                dueDateIcon={<FaCalendarAlt />}
                assignee={task.assignee}
                assigneeIcon={<FaUserAlt />}
                interactive
                onClick={() => console.log(`Task clicked: ${task.title}`)}
              />
            ))}
          </ColumnContent>
        </StatusColumn>
        
        <StatusColumn>
          <StatusHeader status="doing">
            <StatusIcon status="doing">{getStatusIcon('doing')}</StatusIcon>
            <h3>In Progress</h3>
            <StatusCount status="doing">{tasks.filter(t => t.status === 'doing').length}</StatusCount>
          </StatusHeader>
          
          <ColumnContent>
            {tasks.filter(t => t.status === 'doing').map(task => (
              <DashboardCard 
                key={task.id}
                variant="task"
                title={task.title}
                status={task.status}
                priority={task.priority}
                dueDate={formatDate(task.dueDate)}
                dueDateIcon={<FaCalendarAlt />}
                assignee={task.assignee}
                assigneeIcon={<FaUserAlt />}
                interactive
                onClick={() => console.log(`Task clicked: ${task.title}`)}
              />
            ))}
          </ColumnContent>
        </StatusColumn>
        
        <StatusColumn>
          <StatusHeader status="done">
            <StatusIcon status="done">{getStatusIcon('done')}</StatusIcon>
            <h3>Done</h3>
            <StatusCount status="done">{tasks.filter(t => t.status === 'done').length}</StatusCount>
          </StatusHeader>
          
          <ColumnContent>
            {tasks.filter(t => t.status === 'done').map(task => (
              <DashboardCard 
                key={task.id}
                variant="task"
                title={task.title}
                status={task.status}
                priority={task.priority}
                dueDate={formatDate(task.dueDate)}
                dueDateIcon={<FaCalendarAlt />}
                assignee={task.assignee}
                assigneeIcon={<FaUserAlt />}
                interactive
                onClick={() => console.log(`Task clicked: ${task.title}`)}
              />
            ))}
          </ColumnContent>
        </StatusColumn>
      </StatusColumns>
    </PanelContainer>
  );
};

// Additional styled components for the demo
const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 1;
`;

const GradientText = styled.span`
  background: linear-gradient(90deg, #cd3efd, #4cc9f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

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

const TaskDescription = styled.p`
  margin: ${spacing.sm} 0 0;
  font-size: 0.9rem;
  color: #e0e0e0;
  line-height: 1.5;
`;

const SectionTitle = styled.h3`
  margin: ${spacing.xl} 0 ${spacing.md};
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  
  &:first-of-type {
    margin-top: 0;
  }
`;

const TaskTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0;
`;

const Tag = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  display: inline-flex;
  align-items: center;
`;

const CategoryTag = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  ${props => {
    switch(props.category) {
      case 'design':
        return 'background-color: rgba(131, 56, 236, 0.15); color: #8338ec;';
      case 'frontend':
        return 'background-color: rgba(76, 201, 240, 0.15); color: #4cc9f0;';
      case 'backend':
        return 'background-color: rgba(67, 97, 238, 0.15); color: #4361ee;';
      case 'devops':
        return 'background-color: rgba(247, 184, 1, 0.15); color: #f7b801;';
      case 'research':
        return 'background-color: rgba(239, 71, 111, 0.15); color: #ef476f;';
      default:
        return 'background-color: rgba(255, 255, 255, 0.1); color: #e0e0e0;';
    }
  }}
  
  svg {
    font-size: 0.75rem;
  }
`;

const TaskFilters = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: ${spacing.sm} ${spacing.md};
  border-radius: 20px;
  background: ${props => props.active ? 'rgba(131, 56, 236, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? '#8338ec' : '#e0e0e0'};
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(131, 56, 236, 0.15);
    color: #8338ec;
  }
`;

const StatusColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${spacing.lg};
  margin-top: ${spacing.lg};
  position: relative;
  z-index: 1;
  
  /* RTL Support */
  [dir="rtl"] & {
    direction: rtl;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatusColumn = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(35, 38, 85, 0.4);
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  box-shadow: ${shadows.md};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.lg};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    direction: rtl;
  }
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    flex-grow: 1;
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
        case 'blocked':
          return `
            background: linear-gradient(90deg, #fff, #ef476f);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          `;
        default:
          return '';
      }
    }}
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
  
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
        case 'blocked':
          return 'background: linear-gradient(135deg, rgba(239, 71, 111, 0.3), transparent);';
        default:
          return '';
      }
    }}
  }
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    opacity: 0.2;
    z-index: -1;
    
    ${props => {
      switch(props.status) {
        case 'done':
          return 'background: linear-gradient(135deg, #4cc9f0, #4361ee);';
        case 'doing':
          return 'background: linear-gradient(135deg, #f7b801, #f18701);';
        case 'todo':
          return 'background: linear-gradient(135deg, #8338ec, #3a0ca3);';
        case 'blocked':
          return 'background: linear-gradient(135deg, #ef476f, #b5179e);';
        default:
          return 'background: linear-gradient(135deg, #8338ec, #3a0ca3);';
      }
    }}
  }
  
  svg {
    font-size: 1rem;
    
    ${props => {
      switch(props.status) {
        case 'done':
          return 'color: #4cc9f0;';
        case 'doing':
          return 'color: #f7b801;';
        case 'todo':
          return 'color: #8338ec;';
        case 'blocked':
          return 'color: #ef476f;';
        default:
          return 'color: #8338ec;';
      }
    }}
  }
`;

const StatusCount = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
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
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  padding: ${spacing.md};
  min-height: 200px;
`;

export default TaskCardDemo;
