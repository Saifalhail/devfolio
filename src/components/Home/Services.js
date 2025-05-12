import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { floatAnimation } from './HeroAnimations';

const Services = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const services = [
    {
      id: 1,
      icon: '🌐',
      link: '/services/web-development'
    },
    {
      id: 2,
      icon: '📱',
      link: '/services/mobile-apps'
    },
    {
      id: 3,
      icon: '🤖',
      link: '/services/ai-integrations'
    },
    {
      id: 4,
      icon: '📊',
      link: '/services/admin-dashboards'
    },
    {
      id: 5,
      icon: '📲',
      link: '/services/qr-codes'
    },
    {
      id: 6,
      icon: '💻',
      link: '/services/custom-software'
    }
  ];

  return (
    <ServicesSection>
      <SectionDecor />
      {/* Decorative blobs */}
      <div className="blob" style={{ top: '20%', right: '10%', width: '250px', height: '250px', background: 'linear-gradient(45deg, var(--accent-3), var(--accent-4))', opacity: '0.05' }}></div>
      <div className="blob" style={{ bottom: '10%', left: '5%', width: '300px', height: '300px', background: 'linear-gradient(45deg, var(--accent-1), var(--accent-2))', opacity: '0.05' }}></div>
      
      <Container>
        <SectionHeader>
          <SectionTitle>{t('services.title')}</SectionTitle>
          <SectionSubtitle>{t('services.subtitle')}</SectionSubtitle>
        </SectionHeader>
        
        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              to={service.link} 
              className="service-card" 
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <ServiceIcon>{service.icon}</ServiceIcon>
              <ServiceTitle>{t(`services.items.${index}.title`)}</ServiceTitle>
              <ServiceDescription>{t(`services.items.${index}.description`)}</ServiceDescription>
              <LearnMore className="learn-more" isRTL={isRTL}>{t('services.learnMore')}</LearnMore>
            </ServiceCard>
          ))}
        </ServicesGrid>
        
        <CtaContainer>
          <CtaText>{t('services.cta.question')}</CtaText>
          <CtaButton to="/contact">{t('services.cta.button')}</CtaButton>
        </CtaContainer>
      </Container>
    </ServicesSection>
  );
};

// Animation keyframes for services section

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ServicesSection = styled.section`
  padding: 6rem 0 7rem;
  position: relative;
  background: var(--dark-purple);
  background: linear-gradient(135deg, var(--dark) 0%, var(--darkPurple) 100%);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50px;
    left: -50px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: linear-gradient(45deg, var(--accent-3), var(--accent-4));
    opacity: 0.1;
    filter: blur(50px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -100px;
    right: -100px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: linear-gradient(45deg, #cd3efd, #b429e3);
    opacity: 0.1;
    filter: blur(80px);
  }
`;

const SectionDecor = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background: linear-gradient(to right, var(--accent-1), var(--accent-2));
  clip-path: polygon(0 0, 100% 0, 100% 75%, 0% 100%);
  opacity: 0.05;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(var(--white) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.1;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-2);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 1rem;
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: linear-gradient(120deg, rgba(205, 62, 253, 0.1), rgba(180, 41, 227, 0.1));
  border-radius: 50px;
  animation: ${fadeIn} 0.8s ease-out;
  align-self: center;
  box-shadow: 0 2px 15px rgba(205, 62, 253, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(205, 62, 253, 0.1);
`;

const SectionSubtitle = styled.h3`
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 2.5rem;
  position: relative;
  display: inline-block;
  animation: ${fadeIn} 1s ease-out;
  text-align: center;
  text-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  
  &:after {
    content: '';
    position: absolute;
    width: 100px;
    height: 6px;
    background: linear-gradient(90deg, #cd3efd, #b429e3);
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 4px;
    box-shadow: 0 3px 10px rgba(205, 62, 253, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0 5rem;
  
  & > * {
    animation: ${fadeIn} ease-out forwards;
    opacity: 0;
  }
  
  & > *:nth-child(1) { animation-duration: 0.5s; }
  & > *:nth-child(2) { animation-duration: 0.6s; }
  & > *:nth-child(3) { animation-duration: 0.7s; }
  & > *:nth-child(4) { animation-duration: 0.8s; }
  & > *:nth-child(5) { animation-duration: 0.9s; }
  & > *:nth-child(6) { animation-duration: 1s; }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0 4rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
`;

const ServiceCard = styled(Link)`
  background: var(--card-gradient);
  border-radius: 16px;
  padding: 1.8rem;
  box-shadow: var(--shadows-card);
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
  min-height: 240px;
  direction: ${props => props.dir || 'ltr'};
  text-align: ${props => props.dir === 'rtl' ? 'right' : 'left'};
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(205, 62, 253, 0.08) 0%, transparent 50%);
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
    border-color: rgba(205, 62, 253, 0.2);
    
    &:before {
      opacity: 1;
      transform: scale(1);
    }
    
    .learn-more {
      transform: ${props => props.dir === 'rtl' ? 'translateX(-7px)' : 'translateX(7px)'};
      color: var(--accent-2);
    }
    
    &::after {
      transform: translateY(0);
      opacity: 0.08;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, #cd3efd, #b429e3);
    z-index: -1;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
  }
`;

const ServiceIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1.2rem;
  margin-top: 0.2rem;
  display: flex;
  width: 65px;
  height: 65px;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #cd3efd, #b429e3);
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  z-index: 1;
  animation: ${floatAnimation} 5s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    transition: 0.6s;
  }
  
  ${ServiceCard}:hover &::before {
    transform: translateX(100%);
  }
  
  ${ServiceCard}:hover & {
    transform: scale(1.05);
    box-shadow: 0 10px 25px rgba(205, 62, 253, 0.3);
  }
  
  @media (max-width: 480px) {
    width: 55px;
    height: 55px;
    font-size: 2.2rem;
    margin-bottom: 1rem;
  }
`;

const ServiceTitle = styled.h4`
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: var(--accent-2);
  transition: color 0.3s ease;
  font-family: var(--fonts-display);
  text-shadow: 0 2px 10px rgba(205, 62, 253, 0.2);
  line-height: 1.2;
  
  ${ServiceCard}:hover & {
    background: linear-gradient(to right, #cd3efd, var(--accent-1));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const ServiceDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.2rem;
  flex: 1;
  color: var(--light-gray);
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }
`;

const LearnMore = styled.span`
  font-size: 1rem;
  font-weight: 600;
  align-self: ${props => props.isRTL ? 'flex-end' : 'flex-start'};
  margin-left: ${props => props.isRTL ? 'auto' : '0'};
  margin-right: ${props => props.isRTL ? '0' : 'auto'};
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  color: var(--white);
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  
  &:after {
    content: ${props => props.isRTL ? '\'←\'' : '\'→\''};
    margin-left: ${props => props.isRTL ? '0' : '8px'};
    margin-right: ${props => props.isRTL ? '8px' : '0'};
    transition: transform 0.3s ease;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, #cd3efd, #b429e3);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }
  
  .service-card:hover &:before {
    transform: scaleX(1);
    transform-origin: left;
  }
  
  .service-card:hover &:after {
    transform: translateX(3px);
  }
`;

const CtaContainer = styled.div`
  text-align: center;
  background: linear-gradient(135deg, rgba(58, 30, 101, 0.8), rgba(42, 18, 82, 0.8));
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${floatAnimation} 6s ease-in-out infinite;
  transform-style: preserve-3d;
  perspective: 1000px;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(#cd3efd 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.05;
    pointer-events: none;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(66, 165, 245, 0.05), transparent);
    transform: translateX(-100%);
    transition: 0.6s;
  }
  
  &:hover:after {
    transform: translateX(100%);
  }
`;

const CtaText = styled.p`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  font-family: var(--fonts-display);
`;

const CtaButton = styled(Link)`
  display: inline-block;
  padding: 1.2rem 3rem;
  background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
  background-size: 200% 100%;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 50px;
  transition: all 0.5s ease;
  text-decoration: none;
  position: relative;
  z-index: 1;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, var(--accent-2), var(--accent-1));
    opacity: 0;
    z-index: -1;
    transition: opacity 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    background-position: 100% 0;
    
    &:before {
      opacity: 1;
    }
  }
`;

export default Services;
