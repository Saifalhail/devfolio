import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { PanelContainer } from '../../../styles/GlobalComponents';
import Tabs from '../../Common/Tabs';
import { FaImage, FaFigma, FaPalette, FaLayerGroup } from 'react-icons/fa';

/**
 * DesignNavigation - Tabbed navigation for the Design dashboard section.
 * Utilizes the reusable Tabs component for smooth transitions.
 * Sections: Mockups, Figma, Style Guide, Assets
 *
 * The content for each tab should be passed as React nodes via the `sections` prop.
 * Example usage:
 * <DesignNavigation sections={{ mockups: <MockupGallery />, figma: <FigmaEmbed />, styleGuide: <StyleGuide />, assets: <AssetsLibrary /> }} />
 */
const DesignNavigation = ({ activeSection, onSectionChange }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const tabs = [
    {
      id: 'mockups',
      label: t('design.mockups', 'Mockups'),
      icon: <FaImage />
    },
    {
      id: 'figma',
      label: t('design.figma', 'Figma'),
      icon: <FaFigma />
    },
    {
      id: 'styleGuide',
      label: t('design.styleGuide', 'Style Guide'),
      icon: <FaPalette />
    },
    {
      id: 'assets',
      label: t('design.assets', 'Assets'),
      icon: <FaLayerGroup />
    },
  ];

  const handleTabChange = (tabId) => {
    if (onSectionChange) {
      onSectionChange(tabId);
    }
  };

  return (
    <Container dir={isRTL ? 'rtl' : 'ltr'}>
      <NavigationContainer>
        {tabs.map((tab) => (
          <NavItem 
            key={tab.id} 
            active={activeSection === tab.id}
            onClick={() => handleTabChange(tab.id)}
          >
            <IconWrapper active={activeSection === tab.id}>{tab.icon}</IconWrapper>
            <span>{tab.label}</span>
            {activeSection === tab.id && <ActiveIndicator />}
          </NavItem>
        ))}
      </NavigationContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

const NavigationContainer = styled.div`
  display: flex;
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  padding: 0.75rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  justify-content: space-between;
  position: relative;
  z-index: 2;
  
  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, rgba(250, 170, 147, 0.2), rgba(255, 91, 146, 0.2), rgba(167, 139, 250, 0.2));
    border-radius: 14px;
    z-index: -1;
    filter: blur(8px);
    opacity: 0.7;
  }
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding: 0.5rem;
  }
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  width: 140px;
  background: ${props => props.active ? 'rgba(96, 49, 168, 0.6)' : 'transparent'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  justify-content: center;
  margin: 0 0.25rem;
  box-shadow: ${props => props.active ? '0 5px 15px rgba(0, 0, 0, 0.2)' : 'none'};
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: all 0.6s;
  }
  
  &:hover {
    background: ${props => props.active ? 'rgba(96, 49, 168, 0.6)' : 'rgba(255, 255, 255, 0.1)'};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
    
    &:before {
      left: 100%;
    }
  }
  
  @media (max-width: 768px) {
    width: calc(50% - 0.5rem);
    padding: 0.75rem 0.5rem;
    margin: 0.25rem;
  }
  
  @media (max-width: 480px) {
    width: calc(50% - 0.5rem);
    font-size: 0.8rem;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: ${props => props.active ? '#ff5b92' : 'rgba(255, 255, 255, 0.7)'};
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: all 0.3s ease;
  
  ${NavItem}:hover & {
    color: ${props => props.active ? '#ff5b92' : 'white'};
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ActiveIndicator = styled.div`
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(to right, #faaa93, #ff5b92);
  border-radius: 3px;
  box-shadow: 0 2px 8px rgba(250, 170, 147, 0.5);
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% { opacity: 0.7; box-shadow: 0 2px 8px rgba(250, 170, 147, 0.5); }
    50% { opacity: 1; box-shadow: 0 2px 12px rgba(250, 170, 147, 0.8); }
    100% { opacity: 0.7; box-shadow: 0 2px 8px rgba(250, 170, 147, 0.5); }
  }
`;

export default DesignNavigation;
