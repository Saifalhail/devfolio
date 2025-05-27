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
`;

const MockupCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  background: ${colors.background.hover};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const MockupTitle = styled.h3`
  padding: ${spacing.md};
  color: ${colors.text.primary};
  font-size: ${props => props.theme.typography.fontSizes.md};
  text-align: center;
`;


