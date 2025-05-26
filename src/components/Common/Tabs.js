import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fadeIn, slideUp } from '../../styles/animations';
import { colors, spacing, borderRadius, transitions, typography } from '../../styles/GlobalTheme';

/**
 * Animated Tabs component for switching between multiple panels.
 *
 * @param {Array<{ id: string, label: string, content: React.ReactNode, icon?: React.ReactNode }>} tabs
 *   List of tabs with unique id, label and content.
 * @param {string} [initialTabId] - Optional id of the initially active tab.
 * @param {function} [onTabChange] - Callback when active tab changes.
 */
const Tabs = ({ tabs = [], initialTabId, onTabChange }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeTab, setActiveTab] = useState(initialTabId || (tabs[0] && tabs[0].id));

  const handleTabClick = (id) => {
    setActiveTab(id);
    onTabChange && onTabChange(id);
  };

  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <Container dir={isRTL ? 'rtl' : 'ltr'}>
      <TabList role="tablist" isRTL={isRTL}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            role="tab"
            id={`${tab.id}-tab`}
            active={activeTab === tab.id}
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </TabButton>
        ))}
      </TabList>
      {activeTabData && (
        <TabContent
          key={activeTab}
          role="tabpanel"
          id={`${activeTab}-panel`}
          aria-labelledby={`${activeTab}-tab`}
          isRTL={isRTL}
        >
          {activeTabData.content}
        </TabContent>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabList = styled.div`
  display: flex;
  gap: ${spacing.md};
  direction: ${(props) => (props.isRTL ? 'rtl' : 'ltr')};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TabButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.active ? colors.accent.primary : colors.text.secondary)};
  padding: ${spacing.sm} ${spacing.md};
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  border-bottom: 3px solid ${(props) => (props.active ? colors.accent.primary : 'transparent')};
  transition: ${transitions.medium};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};

  &:hover {
    color: ${colors.text.primary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 2px 0 ${colors.accent.primary};
  }
`;

const TabContent = styled.div`
  padding: ${spacing.md};
  margin-top: ${spacing.md};
  background: ${colors.gradients.card};
  color: ${colors.text.primary};
  border-radius: ${borderRadius.lg};
  animation: ${fadeIn} 0.3s ease, ${slideUp} 0.3s ease;
  direction: ${(props) => (props.isRTL ? 'rtl' : 'ltr')};
`;

export default Tabs;
