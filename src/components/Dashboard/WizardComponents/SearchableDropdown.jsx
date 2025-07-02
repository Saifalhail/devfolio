import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { colors, spacing, borderRadius, shadows, transitions, typography } from '../../../styles/GlobalTheme';
import { useTranslation } from 'react-i18next';
import TextInput from './TextInput';

/**
 * SearchableDropdown - A dropdown with search functionality
 * 
 * @param {Array} options - Array of option objects with { id, label }
 * @param {string} selectedValue - Currently selected value
 * @param {function} onChange - Callback when selection changes
 * @param {string} placeholder - Placeholder text for the search input
 * @param {boolean} allowCustom - Whether to allow custom input for "Other" option
 * @param {boolean} required - Whether selection is required
 */
const SearchableDropdown = ({
  options = [],
  selectedValue,
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

  const selectedOption = options.find(option => option.id === selectedValue);
  const isOtherSelected = selectedValue === 'other';

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      setFilteredOptions(options);
    }
  };

  const handleSelect = (option) => {
    if (option.id === 'other' && allowCustom) {
      onChange('other');
      setCustomValue('');
    } else {
      onChange(option.id);
    }
    setIsOpen(false);
  };

  const handleCustomValueChange = (e) => {
    const value = e.target.value;
    setCustomValue(value);
    onChange('other', value);
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownHeader
        isOpen={isOpen}
        onClick={toggleDropdown}
      >
        <SelectedValue>
          {selectedOption
            ? selectedOption.label
            : isOtherSelected
              ? t('common.other', 'Other')
              : placeholder}
        </SelectedValue>
        <DropdownIcon>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </DropdownIcon>
      </DropdownHeader>

      {isOpen && (
        <DropdownList isOpen={isOpen}>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder={t('common.search', 'Search...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              isRTL={isRTL}
            />
          </SearchContainer>

          <OptionsList>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <DropdownItem
                  key={option.id}
                  isSelected={option.id === selectedValue}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </DropdownItem>
              ))
            ) : (
              <NoResults>{t('common.noResults', 'No results found')}</NoResults>
            )}

            {allowCustom && (
              <DropdownItem
                isSelected={isOtherSelected}
                onClick={() => handleSelect({ id: 'other', label: t('common.other', 'Other') })}
              >
                {t('common.other', 'Other')}
              </DropdownItem>
            )}
          </OptionsList>
        </DropdownList>
      )}

      {isOtherSelected && allowCustom && (
        <CustomInputContainer>
          <TextInput
            value={customValue}
            onChange={handleCustomValueChange}
            placeholder={t('common.pleaseSpecify', 'Please specify...')}
            maxLength={50}
            required={required}
          />
        </CustomInputContainer>
      )}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  font-family: ${typography.fontFamily};
  margin-bottom: ${spacing.md};
`;

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.md};
  background: rgba(50, 50, 80, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all ${transitions.fast};
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: ${spacing.md} ${spacing.sm};
    min-height: 50px;
  }
  
  @media (max-width: 480px) {
    padding: ${spacing.sm};
    min-height: 60px;
  }
  
  /* Add a subtle top border gradient that appears on hover */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.isOpen ? '100%' : '0'};
    height: 2px;
    background: linear-gradient(90deg, #4a6cf7, #6a1fd0);
    transition: width ${transitions.medium};
  }
  
  /* Add a shine effect */
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: ${transitions.medium};
  }
  
  &:hover {
    background: rgba(60, 60, 100, 0.9);
    border-color: rgba(255, 255, 255, 0.3);
    
    &:before {
      width: 100%;
    }
    
    &:after {
      left: 100%;
      transition: 0.8s;
    }
  }
  
  ${props => props.isOpen && `
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  `}
`;

const SelectedValue = styled.div`
  color: ${colors.text.primary};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSizes.md};
  
  @media (max-width: 768px) {
    font-size: ${typography.fontSizes.lg};
  }
  
  @media (max-width: 480px) {
    font-size: ${typography.fontSizes.xl};
  }
`;

const DropdownIcon = styled.div`
  color: rgba(255, 255, 255, 0.5);
`;

const DropdownList = styled.ul`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  background: rgba(40, 40, 70, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.lg};
  z-index: 100000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all ${transitions.fast};
  
  @media (max-width: 768px) {
    max-height: 350px;
    border-radius: ${borderRadius.lg};
  }
  
  @media (max-width: 480px) {
    max-height: 400px;
    border-width: 2px;
  }
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  padding: ${spacing.sm};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SearchIcon = styled.div`
  position: absolute;
  left: calc(${spacing.md} + 2px);
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.3);
  z-index: 1;
  
  /* RTL Support */
  [dir="rtl"] & {
    left: auto;
    right: calc(${spacing.md} + 2px);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${spacing.md} ${spacing.md} ${spacing.md} calc(${spacing.xl} + ${spacing.md});
  background: rgba(255, 255, 255, 0.03);
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: ${colors.text.primary};
  outline: none;
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSizes.md};
  transition: all ${transitions.fast};
  
  &:focus {
    border-bottom-color: rgba(74, 108, 247, 0.5);
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  /* RTL Support */
  ${props => props.isRTL ? `
    padding: ${spacing.md} calc(${spacing.xl} + ${spacing.md}) ${spacing.md} ${spacing.md};
    text-align: right;
  ` : ''}
`;

const OptionsList = styled.div`
  padding: ${spacing.xs} 0;
`;

const DropdownItem = styled.li`
  padding: ${spacing.md};
  cursor: pointer;
  transition: all ${transitions.fast};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSizes.md};
  position: relative;
  overflow: hidden;
  
  /* Add shine effect on hover */
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    transition: ${transitions.medium};
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    
    &:after {
      left: 100%;
      transition: 0.6s;
    }
  }
  
  ${props => props.isSelected && `
    background: rgba(74, 108, 247, 0.2);
    color: ${colors.accent.primary};
    
    &:hover {
      background: rgba(74, 108, 247, 0.3);
    }
  `}
`;

const NoResults = styled.div`
  padding: ${spacing.md};
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
`;

const CustomInputContainer = styled.div`
  margin-top: ${spacing.sm};
  padding: ${spacing.md};
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 ${borderRadius.md} ${borderRadius.md};
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default SearchableDropdown;
