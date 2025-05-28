import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DashboardPanel } from '../../../styles/dashboardStyles';
import { ActionButton } from '../../../styles/GlobalComponents';

const Container = styled(DashboardPanel)`
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
`;

const HireAgain = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  /**
   * Navigate user to the contact section so they can start a new project.
   */
  const handleHire = () => {
    navigate('/contact');
  };

  return (
    <Container dir={isRTL ? 'rtl' : 'ltr'}>
      <h2>{t('postLaunch.hireAgain.title', 'Hire me again')}</h2>
      <p>{t('postLaunch.hireAgain.description', 'Have another project? I\'m ready to help again!')}</p>
      <ActionButton onClick={handleHire} data-testid="hire-again-button">
        {t('postLaunch.hireAgain.button', 'Hire me again')}
      </ActionButton>
    </Container>
  );
};

export default HireAgain;
