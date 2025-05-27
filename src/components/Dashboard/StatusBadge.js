import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { mixins } from '../../styles/GlobalTheme';

const Badge = styled.span`
  ${({ $color }) => mixins.statusBadge($color)}
  text-transform: capitalize;
`;

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();

  const { label, color } = React.useMemo(() => {
    switch (status) {
      case 'inProgress':
        return { label: t('projects.inProgress', 'In Progress'), color: 'info' };
      case 'review':
        return { label: t('projects.review', 'Review'), color: 'warning' };
      case 'done':
        return { label: t('projects.done', 'Done'), color: 'success' };
      case 'notStarted':
      default:
        return { label: t('projects.notStarted', 'Not Started'), color: 'neutral' };
    }
  }, [status, t]);

  return <Badge $color={color}>{label}</Badge>;
};

export default React.memo(StatusBadge);
