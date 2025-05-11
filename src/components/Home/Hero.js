import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GlobalAnimations from './HeroAnimations';
import logoImage from '../../assets/logo_cropped.png';

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
// Animation for floating icons
const iconFloat = keyframes`
  0% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-10px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0); }
`;

const iconPulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const glowEffect = keyframes`
  0% { box-shadow: 0 0 10px rgba(66, 165, 245, 0.3); }
  50% { box-shadow: 0 0 20px rgba(66, 165, 245, 0.6); }
  100% { box-shadow: 0 0 10px rgba(66, 165, 245, 0.3); }
`;

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
    padding: 4rem 0 3rem; /* Reduced top padding for mobile */
  }
`;

const HeroContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
    padding: 0 1rem;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 550px;
  margin: 0 1rem;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  position: relative;
  z-index: 5;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(20, 20, 35, 0.3);
  backdrop-filter: blur(5px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  order: ${props => props.isRTL ? 1 : -1};
  
  @media (max-width: 992px) {
    margin-right: 0;
    margin-left: 0;
    margin-bottom: 2rem;
    text-align: center;
    max-width: 100%;
    order: 1;
  }
`;

const HeroHeading = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
  position: relative;
  z-index: 10;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to right, #cd3efd, var(--accent-1));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 5px 25px rgba(205, 62, 253, 0.25);
  
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
  margin-bottom: 0.5rem;
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
  justify-content: ${props => props.isRTL ? 'flex-start' : 'flex-start'};
  margin-top: 1.5rem;
  
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
  background: linear-gradient(135deg, #cd3efd 0%, #b429e3 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(205, 62, 253, 0.3);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #b429e3 0%, #9b00d3 100%);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(205, 62, 253, 0.4);
    
    &:before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(205, 62, 253, 0.3);
  }
  
  svg {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
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
  order: ${props => props.isRTL ? -1 : 1};
  z-index: 4;
  
  @media (max-width: 992px) {
    width: 100%;
    max-width: 450px;
    margin-left: 0;
    margin-right: 0;
    order: 2;
  }
`;

const LogoContainer = styled.div`
  width: 100%;
  min-width: 400px;
  min-height: 400px;
  position: relative;
  padding: 1.5rem;
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15));
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    ${floatAnimation4s}
    max-width: 80%;
    max-height: 80%;
    z-index: 2;
  }
  
  /* Add a subtle glow effect */
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    background: radial-gradient(circle, rgba(205, 62, 253, 0.3) 0%, transparent 70%);
    filter: blur(30px);
    z-index: -1;
    pointer-events: none;
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

// Styled components for floating icons
const FloatingIcon = styled.div`
  position: absolute;
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  z-index: 1;
  animation: ${floatAnimation} ${props => props.duration || '6s'} infinite ease-in-out ${props => props.animationDelay || '0s'};
`;

const PulsingIcon = styled.div`
  position: absolute;
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  z-index: 1;
  animation: ${iconPulse} 4s infinite ease-in-out;
`;

const GlowingBadge = styled.div`
  position: absolute;
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  z-index: 1;
  animation: ${glowEffect} 3s infinite ease-in-out;
`;

const IconBox = styled.div`
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
  background: ${props => props.background || 'rgba(66, 165, 245, 0.2)'};
  border-radius: ${props => props.borderRadius || '12px'};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  backdrop-filter: blur(5px);
  transform: ${props => props.transform || 'none'};
`;

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
      {/* Decorative blobs for background - with RTL support */}
      <div className="blob" style={{ top: '10%', left: isRTL ? 'auto' : '5%', right: isRTL ? '5%' : 'auto', width: '300px', height: '300px', background: 'linear-gradient(45deg, var(--accent-4), var(--accent-2))', opacity: '0.05' }}></div>
      <div className="blob" style={{ bottom: '15%', right: isRTL ? 'auto' : '10%', left: isRTL ? '10%' : 'auto', width: '250px', height: '250px', background: 'linear-gradient(45deg, var(--accent-3), var(--accent-1))', opacity: '0.05' }}></div>
      
      {/* Additional decorative elements that won't interfere with text - with RTL support */}
      <div style={{ position: 'absolute', top: '5%', right: isRTL ? 'auto' : '5%', left: isRTL ? '5%' : 'auto', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(66, 165, 245, 0.05) 0%, rgba(66, 165, 245, 0) 70%)', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '5%', left: isRTL ? 'auto' : '5%', right: isRTL ? '5%' : 'auto', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(255, 64, 129, 0.05) 0%, rgba(255, 64, 129, 0) 70%)', borderRadius: '50%' }}></div>

      {/* Floating decorative elements positioned to not interfere with text */}
      <FloatingIcon top="65%" left={isRTL ? "auto" : "8%"} right={isRTL ? "8%" : "auto"} animationDelay="0s" duration="6s">
        <IconBox background="rgba(66, 165, 245, 0.2)" borderRadius="12px">
          <span style={{ fontSize: '24px' }}>💻</span>
        </IconBox>
      </FloatingIcon>
      
      <FloatingIcon top="40%" left={isRTL ? "10%" : "auto"} right={isRTL ? "auto" : "10%"} animationDelay="1s" duration="7s">
        <IconBox background="rgba(255, 91, 146, 0.2)" borderRadius="50%" size="45px">
          <span style={{ fontSize: '22px' }}>🚀</span>
        </IconBox>
      </FloatingIcon>
      
      <FloatingIcon bottom="25%" left={isRTL ? "auto" : "20%"} right={isRTL ? "20%" : "auto"} animationDelay="0.5s" duration="5s">
        <IconBox background="rgba(0, 229, 189, 0.2)" borderRadius="10px" size="40px" transform="rotate(45deg)">
          <span style={{ fontSize: '20px', transform: 'rotate(-45deg)' }}>⚡</span>
        </IconBox>
      </FloatingIcon>
      
      <PulsingIcon bottom="15%" left={isRTL ? "15%" : "auto"} right={isRTL ? "auto" : "15%"}>
        <IconBox background="rgba(0, 212, 255, 0.15)" borderRadius="15px" size="60px">
          <span style={{ fontSize: '30px' }}>✨</span>
        </IconBox>
      </PulsingIcon>
      
      {/* Percentage badge positioned away from text - only visible in English */}
      {!isRTL && (
        <GlowingBadge top="75%" left="5%" right="auto">
          <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #FF6B6B, #FF4081)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(255, 91, 146, 0.3)' }}>
            <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>100%</span>
          </div>
        </GlowingBadge>
      )}

      <HeroContainer isRTL={isRTL}>
        <HeroContent isRTL={isRTL}>
          <div className="bubble" style={{ display: 'inline-block', marginBottom: '1rem', transform: isRTL ? 'rotate(2deg)' : 'rotate(-2deg)', fontSize: '1rem', textAlign: isRTL ? 'right' : 'left' }}>
            👋 {t('hero.welcome')}
          </div>
          <HeroHeading>
            {t('hero.title')} <HeroHighlight>{t('hero.highlight')}</HeroHighlight>
          </HeroHeading>
          <HeroSubHeading>
            {t('hero.subtitle')}
          </HeroSubHeading>
          <HeroButtons isRTL={isRTL}>
            <PrimaryButton to="/contact" className="glow">{t('hero.buttons.getStarted')}</PrimaryButton>
            <SecondaryButton to="/portfolio">{t('hero.buttons.viewProjects')}</SecondaryButton>
          </HeroButtons>
        </HeroContent>
        <HeroImageContainer isRTL={isRTL}>
          <div className="float-element">
            <LogoContainer>
              <img src={logoImage} alt="S.N.P Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              
              {/* Floating bubbles */}
              <FloatingBubble style={{ top: '-30px', left: isRTL ? 'auto' : '-30px', right: isRTL ? '-30px' : 'auto', background: 'var(--accent-2)', opacity: 0.25, width: '60px', height: '60px', filter: 'blur(8px)' }} />
              <FloatingBubble style={{ top: '10%', right: isRTL ? 'auto' : '-35px', left: isRTL ? '-35px' : 'auto', background: 'var(--accent-1)', opacity: 0.15, width: '50px', height: '50px', filter: 'blur(5px)' }} />
              <FloatingBubble style={{ bottom: '-35px', left: isRTL ? 'auto' : '20%', right: isRTL ? '20%' : 'auto', background: 'var(--accent-3)', opacity: 0.18, width: '70px', height: '70px', filter: 'blur(10px)' }} />
              <FloatingBubble style={{ bottom: '-25px', right: isRTL ? 'auto' : '-25px', left: isRTL ? '-25px' : 'auto', background: 'var(--accent-4)', opacity: 0.12, width: '40px', height: '40px', filter: 'blur(6px)' }} />
            </LogoContainer>
          </div>
          
          {/* Cartoon-style floating elements - improved RTL positioning */}
          <div className="bubble" style={{ position: 'absolute', top: '-20px', right: isRTL ? 'auto' : '10%', left: isRTL ? '10%' : 'auto', transform: isRTL ? 'rotate(-5deg)' : 'rotate(5deg)', zIndex: 5, padding: '10px 15px', fontSize: '0.9rem', textAlign: isRTL ? 'right' : 'left' }}>
            ✨ {t('hero.techBubble')}
          </div>
        </HeroImageContainer>
      </HeroContainer>
    </HeroSection>
  );
};

export default Hero;
