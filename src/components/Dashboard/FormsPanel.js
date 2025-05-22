import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaCommentAlt, FaClipboardList, FaEdit, FaEye, 
  FaTrash, FaPlus, FaFilter, FaSearch, FaSort, 
  FaComments, FaCamera, FaRobot, FaDownload
} from 'react-icons/fa';
import FeedbackForm from './FeedbackForm';
import Button from '../Common/Button';

const FormsPanel = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeFormType, setActiveFormType] = useState('feedback');
  const [showNewForm, setShowNewForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Mock data for forms
  const mockForms = [
    {
      id: '1',
      type: 'feedback',
      title: 'Homepage Design Feedback',
      date: new Date(2025, 4, 15),
      status: 'pending',
      client: 'ABC Company',
      project: 'Corporate Website',
      responses: 0,
      lastUpdated: new Date(2025, 4, 15)
    },
    {
      id: '2',
      type: 'revision',
      title: 'Logo Revision Request',
      date: new Date(2025, 4, 10),
      status: 'completed',
      client: 'XYZ Startup',
      project: 'Brand Identity',
      responses: 2,
      lastUpdated: new Date(2025, 4, 12)
    },
    {
      id: '3',
      type: 'feedback',
      title: 'Mobile App UI Feedback',
      date: new Date(2025, 4, 5),
      status: 'pending',
      client: 'Tech Solutions',
      project: 'Mobile App',
      responses: 1,
      lastUpdated: new Date(2025, 4, 8)
    }
  ];
  
  // Filter forms based on active form type and search query
  const filteredForms = mockForms.filter(form => {
    // Filter by form type
    if (activeFormType !== 'all' && form.type !== activeFormType) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !form.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort forms based on sort criteria
  const sortedForms = [...filteredForms].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = a.date.getTime() - b.date.getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'responses':
        comparison = a.responses - b.responses;
        break;
      case 'lastUpdated':
        comparison = a.lastUpdated.getTime() - b.lastUpdated.getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  // Handle form type change
  const handleFormTypeChange = (type) => {
    setActiveFormType(type);
  };
  
  // Render form status badge
  const renderStatusBadge = (status) => {
    let color = '';
    let label = '';
    
    switch (status) {
      case 'pending':
        color = '#f2c94c';
        label = t('forms.status.pending', 'Pending');
        break;
      case 'completed':
        color = '#27ae60';
        label = t('forms.status.completed', 'Completed');
        break;
      case 'draft':
        color = '#bdbdbd';
        label = t('forms.status.draft', 'Draft');
        break;
      default:
        color = '#bdbdbd';
        label = status;
    }
    
    return (
      <StatusBadge color={color}>
        {label}
      </StatusBadge>
    );
  };
  
  return (
    <FormsPanelContainer isRTL={isRTL}>
      <FormsPanelHeader>
        <h2>{t('forms.title', 'Feedback & Forms')}</h2>
        <Button 
          variant="secondary" 
          leftIcon={<FaPlus />} 
          onClick={() => setShowNewForm(true)}
        >
          {t('forms.createNew', 'Create New Form')}
        </Button>
      </FormsPanelHeader>
      
      <FormsToolbar>
        <FormTypeFilters>
          <Button 
            variant="filter" 
            size="small" 
            active={activeFormType === 'all'} 
            onClick={() => handleFormTypeChange('all')}
            leftIcon={<FaClipboardList />}
          >
            {t('forms.types.all', 'All Forms')}
          </Button>
          <Button 
            variant="filter" 
            size="small" 
            active={activeFormType === 'feedback'} 
            onClick={() => handleFormTypeChange('feedback')}
            leftIcon={<FaCommentAlt />}
          >
            {t('forms.types.feedback', 'Feedback')}
          </Button>
          <Button 
            variant="filter" 
            size="small" 
            active={activeFormType === 'revision'} 
            onClick={() => handleFormTypeChange('revision')}
            leftIcon={<FaEdit />}
          >
            {t('forms.types.revision', 'Revision')}
          </Button>
        </FormTypeFilters>
        
        <SearchAndSortContainer>
          <SearchBar>
            <FaSearch />
            <input
              type="text"
              placeholder={t('forms.search', 'Search forms...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
          
          <Button 
            variant="filter" 
            size="small" 
            onClick={toggleSortDirection}
            leftIcon={<FaSort />}
          >
            {sortDirection === 'asc' 
              ? t('forms.sortAsc', 'Ascending') 
              : t('forms.sortDesc', 'Descending')
            }
          </Button>
        </SearchAndSortContainer>
      </FormsToolbar>
      
      {/* Forms List */}
      <FormsListContainer>
        {sortedForms.length > 0 ? (
          <FormsGrid>
            {sortedForms.map(form => (
              <FormCard key={form.id}>
                <FormCardHeader>
                  <FormTitle>{form.title}</FormTitle>
                  {renderStatusBadge(form.status)}
                </FormCardHeader>
                
                <FormCardBody>
                  <FormMetadata>
                    <FormInfoItem>
                      <FormInfoLabel>{t('forms.client', 'Client')}:</FormInfoLabel>
                      <FormInfoValue>{form.client}</FormInfoValue>
                    </FormInfoItem>
                    <FormInfoItem>
                      <FormInfoLabel>{t('forms.project', 'Project')}:</FormInfoLabel>
                      <FormInfoValue>{form.project}</FormInfoValue>
                    </FormInfoItem>
                    <FormInfoItem>
                      <FormInfoLabel>{t('forms.created', 'Created')}:</FormInfoLabel>
                      <FormInfoValue>{formatDate(form.date)}</FormInfoValue>
                    </FormInfoItem>
                    <FormInfoItem>
                      <FormInfoLabel>{t('forms.responses', 'Responses')}:</FormInfoLabel>
                      <FormInfoValue>{form.responses}</FormInfoValue>
                    </FormInfoItem>
                  </FormMetadata>
                  
                  <FormTypeIcon type={form.type}>
                    {form.type === 'feedback' ? <FaCommentAlt /> : <FaEdit />}
                  </FormTypeIcon>
                </FormCardBody>
                
                <FormCardFooter>
                  <ActionIcon 
                    title={t('forms.actions.view', 'View Form')}
                    aria-label={t('forms.actions.view', 'View Form')}
                  >
                    <FaEye />
                  </ActionIcon>
                  <ActionIcon 
                    title={t('forms.actions.edit', 'Edit Form')}
                    aria-label={t('forms.actions.edit', 'Edit Form')}
                  >
                    <FaEdit />
                  </ActionIcon>
                  <ActionIcon 
                    title={t('forms.actions.delete', 'Delete Form')}
                    danger
                    aria-label={t('forms.actions.delete', 'Delete Form')}
                  >
                    <FaTrash />
                  </ActionIcon>
                </FormCardFooter>
              </FormCard>
            ))}
          </FormsGrid>
        ) : (
          <NoFormsMessage>
            <FaClipboardList />
            <p>{t('forms.noForms', 'No forms found matching your criteria')}</p>
            <Button 
              variant="secondary" 
              size="small" 
              leftIcon={<FaPlus />} 
              onClick={() => setShowNewForm(true)}
            >
              {t('forms.createNew', 'Create New Form')}
            </Button>
          </NoFormsMessage>
        )}
      </FormsListContainer>
      
      {/* Form Features Section */}
      <FormFeaturesSection>
        <FeatureTitle>{t('forms.features.title', 'Form System Features')}</FeatureTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FaComments />
            </FeatureIcon>
            <FeatureContent>
              <FeatureName>{t('forms.features.feedbackReplayer', 'Feedback Replayer')}</FeatureName>
              <FeatureDescription>
                {t('forms.features.feedbackReplayerDesc', 'View feedback across milestones in timeline form')}
              </FeatureDescription>
            </FeatureContent>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaRobot />
            </FeatureIcon>
            <FeatureContent>
              <FeatureName>{t('forms.features.aiSummary', 'AI-Powered Summary')}</FeatureName>
              <FeatureDescription>
                {t('forms.features.aiSummaryDesc', 'Auto-summarizes feedback using AI')}
              </FeatureDescription>
            </FeatureContent>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaCamera />
            </FeatureIcon>
            <FeatureContent>
              <FeatureName>{t('forms.features.screenshotAnnotator', 'Screenshot Annotator')}</FeatureName>
              <FeatureDescription>
                {t('forms.features.screenshotAnnotatorDesc', 'Allow clients to upload screenshots with annotations')}
              </FeatureDescription>
            </FeatureContent>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaDownload />
            </FeatureIcon>
            <FeatureContent>
              <FeatureName>{t('forms.features.exportData', 'Export Data')}</FeatureName>
              <FeatureDescription>
                {t('forms.features.exportDataDesc', 'Export form responses to CSV or PDF')}
              </FeatureDescription>
            </FeatureContent>
          </FeatureCard>
        </FeaturesGrid>
      </FormFeaturesSection>
      
      {/* New Form Modal */}
      {showNewForm && (
        <FeedbackForm 
          isOpen={showNewForm} 
          onClose={() => setShowNewForm(false)} 
        />
      )}
    </FormsPanelContainer>
  );
};

const FormsPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.04);
  padding: 1.5rem;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  border: 1px solid #f5f5f5;
`;

const FormsPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f5f5f5;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #513a52;
    margin: 0;
    position: relative;
    padding-bottom: 0.5rem;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 3px;
      background-color: #513a52;
      border-radius: 3px;
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const CreateFormButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, #faaa93, #e88c76);
  color: white;
  border: none;
  border-radius: 8px;
  padding: ${props => props.small ? '0.5rem 1rem' : '0.75rem 1.25rem'};
  font-weight: 500;
  font-size: ${props => props.small ? '0.9rem' : '1rem'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(90deg, #e88c76, #d67e69);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const FormsToolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f5f5f5;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormTypeFilters = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const FormTypeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.active ? '#82a1bf' : '#f7f9fc'};
  color: ${props => props.active ? 'white' : '#513a52'};
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    font-size: 0.9rem;
  }
  
  &:hover {
    background-color: ${props => props.active ? '#82a1bf' : '#edf1f7'};
  }
`;

const SearchAndSortContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 400px;
  transition: all 0.2s ease;
  
  &:focus-within {
    background-color: #f7f9fc;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  }
  
  svg {
    color: #513a52;
    margin-right: 0.5rem;
  }
  
  input {
    border: none;
    background: none;
    outline: none;
    width: 100%;
    color: #513a52;
    
    &::placeholder {
      color: #a3a3a3;
    }
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f7f9fc;
  color: #513a52;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #edf1f7;
  }
`;

const FormsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.25rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f5f5f5;
  height: 100%;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.06);
    background-color: #fff;
  }
`;

const FormCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f5f5f5;
  background-color: #fafafa;
`;

const FormTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #513a52;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => `${props.color}20`};
  color: ${props => props.color};
`;

const FormCardBody = styled.div`
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: #fff;
  
  &:hover {
    background-color: #fff;
  }
`;

const FormMetadata = styled.div`
  flex: 1;
  background-color: #fff;
  
  &:hover {
    background-color: #fff;
  }
`;

const FormInfoItem = styled.div`
  display: flex;
  align-items: baseline;
`;

const FormInfoLabel = styled.span`
  font-weight: 500;
  color: #666;
  width: 70px;
  flex-shrink: 0;
`;

const FormInfoValue = styled.span`
  color: #333;
  word-break: break-word;
`;

const FormTypeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.type === 'feedback' ? 'rgba(130, 161, 191, 0.1)' : 'rgba(250, 170, 147, 0.1)'};
  color: ${props => props.type === 'feedback' ? '#82a1bf' : '#faaa93'};
  font-size: 1.2rem;
`;

const FormCardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.25rem;
  padding: 0.75rem 1.25rem;
  font-size: 1.35rem;
  background-color: #fafafa;
  border-top: 1px solid #f5f5f5;
`;

const ActionIcon = styled.button`
  all: unset;
  color: ${props => props.danger ? '#e74c3c' : '#513a52'};
  font-size: 1.35rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.danger ? '#c0392b' : '#513a52'};
    transform: translateY(-1px);
  }
`;

const NoFormsMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  
  svg {
    font-size: 3rem;
    color: #82a1bf;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 1.5rem;
  }
`;

const FormFeaturesSection = styled.div`
  margin-top: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #513a52;
  margin: 0 0 1rem 0;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f7f9fc;
  border-radius: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #82a1bf, #6889a8);
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureName = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #513a52;
`;

const FeatureDescription = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #666;
`;

export default FormsPanel;
