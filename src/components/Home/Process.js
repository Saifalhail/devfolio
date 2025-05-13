import React, { useRef } from 'react';
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
  
  // Process steps with icons and additional details
  const steps = [
    {
      id: 1,
      number: '01',
      title: t('process.steps.0.title'),
      description: t('process.steps.0.description'),
      icon: '📝',
      color: 'linear-gradient(135deg, #4A90E2, #5E35B1)',
      bgPattern: 'linear-gradient(to right, rgba(74, 144, 226, 0.05), rgba(94, 53, 177, 0.05)), radial-gradient(circle at 10% 20%, rgba(74, 144, 226, 0.1) 0%, transparent 50%), repeating-linear-gradient(45deg, rgba(74, 144, 226, 0.01) 0px, rgba(74, 144, 226, 0.01) 1px, transparent 1px, transparent 10px)'
    },
    {
      id: 2,
      number: '02',
      title: t('process.steps.1.title'),
      description: t('process.steps.1.description'),
      icon: '📊',
      color: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
      bgPattern: 'linear-gradient(to right, rgba(255, 107, 107, 0.05), rgba(255, 142, 83, 0.05)), radial-gradient(circle at 90% 10%, rgba(255, 107, 107, 0.1) 0%, transparent 50%), repeating-linear-gradient(-45deg, rgba(255, 107, 107, 0.01) 0px, rgba(255, 107, 107, 0.01) 1px, transparent 1px, transparent 10px)'
    },
    {
      id: 3,
      number: '03',
      title: t('process.steps.2.title'),
      description: t('process.steps.2.description'),
      icon: '🎨',
      color: 'linear-gradient(135deg, #56CCF2, #2F80ED)',
      bgPattern: 'linear-gradient(to right, rgba(86, 204, 242, 0.05), rgba(47, 128, 237, 0.05)), radial-gradient(circle at 20% 80%, rgba(86, 204, 242, 0.1) 0%, transparent 50%), repeating-linear-gradient(90deg, rgba(86, 204, 242, 0.01) 0px, rgba(86, 204, 242, 0.01) 1px, transparent 1px, transparent 10px)'
    },
    {
      id: 4,
      number: '04',
      title: t('process.steps.3.title'),
      description: t('process.steps.3.description'),
      icon: '💻',
      color: 'linear-gradient(135deg, #6FCF97, #219653)',
      bgPattern: 'linear-gradient(to right, rgba(111, 207, 151, 0.05), rgba(33, 150, 83, 0.05)), radial-gradient(circle at 80% 90%, rgba(111, 207, 151, 0.1) 0%, transparent 50%), repeating-linear-gradient(0deg, rgba(111, 207, 151, 0.01) 0px, rgba(111, 207, 151, 0.01) 1px, transparent 1px, transparent 10px)'
    },
    {
      id: 5,
      number: '05',
      title: t('process.steps.4.title'),
      description: t('process.steps.4.description'),
      icon: '🚀',
      color: 'linear-gradient(135deg, #BB6BD9, #8B5CF6)',
      bgPattern: 'linear-gradient(to right, rgba(187, 107, 217, 0.05), rgba(139, 92, 246, 0.05)), radial-gradient(circle at 10% 50%, rgba(187, 107, 217, 0.1) 0%, transparent 50%), repeating-linear-gradient(135deg, rgba(187, 107, 217, 0.01) 0px, rgba(187, 107, 217, 0.01) 1px, transparent 1px, transparent 10px)'
    },
    {
      id: 6,
      number: '06',
      title: t('process.steps.5.title'),
      description: t('process.steps.5.description'),
      icon: '🔧',
      color: 'linear-gradient(135deg, #F2994A, #F2C94C)',
      bgPattern: 'linear-gradient(to right, rgba(242, 153, 74, 0.05), rgba(242, 201, 76, 0.05)), radial-gradient(circle at 70% 30%, rgba(242, 153, 74, 0.1) 0%, transparent 50%), repeating-linear-gradient(60deg, rgba(242, 153, 74, 0.01) 0px, rgba(242, 153, 74, 0.01) 1px, transparent 1px, transparent 10px)'
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
          <TwoWeeksStamp>
            <StampText>{t('process.twoWeeks')}</StampText>
          </TwoWeeksStamp>
        </SectionHeader>
        
        <motion.div
          ref={sectionRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <ProcessSteps>
            {steps.map((step) => (
              <motion.div key={step.id} variants={itemVariants}>
                <ProcessStep bgPattern={step.bgPattern}>
                  <StepIconContainer style={{ background: step.color }}>
                    <IconGlow style={{ background: step.color }} />
                    <StepNumber>{step.number}</StepNumber>
                    <StepIcon>{step.icon}</StepIcon>
                  </StepIconContainer>
                  
                  <StepContent>
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </StepContent>
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

const rotate = keyframes`
  0% { transform: rotate(-12deg); }
  50% { transform: rotate(-8deg); }
  100% { transform: rotate(-12deg); }
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
  justify-content: center;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProcessStep = styled.div`
  position: relative;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  box-shadow: var(--shadows-card);
  overflow: hidden;
  isolation: isolate;
  height: 100%;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.bgPattern || 'none'};
    opacity: 0.5;
    z-index: -1;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: ${props => props.color || 'linear-gradient(135deg, rgba(205, 62, 253, 0.2), rgba(205, 62, 253, 0.05))'};
    opacity: 0.1;
    z-index: -1;
    border-radius: 16px 16px 0 0;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
    border-color: rgba(255, 255, 255, 0.2);
    
    &:after {
      opacity: 0.15;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    max-width: 100%;
    min-height: 220px;
  }
`;

const StepIconContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  background: ${props => props.color || 'linear-gradient(135deg, #4A90E2, #5E35B1)'};
  transition: all 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: ${props => props.color || 'linear-gradient(135deg, #4A90E2, #5E35B1)'};
    opacity: 0.3;
    z-index: -1;
    transition: all 0.3s ease;
  }
  
  ${ProcessStep}:hover & {
    transform: scale(1.05);
    
    &:before {
      inset: -5px;
      opacity: 0.4;
    }
  }
`;

const StepNumber = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: white;
  color: #333;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const StepIcon = styled.div`
  font-size: 1.8rem;
  color: white;
  margin-top: 0.2rem;
  animation: ${pulse} 3s infinite ease-in-out;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  
  ${ProcessStep}:hover & {
    animation: ${pulse} 1.5s infinite ease-in-out;
  }
`;

const StepContent = styled.div`
  text-align: center;
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StepTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-title);
  font-family: var(--fonts-display);
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: ${props => props.color || 'linear-gradient(90deg, var(--accent-3), var(--accent-4))'};
    transition: width 0.3s ease;
    border-radius: 2px;
  }
  
  ${ProcessStep}:hover & {
    transform: translateY(-2px);
    
    &:after {
      width: 40px;
    }
  }
`;

const StepDescription = styled.p`
  font-size: 0.95rem;
  color: var(--light-gray, #d1d1e1);
  line-height: 1.5;
  margin-top: 0.75rem;
  /* Ensuring text fits nicely in the box */
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 5rem;
  transition: color 0.3s ease;
  
  ${ProcessStep}:hover & {
    color: var(--text-primary);
  }
`;

const IconGlow = styled.div`
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  opacity: 0.3;
  z-index: -1;
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

// Two Weeks Stamp styling

const TwoWeeksStamp = styled.div`
  position: absolute;
  top: -25px;
  right: 30px;
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  color: white;
  padding: 12px 22px;
  border-radius: 12px;
  transform: rotate(-12deg);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  z-index: 10;
  animation: ${rotate} 6s ease-in-out infinite;
  border: 2px dashed rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  
  &:before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border: 2px solid rgba(255, 107, 107, 0.4);
    border-radius: 14px;
    z-index: -1;
  }
  
  &:after {
    content: '⚡';
    position: absolute;
    top: -10px;
    left: -10px;
    font-size: 1.2rem;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    animation: ${pulse} 2s infinite ease-in-out;
  }
  
  @media (max-width: 768px) {
    position: relative;
    top: 0;
    right: 0;
    margin: 20px auto 0;
    transform: rotate(-5deg);
    display: inline-block;
  }
`;

const StampText = styled.span`
  font-weight: 800;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  white-space: nowrap;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  position: relative;
  display: inline-block;
  
  &:before {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 2px;
  }
`;

export default Process;
