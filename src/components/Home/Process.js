import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { floatAnimation } from './HeroAnimations';

// Section decorative element
const SectionDecor = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
  opacity: 0.5;
`;

// Detail list and item components
const DetailsList = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
  }
`;

const Process = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const sectionRef = useRef(null);
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  // Animation variants for detail items
  const detailVariants = {
    hidden: { opacity: 0, x: isRTL ? 20 : -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.175, 0.885, 0.32, 1.275] // Elastic ease for more dynamic animation
      }
    }
  };

  // Process steps with icons and additional details
  const steps = [
    {
      id: 1,
      number: '01',
      title: t('process.steps.0.title'),
      description: t('process.steps.0.description'),
      icon: '🔍',
      color: 'linear-gradient(135deg, #4A90E2, #5E35B1)',
      details: [
        { icon: '🗓️', text: t('process.steps.0.details.0', 'Initial 30-minute consultation') },
        { icon: '🎯', text: t('process.steps.0.details.1', 'Define project scope and goals') },
        { icon: '💬', text: t('process.steps.0.details.2', 'Discuss timeline and budget') }
      ],
      bgPattern: 'linear-gradient(to right, rgba(74, 144, 226, 0.05), rgba(94, 53, 177, 0.05)), radial-gradient(circle at 10% 20%, rgba(74, 144, 226, 0.1) 0%, transparent 50%), repeating-linear-gradient(45deg, rgba(74, 144, 226, 0.01) 0px, rgba(74, 144, 226, 0.01) 1px, transparent 1px, transparent 10px)'
    },
    {
      id: 2,
      number: '02',
      title: t('process.steps.1.title'),
      description: t('process.steps.1.description'),
      icon: '✏️',
      color: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
      details: [
        { icon: '📋', text: t('process.steps.1.details.0', 'Create detailed project roadmap') },
        { icon: '🎨', text: t('process.steps.1.details.1', 'Design UI/UX wireframes') },
        { icon: '✅', text: t('process.steps.1.details.2', 'Get your approval on designs') }
      ],
      bgPattern: 'linear-gradient(to right, rgba(255, 107, 107, 0.05), rgba(255, 142, 83, 0.05)), radial-gradient(circle at 90% 10%, rgba(255, 107, 107, 0.1) 0%, transparent 50%), repeating-linear-gradient(-45deg, rgba(255, 107, 107, 0.01) 0px, rgba(255, 107, 107, 0.01) 1px, transparent 1px, transparent 10px)'
    },
    {
      id: 3,
      number: '03',
      title: t('process.steps.2.title'),
      description: t('process.steps.2.description'),
      icon: '💻',
      color: 'linear-gradient(135deg, #56CCF2, #2F80ED)',
      details: [
        { icon: '⚙️', text: t('process.steps.2.details.0', 'Set up development environment') },
        { icon: '📱', text: t('process.steps.2.details.1', 'Build responsive frontend') },
        { icon: '🔄', text: t('process.steps.2.details.2', 'Implement backend functionality') }
      ],
      bgPattern: 'linear-gradient(to right, rgba(86, 204, 242, 0.05), rgba(47, 128, 237, 0.05)), radial-gradient(circle at 20% 80%, rgba(86, 204, 242, 0.1) 0%, transparent 50%), repeating-linear-gradient(90deg, rgba(86, 204, 242, 0.01) 0px, rgba(86, 204, 242, 0.01) 1px, transparent 1px, transparent 10px)'
    },
    {
      id: 4,
      number: '04',
      title: t('process.steps.3.title'),
      description: t('process.steps.3.description'),
      icon: '🧪',
      color: 'linear-gradient(135deg, #6FCF97, #219653)',
      details: [
        { icon: '🔍', text: t('process.steps.3.details.0', 'Perform cross-browser testing') },
        { icon: '📊', text: t('process.steps.3.details.1', 'Optimize performance') },
        { icon: '🔒', text: t('process.steps.3.details.2', 'Security and vulnerability checks') }
      ],
      bgPattern: 'linear-gradient(to right, rgba(111, 207, 151, 0.05), rgba(33, 150, 83, 0.05)), radial-gradient(circle at 80% 90%, rgba(111, 207, 151, 0.1) 0%, transparent 50%), repeating-linear-gradient(0deg, rgba(111, 207, 151, 0.01) 0px, rgba(111, 207, 151, 0.01) 1px, transparent 1px, transparent 10px)'
    },
    {
      id: 5,
      number: '05',
      title: t('process.steps.4.title'),
      description: t('process.steps.4.description'),
      icon: '🚀',
      color: 'linear-gradient(135deg, #BB6BD9, #8B5CF6)',
      details: [
        { icon: '🌐', text: t('process.steps.4.details.0', 'Domain and hosting setup') },
        { icon: '📈', text: t('process.steps.4.details.1', 'Analytics integration') },
        { icon: '🔄', text: t('process.steps.4.details.2', 'Final deployment checks') }
      ],
      bgPattern: 'linear-gradient(to right, rgba(187, 107, 217, 0.05), rgba(139, 92, 246, 0.05)), radial-gradient(circle at 10% 50%, rgba(187, 107, 217, 0.1) 0%, transparent 50%), repeating-linear-gradient(135deg, rgba(187, 107, 217, 0.01) 0px, rgba(187, 107, 217, 0.01) 1px, transparent 1px, transparent 10px)'
    },
    {
      id: 6,
      number: '06',
      title: t('process.steps.5.title'),
      description: t('process.steps.5.description'),
      icon: '🛠️',
      color: 'linear-gradient(135deg, #F2994A, #F2C94C)',
      details: [
        { icon: '📞', text: t('process.steps.5.details.0', 'Ongoing technical support') },
        { icon: '🔄', text: t('process.steps.5.details.1', 'Regular updates and improvements') },
        { icon: '📊', text: t('process.steps.5.details.2', 'Performance monitoring') }
      ],
      bgPattern: 'linear-gradient(to right, rgba(242, 153, 74, 0.05), rgba(242, 201, 76, 0.05)), radial-gradient(circle at 70% 30%, rgba(242, 153, 74, 0.1) 0%, transparent 50%), repeating-linear-gradient(-135deg, rgba(242, 153, 74, 0.01) 0px, rgba(242, 153, 74, 0.01) 1px, transparent 1px, transparent 10px)'
    }
  ];

  return (
    <ProcessSection>
      <SectionDecor />
      {/* Decorative elements */}
      <DecorCircle className="circle1" />
      <DecorCircle className="circle2" />
      <DecorSquare className="square1" />
      <DecorSquare className="square2" />
      <DecorDot className="dot1" />
      <DecorDot className="dot2" />
      <DecorDot className="dot3" />
      
      <Container style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <SectionHeader>
          <SectionTitleWrapper>
            <SectionTitle>{t('process.title')}</SectionTitle>
          </SectionTitleWrapper>
          <SectionSubtitle>{t('process.subtitle')}</SectionSubtitle>
        </SectionHeader>
        
        <motion.div
          ref={sectionRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <ProcessSteps>
            {steps.map((step, index) => (
              <motion.div key={step.id} variants={itemVariants}>
                <ProcessStep style={{ 
                  flexDirection: 'row', // Always keep the same direction
                  display: 'flex',
                  alignItems: 'flex-start',
                  position: 'relative',
                  zIndex: 2,
                  marginBottom: '2rem'
                }}>
                  <StepIconContainer 
                    style={{ 
                      background: step.color,
                      marginRight: '2rem', // Always keep the same margin
                      marginLeft: '0',
                      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      zIndex: 5, // Increased z-index to ensure it's above the connector
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Add glow effect around icon */}
                    <div style={{
                      position: 'absolute',
                      top: '-5px',
                      left: '-5px',
                      right: '-5px',
                      bottom: '-5px',
                      background: step.color,
                      opacity: 0.3,
                      borderRadius: '50%',
                      zIndex: -1
                    }}></div>
                    <StepNumber style={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.7)',
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      right: '0',
                      textAlign: 'center',
                      transform: 'translateY(-50%)'
                    }}>{step.number}</StepNumber>
                    <StepIcon style={{
                      fontSize: '2rem',
                      color: 'white',
                      marginTop: '0.5rem'
                    }} className="pulse-animation">{step.icon}</StepIcon>
                  </StepIconContainer>
                  
                  <StepContent 
                    style={{ 
                      textAlign: isRTL ? 'right' : 'left', // Keep text alignment based on language
                      backgroundImage: step.bgPattern,
                      transformOrigin: 'left center', // Keep consistent origin
                      flex: 1
                    }}
                  >
                    <StepTitle style={{ 
                      background: step.color,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'white' // Fallback
                    }}>{step.title}</StepTitle>
                    <StepDescription style={{ color: 'white' }}>{step.description}</StepDescription>
                    
                    <DetailsList>
                      {step.details.map((detail, i) => (
                        <motion.div 
                          key={i}
                          variants={detailVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          custom={i}
                        >
                          <DetailItem>
                            <DetailIcon style={{ background: step.color }}>{detail.icon}</DetailIcon>
                            <DetailText style={{ color: 'white' }}>{detail.text}</DetailText>
                          </DetailItem>
                        </motion.div>
                      ))}
                    </DetailsList>
                    
                    <StepProgressBar style={{ background: step.color }} />
                  </StepContent>
                  {index !== steps.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '60px',
                      [isRTL ? 'right' : 'left']: '40px', // Move to right side in Arabic mode
                      width: '2px',
                      height: 'calc(100% + 2rem)',
                      background: 'linear-gradient(to bottom, rgba(205, 62, 253, 0.3), rgba(205, 62, 253, 0.1))',
                      zIndex: 1
                    }} />
                  )}
                </ProcessStep>
              </motion.div>
            ))}
          </ProcessSteps>
        </motion.div>
      </Container>
    </ProcessSection>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Decorative elements
const DecorCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  opacity: 0.1;
  
  &.circle1 {
    width: 300px;
    height: 300px;
    background: linear-gradient(45deg, #cd3efd, var(--accent-4));
    top: -100px;
    right: -100px;
    animation: ${float} 15s infinite ease-in-out;
  }
  
  &.circle2 {
    width: 200px;
    height: 200px;
    background: linear-gradient(45deg, #cd3efd, var(--accent-3));
    bottom: -50px;
    left: -50px;
    animation: ${float} 12s infinite ease-in-out 1s;
  }
`;

const DecorSquare = styled.div`
  position: absolute;
  z-index: 0;
  opacity: 0.05;
  transform: rotate(45deg);
  
  &.square1 {
    width: 100px;
    height: 100px;
    background: #cd3efd;
    top: 20%;
    left: 10%;
    animation: ${float} 10s infinite ease-in-out 0.5s;
  }
  
  &.square2 {
    width: 70px;
    height: 70px;
    background: var(--accent-3);
    bottom: 15%;
    right: 15%;
    animation: ${float} 8s infinite ease-in-out 1.5s;
  }
`;

const DecorDot = styled.div`
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  
  &.dot1 {
    width: 20px;
    height: 20px;
    background: #cd3efd;
    opacity: 0.2;
    top: 30%;
    right: 20%;
    animation: ${pulse} 4s infinite ease-in-out;
  }
  
  &.dot2 {
    width: 15px;
    height: 15px;
    background: var(--accent-4);
    opacity: 0.15;
    bottom: 25%;
    left: 15%;
    animation: ${pulse} 3s infinite ease-in-out 1s;
  }
  
  &.dot3 {
    width: 10px;
    height: 10px;
    background: #cd3efd;
    opacity: 0.2;
    top: 60%;
    left: 30%;
    animation: ${pulse} 5s infinite ease-in-out 0.5s;
  }
`;

const ProcessSection = styled.section`
  padding: 7rem 0;
  background-color: var(--primary-bg);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 5rem 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
`;

const SectionTitleWrapper = styled.div`
  display: inline-block;
  margin-bottom: 1rem;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 8px;
    bottom: 0;
    left: 0;
    background: linear-gradient(90deg, var(--accent-3), var(--accent-4));
    opacity: 0.2;
    border-radius: 4px;
    transform: translateY(10px);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #cd3efd;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 0.5rem;
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(205, 62, 253, 0.1);
  border-radius: 30px;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(205, 62, 253, 0.2), rgba(205, 62, 253, 0));
    background-size: 200% 100%;
    border-radius: 30px;
    animation: ${shimmer} 3s infinite linear;
    z-index: -1;
  }
`;

const SectionSubtitle = styled.h3`
  font-size: 2.8rem;
  font-weight: 700;
  background: linear-gradient(to right, #cd3efd, #b429e3);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const ProcessSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
  position: relative;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const ProcessStep = styled.div`
  display: flex;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  align-items: flex-start;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: ${props => props.isRTL ? 'flex-end' : 'flex-start'};
  }
`;

const StepConnector = styled.div`
  position: absolute;
  top: 60px;
  ${props => props.isRTL ? 'right: 40px;' : 'left: 40px;'}
  width: 2px;
  height: calc(100% + 2rem);
  background: linear-gradient(to bottom, rgba(66, 165, 245, 0.3), rgba(66, 165, 245, 0.1));
  z-index: 1;
  
  @media (max-width: 768px) {
    ${props => props.isRTL ? 'right: 40px;' : 'left: 40px;'}
    height: 50px;
  }
`;

const StepIconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.bgColor || 'linear-gradient(135deg, var(--accent-2), var(--accent-1))'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-${props => props.isRTL ? 'left' : 'right'}: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  z-index: 2;
  transition: all 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: ${props => props.bgColor || 'linear-gradient(135deg, var(--accent-2), var(--accent-1))'};
    opacity: 0.3;
    border-radius: 50%;
    z-index: -1;
    transition: all 0.3s ease;
  }
  
  &:hover {
    transform: scale(1.05);
    
    &:before {
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      opacity: 0.4;
    }
  }
  
  @media (max-width: 768px) {
    margin: 0 0 1.5rem 0;
  }
`;

const StepNumber = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  transform: translateY(-50%);
`;

const StepIcon = styled.div`
  font-size: 2rem;
  color: white;
  margin-top: 0.5rem;
  animation: ${pulse} 3s infinite ease-in-out;
`;

const StepContent = styled.div`
  flex: 1;
  background: var(--primary-bg-dark, #1a1a2e);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  position: relative;
  z-index: 2;
  overflow: hidden;
  background-image: ${props => props.bgPattern || 'none'};
  background-size: cover;
  background-position: center;
  border-top: 4px solid transparent;
  background-clip: padding-box;
  color: var(--text-primary, #f8f9fa);
  transform-origin: ${props => props.isRTL ? 'right' : 'left'} center;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || 'linear-gradient(90deg, var(--accent-1), var(--accent-2))'};
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
    transform: translateY(-5px) scale(1.03);
    
    &:before {
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StepTitle = styled.h4`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: ${props => props.color || 'linear-gradient(to right, var(--accent-1), var(--accent-2))'};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 3px;
    background: ${props => props.color || 'linear-gradient(to right, var(--accent-1), var(--accent-2))'};
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  
  ${StepContent}:hover &:after {
    width: 100%;
  }
`;

const StepDescription = styled.p`
  font-size: 1rem;
  color: var(--light-gray, #d1d1e1);
  line-height: 1.7;
  margin-top: 1rem;
  
  ${StepContent}:hover & {
    color: var(--text-primary, #f8f9fa);
  }
`;

// New styled components for enhanced process step boxes
const IconGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: ${props => props.bgColor || 'linear-gradient(135deg, var(--accent-2), var(--accent-1))'};
  filter: blur(15px);
  opacity: 0.3;
  z-index: -1;
  transform: scale(0.7);
  transition: all 0.3s ease;
  
  ${StepIconContainer}:hover & {
    transform: scale(1.1);
    opacity: 0.4;
  }
`;

const StepDetailsList = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const StepDetailItem = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  gap: 0.8rem;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(${props => props.isRTL ? '-5px' : '5px'});
  }
`;

const DetailIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.bgColor || 'linear-gradient(135deg, var(--accent-2), var(--accent-1))'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.2);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${StepDetailItem}:hover &:after {
    opacity: 1;
  }
`;

const DetailText = styled.span`
  font-size: 0.95rem;
  color: var(--light-gray, #d1d1e1);
  transition: color 0.3s ease;
  
  ${StepDetailItem}:hover & {
    color: var(--text-primary, #f8f9fa);
  }
`;

const StepProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  width: 0;
  background: ${props => props.bgColor || 'linear-gradient(90deg, var(--accent-1), var(--accent-2))'};
  transition: width 0.5s ease;
  
  ${StepContent}:hover & {
    width: 100%;
  }
`;

export default Process;
