import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaChartLine, 
  FaClock, 
  FaExclamationTriangle, 
  FaCode, 
  FaPalette, 
  FaMobileAlt,
  FaRobot,
  FaServer
} from 'react-icons/fa';
import DashboardCard from './CardSystem';
import { PanelContainer, PanelHeader, PanelTitle, CardGrid } from '../../styles/GlobalComponents';
import { spacing } from '../../styles/GlobalTheme';

const CardDemo = () => {
  const { t } = useTranslation();
  
  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>{t('dashboard.cardDemo.title', 'Card System Demo')}</PanelTitle>
      </PanelHeader>
      
      <SectionTitle>{t('dashboard.cardDemo.summaryCards', 'Summary Cards')}</SectionTitle>
      <CardRow>
        <DashboardCard 
          variant="summary"
          icon={<FaChartLine />}
          title={t('dashboard.cardDemo.totalProjects', 'Total Projects')}
          value="24"
          status="success"
          interactive
          onClick={() => console.log('Card clicked')}
        />
        
        <DashboardCard 
          variant="summary"
          icon={<FaClock />}
          title={t('dashboard.cardDemo.pendingTasks', 'Pending Tasks')}
          value="12"
          status="warning"
          gradient
        />
        
        <DashboardCard 
          variant="summary"
          icon={<FaExclamationTriangle />}
          title={t('dashboard.cardDemo.issues', 'Issues')}
          value="5"
          status="error"
          glow
          glowColor="rgba(239, 71, 111, 0.3)"
        />
      </CardRow>
      
      <SectionTitle>{t('dashboard.cardDemo.featureCards', 'Feature Cards')}</SectionTitle>
      <CardGrid>
        <DashboardCard 
          variant="feature"
          icon={<FaCode />}
          title={t('dashboard.cardDemo.webDevelopment', 'Web Development')}
          gradient
          interactive
          onClick={() => console.log('Feature clicked')}
        >
          <p>{t('dashboard.cardDemo.webDescription', 'Modern web applications built with React, Next.js, and other cutting-edge technologies.')}</p>
        </DashboardCard>
        
        <DashboardCard 
          variant="feature"
          icon={<FaMobileAlt />}
          title={t('dashboard.cardDemo.mobileApps', 'Mobile Apps')}
          accentColor="#4cc9f0"
          glow
        >
          <p>{t('dashboard.cardDemo.mobileDescription', 'Native and cross-platform mobile applications for iOS and Android.')}</p>
        </DashboardCard>
        
        <DashboardCard 
          variant="feature"
          icon={<FaRobot />}
          title={t('dashboard.cardDemo.aiIntegration', 'AI Integration')}
          accentColor="#8338ec"
        >
          <p>{t('dashboard.cardDemo.aiDescription', 'Integrate AI capabilities into your applications for smarter user experiences.')}</p>
        </DashboardCard>
      </CardGrid>
      
      <SectionTitle>{t('dashboard.cardDemo.animatedCards', 'Animated Cards')}</SectionTitle>
      <CardGrid>
        <DashboardCard 
          variant="animated"
          title={t('dashboard.cardDemo.pulsing', 'Pulsing Animation')}
          gradient
        >
          <p>{t('dashboard.cardDemo.pulsingDescription', 'This card has a subtle pulsing animation effect that draws attention.')}</p>
        </DashboardCard>
        
        <DashboardCard 
          variant="gradient"
          title={t('dashboard.cardDemo.gradientBorder', 'Gradient Border')}
        >
          <p>{t('dashboard.cardDemo.gradientDescription', 'This card features an animated gradient border that cycles through colors.')}</p>
        </DashboardCard>
        
        <DashboardCard 
          variant="floating"
          title={t('dashboard.cardDemo.floating', 'Floating Effect')}
          gradient
        >
          <p>{t('dashboard.cardDemo.floatingDescription', 'This card gently floats up and down to create a dynamic interface element.')}</p>
        </DashboardCard>
        
        <DashboardCard 
          variant="interactive"
          title={t('dashboard.cardDemo.interactive', '3D Interactive')}
          onClick={() => console.log('Interactive card clicked')}
        >
          <p>{t('dashboard.cardDemo.interactiveDescription', 'This card responds to hover with a subtle 3D rotation effect.')}</p>
        </DashboardCard>
      </CardGrid>
      
      <SectionTitle>{t('dashboard.cardDemo.taskCards', 'Task Cards')}</SectionTitle>
      <CardGrid>
        <DashboardCard 
          variant="task"
          title={t('dashboard.cardDemo.designHomepage', 'Design Homepage')}
          interactive
          onClick={() => console.log('Task clicked')}
        >
          <TaskMeta>
            <TaskMetaItem>
              <FaPalette />
              <span>Design</span>
            </TaskMetaItem>
            <TaskStatus status="doing">In Progress</TaskStatus>
          </TaskMeta>
          <TaskDescription>
            Create wireframes and mockups for the new homepage design.
          </TaskDescription>
        </DashboardCard>
        
        <DashboardCard 
          variant="task"
          title={t('dashboard.cardDemo.implementAPI', 'Implement API')}
          interactive
          accentColor="#4361ee"
        >
          <TaskMeta>
            <TaskMetaItem>
              <FaServer />
              <span>Backend</span>
            </TaskMetaItem>
            <TaskStatus status="todo">To Do</TaskStatus>
          </TaskMeta>
          <TaskDescription>
            Develop RESTful API endpoints for user authentication and data retrieval.
          </TaskDescription>
        </DashboardCard>
      </CardGrid>
    </PanelContainer>
  );
};

// Additional styled components for the demo
const SectionTitle = styled.h3`
  margin: ${spacing.xl} 0 ${spacing.md};
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  
  &:first-of-type {
    margin-top: 0;
  }
`;

const CardRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${spacing.lg};
  margin-bottom: ${spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.sm};
`;

const TaskMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: #a0a0a0;
  font-size: 0.85rem;
  
  svg {
    font-size: 0.85rem;
  }
`;

const TaskStatus = styled.span`
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    switch(props.status) {
      case 'todo':
        return 'background-color: rgba(131, 56, 236, 0.2); color: #8338ec;';
      case 'doing':
        return 'background-color: rgba(247, 184, 1, 0.2); color: #f7b801;';
      case 'done':
        return 'background-color: rgba(76, 201, 240, 0.2); color: #4cc9f0;';
      default:
        return 'background-color: rgba(131, 56, 236, 0.2); color: #8338ec;';
    }
  }}
`;

const TaskDescription = styled.p`
  margin: ${spacing.sm} 0 0;
  font-size: 0.9rem;
  color: #e0e0e0;
`;

export default CardDemo;
