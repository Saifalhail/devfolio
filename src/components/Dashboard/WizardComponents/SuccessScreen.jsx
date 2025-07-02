import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaLightbulb, FaCode, FaClock, FaMoneyBillWave, FaExclamationTriangle, FaTrophy, FaArrowRight } from 'react-icons/fa';
import { colors, spacing, borderRadius, shadows, transitions } from '../../../styles/GlobalTheme';

/**
 * SuccessScreen component for displaying a success message after project submission
 * 
 * @param {Object} props
 * @param {string} props.projectId - The ID of the submitted project
 * @param {Function} props.onReturnToDashboard - Function to call when return to dashboard button is clicked
 * @param {boolean} props.isRTL - Whether the layout is RTL
 * @param {Object} props.aiInsights - AI-generated project insights (optional)
 */
const SuccessScreen = ({ projectId, onReturnToDashboard, isRTL = false, aiInsights }) => {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <SuccessContainer isRTL={isRTL}>
      <SuccessIcon>
        <FaCheckCircle size={60} />
      </SuccessIcon>
      <SuccessTitle isRTL={isRTL}>
        {t('projects.wizard.step7.successTitle', 'Project Created Successfully!')}
      </SuccessTitle>
      <SuccessMessage isRTL={isRTL}>
        {t('projects.wizard.step7.successMessage', 'Your project has been created successfully. Your project ID is:')}
      </SuccessMessage>
      <ProjectId isRTL={isRTL}>{projectId}</ProjectId>
      
      {/* AI Insights Section */}
      {aiInsights && (
        <InsightsContainer isRTL={isRTL}>
          <InsightsTitle isRTL={isRTL}>
            <FaLightbulb style={{ marginRight: isRTL ? 0 : '8px', marginLeft: isRTL ? '8px' : 0 }} />
            {t('projects.wizard.aiInsights.title', 'AI Project Insights')}
          </InsightsTitle>
          
          {/* Executive Summary */}
          {aiInsights.executiveSummary && (
            <InsightCard isRTL={isRTL}>
              <CardHeader>
                <h4>{t('projects.wizard.aiInsights.executiveSummary', 'Executive Summary')}</h4>
              </CardHeader>
              <CardContent>{aiInsights.executiveSummary}</CardContent>
            </InsightCard>
          )}
          
          {/* Project Feasibility */}
          {aiInsights.projectFeasibility && (
            <InsightSection isRTL={isRTL}>
              <SectionHeader onClick={() => toggleSection('feasibility')} isRTL={isRTL}>
                <SectionTitle>
                  <FaTrophy />
                  {t('projects.wizard.aiInsights.feasibility', 'Project Feasibility')}
                  <FeasibilityScore>{aiInsights.projectFeasibility.score}/10</FeasibilityScore>
                </SectionTitle>
                {expandedSections.feasibility ? <FaChevronUp /> : <FaChevronDown />}
              </SectionHeader>
              {expandedSections.feasibility && (
                <SectionContent>
                  <p>{aiInsights.projectFeasibility.assessment}</p>
                  <ul>
                    {aiInsights.projectFeasibility.keyConsiderations?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </SectionContent>
              )}
            </InsightSection>
          )}
          
          {/* Technical Recommendations */}
          {aiInsights.technicalRecommendations && (
            <InsightSection isRTL={isRTL}>
              <SectionHeader onClick={() => toggleSection('technical')} isRTL={isRTL}>
                <SectionTitle>
                  <FaCode />
                  {t('projects.wizard.aiInsights.technicalRecommendations', 'Technical Recommendations')}
                </SectionTitle>
                {expandedSections.technical ? <FaChevronUp /> : <FaChevronDown />}
              </SectionHeader>
              {expandedSections.technical && (
                <SectionContent>
                  <TechStackGrid>
                    {aiInsights.technicalRecommendations.suggestedTechStack && Object.entries(aiInsights.technicalRecommendations.suggestedTechStack).map(([category, techs]) => (
                      <TechCategory key={category}>
                        <h5>{category.charAt(0).toUpperCase() + category.slice(1)}:</h5>
                        <TechList>
                          {techs.map((tech, index) => (
                            <TechBadge key={index}>{tech}</TechBadge>
                          ))}
                        </TechList>
                      </TechCategory>
                    ))}
                  </TechStackGrid>
                  <p><strong>{t('projects.wizard.aiInsights.architecture', 'Architecture')}:</strong> {aiInsights.technicalRecommendations.architecturePattern}</p>
                </SectionContent>
              )}
            </InsightSection>
          )}
          
          {/* Timeline Estimate */}
          {aiInsights.timelineEstimate && (
            <InsightSection isRTL={isRTL}>
              <SectionHeader onClick={() => toggleSection('timeline')} isRTL={isRTL}>
                <SectionTitle>
                  <FaClock />
                  {t('projects.wizard.aiInsights.timeline', 'Timeline Estimate')}
                  <Badge>{aiInsights.timelineEstimate.totalDuration}</Badge>
                </SectionTitle>
                {expandedSections.timeline ? <FaChevronUp /> : <FaChevronDown />}
              </SectionHeader>
              {expandedSections.timeline && (
                <SectionContent>
                  {aiInsights.timelineEstimate.phases?.map((phase, index) => (
                    <PhaseItem key={index}>
                      <PhaseName>{phase.name}</PhaseName>
                      <PhaseDuration>{phase.duration}</PhaseDuration>
                    </PhaseItem>
                  ))}
                </SectionContent>
              )}
            </InsightSection>
          )}
          
          {/* Budget Analysis */}
          {aiInsights.budgetAnalysis && (
            <InsightSection isRTL={isRTL}>
              <SectionHeader onClick={() => toggleSection('budget')} isRTL={isRTL}>
                <SectionTitle>
                  <FaMoneyBillWave />
                  {t('projects.wizard.aiInsights.budget', 'Budget Analysis')}
                  <Badge>{aiInsights.budgetAnalysis.estimatedCost}</Badge>
                </SectionTitle>
                {expandedSections.budget ? <FaChevronUp /> : <FaChevronDown />}
              </SectionHeader>
              {expandedSections.budget && (
                <SectionContent>
                  <ul>
                    {aiInsights.budgetAnalysis.costOptimizationTips?.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </SectionContent>
              )}
            </InsightSection>
          )}
          
          {/* Next Steps */}
          {aiInsights.nextSteps && aiInsights.nextSteps.length > 0 && (
            <InsightCard isRTL={isRTL}>
              <CardHeader>
                <h4>
                  <FaArrowRight style={{ marginRight: isRTL ? 0 : '8px', marginLeft: isRTL ? '8px' : 0 }} />
                  {t('projects.wizard.aiInsights.nextSteps', 'Recommended Next Steps')}
                </h4>
              </CardHeader>
              <CardContent>
                <NextStepsList>
                  {aiInsights.nextSteps.map((step, index) => (
                    <NextStepItem key={index}>
                      <StepNumber>{index + 1}</StepNumber>
                      <span>{step}</span>
                    </NextStepItem>
                  ))}
                </NextStepsList>
              </CardContent>
            </InsightCard>
          )}
        </InsightsContainer>
      )}
      
      <ReturnButton onClick={onReturnToDashboard} isRTL={isRTL}>
        {t('projects.wizard.step7.returnToDashboard', 'Return to Dashboard')}
      </ReturnButton>
    </SuccessContainer>
  );
};

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
  height: 100%;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    padding: ${spacing.md};
  }
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  color: ${colors.success};
  margin-bottom: ${spacing.lg};
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const SuccessTitle = styled.h2`
  color: ${colors.accent.primary};
  font-size: 2rem;
  margin: ${spacing.lg} 0;
  text-align: center;
  width: 100%;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin: ${spacing.md} 0;
  }
`;

const ProjectId = styled.div`
  background-color: ${colors.background.secondary};
  padding: ${spacing.md} ${spacing.xl};
  border-radius: ${borderRadius.md};
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.accent.primary};
  margin: ${spacing.md} 0 ${spacing.xl};
  letter-spacing: 2px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: ${spacing.sm} ${spacing.md};
    margin: ${spacing.sm} 0 ${spacing.lg};
    max-width: 90%;
    overflow-wrap: break-word;
  }
`;

const SuccessMessage = styled.p`
  color: ${colors.text.primary};
  font-size: 1.2rem;
  margin-bottom: ${spacing.md};
  text-align: center;
  max-width: 90%;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ReturnButton = styled.button`
  background: linear-gradient(to right, ${colors.accent.primary}, ${colors.accent.secondary});
  color: white;
  border: none;
  padding: ${spacing.md} ${spacing.xl};
  border-radius: ${borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  margin-top: ${spacing.xl};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: ${spacing.sm} ${spacing.lg};
    font-size: 0.9rem;
    width: 80%;
    max-width: 300px;
  }
`;

const InsightsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: ${spacing.xl} 0;
  padding: ${spacing.lg};
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.md};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    padding: ${spacing.md};
    margin: ${spacing.lg} 0;
  }
`;

const InsightsTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.accent.primary};
  font-size: 1.5rem;
  margin-bottom: ${spacing.lg};
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const InsightCard = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  margin-bottom: ${spacing.md};
  box-shadow: ${shadows.sm};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const CardHeader = styled.div`
  h4 {
    color: ${colors.accent.primary};
    margin: 0 0 ${spacing.sm} 0;
    display: flex;
    align-items: center;
  }
`;

const CardContent = styled.div`
  color: ${colors.text.primary};
  line-height: 1.6;
`;

const InsightSection = styled.div`
  background: ${colors.background.primary};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.md};
  overflow: hidden;
  box-shadow: ${shadows.sm};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.md};
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: ${colors.background.secondary};
  }
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  color: ${colors.accent.primary};
  font-weight: 600;
`;

const SectionContent = styled.div`
  padding: 0 ${spacing.md} ${spacing.md};
  color: ${colors.text.primary};
  line-height: 1.6;
  
  ul {
    margin: ${spacing.sm} 0;
    padding-left: ${spacing.lg};
    
    li {
      margin-bottom: ${spacing.xs};
    }
  }
`;

const FeasibilityScore = styled.span`
  background: ${colors.accent.primary};
  color: white;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  font-size: 0.9rem;
  margin-left: auto;
`;

const Badge = styled.span`
  background: ${colors.accent.secondary};
  color: white;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  font-size: 0.85rem;
  margin-left: auto;
`;

const TechStackGrid = styled.div`
  margin: ${spacing.md} 0;
`;

const TechCategory = styled.div`
  margin-bottom: ${spacing.md};
  
  h5 {
    color: ${colors.text.secondary};
    margin-bottom: ${spacing.xs};
    font-size: 0.9rem;
    text-transform: uppercase;
  }
`;

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.xs};
`;

const TechBadge = styled.span`
  background: ${colors.accent.primary}20;
  color: ${colors.accent.primary};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  font-size: 0.85rem;
  border: 1px solid ${colors.accent.primary}40;
`;

const PhaseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.sm} 0;
  border-bottom: 1px solid ${colors.background.secondary};
  
  &:last-child {
    border-bottom: none;
  }
`;

const PhaseName = styled.span`
  font-weight: 500;
`;

const PhaseDuration = styled.span`
  color: ${colors.text.secondary};
  font-size: 0.9rem;
`;

const NextStepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const NextStepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm};
`;

const StepNumber = styled.span`
  background: ${colors.accent.primary};
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  flex-shrink: 0;
`;

export default SuccessScreen;
