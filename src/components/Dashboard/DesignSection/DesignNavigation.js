import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { PanelContainer, PanelHeader, PanelTitle } from '../../../styles/GlobalComponents';
import Tabs from '../../Common/Tabs';

/**
 * DesignNavigation - Tabbed navigation for the Design dashboard section.
 * Utilizes the reusable Tabs component for smooth transitions.
 * Sections: Mockups, Figma, Style Guide, Assets
 *
 * The content for each tab should be passed as React nodes via the `sections` prop.
 * Example usage:
 * <DesignNavigation sections={{ mockups: <MockupGallery />, figma: <FigmaEmbed />, styleGuide: <StyleGuide />, assets: <AssetsLibrary /> }} />
 */
const DesignNavigation = ({ sections = {}, onTabChange }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const tabs = [
    {
      id: 'mockups',
      label: t('design.mockups', 'Mockups'),
      content: sections.mockups || null,
    },
    {
      id: 'figma',
      label: t('design.figma', 'Figma'),
      content: sections.figma || null,
    },
    {
      id: 'styleGuide',
      label: t('design.styleGuide', 'Style Guide'),
      content: sections.styleGuide || null,
    },
    {
      id: 'assets',
      label: t('design.assets', 'Assets'),
      content: sections.assets || null,
    },
  ];

  return (
    <Container dir={isRTL ? 'rtl' : 'ltr'}>
      <PanelHeader>
        <PanelTitle>{t('design.design', 'Design')}</PanelTitle>
      </PanelHeader>
      <Tabs tabs={tabs} onTabChange={onTabChange} />
    </Container>
  );
};

const Container = styled(PanelContainer)`
  padding: 0;
`;

export default DesignNavigation;
