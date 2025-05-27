import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  EmptyState
} from '../../styles/GlobalComponents';
import { colors, spacing, borderRadius, typography } from '../../styles/GlobalTheme';
import { FaFlagCheckered } from 'react-icons/fa';

const ProjectTimeline = ({ milestones = [] }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const formatDate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return format(d, 'PP', { locale: isRTL ? ar : enUS });
  };

  if (!milestones.length) {
    return (
      <PanelContainer dir={isRTL ? 'rtl' : 'ltr'}>
        <PanelHeader>
          <PanelTitle>{t('timeline.projectTimeline', 'Project Timeline')}</PanelTitle>
        </PanelHeader>
        <EmptyState>
          <FaFlagCheckered size={32} color={colors.text.muted} />
          <h3>{t('timeline.noMilestones', 'No milestones available')}</h3>
        </EmptyState>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer dir={isRTL ? 'rtl' : 'ltr'}>
      <PanelHeader>
        <PanelTitle>{t('timeline.projectTimeline', 'Project Timeline')}</PanelTitle>
      </PanelHeader>
      <TimelineList>
        {milestones.map((m, idx) => (
          <TimelineItem key={idx}>
            <Circle />
            <Content>
              <MilestoneTitle>{m.title}</MilestoneTitle>
              <MilestoneDate>{formatDate(m.date)}</MilestoneDate>
              {m.description && (
                <MilestoneDescription>{m.description}</MilestoneDescription>
              )}
            </Content>
          </TimelineItem>
        ))}
      </TimelineList>
    </PanelContainer>
  );
};

const TimelineList = styled.ul`
  position: relative;
  list-style: none;
  margin: 0;
  padding-left: ${spacing.lg};

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: ${spacing.md};
    width: 2px;
    background: rgba(255, 255, 255, 0.1);
  }

  [dir='rtl'] & {
    padding-left: 0;
    padding-right: ${spacing.lg};

    &:before {
      left: auto;
      right: ${spacing.md};
    }
  }
`;

const TimelineItem = styled.li`
  position: relative;
  margin-bottom: ${spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

const Circle = styled.span`
  position: absolute;
  top: 2px;
  left: calc(-${spacing.md} - 1px);
  width: 10px;
  height: 10px;
  background: ${colors.accent.primary};
  border-radius: ${borderRadius.round};
  border: 2px solid ${colors.background.card};

  [dir='rtl'] & {
    left: auto;
    right: calc(-${spacing.md} - 1px);
  }
`;

const Content = styled.div`
  padding: ${spacing.sm} ${spacing.md};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const MilestoneTitle = styled.h4`
  margin: 0;
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.text.primary};
`;

const MilestoneDate = styled.span`
  display: block;
  margin-top: ${spacing.xs};
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
`;

const MilestoneDescription = styled.p`
  margin: ${spacing.xs} 0 0 0;
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
`;

export default ProjectTimeline;
