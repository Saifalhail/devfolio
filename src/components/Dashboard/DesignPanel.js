import React, { useState, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { ActionButton } from '../../styles/GlobalComponents';
import { useTranslation } from 'react-i18next';
import { 
  FaFigma,
  FaPalette,
  FaLayerGroup, 
  FaCode, 
  FaHistory,
  FaExternalLinkAlt,
  FaLink,
  FaImage,
  FaEye,
  FaThumbsUp,
  FaRocket,
  FaCheckCircle
} from 'react-icons/fa';
import StarryBackground from '../Common/StarryBackground';

// Import Design Section components
import DesignTab from './DesignSection/DesignTab';
import DesignNavigation from './DesignSection/DesignNavigation';
import FigmaEmbed from './DesignSection/FigmaEmbed';
import MockupGallery from './DesignSection/MockupGallery';
import MockupUpload from './DesignSection/MockupUpload';
import StyleGuide from './DesignSection/StyleGuide';
import AssetsLibrary from './DesignSection/AssetsLibrary';
import DesignFeedback from './DesignSection/DesignFeedback';
import DesignKit from './DesignSection/DesignKit';


const DesignPanel = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeSection, setActiveSection] = useState('mockups');
  const [activeTab, setActiveTab] = useState('current');
  const [showStylePreferenceForm, setShowStylePreferenceForm] = useState(false);
  const [designKitInfo, setDesignKitInfo] = useState(null);
  const [selectedShowcase, setSelectedShowcase] = useState(null);
  
  // Mock design data
  const mockDesignData = {
    figmaUrl: 'https://www.figma.com/file/example123/DevFolio-Design',
    lastUpdated: '2025-05-20',
    designKitUrl: '/assets/design-kit.zip',
    styleGuideUrl: 'https://www.figma.com/file/example456/DevFolio-Style-Guide',
    revisionsUrl: 'https://www.figma.com/file/example789/DevFolio-Revisions'
  };
  
  // Mock showcase examples
  const showcaseExamples = [
    {
      id: 1,
      title: 'Dark Theme Dashboard',
      description: 'Modern dark theme with purple gradient accents and glowing elements',
      image: 'https://via.placeholder.com/800x600/2c1e3f/ffffff?text=Dark+Theme+Dashboard',
      likes: 24,
      views: 128
    },
    {
      id: 2,
      title: 'Mobile App Design',
      description: 'Responsive mobile interface with playful animations and intuitive navigation',
      image: 'https://via.placeholder.com/800x600/513a52/ffffff?text=Mobile+App+Design',
      likes: 18,
      views: 97
    },
    {
      id: 3,
      title: 'Landing Page',
      description: 'Engaging hero section with floating elements and gradient text effects',
      image: 'https://via.placeholder.com/800x600/6e57e0/ffffff?text=Landing+Page',
      likes: 32,
      views: 215
    },
    {
      id: 4,
      title: 'Admin Dashboard',
      description: 'Comprehensive admin interface with data visualization and user management',
      image: 'https://via.placeholder.com/800x600/82a1bf/ffffff?text=Admin+Dashboard',
      likes: 15,
      views: 86
    }
  ];
  
  // Fetch design kit info
  useEffect(() => {
    fetch('/assets/design-kit-info.json')
      .then(response => response.json())
      .then(data => setDesignKitInfo(data))
      .catch(error => console.error('Error fetching design kit info:', error));
  }, []);
  
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleStylePreferenceToggle = () => {
    setShowStylePreferenceForm(!showStylePreferenceForm);
  };
  
  const handleStylePreferenceSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would submit the form data
    alert('Style preferences submitted!');
    setShowStylePreferenceForm(false);
  };
  
  // Get the appropriate Figma embed URL based on the active tab
  const getFigmaEmbedUrl = () => {
    switch(activeTab) {
      case 'current':
        return mockDesignData.figmaUrl;
      case 'styleguide':
        return mockDesignData.styleGuideUrl;
      case 'revisions':
        return mockDesignData.revisionsUrl;
      default:
        return mockDesignData.figmaUrl;
    }
  };

  return (
    <Container>
      <BackgroundContainer>
        <StarryBackground color="#a78bfa" starCount={200} blurAmount={8} opacity={1} />
      </BackgroundContainer>
      <Header>
        <Title>{t('design.designAndPrototype', 'Design')}</Title>
        <ToolbarContainer>
          <FigmaLinkButton href={mockDesignData.figmaUrl} target="_blank" rel="noopener noreferrer">
            <FaFigma />
            {t('design.openInFigma', 'Open in Figma')}
          </FigmaLinkButton>
          <DesignKit />
        </ToolbarContainer>
      </Header>
      
      <Content>
        {/* Compact Design Timeline - Moved to top */}
        <CompactTimelineSection>
          <TimelineTitle>
            <GlowingIcon><FaRocket /></GlowingIcon>
            {t('designPhaseTracker.title', 'Design Phases')}
          </TimelineTitle>
          <CompactTimeline>
            <CompactTimelineItem completed={true}>
              <CompactTimelinePoint completed={true}>
                <FaCheckCircle />
              </CompactTimelinePoint>
              <CompactTimelineLabel>Discovery</CompactTimelineLabel>
            </CompactTimelineItem>
            
            <CompactTimelineItem completed={true}>
              <CompactTimelinePoint completed={true}>
                <FaCheckCircle />
              </CompactTimelinePoint>
              <CompactTimelineLabel>Wireframes</CompactTimelineLabel>
            </CompactTimelineItem>
            
            <CompactTimelineItem completed={true}>
              <CompactTimelinePoint completed={true}>
                <FaCheckCircle />
              </CompactTimelinePoint>
              <CompactTimelineLabel>Mockups</CompactTimelineLabel>
            </CompactTimelineItem>
            
            <CompactTimelineItem active={true}>
              <CompactTimelinePoint active={true}>
                <FaEye />
              </CompactTimelinePoint>
              <CompactTimelineLabel>Prototypes</CompactTimelineLabel>
            </CompactTimelineItem>
            
            <CompactTimelineItem>
              <CompactTimelinePoint>
                <FaCode />
              </CompactTimelinePoint>
              <CompactTimelineLabel>Implementation</CompactTimelineLabel>
            </CompactTimelineItem>
          </CompactTimeline>
        </CompactTimelineSection>

        {/* Use the DesignNavigation component for navigation */}
        <DesignNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        {/* Render different sections based on activeSection */}
        <Suspense fallback={<LoadingIndicator />}>
          {activeSection === 'mockups' && (
            <>
              <MockupGallery showcaseExamples={showcaseExamples} />
              <MockupUpload />
            </>
          )}
          
          {activeSection === 'figma' && (
            <FigmaEmbed 
              figmaUrl={mockDesignData.figmaUrl} 
              lastUpdated={mockDesignData.lastUpdated} 
            />
          )}
          
          {activeSection === 'styleGuide' && (
            <StyleGuide />
          )}
          
          {activeSection === 'assets' && (
            <AssetsLibrary />
          )}
        </Suspense>
      </Content>
      
      {/* Design Feedback System */}
      <FeedbackWrapper>
        <DesignFeedback />
      </FeedbackWrapper>
    </Container>
  );
};

// Styled Components

// Main container styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  color: white;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(35, 38, 85, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 1rem;
  position: relative;
  z-index: 2;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
  }
  
  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem 1.25rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    padding: 0.9rem 1rem;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  display: inline-block;
  background: linear-gradient(to right, #ffffff, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, #faaa93, #ff5b92);
    border-radius: 3px;
    box-shadow: 0 2px 10px rgba(250, 170, 147, 0.5);
  }
`;

const ToolbarContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: nowrap;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 0.5rem;
  }
`;

const FigmaLinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  width: 150px;
  background: linear-gradient(45deg, #3a1e65 0%, #6031a8 100%);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: all 0.6s;
  }
  
  svg {
    font-size: 1.1rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
  
  &:hover {
    background: linear-gradient(45deg, #4a2e75 0%, #7041b8 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
    color: white;
    text-decoration: none;
    
    &:before {
      left: 100%;
    }
  }
  
  @media (max-width: 768px) {
    width: 160px;
    padding: 0.65rem 1.25rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    margin-bottom: 0.5rem;
  }
`;  

const Content = styled.div`
  flex: 1;
  padding: 1.75rem;
  overflow-y: auto;
  background: rgba(18, 20, 44, 0.2);
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 2;
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #faaa93, #ff5b92);
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
`;

const FigmaEmbedContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow: hidden;
  position: relative;
  background: #f9f9f9;
`;

// Background container for the starry effect
const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  opacity: 1;
  pointer-events: none;
`;











// Custom action button styling
const CustomActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  width: 180px;
  background: ${props => props.primary ? 'linear-gradient(90deg, #cd3efd, #7b2cbf)' : 'rgba(35, 38, 85, 0.6)'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.primary ? '0 8px 20px rgba(123, 44, 191, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: all 0.6s;
  }
  
  svg {
    font-size: 1rem;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  }
  
  &:hover {
    background: linear-gradient(45deg, #6031a8 0%, #7b42d1 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    
    &:before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    flex: 1;
    width: auto;
    max-width: 180px;
  }
  
  @media (max-width: 480px) {
    max-width: none;
  }
`;



const FigmaEmbedFrame = styled.iframe`
  width: 100%;
  height: 600px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
    transform: translateY(-4px);
  }
`;

// New styled components for the design section
const SectionContainer = styled.div`
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  margin-bottom: 2rem;
`;

// New compact timeline components
const CompactTimelineSection = styled.div`
  padding: 1rem 1.25rem;
  background: rgba(35, 38, 85, 0.4);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 3;
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const CompactTimeline = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin-top: 1rem;
  padding: 0.5rem 0;
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, #faaa93, #ff5b92, #a78bfa);
    transform: translateY(-50%);
    z-index: 1;
    box-shadow: 0 0 10px rgba(167, 139, 250, 0.3);
  }
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 0.5rem;
    
    &:before {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    justify-content: flex-start;
  }
`;

const CompactTimelineItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    width: 30%;
    min-width: 80px;
  }
  
  @media (max-width: 480px) {
    width: 45%;
  }
`;

const CompactTimelinePoint = styled.div`
  width: 36px;
  height: 36px;
  background: ${props => props.active ? 'linear-gradient(45deg, #ff5b92, #a78bfa)' : 
    props.completed ? 'linear-gradient(45deg, #4CAF50, #8BC34A)' : 'linear-gradient(45deg, #3a1e65, #6031a8)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  box-shadow: ${props => props.active ? '0 0 15px rgba(255, 91, 146, 0.7)' : 
    props.completed ? '0 0 10px rgba(76, 175, 80, 0.5)' : '0 0 10px rgba(58, 30, 101, 0.5)'};
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
  top: -8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 18px rgba(167, 139, 250, 0.7);
  }
`;

const CompactTimelineLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  text-align: center;
  max-width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackerWrapper = styled.div`
  padding: 1rem;
`;

const FeedbackWrapper = styled.div`
  padding: 1rem;
`;

const TimelineTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem 0;
  padding-top: 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    background: linear-gradient(45deg, #faaa93, #ff5b92);
    border-radius: 50%;
    font-size: 0.75rem;
  }
`;

const ShowcaseMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem 0;
  padding-top: 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    background: linear-gradient(45deg, #faaa93, #ff5b92);
    border-radius: 50%;
    font-size: 0.75rem;
  }
`;

const GlowingIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #ff5b92;
  filter: drop-shadow(0 0 5px rgba(255, 91, 146, 0.7));
`;

const Timeline = styled.div`
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 24px;
    width: 2px;
    background: linear-gradient(to bottom, #faaa93, #ff5b92, #a78bfa);
    box-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
    
    @media (max-width: 768px) {
      left: 20px;
    }
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-left: 60px;
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    padding-left: 50px;
  }
`;

const TimelinePoint = styled.div`
  position: absolute;
  left: 12px;
  top: 0;
  width: 24px;
  height: 24px;
  background: ${props => props.active ? 'linear-gradient(45deg, #ff5b92, #a78bfa)' : 
    props.completed ? 'linear-gradient(45deg, #4CAF50, #8BC34A)' : 'rgba(35, 38, 85, 0.6)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  box-shadow: ${props => props.active ? '0 0 15px rgba(255, 91, 146, 0.7)' : 
    props.completed ? '0 0 10px rgba(76, 175, 80, 0.5)' : 'none'};
  z-index: 2;
  
  @media (max-width: 768px) {
    left: 9px;
    width: 22px;
    height: 22px;
  }
`;

const TimelineContent = styled.div`
  background: rgba(35, 38, 85, 0.6);
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const TimelineItemTitle = styled.h4`
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
`;

const TimelineItemDate = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.75rem;
`;

const TimelineItemDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
`;

const ShowcaseContent = styled.div`
  padding: 1rem;
`;

const PhaseTrackerWrapper = styled.div`
  margin: 2rem 1rem;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
  position: relative;
  
  &:before {
    content: '';
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #ff5b92;
    border-right-color: #a78bfa;
    box-shadow: 0 0 20px rgba(167, 139, 250, 0.5);
    animation: spin 1s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }
  
  &:after {
    content: 'Loading...';
    position: absolute;
    bottom: -30px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
`;

export default DesignPanel;
