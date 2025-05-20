import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaProjectDiagram, 
  FaFileAlt, 
  FaClipboardList, 
  FaFileUpload, 
  FaFileInvoiceDollar, 
  FaHistory,
  FaCog
} from 'react-icons/fa';

const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const location = useLocation();
  
  const menuItems = [
    { 
      icon: <FaHome />, 
      label: t('dashboard.sidebar.overview', 'Overview'), 
      path: '/dashboard' 
    },
    { 
      icon: <FaProjectDiagram />, 
      label: t('dashboard.sidebar.projects', 'Projects'), 
      path: '/dashboard/projects' 
    },
    { 
      icon: <FaFileAlt />, 
      label: t('dashboard.sidebar.forms', 'Forms'), 
      path: '/dashboard/forms' 
    },
    { 
      icon: <FaClipboardList />, 
      label: t('dashboard.sidebar.tasks', 'Tasks'), 
      path: '/dashboard/tasks' 
    },
    { 
      icon: <FaFileUpload />, 
      label: t('dashboard.sidebar.files', 'Files'), 
      path: '/dashboard/files' 
    },
    { 
      icon: <FaFileInvoiceDollar />, 
      label: t('dashboard.sidebar.invoices', 'Invoices'), 
      path: '/dashboard/invoices' 
    },
    { 
      icon: <FaHistory />, 
      label: t('dashboard.sidebar.activity', 'Activity Log'), 
      path: '/dashboard/activity' 
    },
    { 
      icon: <FaCog />, 
      label: t('dashboard.sidebar.settings', 'Settings'), 
      path: '/dashboard/settings' 
    }
  ];

  return (
    <SidebarContainer isRTL={isRTL}>
      <SidebarHeader>
        <BrandName>{t('dashboard.sidebar.dashboard', 'Dashboard')}</BrandName>
      </SidebarHeader>
      
      <NavMenu>
        {menuItems.map((item) => (
          <NavItem 
            key={item.path} 
            isActive={location.pathname === item.path}
            isRTL={isRTL}
            to={item.path}
          >
            <IconWrapper isRTL={isRTL}>
              {item.icon}
            </IconWrapper>
            <span>{item.label}</span>
          </NavItem>
        ))}
      </NavMenu>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 250px;
  height: 100%;
  background: linear-gradient(180deg, #513a52 0%, #2d2235 100%);
  color: white;
  padding: 1.5rem 0;
  position: fixed;
  top: 0;
  ${props => props.isRTL ? 'right: 0;' : 'left: 0;'}
  overflow-y: auto;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    width: 70px;
    padding: 1.5rem 0;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 0 0.5rem 1.5rem;
    text-align: center;
  }
`;

const BrandName = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #faaa93, #82a1bf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    padding: 0 0.5rem;
    align-items: center;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  color: ${props => props.isActive ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  background: ${props => props.isActive ? 'rgba(130, 161, 191, 0.2)' : 'transparent'};
  text-decoration: none;
  transition: all 0.3s ease;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  
  &:hover {
    background: rgba(130, 161, 191, 0.1);
    color: white;
  }
  
  span {
    margin-${props => props.isRTL ? 'right' : 'left'}: 0.8rem;
    font-weight: ${props => props.isActive ? '600' : '400'};
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    justify-content: center;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  min-width: 24px;
  
  @media (max-width: 768px) {
    margin: 0;
  }
`;

export default Sidebar;
