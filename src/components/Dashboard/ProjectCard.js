import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaUserAlt, FaCalendarAlt, FaTags } from 'react-icons/fa';
import {
  ProjectCard as Card,
  ProjectCardInner,
  ProjectHeader,
  ProjectName,
  StatusChip,
  ProjectDescription,
  DetailItem,
  DetailIcon,
  DetailContent,
  DetailLabel,
  DetailValue
} from '../../styles/GlobalComponents';
import { spacing, breakpoints } from '../../styles/GlobalTheme';

// Container for project details
const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  margin-bottom: ${spacing.md};
`;

// Row wrapper for detail items
const DetailRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.lg};

  @media (max-width: ${breakpoints.sm}) {
    flex-direction: column;
    gap: ${spacing.sm};
  }
`;

const ProjectCard = ({ project, isGrid = true }) => {
  const { t } = useTranslation();

  // Map status to localized label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'inProgress':
        return t('projects.inProgress', 'In Progress');
      case 'done':
        return t('projects.done', 'Done');
      case 'awaitingFeedback':
        return t('projects.awaitingFeedback', 'Awaiting Feedback');
      default:
        return t('projects.notStarted', 'Not Started');
    }
  };

  // Format deadline date
  const formatDeadline = (date) => {
    if (!date) return '—';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <Card isGrid={isGrid}>
      <ProjectCardInner>
        <ProjectHeader>
          <ProjectName>{project.name}</ProjectName>
        </ProjectHeader>

        <ProjectDetails>
          <DetailRow>
            <DetailItem>
              <DetailIcon>
                <FaUserAlt />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>{t('projects.client', 'Client')}</DetailLabel>
                <DetailValue>{project.client || '—'}</DetailValue>
              </DetailContent>
            </DetailItem>

            <DetailItem>
              <DetailIcon>
                <FaCalendarAlt />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>{t('projects.deadline', 'Deadline')}</DetailLabel>
                <DetailValue>{formatDeadline(project.deadline)}</DetailValue>
              </DetailContent>
            </DetailItem>
          </DetailRow>

          <DetailRow>
            <DetailItem>
              <DetailIcon>
                <FaTags />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>{t('projects.status', 'Status')}</DetailLabel>
                <StatusChip status={project.status}>
                  {getStatusLabel(project.status)}
                </StatusChip>
              </DetailContent>
            </DetailItem>
          </DetailRow>

          <ProjectDescription>
            {project.description ||
              t('projects.noDescription', 'No description provided.')}
          </ProjectDescription>
        </ProjectDetails>
      </ProjectCardInner>
    </Card>
  );
};

export default ProjectCard;
