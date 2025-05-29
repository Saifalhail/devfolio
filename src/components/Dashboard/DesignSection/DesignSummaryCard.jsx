import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaEdit, 
  FaPalette, 
  FaFont, 
  FaLayerGroup, 
  FaLightbulb,
  FaCheck
} from 'react-icons/fa';
import { colors, spacing, shadows, borderRadius, transitions, typography, breakpoints } from '../../../styles/GlobalTheme';

/**
 * Design Summary Card Component
 * 
 * Displays a summary of the AI-generated design recommendations
 * based on user preferences collected in the Design Wizard.
 */
const DesignSummaryCard = ({ summary, onEdit }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  if (!summary) return null;
  
  return (
    <Container>
      <Header>
        <Title>{t('design.designSummary', 'Your Design Summary')}</Title>
        <EditButton onClick={onEdit} aria-label={t('common.edit', 'Edit')}>
          <FaEdit />
          {t('common.edit', 'Edit')}
        </EditButton>
      </Header>
      
      <SummaryContent>
        <SummarySection>
          <SectionTitle>
            <SectionIcon><FaLightbulb /></SectionIcon>
            {t('design.stylePreference', 'Style Preference')}
          </SectionTitle>
          <SectionContent>{summary.styleDescription}</SectionContent>
        </SummarySection>
        
        <SummarySection>
          <SectionTitle>
            <SectionIcon><FaPalette /></SectionIcon>
            {t('design.colorPalette', 'Color Palette')}
          </SectionTitle>
          <ColorPaletteDisplay>
            {Object.entries(summary.colorPalette).map(([name, color]) => (
              <ColorSwatch key={name}>
                <ColorSwatchVisual color={color} />
                <ColorSwatchLabel>
                  <ColorName>{t(`design.color.${name}`, name)}</ColorName>
                  <ColorValue>{color}</ColorValue>
                </ColorSwatchLabel>
              </ColorSwatch>
            ))}
          </ColorPaletteDisplay>
        </SummarySection>
        
        <SummarySection>
          <SectionTitle>
            <SectionIcon><FaFont /></SectionIcon>
            {t('design.typography', 'Typography')}
          </SectionTitle>
          <TypographyDisplay>
            <TypographyItem>
              <TypographyLabel>{t('design.headingFont', 'Heading Font')}</TypographyLabel>
              <TypographySample font={summary.typography.headingFont} size="1.5rem">
                {summary.typography.headingFont.split(',')[0]}
              </TypographySample>
            </TypographyItem>
            <TypographyItem>
              <TypographyLabel>{t('design.bodyFont', 'Body Font')}</TypographyLabel>
              <TypographySample font={summary.typography.bodyFont} size="1rem">
                {summary.typography.bodyFont.split(',')[0]}
              </TypographySample>
            </TypographyItem>
          </TypographyDisplay>
        </SummarySection>
        
        <SummarySection>
          <SectionTitle>
            <SectionIcon><FaLayerGroup /></SectionIcon>
            {t('design.layoutStyle', 'Layout Style')}
          </SectionTitle>
          <SectionContent>{t(`design.${summary.layout}Layout`, summary.layout)}</SectionContent>
        </SummarySection>
        
        <SummarySection>
          <SectionTitle>
            <SectionIcon><FaCheck /></SectionIcon>
            {t('design.recommendations', 'Recommendations')}
          </SectionTitle>
          <RecommendationsList>
            {summary.recommendations.map((recommendation, index) => (
              <RecommendationItem key={index}>
                {recommendation}
              </RecommendationItem>
            ))}
          </RecommendationsList>
        </SummarySection>
      </SummaryContent>
      
      <AIBadge>
        <AIBadgeIcon>AI</AIBadgeIcon>
        {t('design.aiGenerated', 'AI Generated Design')}
      </AIBadge>
    </Container>
  );
};

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled Components
const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  position: relative;
  animation: ${fadeIn} 0.5s ease-in-out;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.lg};
  padding-bottom: ${spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h3`
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.bold};
  color: white;
  margin: 0;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  background: transparent;
  color: ${colors.accent.primary};
  border: none;
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: all ${transitions.medium};
  
  &:hover {
    color: white;
    transform: translateY(-1px);
  }
`;

const SummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const SummarySection = styled.div`
  animation: ${fadeIn} 0.5s ease-in-out;
  animation-fill-mode: both;
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }
`;

const SectionTitle = styled.h4`
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.semiBold};
  color: white;
  margin: 0 0 ${spacing.sm} 0;
  display: flex;
  align-items: center;
`;

const SectionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
  color: ${colors.accent.primary};
  
  [dir="rtl"] & {
    margin-right: 0;
    margin-left: ${spacing.sm};
  }
`;

const SectionContent = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: ${typography.fontSizes.md};
`;

const ColorPaletteDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${spacing.md};
  
  @media (max-width: ${breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ColorSwatch = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const ColorSwatchVisual = styled.div`
  width: 30px;
  height: 30px;
  border-radius: ${borderRadius.sm};
  background-color: ${props => props.color};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ColorSwatchLabel = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColorName = styled.span`
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.semiBold};
  color: white;
  text-transform: capitalize;
`;

const ColorValue = styled.span`
  font-size: ${typography.fontSizes.xs};
  color: rgba(255, 255, 255, 0.6);
`;

const TypographyDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const TypographyItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const TypographyLabel = styled.span`
  font-size: ${typography.fontSizes.sm};
  color: rgba(255, 255, 255, 0.7);
`;

const TypographySample = styled.div`
  font-family: ${props => props.font};
  font-size: ${props => props.size || '1rem'};
  color: white;
  background: rgba(255, 255, 255, 0.05);
  padding: ${spacing.sm};
  border-radius: ${borderRadius.sm};
`;

const RecommendationsList = styled.ul`
  margin: 0;
  padding-left: ${spacing.lg};
  
  [dir="rtl"] & {
    padding-left: 0;
    padding-right: ${spacing.lg};
  }
`;

const RecommendationItem = styled.li`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: ${spacing.xs};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const AIBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  background: linear-gradient(90deg, rgba(205, 62, 253, 0.2), rgba(123, 44, 191, 0.2));
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite linear;
  color: white;
  font-size: ${typography.fontSizes.xs};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.pill};
  position: absolute;
  bottom: ${spacing.md};
  right: ${spacing.md};
  
  [dir="rtl"] & {
    right: auto;
    left: ${spacing.md};
  }
`;

const AIBadgeIcon = styled.span`
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.accent.primary};
`;

export default DesignSummaryCard;
