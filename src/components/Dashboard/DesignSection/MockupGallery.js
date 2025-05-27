import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  DashboardPanelContainer,
  PanelHeader,
  DashboardTitle,
  Card,
  CardGrid
} from '../../../styles/dashboardStyles';
import { colors, spacing, borderRadius, transitions } from '../../../styles/GlobalTheme';
import LazyImage from '../../Common/LazyImage';

// -----------------------------------------------------------------------------
// MockupGallery Component
// -----------------------------------------------------------------------------
// Displays design mockups in a filterable gallery view. This component can be
// reused anywhere a simple responsive image gallery with category filters is
// needed.
// -----------------------------------------------------------------------------

const sampleMockups = [
  { id: 1, title: 'Mobile Landing', image: 'https://via.placeholder.com/600x400/513a52/FFFFFF?text=Mobile+1', device: 'mobile' },
  { id: 2, title: 'Desktop Dashboard', image: 'https://via.placeholder.com/800x500/2c1e3f/FFFFFF?text=Desktop+1', device: 'desktop' },
  { id: 3, title: 'Tablet Checkout', image: 'https://via.placeholder.com/700x450/6e57e0/FFFFFF?text=Tablet+1', device: 'tablet' },
  { id: 4, title: 'Mobile Settings', image: 'https://via.placeholder.com/600x400/513a52/FFFFFF?text=Mobile+2', device: 'mobile' },
  { id: 5, title: 'Desktop Reports', image: 'https://via.placeholder.com/800x500/2c1e3f/FFFFFF?text=Desktop+2', device: 'desktop' },
];

const FILTERS = ['all', 'mobile', 'desktop', 'tablet'];

const MockupGallery = () => {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState('all');
  const isRTL = i18n.language === 'ar';

  const filteredMockups = sampleMockups.filter(m =>
    filter === 'all' || m.device === filter
  );

  return (
    <GalleryContainer dir={isRTL ? 'rtl' : 'ltr'}>
      <PanelHeader as="header">
        <DashboardTitle>{t('design.mockupGallery.title', 'Mockups')}</DashboardTitle>
        <Filters>
          {FILTERS.map(key => (
            <FilterButton
              key={key}
              active={filter === key}
              onClick={() => setFilter(key)}
              aria-label={t(`design.mockupGallery.filters.${key}`, key)}
            >
              {t(`design.mockupGallery.filters.${key}`, key)}
            </FilterButton>
          ))}
        </Filters>
      </PanelHeader>

      <GalleryGrid>
        {filteredMockups.map(mockup => (
          <MockupCard key={mockup.id}>
            <ImageWrapper>
              <LazyImage src={mockup.image} alt={mockup.title} />
            </ImageWrapper>
            <MockupTitle>{mockup.title}</MockupTitle>
          </MockupCard>
        ))}
      </GalleryGrid>
    </GalleryContainer>
  );
};

export default MockupGallery;

// -----------------------------------------------------------------------------
// Styled Components
// -----------------------------------------------------------------------------

const GalleryContainer = styled(DashboardPanelContainer)`
  padding: ${spacing.lg};
`;

const Filters = styled.div`
  display: flex;
  gap: ${spacing.sm};
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: ${props => (props.active ? colors.gradients.accent : 'transparent')};
  color: ${colors.text.primary};
  border: 1px solid
    ${props => (props.active ? 'transparent' : 'rgba(255, 255, 255, 0.2)')};
  border-radius: ${borderRadius.md};
  padding: ${spacing.xs} ${spacing.md};
  cursor: pointer;
  transition: ${transitions.medium};
  font-size: ${props => props.theme.typography.fontSizes.sm};

  &:hover {
    background: ${colors.gradients.hover};
    transform: translateY(-2px);
  }
`;

const GalleryGrid = styled(CardGrid)`
  margin-bottom: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.75rem;
  }
`;

const MockupCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: rgba(35, 38, 85, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 160px;
  background: rgba(18, 20, 44, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  ${MockupCard}:hover & img {
    transform: scale(1.05);
  }
`;

const MockupTitle = styled.h3`
  padding: 0.75rem;
  margin: 0;
  color: white;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: rgba(35, 38, 85, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;


