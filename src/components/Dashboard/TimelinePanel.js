import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { rtl } from '../../utils/rtl';
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
  FaSearch,
  FaPaperPlane,
  FaReply
} from 'react-icons/fa';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  ActionButton,
  SearchInput,
  EmptyState,
  IconContainer,
  ActionButtonWrapper
} from '../../styles/GlobalComponents';
import StarryBackground from '../Common/StarryBackground';
import { colors, spacing, borderRadius, shadows, mixins, transitions, typography } from '../../styles/GlobalTheme';
import { format } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';

// Removed Firebase imports to eliminate initialization issues

// Keyframe animation for the loading spinner
const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled loading spinner
const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(131, 56, 236, 0.3);
  border-radius: 50%;
  border-top: 5px solid #8338ec;
  animation: ${spinAnimation} 1s linear infinite;
  margin-bottom: 20px;
`;

// Local styled components for search and filter
const TimelineSearchInput = styled(SearchInput)`
  width: 100%;
  padding: ${spacing.sm} ${spacing.lg};
  padding-left: calc(${spacing.xl} + ${spacing.md});
  background: ${colors.background.secondary};
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: ${borderRadius.md};
  color: ${colors.text.primary};
  font-size: ${typography.fontSizes.sm};
  height: 38px;
  
  &::placeholder {
    color: ${colors.text.muted};
  }
  
  &:focus {
    outline: none;
    border-color: rgba(205, 62, 253, 0.3);
    box-shadow: ${shadows.sm};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    padding-left: ${spacing.lg};
    padding-right: calc(${spacing.xl} + ${spacing.md});
    text-align: right;
  }
`;

// Using the TimelineSearchInput defined above
// Extending with additional styles
const TimelineSearchInputExtended = styled(TimelineSearchInput)`
  flex: 1;
  min-width: 200px;
`;

const FilterDropdown = styled.select`
  padding: ${spacing.sm} ${spacing.lg};
  padding-right: ${spacing.xl};
  background: ${colors.background.secondary};
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: ${borderRadius.md};
  min-width: 180px;
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  transition: ${transitions.medium};
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: rgba(205, 62, 253, 0.3);
    box-shadow: ${shadows.sm};
  }

  option {
    background: ${colors.background.secondary};
    color: ${colors.text.secondary};
    padding: ${spacing.sm};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
    padding-right: ${spacing.lg};
    padding-left: ${spacing.xl};
  }
`;

const TimelinePanel = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [filter, setFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [taskFilter, setTaskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [error, setError] = useState(null);
  
  // Chat/forum state variables
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState({});
  const commentInputRef = useRef(null);
  
  // Error handling for general errors
  useEffect(() => {
    const handleError = (error) => {
      console.error('Error in TimelinePanel:', error);
      setError(error.message || 'An unknown error occurred');
    };
    
    // Set up error handling
    const errorHandler = (event) => {
      if (event.error) {
        handleError(event.error);
        event.preventDefault();
      }
    };
    
    window.addEventListener('error', errorHandler);
    
    // Log that we're using the mock data version
    console.log('TimelinePanel: Using mock data implementation (no Firebase)'); 
    
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  // Custom hook to simulate data loading and avoid Firebase initialization issues
  const useActivityData = () => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    
    useEffect(() => {
      // Simulate API loading delay
      const timer = setTimeout(() => {
        try {
          // Mock data instead of Firebase fetch
          const mockData = [
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
              details: 'Uploaded during milestone #2',
              isThread: true,
              replies: [
                {
                  id: 101,
                  user: {
                    name: 'Sarah Johnson',
                    role: 'developer',
                    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
                  },
                  content: 'The logo looks great! I especially like the color palette.',
                  timestamp: new Date(2025, 4, 24, 15, 45)
                }
              ]
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
              details: 'Comment on task #12',
              isThread: true,
              replies: [
                {
                  id: 201,
                  user: {
                    name: 'John Doe',
                    role: 'client',
                    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
                  },
                  content: 'Looks much better now. Can we adjust the spacing between sections?',
                  timestamp: new Date(2025, 4, 24, 11, 30)
                },
                {
                  id: 202,
                  user: {
                    name: 'Sarah Johnson',
                    role: 'developer',
                    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
                  },
                  content: "Sure, I'll make those adjustments right away.",
                  timestamp: new Date(2025, 4, 24, 13, 15)
                }
              ]
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
          setActivities(mockData);
          setIsLoading(false);
        } catch (err) {
          setLoadError(err.message || 'Failed to load activity data');
          setIsLoading(false);
        }
      }, 1500); // Simulate loading delay
      
      return () => clearTimeout(timer);
    }, []);
    
    return { activities, isLoading, loadError };
  };
        {
          id: 101,
          user: {
            name: 'Sarah Johnson',
            role: 'developer',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
          },
          content: 'The logo looks great! I especially like the color palette.',
          timestamp: new Date(2025, 4, 24, 15, 45)
        }
      ]
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
      details: 'Comment on task #12',
      isThread: true,
      replies: [
        {
          id: 201,
          user: {
            name: 'John Doe',
            role: 'client',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
          },
          content: 'Looks much better now. Can we adjust the spacing between sections?',
          timestamp: new Date(2025, 4, 24, 11, 30)
        },
        {
          id: 202,
          user: {
            name: 'Sarah Johnson',
            role: 'developer',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
          },
          content: "Sure, I'll make those adjustments right away.",
          timestamp: new Date(2025, 4, 24, 13, 15)
        }
      ]
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

  // Get unique projects from activities
  const getUniqueProjects = (activities) => {
    const projects = activities.map(activity => activity.project);
    return [...new Set(projects)].filter(Boolean);
  };

  // Get unique tasks/milestones from activities, optionally filtered by project
  const getUniqueTasks = (activities, projectName = null) => {
    const filteredActivities = projectName === 'all' || !projectName
      ? activities
      : activities.filter(activity => activity.project === projectName);
    
    const tasks = filteredActivities.map(activity => activity.milestone);
    return [...new Set(tasks)].filter(Boolean);
  };

  // Get unique projects and tasks
  const uniqueProjects = getUniqueProjects(activities);
  const uniqueTasks = getUniqueTasks(activities, projectFilter);

  // Filter activities based on selected filters and search query
  const filterActivities = (activities) => {
    return activities.filter(activity => {
      // Filter by type
      if (filter !== 'all' && !activity.type.includes(filter)) {
        return false;
      }
      
      // Filter by project
      if (projectFilter !== 'all' && activity.project !== projectFilter) {
        return false;
      }
      
      // Filter by task/milestone
      if (taskFilter !== 'all' && activity.milestone !== taskFilter) {
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
  
  // Chat/forum handlers
  const toggleReplyInput = (activityId) => {
    setShowReplyInput(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
    
    if (!showReplyInput[activityId]) {
      setActiveThreadId(activityId);
      setReplyText('');
      // Focus the input after it renders
      setTimeout(() => {
        if (commentInputRef.current) {
          commentInputRef.current.focus();
        }
      }, 100);
    }
  };
  
  const handleReplySubmit = (activityId) => {
    if (!replyText.trim()) return;
    
    // In a real app, this would send the comment to an API
    // For now, we'll just update our local state
    const updatedActivities = mockActivities.map(activity => {
      if (activity.id === activityId) {
        const newReply = {
          id: Date.now(), // Generate a unique ID
          user: {
            name: 'Developer', // In a real app, this would be the current user
            role: 'developer',
            avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
          },
          content: replyText,
          timestamp: new Date()
        };
        
        return {
          ...activity,
          replies: [...(activity.replies || []), newReply]
        };
      }
      return activity;
    });
    
    // In a real app, we would update the state with the new activities
    // For now, just clear the input and hide it
    setReplyText('');
    setShowReplyInput(prev => ({
      ...prev,
      [activityId]: false
    }));
    
    alert('Comment posted successfully!');
  };

  // Use our custom hook to get activity data
  const { activities, isLoading, loadError } = useActivityData();
  
  // Set error from the hook if there is one
  useEffect(() => {
    if (loadError) {
      setError(loadError);
    }
  }, [loadError]);

  const filteredActivities = filterActivities(activities);
  const groupedActivities = groupActivitiesByDate(filteredActivities);
  const dateGroups = Object.keys(groupedActivities).sort().reverse();

  // Show loading state
  if (isLoading && !error) {
    return (
      <PanelContainer>
        <StarryBackground intensity={0.5} />
        <PanelHeader>
          <PanelTitle>
            <IconContainer 
              icon={FaCalendarAlt} 
              color="#8338ec" 
              size="1.2em" 
              margin={isRTL ? `0 0 0 ${spacing.sm}` : `0 ${spacing.sm} 0 0`} 
            />
            {t('timeline.loadingTitle', 'Loading Timeline')}
          </PanelTitle>
        </PanelHeader>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <LoadingSpinner />
          <h3>{t('timeline.initializing', 'Loading Activity Data')}</h3>
          <p style={{ color: colors.text.secondary }}>
            {t('timeline.loadingMessage', 'Please wait while we load your activity data...')}
          </p>
        </div>
      </PanelContainer>
    );
  }
  
  // If there's an error, display it
  if (error) {
    return (
      <PanelContainer>
        <StarryBackground intensity={0.5} />
        <PanelHeader>
          <PanelTitle>
            <IconContainer 
              icon={FaCalendarAlt} 
              color="#8338ec" 
              size="1.2em" 
              margin={isRTL ? `0 0 0 ${spacing.sm}` : `0 ${spacing.sm} 0 0`} 
            />
            {t('timeline.errorTitle', 'Error Loading Timeline')}
          </PanelTitle>
        </PanelHeader>
        <div style={{ padding: '20px', color: '#e53935', background: '#ffebee', borderRadius: '4px', margin: '20px' }}>
          <h3 style={{ marginTop: 0 }}>{t('timeline.errorHeading', 'Something went wrong')}</h3>
          <p>{t('timeline.errorMessage', 'We encountered an error while loading the timeline data:')}</p>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflowX: 'auto' }}>
            {error}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              background: '#82a1bf', 
              color: 'white', 
              border: 'none', 
              padding: '10px 15px', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginTop: '15px'
            }}
          >
            {t('timeline.tryAgain', 'Try Again')}
          </button>
        </div>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer>
      <StarryBackground intensity={0.5} />
      <PanelHeader>
        <PanelTitle>
          <IconContainer
            icon={FaCalendarAlt} 
            color="#8338ec" 
            size="1.2em" 
            margin={isRTL ? `0 0 0 ${spacing.sm}` : `0 ${spacing.sm} 0 0`} 
          />
          {t('timeline.activityLog', 'Activity Timeline')}
        </PanelTitle>
        
        <ToolbarWrapper>
          <TimelineSearchWrapper>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <TimelineSearchInputExtended
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
      
      {/* Project and Task Filter Section */}
      <FilterSection>
        <FilterRow>
          <FilterGroup>
            <FilterLabel>{t('timeline.filterByProject', 'Project:')}</FilterLabel>
            <FilterDropdown
              value={projectFilter}
              onChange={(e) => {
                setProjectFilter(e.target.value);
                setTaskFilter('all'); // Reset task filter when project changes
              }}
            >
              <option value="all">{t('timeline.allProjects', 'All Projects')}</option>
              {uniqueProjects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </FilterDropdown>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>{t('timeline.filterByTask', 'Task/Milestone:')}</FilterLabel>
            <FilterDropdown
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
            >
              <option value="all">{t('timeline.allTasks', 'All Tasks')}</option>
              {uniqueTasks.map(task => (
                <option key={task} value={task}>{task}</option>
              ))}
            </FilterDropdown>
          </FilterGroup>
        </FilterRow>
      </FilterSection>
      
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
                    
                    {/* Quick Reply Button */}
                    <QuickReplyButton onClick={() => toggleReplyInput(activity.id)}>
                      <FaReply /> {t('timeline.reply', 'Reply')}
                    </QuickReplyButton>
                    
                    {/* Threaded Conversation */}
                    {activity.isThread && activity.replies && activity.replies.length > 0 && (
                      <ThreadContainer>
                        {activity.replies.map(reply => (
                          <ReplyItem key={reply.id}>
                            <ReplyAvatar src={reply.user.avatar} alt={reply.user.name} />
                            <ReplyContent>
                              <ReplyText>{reply.content}</ReplyText>
                              <ReplyMeta>
                                <span>{reply.user.name}</span>
                                <span style={{ margin: '0 4px' }}>•</span>
                                <span>{formatDate(reply.timestamp)}</span>
                              </ReplyMeta>
                            </ReplyContent>
                          </ReplyItem>
                        ))}
                      </ThreadContainer>
                    )}
                    
                    {/* Comment Input */}
                    {showReplyInput[activity.id] && (
                      <ReplyInputContainer>
                        <ReplyInput
                          ref={activeThreadId === activity.id ? commentInputRef : null}
                          type="text"
                          placeholder={t('timeline.addComment', 'Add a comment...')}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleReplySubmit(activity.id)}
                        />
                        <SendButton 
                          onClick={() => handleReplySubmit(activity.id)}
                          disabled={!replyText.trim()}
                        >
                          <FaPaperPlane />
                        </SendButton>
                      </ReplyInputContainer>
                    )}
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
const FilterSection = styled.div`
  padding: ${spacing.md} ${spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xl};
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.md};
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

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const FilterLabel = styled.label`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  white-space: nowrap;
  
  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
`;

const ToolbarSection = styled.div`
  padding: ${spacing.md} ${spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const FilterTabsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  margin: ${spacing.sm} 0;
  flex-wrap: wrap;
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.sm};
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

// FilterLabel is already defined above
const FilterLabelAlt = styled.span`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
  white-space: nowrap;
`;

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
  margin-right: ${spacing.md};
  
  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
    margin-right: 0;
    margin-bottom: ${spacing.sm};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    margin-right: 0;
    margin-left: ${spacing.md};
    
    @media (max-width: 768px) {
      margin-left: 0;
    }
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 26px;
  color: ${colors.text.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 14px; /* Control icon size */
  
  /* RTL Support */
  [dir="rtl"] & {
    left: auto;
    right: 26px;
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
  display: flex;
  align-items: center;
  justify-content: center;
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

// Chat/forum styled components
const ThreadContainer = styled.div`
  margin-top: ${spacing.md};
  margin-left: ${spacing.xl};
  padding-left: ${spacing.xl};
  border-left: 2px solid rgba(131, 56, 236, 0.3);
  
  /* RTL Support */
  [dir="rtl"] & {
    margin-left: 0;
    margin-right: ${spacing.xl};
    padding-left: 0;
    padding-right: ${spacing.xl};
    border-left: none;
    border-right: 2px solid rgba(131, 56, 236, 0.3);
  }
`;

const ReplyItem = styled.div`
  display: flex;
  padding: ${spacing.sm} 0;
  position: relative;
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const ReplyAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: ${spacing.sm};
  object-fit: cover;
  
  /* RTL Support */
  [dir="rtl"] & {
    margin-right: 0;
    margin-left: ${spacing.sm};
  }
`;

const ReplyContent = styled.div`
  flex: 1;
`;

const ReplyText = styled.p`
  margin: 0;
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.primary};
`;

const ReplyMeta = styled.div`
  font-size: ${typography.fontSizes.xs};
  color: ${colors.text.muted};
  margin-top: 4px;
  display: flex;
  align-items: center;
`;

const ReplyInputContainer = styled.div`
  display: flex;
  margin-top: ${spacing.md};
  position: relative;
  align-items: center;
`;

const ReplyInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.lg};
  color: ${colors.text.primary};
  font-size: ${typography.fontSizes.sm};
  padding-right: 40px;
  
  &:focus {
    outline: none;
    border-color: rgba(131, 56, 236, 0.5);
    box-shadow: 0 0 0 2px rgba(131, 56, 236, 0.2);
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    padding-right: ${spacing.lg};
    padding-left: 40px;
  }
`;

const SendButton = styled.button`
  position: absolute;
  right: ${spacing.sm};
  background: transparent;
  border: none;
  color: ${colors.primary.main};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xs};
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(131, 56, 236, 0.1);
    color: ${colors.primary.light};
  }
  
  &:disabled {
    color: ${colors.text.muted};
    cursor: not-allowed;
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    right: auto;
    left: ${spacing.sm};
  }
`;

const QuickReplyButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.text.muted};
  font-size: ${typography.fontSizes.xs};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s;
  margin-top: ${spacing.xs};
  
  &:hover {
    color: ${colors.primary.main};
    background: rgba(131, 56, 236, 0.1);
  }
  
  svg {
    font-size: 0.75em;
  }
`;

export default TimelinePanel;
