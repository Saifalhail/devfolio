import React, { useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp, FaCheck, FaEdit } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { colors, spacing, borderRadius, shadows, transitions } from '../../../styles/GlobalTheme';

/**
 * SummaryAccordion component for displaying collapsible sections in the final review step
 * 
 * @param {Object} props
 * @param {string} props.title - Title of the accordion section
 * @param {boolean} props.isCompleted - Whether the step is completed
 * @param {number} props.stepNumber - The step number
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {React.ReactNode} props.children - Content to display when expanded
 * @param {boolean} props.isRTL - Whether the layout is RTL
 */
const SummaryAccordion = ({ 
  title, 
  isCompleted = true, 
  stepNumber, 
  onEdit, 
  children,
  isRTL = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <AccordionContainer>
      <AccordionHeader onClick={toggleExpand} $isRTL={isRTL}>
        <HeaderContent $isRTL={isRTL}>
          <StepInfo $isRTL={isRTL}>
            {isCompleted && <CheckIcon $isRTL={isRTL}><FaCheck /></CheckIcon>}
            <StepTitle $isRTL={isRTL}>
              {t('projects.wizard.step', 'Step')} {stepNumber}: {title}
            </StepTitle>
          </StepInfo>
          <ActionButtons $isRTL={isRTL}>
            <EditButton 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(stepNumber);
              }}
              aria-label={t('projects.wizard.edit', 'Edit')}
              $isRTL={isRTL}
            >
              <FaEdit />
              <span>{t('projects.wizard.edit', 'Edit')}</span>
            </EditButton>
            <ExpandButton $isExpanded={isExpanded} $isRTL={isRTL}>
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </ExpandButton>
          </ActionButtons>
        </HeaderContent>
      </AccordionHeader>
      
      {isExpanded && (
        <AccordionContent $isRTL={isRTL} className={isRTL ? 'rtl-content' : ''}>
          {children}
        </AccordionContent>
      )}
    </AccordionContainer>
  );
};

const AccordionContainer = styled.div`
  border: 1px solid ${colors.background.secondary};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.md};
  overflow: hidden;
  box-shadow: ${shadows.sm};
  background-color: ${colors.background.card};
`;

const AccordionHeader = styled.div`
  padding: ${spacing.sm};
  cursor: pointer;
  background-color: ${colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${props => props.$isExpanded ? `1px solid ${colors.background.hover}` : 'none'};
  transition: background-color ${transitions.default};
  
  &:hover {
    background-color: ${colors.background.hover};
  }
  
  text-align: ${props => props.$isRTL ? 'right' : 'left'};
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-direction: ${props => props.$isRTL ? 'row-reverse' : 'row'};
  
  @media (max-width: 768px) {
    flex-direction: ${props => props.$isRTL ? 'column-reverse' : 'column'};
    align-items: ${props => props.$isRTL ? 'flex-end' : 'flex-start'};
    gap: ${spacing.sm};
  }
`;

const StepInfo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${props => props.$isRTL ? 'row-reverse' : 'row'};
  gap: ${spacing.sm};
`;

const CheckIcon = styled.div`
  color: ${colors.success};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.$isRTL ? '0' : spacing.xs};
  margin-left: ${props => props.$isRTL ? spacing.xs : '0'};
`;

const StepTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.$isRTL ? '1.05rem' : '1rem'};
  color: white;
  font-weight: 600;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.$isRTL ? 'right' : 'left'};
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  flex-direction: ${props => props.$isRTL ? 'row-reverse' : 'row'};
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: ${props => props.$isRTL ? 'flex-end' : 'flex-start'};
  }
`;

const EditButton = styled.button`
  background: ${colors.accent.primary};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  cursor: pointer;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  transition: all ${transitions.default};
  flex-direction: ${props => props.$isRTL ? 'row-reverse' : 'row'};
  font-size: ${props => props.$isRTL ? '0.9rem' : '0.85rem'};
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  
  &:hover {
    background-color: ${colors.accent.secondary};
    transform: translateY(-2px);
  }
  
  span {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const ExpandButton = styled.div`
  color: ${colors.accent.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${props => props.$isExpanded 
    ? (props.$isRTL ? 'rotate(-180deg)' : 'rotate(180deg)') 
    : 'rotate(0)'};  
  transition: transform ${transitions.default};
`;

const AccordionContent = styled.div`
  padding: ${spacing.md};
  background-color: ${colors.background.card};
  text-align: ${props => props.$isRTL ? 'right' : 'left'};
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  color: white;
  font-size: ${props => props.$isRTL ? '0.95rem' : '0.9rem'};
  
  /* Ensure dropdown menus in RTL mode are properly aligned */
  .dropdown-menu {
    text-align: ${props => props.$isRTL ? 'right' : 'left'};
    direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  }
  
  /* Fix alignment of summary items in RTL mode */
  div[role="button"],
  button,
  input,
  select,
  textarea {
    text-align: ${props => props.$isRTL ? 'right' : 'left'};
    direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
    font-size: ${props => props.$isRTL ? '0.95rem' : '0.9rem'};
  }
`;

export default SummaryAccordion;
