import React, {
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
  useMemo,
  useCallback
} from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaCheck } from 'react-icons/fa';
import StarryBackground from '../Common/StarryBackground';
import {
  DashboardTitle,
  PanelContainer,
  PanelHeader as SharedPanelHeader,
  Card,
  Grid,
  CardGrid,
  FlexContainer,
  IconButton,
  PrimaryButton,
  SecondaryButton,
  Badge,
  DashboardPanel,
  CountdownContainer,
  CountdownDate,
  CountdownTimers,
  CountdownItem,
  CountdownValue,
  CountdownLabel,
  InteractionContainer,
  InteractionIcon,
  InteractionDetails,
  InteractionTitle,
  InteractionTime,
  InteractionType,
  ProgressTitle,
  ProgressWrapper,
  CompactProgressWrapper,
  ProgressStats,
  StatItem,
  StatLabel,
  StatValue,
  CompactStatItem,
  ProgressBar,
  ProgressText,
  TaskItem,
  TaskStatus,
  TaskText
} from '../../styles/dashboardStyles';
import { 
  FaChartLine, FaClock, FaFileUpload, FaRobot, FaArrowRight, FaTimes, FaBars,
  FaHome, FaProjectDiagram, FaFileAlt, FaClipboardList, FaFileInvoiceDollar, FaHistory, FaCog,
  FaCalendarAlt, FaLightbulb, FaClipboardCheck, FaUser, FaSignOutAlt, FaPlus,
  FaThLarge, FaStream, FaTachometerAlt, FaColumns, FaLayerGroup, FaThList, FaCommentAlt,
  FaFigma
} from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Navbar from '../Layout/Navbar';
import Sidebar from './Sidebar';
import VirtualizedList from '../Common/VirtualizedList';
import SummaryCard from './SummaryCard';


import ProjectsPanel from './ProjectsPanel';
const ProjectNotes = lazy(() => import('./ProjectNotes'));
const AddProjectModal = lazy(() => import('./AddProjectModal'));
const TasksPanel = lazy(() => import('./TasksPanel'));
const FilesPanel = lazy(() => import('./FilesPanel'));
const FormsPanel = lazy(() => import('./FormsPanel'));
const ForumsHome = lazy(() => import('./Forums/ForumsHome.tsx'));

const DesignPanel = lazy(() => import('./DesignPanel'));
const InvoicingPanel = lazy(() => import('./InvoicingPanel'));
const PostLaunchPanel = lazy(() => import('./PostLaunchPanel'));
const TaskCardDemo = lazy(() => import('../Common/TaskCardDemo'));

const Dashboard = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'projects', 'tasks'

  
  // Mock data for demonstration purposes
  const mockData = {
    projectName: "Projects",
    activeProjects: 3,
    totalProjects: 5,
    progress: 68,
    nextDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    lastInteraction: {
      type: "file",
      name: "homepage-mockup.png",
      time: "2 hours ago"
    },
    weeklyFocus: {
      title: "Authentication System",
      progress: 75,
      tasks: 8,
      completed: 6,
      taskList: [
        { id: 1, text: 'Update user authentication', status: 'done' },
        { id: 2, text: 'Create password reset flow', status: 'done' },
        { id: 3, text: 'Implement email verification', status: 'done' },
        { id: 4, text: 'Design 2FA interface', status: 'pending' },
        { id: 5, text: 'Integrate with OAuth providers', status: 'pending' }
      ]
    }
  };

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.greeting.morning', 'Good Morning');
    if (hour < 18) return t('dashboard.greeting.afternoon', 'Good Afternoon');
    return t('dashboard.greeting.evening', 'Good Evening');
  };
  
  const greeting = useMemo(() => getGreeting(), [i18n.language]);
  
  // Calculate time remaining until deadline
  const calculateTimeRemaining = () => {
    const now = new Date();
    const difference = mockData.nextDeadline - now;
    
    // Convert to days, hours, minutes
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };
  
  const timeRemaining = useMemo(
    () => calculateTimeRemaining(),
    [mockData.nextDeadline]
  );
  
  // Update time remaining every minute
  useEffect(() => {
    const timer = setInterval(() => {
      calculateTimeRemaining();
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Set active tab based on URL path
  useEffect(() => {
    if (location.pathname.includes('/dashboard/projects')) {
      setActiveTab('projects');
    } else if (location.pathname.includes('/dashboard/tasks')) {
      setActiveTab('tasks');
    } else if (location.pathname.includes('/dashboard/files')) {
      setActiveTab('files');
    } else if (location.pathname.includes('/dashboard/forms')) {
      setActiveTab('forms');
    } else if (location.pathname.includes('/dashboard/chat')) {
      setActiveTab('chat');
    } else if (location.pathname.includes('/dashboard/forums')) {
      setActiveTab('chat'); // Forums are under the chat tab
    } else if (location.pathname.includes('/dashboard/design')) {
      setActiveTab('design');
    } else if (location.pathname.includes('/dashboard/invoices')) {
      setActiveTab('invoices');
    } else if (location.pathname.includes('/dashboard/post-launch')) {
      setActiveTab('post-launch');
    } else if (location.pathname.includes('/dashboard/card-demo')) {
      setActiveTab('card-demo');
    } else {
      setActiveTab('overview');
    }
    console.log('Current path:', location.pathname, 'Active tab:', activeTab);
  }, [location.pathname]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setMobileView(true);
        setSidebarOpen(false);
      } else {
        setMobileView(false);
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scrolling when sidebar is open on mobile
  useEffect(() => {
    if (mobileView && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileView, sidebarOpen]);
  
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const toggleSidebarCollapse = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);
  
  const toggleChatbot = useCallback(() => {
    setShowChatbot(prev => !prev);
  }, []);

  const touchStartX = useRef(null);
  const touchCurrentX = useRef(null);

  const handlePageTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  }, []);

  const handlePageTouchMove = useCallback((e) => {
    if (touchStartX.current === null) return;
    touchCurrentX.current = e.touches[0].clientX;
  }, []);

  const handlePageTouchEnd = useCallback(() => {
    if (touchStartX.current === null) return;
    const diff = touchCurrentX.current - touchStartX.current;
    const threshold = 50;

    if (!sidebarOpen) {
      if (!isRTL && touchStartX.current < 30 && diff > threshold) {
        setSidebarOpen(true);
      } else if (isRTL && touchStartX.current > window.innerWidth - 30 && diff < -threshold) {
        setSidebarOpen(true);
      }
    } else {
      if (!isRTL && diff < -threshold) {
        setSidebarOpen(false);
      } else if (isRTL && diff > threshold) {
        setSidebarOpen(false);
      }
    }

    touchStartX.current = null;
    touchCurrentX.current = null;
  }, [isRTL, sidebarOpen]);
  
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }, [logout, navigate]);

  if (loading) {
    return (
      <DashboardLoading>
        <LoadingSpinner />
        <p>{t('dashboard.loading', 'Loading Dashboard...')}</p>
      </DashboardLoading>
    );
  }

  return (
    <Suspense
      fallback={(
        <DashboardLoading>
          <LoadingSpinner />
          <p>{t('dashboard.loading', 'Loading Dashboard...')}</p>
        </DashboardLoading>
      )}
    >
    <DashboardPage
      onTouchStart={handlePageTouchStart}
      onTouchMove={handlePageTouchMove}
      onTouchEnd={handlePageTouchEnd}
    >
      {/* Add Project Modal */}
      {showAddProjectModal && (
        <Suspense fallback={<LoadingSpinner />}>
          <AddProjectModal
            isOpen={showAddProjectModal}
            onClose={() => setShowAddProjectModal(false)}
            onProjectAdded={() => {
              // Refresh projects or handle new project added
              setShowAddProjectModal(false);
            }}
          />
        </Suspense>
      )}
      
      <NavbarArea>
        <NavbarContent>
          <Navbar hideMenu={true} style={{ width: '100%' }} />
        </NavbarContent>
      </NavbarArea>
      
      <DashboardBody $isRTL={isRTL}>
        <SidebarArea data-testid="sidebar-area" $isOpen={sidebarOpen} $isMobile={mobileView} $isRTL={isRTL} $collapsed={sidebarCollapsed}>
          <Sidebar
            active={activeTab}
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
            onClose={() => setSidebarOpen(false)}
          />
        </SidebarArea>
        
        {mobileView && sidebarOpen && (
          <SidebarBackdrop
            type="button"
            aria-label={t('dashboard.closeSidebar', 'Close sidebar')}
            data-testid="sidebar-backdrop"
            onClick={toggleSidebar}
          />
        )}
        
        <ContentArea
          $sidebarOpen={sidebarOpen}
          $isMobile={mobileView}
          $isRTL={isRTL}
          $collapsed={sidebarCollapsed}
        >
          {/* Starry background effect for all tabs */}
          <BackgroundWrapper>
            <StarryBackground color="#a78bfa" starCount={200} blurAmount={8} opacity={1} />
          </BackgroundWrapper>
          
          <DashboardContent>
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                {/* Welcome Section */}
                <WelcomeSection>
                  <WelcomeLayout>
                    <WelcomeText>
                      <h1>{greeting}, {currentUser?.displayName || currentUser?.email}</h1>
                      <h2>{t('dashboard.welcomeBack', 'Welcome back to your')} <span>{t('dashboard.workspace', 'workspace')}</span></h2>
                    </WelcomeText>
                    <ProgressInfoContainer>
                      <CompactProgressWrapper>
                        <CircularProgressbar
                          value={mockData.progress}
                          text={`${mockData.progress}%`}
                          styles={buildStyles({
                            textSize: '22px',
                            pathTransitionDuration: 0.5,
                            pathColor: '#cd3efd',
                            textColor: '#fff',
                            trailColor: 'rgba(255, 255, 255, 0.1)',
                            rotation: 0.25,
                            strokeLinecap: 'round',
                          })}
                        />
                      </CompactProgressWrapper>
                      <div>
                        <CompactProgressTitle>{t('dashboard.activeProjects', 'Active Projects')}</CompactProgressTitle>
                        <CompactStatItem>
                          <StatValue>{mockData.activeProjects}</StatValue>
                          <StatLabel>{t('dashboard.outOf', 'out of')} {mockData.totalProjects}</StatLabel>
                        </CompactStatItem>
                      </div>
                    </ProgressInfoContainer>
                  </WelcomeLayout>
                </WelcomeSection>

                <SummaryGrid>
                  <SummaryCard
                    icon={<FaProjectDiagram />}
                    title={t('dashboard.activeProjects', 'Active Projects')}
                    value={mockData.activeProjects}
                  />
                  <SummaryCard
                    icon={<FaClipboardList />}
                    title={t('dashboard.pendingActions', 'Pending Actions')}
                    value={3}
                  />
                  <SummaryCard
                    icon={<FaFileUpload />}
                    title={t('dashboard.latestUploads', 'Latest Uploads')}
                    value={2}
                  />
                  <SummaryCard
                    icon={<FaCalendarAlt />}
                    title={t('dashboard.projectDeadlines', 'Project Deadlines')}
                    value={mockData.totalProjects}
                  />
                </SummaryGrid>
                
                {/* Dashboard Panels */}
                <DashboardPanels>
                  <DashboardColumn>
                    <DashboardPanel>
                      <PanelHeader>
                        <ProgressTitle>{mockData.projectName}</ProgressTitle>
                        <FocusProgressText>
                          <span>{mockData.activeProjects} {t('dashboard.active', 'active')}</span>
                        </FocusProgressText>
                      </PanelHeader>
                      <div style={{ padding: '0 1.5rem' }}>
                        <ProgressBar progress={mockData.progress} />
                        <FocusProgressText>
                          <span>{mockData.progress}% {t('dashboard.complete', 'complete')}</span>
                        </FocusProgressText>
                      </div>
                      <ProjectNotes />
                    </DashboardPanel>
                  </DashboardColumn>
                  
                  <DashboardColumn>
                    <DashboardPanel>
                      <PanelHeader>
                        <ProgressTitle>{t('dashboard.weeklyFocus', 'Weekly Focus')}</ProgressTitle>
                      </PanelHeader>
                      <FocusContainer>
                        <FocusTitle>{mockData.weeklyFocus.title}</FocusTitle>
                        <FocusProgress>
                          <FocusProgressBar progress={mockData.weeklyFocus.progress} />
                          <FocusProgressText>
                            <span>{mockData.weeklyFocus.progress}% {t('dashboard.complete', 'complete')}</span>
                            <span>{mockData.weeklyFocus.completed}/{mockData.weeklyFocus.tasks} {t('dashboard.tasks', 'tasks')}</span>
                          </FocusProgressText>
                        </FocusProgress>
                        <FocusTasks>
                          <VirtualizedList
                            items={mockData.weeklyFocus.taskList}
                            itemHeight={40}
                            height={200}
                            renderItem={(task) => (
                              <TaskItem key={task.id}>
                                <TaskStatus status={task.status}>
                                  {task.status === 'done' ? <FaCheck /> : <FaClock />}
                                </TaskStatus>
                                <TaskText status={task.status}>{task.text}</TaskText>
                              </TaskItem>
                            )}
                          />
                        </FocusTasks>
                        <FocusTasksCompleted>
                          <FaClipboardCheck /> {mockData.weeklyFocus.completed} {t('dashboard.tasksCompleted', 'Tasks Completed')}
                        </FocusTasksCompleted>
                      </FocusContainer>
                    </DashboardPanel>
                  </DashboardColumn>
                </DashboardPanels>
                
                {/* Quick Actions */}
                <QuickActionsContainer>
                  <QuickActionTitle>{t('dashboard.quickActions', 'Quick Actions')}</QuickActionTitle>
                  <QuickActionButtons>
                    <QuickActionButton onClick={() => setShowAddProjectModal(true)}>
                      <FaChartLine />
                      <span>{t('dashboard.newProject', 'New Project')}</span>
                    </QuickActionButton>
                    <QuickActionButton>
                      <FaClock />
                      <span>{t('dashboard.logTime', 'Log Time')}</span>
                    </QuickActionButton>
                    <QuickActionButton>
                      <FaFileUpload />
                      <span>{t('dashboard.uploadFile', 'Upload File')}</span>
                    </QuickActionButton>
                    <QuickActionButton>
                      <FaRobot />
                      <span>{t('dashboard.aiAssistant', 'AI Assistant')}</span>
                    </QuickActionButton>
                  </QuickActionButtons>
                </QuickActionsContainer>
              </div>
            )}
            
            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <ProjectsTabContainer>
                <ProjectsCard>
                  <ProjectsPanel />
                </ProjectsCard>
              </ProjectsTabContainer>
            )}
            
            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <TasksTabContainer>
                <Suspense fallback={<LoadingSpinner />}>
                  <TasksPanel />
                </Suspense>
              </TasksTabContainer>
            )}
            
            {/* Files Tab */}
            {activeTab === 'files' && (
              <FilesTabContainer>
                <Suspense fallback={<LoadingSpinner />}>
                  <FilesPanel />
                </Suspense>
              </FilesTabContainer>
            )}
            
            {/* Forms Tab */}
            {activeTab === 'forms' && (
              <FormsTabContainer>
                <Suspense fallback={<LoadingSpinner />}>
                  <FormsPanel />
                </Suspense>
              </FormsTabContainer>
            )}
            
            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <ChatTabContainer>
                <Suspense fallback={<LoadingSpinner />}>
                  <ForumsHome />
                </Suspense>
              </ChatTabContainer>
            )}
            
            {/* Design & Prototype Tab */}
            {activeTab === 'design' && (
              <DesignTabContainer>
                <Suspense fallback={<LoadingSpinner />}>
                  <DesignPanel />
                </Suspense>
              </DesignTabContainer>
            )}
            
            {/* Invoicing Tab */}
            {activeTab === 'invoices' && (
              <InvoicingTabContainer>
                <Suspense fallback={<LoadingSpinner />}>
                  <InvoicingPanel />
                </Suspense>
              </InvoicingTabContainer>
            )}
            
            {/* Post-Launch Tab */}
            {activeTab === 'post-launch' && (
              <PostLaunchTabContainer>
                <Suspense fallback={<LoadingSpinner />}>
                  <PostLaunchPanel />
                </Suspense>
              </PostLaunchTabContainer>
            )}
            
            {/* Card Demo Tab */}
            {activeTab === 'card-demo' && (
              <CardDemoTabContainer>
                <Suspense fallback={<LoadingSpinner />}>
                  <TaskCardDemo />
                </Suspense>
              </CardDemoTabContainer>
            )}
          </DashboardContent>
        </ContentArea>
      </DashboardBody>
    </DashboardPage>
    </Suspense>
  );
};

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 1;
`;

const DashboardPage = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #12121a;
  position: relative;
  overflow-x: hidden;
`;

const NavbarArea = styled.div`
  width: 100vw;
  height: 70px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(180deg, #1a1a22 0%, #161620 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin: 0;
  padding: 0;
  
  @media (max-width: 768px) {
    height: 60px;
  }
`;

const NavbarContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  max-width: 100vw;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
  
  & > * {
    width: 100%;
  }
`;

const DashboardBody = styled.div`
  display: flex;
  flex: 1;
  padding-top: 70px; /* Exact height of navbar */
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    padding-top: 60px;
  }
`;

const SidebarArea = styled.div`
  width: ${props => (props.$collapsed ? '60px' : '240px')};
  height: calc(100vh - 70px);
  position: fixed;
  top: 70px; /* Exactly at navbar bottom */
  ${props => props.$isRTL ? 'right: 0;' : 'left: 0;'}
  z-index: 10;
  overflow-y: auto;
  transform: translateX(${props => (props.$isOpen || !props.$isMobile) ? '0' : (props.$isRTL ? '100%' : '-100%')});
  transition: transform 0.3s ease;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  background: linear-gradient(180deg, #1a1a22 0%, #161620 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    top: 60px; /* Adjust for mobile navbar */
    height: calc(100vh - 60px);
    box-shadow: ${props => props.$isOpen ? '0 5px 15px rgba(0, 0, 0, 0.3)' : 'none'};
    z-index: 1001;
  }
`;

const SidebarBackdrop = styled.button`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  cursor: pointer;
  border: none;
  padding: 0;
  margin: 0;


  @media (max-width: 768px) {
    top: 60px;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 2rem;
  margin-left: ${props => !props.$isRTL && (props.$sidebarOpen || !props.$isMobile) ? (props.$collapsed ? '60px' : '240px') : '0'};
  margin-right: ${props => props.$isRTL && (props.$sidebarOpen || !props.$isMobile) ? (props.$collapsed ? '60px' : '240px') : '0'};
  transition: all 0.3s ease;
  min-height: calc(100vh - 70px);
  background-color: transparent;
  overflow-x: hidden;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.$isRTL ? 'right' : 'left'};
  color: #fff;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    padding: 1.5rem 1rem;
  }
`;

const PanelHeader = styled(SharedPanelHeader)`
  svg {
    font-size: 1.2rem;
  }
`;

const FocusProgressText = styled(ProgressText)`
  text-align: right;
`;

const MenuIconWrapper = styled.div`
  cursor: pointer;
  margin-right: ${props => props.$isRTL ? '0' : '1rem'};
  margin-left: ${props => props.$isRTL ? '1rem' : '0'};
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;

  svg {
    color: #fff;
    font-size: 1.2rem;
  }
`;

const DashboardContent = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const ProjectsTabContainer = styled.div`
  width: 100%;
  padding: 1rem 0;
`;

const ProjectsCard = styled.div`
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const AddProjectButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, #cd3efd, #7b2cbf);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    font-size: 0.9rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(205, 62, 253, 0.3);
  }
`;

const TasksTabContainer = styled.div`
  width: 100%;
  padding: 1rem 0;

  h2 {
    color: #fff;
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const FilesTabContainer = styled.div`
  width: 100%;
  padding: 1rem 0;

  h2 {
    color: #fff;
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const FormsTabContainer = styled.div`
  width: 100%;
  height: 100%;
  
  h2 {
    color: #fff;
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const InvoicingTabContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 0;
  
  h2 {
    color: #fff;
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const PostLaunchTabContainer = styled.div`
  width: 100%;
`;

const CardDemoTabContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 0;
  
  h2 {
    color: #fff;
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ChatTabContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 0;
  
  h2 {
    color: #fff;
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const DesignTabContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 0;
  
  h2 {
    color: #fff;
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ProjectsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.5rem;
    margin: 0;
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const WelcomeLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
`;

const WelcomeText = styled.div`
  flex: 1;
  
  h1 {
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    color: #fff;
    font-weight: 700;
  }
  
  h2 {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 500;
    color: #999;
    
    span {
      font-weight: 600;
      color: #fff;
    }
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 1.8rem;
    }
    
    h2 {
      font-size: 1.3rem;
    }
  }
`;

const ProgressInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: rgba(26, 26, 32, 0.7);
  padding: 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const SummaryGrid = styled(CardGrid)`
  margin-bottom: 2rem;
`;

// DashboardLoading component is defined below

const CompactProgressTitle = styled(ProgressTitle)`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  text-align: left;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const DashboardPanels = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const DashboardColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ComingSoonMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  font-size: 1.1rem;
  color: #999;
  text-align: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(205, 62, 253, 0.2);
`;

const FocusContainer = styled.div`
  padding: 1.5rem;
`;

const FocusTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  color: #fff;
  font-weight: 600;
  position: relative;
  display: inline-block;
  padding-left: 0.8rem;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 1rem;
    background: linear-gradient(to bottom, #cd3efd, #7b2cbf);
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }
`;

const FocusProgress = styled.div`
  margin-bottom: 1.5rem;
  background: rgba(26, 26, 32, 0.5);
  padding: 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    margin-bottom: 1rem;
  }
`;

const FocusProgressBar = styled(ProgressBar)`
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 0.8rem;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(to right, #cd3efd, #7b2cbf);
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(205, 62, 253, 0.5);
    transition: width 0.6s ease-in-out;
  }
  
  @media (max-width: 768px) {
    height: 6px;
    margin-bottom: 0.5rem;
  }
`;

const FocusTasks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: linear-gradient(145deg, #1a1a20, #1d1d25);
  border-radius: 12px;
  padding: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.5rem;
  }
`;

const FocusTasksCompleted = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #999;
  font-size: 0.9rem;
  
  svg {
    color: #cd3efd;
  }
`;

const BotPromptContainer = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const BotMessage = styled.div`
  text-align: center;
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const BotButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  background: linear-gradient(90deg, #cd3efd, #7b2cbf);
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(205, 62, 253, 0.2);
  
  &:hover {
    background: linear-gradient(90deg, #7b2cbf, #cd3efd);
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(205, 62, 253, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(205, 62, 253, 0.2);
  }
  
  svg {
    font-size: 1rem;
    color: #fff;
  }
`;

const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  width: 350px;
  height: 450px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    bottom: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
    width: calc(100% - 1rem);
    height: 80vh;
    border-radius: 8px;
  }
`;

const ChatbotHeader = styled.div`
  background: #513a52;
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  width: 32px;
  height: 32px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ChatbotContent = styled.div`
  flex: 1;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
`;

const BotMessageBubble = styled.div`
  background: rgba(130, 161, 191, 0.1);
  color: #444;
  padding: 1rem;
  border-radius: 12px 12px 12px 0;
  max-width: 80%;
  margin-bottom: 1rem;
  line-height: 1.5;

  @media (max-width: 480px) {
    max-width: 90%;
    padding: 0.8rem;
  }
`;

const ChatbotInput = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  
  input {
    flex: 1;
    padding: 0.8rem 1rem;
    border: 1px solid rgba(130, 161, 191, 0.3);
    border-radius: 30px;
    font-size: 0.9rem;
    outline: none;
    
    &:focus {
      border-color: #82a1bf;
    }
  }
  
  button {
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
    color: white;
    border: none;
    border-radius: 30px;
    padding: 0.8rem 1.2rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(205, 62, 253, 0.2);
    
    &:hover {
      background: linear-gradient(90deg, #7b2cbf, #cd3efd);
      transform: translateY(-2px);
      box-shadow: 0 6px 10px rgba(205, 62, 253, 0.3);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(205, 62, 253, 0.2);
    }
  }
`;

const QuickActionsContainer = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const QuickActionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #fff;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #cd3efd;
  }
`;

const QuickActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const QuickActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.9rem 1.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  svg {
    color: #cd3efd;
    font-size: 1.1rem;
  }
  
  &:hover {
    background: rgba(205, 62, 253, 0.1);
    transform: translateY(-2px);
    border-color: rgba(205, 62, 253, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  background: ${props => props.active ? 'linear-gradient(90deg, #cd3efd, #7b2cbf)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? '#fff' : '#999'};
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  svg {
    font-size: 1rem;
  }
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(90deg, #cd3efd, #7b2cbf)' : 'rgba(255, 255, 255, 0.1)'};
    color: #fff;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #513a52;
  overflow: hidden;
`;

const FocusTask = styled(TaskItem)`
  max-width: 100%;
  
  svg {
    font-size: 1.2rem;
    color: #cd3efd;
  }
  
  img {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    object-fit: cover;
  }
  
  span {
    margin-left: 0.5rem;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #513a52;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(81, 58, 82, 0.2);
  white-space: nowrap;
  flex-shrink: 0;
  
  &:hover {
    background: #3d2c3d;
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(81, 58, 82, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(81, 58, 82, 0.2);
  }
  
  svg {
    color: white;
    margin-right: ${props => props.isRTL ? '0' : '0.2rem'};
    margin-left: ${props => props.isRTL ? '0.2rem' : '0'};
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const DashboardLoading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: #12121a;
  color: #fff;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(205, 62, 253, 0.3);
  border-top: 4px solid #cd3efd;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default React.memo(Dashboard);
