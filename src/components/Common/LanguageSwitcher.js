import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { setDocumentDirection } from '../../utils/rtl';

const LanguageSwitcher = ({ className }) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLanguage);
    setDocumentDirection(newLanguage);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLanguageChange();
    }
  };

  return (
    <SwitcherIconButton
      className={className}
      onClick={handleLanguageChange}
      onKeyDown={handleKeyDown}
      aria-label={
        i18n.language === 'en'
          ? t('navbar.switchToArabic', 'Switch to Arabic')
          : t('navbar.switchToEnglish', 'Switch to English')
      }
      title={i18n.language === 'en' ? 'العربية' : 'English'}
    >
      {i18n.language === 'en' ? 'AR' : 'EN'}
    </SwitcherIconButton>
  );
};

const SwitcherIconButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--accent-2);
  color: #fff;
  border: none;
  font-size: 1.15rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(130,161,191,0.10);
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  outline: none;

  &:hover {
    background: var(--accent-1);
    color: var(--dark);
    box-shadow: 0 4px 16px rgba(250,170,147,0.15);
  }

  &:focus-visible {
    outline: 2px dashed var(--accent-1);
    outline-offset: 3px;
  }
`;

export default LanguageSwitcher;
