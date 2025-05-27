import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Button from '../../Common/Button';

/**
 * Post-launch maintenance guide component.
 * Displays key tips and allows generating a printable PDF.
 * This component can be reused in other areas where a simple
 * checklist with PDF export is required.
 */
const MaintenanceGuide = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const tips = [
    t('postLaunch.tips.updateDependencies', 'Keep dependencies updated'),
    t('postLaunch.tips.monitorErrors', 'Monitor and fix errors promptly'),
    t('postLaunch.tips.backupData', 'Backup your data regularly'),
    t('postLaunch.tips.securityUpdates', 'Apply security updates'),
    t('postLaunch.tips.collectFeedback', 'Collect user feedback'),
  ];

  const generatePDF = () => {
    const win = window.open('', 'maintenance-guide');
    if (!win) return;
    win.document.write(
      `<html><head><title>${t('postLaunch.maintenanceGuide', "Here's how to maintain your app")}</title></head>` +
      '<body>' +
      `<h1>${t('postLaunch.maintenanceGuide', "Here's how to maintain your app")}</h1>` +
      '<ul>' +
      tips.map((tip) => `<li>${tip}</li>`).join('') +
      '</ul>' +
      '</body></html>'
    );
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <Container dir={isRTL ? 'rtl' : 'ltr'}>
      <Title>{t('postLaunch.maintenanceGuide', "Here's how to maintain your app")}</Title>
      <TipList dir={isRTL ? 'rtl' : 'ltr'}>
        {tips.map((tip, idx) => (
          <li key={idx}>{tip}</li>
        ))}
      </TipList>
      <Button variant="primary" onClick={generatePDF}>
        {t('postLaunch.downloadPDF', 'Download PDF')}
      </Button>
    </Container>
  );
};

const Container = styled.div`
  background: linear-gradient(145deg, #1c1c24, #1e1e28);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  background: linear-gradient(90deg, #cd3efd, #7b2cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TipList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  li {
    margin-bottom: 0.5rem;
  }

  &[dir='rtl'] {
    padding-left: 0;
    padding-right: 1.25rem;
  }
`;

export default MaintenanceGuide;
