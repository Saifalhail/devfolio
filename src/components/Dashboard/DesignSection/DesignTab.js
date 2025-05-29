import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import Tabs from '../../Common/Tabs';
import DashboardCard from '../../Common/CardSystem';
import { colors, spacing, shadows, borderRadius, transitions, typography, breakpoints } from '../../../styles/GlobalTheme';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  ActionButton,
  FeatureCard,
  IconContainer,
  SectionTitle,
  StatusBadge,
  GradientButton,
  ProjectCard,
  ProjectCardInner,
  ProjectHeader,
  ProjectName,
  ProjectDescription,
  StatusChip,
  DetailItem,
  DetailIcon,
  DetailContent,
  DetailLabel,
  DetailValue,
  CardGrid
} from '../../../styles/GlobalComponents';
import { Card, BaseCard } from '../../../styles/dashboardStyles';
import WorkflowStatus from './WorkflowStatus';
import DesignWizard from './DesignWizard';
import {
  FaRocket,
  FaLightbulb,
  FaPencilAlt,
  FaFigma,
  FaComments,
  FaPalette,
  FaLayerGroup,
  FaMagic,
  FaCheck,
  FaExternalLinkAlt,
  FaDownload,
  FaChartLine,
  FaUsers,
  FaCode,
  FaGem,
  FaClipboardCheck,
  FaRegClock,
  FaRegCalendarAlt,
  FaRegLightbulb,
  FaRegStar,
  FaCheckCircle,
  FaFileAlt,
  FaArrowRight,
  FaEye,
  FaImages,
  FaCalendarAlt,
  FaUserAlt,
  FaMobileAlt
} from 'react-icons/fa';

const fadeInAnimation = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const pulseAnimation = keyframes`
  0% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.8; transform: scale(1); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(250, 170, 147, 0.5); }
  50% { box-shadow: 0 0 15px rgba(250, 170, 147, 0.8); }
  100% { box-shadow: 0 0 5px rgba(250, 170, 147, 0.5); }
`;

/**
 * Enhanced Design Tab Component
 * 
 * Provides a comprehensive design workflow with status tracking and detailed sections
 * for each phase of the design process (AI Foundation, Wireframes, Figma Prototype, etc.)
 */
// Animation keyframes are already defined at the top of the file

// Styled component for icon with glow effect
const GlowingIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
  font-size: 1.25rem;
  color: ${colors.accent.primary};
  filter: drop-shadow(0 0 8px rgba(250, 170, 147, 0.6));
  animation: ${css`${pulseAnimation} 3s infinite ease-in-out`};
`;

// Styled components for modern tab system - moved to the top to ensure they're defined before use
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
  padding-bottom: ${spacing.md};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      rgba(250, 170, 147, 0.3), 
      rgba(130, 161, 191, 0.3), 
      rgba(250, 170, 147, 0.3));
  }
`;


const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const TabsWrapper = styled.div`
  position: relative;
  margin-bottom: ${spacing.xl};
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      rgba(250, 170, 147, 0.1), 
      rgba(130, 161, 191, 0.2), 
      rgba(250, 170, 147, 0.1));
    z-index: 0;
  }
  
  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const GenerateDesignButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.sm} ${spacing.md};
  background: linear-gradient(135deg, #b721ff 0%, #faaa93 100%);
  color: white;
  border: none;
  border-radius: ${borderRadius.md};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all ${transitions.medium};
  box-shadow: 0 4px 15px rgba(183, 33, 255, 0.3);
  margin-left: auto;
  margin-right: ${spacing.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(183, 33, 255, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(183, 33, 255, 0.3);
  }
  
  @media (max-width: ${breakpoints.md}) {
    padding: ${spacing.xs} ${spacing.sm};
    font-size: 0.85rem;
  }
`;

const TabsList = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.itemCount}, 1fr);
  width: 100%;
  margin-bottom: ${spacing.md};
  background: transparent;
  gap: ${spacing.xs};
`;

const TabButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: ${props => props.active ? `2px solid ${colors.accent.primary}` : '2px solid transparent'};
  padding: ${spacing.sm};
  box-shadow: none;
  border-radius: ${borderRadius.md};
  width: 100%;
  height: 70px;
  cursor: pointer;
  transition: all ${transitions.fast};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  position: relative;
  
  &:hover {
    border: 2px solid ${props => props.active ? colors.accent.primary : 'rgba(255, 255, 255, 0.2)'};
  }
  
  @media (max-width: ${breakpoints.md}) {
    width: 36px;
    height: 36px;
  }
  
  @media (max-width: ${breakpoints.sm}) {
    width: 32px;
    height: 32px;
  }
  
  &:before, &:after {
    display: none;
  }
  
  &:hover {
    background: transparent;
  }
`;

const TabIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${props => props.active ? colors.accent.primary : 'rgba(255, 255, 255, 0.7)'};
  transition: all ${transitions.fast};
  
  /* Icon sizing */
  svg {
    font-size: 1.8rem;
  }
  
  ${TabButton}:hover & {
    color: ${props => props.active ? colors.accent.primary : 'white'};
  }
  
  @media (max-width: ${breakpoints.md}) {
    svg {
      font-size: 1.5rem;
    }
  }
  
  @media (max-width: ${breakpoints.sm}) {
    svg {
      font-size: 1.3rem;
    }
  }
`;

const TabText = styled.span`
  font-size: ${typography.fontSizes.sm};
  font-weight: ${props => props.active ? typography.fontWeights.semiBold : typography.fontWeights.regular};
  color: ${props => props.active ? colors.accent.primary : colors.text.secondary};
  transition: all ${transitions.medium};
  background: ${props => props.active ?
    'linear-gradient(90deg, ${colors.accent.primary}, #ff5b92)' :
    'transparent'};
  background-clip: ${props => props.active ? 'text' : 'none'};
  -webkit-background-clip: ${props => props.active ? 'text' : 'none'};
  -webkit-text-fill-color: ${props => props.active ? 'transparent' : 'inherit'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: ${breakpoints.md}) {
    font-size: ${typography.fontSizes.xs};
  }
  
  @media (max-width: ${breakpoints.sm}) {
    max-width: 60px;
  }
`;

const TabTitle = styled.h3`
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${colors.text.primary};
  margin: ${spacing.sm} 0 ${spacing.md};
  text-align: center;
  background: linear-gradient(90deg, ${colors.accent.primary}, #ff5b92);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${fadeInAnimation} 0.5s ease-in-out;
  
  @media (max-width: ${breakpoints.md}) {
    font-size: ${typography.fontSizes.md};
    margin: ${spacing.xs} 0 ${spacing.sm};
  }

`;

const ActiveTabIndicator = styled.span`
  /* We'll use the :after pseudo-element on TabButton instead */
  display: none;
`;

const TabPanel = styled.div`
  padding: ${spacing.lg};
  background: rgba(18, 18, 23, 0.7);
  border-radius: ${borderRadius.lg};
  border-top-left-radius: ${props => props.activeTab === 'overview' ? '0' : borderRadius.lg};
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(250, 170, 147, 0.05);
  transition: all ${transitions.medium};
  animation: ${fadeInAnimation} 0.5s ease-in-out;
  position: relative;
  z-index: 1;
  
  @media (max-width: ${breakpoints.md}) {
    padding: ${spacing.md};
    border-radius: ${borderRadius.md};
    border-top-left-radius: ${props => props.activeTab === 'overview' ? '0' : borderRadius.md};
  }
  
  @media (max-width: ${breakpoints.sm}) {
    padding: ${spacing.sm};
  }
`;

const DesignTab = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeTab, setActiveTab] = useState('overview');
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Main navigation tabs
  // Define translations for Arabic
  const translations = {
    en: {
      overview: 'Overview',
      aiConcepts: 'AI Concepts',
      wireframes: 'Wireframes',
      figma: 'Figma Prototype',
      feedback: 'Feedback',
      styleGuide: 'Style Guide',
      assets: 'Assets',
      generateDesign: 'Generate with AI'
    },
    ar: {
      overview: 'نظرة عامة',
      aiConcepts: 'مفاهيم الذكاء الاصطناعي',
      wireframes: 'نماذج أولية',
      figma: 'نموذج فيجما',
      feedback: 'ملاحظات',
      styleGuide: 'دليل التصميم',
      assets: 'الأصول',
      generateDesign: 'إنشاء بالذكاء الاصطناعي'
    }
  };

  const tabItems = [
    {
      id: 'overview',
      label: t('designTab.overview', isRTL ? translations.ar.overview : translations.en.overview),
      icon: <FaRocket />,
      content: <OverviewSection />
    },
    {
      id: 'aiConcepts',
      label: t('designTab.aiConcepts', isRTL ? translations.ar.aiConcepts : translations.en.aiConcepts),
      icon: <FaLightbulb />,
      content: <AIConceptsSection />
    },
    {
      id: 'wireframes',
      label: t('designTab.wireframes', isRTL ? translations.ar.wireframes : translations.en.wireframes),
      icon: <FaPencilAlt />,
      content: <WireframesSection />
    },
    {
      id: 'figma',
      label: t('designTab.figma', isRTL ? translations.ar.figma : translations.en.figma),
      icon: <FaFigma />,
      content: <FigmaSection />
    },
    {
      id: 'feedback',
      label: t('designTab.feedback', isRTL ? translations.ar.feedback : translations.en.feedback),
      icon: <FaComments />,
      content: <FeedbackSection />
    },
    {
      id: 'styleGuide',
      label: t('designTab.styleGuide', isRTL ? translations.ar.styleGuide : translations.en.styleGuide),
      icon: <FaPalette />,
      content: <StyleGuideSection />
    },
    {
      id: 'assets',
      label: t('designTab.assets', isRTL ? translations.ar.assets : translations.en.assets),
      icon: <FaLayerGroup />,
      content: <AssetsSection />
    }
  ];

  const openDesignWizard = () => {
    setIsWizardOpen(true);
  };

  const closeDesignWizard = () => {
    setIsWizardOpen(false);
  };

  return (
    <PanelContainer dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Generate Design button */}
      <HeaderWrapper>
        <TabTitle>
          {tabItems.find(tab => tab.id === activeTab)?.label}
        </TabTitle>
        <HeaderActions>
          <GenerateDesignButton onClick={openDesignWizard}>
            <FaMagic style={{ marginRight: isRTL ? '0' : '8px', marginLeft: isRTL ? '8px' : '0' }} />
            {isRTL ? translations.ar.generateDesign : translations.en.generateDesign}
          </GenerateDesignButton>
        </HeaderActions>
      </HeaderWrapper>

      {/* Tabs */}
      <TabsList itemCount={tabItems.length}>
        {tabItems.map(tab => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            isRTL={isRTL}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
            id={`${tab.id}-tab`}
            aria-controls={`${tab.id}-panel`}
            title={tab.label}
          >
            <TabIconWrapper active={activeTab === tab.id} isRTL={isRTL}>
              {tab.icon}
            </TabIconWrapper>
          </TabButton>
        ))}
      </TabsList>

      {/* Tab Content */}
      <TabPanel
        activeTab={activeTab}
        role="tabpanel"
        id={`${activeTab}-panel`}
        aria-labelledby={`${activeTab}-tab`}
      >
        {tabItems.find(tab => tab.id === activeTab)?.content}
      </TabPanel>

      {/* Design Wizard Modal */}
      <DesignWizard 
        isOpen={isWizardOpen} 
        onClose={closeDesignWizard} 
      />
    </PanelContainer>
  );
};

// Enhanced OverviewSection with proper UI components
const OverviewSection = () => {
  const { t } = useTranslation();

  const designPhases = [
    {
      id: 'aiFoundation',
      icon: <FaLightbulb />,
      title: t('designTab.aiFoundation', 'AI Foundation'),
      description: t('designTab.aiFoundationDesc', 'AI-generated design concepts based on your requirements'),
      status: 'completed',
      color: colors.accent.primary,
      dueDate: '2025-05-15',
      assignee: 'Design Team',
      priority: 'high'
    },
    {
      id: 'wireframes',
      icon: <FaPencilAlt />,
      title: t('designTab.wireframes', 'Wireframes'),
      description: t('designTab.wireframesDesc', 'Low-fidelity layout sketches showing the basic structure and functionality'),
      status: 'completed',
      color: colors.accent.secondary,
      dueDate: '2025-05-20',
      assignee: 'UI/UX Team',
      priority: 'medium'
    },
    {
      id: 'figmaPrototype',
      icon: <FaFigma />,
      title: t('designTab.figmaPrototype', 'Figma Prototype'),
      description: t('designTab.figmaPrototypeDesc', 'Interactive high-fidelity mockups with animations and transitions'),
      status: 'inProgress',
      color: colors.status.warning,
      dueDate: '2025-06-05',
      assignee: 'Product Design',
      priority: 'high'
    },
    {
      id: 'feedback',
      icon: <FaComments />,
      title: t('designTab.feedback', 'Feedback & Iterations'),
      description: t('designTab.feedbackDesc', 'Client review and design refinement based on stakeholder input'),
      status: 'pending',
      color: colors.status.info,
      dueDate: '2025-06-15',
      assignee: 'Design Lead',
      priority: 'low'
    }
  ];

  // Summary metrics
  const summaryMetrics = [
    {
      title: t('designTab.completedPhases', 'Completed Phases'),
      value: '2',
      icon: <FaCheckCircle />,
      status: 'success'
    },
    {
      title: t('designTab.inProgressPhases', 'In Progress'),
      value: '1',
      icon: <FaChartLine />,
      status: 'warning'
    },
    {
      title: t('designTab.pendingPhases', 'Pending'),
      value: '1',
      icon: <FaEye />,
      status: 'info'
    }
  ];

  return (
    <SectionContainer>
      <SectionHeader>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <SectionTitle>
            <IconContainer
              icon={FaRocket}
              color={colors.accent.primary}
              size="1.5rem"
              background={`${colors.accent.primaryTransparent}`}
              round
            />
            {t('designTab.overviewTitle', 'Design Project Overview')}
          </SectionTitle>
          
          <GenerateDesignButton>
            <FaMagic style={{ marginRight: '8px' }} />
            {t('designTab.generateDesign', 'Generate Design')}
          </GenerateDesignButton>
        </div>
        
        <SectionSubtitle>
          {t('designTab.overviewDesc', 'Track your design project progress and access all design resources in one place.')}
        </SectionSubtitle>
      </SectionHeader>

      <DividerLine />

      {/* Summary Cards */}
      <CardRow>
        {summaryMetrics.map((metric, index) => (
          <DashboardCard
            key={index}
            variant="summary"
            icon={metric.icon}
            title={metric.title}
            value={metric.value}
            status={metric.status}
            gradient
            interactive
            onClick={() => console.log(`${metric.title} clicked`)}
          />
        ))}
      </CardRow>

      <SectionTitle>{t('designTab.designPhases', 'Design Phases')}</SectionTitle>

      <CardGrid>
        {designPhases.map(phase => (
          <DashboardCard
            key={phase.id}
            variant="task"
            title={phase.title}
            description={phase.description}
            icon={phase.icon}
            status={phase.status === 'completed' ? 'success' : phase.status === 'inProgress' ? 'warning' : 'info'}
            dueDate={phase.dueDate}
            dueDateIcon={<FaCalendarAlt />}
            assignee={phase.assignee}
            assigneeIcon={<FaUserAlt />}
            priority={phase.priority}
            statusIcon={phase.status === 'completed' ? <FaCheckCircle /> : phase.status === 'inProgress' ? <FaChartLine /> : <FaEye />}
            glowColor={phase.color + '33'}
            glow
            interactive
            onClick={() => console.log(`Phase ${phase.id} clicked`)}
          />
        ))}
      </CardGrid>

      <ActionRow>
        <GradientButton>
          <FaDownload />
          {t('designTab.downloadAssets', 'Download Assets')}
        </GradientButton>
        <GradientButton secondary>
          <FaExternalLinkAlt />
          {t('designTab.viewFigma', 'Open in Figma')}
        </GradientButton>
      </ActionRow>
    </SectionContainer>
  );
};

// Enhanced section components with proper UI
const AIConceptsSection = () => {
  const { t } = useTranslation();

  const concepts = [
    {
      id: 1,
      title: t('designTab.conceptTitle', 'Modern Dashboard'),
      description: t('designTab.conceptDesc', 'AI-generated dashboard design with dark theme and gradient accents'),
      image: '/assets/concept-1.jpg',
      date: '2025-05-28',
      tags: ['Dashboard', 'Dark Theme'],
      icon: <FaPalette />
    },
    {
      id: 2,
      title: t('designTab.conceptTitle', 'Mobile App UI'),
      description: t('designTab.conceptDesc', 'Clean mobile interface with minimalist controls and focused content areas'),
      image: '/assets/concept-2.jpg',
      date: '2025-05-28',
      tags: ['Mobile', 'Minimalist'],
      icon: <FaMobileAlt />
    },
    {
      id: 3,
      title: t('designTab.conceptTitle', 'Landing Page'),
      description: t('designTab.conceptDesc', 'Engaging landing page with hero section and clear call-to-action elements'),
      image: '/assets/concept-3.jpg',
      date: '2025-05-28',
      tags: ['Web', 'Marketing'],
      icon: <FaRocket />
    },
    {
      id: 4,
      title: t('designTab.conceptTitle', 'Analytics Dashboard'),
      description: t('designTab.conceptDesc', 'Data visualization dashboard with charts, graphs and interactive elements'),
      image: '/assets/concept-4.jpg',
      date: '2025-05-28',
      tags: ['Analytics', 'Data'],
      icon: <FaChartLine />
    }
  ];

  return (
    <SectionContainer>
      <SectionHeader>
        <div>
          <SectionTitle>
            <IconContainer
              icon={FaLightbulb}
              color={colors.accent.primary}
              size="1.5rem"
              background={colors.accent.primaryTransparent}
              round
            />
            {t('designTab.aiConceptsTitle', 'AI-Generated Design Concepts')}
          </SectionTitle>
          <SectionSubtitle>
            {t('designTab.aiConceptsDesc', 'Explore design concepts generated by AI based on your requirements.')}
          </SectionSubtitle>
        </div>
        <HeaderActions>
          <ActionButton primary>
            <FaMagic />
            {t('designTab.generateMore', 'Generate More')}
          </ActionButton>
        </HeaderActions>
      </SectionHeader>

      <DividerLine />

      <CardGrid>
        {concepts.map(concept => (
          <DashboardCard
            key={concept.id}
            variant="feature"
            icon={concept.icon}
            title={concept.title}
            accentColor={colors.accent.primary}
            gradient
            glow
            interactive
            onClick={() => console.log(`Concept ${concept.id} clicked`)}
          >
            <p>{concept.description}</p>
            <TagsRow>
              {concept.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagsRow>
            <ActionRow>
              <ActionButton primary small>
                {t('actions.select', 'Select')}
              </ActionButton>
              <ActionButton secondary small>
                {t('actions.refine', 'Refine')}
              </ActionButton>
            </ActionRow>
          </DashboardCard>
        ))}
      </CardGrid>
    </SectionContainer>
  );
};

const WireframesSection = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>
          <IconContainer
            icon={FaPencilAlt}
            color="#7b2cbf"
            size="1.2em"
            background="rgba(123, 44, 191, 0.1)"
            round
          />
          {t('designTab.wireframesTitle', 'Wireframes & Sketches')}
        </SectionTitle>
      </SectionHeader>

      <DividerLine />

      <WireframeGrid>
        {[1, 2, 3, 4].map(item => (
          <WireframeCard key={item}>
            <WireframePreview>
              <WireframeImage src={`/assets/wireframe-${item}.jpg`} alt={`Wireframe ${item}`} />
            </WireframePreview>
            <WireframeInfo>
              <WireframeTitle>{t('designTab.wireframeTitle', 'Homepage Wireframe')}</WireframeTitle>
              <WireframeMeta>
                <CustomBadge>{t('designTab.approved', 'Approved')}</CustomBadge>
              </WireframeMeta>
            </WireframeInfo>
          </WireframeCard>
        ))}
      </WireframeGrid>
    </SectionContainer>
  );
};

const FigmaSection = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>
          <IconContainer
            icon={FaFigma}
            color="#faaa93"
            size="1.2em"
            background="rgba(250, 170, 147, 0.1)"
            round
          />
          {t('designTab.figmaTitle', 'Figma Prototype')}
        </SectionTitle>
      </SectionHeader>

      <DividerLine />

      <FigmaContainer>
        <FigmaEmbed src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FexampleID%2FDevFolio" />
      </FigmaContainer>

      <FigmaActions>
        <GradientButton>
          <FaExternalLinkAlt />
          {t('designTab.openInFigma', 'Open in Figma')}
        </GradientButton>
        <GradientButton secondary>
          <FaDownload />
          {t('designTab.downloadFigma', 'Download Figma File')}
        </GradientButton>
      </FigmaActions>
    </SectionContainer>
  );
};

const FeedbackSection = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>
          <IconContainer
            icon={FaComments}
            color="#82a1bf"
            size="1.2em"
            background="rgba(130, 161, 191, 0.1)"
            round
          />
          {t('designTab.feedbackTitle', 'Design Feedback')}
        </SectionTitle>
      </SectionHeader>

      <DividerLine />

      <FeedbackContainer>
        <FeedbackForm>
          <FormTitle>{t('designTab.provideFeedback', 'Provide Feedback')}</FormTitle>
          <FormField>
            <FormLabel>{t('designTab.feedbackType', 'Feedback Type')}</FormLabel>
            <FormSelect>
              <option value="general">{t('designTab.general', 'General Feedback')}</option>
              <option value="specific">{t('designTab.specific', 'Specific Element')}</option>
              <option value="revision">{t('designTab.revision', 'Revision Request')}</option>
            </FormSelect>
          </FormField>
          <FormField>
            <FormLabel>{t('designTab.feedbackMessage', 'Your Feedback')}</FormLabel>
            <FormTextarea placeholder={t('designTab.feedbackPlaceholder', 'Enter your design feedback here...')} />
          </FormField>
          <FormActions>
            <GradientButton>
              {t('designTab.submitFeedback', 'Submit Feedback')}
            </GradientButton>
          </FormActions>
        </FeedbackForm>

        <FeedbackHistory>
          <HistoryTitle>{t('designTab.feedbackHistory', 'Previous Feedback')}</HistoryTitle>
          <FeedbackList>
            {[1, 2, 3].map(item => (
              <FeedbackItem key={item}>
                <FeedbackHeader>
                  <FeedbackAuthor>{t('designTab.clientName', 'Client')}</FeedbackAuthor>
                  <FeedbackDate>May {20 + item}, 2025</FeedbackDate>
                </FeedbackHeader>
                <FeedbackContent>
                  {t('designTab.sampleFeedback', 'I love the overall design, but can we make the header more prominent and use a slightly darker shade of blue for the buttons?')}
                </FeedbackContent>
                <FeedbackStatus resolved={item !== 3}>
                  {item !== 3 ? t('designTab.resolved', 'Resolved') : t('designTab.pending', 'Pending')}
                </FeedbackStatus>
              </FeedbackItem>
            ))}
          </FeedbackList>
        </FeedbackHistory>
      </FeedbackContainer>
    </SectionContainer>
  );
};

const StyleGuideSection = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>
          <IconContainer
            icon={FaPalette}
            color="#ff5b92"
            size="1.2em"
            background="rgba(255, 91, 146, 0.1)"
            round
          />
          {t('designTab.styleGuideTitle', 'Style Guide & Documentation')}
        </SectionTitle>
      </SectionHeader>

      <DividerLine />

      <StyleGuideContainer>
        <StyleGuideBlock>
          <StyleGuideSectionTitle>{t('designTab.colorPalette', 'Color Palette')}</StyleGuideSectionTitle>
          <ColorPaletteGrid>
            <ColorSwatch color="#feefc4" name="Background" hex="#feefc4" />
            <ColorSwatch color="#faaa93" name="Accent 1" hex="#faaa93" />
            <ColorSwatch color="#82a1bf" name="Accent 2" hex="#82a1bf" />
            <ColorSwatch color="#513a52" name="Dark" hex="#513a52" />
            <ColorSwatch color="#4CAF50" name="Success" hex="#4CAF50" />
            <ColorSwatch color="#FFC107" name="Warning" hex="#FFC107" />
          </ColorPaletteGrid>
        </StyleGuideBlock>

        <StyleGuideBlock>
          <StyleGuideSectionTitle>{t('designTab.typography', 'Typography')}</StyleGuideSectionTitle>
          <TypographySamples>
            <TypographyItem>
              <TypographyTitle>H1 - Page Title</TypographyTitle>
              <TypographySample style={{ fontSize: '1.75rem', fontWeight: 600 }}>Page Title</TypographySample>
            </TypographyItem>
            <TypographyItem>
              <TypographyTitle>H2 - Section Title</TypographyTitle>
              <TypographySample style={{ fontSize: '1.5rem', fontWeight: 600 }}>Section Title</TypographySample>
            </TypographyItem>
            <TypographyItem>
              <TypographyTitle>H3 - Card Title</TypographyTitle>
              <TypographySample style={{ fontSize: '1.1rem', fontWeight: 600 }}>Card Title</TypographySample>
            </TypographyItem>
            <TypographyItem>
              <TypographyTitle>Body Text</TypographyTitle>
              <TypographySample style={{ fontSize: '0.95rem', fontWeight: 400 }}>Regular text used for content</TypographySample>
            </TypographyItem>
          </TypographySamples>
        </StyleGuideBlock>
      </StyleGuideContainer>
    </SectionContainer>
  );
};

const AssetsSection = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>
          <IconContainer
            icon={FaLayerGroup}
            color="#82a1bf"
            size="1.2em"
            background="rgba(130, 161, 191, 0.1)"
            round
          />
          {t('designTab.assetsTitle', 'Assets & Resources')}
        </SectionTitle>
      </SectionHeader>

      <DividerLine />

      <div>
        <AssetCategories>
          <div>
            <AssetCategoryButton active>
              <FaImages />
              {t('designTab.images', 'Images')}
            </AssetCategoryButton>
            <AssetCategoryButton>
              <FaLayerGroup />
              {t('designTab.icons', 'Icons')}
            </AssetCategoryButton>
            <AssetCategoryButton>
              <FaCode />
              {t('designTab.code', 'Code Snippets')}
            </AssetCategoryButton>
          </div>
        </AssetCategories>

        <AssetsGrid>
          {[1, 2, 3, 4, 5, 6].map(item => (
            <AssetCard key={item}>
              <AssetPreview>
                <AssetImage src={`/assets/asset-${item}.jpg`} alt={`Asset ${item}`} />
              </AssetPreview>
              <AssetInfo>
                <AssetTitle>{t('designTab.assetTitle', 'Hero Image')} {item}</AssetTitle>
                <AssetMeta>
                  <AssetFormat>PNG</AssetFormat>
                  <AssetSize>1.2 MB</AssetSize>
                </AssetMeta>
              </AssetInfo>
              <AssetActions>
                <AssetButton>
                  <FaEye />
                </AssetButton>
                <AssetButton>
                  <FaDownload />
                </AssetButton>
              </AssetActions>
            </AssetCard>
          ))}
        </AssetsGrid>
      </div>
    </SectionContainer>
  );
};

// Styled components for modern tab system - now defined at the top of the file


// These styled components are already declared at the top of the file


// TabButton component is already defined at the top of the file


// TabIconWrapper, TabText, ActiveTabIndicator, and TabPanel components are already defined at the top of the file

// Asset related styled components
const AssetCategories = styled.div`
  display: flex;
  margin-bottom: ${spacing.md};
  gap: ${spacing.sm};
  flex-wrap: wrap;
`;


const AssetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${spacing.md};
`;

const AssetCard = styled(Card)`
  overflow: hidden;
  border-radius: 12px;
  transition: all 0.3s ease;
`;

const AssetPreview = styled.div`
  position: relative;
  height: 140px;
  overflow: hidden;
`;

const AssetImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const AssetInfo = styled.div`
  padding: ${spacing.sm};
`;

const AssetTitle = styled.h4`
  margin: 0 0 ${spacing.xs} 0;
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
`;

const AssetMeta = styled.div`
  display: flex;
  gap: ${spacing.xs};
  font-size: ${typography.fontSizes.xs};
  color: ${colors.text.secondary};
`;

const AssetFormat = styled.span`
  padding: 2px 6px;
  background: rgba(81, 58, 82, 0.2);
  border-radius: ${borderRadius.sm};
`;

const AssetSize = styled.span`
  padding: 2px 6px;
`;

const AssetActions = styled.div`
  display: flex;
  padding: ${spacing.xs} ${spacing.sm};
  justify-content: flex-end;
  gap: ${spacing.xs};
`;

const AssetButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.text.secondary};
  cursor: pointer;
  padding: ${spacing.xs};
  border-radius: ${borderRadius.sm};
  transition: all ${transitions.fast};
  
  &:hover {
    color: ${colors.text.primary};
    background: rgba(81, 58, 82, 0.2);
  }
`;

const AssetsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
  padding-bottom: ${spacing.md};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      rgba(250, 170, 147, 0.3), 
      rgba(130, 161, 191, 0.3), 
      rgba(250, 170, 147, 0.3));
  }
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: ${typography.fontSizes.xxl};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${colors.text.primary};
  display: flex;
  align-items: center;
  margin-right: ${spacing.md};
  background: linear-gradient(90deg, ${colors.accent.primary}, #ff5b92);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(255, 91, 146, 0.2);
`;


const Placeholder = styled.div`
  padding: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  background: rgba(35, 38, 85, 0.4);
  border-radius: 10px;
  margin: 1rem 0;
`;

const SectionContainer = styled.div`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  margin-bottom: 1.5rem;
`;

// Card components for design phases
const DesignPhaseCard = styled(Card)`
  background: rgba(35, 38, 85, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CardIconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => `linear-gradient(45deg, ${props.color}33, ${props.color}22)`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${props => props.color || '#ff5b92'};
`;

const StatusIndicator = styled.div`
  font-size: 1rem;
  color: ${props => {
    switch (props.status) {
      case 'completed': return '#27ae60';
      case 'inProgress': return '#f39c12';
      default: return '#9E9E9E';
    }
  }};
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.75rem;
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CustomStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'completed': return 'rgba(39, 174, 96, 0.2)';
      case 'inProgress': return 'rgba(243, 156, 18, 0.2)';
      default: return 'rgba(189, 195, 199, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return '#2ecc71';
      case 'inProgress': return '#f1c40f';
      default: return '#bdc3c7';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'completed': return 'rgba(39, 174, 96, 0.3)';
      case 'inProgress': return 'rgba(243, 156, 18, 0.3)';
      default: return 'rgba(189, 195, 199, 0.3)';
    }
  }};
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #ff5b92;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    font-size: 0.75rem;
    transition: transform 0.2s ease;
  }
  
  &:hover {
    color: #faaa93;
    
    svg {
      transform: translateX(3px);
    }
  }
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Using the ActionRow component defined below


// AI Concepts section components
const ConceptsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ConceptCard = styled(Card)`
  overflow: hidden;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
`;

const ConceptPreview = styled.div`
  position: relative;
  height: 180px;
  overflow: hidden;
  
  &:hover {
    img {
      transform: scale(1.05);
    }
    
    div {
      opacity: 1;
    }
  }
`;

const ConceptImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const ConceptOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 32, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const OverlayButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, #cd3efd, #7b2cbf);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ConceptInfo = styled.div`
  padding: 1rem;
`;

const ConceptTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const ConceptMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ConceptDate = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

// Wireframes section components
const WireframeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const WireframeCard = styled(Card)`
  overflow: hidden;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
`;

const WireframePreview = styled.div`
  height: 180px;
  overflow: hidden;
`;

const WireframeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${WireframeCard}:hover & {
    transform: scale(1.05);
  }
`;

const WireframeInfo = styled.div`
  padding: 1rem;
`;

const WireframeTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const WireframeMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Figma section components
const FigmaContainer = styled.div`
  width: 100%;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const FigmaEmbed = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const FigmaActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Feedback section components
const FeedbackContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FeedbackForm = styled.div`
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const FormTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
`;

const FormSelect = styled.select`
  width: 100%;
  background: rgba(26, 26, 32, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.9rem;
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #cd3efd;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  height: 150px;
  background: rgba(26, 26, 32, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.9rem;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: #cd3efd;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FeedbackHistory = styled.div`
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const HistoryTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
`;

const FeedbackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FeedbackItem = styled.div`
  background: rgba(26, 26, 32, 0.6);
  border-radius: 8px;
  padding: 1rem;
  border-left: 3px solid #cd3efd;
`;

const FeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const FeedbackAuthor = styled.div`
  font-weight: 600;
  color: white;
`;

const FeedbackDate = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const FeedbackContent = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 0.75rem;
`;

const FeedbackStatus = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => props.resolved ? '#2ecc71' : '#f1c40f'};
`;

// Style Guide section components
const StyleGuideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StyleGuideBlock = styled.div`
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const StyleGuideSectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 18px;
    background: linear-gradient(to bottom, #faaa93, #ff5b92);
    margin-right: 0.75rem;
    border-radius: 2px;
  }
`;

const ColorPaletteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
`;

const ColorSwatch = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &:before {
    content: '';
    display: block;
    width: 60px;
    height: 60px;
    border-radius: 12px;
    background-color: ${props => props.color};
    margin-bottom: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  &:after {
    content: '${props => props.name}';
    font-size: 0.85rem;
    color: white;
    margin-bottom: 0.25rem;
  }
`;

const TypographySamples = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TypographyItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TypographyTitle = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
`;

const TypographySample = styled.div`
  color: white;
  line-height: 1.5;
`;

// Assets section components
const AssetCategoryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.active ? 'rgba(96, 49, 168, 0.6)' : 'rgba(35, 38, 85, 0.6)'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(96, 49, 168, 0.6);
  }
  
  svg {
    font-size: 1rem;
  }
`;

// Add missing styled components
const SectionDescriptionText = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
  line-height: 1.5;
`;

const SectionSubtitle = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
  line-height: 1.5;
  max-width: 600px;
`;

const CardRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  background: rgba(130, 161, 191, 0.15);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(130, 161, 191, 0.2);
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const DividerLine = styled.div`
  height: 1px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  margin: 1.5rem 0;
`;

const CustomBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(205, 62, 253, 0.2);
  color: #cd3efd;
  border: 1px solid rgba(205, 62, 253, 0.3);
`;

export default DesignTab;
