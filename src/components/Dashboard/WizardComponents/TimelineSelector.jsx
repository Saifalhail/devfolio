import React from 'react';
import styled from 'styled-components';
import { spacing, shadows, transitions } from '../../../styles/GlobalTheme';
import { useTranslation } from 'react-i18next';

/**
 * TimelineSelector - A visual selector for estimated project timeline
 * 
 * @param {Array} options - Array of timeline options with { id, label, description }
 * @param {string} selectedValue - Currently selected value
 * @param {function} onChange - Callback when selection changes
 * @param {boolean} required - Whether selection is required
 */
const TimelineSelector = ({
  options = [],
  selectedValue,
  onChange,
  required = false
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <SelectorContainer isRTL={isRTL}>
      {options.map((option, index) => (
        <TimelineOption
          key={option.id}
          isSelected={selectedValue === option.id}
          onClick={() => onChange(option.id)}
          isFirst={index === 0}
          isLast={index === options.length - 1}
        >
          <OptionContent>
            <OptionLabel>{option.label}</OptionLabel>
            {option.description && (
              <OptionDescription>{option.description}</OptionDescription>
            )}
          </OptionContent>
          <TimelineDot isSelected={selectedValue === option.id} />
          {index < options.length - 1 && <TimelineConnector />}
        </TimelineOption>
      ))}
    </SelectorContainer>
  );
};

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  margin: ${spacing.md} 0;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: ${props => props.isRTL ? 'flex-end' : 'flex-start'};
  }
`;

const TimelineOption = styled.div`
  flex: 1;
  position: relative;
  cursor: pointer;
  padding: ${spacing.sm} ${spacing.xs};
  transition: all ${transitions.fast};
  
  &:hover {
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: ${spacing.md};
    padding-${props => props.isRTL ? 'right' : 'left'}: ${spacing.xl};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const OptionContent = styled.div`
  text-align: center;
  margin-bottom: ${spacing.md};
  
  @media (max-width: 768px) {
    text-align: left;
    margin-bottom: 0;
    
    [dir="rtl"] & {
      text-align: right;
    }
  }
`;

const OptionLabel = styled.div`
  font-weight: 600;
  margin-bottom: ${spacing.xs};
`;

const OptionDescription = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const TimelineDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.isSelected 
    ? 'linear-gradient(135deg, #4a6cf7, #8a2be2)' 
    : 'rgba(255, 255, 255, 0.2)'};
  border: 2px solid ${props => props.isSelected 
    ? '#8a2be2' 
    : 'rgba(255, 255, 255, 0.3)'};
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: ${props => props.isSelected ? shadows.md : 'none'};
  transition: all ${transitions.fast};
  
  @media (max-width: 768px) {
    left: 0;
    bottom: auto;
    top: 50%;
    transform: translateY(-50%);
    
    [dir="rtl"] & {
      left: auto;
      right: 0;
    }
  }
`;

const TimelineConnector = styled.div`
  position: absolute;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  bottom: 7px;
  left: calc(50% + 8px);
  right: calc(50% - 8px);
  z-index: 1;
  
  @media (max-width: 768px) {
    display: none; /* Hide the connector on mobile */
  }
`;

export default TimelineSelector;
