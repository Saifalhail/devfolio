import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaSearch, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { colors, spacing, borderRadius, shadows, transitions, typography } from '../../../styles/GlobalTheme';
import { useTranslation } from 'react-i18next';
import TextInput from './TextInput';

/**
 * MultiSelectDropdown - A dropdown with search functionality that allows multiple selections
 * 
 * @param {Array} options - Array of option objects with { id, label }
 * @param {Array} selectedValues - Array of currently selected values
 * @param {function} onChange - Callback when selection changes
 * @param {string} placeholder - Placeholder text for the search input
 * @param {boolean} allowCustom - Whether to allow custom input for "Other" option
 * @param {boolean} required - Whether selection is required
 */
const MultiSelectDropdown = ({
  options = [],
  selectedValues = [],
  onChange,
  placeholder = 'Search...',
  allowCustom = true,
  required = false
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  const selectedOptions = options.filter(option => selectedValues.includes(option.id));
  const isSpecificSelected = selectedValues.includes('specific');

  // Filter options based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredOptions(options);
      return;
    }

    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      setFilteredOptions(options);
    }
  };

  const handleOptionClick = (optionId) => {
    let newSelectedValues;
    
    if (selectedValues.includes(optionId)) {
      // Remove if already selected
      newSelectedValues = selectedValues.filter(id => id !== optionId);
    } else {
      // Add if not selected
      newSelectedValues = [...selectedValues, optionId];
    }
    
    onChange(newSelectedValues);
    setSearchTerm('');
  };

  const handleCustomValueChange = (value) => {
    setCustomValue(value);
    if (onChange && isSpecificSelected) {
      onChange(selectedValues, value);
    }
  };

  const removeSelectedOption = (optionId, event) => {
    event.stopPropagation();
    const newSelectedValues = selectedValues.filter(id => id !== optionId);
    onChange(newSelectedValues);
  };

  return (
    <DropdownContainer ref={dropdownRef} isRTL={isRTL}>
      <DropdownHeader onClick={toggleDropdown} isRTL={isRTL}>
        {selectedOptions.length > 0 ? (
          <SelectedTagsContainer isRTL={isRTL}>
            {selectedOptions.map(option => (
              <SelectedTag key={option.value} isRTL={isRTL}>
                {option.label}
                <RemoveTagButton 
                  onClick={(e) => removeSelectedOption(option.id, e)}
                  isRTL={isRTL}
                >
                  <FaTimes />
                </RemoveTagButton>
              </SelectedTag>
            ))}
          </SelectedTagsContainer>
        ) : (
          <Placeholder isRTL={isRTL}>{placeholder}</Placeholder>
        )}
        <DropdownIcon isRTL={isRTL}>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </DropdownIcon>
      </DropdownHeader>
      
      {isOpen && (
        <DropdownContent isRTL={isRTL}>
          <SearchContainer isRTL={isRTL}>
            <SearchIcon isRTL={isRTL}>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('common.search', 'Search...')}
              isRTL={isRTL}
            />
          </SearchContainer>
          
          <OptionsList isRTL={isRTL}>
            {filteredOptions.map(option => (
              <OptionItem
                key={option.value}
                onClick={() => handleOptionClick(option)}
                isSelected={selectedValues.includes(option.id)}
                isRTL={isRTL}
              >
                {option.label}
              </OptionItem>
            ))}
            
            {filteredOptions.length === 0 && (
              <NoResults isRTL={isRTL}>
                {t('common.noResults', 'No results found')}
              </NoResults>
            )}
          </OptionsList>
          
          {isSpecificSelected && allowCustom && (
            <CustomInputContainer isRTL={isRTL}>
              <TextInput
                value={customValue}
                onChange={handleCustomValueChange}
                placeholder={t('common.specifyOther', 'Please specify...')}
                isRTL={isRTL}
              />
            </CustomInputContainer>
          )}
        </DropdownContent>
      )}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.xs} ${spacing.sm};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all ${transitions.fast};
  min-height: 42px;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: ${spacing.xs} ${spacing.xs};
    min-height: 38px;
  }
`;

const Placeholder = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: ${typography.fontSizes.sm};
`;

const SelectedTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
  
  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const SelectedTag = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: rgba(74, 108, 247, 0.2);
  border-radius: ${borderRadius.sm};
  padding: ${spacing.xxs} ${spacing.xs};
  margin-${props => props.isRTL ? 'left' : 'right'}: ${spacing.xs};
  margin-bottom: ${spacing.xs};
  font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.xs} * 1.05)` : typography.fontSizes.xs};
  color: white;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  margin-${props => props.isRTL ? 'right' : 'left'}: ${spacing.xxs};
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  
  &:hover {
    color: white;
  }
`;

const DropdownIcon = styled.div`
  color: rgba(255, 255, 255, 0.5);
  margin-${props => props.isRTL ? 'left' : 'right'}: ${spacing.xs};
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: ${props => props.isRTL ? 'auto' : '0'};
  right: ${props => props.isRTL ? '0' : 'auto'};
  margin-top: ${spacing.xs};
  background: rgba(30, 30, 40, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.lg};
  z-index: 10;
  max-height: 250px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  width: 100%;
  min-width: 200px;
  
  @media (max-width: 768px) {
    max-height: 200px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  align-items: center;
  padding: ${spacing.xs};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background: rgba(30, 30, 40, 0.95);
  z-index: 1;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const SearchIcon = styled.div`
  color: rgba(255, 255, 255, 0.5);
  margin-${props => props.isRTL ? 'left' : 'right'}: ${spacing.xs};
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  padding: ${spacing.xs};
  width: 100%;
  font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.sm} * 1.05)` : typography.fontSizes.sm};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    text-align: ${props => props.isRTL ? 'right' : 'left'};
  }
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${spacing.xs} 0;
  overflow-y: auto;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.isRTL ? 'flex-end' : 'flex-start'};
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  padding: ${spacing.xs} ${spacing.sm};
  cursor: pointer;
  transition: background-color ${transitions.default};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  font-size: ${props => props.isRTL ? `calc(${typography.fontSizes.sm} * 1.05)` : typography.fontSizes.sm};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  @media (max-width: 768px) {
    padding: ${spacing.xs} ${spacing.xs};
  }
`;

const NoResults = styled.div`
  padding: ${spacing.md};
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
`;

const CustomInputContainer = styled.div`
  padding: ${spacing.sm};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export default MultiSelectDropdown;
