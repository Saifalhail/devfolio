import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaRocket, 
  FaBook, 
  FaCommentAlt, 
  FaHandshake 
} from 'react-icons/fa';

// Import post-launch components
import MaintenanceGuide from './PostLaunch/MaintenanceGuide';
import HireAgain from './PostLaunch/HireAgain';
import FeedbackForm from './PostLaunch/FeedbackForm';
import StarryBackground from '../Common/StarryBackground';

const PostLaunchPanel = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeSection, setActiveSection] = useState('guide');
  
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <Container>
      <BackgroundContainer>
        <StarryBackground color="#4361ee" starCount={200} blurAmount={8} opacity={0.8} />
      </BackgroundContainer>
      
      <Header>
        <Title>{t('postLaunch.title', 'Post-Launch')}</Title>
      </Header>
      
      <NavigationTabs>
        <NavigationTab 
          active={activeSection === 'guide'} 
          onClick={() => handleSectionChange('guide')}
        >
          <FaBook />
          <span>{t('postLaunch.maintenanceGuide', 'Maintenance Guide')}</span>
        </NavigationTab>
        
        <NavigationTab 
          active={activeSection === 'feedback'} 
          onClick={() => handleSectionChange('feedback')}
        >
          <FaCommentAlt />
          <span>{t('postLaunch.feedbackForm.title', 'Feedback')}</span>
        </NavigationTab>
        
        <NavigationTab 
          active={activeSection === 'hire'} 
          onClick={() => handleSectionChange('hire')}
        >
          <FaHandshake />
          <span>{t('postLaunch.hireAgain.title', 'Hire Again')}</span>
        </NavigationTab>
      </NavigationTabs>
      
      <Content>
        {activeSection === 'guide' && (
          <MaintenanceGuide />
        )}
        
        {activeSection === 'feedback' && (
          <FeedbackForm />
        )}
        
        {activeSection === 'hire' && (
          <HireAgain />
        )}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #f9f9f9;
`;

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  opacity: 1;
  pointer-events: none;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(90deg, #fff, #4cc9f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(76, 201, 240, 0.3);
`;

const NavigationTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const NavigationTab = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${props => props.active 
    ? 'linear-gradient(90deg, #4361ee, #4cc9f0)' 
    : 'rgba(35, 38, 85, 0.6)'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active 
    ? '0 8px 20px rgba(67, 97, 238, 0.3)' 
    : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    background: linear-gradient(45deg, #3a56d4 0%, #4cc9f0 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
  
  svg {
    font-size: 1rem;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  }
  
  @media (max-width: 768px) {
    flex: 1;
    min-width: 120px;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    
    span {
      display: none;
    }
    
    svg {
      margin: 0 auto;
    }
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
`;

export default PostLaunchPanel;
