import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import generateProjectSummaryPDF from '../../../utils/reportGenerator';

// Define the components locally instead of importing them
const PanelContainer = styled.div`
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  margin-bottom: 1.5rem;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PanelTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(90deg, #fff, #4cc9f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(76, 201, 240, 0.3);
`;

const ActionButton = styled.button`
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
const SummaryContent = styled.div`
  color: #fff;
  line-height: 1.6;
`;

const ProjectSummary = ({ project }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleDownload = () => {
    generateProjectSummaryPDF(project, t);
  };

  return (
    <PanelContainer dir={isRTL ? 'rtl' : 'ltr'}>
      <PanelHeader>
        <PanelTitle>{t('invoices.projectSummaryTitle', 'Your Software Project Summary')}</PanelTitle>
        <ActionButton onClick={handleDownload} small>
          {t('invoices.downloadSummary', 'Download PDF')}
        </ActionButton>
      </PanelHeader>
      <SummaryContent>
        {project?.description || t('invoices.noSummary', 'No summary available.')}
      </SummaryContent>
    </PanelContainer>
  );
};

export default ProjectSummary;
