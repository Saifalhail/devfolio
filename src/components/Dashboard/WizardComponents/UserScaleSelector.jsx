import React from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, shadows, transitions } from '../../../styles/GlobalTheme';
import { useTranslation } from 'react-i18next';

/**
 * UserScaleSelector - A component for selecting user scale with visual buttons
 * 
 * @param {Array} options - Array of option objects with { id, label, description, icon }
 * @param {string} selectedValue - Currently selected value
 * @param {function} onChange - Callback when selection changes
 * @param {boolean} required - Whether selection is required
 */
const UserScaleSelector = ({
  options = [],
  selectedValue,
  onChange,
  required = false,
  isRTL = false
}) => {
  const { t } = useTranslation();

  return (
    <>
      <ScaleContainer isRTL={isRTL}>
        {options.map((option, index) => (
          <ScaleOption
            key={option.id}
            selected={selectedValue === option.id}
            onClick={() => onChange(option.id)}
            isRTL={isRTL}
            position={index}
            total={options.length}
          >
            <OptionIcon selected={selectedValue === option.id} isRTL={isRTL}>
              {option.icon}
            </OptionIcon>
            <OptionContent>
              <OptionLabel selected={selectedValue === option.id}>
                {option.label}
              </OptionLabel>
              {option.description && (
                <OptionDescription>
                  {option.description}
                </OptionDescription>
              )}
            </OptionContent>
          </ScaleOption>
        ))}
      </ScaleContainer>
      
      {/* Visual scale indicator */}
      <ScaleIndicator isRTL={isRTL}>
        <ScaleBar>
          <ScaleProgress 
            width={
              selectedValue 
                ? options.findIndex(o => o.id === selectedValue) / (options.length - 1) * 100 
                : 0
            }
            isRTL={isRTL}
          />
        </ScaleBar>
        <ScaleLabels isRTL={isRTL}>
          <ScaleLabel>{t('projects.wizard.scale.small', 'Small')}</ScaleLabel>
          <ScaleLabel>{t('projects.wizard.scale.large', 'Large')}</ScaleLabel>
        </ScaleLabels>
      </ScaleIndicator>
    </>
  );
};

const ScaleContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: ${spacing.md};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${spacing.sm};
  }
`;

const ScaleOption = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.sm};
  border-radius: ${borderRadius.md};
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3))'
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.selected 
    ? 'rgba(138, 43, 226, 0.8)' 
    : 'rgba(255, 255, 255, 0.1)'};
  cursor: pointer;
  transition: all ${transitions.fast};
  box-shadow: ${props => props.selected ? shadows.md : 'none'};
  height: 80px;
  
  &:hover {
    background: ${props => props.selected 
      ? 'linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3))'
      : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
    box-shadow: ${shadows.sm};
  }
  
  @media (max-width: 768px) {
    padding: ${spacing.xs};
    height: 70px;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: ${spacing.sm};
  }
`;

const OptionIcon = styled.div`
  font-size: 1.5rem;
  margin-${props => props.isRTL ? 'left' : 'right'}: ${spacing.md};
  color: ${props => props.selected ? colors.primary : 'rgba(255, 255, 255, 0.7)'};
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-${props => props.isRTL ? 'left' : 'right'}: ${spacing.sm};
  }
`;

const OptionContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const OptionLabel = styled.div`
  font-weight: ${props => props.selected ? '600' : '500'};
  font-size: 1rem;
  color: ${props => props.selected ? 'white' : 'rgba(255, 255, 255, 0.9)'};
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const OptionDescription = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: ${spacing.xs};
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ScaleIndicator = styled.div`
  margin-top: ${spacing.md};
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ScaleBar = styled.div`
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.pill};
  position: relative;
  overflow: hidden;
`;

const ScaleProgress = styled.div`
  position: absolute;
  top: 0;
  ${props => props.isRTL ? 'right' : 'left'}: 0;
  height: 100%;
  width: ${props => props.width}%;
  background: linear-gradient(to right, ${colors.primary}, ${colors.accent});
  border-radius: ${borderRadius.pill};
  transition: width ${transitions.normal};
`;

const ScaleLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${spacing.xs};
  padding: 0 ${spacing.xs};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const ScaleLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
`;

export default UserScaleSelector;
