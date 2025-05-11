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
      {/* Decorative blobs */}
      <div className="blob" style={{ top: '20%', right: '10%', width: '250px', height: '250px', background: 'linear-gradient(45deg, var(--accent-3), var(--accent-4))', opacity: '0.05' }}></div>
      <div className="blob" style={{ bottom: '10%', left: '5%', width: '300px', height: '300px', background: 'linear-gradient(45deg, var(--accent-1), var(--accent-2))', opacity: '0.05' }}></div>
      
      <Container>
        <SectionHeader>
          <SectionTitle>{t('services.title')}</SectionTitle>
          <SectionSubtitle>{t('services.subtitle')}</SectionSubtitle>
        </SectionHeader>
        
        <ServicesGrid>
          {services.map(service => (
            <ServiceCard key={service.id} to={service.link} className="service-card">
              <ServiceIcon>{service.icon}</ServiceIcon>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
              <LearnMore className="learn-more">Learn more</LearnMore>
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
    background: linear-gradient(45deg, var(--accent-1), var(--accent-2));
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
  background: linear-gradient(120deg, rgba(66, 165, 245, 0.1), rgba(0, 212, 255, 0.1));
  border-radius: 50px;
  animation: ${fadeIn} 0.8s ease-out;
  align-self: center;
  box-shadow: 0 2px 15px rgba(66, 165, 245, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(66, 165, 245, 0.1);
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
    background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 4px;
    box-shadow: 0 3px 10px rgba(66, 165, 245, 0.3);
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
  background: var(--card-gradient);
  border-radius: 20px;
  padding: 2.2rem;
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
  
  &:hover {
    transform: translateY(-15px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(66, 165, 245, 0.2);
    
    .learn-more {
      transform: translateX(7px);
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
    background: linear-gradient(120deg, var(--accent-1), var(--accent-2));
    z-index: -1;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
  }
`;

const ServiceIcon = styled.div`
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
  display: flex;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
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
`;

const ServiceTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  color: var(--accent-2);
  transition: color 0.3s ease;
  font-family: var(--fonts-display);
  text-shadow: 0 2px 10px rgba(0, 212, 255, 0.2);
`;

const ServiceDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
`;

const LearnMore = styled.span`
  font-size: 1rem;
  font-weight: 600;
  align-self: flex-start;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  color: var(--white);
  position: relative;
  display: flex;
  align-items: center;
  
  &:after {
    content: '→';
    margin-left: 8px;
    transition: transform 0.3s ease;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, var(--accent-1), var(--accent-2));
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
    background-image: radial-gradient(var(--accent-2) 1px, transparent 1px);
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
