import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      
      <FooterContent isRTL={isRTL}>
        <FooterMainSection isRTL={isRTL}>
          <FooterLogo>
            {/* Force LTR direction for the logo text even in RTL mode */}
            <span style={{ direction: 'ltr', display: 'inline-block' }}>
              <span style={{ color: '#cd3efd' }}>S.</span>N.P
            </span>
          </FooterLogo>
          <FooterDescription isRTL={isRTL}>
            {t('footer.description')}
          </FooterDescription>
          <FooterSlogan isRTL={isRTL}>
            {t('footer.slogan')}
          </FooterSlogan>
          <SocialLinks isRTL={isRTL}>
            <SocialLink 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={t('footer.social.linkedin')}
            >
              <i className="fab fa-linkedin"></i>
            </SocialLink>
            <SocialLink 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={t('footer.social.github')}
            >
              <i className="fab fa-github"></i>
            </SocialLink>
          </SocialLinks>
        </FooterMainSection>
        
        <FooterLinksContainer isRTL={isRTL}>
          <FooterSection isRTL={isRTL}>
            <FooterHeading isRTL={isRTL}>{t('footer.links.title')}</FooterHeading>
            <FooterLinks isRTL={isRTL}>
              <FooterLink to="/" isRTL={isRTL}>{t('navbar.home')}</FooterLink>
              <FooterLink to="/services" isRTL={isRTL}>{t('navbar.services')}</FooterLink>
              <FooterLink to="/portfolio" isRTL={isRTL}>{t('navbar.portfolio')}</FooterLink>
              <FooterLink to="/contact" isRTL={isRTL}>{t('navbar.contact')}</FooterLink>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection isRTL={isRTL}>
            <FooterHeading isRTL={isRTL}>{t('footer.services.title')}</FooterHeading>
            <FooterLinks isRTL={isRTL}>
              <FooterLink to="/services/web-development" isRTL={isRTL}>{t('footer.services.webDev')}</FooterLink>
              <FooterLink to="/services/mobile-apps" isRTL={isRTL}>{t('footer.services.mobileApps')}</FooterLink>
              <FooterLink to="/services/ai-integrations" isRTL={isRTL}>AI Integrations</FooterLink>
              <FooterLink to="/services/qr-codes" isRTL={isRTL}>{t('footer.services.qrCodes')}</FooterLink>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection isRTL={isRTL}>
            <FooterHeading isRTL={isRTL}>{t('footer.contact.title')}</FooterHeading>
            <ContactDetail isRTL={isRTL}>
              <ContactIcon>📧</ContactIcon>
              <span>contact@devfolio.com</span>
            </ContactDetail>
            <ContactDetail isRTL={isRTL}>
              <ContactIcon>📱</ContactIcon>
              <span>+974 1234 5678</span>
            </ContactDetail>
            <ContactDetail isRTL={isRTL}>
              <ContactIcon>📍</ContactIcon>
              <span>Doha, Qatar</span>
            </ContactDetail>
          </FooterSection>
        </FooterLinksContainer>
      </FooterContent>
      
      <FooterDivider />
      
      <FooterBottom isRTL={isRTL}>
        <FooterCopyright isRTL={isRTL}>
          &copy; {currentYear} SNP. {t('footer.copyright')}
        </FooterCopyright>
      </FooterBottom>
    </FooterContainer>
  );
};

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const FooterContainer = styled.footer`
  position: relative;
  background: linear-gradient(135deg, #513a52 0%, #2d2235 100%);
  color: white;
  padding-top: 3rem;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.3;
  }
`;

const FooterWave = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);
  
  svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 70px;
  }
  
  .shape-fill {
    fill: #FFFFFF;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  position: relative;
  z-index: 2;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterMainSection = styled.div`
  padding-right: ${props => props.isRTL ? '0' : '2rem'};
  padding-left: ${props => props.isRTL ? '2rem' : '0'};
  border-right: ${props => props.isRTL ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-left: ${props => props.isRTL ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
  
  @media (max-width: 992px) {
    border-right: none;
    border-left: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-right: 0;
    padding-left: 0;
    padding-bottom: 2rem;
  }
`;

const FooterLinksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  margin-bottom: 1.5rem;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const FooterLogo = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: white;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #cd3efd, #82a1bf);
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const FooterDescription = styled.p`
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  max-width: 400px;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const FooterSlogan = styled.p`
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  max-width: 400px;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  position: relative;
  padding-left: ${props => props.isRTL ? '0' : '12px'};
  padding-right: ${props => props.isRTL ? '12px' : '0'};
  border-left: ${props => props.isRTL ? 'none' : '3px solid #cd3efd'};
  border-right: ${props => props.isRTL ? '3px solid #cd3efd' : 'none'};
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FooterHeading = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
  color: white;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  
  &:after {
    content: '';
    position: absolute;
    ${props => props.isRTL ? 'right: 0;' : 'left: 0;'}
    bottom: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #cd3efd, #82a1bf);
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.7rem;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  
  &:before {
    content: '';
    position: absolute;
    bottom: -2px;
    ${props => props.isRTL ? 'right: 0;' : 'left: 0;'}
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, #cd3efd, #82a1bf);
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: white;
    transform: translateX(${props => props.isRTL ? '-5px' : '5px'});
    
    &:before {
      width: 100%;
    }
  }
`;

const ContactDetail = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.7);
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const ContactIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  margin-right: 0.8rem;
  margin-left: 0.8rem;
  font-size: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  margin-top: 1.5rem;
  justify-content: ${props => props.isRTL ? 'flex-end' : 'flex-start'};
  gap: 1rem;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(205, 62, 253, 0.5) 0%, rgba(130, 161, 191, 0.5) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    
    &:before {
      opacity: 1;
    }
  }
  
  i {
    font-size: 1.2rem;
    position: relative;
    z-index: 2;
  }
`;

const FooterDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 0 auto;
  width: 80%;
`;

const FooterBottom = styled.div`
  padding: 1.5rem 0;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const FooterCopyright = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

export default Footer;
