import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaFigma, FaPalette, FaHistory } from 'react-icons/fa';

/**
 * FigmaEmbed component
 * Embeds Figma designs with tab navigation for different views.
 * @param {string} currentUrl - URL of the current design file
 * @param {string} styleGuideUrl - URL of the style guide file
 * @param {string} revisionsUrl - URL of the revisions file
 */
const FigmaEmbed = ({ currentUrl, styleGuideUrl, revisionsUrl }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('current');

  const getEmbedUrl = () => {
    switch (activeTab) {
      case 'styleguide':
        return styleGuideUrl;
      case 'revisions':
        return revisionsUrl;
      case 'current':
      default:
        return currentUrl;
    }
  };

  return (
    <Container>
      <TabsContainer>
        <TabButton
          type="button"
          active={activeTab === 'current'}
          onClick={() => setActiveTab('current')}
        >
          <FaFigma />
          {t('design.currentDesign', 'Current Design')}
        </TabButton>
        <TabButton
          type="button"
          active={activeTab === 'styleguide'}
          onClick={() => setActiveTab('styleguide')}
        >
          <FaPalette />
          {t('design.styleGuide', 'Style Guide')}
        </TabButton>
        <TabButton
          type="button"
          active={activeTab === 'revisions'}
          onClick={() => setActiveTab('revisions')}
        >
          <FaHistory />
          {t('design.revisions', 'Revisions')}
        </TabButton>
      </TabsContainer>
      <FigmaEmbedContainer>
        <EmbedFrame
          src={`${getEmbedUrl()}?embed=true`}
          allowFullScreen
        />
      </FigmaEmbedContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(18, 20, 44, 0.4);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 1;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(35, 38, 85, 0.6);
  backdrop-filter: blur(8px);
  justify-content: center;
  position: relative;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(250, 170, 147, 0.1), rgba(255, 91, 146, 0.1), rgba(167, 139, 250, 0.1));
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  width: calc(50% - 0.75rem);
  background: ${props => (props.active ? 'rgba(96, 49, 168, 0.6)' : 'rgba(35, 38, 85, 0.4)')};
  color: ${props => (props.active ? 'white' : 'rgba(255, 255, 255, 0.7)')};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: ${props => (props.active ? '600' : '500')};
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  box-shadow: ${props => (props.active ? '0 2px 8px rgba(250, 170, 147, 0.5)' : 'none')};
  animation: ${props => (props.active ? 'pulse 1.5s infinite' : 'none')};
  
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

  @keyframes pulse {
    0% { box-shadow: 0 2px 8px rgba(250, 170, 147, 0.5); }
    50% { box-shadow: 0 2px 12px rgba(250, 170, 147, 0.8); }
    100% { box-shadow: 0 2px 8px rgba(250, 170, 147, 0.5); }
  }

  svg {
    font-size: 1.2rem;
    color: ${props => (props.active ? '#ff5b92' : 'rgba(255, 255, 255, 0.7)')};
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    transition: all 0.3s ease;
  }

  &:hover {
    background: ${props => (props.active ? 'rgba(96, 49, 168, 0.7)' : 'rgba(35, 38, 85, 0.6)')};
    color: white;
    transform: translateY(-2px);
    
    &:before {
      left: 100%;
    }
    
    svg {
      color: ${props => (props.active ? '#ff5b92' : 'white')};
      transform: scale(1.1);
    }
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => (props.active ? '40px' : '0')};
    height: 3px;
    background: linear-gradient(to right, #faaa93, #ff5b92);
    border-radius: 3px;
    transition: all 0.3s ease;
  }
  
  @media (max-width: 768px) {
    width: calc(50% - 0.75rem);
    padding: 0.75rem 0.5rem;
    font-size: 0.85rem;
    
    svg {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const FigmaEmbedContainer = styled.div`
  flex: 1;
  position: relative;
  min-height: 500px;
  background: rgba(18, 20, 44, 0.7);
  z-index: 1;
`;

const EmbedFrame = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 600px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
    transform: translateY(-4px);
  }
`;

export default FigmaEmbed;

