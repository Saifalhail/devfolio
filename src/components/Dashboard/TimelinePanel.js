import React, { useState } from 'react';
import styled from 'styled-components';
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
  FaFileExport
} from 'react-icons/fa';
import {
  Card,
  DashboardTitle,
  PanelHeader,
  PrimaryButton,
  Input,
  TimelineContainer,
  DateGroup,
  DateHeader,
  DateLabel,
  TimelineItem,
  TimelineIconContainer,
  TimelineContent,
  ActivityTitle,
  ActivityComment,
  ActivityMeta,
  EmptyState,
  EmptyIcon,
  EmptyText,
  ToolbarContainer
} from '../../styles/dashboardStyles';
import { format } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';

// Local styled components for search and filter
const SearchInput = styled(Input)`
  flex: 1;
  min-width: 200px;
`;

const FilterDropdown = styled.select`
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-width: 150px;
  font-size: 0.9rem;
  color: #fff;
  
  &:focus {
    outline: none;
    border-color: #cd3efd;
  }

  option {
    background: #1f1f24;
    color: #fff;
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
    <Container>
      <Header>
        <DashboardTitle>{t('timeline.activityLog', 'Activity Log')}</DashboardTitle>
        <PanelHeader>
          <SearchInput
            type="text"
            placeholder={t('timeline.search', 'Search activities...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
          <ExportContainer>
            <ExportButton onClick={() => setShowExportOptions(!showExportOptions)}>
              <FaFileExport />
              {t('timeline.export', 'Export')}
            </ExportButton>
            {showExportOptions && (
              <ExportOptions>
                <ExportOption onClick={() => handleExport('pdf')}>PDF</ExportOption>
                <ExportOption onClick={() => handleExport('csv')}>CSV</ExportOption>
                <ExportOption onClick={() => handleExport('excel')}>Excel</ExportOption>
              </ExportOptions>
            )}
          </ExportContainer>
        </PanelHeader>
      </Header>

      <TimelineContainer>
        {dateGroups.length > 0 ? (
          dateGroups.map(dateGroup => (
            <DateGroup key={dateGroup}>
              <DateHeader>
                <DateLabel>
                  {format(new Date(dateGroup), 'PPPP', { locale: isRTL ? ar : enUS })}
                </DateLabel>
              </DateHeader>
              {groupedActivities[dateGroup].map(activity => (
                <TimelineItem 
                  key={activity.id}
                  userRole={activity.user.role}
                >
                  <TimelineIconContainer userRole={activity.user.role}>
                    {activity.user.avatar ? (
                      <Avatar src={activity.user.avatar} alt={activity.user.name} />
                    ) : (
                      <IconWrapper userRole={activity.user.role}>
                        {getActivityIcon(activity.type)}
                      </IconWrapper>
                    )}
                  </TimelineIconContainer>
                  <TimelineContent>
                    <ActivityTitle>{getActivityTitle(activity)}</ActivityTitle>
                    {activity.type === 'comment' && (
                      <ActivityCommentStyle>{activity.content}</ActivityCommentStyle>
                    )}
                    <ActivityMeta>
                      <ActivityTime>{formatDate(activity.timestamp)}</ActivityTime>
                      <ActivityProject>{activity.project} • {activity.milestone}</ActivityProject>
                    </ActivityMeta>
                    <HoverDetails>
                      <HoverContent>{activity.details}</HoverContent>
                    </HoverDetails>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </DateGroup>
          ))
        ) : (
          <EmptyState>
            <EmptyIcon><FaFilter /></EmptyIcon>
            <EmptyText>{t('timeline.noActivities', 'No activities match your filters')}</EmptyText>
          </EmptyState>
        )}
      </TimelineContainer>
    </Container>
  );
};

// Additional styled components specific to TimelinePanel
const Container = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

// Using DashboardTitle from shared styles

// Using ToolbarContainer from shared styles

// Using SearchInput from shared styles

// Using FilterDropdown from shared styles

const ExportContainer = styled.div`
  position: relative;
`;

const ExportButton = styled(PrimaryButton)`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
`;

const ExportOptions = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  overflow: hidden;
`;

const ExportOption = styled.div`
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f5f5f5;
  }
`;

// Using TimelineContainer from shared styles

// Using DateGroup from shared styles

// Using DateHeader from shared styles

// Using DateLabel from shared styles

// Using TimelineItem from shared styles

// Using TimelineIconContainer from shared styles

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const IconWrapper = styled.div`
  color: white;
  font-size: 1rem;
`;

// Using TimelineContent from shared styles

// Using ActivityTitle from shared styles

// Using ActivityComment from shared styles with additional styling
const ActivityCommentStyle = styled(ActivityComment)`
  font-style: italic;
`;

// Using ActivityMeta from shared styles

const ActivityTime = styled.span``;

const ActivityProject = styled.span`
  font-weight: 500;
`;

const HoverDetails = styled.div`
  position: absolute;
  top: -40px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 10;
  
  ${TimelineContent}:hover & {
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
    border-top: 6px solid rgba(0, 0, 0, 0.8);
  }
`;

const HoverContent = styled.div`
  text-align: center;
`;

// Using EmptyState from shared styles

// Using EmptyIcon from shared styles

// Using EmptyText from shared styles

export default TimelinePanel;
