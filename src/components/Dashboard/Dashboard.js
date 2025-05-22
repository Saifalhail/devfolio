import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaChartLine, FaClock, FaFileUpload, FaRobot, FaArrowRight, FaTimes, FaBars,
  FaHome, FaProjectDiagram, FaFileAlt, FaClipboardList, FaFileInvoiceDollar, FaHistory, FaCog,
  FaCalendarAlt, FaLightbulb, FaClipboardCheck, FaUser, FaSignOutAlt, FaPlus,
  FaThLarge, FaStream, FaTachometerAlt, FaColumns, FaLayerGroup, FaThList, FaCommentAlt
} from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Navbar from '../Layout/Navbar';
import Sidebar from './Sidebar';
import ProjectsPanel from './ProjectsPanel';
import ProjectNotes from './ProjectNotes';
import AddProjectModal from './AddProjectModal';
import TasksPanel from './TasksPanel';
import FilesPanel from './FilesPanel';
import FormsPanel from './FormsPanel';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'projects', 'tasks'
  
  // Mock data for demonstration purposes
  const mockData = {
    projectName: "DevFolio",
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
      completed: 6
    }
  };

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.greeting.morning', 'Good Morning');
    if (hour < 18) return t('dashboard.greeting.afternoon', 'Good Afternoon');
    return t('dashboard.greeting.evening', 'Good Evening');
  };
  
  const greeting = getGreeting();
  
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
  
  const timeRemaining = calculateTimeRemaining();
  
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
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <DashboardPage>
      {/* Add Project Modal */}
      {showAddProjectModal && (
        <AddProjectModal 
          isOpen={showAddProjectModal} 
          onClose={() => setShowAddProjectModal(false)} 
          onProjectAdded={() => {
            // Refresh projects or handle new project added
            setShowAddProjectModal(false);
          }} 
        />
      )}
      
      <NavbarArea>
        <NavbarContent>
          {/* Mobile Toggle Button integrated in Navbar */}
          {mobileView && (
            <MenuIconWrapper onClick={toggleSidebar} isRTL={isRTL}>
              {sidebarOpen ? <FaTimes /> : <FaColumns />}
            </MenuIconWrapper>
          )}
          <Navbar showUserAccount={true} />
        </NavbarContent>
      </NavbarArea>
      
      <DashboardBody isRTL={isRTL}>
        <SidebarArea isRTL={isRTL} isOpen={sidebarOpen} isMobile={mobileView}>
          <Sidebar />
        </SidebarArea>
        {mobileView && sidebarOpen && (
          <SidebarBackdrop onClick={toggleSidebar} />
        )}
        
        {/* Main Content */}
        <ContentArea isRTL={isRTL} isMobile={mobileView} sidebarOpen={sidebarOpen}>
          
          <DashboardContent>
            
            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <ProjectsTabContainer>
                <ProjectsHeader>
                  <h2>{t('projects.yourProjects', 'Your Projects')}</h2>
                  <AddProjectButton onClick={() => setShowAddProjectModal(true)}>
                    <FaPlus />
                    {t('projects.addNew', 'Add New Project')}
                  </AddProjectButton>
                </ProjectsHeader>
                <ProjectsPanel />
              </ProjectsTabContainer>
            )}
            
            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <TasksTabContainer>
                <TasksPanel />
              </TasksTabContainer>
            )}
            
            {/* Files Tab */}
            {activeTab === 'files' && (
              <FilesTabContainer>
                <FilesPanel />
              </FilesTabContainer>
            )}
            
            {/* Forms Tab */}
            {activeTab === 'forms' && (
              <FormsTabContainer>
                <FormsPanel />
              </FormsTabContainer>
            )}
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="overview-tab">
                {/* Welcome Section with Personalized Greeting */}
                <WelcomeSection>
                  <WelcomeLayout>
                    <WelcomeText>
                      <h1>{getGreeting()}, {currentUser?.displayName?.split(' ')[0] || 'Developer'}!</h1>
                      <h2>{mockData.projectName} <span>Dashboard</span></h2>
                    </WelcomeText>
                    
                    <ProgressInfoContainer>
                      <CompactProgressWrapper>
                        <CircularProgressbar
                          value={mockData.progress}
                          text={`${mockData.progress}%`}
                          styles={{
                            path: { stroke: '#82a1bf' },
                            trail: { stroke: 'rgba(130, 161, 191, 0.2)' },
                            text: { fill: '#513a52', fontSize: '16px' }
                          }}
                        />
                      </CompactProgressWrapper>
                  
                  <div>
                    <CompactProgressTitle>{t('dashboard.projectProgress', 'Project Progress')}</CompactProgressTitle>
                    <CompactStatItem>
                      <StatLabel>{t('dashboard.activeProjects', 'Active Projects')}: </StatLabel>
                      <StatValue>{mockData.activeProjects}/{mockData.totalProjects}</StatValue>
                    </CompactStatItem>
                  </div>
                </ProgressInfoContainer>
              </WelcomeLayout>
            </WelcomeSection>
            
            {/* Main Dashboard Panels */}
            <DashboardPanels>
              {/* Left Column */}
              <DashboardColumn>
                {/* Deadline Countdown */}
                <DashboardPanel>
                  <PanelHeader>
                    <FaCalendarAlt />
                    <h3>{t('dashboard.upcomingDeadline', 'Upcoming Deadline')}</h3>
                  </PanelHeader>
                  <CountdownContainer>
                    <CountdownDate>
                      {mockData.nextDeadline.toLocaleDateString(i18n.language, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CountdownDate>
                    <CountdownTimers>
                      <CountdownItem>
                        <CountdownValue>{timeRemaining.days}</CountdownValue>
                        <CountdownLabel>{t('dashboard.days', 'Days')}</CountdownLabel>
                      </CountdownItem>
                      <CountdownItem>
                        <CountdownValue>{timeRemaining.hours}</CountdownValue>
                        <CountdownLabel>{t('dashboard.hours', 'Hours')}</CountdownLabel>
                      </CountdownItem>
                      <CountdownItem>
                        <CountdownValue>{timeRemaining.minutes}</CountdownValue>
                        <CountdownLabel>{t('dashboard.minutes', 'Minutes')}</CountdownLabel>
                      </CountdownItem>
                    </CountdownTimers>
                  </CountdownContainer>
                </DashboardPanel>
                
                {/* Last Interaction Summary */}
                <DashboardPanel>
                  <PanelHeader>
                    <FaFileUpload />
                    <h3>{t('dashboard.lastInteraction', 'Last Interaction Summary')}</h3>
                  </PanelHeader>
                  <InteractionContainer>
                    <InteractionIcon type={mockData.lastInteraction.type}>
                      <FaFileUpload />
                    </InteractionIcon>
                    <InteractionDetails>
                      <InteractionTitle>{mockData.lastInteraction.name}</InteractionTitle>
                      <InteractionTime>{mockData.lastInteraction.time}</InteractionTime>
                      <InteractionType>{t('dashboard.fileUpload', 'File Upload')}</InteractionType>
                    </InteractionDetails>
                  </InteractionContainer>
                </DashboardPanel>
              </DashboardColumn>
              
              {/* Right Column */}
              <DashboardColumn>
                {/* This Week's Focus */}
                <DashboardPanel>
                  <PanelHeader>
                    <FaLightbulb />
                    <h3>{t('dashboard.weeklyFocus', 'This Week\'s Focus')}</h3>
                  </PanelHeader>
                  <FocusContainer>
                    <FocusTitle>{mockData.weeklyFocus.title}</FocusTitle>
                    <FocusProgress>
                      <FocusProgressBar progress={mockData.weeklyFocus.progress} />
                      <FocusProgressText>{mockData.weeklyFocus.progress}% Complete</FocusProgressText>
                    </FocusProgress>
                    <FocusTasks>
                      <FocusTasksCompleted>
                        <FaClipboardCheck />
                        <span>{mockData.weeklyFocus.completed} {t('dashboard.tasksCompleted', 'of')} {mockData.weeklyFocus.tasks}</span>
                      </FocusTasksCompleted>
                    </FocusTasks>
                  </FocusContainer>
                </DashboardPanel>
                
                {/* Mini Bot Prompt */}
                <DashboardPanel>
                  <PanelHeader>
                    <FaRobot />
                    <h3>{t('dashboard.aiAssistant', 'AI Assistant')}</h3>
                  </PanelHeader>
                  <BotPromptContainer>
                    <BotMessage>{t('dashboard.needHelp', 'Need help or clarification with your project?')}</BotMessage>
                    <BotButton onClick={toggleChatbot}>
                      <span>{t('dashboard.askAI', 'Ask AI Assistant')}</span>
                      <FaArrowRight />
                    </BotButton>
                  </BotPromptContainer>
                  {showChatbot && (
                    <ChatbotContainer>
                      <ChatbotHeader>
                        <h4>{t('dashboard.aiAssistant', 'AI Assistant')}</h4>
                        <CloseButton onClick={toggleChatbot}>
                          <FaTimes />
                        </CloseButton>
                      </ChatbotHeader>
                      <ChatbotContent>
                        <BotMessageBubble>
                          {t('dashboard.howCanIHelp', 'How can I help you with your project today?')}
                        </BotMessageBubble>
                        <ChatbotInput>
                          <input type="text" placeholder={t('dashboard.typeQuestion', 'Type your question here...')} />
                          <button>{t('dashboard.send', 'Send')}</button>
                        </ChatbotInput>
                      </ChatbotContent>
                    </ChatbotContainer>
                  )}
                </DashboardPanel>
              </DashboardColumn>
            </DashboardPanels>
            
            {/* Quick Actions */}
            <QuickActionsContainer>
              <QuickActionTitle>{t('dashboard.quickActions', 'Quick Actions')}</QuickActionTitle>
              <QuickActionButtons>
                <QuickActionButton>
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
              </QuickActionButtons>
            </QuickActionsContainer>
          </div>
          )}  {/* End of Overview Tab */}
          </DashboardContent>
        </ContentArea>
      </DashboardBody>
    </DashboardPage>
  );
};

const DashboardPage = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #f7f9fc;
`;

const NavbarArea = styled.div`
  width: 100%;
  height: 70px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  
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
`;

const DashboardBody = styled.div`
  display: flex;
  flex: 1;
  padding-top: 70px; /* Exact height of navbar */
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    padding-top: 60px;
  }
`;

const SidebarArea = styled.div`
  width: 240px;
  height: calc(100vh - 70px);
  position: fixed;
  top: 70px; /* Exactly at navbar bottom */
  ${props => props.isRTL ? 'right: 0;' : 'left: 0;'}
  z-index: 10;
  overflow-y: auto;
  transform: translateX(${props => (props.isOpen || !props.isMobile) ? '0' : (props.isRTL ? '100%' : '-100%')});
  transition: transform 0.3s ease;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    top: 60px; /* Adjust for mobile navbar */
    height: calc(100vh - 60px);
    box-shadow: ${props => props.isOpen ? '0 5px 15px rgba(0, 0, 0, 0.1)' : 'none'};
    z-index: 1001;
  }
`;

const SidebarBackdrop = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;

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
  margin-left: ${props => !props.isRTL && (props.sidebarOpen || !props.isMobile) ? '240px' : '0'};
  margin-right: ${props => props.isRTL && (props.sidebarOpen || !props.isMobile) ? '240px' : '0'};
  transition: all 0.3s ease;
  min-height: calc(100vh - 70px);
  background-color: #f7f9fc;
  overflow-x: hidden;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    padding: 1.5rem 1rem;
  }
`;

const MenuIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  margin: ${props => props.isRTL ? '0 0 0 20px' : '0 0 0 15px'};
  padding: 8px;
  z-index: 1200;
  position: absolute;
  top: 55%;
  transform: translateY(-50%);
  ${props => props.isRTL ? 'right: 0;' : 'left: 0;'}
  
  svg {
    font-size: 1.4rem;
  }
  
  @media (max-width: 768px) {
    margin: ${props => props.isRTL ? '0 15px 0 0' : '0 0 0 15px'};
    top: 60%;
  }
`;

/* Removed DashboardHeader as it's no longer needed */


const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// Welcome Section Styles
const WelcomeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  border-radius: 15px;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const WelcomeLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const WelcomeText = styled.div`
  flex: 1;
  
  h1 {
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    color: #c23fe7; /* Adjusted to match screenshot */
    font-weight: 700;
  }
  
  h2 {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 500;
    color: #a4a4a4; /* Lighter gray color */
    
    span {
      font-weight: 600;
      color: #faaa93;
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
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  min-width: 200px;
`;

const CompactProgressTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #513a52;
  font-size: 1rem;
  text-align: left;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const ProgressTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #513a52;
  font-size: 1.1rem;
`;

const CompactProgressWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0;
`;

const ProgressWrapper = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 1rem;
`;

const ProgressStats = styled.div`
  width: 100%;
  margin-top: 0.5rem;
`;

const CompactStatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`;

const StatLabel = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const StatValue = styled.span`
  color: #513a52;
  font-weight: 600;
  font-size: 1rem;
`;

// Dashboard Panels Styles
const DashboardPanels = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const DashboardColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DashboardPanel = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 1.5rem;
  background: linear-gradient(to right, rgba(130, 161, 191, 0.1), rgba(255, 255, 255, 0));
  border-bottom: 1px solid rgba(130, 161, 191, 0.1);
  
  h3 {
    margin: 0;
    color: #513a52;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  svg {
    color: #82a1bf;
    font-size: 1.2rem;
  }
`;

// Countdown Styles
const CountdownContainer = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CountdownDate = styled.div`
  font-size: 1.1rem;
  color: #513a52;
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: center;
`;

const CountdownTimers = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const CountdownItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
`;

const CountdownValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #faaa93;
  line-height: 1;
`;

const CountdownLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.3rem;
`;

// Last Interaction Styles
const InteractionContainer = styled.div`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const InteractionIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch(props.type) {
      case 'file': return 'rgba(130, 161, 191, 0.1)';
      case 'form': return 'rgba(250, 170, 147, 0.1)';
      case 'milestone': return 'rgba(81, 58, 82, 0.1)';
      default: return 'rgba(130, 161, 191, 0.1)';
    }
  }};
  
  svg {
    color: ${props => {
      switch(props.type) {
        case 'file': return '#82a1bf';
        case 'form': return '#faaa93';
        case 'milestone': return '#513a52';
        default: return '#82a1bf';
      }
    }};
    font-size: 1.5rem;
  }
`;

const InteractionDetails = styled.div`
  flex: 1;
`;

const InteractionTitle = styled.div`
  font-weight: 600;
  color: #513a52;
  margin-bottom: 0.3rem;
`;

const InteractionTime = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.3rem;
`;

const InteractionType = styled.div`
  font-size: 0.8rem;
  color: #82a1bf;
  font-weight: 500;
`;

// Weekly Focus Styles
const FocusContainer = styled.div`
  padding: 1.5rem;
`;

const FocusTitle = styled.div`
  font-weight: 600;
  color: #513a52;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const FocusProgress = styled.div`
  margin-bottom: 1rem;
`;

const FocusProgressBar = styled.div`
  height: 8px;
  background: rgba(130, 161, 191, 0.2);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(to right, #82a1bf, #faaa93);
    border-radius: 4px;
  }
`;

const FocusProgressText = styled.div`
  font-size: 0.9rem;
  color: #666;
  text-align: right;
`;

const FocusTasks = styled.div`
  margin-top: 1rem;
`;

const FocusTasksCompleted = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #513a52;
  font-size: 0.9rem;
  
  svg {
    color: #faaa93;
  }
`;

// Chatbot Styles
const BotPromptContainer = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const BotMessage = styled.div`
  text-align: center;
  color: #513a52;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const BotButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  background: #513a52;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(81, 58, 82, 0.2);
  
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
    font-size: 1rem;
    color: white;
  }
`;

const ChatbotContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.1);
  z-index: 10;
  height: 300px;
  display: flex;
  flex-direction: column;
`;

const ChatbotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(130, 161, 191, 0.1);
  
  h4 {
    margin: 0;
    color: #513a52;
  }
`;

const CloseButton = styled.button`
  background: rgba(81, 58, 82, 0.1);
  border: none;
  color: #513a52;
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
    background: rgba(81, 58, 82, 0.2);
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
  color: #513a52;
  padding: 1rem;
  border-radius: 12px 12px 12px 0;
  max-width: 80%;
  margin-bottom: 1rem;
  line-height: 1.5;
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
    background: #513a52;
    color: white;
    border: none;
    border-radius: 30px;
    padding: 0.8rem 1.2rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(81, 58, 82, 0.2);
    
    &:hover {
      background: #3d2c3d;
      transform: translateY(-2px);
      box-shadow: 0 6px 10px rgba(81, 58, 82, 0.3);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(81, 58, 82, 0.2);
    }
  }
`;

// Quick Actions Styles
const QuickActionsContainer = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const QuickActionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #513a52;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  background: #513a52;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.9rem 1.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(81, 58, 82, 0.2);
  
  svg {
    color: white;
    font-size: 1.1rem;
  }
  
  &:hover {
    background: #3d2c3d;
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(81, 58, 82, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(81, 58, 82, 0.2);
  }
`;

// Projects Tab Styled Components
const ProjectsTabContainer = styled.div`
  width: 100%;
  padding: 1rem 0;
`;

const ProjectsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: #fff;
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
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

// Tasks Tab Styled Components
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

const ComingSoonMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px dashed rgba(205, 62, 253, 0.2);
`;

// Dashboard Tabs Styled Components
const DashboardTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.active ? 'rgba(205, 62, 253, 0.1)' : 'rgba(255, 255, 255, 0.03)'};
  color: ${props => props.active ? '#cd3efd' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.active ? 'rgba(205, 62, 253, 0.3)' : 'transparent'};
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  svg {
    font-size: 1rem;
  }
  
  &:hover {
    background: rgba(205, 62, 253, 0.05);
    color: ${props => props.active ? '#cd3efd' : '#fff'};
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
`;

// User Info Styles
const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  min-width: 250px;
  flex-wrap: nowrap;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.8rem;
    align-items: ${props => props.isRTL ? 'flex-end' : 'flex-start'};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #513a52;
  overflow: hidden;
  max-width: 65%;
  
  svg {
    color: #82a1bf;
    flex-shrink: 0;
  }
  
  span {
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

export default Dashboard;
