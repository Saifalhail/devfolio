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
      path: '/dashboard',
      isHighlighted: true
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
      <NavMenu>
        {menuItems.map((item) => (
          <NavItem 
            key={item.path} 
            isActive={location.pathname === item.path}
            isHighlighted={item.isHighlighted}
            isRTL={isRTL}
            to={item.path}
          >
            <IconWrapper isRTL={isRTL} isActive={location.pathname === item.path || item.isHighlighted}>
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
  width: 240px;
  height: 100%;
  background: #2c1e3f; /* Solid dark purple color to match screenshot */
  color: white;
  padding: 0;
  margin: 0;
  position: relative;
  overflow-y: auto;
  transition: all 0.3s ease;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-top: none;
  
  @media (max-width: 768px) {
    width: 70px;
    padding: 1.5rem 0;
  }
`;

const DashboardTitle = styled.div`
  padding: 1.5rem;
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: white;
  border-bottom: 3px solid #8a3fe7;
  margin-bottom: 0;
  background-color: #231733; /* Darker background for the title */
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
    text-align: center;
    font-size: 1.2rem;
  }
`;

const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  margin-top: 0;
  padding-top: 0;
  
  @media (max-width: 768px) {
    padding: 0;
    align-items: center;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: ${props => props.isActive || props.isHighlighted ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  background: ${props => props.isActive || props.isHighlighted ? '#3a2952' : 'transparent'};
  text-decoration: none;
  transition: all 0.3s ease;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  border-left: ${props => props.isActive || props.isHighlighted ? '4px solid #faaa93' : '4px solid transparent'};
  position: relative;
  margin-top: ${props => props.isHighlighted ? '0' : '0'};
  
  &:hover {
    background: #3a2952;
    color: white;
    border-left: 4px solid #faaa93;
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
  margin-right: ${props => props.isRTL ? '0' : '1rem'};
  margin-left: ${props => props.isRTL ? '1rem' : '0'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  min-width: 24px;
  color: ${props => props.isActive ? '#faaa93' : 'inherit'};
  
  @media (max-width: 768px) {
    margin: 0;
  }
`;

export default Sidebar;
