import React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle
} from '../../../styles/GlobalComponents';
import { colors, spacing, borderRadius, typography } from '../../../styles/GlobalTheme';
import { FaCheck } from 'react-icons/fa';

/**
 * PhaseTracker Component
 * Displays the current progress through the design phases.
 * Phases: Discovery -> Wireframes -> Mockups -> Prototypes -> Implementation
 * This component can be reused wherever a project phase tracker is needed.
 */
const PhaseTracker = ({ currentPhase = 'Discovery' }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const phases = [
    'discovery',
    'wireframes',
    'mockups',
    'prototypes',
    'implementation'
  ];

  const currentIndex = phases.indexOf(currentPhase.toLowerCase());

  return (
    <PanelContainer dir={isRTL ? 'rtl' : 'ltr'}>
      <PanelHeader>
        <PanelTitle>{t('designPhaseTracker.title', 'Design Phases')}</PanelTitle>
      </PanelHeader>
      <TimelineList>
        {phases.map((phase, idx) => {
          let status = 'upcoming';
          if (idx < currentIndex) status = 'completed';
          if (idx === currentIndex) status = 'current';

          return (
            <TimelineItem key={phase}>
              <Circle status={status}>{status === 'completed' && <FaCheck size={8} />}</Circle>
              <PhaseLabel status={status}>{t(`designPhaseTracker.${phase}`, phase)}</PhaseLabel>
            </TimelineItem>
          );
        })}
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
    left: 12px;
    width: 2px;
    background: rgba(255, 255, 255, 0.1);
  }

  [dir='rtl'] & {
    padding-left: 0;
    padding-right: ${spacing.lg};

    &:before {
      left: auto;
      right: 12px;
    }
  }
`;

const TimelineItem = styled.li`
  position: relative;
  margin-bottom: ${spacing.md};
  display: flex;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }
`;

const circleStyles = {
  completed: css`
    background: ${colors.accent.primary};
    border-color: ${colors.accent.primary};
    color: ${colors.text.primary};
  `,
  current: css`
    background: ${colors.background.hover};
    border-color: ${colors.accent.primary};
  `,
  upcoming: css`
    background: transparent;
    border-color: rgba(255, 255, 255, 0.3);
  `
};

const Circle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 2px;
  left: -${spacing.lg};
  width: 14px;
  height: 14px;
  border-radius: ${borderRadius.round};
  border: 2px solid;
  font-size: ${typography.fontSizes.xs};

  ${props => circleStyles[props.status || 'upcoming']}

  [dir='rtl'] & {
    left: auto;
    right: -${spacing.lg};
  }
`;

const PhaseLabel = styled.span`
  font-size: ${typography.fontSizes.sm};
  color: ${props => (props.status === 'upcoming' ? colors.text.secondary : colors.text.primary)};
  margin-left: ${spacing.md};
  text-transform: capitalize;

  [dir='rtl'] & {
    margin-left: 0;
    margin-right: ${spacing.md};
  }
`;

export default PhaseTracker;
