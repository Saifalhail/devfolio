import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Tabs from '../../Common/Tabs';
import { FaPalette, FaFont, FaRuler, FaCubes } from 'react-icons/fa';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  ActionButton,
  Card
} from '../../../styles/GlobalComponents';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions
} from '../../../styles/GlobalTheme';

/**
 * Interactive Style Guide component.
 * Displays color palette, typography scale, spacing system and basic components.
 * Allows users to click a color swatch to copy its hex value.
 */
const StyleGuide = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const colorPalette = [
    { name: 'background.primary', value: colors.background.primary },
    { name: 'background.secondary', value: colors.background.secondary },
    { name: 'accent.primary', value: colors.accent.primary },
    { name: 'accent.secondary', value: colors.accent.secondary },
    { name: 'text.primary', value: colors.text.primary },
    { name: 'text.secondary', value: colors.text.secondary }
  ];

  const handleCopy = (val) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(val).catch(() => {});
    }
  };

  const renderColors = (
    <SwatchGrid isRTL={isRTL}>
      {colorPalette.map((c) => (
        <Swatch key={c.name} onClick={() => handleCopy(c.value)}>
          <ColorBox style={{ background: c.value }} />
          <SwatchLabel>{c.name}</SwatchLabel>
          <SwatchValue>{c.value}</SwatchValue>
        </Swatch>
      ))}
    </SwatchGrid>
  );

  const renderTypography = (
    <TypographyContainer isRTL={isRTL}>
      <h1 style={{ fontSize: typography.fontSizes.h1 }}>
        {t('styleGuide.sampleH1', 'Heading 1')}
      </h1>
      <h2 style={{ fontSize: typography.fontSizes.h2 }}>
        {t('styleGuide.sampleH2', 'Heading 2')}
      </h2>
      <h3 style={{ fontSize: typography.fontSizes.h3 }}>
        {t('styleGuide.sampleH3', 'Heading 3')}
      </h3>
      <p style={{ fontSize: typography.fontSizes.md }}>
        {t('styleGuide.sampleBody', 'Body text example showcasing the standard font size.')}
      </p>
      <small style={{ fontSize: typography.fontSizes.sm }}>
        {t('styleGuide.sampleSmall', 'Small text')}
      </small>
    </TypographyContainer>
  );

  const renderSpacing = (
    <SpacingGrid isRTL={isRTL}>
      {Object.entries(spacing).map(([key, val]) => (
        <SpacingItem key={key} onClick={() => handleCopy(val)}>
          <SpacingBox style={{ height: val }} />
          <span>{key}</span>
          <code>{val}</code>
        </SpacingItem>
      ))}
    </SpacingGrid>
  );

  const renderComponents = (
    <ComponentsContainer isRTL={isRTL}>
      <ActionButton>{t('styleGuide.sampleButton', 'Primary Button')}</ActionButton>
      <Card>
        <p>{t('styleGuide.sampleCard', 'Card content goes here.')}</p>
      </Card>
    </ComponentsContainer>
  );

  const tabs = [
    { id: 'colors', label: t('design.colors', 'Colors'), icon: <FaPalette />, content: renderColors },
    { id: 'typography', label: t('design.typography', 'Typography'), icon: <FaFont />, content: renderTypography },
    { id: 'spacing', label: t('design.spacing', 'Spacing'), icon: <FaRuler />, content: renderSpacing },
    { id: 'components', label: t('design.components', 'Components'), icon: <FaCubes />, content: renderComponents }
  ];

  return (
    <StyledContainer>
      <PanelHeader>
        <PanelTitle>{t('design.styleGuide', 'Style Guide')}</PanelTitle>
      </PanelHeader>
      <ContentWrapper>
        <StyledTabs tabs={tabs} initialTabId="colors" />
      </ContentWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled(PanelContainer)`
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
`;

const ContentWrapper = styled.div`
  padding: ${spacing.md} ${spacing.lg} ${spacing.lg};
`;

const StyledTabs = styled(Tabs)`
  .tab-list {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }
  
  .tab-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1rem;
    background: rgba(35, 38, 85, 0.6);
    color: white;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    &:hover {
      background: rgba(96, 49, 168, 0.7);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
    
    &[aria-selected="true"] {
      background: linear-gradient(45deg, #3a1e65 0%, #6031a8 100%);
      color: white;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    
    svg {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  .tab-content {
    background: rgba(18, 20, 44, 0.2);
    padding: 1.25rem;
    border-radius: 8px;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${spacing.md};
  direction: ${(props) => (props.isRTL ? 'rtl' : 'ltr')};
`;

const Swatch = styled.div`
  background: ${colors.gradients.card};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.md};
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition: ${transitions.medium};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.md};
  }
`;

const ColorBox = styled.div`
  width: 100%;
  height: 40px;
  border-radius: ${borderRadius.sm};
  margin-bottom: ${spacing.sm};
`;

const SwatchLabel = styled.div`
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.primary};
`;

const SwatchValue = styled.div`
  font-size: ${typography.fontSizes.xs};
  color: ${colors.text.secondary};
`;

const TypographyContainer = styled.div`
  line-height: ${typography.lineHeights.loose};
  direction: ${(props) => (props.isRTL ? 'rtl' : 'ltr')};
`;

const SpacingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${spacing.md};
  direction: ${(props) => (props.isRTL ? 'rtl' : 'ltr')};
`;

const SpacingItem = styled.div`
  background: ${colors.gradients.card};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.md};
  text-align: center;
  cursor: pointer;
`;

const SpacingBox = styled.div`
  width: 100%;
  background: ${colors.accent.primary};
  margin-bottom: ${spacing.sm};
`;

const ComponentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  direction: ${(props) => (props.isRTL ? 'rtl' : 'ltr')};
`;

export default StyleGuide;
