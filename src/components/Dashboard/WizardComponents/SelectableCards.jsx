import React from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, shadows, transitions, typography } from '../../../styles/GlobalTheme';
import { useTranslation } from 'react-i18next';

/**
 * SelectableCards - A grid-based set of selectable cards with icons
 * 
 * @param {Array} options - Array of option objects with { id, label, icon, description }
 * @param {string} selectedValue - Currently selected value
 * @param {function} onChange - Callback when selection changes
 * @param {boolean} required - Whether selection is required
 */
const SelectableCards = ({ 
  options = [], 
  selectedValue, 
  onChange, 
  required = false 
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <CardsContainer isRTL={isRTL}>
      <CardsGrid>
        {options.map(option => (
          <Card 
            key={option.id} 
            selected={option.id === selectedValue}
            onClick={() => onChange(option.id)}
            isRTL={isRTL}
          >
            <CardIcon>
              {option.icon}
            </CardIcon>
            <CardLabel>
              {option.label}
            </CardLabel>
            {option.description && (
              <CardDescription>
                {option.description}
              </CardDescription>
            )}
          </Card>
        ))}
      </CardsGrid>
    </CardsContainer>
  );
};

const CardsContainer = styled.div`
  position: relative;
  width: 100%;
  margin: ${spacing.md} 0;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.md};
  width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${spacing.sm};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${spacing.sm};
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${spacing.xs};
  }
`;

const Card = styled.div`
  height: 140px;
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3))'
    : 'linear-gradient(135deg, rgba(74, 108, 247, 0.05), rgba(255, 255, 255, 0.05))'};
  border: 2px solid ${props => props.selected 
    ? 'rgba(138, 43, 226, 0.8)' 
    : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  cursor: pointer;
  transition: all ${transitions.fast};
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    height: 160px;
    padding: ${spacing.md} ${spacing.sm};
    border: ${props => props.selected ? '2px solid rgba(138, 43, 226, 0.8)' : '2px solid rgba(255, 255, 255, 0.1)'};
  }
  
  @media (max-width: 480px) {
    height: 180px;
    padding: ${spacing.md} ${spacing.sm};
  }
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(138, 43, 226, 0.5);
    box-shadow: ${shadows.md};
  }
  
  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-2px);
    }
    
    &:active {
      transform: scale(0.98);
      border-color: rgba(138, 43, 226, 0.8);
    }
  }
  
  &:active {
    transform: translateY(-2px);
    box-shadow: ${shadows.sm};
  }
  
  /* Subtle background variations for each card type while maintaining consistent styling */
  &:nth-child(1) {
    background: ${props => props.selected 
      ? 'linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3))'
      : 'linear-gradient(135deg, rgba(74, 108, 247, 0.05), rgba(30, 30, 70, 0.1))'};
  }
  
  &:nth-child(2) {
    background: ${props => props.selected 
      ? 'linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3))'
      : 'linear-gradient(135deg, rgba(74, 108, 247, 0.05), rgba(40, 40, 80, 0.1))'};
  }
  
  &:nth-child(3) {
    background: ${props => props.selected 
      ? 'linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3))'
      : 'linear-gradient(135deg, rgba(74, 108, 247, 0.05), rgba(50, 50, 90, 0.1))'};
  }
  
  &:nth-child(4) {
    background: ${props => props.selected 
      ? 'linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3))'
      : 'linear-gradient(135deg, rgba(74, 108, 247, 0.05), rgba(60, 60, 100, 0.1))'};
  }
`;

const CardIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${spacing.sm};
  color: rgba(138, 43, 226, 0.9);
  transition: all ${transitions.fast};
  
  ${Card}:hover & {
    transform: scale(1.1);
    color: rgba(138, 43, 226, 1);
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: ${spacing.md};
  }
  
  @media (max-width: 480px) {
    font-size: 3rem;
  }
`;

const CardLabel = styled.div`
  font-weight: ${typography.fontWeights.semiBold};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSizes.md};
  text-align: center;
  margin-bottom: ${spacing.xs};
  transition: all ${transitions.fast};
  
  ${Card}:hover & {
    color: white;
  }
  
  @media (max-width: 768px) {
    font-size: ${typography.fontSizes.lg};
    margin-bottom: ${spacing.sm};
  }
  
  @media (max-width: 480px) {
    font-size: ${typography.fontSizes.xl};
  }
`;

const CardDescription = styled.div`
  font-size: ${typography.fontSizes.xs};
  font-family: ${typography.fontFamily};
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  transition: all ${transitions.fast};
  
  ${Card}:hover & {
    color: rgba(255, 255, 255, 0.9);
  }
  
  @media (max-width: 768px) {
    font-size: ${typography.fontSizes.sm};
  }
  
  @media (max-width: 480px) {
    font-size: ${typography.fontSizes.md};
  }
`;

const ScrollIndicator = styled.div`
  display: none;
`;

export default SelectableCards;
