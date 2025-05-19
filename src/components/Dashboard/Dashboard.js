import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import Layout from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Layout>
      <DashboardContainer isRTL={isRTL}>
        <DashboardHeader>
          <h1>✅ Simple Project Management Dashboard</h1>
          <DashboardSubtitle>Solo Developer Edition</DashboardSubtitle>
          
          <UserInfoContainer>
            <UserInfo>
              <FaUser />
              <span>{currentUser?.displayName || currentUser?.email || 'User'}</span>
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt />
              <span>{t('dashboard.logout', 'Logout')}</span>
            </LogoutButton>
          </UserInfoContainer>
        </DashboardHeader>
        
        <DashboardContent>
          <WelcomeCard>
            <h2>Welcome to your Dashboard</h2>
            <p>This is a simple dashboard for managing your projects. Here you can track project progress, manage client communications, and more.</p>
          </WelcomeCard>
          
          <SummaryCardsContainer>
            <SummaryCard>
              <CardTitle>Active Projects</CardTitle>
              <CardValue>0</CardValue>
            </SummaryCard>
            
            <SummaryCard>
              <CardTitle>Pending Actions</CardTitle>
              <CardValue>0</CardValue>
            </SummaryCard>
            
            <SummaryCard>
              <CardTitle>Latest Uploads</CardTitle>
              <CardValue>0</CardValue>
            </SummaryCard>
            
            <SummaryCard>
              <CardTitle>Project Deadlines</CardTitle>
              <CardValue>None</CardValue>
            </SummaryCard>
          </SummaryCardsContainer>
        </DashboardContent>
      </DashboardContainer>
    </Layout>
  );
};

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #513a52, #82a1bf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const DashboardSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-top: 0;
`;

const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WelcomeCard = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin-top: 0;
    color: #513a52;
  }
  
  p {
    color: #666;
    line-height: 1.6;
  }
`;

const SummaryCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const SummaryCard = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  color: #513a52;
  font-size: 1.2rem;
`;

const CardValue = styled.p`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0.5rem 0 0;
  background: linear-gradient(135deg, #faaa93, #82a1bf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #513a52;
  
  svg {
    color: #82a1bf;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #faaa93, #82a1bf);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: linear-gradient(135deg, #82a1bf, #faaa93);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export default Dashboard;
