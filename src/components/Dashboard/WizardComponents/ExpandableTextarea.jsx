import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, shadows, transitions, typography } from '../../../styles/GlobalTheme';

/**
 * ExpandableTextarea - An auto-resizing textarea component with character counter
 * 
 * @param {Object} props
 * @param {string} props.value - The current value of the textarea
 * @param {function} props.onChange - Function to call when the value changes
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.maxLength - Maximum character length
 * @param {boolean} props.isRTL - Whether the text direction is right-to-left
 * @param {Object} props.customStyles - Custom styles to apply to the textarea
 * @param {boolean} props.hideCharCount - Whether to hide the character counter
 */
const ExpandableTextarea = ({ 
  value = '', 
  onChange, 
  placeholder = '', 
  maxLength = 500,
  isRTL = false,
  customStyles = {},
  hideCharCount = false
}) => {
  const [charCount, setCharCount] = useState(0);
  
  useEffect(() => {
    setCharCount(value.length);
  }, [value]);
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length <= maxLength) {
      onChange(newValue);
      setCharCount(newValue.length);
    }
  };
  
  return (
    <TextareaContainer isRTL={isRTL} style={customStyles}>
      <StyledTextarea 
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        isRTL={isRTL}
        rows={3}
      />
      {!hideCharCount && (
        <CharacterCounter isRTL={isRTL}>
          {charCount}/{maxLength}
        </CharacterCounter>
      )}
    </TextareaContainer>
  );
};

// Styled Components
const TextareaContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${spacing.sm};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  background-color: ${colors.background.secondary};
  color: ${colors.text.primary};
  font-size: ${props => props.isRTL ? '1.05rem' : '1rem'};
  line-height: 1.5;
  resize: vertical;
  transition: all 0.3s ease;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px rgba(205, 62, 253, 0.2);
  }
  
  &::placeholder {
    color: ${colors.text.muted};
    opacity: 0.7;
  }
`;

const CharacterCounter = styled.div`
  position: absolute;
  bottom: 8px;
  ${props => props.isRTL ? 'left' : 'right'}: 16px;
  font-size: 0.8rem;
  color: ${colors.text.secondary};
  user-select: none;
`;

export default ExpandableTextarea;
