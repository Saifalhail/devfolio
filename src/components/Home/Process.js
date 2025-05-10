import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { floatAnimation } from './HeroAnimations';

const Process = () => {
  const { t } = useTranslation();
  const steps = [
    {
      id: 1,
      number: '01',
      title: 'Discovery Call',
      description: 'We start with understanding your requirements and project goals.'
    },
    {
      id: 2,
      number: '02',
      title: 'Planning & Design',
      description: 'Creating a detailed plan and mockups for your approval.'
    },
    {
      id: 3,
      number: '03',
      title: 'Development',
      description: 'Transforming designs into functional code and features.'
    },
    {
      id: 4,
      number: '04',
      title: 'Testing & Review',
      description: 'Thorough quality assurance to ensure everything works perfectly.'
    },
    {
      id: 5,
      number: '05',
      title: 'Deployment',
      description: 'Launching your project to the world and ensuring smooth operation.'
    },
    {
      id: 6,
      number: '06',
      title: 'Support & Maintenance',
      description: 'Ongoing assistance and updates to keep your project running smoothly.'
    }
  ];

  return (
    <ProcessSection>
      <Container>
        <SectionHeader>
          <SectionTitle>{t('process.title')}</SectionTitle>
          <SectionSubtitle>{t('process.subtitle')}</SectionSubtitle>
        </SectionHeader>
        
        <ProcessSteps>
          {steps.map(step => (
            <ProcessStep key={step.id}>
              <StepNumber>{step.number}</StepNumber>
              <StepContent>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </StepContent>
            </ProcessStep>
          ))}
        </ProcessSteps>
      </Container>
    </ProcessSection>
  );
};

const ProcessSection = styled.section`
  padding: 7rem 0;
  background-color: var(--primary-bg);
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: linear-gradient(45deg, var(--accent-2), transparent);
    top: -200px;
    right: -200px;
    opacity: 0.1;
    z-index: 0;
  }
  
  &:before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
    background: linear-gradient(45deg, var(--accent-1), transparent);
    bottom: -150px;
    left: -150px;
    opacity: 0.1;
    z-index: 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-1);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 0.8rem;
  display: inline-block;
  padding: 0.4rem 1rem;
  background-color: rgba(250, 170, 147, 0.1);
  border-radius: 20px;
`;

const SectionSubtitle = styled.h3`
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 2rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 80px;
    height: 4px;
    background-color: var(--accent-2);
    left: 50%;
    bottom: -15px;
    transform: translateX(-50%);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const ProcessSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2.5rem;
  margin-top: 4rem;
`;

const ProcessStep = styled.div`
  display: flex;
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, var(--accent-2), var(--accent-1));
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  
  &:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    
    &:before {
      opacity: 0.07;
      transform: scale(1);
    }
  }
`;

const StepNumber = styled.div`
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-2), rgba(130, 161, 191, 0.8));
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(45deg);
    top: -80%;
    left: -170%;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  
  ${ProcessStep}:hover &:after {
    left: 0;
    top: 0;
    animation: shine 1.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  
  @keyframes shine {
    0% { left: -170%; top: -80%; }
    100% { left: 100%; top: 100%; }
  }
`;

const StepContent = styled.div`
  padding: 1.5rem;
  flex: 1;
`;

const StepTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: var(--dark);
  position: relative;
  padding-bottom: 0.8rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: var(--accent-1);
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  
  ${ProcessStep}:hover &:after {
    width: 60px;
  }
`;

const StepDescription = styled.p`
  font-size: 0.95rem;
  color: var(--dark-gray);
  line-height: 1.7;
  
  ${ProcessStep}:hover & {
    color: var(--dark);
  }
`;

export default Process;
