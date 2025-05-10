import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { floatAnimation } from './HeroAnimations';

const Services = () => {
  const { t } = useTranslation();
  const services = [
    {
      id: 1,
      title: 'Web Development',
      description: 'Custom websites tailored to your needs with responsive design and modern technologies.',
      icon: '🌐',
      link: '/services/web-development'
    },
    {
      id: 2,
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      icon: '📱',
      link: '/services/mobile-apps'
    },
    {
      id: 3,
      title: 'QR Code Solutions',
      description: 'Custom QR code generation and integration for your business needs.',
      icon: '📲',
      link: '/services/qr-codes'
    },
    {
      id: 4,
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive designs that enhance user experience and engagement.',
      icon: '🎨',
      link: '/services/ui-ux-design'
    },
    {
      id: 5,
      title: 'E-commerce Solutions',
      description: 'Complete online store setup with payment integration and inventory management.',
      icon: '🛒',
      link: '/services/ecommerce'
    },
    {
      id: 6,
      title: 'Custom Software',
      description: 'Tailored software solutions to address your specific business challenges.',
      icon: '💻',
      link: '/services/custom-software'
    }
  ];

  return (
    <ServicesSection>
      <SectionDecor />
      <Container>
        <SectionHeader>
          <SectionTitle>{t('services.title')}</SectionTitle>
          <SectionSubtitle>{t('services.subtitle')}</SectionSubtitle>
        </SectionHeader>
        
        <ServicesGrid>
          {services.map(service => (
            <ServiceCard key={service.id} to={service.link}>
              <ServiceIcon>{service.icon}</ServiceIcon>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
              <LearnMore>Learn more →</LearnMore>
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

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ServicesSection = styled.section`
  padding: 5rem 0 6rem;
  position: relative;
  background: linear-gradient(to bottom, var(--white) 0%, #f8f9fa 100%);
  overflow: hidden;
`;

const SectionDecor = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background-color: var(--primary-bg);
  clip-path: polygon(0 0, 100% 0, 100% 65%, 0% 100%);
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(var(--accent-1) 1px, transparent 1px);
    background-size: 25px 25px;
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
  color: var(--accent-1);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 1rem;
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: linear-gradient(120deg, rgba(250, 170, 147, 0.1), rgba(130, 161, 191, 0.1));
  border-radius: 50px;
  animation: ${fadeIn} 0.8s ease-out;
  align-self: center;
`;

const SectionSubtitle = styled.h3`
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--dark);
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  animation: ${fadeIn} 1s ease-out;
  text-align: center;
  
  &:after {
    content: '';
    position: absolute;
    width: 80px;
    height: 6px;
    background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
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
`;

const ServiceCard = styled(Link)`
  background-color: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  text-decoration: none;
  color: var(--dark);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(0, 0, 0, 0.03);
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, var(--accent-2), var(--accent-1));
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: radial-gradient(var(--dark) 1px, transparent 1px);
    background-size: 15px 15px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-15px) scale(1.03);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
    color: white;
    
    &:before {
      opacity: 1;
      transform: scale(1);
    }
    
    &:after {
      opacity: 0.05;
    }
  }
`;

const ServiceIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.8rem;
  position: relative;
  transition: all 0.5s ease;
  display: inline-block;
  
  &:before {
    content: '';
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--accent-1);
    opacity: 0.1;
    z-index: -1;
    top: -5px;
    left: -5px;
    transition: all 0.5s ease;
  }
  
  ${ServiceCard}:hover & {
    transform: scale(1.1);
    
    &:before {
      width: 60px;
      height: 60px;
      background-color: white;
      opacity: 0.2;
    }
  }
`;

const ServiceTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ServiceDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
`;

const LearnMore = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  align-self: flex-start;
  transition: transform 0.3s ease;
  
  ${ServiceCard}:hover & {
    transform: translateX(5px);
  }
`;

const CtaContainer = styled.div`
  text-align: center;
  position: relative;
  margin-top: 3rem;
  padding: 2.5rem;
  background: linear-gradient(135deg, rgba(130, 161, 191, 0.1), rgba(250, 170, 147, 0.1));
  border-radius: 20px;
  animation: ${fadeIn} 1.2s ease-out;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(var(--accent-2) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.1;
    border-radius: 20px;
  }
`;

const CtaText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--dark);
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
