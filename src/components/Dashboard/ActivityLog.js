import React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  FaUser,
  FaFileUpload,
  FaCommentAlt,
  FaCheck,
  FaEdit,
  FaTrash,
  FaDownload,
  FaEye,
  FaCalendarAlt
} from 'react-icons/fa';
import { PanelContainer, PanelHeader, PanelTitle, EmptyState } from '../../styles/GlobalComponents';
import { colors, spacing, borderRadius, shadows, mixins, transitions, typography } from '../../styles/GlobalTheme';
import { format } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';

/**
 * ActivityLog component
 * Displays a chronological list of recent project activities.
 * @param {Object[]} activities - List of activity objects sorted by timestamp.
 */
const ActivityLog = ({ activities = [] }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const sorted = [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const formatDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return format(d, 'PPpp', { locale: isRTL ? ar : enUS });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'file_upload':
        return <FaFileUpload />;
      case 'comment':
        return <FaCommentAlt />;
      case 'task_complete':
        return <FaCheck />;
      case 'file_edit':
        return <FaEdit />;
      case 'file_delete':
        return <FaTrash />;
      case 'file_download':
        return <FaDownload />;
      case 'file_view':
        return <FaEye />;
      case 'milestone':
        return <FaCalendarAlt />;
      default:
        return <FaUser />;
    }
  };

  const getTitle = (activity) => {
    switch (activity.type) {
      case 'file_upload':
        return t('timeline.fileUploaded', '{{user}} uploaded {{file}}', {
          user: activity.user.name,
          file: activity.content
        });
      case 'comment':
        return t('timeline.commentAdded', '{{user}} commented', {
          user: activity.user.name
        });
      case 'task_complete':
        return t('timeline.taskCompleted', '{{user}} completed task: {{task}}', {
          user: activity.user.name,
          task: activity.content
        });
      case 'file_edit':
        return t('timeline.fileEdited', '{{user}} edited {{file}}', {
          user: activity.user.name,
          file: activity.content
        });
      case 'file_delete':
        return t('timeline.fileDeleted', '{{user}} deleted {{file}}', {
          user: activity.user.name,
          file: activity.content
        });
      case 'file_download':
        return t('timeline.fileDownloaded', '{{user}} downloaded {{file}}', {
          user: activity.user.name,
          file: activity.content
        });
      case 'file_view':
        return t('timeline.fileViewed', '{{user}} viewed {{file}}', {
          user: activity.user.name,
          file: activity.content
        });
      case 'milestone':
        return t('timeline.milestoneReached', '{{milestone}}', {
          milestone: activity.content
        });
      default:
        return activity.content;
    }
  };

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>{t('timeline.activityLog', 'Activity Timeline')}</PanelTitle>
      </PanelHeader>
      {sorted.length ? (
        <List role="list">
          {sorted.map((act) => (
            <Item key={act.id} userRole={act.user.role} dir={isRTL ? 'rtl' : 'ltr'}>
              <IconContainer userRole={act.user.role}>
                {act.user.avatar ? (
                  <Avatar src={act.user.avatar} alt={act.user.name} />
                ) : (
                  <IconWrapper userRole={act.user.role}>{getIcon(act.type)}</IconWrapper>
                )}
              </IconContainer>
              <Content>
                <Title>{getTitle(act)}</Title>
                <Meta>{formatDate(act.timestamp)}</Meta>
              </Content>
            </Item>
          ))}
        </List>
      ) : (
        <EmptyState>
          <p>{t('timeline.noActivities', 'No activities match your filters')}</p>
        </EmptyState>
      )}
    </PanelContainer>
  );
};

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  max-height: 400px;
  overflow-y: auto;
`;

const Item = styled.li`
  ${mixins.flexBetween};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: ${spacing.md};
  transition: ${transitions.medium};

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    box-shadow: ${shadows.sm};
  }

  [dir='rtl'] & {
    flex-direction: row-reverse;
  }
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: ${spacing.md};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => {
    if (props.userRole === 'client') {
      return css`background: rgba(33, 150, 243, 0.2);`;
    } else if (props.userRole === 'developer') {
      return css`background: rgba(76, 175, 80, 0.2);`;
    } else if (props.userRole === 'system') {
      return css`background: rgba(158, 158, 158, 0.2);`;
    } else {
      return css`background: rgba(205, 62, 253, 0.2);`;
    }
  }}

  [dir='rtl'] & {
    margin-right: 0;
    margin-left: ${spacing.md};
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const IconWrapper = styled.div`
  color: ${props => {
    if (props.userRole === 'client') {
      return colors.status.info;
    } else if (props.userRole === 'developer') {
      return colors.status.success;
    } else if (props.userRole === 'system') {
      return colors.status.neutral;
    } else {
      return colors.accent.primary;
    }
  }};
  font-size: ${typography.fontSizes.lg};
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h4`
  margin: 0 0 ${spacing.xs} 0;
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.text.primary};
`;

const Meta = styled.span`
  font-size: ${typography.fontSizes.xs};
  color: ${colors.text.muted};
`;

export default ActivityLog;
