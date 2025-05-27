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
import { colors, spacing, typography, borderRadius } from '../../../styles/GlobalTheme';

// Mock assets data - In real implementation this would come from storage or API
const mockAssets = [
  { id: 1, name: 'Main Logo', category: 'logos', url: 'https://via.placeholder.com/300x180?text=Logo', description: 'Primary brand logo for all marketing materials' },
  { id: 2, name: 'App Icon', category: 'icons', url: 'https://via.placeholder.com/300x180?text=Icon', description: 'Mobile application icon' },
  { id: 3, name: 'Landing Illustration', category: 'images', url: 'https://via.placeholder.com/300x180?text=Image', description: 'Hero section illustration for landing page' },
  { id: 4, name: 'Secondary Logo', category: 'logos', url: 'https://via.placeholder.com/300x180?text=Logo+2', description: 'Alternative logo for dark backgrounds' },
  { id: 5, name: 'Marketing Graphic', category: 'images', url: 'https://via.placeholder.com/300x180?text=Graphic', description: 'Social media promotional graphic' },
  { id: 6, name: 'UI Icons Pack', category: 'icons', url: 'https://via.placeholder.com/300x180?text=UI+Icons', description: 'Complete set of interface icons' },
  { id: 7, name: 'Brand Pattern', category: 'images', url: 'https://via.placeholder.com/300x180?text=Pattern', description: 'Repeatable pattern for backgrounds' }
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
        <SearchWrapper isRTL={isRTL}>
          <FaSearch />
          <SearchField
            type="text"
            placeholder={t('design.searchAssets', 'Search assets...')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </SearchWrapper>
      </PanelHeader>

      <AssetsContent>
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

        <AssetsCardGrid>
          {filteredAssets.length ? (
            filteredAssets.map(asset => (
              <AssetCard key={asset.id}>
                <AssetPreview src={asset.url} alt={asset.name} />
                <AssetInfo>
                  <AssetName>{asset.name}</AssetName>
                  <AssetDescription>{asset.description}</AssetDescription>
                  <AssetCategory>{t(`design.assets.categories.${asset.category}`, asset.category)}</AssetCategory>
                </AssetInfo>
              </AssetCard>
            ))
          ) : (
            <EmptyMessage>{t('design.assets.noAssets', 'No assets found')}</EmptyMessage>
          )}
        </AssetsCardGrid>
      </AssetsContent>
    </PanelContainer>
  );
};

const AssetsContent = styled.div`
  padding: 0 1.5rem 1.5rem;
  background: rgba(35, 38, 85, 0.4);
  border-radius: 0 0 12px 12px;
`;

const AssetsCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
`;

const AssetCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(35, 38, 85, 0.6);
  backdrop-filter: blur(5px);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const AssetPreview = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: ${borderRadius.md} ${borderRadius.md} 0 0;
`;

const AssetInfo = styled.div`
  padding: ${spacing.md};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AssetName = styled.h4`
  font-size: ${typography.fontSizes.md};
  margin: 0;
  color: white;
  font-weight: 600;
`;

const AssetDescription = styled.p`
  font-size: ${typography.fontSizes.sm};
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
`;

const AssetCategory = styled.span`
  display: inline-block;
  font-size: ${typography.fontSizes.xs};
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.sm};
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.25rem;
`;

const EmptyMessage = styled.div`
  padding: ${spacing.lg};
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  grid-column: 1 / -1;
  font-size: ${typography.fontSizes.md};
  background: rgba(35, 38, 85, 0.3);
  border-radius: ${borderRadius.md};
  border: 1px dashed rgba(255, 255, 255, 0.2);
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(35, 38, 85, 0.6);
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:focus-within {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    border-color: rgba(205, 62, 253, 0.3);
    transform: translateY(-2px);
  }
  
  svg {
    color: rgba(255, 255, 255, 0.6);
    margin-right: ${props => props.isRTL ? '0' : spacing.sm};
    margin-left: ${props => props.isRTL ? spacing.sm : '0'};
    transition: color 0.3s ease;
    font-size: 1rem;
  }
  
  &:focus-within svg {
    color: #ff5b92;
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchField = styled.input`
  border: none;
  outline: none;
  width: 100%;
  background: transparent;
  font-size: ${typography.fontSizes.sm};
  color: white;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    transition: color 0.3s ease;
  }
  
  &:focus::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

export default AssetsLibrary;
