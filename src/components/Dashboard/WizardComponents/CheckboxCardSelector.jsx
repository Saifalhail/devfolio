import React from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, shadows, transitions } from '../../../styles/GlobalTheme';
import { useTranslation } from 'react-i18next';

/**
 * CheckboxCardSelector - A grid of selectable cards with checkbox functionality
 * 
 * @param {Array} options - Array of option objects with { id, label, icon }
 * @param {Array} selectedValues - Array of currently selected values
 * @param {function} onChange - Callback when selection changes
 * @param {boolean} required - Whether selection is required
 */
const CheckboxCardSelector = ({
  options = [],
  selectedValues = [],
  onChange,
  required = false,
  isRTL = false
}) => {
  const { t } = useTranslation();
  
  const toggleOption = (optionId) => {
    let newSelectedValues;
    
    if (selectedValues.includes(optionId)) {
      // Remove if already selected
      newSelectedValues = selectedValues.filter(id => id !== optionId);
    } else {
      // Add if not selected
      newSelectedValues = [...selectedValues, optionId];
    }
    
    onChange(newSelectedValues);
  };

  return (
    <CardsContainer isRTL={isRTL}>
      <CardsGrid>
        {options.map(option => (
          <Card 
            key={option.id} 
            selected={selectedValues.includes(option.id)}
            onClick={() => toggleOption(option.id)}
            isRTL={isRTL}
          >
            <CardCheckbox selected={selectedValues.includes(option.id)} />
            <CardIcon>{option.icon}</CardIcon>
            <CardLabel>{option.label}</CardLabel>
            {option.description && (
              <CardDescription>{option.description}</CardDescription>
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
  position: relative;
  height: 140px;
  padding: ${spacing.sm};
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
  gap: ${spacing.xs};
  cursor: pointer;
  transition: all ${transitions.fast};
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    height: 120px;
    padding: ${spacing.xs};
  }
  
  @media (max-width: 480px) {
    height: 110px;
    padding: ${spacing.sm};
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
`;

const CardCheckbox = styled.div`
  position: absolute;
  top: ${spacing.sm};
  right: ${spacing.sm};
  width: 20px;
  height: 20px;
  border-radius: ${borderRadius.sm};
  border: 2px solid ${props => props.selected ? 'rgba(138, 43, 226, 0.8)' : 'rgba(255, 255, 255, 0.3)'};
  background: ${props => props.selected ? 'rgba(138, 43, 226, 0.8)' : 'transparent'};
  transition: all ${transitions.fast};
  
  &:after {
    content: '';
    position: absolute;
    display: ${props => props.selected ? 'block' : 'none'};
    top: 2px;
    left: 6px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const CardIcon = styled.div`
  font-size: 1.5rem;
  color: ${colors.accent.primary};
  margin-bottom: ${spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CardLabel = styled.div`
  font-weight: 600;
  font-size: 0.85rem;
  text-align: center;
  color: ${colors.text.primary};
  margin-top: ${spacing.xs};
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const CardDescription = styled.div`
  font-size: 0.8rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-top: ${spacing.xs};
`;

export default CheckboxCardSelector;
