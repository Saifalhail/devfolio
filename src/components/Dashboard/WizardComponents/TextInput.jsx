import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';
// Import removed to fix undefined error

/**
 * TextInput - A styled text input component with validation
 * 
 * @param {string} value - The input value
 * @param {function} onChange - Callback when value changes
 * @param {string} placeholder - Placeholder text
 * @param {number} maxLength - Maximum character length
 * @param {number} minLength - Minimum character length
 * @param {boolean} required - Whether the field is required
 * @param {object} style - Additional inline styles
 */
const TextInput = ({ 
  value, 
  onChange, 
  placeholder, 
  maxLength = 100, 
  minLength = 0, 
  required = false,
  style = {},
  hideCharCount = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [showValidation, setShowValidation] = useState(false);

  // Validate input
  useEffect(() => {
    if (!required && !value) {
      setIsValid(true);
      return;
    }

    const valid = value && 
      value.length >= minLength && 
      (!maxLength || value.length <= maxLength);
    
    setIsValid(valid);
  }, [value, required, minLength, maxLength]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setShowValidation(true);
  };

  return (
    <InputContainer>
      <StyledInput
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setShowValidation(true);
        }}
        placeholder={placeholder}
        maxLength={maxLength}
        $isFocused={isFocused}
        $isValid={isValid}
        $showValidation={showValidation}
        style={style}
        {...props}
      />
      
      {showValidation && (
        <ValidationIcon $isValid={isValid}>
          {isValid ? <FaCheck /> : <FaExclamationTriangle />}
        </ValidationIcon>
      )}
      
      {!hideCharCount && maxLength > 0 && (
        <CharacterCount $isNearLimit={value.length > maxLength * 0.8}>
          {value.length}/{maxLength}
        </CharacterCount>
      )}
    </InputContainer>
  );
};

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border: 2px solid ${props => {
    if (!props.$showValidation) return 'rgba(255, 255, 255, 0.1)';
    return props.$isValid ? 'rgba(39, 174, 96, 0.5)' : 'rgba(231, 76, 60, 0.5)';
  }};
  border-radius: 8px;
  transition: all 0.2s ease;
  outline: none;
  box-shadow: ${props => props.$isFocused ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'};
  
  &:focus {
    border-color: rgba(74, 108, 247, 0.5);
    background: rgba(255, 255, 255, 0.07);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
`;

const ValidationIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.$isValid ? '#27ae60' : '#e74c3c'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* RTL Support */
  [dir="rtl"] & {
    right: auto;
    left: 1rem;
  }
`;

const CharacterCount = styled.div`
  position: absolute;
  right: 1rem;
  bottom: -1rem;
  font-size: 0.75rem;
  color: ${props => props.$isNearLimit ? '#e74c3c' : 'rgba(255, 255, 255, 0.5)'};
  
  /* RTL Support */
  [dir="rtl"] & {
    right: auto;
    left: 1rem;
  }
`;

export default TextInput;
