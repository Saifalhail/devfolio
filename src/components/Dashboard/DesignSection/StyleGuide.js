import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Tabs from '../../Common/Tabs';
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
    { id: 'colors', label: t('design.colors', 'Colors'), content: renderColors },
    { id: 'typography', label: t('design.typography', 'Typography'), content: renderTypography },
    { id: 'spacing', label: t('design.spacing', 'Spacing'), content: renderSpacing },
    { id: 'components', label: t('design.components', 'Components'), content: renderComponents }
  ];

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>{t('design.styleGuide', 'Style Guide')}</PanelTitle>
      </PanelHeader>
      <Tabs tabs={tabs} />
    </PanelContainer>
  );
};

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
