import React, { useState, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaFigma, 
  FaDownload, 
  FaPalette, 
  FaLayerGroup, 
  FaCode, 
  FaHistory,
  FaExternalLinkAlt,
  FaLink,
  FaImage,
  FaEye,
  FaThumbsUp
} from 'react-icons/fa';

// Import Design Section components
import DesignTab from './DesignSection/DesignTab';
import DesignNavigation from './DesignSection/DesignNavigation';
import FigmaEmbed from './DesignSection/FigmaEmbed';
import MockupGallery from './DesignSection/MockupGallery';
import MockupUpload from './DesignSection/MockupUpload';
import StyleGuide from './DesignSection/StyleGuide';
import AssetsLibrary from './DesignSection/AssetsLibrary';
import PhaseTracker from './DesignSection/PhaseTracker';
import DesignFeedback from './DesignSection/DesignFeedback';
import { colors, spacing, borderRadius, transitions } from '../../styles/GlobalTheme';

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
  
  const handleDownloadDesignKit = () => {
    // In a real implementation, this would trigger a download
    alert('Downloading Design Kit...');
  };
  
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
      <Header>
        <Title>{t('design.designAndPrototype', 'Design')}</Title>
        <ToolbarContainer>
          <FigmaLinkButton href={mockDesignData.figmaUrl} target="_blank" rel="noopener noreferrer">
            <FaExternalLinkAlt />
            {t('design.openInFigma', 'Open in Figma')}
          </FigmaLinkButton>
        </ToolbarContainer>
      </Header>
      
      <Content>
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
      
      {/* Phase Tracker */}
      <PhaseTrackerWrapper>
        <PhaseTracker />
      </PhaseTrackerWrapper>
      
      {/* Design Feedback System */}
      <DesignFeedback />
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const ToolbarContainer = styled.div`
  display: flex;
  gap: ${spacing.sm};
  align-items: center;
`;

const FigmaLinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.md};
  background: ${colors.gradients.button};
  color: ${colors.text.primary};
  text-decoration: none;
  font-weight: 500;
  transition: ${transitions.fast};

  &:hover {
    background: ${colors.gradients.hover};
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow: auto;
`;

const FigmaEmbedContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow: hidden;
  position: relative;
  background: #f9f9f9;
`;


const StylePreferenceFormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StylePreferenceFormContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const StylePreferenceFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  
  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const StylePreferenceForm = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const StyleOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
`;

const StyleOption = styled.div`
  position: relative;
  
  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + label {
      background: rgba(110, 87, 224, 0.1);
      border-color: #6e57e0;
      color: #6e57e0;
      
      svg {
        color: #6e57e0;
      }
    }
  }
`;

const StyleLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9f9f9;
    transform: translateY(-2px);
  }
`;

const StyleIcon = styled.div`
  font-size: 1.5rem;
  color: #666;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const ColorOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  
  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + label {
      font-weight: 500;
      color: #333;
    }
  }
`;

const ColorSwatch = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ColorLabel = styled.label`
  cursor: pointer;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #6e57e0;
    box-shadow: 0 0 0 2px rgba(110, 87, 224, 0.1);
  }
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(90deg, #6e57e0, #9b6dff);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(110, 87, 224, 0.3);
  }
`;

// Showcase styled components
const ShowcaseContainer = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background: #f9f9f9;
`;

const ShowcaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }
`;

const ShowcaseCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 2px solid ${props => props.isSelected ? '#6e57e0' : 'transparent'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const ShowcaseImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid #f0f0f0;
`;

const ShowcaseContent = styled.div`
  padding: 1rem;
`;

const ShowcaseTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const ShowcaseDescription = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
`;

const ShowcaseMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #888;
`;

const ShowcaseMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  svg {
    font-size: 0.9rem;
  }
`;

const ShowcaseDetailOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ShowcaseDetail = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
`;

const ShowcaseDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
`;

const ShowcaseDetailTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const ShowcaseDetailImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  background: #f9f9f9;
`;

const ShowcaseDetailContent = styled.div`
  padding: 1.5rem;
`;

const ShowcaseDetailDescription = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
`;

const ShowcaseDetailMeta = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 0.9rem;
  color: #666;
`;

const PhaseTrackerWrapper = styled.div`
  margin: 2rem 1rem;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
  
  &:before {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid rgba(110, 87, 224, 0.1);
    border-top: 4px solid #6e57e0;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default DesignPanel;
