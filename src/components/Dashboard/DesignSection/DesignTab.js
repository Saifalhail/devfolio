import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Tabs from '../../Common/Tabs';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle
} from '../../../styles/GlobalComponents';

/**
 * Main container for the Design tab within the dashboard.
 * This component provides the base layout and tabbed navigation
 * for the design related sections (mockups, Figma, style guide, assets).
 * Child components can reuse this container to maintain
 * consistent styling across the dashboard.
 */
const DesignTab = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const tabItems = [
    {
      id: 'mockups',
      label: t('designTab.mockups', 'Mockups'),
      content: <Placeholder>{t('designTab.mockupsPlaceholder', 'Mockup gallery coming soon')}</Placeholder>
    },
    {
      id: 'figma',
      label: t('designTab.figma', 'Figma'),
      content: <Placeholder>{t('designTab.figmaPlaceholder', 'Figma integration coming soon')}</Placeholder>
    },
    {
      id: 'styleGuide',
      label: t('designTab.styleGuide', 'Style Guide'),
      content: <Placeholder>{t('designTab.styleGuidePlaceholder', 'Style guide coming soon')}</Placeholder>
    },
    {
      id: 'assets',
      label: t('designTab.assets', 'Assets'),
      content: <Placeholder>{t('designTab.assetsPlaceholder', 'Assets library coming soon')}</Placeholder>
    }
  ];

  return (
    <Container isRTL={isRTL}>
      <PanelHeader>
        <PanelTitle>{t('designTab.title', 'Design & Prototype')}</PanelTitle>
      </PanelHeader>
      <Tabs tabs={tabItems} />
    </Container>
  );
};

const Container = styled(PanelContainer)`
  direction: ${props => (props.isRTL ? 'rtl' : 'ltr')};
`;

const Placeholder = styled.div`
  padding: 2rem;
  text-align: center;
  color: #ccc;
`;

export default DesignTab;
