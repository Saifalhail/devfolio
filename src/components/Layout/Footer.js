import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterLogo>DevFolio</FooterLogo>
          <FooterDescription>
            {t('footer.description')}
          </FooterDescription>
        </FooterSection>
        
        <FooterSection>
          <FooterHeading>{t('footer.links.title')}</FooterHeading>
          <FooterLinks>
            <FooterLink to="/">{t('navbar.home')}</FooterLink>
            <FooterLink to="/services">{t('navbar.services')}</FooterLink>
            <FooterLink to="/portfolio">{t('navbar.portfolio')}</FooterLink>
            <FooterLink to="/about">{t('navbar.about')}</FooterLink>
            <FooterLink to="/contact">{t('navbar.contact')}</FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterHeading>{t('footer.services.title')}</FooterHeading>
          <FooterLinks>
            <FooterLink to="/services/web-development">{t('footer.services.webDev')}</FooterLink>
            <FooterLink to="/services/mobile-apps">{t('footer.services.mobileApps')}</FooterLink>
            <FooterLink to="/services/qr-codes">{t('footer.services.qrCodes')}</FooterLink>
            <FooterLink to="/services/ui-ux-design">{t('footer.services.uiUxDesign')}</FooterLink>
            <FooterLink to="/services/custom-solutions">{t('footer.services.customSolutions')}</FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterHeading>{t('footer.contact.title')}</FooterHeading>
          <ContactDetail>
            <i className="fas fa-envelope"></i> contact@devfolio.com
          </ContactDetail>
          <ContactDetail>
            <i className="fas fa-phone"></i> +123 456 7890
          </ContactDetail>
          <SocialLinks>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </SocialLink>
            <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </SocialLink>
            <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </SocialLink>
            <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </SocialLink>
          </SocialLinks>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <FooterCopyright>
          &copy; {new Date().getFullYear()} DevFolio. {t('footer.copyright')}
        </FooterCopyright>
      </FooterBottom>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: var(--dark);
  color: white;
  padding-top: 3rem;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FooterSection = styled.div`
  margin-bottom: 2rem;
`;

const FooterLogo = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--primary-bg);
`;

const FooterDescription = styled.p`
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: var(--light-gray);
`;

const FooterHeading = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 3px;
    background-color: var(--accent-1);
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLink = styled(Link)`
  color: var(--light-gray);
  margin-bottom: 0.7rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--accent-1);
  }
`;

const ContactDetail = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: var(--light-gray);
  
  i {
    margin-right: 0.8rem;
    color: var(--accent-1);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  margin-top: 1.5rem;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  margin-right: 0.8rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-2);
    transform: translateY(-3px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 0;
  margin-top: 2rem;
`;

const FooterCopyright = styled.p`
  text-align: center;
  color: var(--light-gray);
  font-size: 0.9rem;
`;

export default Footer;
