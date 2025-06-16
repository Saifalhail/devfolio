import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { rtl } from '../../utils/rtl';
import { 
  FaFileInvoiceDollar, 
  FaHistory, 
  FaClipboardCheck, 
  FaFilePdf,
  FaDownload,
  FaSearch,
  FaFilter,
  FaSortAmountDown
} from 'react-icons/fa';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  ActionButton,
  IconContainer,
  ActionButtonWrapper
} from '../../styles/GlobalComponents';
import { spacing } from '../../styles/GlobalTheme';

// Import invoicing components
import InvoiceDisplay from './Invoicing/InvoiceDisplay';
import MilestoneDelivery from './Invoicing/MilestoneDelivery';
import PaymentHistory from './Invoicing/PaymentHistory';
import ProjectSummary from './Invoicing/ProjectSummary';
import StarryBackground from '../Common/StarryBackground';

const InvoicingPanel = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeSection, setActiveSection] = useState('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Mock data for demonstration
  const mockInvoices = [
    {
      id: 'INV-2025-001',
      issueDate: '2025-04-15',
      dueDate: '2025-05-15',
      amount: 2500,
      status: 'paid',
      project: 'E-commerce Website',
      client: 'TechSolutions Inc.'
    },
    {
      id: 'INV-2025-002',
      issueDate: '2025-05-01',
      dueDate: '2025-06-01',
      amount: 1800,
      status: 'pending',
      project: 'Mobile App Development',
      client: 'CreativeMinds LLC'
    },
    {
      id: 'INV-2025-003',
      issueDate: '2025-03-10',
      dueDate: '2025-04-10',
      amount: 950,
      status: 'overdue',
      project: 'Logo Design',
      client: 'FreshStart Startup'
    }
  ];

  const mockPayments = [
    {
      id: 'PMT-2025-001',
      date: '2025-04-12',
      amount: 2500,
      method: 'Bank Transfer',
      description: 'Payment for INV-2025-001',
      invoiceId: 'INV-2025-001'
    },
    {
      id: 'PMT-2025-002',
      date: '2025-03-05',
      amount: 1000,
      method: 'Credit Card',
      description: 'Deposit for Mobile App Project',
      invoiceId: 'INV-2025-002'
    }
  ];

  const mockMilestones = [
    {
      id: 'MS-001',
      title: 'Project Setup & Design',
      description: 'Initial project setup, wireframes, and design mockups',
      dueDate: '2025-04-20',
      status: 'completed',
      invoiceId: 'INV-2025-001',
      deliverables: [
        { name: 'Project Brief.pdf', url: '#', locked: false },
        { name: 'Wireframes.zip', url: '#', locked: false },
        { name: 'Design Mockups.zip', url: '#', locked: false }
      ]
    },
    {
      id: 'MS-002',
      title: 'Frontend Development',
      description: 'Development of user interface and frontend functionality',
      dueDate: '2025-05-15',
      status: 'in-progress',
      invoiceId: 'INV-2025-002',
      deliverables: [
        { name: 'Frontend Code.zip', url: '#', locked: false },
        { name: 'Component Documentation.pdf', url: '#', locked: false }
      ]
    },
    {
      id: 'MS-003',
      title: 'Backend Integration',
      description: 'API development and backend integration',
      dueDate: '2025-06-10',
      status: 'pending',
      invoiceId: 'INV-2025-003',
      deliverables: [
        { name: 'API Documentation.pdf', url: '#', locked: true },
        { name: 'Backend Code.zip', url: '#', locked: true }
      ]
    }
  ];

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <PanelContainer>
      <StarryBackground intensity={0.5} />
      
      <PanelHeader>
        <PanelTitle>
          <IconContainer 
            icon={FaFileInvoiceDollar} 
            color="#8338ec" 
            size="1.2em" 
            margin={isRTL ? `0 0 0 ${spacing.sm}` : `0 ${spacing.sm} 0 0`} 
          />
          {t('invoices.title', 'Invoices')}
        </PanelTitle>
        
        <ActionButtonWrapper>
          <ActionButton glow onClick={() => {}}>
            <IconContainer 
              icon={FaDownload} 
              size="1em" 
              margin={isRTL ? `0 0 0 ${spacing.xs}` : `0 ${spacing.xs} 0 0`} 
            />
            {t('common.export', 'Export')}
          </ActionButton>
        </ActionButtonWrapper>
      </PanelHeader>
      
      <SummaryCards>
        <SummaryCard>
          <SummaryCardIcon status="paid">
            <FaFileInvoiceDollar />
          </SummaryCardIcon>
          <SummaryCardContent>
            <SummaryCardTitle>{t('invoices.stats.total', 'Total Invoices')}</SummaryCardTitle>
            <SummaryCardValue>{mockInvoices.length}</SummaryCardValue>
          </SummaryCardContent>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryCardIcon status="pending">
            <FaHistory />
          </SummaryCardIcon>
          <SummaryCardContent>
            <SummaryCardTitle>{t('invoices.stats.pending', 'Pending')}</SummaryCardTitle>
            <SummaryCardValue>{mockInvoices.filter(inv => inv.status === 'pending').length}</SummaryCardValue>
          </SummaryCardContent>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryCardIcon status="overdue">
            <FaClipboardCheck />
          </SummaryCardIcon>
          <SummaryCardContent>
            <SummaryCardTitle>{t('invoices.stats.overdue', 'Overdue')}</SummaryCardTitle>
            <SummaryCardValue>{mockInvoices.filter(inv => inv.status === 'overdue').length}</SummaryCardValue>
          </SummaryCardContent>
        </SummaryCard>
      </SummaryCards>
      
      <NavigationTabs>
        <NavigationTab 
          active={activeSection === 'invoices'} 
          onClick={() => handleSectionChange('invoices')}
        >
          <FaFileInvoiceDollar />
          <span>{t('invoices.title', 'Invoices')}</span>
        </NavigationTab>
        
        <NavigationTab 
          active={activeSection === 'payments'} 
          onClick={() => handleSectionChange('payments')}
        >
          <FaHistory />
          <span>{t('invoices.paymentHistory', 'Payment History')}</span>
        </NavigationTab>
        
        <NavigationTab 
          active={activeSection === 'milestones'} 
          onClick={() => handleSectionChange('milestones')}
        >
          <FaClipboardCheck />
          <span>{t('invoices.milestoneDelivery.title', 'Milestone Delivery')}</span>
        </NavigationTab>
        
        <NavigationTab 
          active={activeSection === 'summary'} 
          onClick={() => handleSectionChange('summary')}
        >
          <FaFilePdf />
          <span>{t('invoices.projectSummaryTitle', 'Project Summary')}</span>
        </NavigationTab>
      </NavigationTabs>
      
      <SearchFilterContainer>
        <SearchBar>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder={t('common.search', 'Search...')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
        
        <FilterButton>
          <FaFilter />
          <span>{t('common.filter', 'Filter')}</span>
        </FilterButton>
        
        <SortButton>
          <FaSortAmountDown />
          <span>{t('common.sort', 'Sort')}</span>
        </SortButton>
      </SearchFilterContainer>
      
      <Content>
        {activeSection === 'invoices' && (
          <InvoiceDisplay invoices={mockInvoices} />
        )}
        
        {activeSection === 'payments' && (
          <PaymentHistory payments={mockPayments} />
        )}
        
        {activeSection === 'milestones' && (
          <MilestoneDelivery milestones={mockMilestones} />
        )}
        
        {activeSection === 'summary' && (
          <ProjectSummary />
        )}
      </Content>
    </PanelContainer>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
`;

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  opacity: 1;
  pointer-events: none;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(90deg, #fff, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(167, 139, 250, 0.3);
`;

const NavigationTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const NavigationTab = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${props => props.active 
    ? 'linear-gradient(90deg, #7b2cbf, #9d4edd)' 
    : 'rgba(35, 38, 85, 0.6)'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active 
    ? '0 8px 20px rgba(123, 44, 191, 0.3)' 
    : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    background: linear-gradient(45deg, #6031a8 0%, #7b42d1 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
  
  svg {
    font-size: 1rem;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  }
  
  @media (max-width: 768px) {
    flex: 1;
    min-width: 120px;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    
    span {
      display: none;
    }
    
    svg {
      margin: 0 auto;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const CustomActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, #4361ee, #4cc9f0);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(67, 97, 238, 0.4);
  }
  
  svg {
    font-size: 1rem;
  }
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const SummaryCardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => {
    switch(props.status) {
      case 'paid': return 'linear-gradient(135deg, #4cc9f0, #4361ee)';
      case 'pending': return 'linear-gradient(135deg, #f7b801, #f18701)';
      case 'overdue': return 'linear-gradient(135deg, #ef476f, #b5179e)';
      default: return 'linear-gradient(135deg, #4cc9f0, #4361ee)';
    }
  }};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  svg {
    font-size: 1.5rem;
    color: white;
  }
`;

const SummaryCardContent = styled.div`
  flex: 1;
`;

const SummaryCardTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 500;
  color: #a0a0a0;
  margin: 0 0 0.3rem 0;
`;

const SummaryCardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const SearchFilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background: rgba(35, 38, 85, 0.4);
  border-radius: 8px;
  padding: 0 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const SearchIcon = styled.div`
  color: #a0a0a0;
  margin-right: 0.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  padding: 0.75rem 0;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #a0a0a0;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(35, 38, 85, 0.4);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    background: rgba(67, 97, 238, 0.3);
  }
`;

const SortButton = styled(FilterButton)`
  /* Same as FilterButton */
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
`;

export default InvoicingPanel;
