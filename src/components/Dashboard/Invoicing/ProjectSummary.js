import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  ActionButton
} from '../../styles/GlobalComponents';
import generateProjectSummaryPDF from '../../../utils/reportGenerator';

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
        <PanelTitle>{t('invoicing.projectSummaryTitle', 'Your Software Project Summary')}</PanelTitle>
        <ActionButton onClick={handleDownload} small>
          {t('invoicing.downloadSummary', 'Download PDF')}
        </ActionButton>
      </PanelHeader>
      <SummaryContent>
        {project?.description || t('invoicing.noSummary', 'No summary available.')}
      </SummaryContent>
    </PanelContainer>
  );
};

export default ProjectSummary;
