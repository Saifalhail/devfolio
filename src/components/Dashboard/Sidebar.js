import React, { useState, useRef, useEffect } from 'react';
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
  FaCog,
  FaPalette,
  FaFigma,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaRocket
} from 'react-icons/fa';

const Sidebar = ({ collapsed = false, onToggleCollapse, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const location = useLocation();

  const menuRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const touchStartX = useRef(null);
  const touchCurrentX = useRef(null);
  
  const isItemActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

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
      label: t('dashboard.sidebar.chat', 'Chat'), 
      path: '/dashboard/chat' 
    },
    { 
      icon: <FaFigma />, 
      label: t('dashboard.sidebar.design', 'Design'), 
      path: '/dashboard/design' 
    },
    { 
      icon: <FaRocket />, 
      label: t('dashboard.sidebar.postLaunch', 'Post-Launch'), 
      path: '/dashboard/post-launch' 
    },
    { 
      icon: <FaCog />, 
      label: t('dashboard.sidebar.settings', 'Settings'), 
      path: '/dashboard/settings' 
    }
  ];

  useEffect(() => {
    const activeIndex = menuItems.findIndex(item => isItemActive(item.path));
    if (activeIndex !== -1) {
      setFocusedIndex(activeIndex);
    }
  }, [location.pathname]);

  const handleKeyDown = (e, index) => {
    let newIndex = index;
    if (e.key === 'ArrowDown' || (!isRTL && e.key === 'ArrowRight') || (isRTL && e.key === 'ArrowLeft')) {
      newIndex = (index + 1) % menuItems.length;
      e.preventDefault();
    } else if (e.key === 'ArrowUp' || (!isRTL && e.key === 'ArrowLeft') || (isRTL && e.key === 'ArrowRight')) {
      newIndex = (index - 1 + menuItems.length) % menuItems.length;
      e.preventDefault();
    } else if (e.key === 'Home') {
      newIndex = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      newIndex = menuItems.length - 1;
      e.preventDefault();
    } else if (e.key === 'Enter' || e.key === ' ') {
      menuRefs.current[index]?.click();
      return;
    }

    if (newIndex !== index) {
      setFocusedIndex(newIndex);
      menuRefs.current[newIndex]?.focus();
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current) return;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    const diff = touchCurrentX.current - touchStartX.current;
    const threshold = 50;
    if (!isRTL) {
      if (diff < -threshold) {
        onClose && onClose();
      }
    } else {
      if (diff > threshold) {
        onClose && onClose();
      }
    }
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  return (
    <SidebarContainer $isRTL={isRTL} $collapsed={collapsed}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CollapseButton
        onClick={onToggleCollapse}
        aria-label={collapsed ? t('dashboard.sidebar.expand', 'Expand Sidebar') : t('dashboard.sidebar.collapse', 'Collapse Sidebar')}
        $isRTL={isRTL}
      >
        {collapsed
          ? (isRTL ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />)
          : (isRTL ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />)}

      </CollapseButton>

      <NavMenu $isRTL={isRTL} $collapsed={collapsed}>
        {menuItems.map((item, index) => (
          <NavItem
            key={item.path}
            role="menuitem"
            ref={el => (menuRefs.current[index] = el)}
            tabIndex={index === focusedIndex ? 0 : -1}
            onKeyDown={(e) => handleKeyDown(e, index)}
            isActive={isItemActive(item.path)}
            isHighlighted={item.isHighlighted}
            $isRTL={isRTL}
            $collapsed={collapsed}
            to={item.path}
            aria-current={isItemActive(item.path) ? 'page' : undefined}
          >
            <IconWrapper
              $isRTL={isRTL}
              isActive={isItemActive(item.path) || item.isHighlighted}
              aria-hidden="true"
            >
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
  width: ${props => (props.$collapsed ? '60px' : '240px')};
  height: 100%;
  background: #2c1e3f; /* Solid dark purple color to match screenshot */
  color: white;
  padding: 0;
  margin: 0;
  position: relative;
  overflow-y: auto;
  touch-action: pan-y;
  transition: all 0.3s ease;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-top: none;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.$isRTL ? 'right' : 'left'};
  
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    padding: 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin-bottom: 1rem;
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
  text-align: ${props => props.$isRTL ? 'right' : 'left'};
  
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
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  align-items: ${props => (props.$collapsed ? 'center' : 'stretch')};
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${props => (props.$collapsed ? '1rem' : '1rem 1.5rem')};
  justify-content: ${props => (props.$collapsed ? 'center' : 'flex-start')};
  color: ${props => props.isActive || props.isHighlighted ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  background: ${props => props.isActive || props.isHighlighted ? '#3a2952' : 'transparent'};
  text-decoration: none;
  transition: all 0.3s ease;
  flex-direction: ${props => props.$isRTL ? 'row-reverse' : 'row'};
  border-${props => props.$isRTL ? 'right' : 'left'}: ${props =>
    props.$collapsed
      ? 'none'
      : props.isActive || props.isHighlighted
        ? '4px solid #faaa93'
        : '4px solid transparent'};
  position: relative;
  margin-top: ${props => props.isHighlighted ? '0' : '0'};
  
  &:hover {
    background: #3a2952;
    color: white;
    border-${props => props.$isRTL ? 'right' : 'left'}: ${props => props.$collapsed ? 'none' : '4px solid #faaa93'};
  }
  
  span {
    margin-${props => props.$isRTL ? 'right' : 'left'}: 0.8rem;
    font-weight: ${props => props.isActive ? '600' : '400'};
    display: ${props => (props.$collapsed ? 'none' : 'inline')};
    
    @media (max-width: 768px) {
      display: block;
      font-size: 0.8rem;
      margin: 0.3rem 0 0 0;
      text-align: center;
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-${props => props.isRTL ? 'right' : 'left'}: none;
    border-radius: 8px;
    border-bottom: ${props => props.isActive || props.isHighlighted ? '3px solid #faaa93' : '3px solid transparent'};
    margin: 0.2rem;
    min-width: 80px;
    
    &:hover {
      border-${props => props.isRTL ? 'right' : 'left'}: none;
      border-bottom: 3px solid #faaa93;
    }
  }
`;

const IconWrapper = styled.div`
  margin-right: ${props => props.$isRTL ? '0' : '1rem'};
  margin-left: ${props => props.$isRTL ? '1rem' : '0'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  min-width: 24px;
  color: ${props => props.isActive ? '#faaa93' : 'inherit'};
  
  @media (max-width: 768px) {
    margin: 0;
    font-size: 1.4rem;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  align-self: ${props => (props.$isRTL ? 'flex-end' : 'flex-start')};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export default Sidebar;
