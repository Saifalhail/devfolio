import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  Card,
  EmptyState
} from '../../../styles/GlobalComponents';
import { colors, spacing, typography } from '../../../styles/GlobalTheme';

const MilestoneDelivery = ({ milestones = [] }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!milestones.length) {
    return (
      <PanelContainer dir={isRTL ? 'rtl' : 'ltr'}>
        <PanelHeader>
          <PanelTitle>{t('invoices.milestoneDelivery.title', 'Milestone Delivery')}</PanelTitle>
        </PanelHeader>
        <EmptyState>
          <FaLock size={32} color={colors.text.muted} />
          <h3>{t('invoices.milestoneDelivery.noMilestones', 'No milestones available')}</h3>
        </EmptyState>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer dir={isRTL ? 'rtl' : 'ltr'}>
      <PanelHeader>
        <PanelTitle>{t('invoices.milestoneDelivery.title', 'Milestone Delivery')}</PanelTitle>
      </PanelHeader>
      <MilestoneGrid>
        {milestones.map(m => (
          <MilestoneCard key={m.id} unlocked={m.paid}>
            <CardHeader>
              {m.paid ? (
                <FaCheckCircle color={colors.status.success} />
              ) : (
                <FaLock color={colors.status.warning} />
              )}
              <span>{m.title}</span>
            </CardHeader>
            {m.description && <Description>{m.description}</Description>}
          </MilestoneCard>
        ))}
      </MilestoneGrid>
    </PanelContainer>
  );
};

const MilestoneGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${spacing.md};
`;

const MilestoneCard = styled(Card)`
  padding: ${spacing.md};
  opacity: ${props => (props.unlocked ? 1 : 0.6)};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  margin-bottom: ${spacing.sm};

  svg {
    font-size: ${typography.fontSizes.lg};
  }
`;

const Description = styled.p`
  margin: 0;
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
`;

export default MilestoneDelivery;
