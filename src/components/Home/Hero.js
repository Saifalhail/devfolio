import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GlobalAnimations from './HeroAnimations';

// Animation for floating effect
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Animation styles with CSS helper
const floatAnimation = css`
  animation: ${float} 6s ease-in-out infinite;
`;

const floatAnimation4s = css`
  animation: ${float} 4s ease-in-out infinite;
`;

const floatAnimation5s = css`
  animation: ${float} 5s ease-in-out infinite 0.5s;
`;

const floatAnimation6s = css`
  animation: ${float} 6s ease-in-out infinite 1s;
`;

const floatAnimation45s = css`
  animation: ${float} 4.5s ease-in-out infinite 1.5s;
`;

// Styled components
const HeroSection = styled.section`
  padding: 7rem 0 5rem;
  position: relative;
  overflow: hidden;
  background: var(--primary-gradient);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background-image: radial-gradient(var(--accent-1) 1px, transparent 1px);
    background-size: 30px 30px;
    opacity: 0.1;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -100px;
    right: -100px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-3) 0%, var(--accent-4) 100%);
    opacity: 0.15;
    filter: blur(70px);
  }
  
  @media (max-width: 768px) {
    padding: 6rem 0 4rem;
  }
`;

const HeroContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  
  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
    padding: 0 1rem;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 550px;
  margin-${props => props.isRTL ? 'left' : 'right'}: 1.5rem;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  
  @media (max-width: 992px) {
    margin-right: 0;
    margin-left: 0;
    margin-bottom: 2rem;
    text-align: center;
    max-width: 100%;
  }
`;

const HeroHeading = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
  line-height: 1.2;
  background: linear-gradient(to right, var(--accent-2), var(--accent-1));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 5px 25px rgba(66, 165, 245, 0.15);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroHighlight = styled.span`
  background: linear-gradient(to right, var(--accent-3), var(--accent-4));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 8px;
    background: linear-gradient(to right, var(--accent-3), var(--accent-4));
    bottom: 5px;
    left: 0;
    z-index: -1;
    border-radius: 4px;
    opacity: 0.3;
  }
`;

const HeroSubHeading = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  color: var(--light-gray);
  line-height: 1.6;
  max-width: 90%;
  
  @media (max-width: 992px) {
    max-width: 100%;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
  
  @media (max-width: 500px) {
    flex-direction: column;
    width: 100%;
  }
`;

const ButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  @media (max-width: 500px) {
    width: 100%;
  }
`;

const PrimaryButton = styled(Link)`
  ${ButtonStyles}
  background: linear-gradient(135deg, var(--accent-1) 0%, var(--accent-2) 100%);
  color: white;
  box-shadow: var(--shadows-neon);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 25px rgba(66, 165, 245, 0.5);
    
    &::before {
      transform: translateX(100%);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -50%;
    width: 150%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
    z-index: -1;
  }
`;

const SecondaryButton = styled(Link)`
  ${ButtonStyles}
  background-color: transparent;
  color: var(--white);
  border: 2px solid var(--accent-2);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:hover {
    color: var(--white);
    border-color: var(--accent-1);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    
    &::before {
      transform: scaleX(1);
      opacity: 1;
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(66, 165, 245, 0.2), rgba(0, 212, 255, 0.2));
    transform: scaleX(0);
    transform-origin: left;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: -1;
    opacity: 0;
  }
`;

const HeroImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const HeroSVGContainer = styled.div`
  position: relative;
  background: var(--card-gradient);
  border-radius: 24px;
  box-shadow: var(--shadows-card);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transform-style: preserve-3d;
  perspective: 1000px;
  min-width: 400px;
  min-height: 400px;
  max-width: 550px;
  max-height: 550px;
  margin: 0 auto;
  z-index: 2;
  overflow: visible;
  
  svg {
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
  }
  
  .floating-element1 {
    ${floatAnimation4s}
  }
  
  .floating-element2 {
    ${floatAnimation5s}
  }
  
  .floating-element3 {
    ${floatAnimation6s}
  }
  
  .floating-element4 {
    ${floatAnimation45s}
  }
  
  @media (max-width: 992px) {
    min-width: 320px;
    min-height: 320px;
    padding: 1.2rem;
  }
  
  @media (max-width: 768px) {
    min-width: 280px;
    min-height: 280px;
    padding: 1rem;
  }
`;

// Removed HeroImg as we're using SVG illustration

const FloatingBubble = styled.div`
  position: absolute;
  border-radius: 50%;
  z-index: 1;
`;

// Hero component
const Hero = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <HeroSection>
      <GlobalAnimations />
      {/* Decorative blobs for background */}
      <div className="blob" style={{ top: '10%', left: '5%', width: '300px', height: '300px', background: 'linear-gradient(45deg, var(--accent-4), var(--accent-2))', opacity: '0.05' }}></div>
      <div className="blob" style={{ bottom: '15%', right: '10%', width: '250px', height: '250px', background: 'linear-gradient(45deg, var(--accent-3), var(--accent-1))', opacity: '0.05' }}></div>
      
      <HeroContainer isRTL={isRTL}>
        <HeroContent isRTL={isRTL}>
          <div className="bubble" style={{ display: 'inline-block', marginBottom: '1.5rem', transform: 'rotate(-2deg)', fontSize: '1rem' }}>
            👋 {t('hero.welcome')}
          </div>
          <HeroHeading>
            {t('hero.title')} <HeroHighlight>{t('hero.highlight')}</HeroHighlight>
          </HeroHeading>
          <HeroSubHeading>
            {t('hero.subtitle')}
          </HeroSubHeading>
          <HeroButtons>
            <PrimaryButton to="/contact" className="glow">{t('hero.buttons.getStarted')}</PrimaryButton>
            <SecondaryButton to="/portfolio">{t('hero.buttons.viewProjects')}</SecondaryButton>
          </HeroButtons>
        </HeroContent>
        <HeroImageContainer>
          <div className="float-element">
            <HeroSVGContainer>
            <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              {/* Gradients and patterns */}
              <defs>
                <linearGradient id="techGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4A90E2" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#5E35B1" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="techGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FFE66D" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2C3E50" stopOpacity="1" />
                  <stop offset="100%" stopColor="#1A1A2E" stopOpacity="1" />
                </linearGradient>
                <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="none" />
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                </pattern>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Background elements */}
              <rect x="50" y="50" width="700" height="500" rx="20" fill="#f8f9fa" />
              <circle cx="150" cy="150" r="60" fill="url(#techGrad1)" opacity="0.7" />
              <circle cx="650" cy="450" r="80" fill="url(#techGrad2)" opacity="0.5" />
              
              {/* Main laptop illustration */}
              <g transform="translate(400, 300)" filter="url(#glow)">
                {/* Laptop base */}
                <rect x="-150" y="40" width="300" height="20" rx="5" fill="#333" />
                <path d="M -180 40 L -150 40 L -150 -100 L 150 -100 L 150 40 L 180 40 L 150 60 L -150 60 Z" fill="#555" />
                
                {/* Laptop screen */}
                <rect x="-140" y="-95" width="280" height="130" rx="5" fill="url(#screenGrad)" />
                <rect x="-130" y="-85" width="260" height="110" fill="url(#gridPattern)" />
                
                {/* Code elements on screen */}
                <g fill="none" stroke="#61DAFB" strokeWidth="2">
                  <path d="M -110 -65 L -80 -65" />
                  <path d="M -110 -50 L -60 -50" />
                  <path d="M -110 -35 L -90 -35" />
                  <path d="M -70 -35 L -40 -35" />
                </g>
                <g fill="none" stroke="#FF6B6B" strokeWidth="2">
                  <path d="M -20 -65 L 40 -65" />
                  <path d="M -20 -50 L 60 -50" />
                  <path d="M -20 -35 L 20 -35" />
                </g>
                <g fill="none" stroke="#FFE66D" strokeWidth="2">
                  <path d="M 80 -65 L 120 -65" />
                  <path d="M 80 -50 L 110 -50" />
                  <path d="M 80 -35 L 100 -35" />
                </g>
                
                {/* Floating elements */}
                <g transform="translate(-180, -140)">
                  <rect x="0" y="0" width="40" height="40" rx="5" fill="#4A90E2" opacity="0.8" />
                  <path d="M 10 20 L 30 20 M 20 10 L 20 30" stroke="white" strokeWidth="3" />
                </g>
                <g transform="translate(140, -140)">
                  <rect x="0" y="0" width="40" height="40" rx="5" fill="#FF6B6B" opacity="0.8" />
                  <path d="M 10 20 L 30 20" stroke="white" strokeWidth="3" />
                </g>
                <g transform="translate(-180, 20)">
                  <rect x="0" y="0" width="40" height="40" rx="5" fill="#FFE66D" opacity="0.8" />
                  <path d="M 20 10 L 10 30 L 30 30 Z" fill="white" />
                </g>
                <g transform="translate(140, 20)">
                  <rect x="0" y="0" width="40" height="40" rx="5" fill="#5E35B1" opacity="0.8" />
                  <circle cx="20" cy="20" r="10" fill="white" />
                </g>
                
                {/* Animated floating elements */}
                <g className="floating-element1">
                  <circle cx="-220" cy="-80" r="15" fill="#4A90E2" opacity="0.6" />
                  <path d="M -225 -80 L -215 -80 M -220 -85 L -220 -75" stroke="white" strokeWidth="2" />
                </g>
                <g className="floating-element2">
                  <circle cx="220" cy="-60" r="15" fill="#FF6B6B" opacity="0.6" />
                  <path d="M 215 -60 L 225 -60" stroke="white" strokeWidth="2" />
                </g>
                <g className="floating-element3">
                  <circle cx="-220" cy="60" r="15" fill="#FFE66D" opacity="0.6" />
                  <path d="M -225 55 L -215 65 M -215 55 L -225 65" stroke="white" strokeWidth="2" />
                </g>
                <g className="floating-element4">
                  <circle cx="220" cy="80" r="15" fill="#5E35B1" opacity="0.6" />
                  <path d="M 215 75 L 225 85 M 215 85 L 225 75" stroke="white" strokeWidth="2" />
                </g>
                
                {/* Connection lines */}
                <path d="M -180 -100 Q -220 -150 -260 -120" stroke="#4A90E2" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                <path d="M 180 -100 Q 220 -150 260 -120" stroke="#FF6B6B" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                <path d="M -180 40 Q -220 80 -260 60" stroke="#FFE66D" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                <path d="M 180 40 Q 220 80 260 60" stroke="#5E35B1" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              </g>
              
              {/* Abstract code symbols */}
              <g opacity="0.7" transform="translate(100, 400)">
                <text x="0" y="0" fontFamily="monospace" fontSize="14" fill="#333">{`{ code: () => future }`}</text>
              </g>
              <g opacity="0.7" transform="translate(600, 150)">
                <text x="0" y="0" fontFamily="monospace" fontSize="14" fill="#333">{`<Innovation />`}</text>
              </g>
              
              {/* Directional indicators for RTL support */}
              <g opacity="0.5" transform={isRTL ? "translate(700, 300)" : "translate(100, 300)"}>
                <path d={isRTL ? "M 0,0 L -20,10 L 0,20 Z" : "M 0,0 L 20,10 L 0,20 Z"} fill="#333" />
              </g>
            </svg>
            
            {/* Floating bubbles */}
            <FloatingBubble style={{ top: '-30px', left: isRTL ? 'auto' : '-30px', right: isRTL ? '-30px' : 'auto', background: 'var(--accent-2)', opacity: 0.25, width: '60px', height: '60px', filter: 'blur(8px)' }} />
            <FloatingBubble style={{ top: '10%', right: isRTL ? 'auto' : '-35px', left: isRTL ? '-35px' : 'auto', background: 'var(--accent-1)', opacity: 0.15, width: '50px', height: '50px', filter: 'blur(5px)' }} />
            <FloatingBubble style={{ bottom: '-35px', left: isRTL ? 'auto' : '20%', right: isRTL ? '20%' : 'auto', background: 'var(--accent-3)', opacity: 0.18, width: '70px', height: '70px', filter: 'blur(10px)' }} />
            <FloatingBubble style={{ bottom: '-25px', right: isRTL ? 'auto' : '-25px', left: isRTL ? '-25px' : 'auto', background: 'var(--accent-4)', opacity: 0.12, width: '40px', height: '40px', filter: 'blur(6px)' }} />
          </HeroSVGContainer>
          </div>
          
          {/* Cartoon-style floating elements */}
          <div className="bubble" style={{ position: 'absolute', top: '-20px', right: isRTL ? 'auto' : '10%', left: isRTL ? '10%' : 'auto', transform: 'rotate(5deg)', zIndex: 5, padding: '10px 15px', fontSize: '0.9rem' }}>
            ✨ {t('hero.techBubble')}
          </div>
          <img 
            src="https://cdn3d.iconscout.com/3d/premium/thumb/rocket-launch-5349008-4461442.png" 
            alt="Rocket illustration" 
            style={{ 
              position: 'absolute', 
              width: '80px', 
              bottom: '-20px', 
              right: isRTL ? 'auto' : '-25px', 
              left: isRTL ? '-25px' : 'auto',
              transform: 'rotate(15deg)',
              filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))'
            }} 
            className="float-element"
          />
        </HeroImageContainer>
      </HeroContainer>
    </HeroSection>
  );
};

export default Hero;
