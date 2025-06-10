import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLink, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { colors, spacing, borderRadius, shadows, transitions, typography } from '../../../styles/GlobalTheme';

/**
 * LinkInputList - A component for managing a list of URL inputs
 * 
 * @param {Object} props
 * @param {Array} props.links - Array of link strings
 * @param {function} props.onChange - Function to call when links are added/removed
 * @param {boolean} props.isRTL - Whether the text direction is right-to-left
 */
const LinkInputList = ({ links = [], onChange, isRTL = false }) => {
  const [currentLink, setCurrentLink] = useState('');
  const [error, setError] = useState('');
  
  // URL validation regex
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  
  const handleAddLink = () => {
    if (!currentLink.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    // Add http:// prefix if missing
    let formattedLink = currentLink;
    if (!formattedLink.startsWith('http://') && !formattedLink.startsWith('https://')) {
      formattedLink = `https://${formattedLink}`;
    }
    
    if (!urlRegex.test(formattedLink)) {
      setError('Please enter a valid URL');
      return;
    }
    
    // Add the link and reset the input
    onChange([...links, formattedLink]);
    setCurrentLink('');
    setError('');
  };
  
  const handleRemoveLink = (indexToRemove) => {
    const updatedLinks = links.filter((_, index) => index !== indexToRemove);
    onChange(updatedLinks);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLink();
    }
  };
  
  return (
    <Container isRTL={isRTL}>
      {/* Input field with add button */}
      <InputGroup isRTL={isRTL}>
        <LinkIcon isRTL={isRTL}>
          <FaLink />
        </LinkIcon>
        <Input
          type="text"
          value={currentLink}
          onChange={(e) => {
            setCurrentLink(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="https://www.example.com"
          isRTL={isRTL}
        />
        <AddButton onClick={handleAddLink} isRTL={isRTL}>
          <FaPlus size={14} />
          <ButtonText isRTL={isRTL}>
            Add Link
          </ButtonText>
        </AddButton>
      </InputGroup>
      
      {/* Error message */}
      {error && <ErrorMessage isRTL={isRTL}>{error}</ErrorMessage>}
      
      {/* List of added links */}
      {links.length > 0 && (
        <LinksList isRTL={isRTL}>
          {links.map((link, index) => (
            <LinkItem key={index} isRTL={isRTL}>
              <LinkText isRTL={isRTL} href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </LinkText>
              <RemoveButton 
                onClick={() => handleRemoveLink(index)}
                aria-label="Remove link"
                isRTL={isRTL}
              >
                <FaTrashAlt size={14} />
              </RemoveButton>
            </LinkItem>
          ))}
        </LinksList>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  margin-bottom: 12px;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
`;

const LinkIcon = styled.div`
  position: absolute;
  ${props => props.isRTL ? 'right' : 'left'}: 16px;
  color: ${colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const Input = styled.input`
  flex: 1;
  padding: 16px;
  padding-${props => props.isRTL ? 'right' : 'left'}: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.isRTL ? 
    `0 8px 8px 0` : 
    `8px 0 0 8px`};
  background-color: ${colors.background.secondary};
  color: ${colors.text.primary};
  font-size: ${props => props.isRTL ? '1.05rem' : '1rem'};
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

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.accent.primary};
  color: white;
  border: none;
  border-radius: ${props => props.isRTL ? 
    `8px 0 0 8px` : 
    `0 8px 8px 0`};
  padding: 0 16px;
  height: 42px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  
  &:hover {
    background-color: #b02fdd;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(205, 62, 253, 0.3);
  }
`;

const ButtonText = styled.span`
  margin-${props => props.isRTL ? 'left' : 'right'}: 8px;
`;

const ErrorMessage = styled.div`
  color: #ff5252;
  font-size: 0.85rem;
  margin-top: -4px;
  margin-bottom: 8px;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const LinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const LinkItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  margin-bottom: 4px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  border-left: 3px solid ${colors.accent.primary};
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
`;

const LinkText = styled.a`
  color: ${colors.accent.primary};
  text-decoration: none;
  font-size: 0.9rem;
  word-break: break-all;
  margin-${props => props.isRTL ? 'left' : 'right'}: 16px;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  
  &:hover {
    text-decoration: underline;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${colors.text.secondary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ff5252;
  }
  
  &:focus {
    outline: none;
  }
`;

export default LinkInputList;
