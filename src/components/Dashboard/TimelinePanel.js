import React, { useState } from 'react';
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
  FaCalendarAlt, 
  FaFilter,
  FaFileExport,
  FaSearch
} from 'react-icons/fa';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  ActionButton,
  SearchInput,
  EmptyState
} from '../../styles/GlobalComponents';
import { colors, spacing, borderRadius, shadows, mixins, transitions, typography } from '../../styles/GlobalTheme';
import { format } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';

// Local styled components for search and filter
const TimelineSearchInput = styled(SearchInput)`
  flex: 1;
  min-width: 200px;
`;

const FilterDropdown = styled.select`
  padding: ${spacing.sm} ${spacing.md};
  background: ${colors.background.secondary};
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: ${borderRadius.md};
  min-width: 150px;
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  transition: ${transitions.medium};
  
  &:focus {
    outline: none;
    border-color: rgba(205, 62, 253, 0.3);
    box-shadow: ${shadows.sm};
  }

  option {
    background: ${colors.background.secondary};
    color: ${colors.text.secondary};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
`;

const TimelinePanel = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Mock timeline data
  const mockActivities = [
    {
      id: 1,
      type: 'file_upload',
      user: {
        name: 'John Doe',
        role: 'client',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      content: 'Logo Design Final.png',
      timestamp: new Date(2025, 4, 24, 14, 30),
      project: 'DevFolio',
      milestone: 'Design Phase',
      details: 'Uploaded during milestone #2'
    },
    {
      id: 2,
      type: 'comment',
      user: {
        name: 'Sarah Johnson',
        role: 'developer',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      content: "I've updated the homepage design based on your feedback.",
      timestamp: new Date(2025, 4, 24, 10, 15),
      project: 'DevFolio',
      milestone: 'Development Phase',
      details: 'Comment on task #12'
    },
    {
      id: 3,
      type: 'task_complete',
      user: {
        name: 'Sarah Johnson',
        role: 'developer',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      content: 'Implement user authentication',
      timestamp: new Date(2025, 4, 23, 16, 45),
      project: 'DevFolio',
      milestone: 'Development Phase',
      details: 'Completed 2 days before deadline'
    },
    {
      id: 4,
      type: 'file_edit',
      user: {
        name: 'John Doe',
        role: 'client',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      content: 'Project Requirements.docx',
      timestamp: new Date(2025, 4, 23, 9, 20),
      project: 'DevFolio',
      milestone: 'Planning Phase',
      details: 'Updated project scope'
    },
    {
      id: 5,
      type: 'file_download',
      user: {
        name: 'Sarah Johnson',
        role: 'developer',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      content: 'Brand Guidelines.pdf',
      timestamp: new Date(2025, 4, 22, 11, 10),
      project: 'DevFolio',
      milestone: 'Design Phase',
      details: 'Downloaded for reference'
    },
    {
      id: 6,
      type: 'file_view',
      user: {
        name: 'John Doe',
        role: 'client',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      content: 'Homepage Mockup.jpg',
      timestamp: new Date(2025, 4, 22, 10, 5),
      project: 'DevFolio',
      milestone: 'Design Phase',
      details: 'Viewed for the first time'
    },
    {
      id: 7,
      type: 'milestone',
      user: {
        name: 'System',
        role: 'system',
        avatar: null
      },
      content: 'Design Phase completed',
      timestamp: new Date(2025, 4, 21, 17, 0),
      project: 'DevFolio',
      milestone: 'Design Phase',
      details: 'All tasks completed'
    },
    {
      id: 8,
      type: 'file_delete',
      user: {
        name: 'Sarah Johnson',
        role: 'developer',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      content: 'Old Logo Draft.png',
      timestamp: new Date(2025, 4, 21, 14, 25),
      project: 'DevFolio',
      milestone: 'Design Phase',
      details: 'Removed outdated file'
    }
  ];

  // Format date for display
  const formatDate = (date) => {
    return format(date, 'PPpp', {
      locale: isRTL ? ar : enUS
    });
  };

  // Group activities by date
  const groupActivitiesByDate = (activities) => {
    const groups = {};
    activities.forEach(activity => {
      const dateStr = format(activity.timestamp, 'yyyy-MM-dd');
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(activity);
    });
    return groups;
  };

  // Filter activities based on selected filter and search query
  const filterActivities = (activities) => {
    return activities.filter(activity => {
      // Filter by type
      if (filter !== 'all' && !activity.type.includes(filter)) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !activity.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !activity.user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !activity.project.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !activity.milestone.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  const getActivityIcon = (type) => {
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

  const getActivityTitle = (activity) => {
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

  const handleExport = (format) => {
    // In a real implementation, this would generate and download the report
    alert(`Exporting timeline in ${format} format`);
    setShowExportOptions(false);
  };

  const filteredActivities = filterActivities(mockActivities);
  const groupedActivities = groupActivitiesByDate(filteredActivities);
  const dateGroups = Object.keys(groupedActivities).sort().reverse();

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>{t('timeline.activityLog', 'Activity Timeline')}</PanelTitle>
        <ToolbarWrapper>
          <TimelineSearchWrapper>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <TimelineSearchInput
              type="text"
              placeholder={t('timeline.search', 'Search activities...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </TimelineSearchWrapper>
          
          <FilterWrapper>
            <FilterIcon isRTL={isRTL}>
              <FaFilter />
            </FilterIcon>
            <FilterDropdown
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">{t('timeline.allActivities', 'All Activities')}</option>
              <option value="file">{t('timeline.files', 'Files')}</option>
              <option value="task">{t('timeline.tasks', 'Tasks')}</option>
              <option value="comment">{t('timeline.comments', 'Comments')}</option>
              <option value="milestone">{t('timeline.milestones', 'Milestones')}</option>
            </FilterDropdown>
          </FilterWrapper>
          
          <ExportWrapper>
            <ActionButton onClick={() => setShowExportOptions(!showExportOptions)}>
              <FaFileExport />
              {t('timeline.export', 'Export')}
            </ActionButton>
            {showExportOptions && (
              <ExportMenu>
                <ExportItem onClick={() => handleExport('pdf')}>
                  <FaFileExport /> {t('timeline.exportAsPDF', 'Export as PDF')}
                </ExportItem>
                <ExportItem onClick={() => handleExport('csv')}>
                  <FaFileExport /> {t('timeline.exportAsCSV', 'Export as CSV')}
                </ExportItem>
              </ExportMenu>
            )}
          </ExportWrapper>
        </ToolbarWrapper>
      </PanelHeader>
      
      <TimelineContent>
        {dateGroups.length > 0 ? (
          dateGroups.map(dateGroup => (
            <DateGroup key={dateGroup}>
              <DateHeader>
                <DateLabel>
                  {format(new Date(dateGroup), 'PPPP', { locale: isRTL ? ar : enUS })}
                </DateLabel>
              </DateHeader>
              {groupedActivities[dateGroup].map(activity => (
                <ActivityItem 
                  key={activity.id}
                  userRole={activity.user.role}
                >
                  <ActivityIconContainer userRole={activity.user.role}>
                    {activity.user.avatar ? (
                      <Avatar src={activity.user.avatar} alt={activity.user.name} />
                    ) : (
                      <IconWrapper userRole={activity.user.role}>
                        {getActivityIcon(activity.type)}
                      </IconWrapper>
                    )}
                  </ActivityIconContainer>
                  <ActivityContentWrapper>
                    <ActivityTitle>{getActivityTitle(activity)}</ActivityTitle>
                    {activity.type === 'comment' && (
                      <ActivityComment>{activity.content}</ActivityComment>
                    )}
                    <ActivityMetaData>
                      <ActivityTime>{formatDate(activity.timestamp)}</ActivityTime>
                      <ActivityProject>{activity.project} • {activity.milestone}</ActivityProject>
                    </ActivityMetaData>
                    <HoverDetails>
                      <HoverContent>{activity.details}</HoverContent>
                    </HoverDetails>
                  </ActivityContentWrapper>
                </ActivityItem>
              ))}
            </DateGroup>
          ))
        ) : (
          <EmptyState>
            <FaFilter size={32} color={colors.text.muted} />
            <h3>{t('timeline.noActivities', 'No activities match your filters')}</h3>
            <p>{t('timeline.tryDifferent', 'Try a different filter or search term')}</p>
          </EmptyState>
        )}
      </TimelineContent>
    </PanelContainer>
  );
};

// Styled components for the timeline panel
const ToolbarWrapper = styled.div`
  ${mixins.flexBetween}
  flex-wrap: wrap;
  gap: ${spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.sm};
    margin-top: ${spacing.md};
    width: 100%;
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

const TimelineSearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 300px;
  
  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${spacing.sm};
  color: ${colors.text.muted};
  
  /* RTL Support */
  [dir="rtl"] & {
    left: auto;
    right: ${spacing.sm};
  }
`;

const FilterWrapper = styled.div`
  position: relative;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterIcon = styled.div`
  position: absolute;
  ${props => props.isRTL ? css`right: ${spacing.sm};` : css`left: ${spacing.sm};`}
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.text.muted};
  z-index: 1;
  pointer-events: none;
`;

const ExportWrapper = styled.div`
  position: relative;
`;

const ExportMenu = styled.div`
  position: absolute;
  top: calc(100% + ${spacing.xs});
  right: 0;
  background: ${colors.background.card};
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: ${shadows.md};
  z-index: 10;
  overflow: hidden;
  min-width: 180px;
  
  /* RTL Support */
  [dir="rtl"] & {
    right: auto;
    left: 0;
  }
`;

const ExportItem = styled.div`
  ${mixins.flexCenter}
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
  cursor: pointer;
  transition: ${transitions.medium};
  color: ${colors.text.secondary};
  justify-content: flex-start;
  
  &:hover {
    background: ${colors.background.hover};
    color: ${colors.text.primary};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  padding: ${spacing.md};
  margin-top: ${spacing.md};
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
`;

const DateGroup = styled.div`
  margin-bottom: ${spacing.lg};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DateHeader = styled.div`
  margin-bottom: ${spacing.md};
  padding-bottom: ${spacing.xs};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const DateLabel = styled.h3`
  margin: 0;
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.text.primary};
`;

const ActivityItem = styled.div`
  display: flex;
  margin-bottom: ${spacing.md};
  padding: ${spacing.md};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: ${transitions.medium};
  
  &:hover {
    background: rgba(255, 255, 255, 0.03);
    transform: translateY(-2px);
    box-shadow: ${shadows.sm};
  }
  
  /* Add color accent based on user role */
  ${props => {
    if (props.userRole === 'client') {
      return css`border-left: 3px solid ${colors.status.info};`;
    } else if (props.userRole === 'developer') {
      return css`border-left: 3px solid ${colors.status.success};`;
    } else if (props.userRole === 'system') {
      return css`border-left: 3px solid ${colors.status.neutral};`;
    } else {
      return '';
    }
  }}
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
    ${props => {
      if (props.userRole === 'client') {
        return css`
          border-left: none;
          border-right: 3px solid ${colors.status.info};
        `;
      } else if (props.userRole === 'developer') {
        return css`
          border-left: none;
          border-right: 3px solid ${colors.status.success};
        `;
      } else if (props.userRole === 'system') {
        return css`
          border-left: none;
          border-right: 3px solid ${colors.status.neutral};
        `;
      } else {
        return '';
      }
    }}
  }
`;

const ActivityIconContainer = styled.div`
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
  
  /* RTL Support */
  [dir="rtl"] & {
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

const ActivityContentWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const ActivityTitle = styled.h4`
  margin: 0 0 ${spacing.xs} 0;
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.text.primary};
`;

const ActivityComment = styled.p`
  margin: ${spacing.xs} 0;
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  font-style: italic;
  padding: ${spacing.sm};
  background: rgba(255, 255, 255, 0.03);
  border-radius: ${borderRadius.sm};
  border-left: 2px solid ${colors.accent.primary};
  
  /* RTL Support */
  [dir="rtl"] & {
    border-left: none;
    border-right: 2px solid ${colors.accent.primary};
  }
`;

const ActivityMetaData = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${spacing.xs};
  font-size: ${typography.fontSizes.xs};
  color: ${colors.text.muted};
  gap: ${spacing.md};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const ActivityTime = styled.span`
  ${mixins.flexCenter}
  gap: ${spacing.xs};
  
  &:before {
    content: '\1F551'; /* clock emoji */
    font-size: ${typography.fontSizes.sm};
  }
`;

const ActivityProject = styled.span`
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.text.secondary};
`;

const HoverDetails = styled.div`
  position: absolute;
  top: -40px;
  left: 0;
  right: 0;
  background: ${colors.background.card};
  color: ${colors.text.primary};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSizes.xs};
  opacity: 0;
  transform: translateY(10px);
  transition: ${transitions.medium};
  pointer-events: none;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: ${shadows.md};
  
  ${ActivityContentWrapper}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 20px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid ${colors.background.card};
    
    /* RTL Support */
    [dir="rtl"] & {
      left: auto;
      right: 20px;
    }
  }
`;

const HoverContent = styled.div`
  text-align: center;
`;

export default TimelinePanel;
