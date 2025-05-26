import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  FaCommentAlt, FaClipboardList, FaEdit, FaEye,
  FaTrash, FaPlus, FaFilter, FaSearch, FaSort,
  FaComments, FaCamera, FaRobot, FaDownload
} from 'react-icons/fa';
import FeedbackForm from './FeedbackForm';
import Button from '../Common/Button';
import IconButton from '../Common/IconButton';
import {
  fadeIn,
  slideUp,
  slideInRight,
  slideInLeft,
  pulse,
  shine,
} from '../../styles/animations';
import { colors, spacing, shadows, borderRadius, typography, mixins, transitions, breakpoints } from '../../styles/GlobalTheme';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  SectionTitle,
  ActionButton,
  SearchInput,
  CardGrid,
  Card,
  EmptyState,
  StatusBadge,
  FeatureCard,
  FeatureIcon,
  FilterButton
} from '../../styles/GlobalComponents';

const FormsPanel = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeFormType, setActiveFormType] = useState('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Sample form data
  const [forms, setForms] = useState([
    {
      id: 1,
      title: 'Client Feedback Form',
      type: 'feedback',
      description: 'Collect feedback from clients about the project',
      date: '2025-05-01',
      status: 'active',
      responses: 12
    },
    {
      id: 2,
      title: 'Project Revision Request',
      type: 'revision',
      description: 'Allow clients to request specific revisions',
      date: '2025-04-28',
      status: 'active',
      responses: 5
    },
    {
      id: 3,
      title: 'Website Feedback',
      type: 'feedback',
      description: 'Get feedback on the new website design',
      date: '2025-04-15',
      status: 'inactive',
      responses: 8
    },
    {
      id: 4,
      title: 'Mobile App Feedback',
      type: 'feedback',
      description: 'Collect feedback on the mobile app experience',
      date: '2025-05-10',
      status: 'draft',
      responses: 0
    }
  ]);
  
  const handleFormTypeChange = (type) => {
    setActiveFormType(type);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  const toggleNewForm = () => {
    setShowNewForm(!showNewForm);
  };
  
  const renderStatusBadge = (status) => {
    let color;
    switch(status) {
      case 'active':
        color = '#4CAF50';
        break;
      case 'inactive':
        color = '#FFC107';
        break;
      case 'draft':
        color = '#9E9E9E';
        break;
      default:
        color = '#9E9E9E';
    }
    
    return (
      <StatusBadge color={color}>
        {t(`forms.status.${status}`, status)}
      </StatusBadge>
    );
  };
  
  // Filter forms based on active type and search query
  const filteredForms = forms.filter(form => {
    const matchesType = activeFormType === 'all' || form.type === activeFormType;
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          form.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });
  
  // Sort forms based on sort criteria
  const sortedForms = [...filteredForms].sort((a, b) => {
    let comparison = 0;
    
    switch(sortBy) {
      case 'date':
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case 'name':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>{t('forms.title', 'Forms')}</PanelTitle>
        <ActionButton onClick={toggleNewForm}>
          <FaPlus />
          {t('forms.create', 'Create Form')}
        </ActionButton>
      </PanelHeader>
      
      <FormsToolbar>
        <FormTypeFilters>
          <FilterButton 
            active={activeFormType === 'all'} 
            onClick={() => handleFormTypeChange('all')}
          >
            <FaClipboardList />
            {t('forms.types.all', 'All Forms')}
          </FilterButton>
          <FilterButton 
            active={activeFormType === 'feedback'} 
            onClick={() => handleFormTypeChange('feedback')}
          >
            <FaCommentAlt />
            {t('forms.types.feedback', 'Feedback')}
          </FilterButton>
          <FilterButton 
            active={activeFormType === 'revision'} 
            onClick={() => handleFormTypeChange('revision')}
          >
            <FaEdit />
            {t('forms.types.revision', 'Revision')}
          </FilterButton>
        </FormTypeFilters>
        
        <SearchAndSortContainer>
          <SearchInputWrapper isRTL={isRTL}>
            <FaSearch />
            <input
              type="text"
              placeholder={t('forms.search', 'Search forms...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInputWrapper>
          
          <FilterButton 
            onClick={toggleSortDirection}
          >
            <FaSort />
            {sortDirection === 'asc' 
              ? t('forms.sortAsc', 'Ascending') 
              : t('forms.sortDesc', 'Descending')
            }
          </FilterButton>
        </SearchAndSortContainer>
      </FormsToolbar>
      
      {showNewForm && (
        <NewFormContainer>
          <FeedbackForm onClose={toggleNewForm} />
        </NewFormContainer>
      )}
      
      <FormsListContainer>
        {sortedForms.length > 0 ? (
          <CardGrid>
            {sortedForms.map((form, index) => (
              <Card key={form.id} withAccent={true}>
                <FormCardHeader>
                  <FormTitle>{form.title}</FormTitle>
                  <StatusBadge status={form.status}>
                    {t(`forms.status.${form.status}`, form.status)}
                  </StatusBadge>
                </FormCardHeader>
                <FormDescription>{form.description}</FormDescription>
                <FormMeta>
                  <FormDate>{form.date}</FormDate>
                  <FormResponses>
                    {t('forms.responses', 'Responses')}: {form.responses}
                  </FormResponses>
                </FormMeta>
                <FormActions>
                  <IconButton 
                    title={t('forms.actions.view', 'View Form')} 
                    icon={<FaEye />} 
                    color={colors.accent.secondary}
                  />
                  <IconButton 
                    title={t('forms.actions.edit', 'Edit Form')} 
                    icon={<FaEdit />} 
                    color={colors.accent.primary}
                  />
                  <IconButton 
                    title={t('forms.actions.delete', 'Delete Form')} 
                    icon={<FaTrash />} 
                    color={colors.status.error}
                  />
                </FormActions>
              </Card>
            ))}
          </CardGrid>
        ) : (
          <EmptyState>
            <div className="empty-icon">
              <FaClipboardList size={48} />
            </div>
            <SectionTitle>{t('forms.empty.title', 'No forms found')}</SectionTitle>
            <p>
              {t('forms.empty.description', 'Create a new form or change your filters to see results')}
            </p>
            <ActionButton onClick={toggleNewForm} small>
              <FaPlus />
              {t('forms.create', 'Create Form')}
            </ActionButton>
          </EmptyState>
        )}
      </FormsListContainer>
      
      <FormFeaturesSection>
        <SectionTitle>{t('forms.features.title', 'Form System Features')}</SectionTitle>
        <CardGrid>
          <FeatureCard index={0}>
            <FeatureIcon>
              <FaComments />
            </FeatureIcon>
            <div>
              <h4>{t('forms.features.feedback', 'Feedback Collection')}</h4>
              <p>
                {t('forms.features.feedbackDesc', 'Create custom feedback forms to collect insights from clients')}
              </p>
            </div>
          </FeatureCard>
          <FeatureCard index={1}>
            <FeatureIcon>
              <FaCamera />
            </FeatureIcon>
            <div>
              <h4>{t('forms.features.visual', 'Visual Annotations')}</h4>
              <p>
                {t('forms.features.visualDesc', 'Allow clients to add visual annotations to their feedback')}
              </p>
            </div>
          </FeatureCard>
          <FeatureCard index={2}>
            <FeatureIcon>
              <FaRobot />
            </FeatureIcon>
            <div>
              <h4>{t('forms.features.ai', 'AI Analysis')}</h4>
              <p>
                {t('forms.features.aiDesc', 'Automatically analyze feedback with AI to identify key insights')}
              </p>
            </div>
          </FeatureCard>
          <FeatureCard index={3}>
            <FeatureIcon>
              <FaDownload />
            </FeatureIcon>
            <div>
              <h4>{t('forms.features.export', 'Export Options')}</h4>
              <p>
                {t('forms.features.exportDesc', 'Export feedback data in multiple formats for further analysis')}
              </p>
            </div>
          </FeatureCard>
        </CardGrid>
      </FormFeaturesSection>
    </PanelContainer>
  );
};

// Styled components for the FormsPanel - using GlobalTheme system
const FormsToolbar = styled.div`
  ${mixins.flexColumn}
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  
  @media (max-width: ${breakpoints.md}) {
    gap: ${spacing.sm};
  }
`;

const FormTypeFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.md};
  
  /* RTL Support */
  [dir="rtl"] & {
    justify-content: flex-end;
  }
`;

const SearchAndSortContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${spacing.md};
  
  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    
    /* RTL Support */
    [dir="rtl"] & {
      align-items: flex-end;
    }
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 350px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  
  &:focus-within {
    box-shadow: 0 3px 15px rgba(130, 161, 191, 0.15);
    border-color: rgba(130, 161, 191, 0.3);
    transform: translateY(-2px);
  }
  
  svg {
    color: #aaa;
    margin-right: ${props => props.isRTL ? '0' : '0.75rem'};
    margin-left: ${props => props.isRTL ? '0.75rem' : '0'};
    transition: color 0.3s ease;
  }
  
  &:focus-within svg {
    color: #82a1bf;
  }
  
  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.9rem;
    color: #555;
    direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
    
    &::placeholder {
      color: #aaa;
      transition: color 0.3s ease;
    }
    
    &:focus::placeholder {
      color: #ccc;
    }
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const FormsListContainer = styled.div`
  ${mixins.flexColumn}
  flex: 1;
  margin-bottom: ${spacing.lg};
`;

const FormsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
  
  /* Remove the grid-level animations since they conflict with the card animations */
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const FormCard = styled(Card)`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeIn} 0.5s ease-in-out forwards, ${slideUp} 0.5s ease-in-out forwards;
  animation-delay: ${props => props.index * 0.1}s;
  opacity: 1;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    background-color: #fafafa;
  }
  
  &:active {
    transform: translateY(-2px) scale(1.01);
    transition: all 0.1s ease;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 0.5s ease, transform 0.5s ease;
    pointer-events: none;
    z-index: 2;
  }
  
  &:hover:after {
    opacity: 0.3;
    transform: scale(1);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #faaa93, #82a1bf);
    opacity: 0.8;
  }
`;

const FormCardHeader = styled.div`
  ${mixins.flexBetween}
  align-items: flex-start;
  margin-bottom: ${spacing.sm};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

const FormTitle = styled.h3`
  margin: 0;
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${colors.text.primary};
  position: relative;
  display: inline-block;
  transition: ${transitions.medium};
  
  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${colors.gradients.accent};
    transition: width 0.3s ease;
    
    /* RTL Support */
    [dir="rtl"] & {
      left: auto;
      right: 0;
    }
  }
  
  ${Card}:hover & {
    transform: translateX(5px);
    color: ${colors.accent.primary};
  }
`;

const FormDescription = styled.p`
  margin: 0 0 ${spacing.md} 0;
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeights.normal};
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: ${transitions.medium};
  
  ${FormCard}:hover & {
    color: ${colors.text.primary};
    transform: translateY(-2px);
  }
`;

const FormMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: ${spacing.md};
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  transition: ${transitions.medium};
  
  ${FormCard}:hover & {
    color: ${colors.text.primary};
    transform: translateY(-3px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const FormDate = styled.span`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  
  svg {
    color: ${colors.accent.primary};
    font-size: ${typography.fontSizes.xs};
  }
`;

const FormResponses = styled.span`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-weight: ${typography.fontWeights.medium};
  
  svg {
    color: ${colors.accent.primary};
    font-size: ${typography.fontSizes.xs};
  }
`;

// This component is no longer needed as we're using the global StatusBadge component
// const FormStatusBadge = styled.span`
//   display: inline-block;
//   padding: 0.25rem 0.5rem;
//   border-radius: 4px;
//   font-size: 0.75rem;
//   font-weight: 500;
//   color: white;
//   background-color: ${props => props.color};
//   transition: transform 0.3s ease, box-shadow 0.3s ease;
//   position: relative;
//   overflow: hidden;
//   
//   &:before {
//     content: '';
//     position: absolute;
//     top: -50%;
//     left: -50%;
//     width: 200%;
//     height: 200%;
//     background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);
//     opacity: 0;
//     transform: scale(0.5);
//     transition: opacity 0.5s ease, transform 0.5s ease;
//     pointer-events: none;
//   }
//   
//   ${FormCard}:hover & {
//     transform: scale(1.05);
//     box-shadow: 0 2px 5px rgba(0,0,0,0.1);
//     
//     &:before {
//       opacity: 1;
//       transform: scale(1);
//     }
//   }
// `

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
  opacity: 0.7;
  transition: opacity 0.3s ease, transform 0.3s ease;
  
  ${FormCard}:hover & {
    opacity: 1;
    transform: translateY(-2px);
    border-top: 1px solid #e0e0e0;
  }
  
  & > * {
    transform: scale(0.95);
    transition: transform 0.3s ease;
  }
  
  ${FormCard}:hover & > * {
    transform: scale(1);
  }
  
  & > *:nth-child(1) { transition-delay: 0.05s; }
  & > *:nth-child(2) { transition-delay: 0.1s; }
  & > *:nth-child(3) { transition-delay: 0.15s; }
`;

const NewFormContainer = styled(Card)`
  margin-bottom: ${spacing.lg};
  animation: ${fadeIn} 0.3s ease-in-out, ${slideUp} 0.3s ease-in-out;
  background: ${colors.background.card};
  border-left: 4px solid ${colors.accent.primary};
  transition: ${transitions.medium};
  
  &:hover {
    box-shadow: ${shadows.md};
    background: ${colors.background.hover};
  }
`;

const FormEmptyState = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1rem;
  animation: ${fadeIn} 0.5s ease-in-out, ${slideUp} 0.5s ease-in-out;
  transition: ${transitions.medium};
  position: relative;
  overflow: hidden;
  background: ${colors.background.card};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.lg};
    background: ${colors.background.hover};
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(130, 161, 191, 0.1) 0%, rgba(130, 161, 191, 0) 70%);
    z-index: 0;
    transition: all 0.5s ease;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -100px;
    left: -100px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(250, 170, 147, 0.1) 0%, rgba(250, 170, 147, 0) 70%);
    z-index: 0;
    transition: all 0.5s ease;
  }
  
  &:hover:before {
    transform: scale(1.5);
  }
  
  &:hover:after {
    transform: scale(1.5);
  }
`;

const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: ${borderRadius.full};
  background: ${colors.background.secondary};
  margin-bottom: ${spacing.lg};
  color: ${colors.accent.primary};
  font-size: ${typography.fontSizes.xxxl};
  transition: ${transitions.medium};
  position: relative;
  z-index: 1;
  box-shadow: ${shadows.sm};
  
  &:before {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    background: ${colors.gradients.subtle};
    border-radius: inherit;
    z-index: -1;
    transform: scale(0.8);
    opacity: 0;
    transition: ${transitions.medium};
  }
  
  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${colors.gradients.button};
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${EmptyState}:hover & {
    transform: translateY(-5px) scale(1.05);
    color: ${colors.text.primary};
    
    &:after {
      opacity: 1;
    }
  }
  
  ${EmptyState}:hover &:before {
    transform: scale(1.1);
    opacity: 0.7;
  }
`;

const EmptyTitle = styled.h3`
  margin: 0 0 ${spacing.md} 0;
  font-size: ${typography.fontSizes.xl};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${colors.text.primary};
  transition: ${transitions.medium};
  position: relative;
  z-index: 1;
  display: inline-block;
  
  ${EmptyState}:hover & {
    transform: translateY(-3px);
    background: ${colors.gradients.text};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 0;
    height: 2px;
    background: ${colors.gradients.accent};
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }
  
  ${EmptyState}:hover &:after {
    width: 50px;
  }
`;

const EmptyDescription = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  max-width: 400px;
  transition: ${transitions.medium};
  position: relative;
  z-index: 1;

  ${EmptyState}:hover & {
    color: ${colors.text.primary};
    transform: translateY(-2px);
  }
`;

const FormFeaturesSection = styled.section`
  margin-top: 3rem;
`;

const FormSectionTitle = styled.h3`
  margin: 0 0 ${spacing.lg} 0;
  font-size: ${typography.fontSizes.xl};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${colors.text.primary};
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${colors.gradients.accent};
    border-radius: ${borderRadius.full};
  }

  /* RTL Support */
  [dir="rtl"] & {
    &:after {
      left: auto;
      right: 0;
    }
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// Removed duplicate FormFeatureIcon declaration

const FormFeatureCard = styled(Card).attrs({
  className: 'feature-card'
})`
  display: flex;
  align-items: flex-start;
  padding: ${spacing.lg};
  transition: ${transitions.medium};
  animation: ${fadeIn} 0.5s ease-in-out, ${slideUp} 0.5s ease-in-out;
  animation-delay: ${props => props.index * 0.15}s;
  opacity: 0;
  animation-fill-mode: forwards;
  position: relative;
  overflow: hidden;
  background: ${colors.background.card};
  border-left: 3px solid ${colors.accent.secondary};

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(205, 62, 253, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
    border-radius: 50%;
    opacity: 0;
    transform: translate(30%, 30%);
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.lg};
    background: ${colors.background.hover};
    border-left: 3px solid ${colors.accent.primary};

    &:after {
      opacity: 1;
    }
  }

  &:hover .feature-icon {
    transform: scale(1.1) rotate(5deg);
    background: ${colors.accent.primary};
    color: ${colors.text.primary};
  }
`;

// Apply the className in the component render
// <FormFeatureIcon className="feature-icon">

const FormFeatureIcon = styled.div.attrs({
  className: 'feature-icon'
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: ${borderRadius.lg};
  background: ${colors.background.secondary};
  margin-right: ${props => props.isRTL ? '0' : spacing.md};
  margin-left: ${props => props.isRTL ? spacing.md : '0'};
  flex-shrink: 0;
  color: ${colors.accent.primary};
  font-size: ${typography.fontSizes.lg};
  transition: ${transitions.medium};
  position: relative;
  z-index: 1;
  box-shadow: ${shadows.sm};

  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 10px;
    height: 10px;
    background: ${colors.accent.secondary};
    opacity: 0.3;
    border-radius: ${borderRadius.full};
    transform: translateX(-50%);
    z-index: -1;
    transition: ${transitions.medium};
  }

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${colors.gradients.subtle};
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .feature-card:hover & {
    color: ${colors.text.primary};
    transform: scale(1.1) rotate(5deg);
    background: ${colors.accent.primary};

    &:before {
      opacity: 1;
    }
  }

  .feature-card:hover &:after {
    width: 25px;
    height: 5px;
    border-radius: ${borderRadius.full};
    bottom: -8px;
    background: ${colors.accent.primary};
    opacity: 0.5;
  }
`;

const FormFeatureTitle = styled.h4`
  margin: 0 0 ${spacing.sm} 0;
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${colors.text.primary};
  transition: ${transitions.medium};
  position: relative;
  display: inline-block;

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${colors.gradients.accent};
    transition: width 0.3s ease;
  }

  ${FormFeatureCard}:hover & {
    color: ${colors.accent.primary};

    &:after {
      width: 30px;
    }
  }

  /* RTL Support */
  [dir="rtl"] & {
    &:after {
      left: auto;
      right: 0;
    }
  }
`;

const FeatureContent = styled.div`
  flex: 1;
  transition: ${transitions.medium};
  
  ${FormFeatureCard}:hover & {
    transform: translateX(5px);
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    ${FormFeatureCard}:hover & {
      transform: translateX(-5px);
    }
  }
`;

const FeatureDescription = styled.p`
  margin: 0;
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  transition: ${transitions.medium};
  line-height: ${typography.lineHeights.normal};
  
  ${FormFeatureCard}:hover & {
    color: ${colors.text.primary};
  }
`;

// Button components
const buttonBase = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    filter: brightness(1.05);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    filter: brightness(0.95);
  }
  
  svg {
    margin-right: ${props => props.isRTL ? '0' : '0.5rem'};
    margin-left: ${props => props.isRTL ? '0.5rem' : '0'};
  }
`;

const CreateButton = styled(ActionButton)`
  background: ${colors.gradients.button};
  color: ${colors.text.primary};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  padding: ${spacing.sm} ${spacing.lg};
  box-shadow: ${shadows.md};
  transition: ${transitions.medium};
  position: relative;
  overflow: hidden;
  border-radius: ${borderRadius.md};
  border: none;
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
    transform: scale(0);
    transition: transform 0.5s ease, opacity 0.5s ease;
    pointer-events: none;
    opacity: 0;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.lg};
    background: ${colors.gradients.buttonHover};
  }
  
  &:hover:before {
    transform: scale(1);
    opacity: 1;
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: ${shadows.sm};
  }
  
  svg {
    margin-right: ${spacing.sm};
    font-size: ${typography.fontSizes.md};
  }
  
  /* RTL Support */
  [dir="rtl"] & svg {
    margin-right: 0;
    margin-left: ${spacing.sm};
  }
  
  // Add pulsing animation
  animation: ${pulse} 2s infinite;
  animation-delay: 1s;
  
  &:hover {
    animation: none;
  }
  
  svg {
    color: white;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: rotate(90deg);
  }
`;

// Wrapper for search functionality to avoid input element having children
const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colors.background.card};
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.md};
  box-shadow: ${shadows.sm};
  width: 100%;
  max-width: 350px;
  transition: ${transitions.medium};
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${colors.gradients.accent};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:focus-within {
    box-shadow: ${shadows.md};
    border-color: rgba(205, 62, 253, 0.3);
    transform: translateY(-2px);
    
    &:after {
      transform: scaleX(1);
    }
  }
  
  svg {
    color: ${colors.accent.primary};
    ${props => props.isRTL 
      ? css`margin-left: ${spacing.sm};`
      : css`margin-right: ${spacing.sm};`
    }
    transition: color 0.3s ease;
    font-size: ${typography.fontSizes.sm};
  }
  
  &:focus-within svg {
    color: ${colors.accent.primary};
  }
  
  input {
    border: none;
    outline: none;
    width: 100%;
    background: transparent;
    font-size: ${typography.fontSizes.sm};
    color: ${colors.text.secondary};
    direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
    
    &::placeholder {
      color: ${colors.text.disabled};
      transition: color 0.3s ease;
    }
    
    &:focus::placeholder {
      color: ${colors.text.muted};
    }
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const FormFilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  background: ${props => props.active ? colors.accent.secondary : 'rgba(255, 255, 255, 0.05)'};
  color: ${colors.text.primary}; /* Always white text for better visibility */
  border: none;
  border-radius: ${borderRadius.md};
  padding: ${spacing.xs} ${spacing.md};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: ${transitions.medium};
  box-shadow: ${props => props.active ? shadows.md : 'none'};
  
  svg {
    font-size: ${typography.fontSizes.sm};
    color: ${colors.text.primary};
  }
  
  &:hover {
    background: ${colors.accent.secondary};
    transform: translateY(-2px);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(130, 161, 191, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  background: ${colors.accent.secondary};
  color: ${colors.text.primary}; /* Always white text for better visibility */
  border: none;
  border-radius: ${borderRadius.md};
  padding: ${spacing.xs} ${spacing.md};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: ${transitions.medium};
  box-shadow: ${shadows.sm};
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${colors.gradients.accent};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  svg {
    font-size: ${typography.fontSizes.sm};
    color: ${colors.text.primary};
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: ${colors.accent.primary};
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
    
    &:after {
      transform: scaleX(1);
    }
    
    svg {
      transform: rotate(180deg);
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: ${shadows.sm};
  }
`;


export default FormsPanel;

