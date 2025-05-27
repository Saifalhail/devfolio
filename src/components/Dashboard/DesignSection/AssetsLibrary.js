import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  SearchInput,
  CardGrid,
  Card,
  FilterTabs,
  FilterTab
} from '../../../styles/GlobalComponents';
import { colors, spacing, typography } from '../../../styles/GlobalTheme';

// Mock assets data - In real implementation this would come from storage or API
const mockAssets = [
  { id: 1, name: 'Main Logo', category: 'logos', url: 'https://via.placeholder.com/300x180?text=Logo' },
  { id: 2, name: 'App Icon', category: 'icons', url: 'https://via.placeholder.com/300x180?text=Icon' },
  { id: 3, name: 'Landing Illustration', category: 'images', url: 'https://via.placeholder.com/300x180?text=Image' },
  { id: 4, name: 'Secondary Logo', category: 'logos', url: 'https://via.placeholder.com/300x180?text=Logo+2' },
  { id: 5, name: 'Marketing Graphic', category: 'images', url: 'https://via.placeholder.com/300x180?text=Graphic' }
];

const categories = ['all', 'logos', 'icons', 'images'];

const AssetsLibrary = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter assets by category and search query
  const filteredAssets = mockAssets.filter(asset => {
    if (activeCategory !== 'all' && asset.category !== activeCategory) {
      return false;
    }
    if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>{t('design.assetsLibrary', 'Assets Library')}</PanelTitle>
        <SearchInput isRTL={isRTL}>
          <FaSearch />
          <input
            type="text"
            placeholder={t('design.searchAssets', 'Search assets...')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </SearchInput>
      </PanelHeader>

      <FilterTabs>
        {categories.map(cat => (
          <FilterTab
            key={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            color={colors.accent.primary}
          >
            {t(`design.assets.categories.${cat}`, cat.charAt(0).toUpperCase() + cat.slice(1))}
          </FilterTab>
        ))}
      </FilterTabs>

      <CardGrid>
        {filteredAssets.length ? (
          filteredAssets.map(asset => (
            <AssetCard key={asset.id}>
              <AssetPreview src={asset.url} alt={asset.name} />
              <AssetName>{asset.name}</AssetName>
            </AssetCard>
          ))
        ) : (
          <EmptyMessage>{t('design.assets.noAssets', 'No assets found')}</EmptyMessage>
        )}
      </CardGrid>
    </PanelContainer>
  );
};

const AssetCard = styled(Card)`
  ${''/* Center content */}
  align-items: center;
  text-align: center;
`;

const AssetPreview = styled.img`
  width: 100%;
  height: 180px;
  object-fit: contain;
  border-radius: ${spacing.md};
  margin-bottom: ${spacing.md};
`;

const AssetName = styled.div`
  color: ${colors.text.primary};
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
`;

const EmptyMessage = styled.div`
  color: ${colors.text.muted};
  font-size: ${typography.fontSizes.sm};
`;

export default AssetsLibrary;
