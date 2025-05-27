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
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    overflow-x: auto;
    padding: 1rem;
    gap: 0.5rem;
  }

  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => (props.active ? 'rgba(110, 87, 224, 0.1)' : 'transparent')};
  color: ${props => (props.active ? '#6e57e0' : '#666')};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${props => (props.active ? '#6e57e0' : 'transparent')};

  svg {
    font-size: 1rem;
  }

  &:hover {
    background: ${props => (props.active ? 'rgba(110, 87, 224, 0.1)' : 'rgba(0, 0, 0, 0.03)')};
  }
`;

const FigmaEmbedContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow: hidden;
  position: relative;
  background: #f9f9f9;
`;

const EmbedFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export default FigmaEmbed;

