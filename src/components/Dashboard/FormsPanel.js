import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Card } from '../../styles/dashboardStyles';
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
    <FormsPanelContainer>
      <PanelHeader>
        <HeaderTitle>{t('forms.title', 'Forms')}</HeaderTitle>
        <CreateButton onClick={toggleNewForm} isRTL={isRTL}>
          <FaPlus />
          {t('forms.create', 'Create Form')}
        </CreateButton>
      </PanelHeader>
      
      <FormsToolbar>
        <FormTypeFilters>
          <FilterButton 
            active={activeFormType === 'all'} 
            onClick={() => handleFormTypeChange('all')}
            isRTL={isRTL}
          >
            <FaClipboardList />
            {t('forms.types.all', 'All Forms')}
          </FilterButton>
          <FilterButton 
            active={activeFormType === 'feedback'} 
            onClick={() => handleFormTypeChange('feedback')}
            isRTL={isRTL}
          >
            <FaCommentAlt />
            {t('forms.types.feedback', 'Feedback')}
          </FilterButton>
          <FilterButton 
            active={activeFormType === 'revision'} 
            onClick={() => handleFormTypeChange('revision')}
            isRTL={isRTL}
          >
            <FaEdit />
            {t('forms.types.revision', 'Revision')}
          </FilterButton>
        </FormTypeFilters>
        
        <SearchAndSortContainer isRTL={isRTL}>
          <SearchBar isRTL={isRTL}>
            <FaSearch />
            <input
              type="text"
              placeholder={t('forms.search', 'Search forms...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
          
          <SortButton 
            onClick={toggleSortDirection}
            isRTL={isRTL}
          >
            <FaSort />
            {sortDirection === 'asc' 
              ? t('forms.sortAsc', 'Ascending') 
              : t('forms.sortDesc', 'Descending')
            }
          </SortButton>
        </SearchAndSortContainer>
      </FormsToolbar>
      
      {showNewForm && (
        <NewFormContainer>
          <FeedbackForm onClose={toggleNewForm} />
        </NewFormContainer>
      )}
      
      <FormsListContainer>
        {sortedForms.length > 0 ? (
          <FormsGrid>
            {sortedForms.map((form, index) => (
              <FormCard key={form.id} index={index}>
                <FormCardHeader>
                  <FormTitle>{form.title}</FormTitle>
                  {renderStatusBadge(form.status)}
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
                    color="#82a1bf"
                  />
                  <IconButton 
                    title={t('forms.actions.edit', 'Edit Form')} 
                    icon={<FaEdit />} 
                    color="#faaa93"
                  />
                  <IconButton 
                    title={t('forms.actions.delete', 'Delete Form')} 
                    icon={<FaTrash />} 
                    color="#e74c3c"
                  />
                </FormActions>
              </FormCard>
            ))}
          </FormsGrid>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <FaClipboardList />
            </EmptyIcon>
            <EmptyTitle>{t('forms.empty.title', 'No forms found')}</EmptyTitle>
            <EmptyDescription>
              {t('forms.empty.description', 'Create a new form or change your filters to see results')}
            </EmptyDescription>
            <CreateButton onClick={toggleNewForm} small isRTL={isRTL}>
              <FaPlus />
              {t('forms.create', 'Create Form')}
            </CreateButton>
          </EmptyState>
        )}
      </FormsListContainer>
      
      <FormFeaturesSection>
        <SectionTitle>{t('forms.features.title', 'Form System Features')}</SectionTitle>
        <FeaturesGrid>
          <FeatureCard index={0}>
            <FeatureIcon isRTL={isRTL}>
              <FaComments />
            </FeatureIcon>
            <FeatureContent>
              <FeatureTitle>{t('forms.features.feedback', 'Feedback Collection')}</FeatureTitle>
              <FeatureDescription>
                {t('forms.features.feedbackDesc', 'Create custom feedback forms to collect insights from clients')}
              </FeatureDescription>
            </FeatureContent>
          </FeatureCard>
          <FeatureCard index={1}>
            <FeatureIcon isRTL={isRTL}>
              <FaCamera />
            </FeatureIcon>
            <FeatureContent>
              <FeatureTitle>{t('forms.features.visual', 'Visual Annotations')}</FeatureTitle>
              <FeatureDescription>
                {t('forms.features.visualDesc', 'Allow clients to add visual annotations to their feedback')}
              </FeatureDescription>
            </FeatureContent>
          </FeatureCard>
          <FeatureCard index={2}>
            <FeatureIcon isRTL={isRTL}>
              <FaRobot />
            </FeatureIcon>
            <FeatureContent>
              <FeatureTitle>{t('forms.features.ai', 'AI Analysis')}</FeatureTitle>
              <FeatureDescription>
                {t('forms.features.aiDesc', 'Automatically analyze feedback with AI to identify key insights')}
              </FeatureDescription>
            </FeatureContent>
          </FeatureCard>
          <FeatureCard index={3}>
            <FeatureIcon isRTL={isRTL}>
              <FaDownload />
            </FeatureIcon>
            <FeatureContent>
              <FeatureTitle>{t('forms.features.export', 'Export Options')}</FeatureTitle>
              <FeatureDescription>
                {t('forms.features.exportDesc', 'Export feedback data in multiple formats for further analysis')}
              </FeatureDescription>
            </FeatureContent>
          </FeatureCard>
        </FeaturesGrid>
      </FormFeaturesSection>
    </FormsPanelContainer>
  );
};

// Styled components
const FormsPanelContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: rgba(130, 161, 191, 0.05);
    z-index: -1;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -50px;
    left: -50px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-color: rgba(250, 170, 147, 0.05);
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: #513a52;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FormsToolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const FormTypeFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SearchAndSortContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: ${props => props.isRTL ? 'flex-end' : 'flex-start'};
    width: 100%;
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
  display: flex;
  flex-direction: column;
  flex: 1;
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const FormTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #513a52;
  position: relative;
  display: inline-block;
  transition: transform 0.3s ease, color 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #faaa93;
    transition: width 0.3s ease;
  }
  
  ${FormCard}:hover & {
    transform: translateX(5px);
    color: #3a2a3b;
  }
  
  ${FormCard}:hover &:after {
    width: 100%;
  }
`;

const FormDescription = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
  transition: color 0.3s ease, transform 0.3s ease;
  
  ${FormCard}:hover & {
    color: #444;
    transform: translateY(-2px);
  }
`;

const FormMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
  font-size: 0.85rem;
  color: #888;
  transition: color 0.3s ease, transform 0.3s ease;
  
  ${FormCard}:hover & {
    color: #666;
    transform: translateY(-3px);
  }
`;

const FormDate = styled.span``;

const FormResponses = styled.span``;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  background-color: ${props => props.color};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 0.5s ease, transform 0.5s ease;
    pointer-events: none;
  }
  
  ${FormCard}:hover & {
    transform: scale(1.05);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    
    &:before {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

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
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.3s ease-in-out, ${slideUp} 0.3s ease-in-out;
`;

const EmptyState = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1rem;
  animation: ${fadeIn} 0.5s ease-in-out, ${slideUp} 0.5s ease-in-out;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
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
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  
  svg {
    transition: transform 0.5s ease, color 0.5s ease;
  }
  
  ${EmptyState}:hover & svg {
    transform: scale(1.2) rotate(10deg);
    color: #82a1bf;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(130, 161, 191, 0.1);
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.5s ease;
    z-index: -1;
  }
  
  ${EmptyState}:hover &:after {
    transform: translate(-50%, -50%) scale(1);
  }
`;

const EmptyTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #513a52;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  
  ${EmptyState}:hover & {
    color: #3a2a3b;
    transform: translateY(-3px);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: #faaa93;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }
  
  ${EmptyState}:hover &:after {
    width: 50px;
  }
`;

const EmptyDescription = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  color: #888;
  max-width: 400px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  
  ${EmptyState}:hover & {
    color: #666;
    transform: translateY(-2px);
  }
`;

const FormFeaturesSection = styled.section`
  margin-top: 3rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #513a52;
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

const FeatureCard = styled(Card)`
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeIn} 0.5s ease-in-out, ${slideUp} 0.5s ease-in-out;
  animation-delay: ${props => props.index * 0.15}s;
  opacity: 0;
  animation-fill-mode: forwards;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    background-color: #fafafa;
  }
  
  &:hover ${props => props.FeatureIcon} {
    transform: scale(1.1) rotate(5deg);
    background-color: #faaa93;
    color: white;
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background-color: #f5f5f5;
  margin-right: ${props => props.isRTL ? '0' : '1rem'};
  margin-left: ${props => props.isRTL ? '1rem' : '0'};
  font-size: 1.5rem;
  color: #513a52;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #513a52;
`;

const FeatureDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
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

const CreateButton = styled.button`
  ${buttonBase}
  background-color: #faaa93;
  color: white;
  padding: ${props => props.small ? '0.5rem 1rem' : '0.6rem 1.2rem'};
  font-size: ${props => props.small ? '0.9rem' : '0.95rem'};
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    z-index: -1;
  }
  
  &:hover:before {
    animation: ${shine} 1.5s ease-out;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(250, 170, 147, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(250, 170, 147, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
    
    svg {
      margin-right: 0.5rem;
      font-size: 1rem;
    }
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

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.active ? '#82a1bf' : '#f7f9fc'};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 2px 5px rgba(130, 161, 191, 0.3)' : 'none'};
  
  svg {
    font-size: 0.9rem;
    color: white;
  }
  
  &:hover {
    background-color: #82a1bf;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(130, 161, 191, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const SortButton = styled.button`
  ${buttonBase}
  background-color: #82a1bf;
  color: white;
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  box-shadow: 0 2px 5px rgba(130, 161, 191, 0.3);
  
  svg {
    color: white;
  }
  
  &:hover {
    background-color: #6889a8;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(130, 161, 191, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(130, 161, 191, 0.2);
  }
`;


export default FormsPanel;
