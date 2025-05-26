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

  @media (max-width: 480px) {
    padding: 3rem 0 2rem; /* Further reduce padding on very small screens */
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
    font-size: 2.2rem;
    line-height: 1.3;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }
`;

const HeroHighlight = styled.span`
  background: linear-gradient(to right, var(--accent-3), var(--accent-4));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  font-size: 4rem;
  font-weight: 900;
  line-height: 1;
  margin-top: -0.2rem;
  padding-bottom: 0.15em;
  
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, var(--accent-3), var(--accent-4));
    bottom: 0;
    left: 0;
    border-radius: 2px;
    opacity: 0.5;
  }
  
  @media (max-width: 768px) {
    font-size: 3rem;
    padding-bottom: 0.1em;
  }
  
  @media (max-width: 480px) {
    font-size: 2.4rem;
  }
`;

const HeroSubHeading = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  margin-top: 1rem;
  color: var(--light-gray);
  line-height: 1.6;
  max-width: 90%;
  
  @media (max-width: 992px) {
    max-width: 100%;
    padding: 0 0.5rem;
    margin-top: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.05rem;
    line-height: 1.5;
    margin-bottom: 1.2rem;
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
  background: ${props => props.background || 'rgba(205, 62, 253, 0.15)'}; /* Updated to use purple brand color */
  border-radius: ${props => props.borderRadius || '12px'};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(205, 62, 253, 0.1); /* Updated shadow color */
  backdrop-filter: blur(8px); /* Increased blur effect */
  transform: ${props => props.transform || 'none'};
  opacity: 0.7; /* Added consistent opacity */
  filter: blur(1px); /* Added subtle blur to the icons themselves */
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
      
      {/* Enhanced decorative elements that won't interfere with text - with RTL support */}
      <div style={{ position: 'absolute', top: '5%', right: isRTL ? 'auto' : '5%', left: isRTL ? '5%' : 'auto', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(205, 62, 253, 0.08) 0%, rgba(205, 62, 253, 0) 70%)', borderRadius: '50%', filter: 'blur(15px)' }}></div>
      <div style={{ position: 'absolute', bottom: '5%', left: isRTL ? 'auto' : '5%', right: isRTL ? '5%' : 'auto', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(180, 41, 227, 0.07) 0%, rgba(180, 41, 227, 0) 70%)', borderRadius: '50%', filter: 'blur(12px)' }}></div>
      
      {/* Additional glow effects */}
      <div style={{ position: 'absolute', top: '30%', left: isRTL ? 'auto' : '30%', right: isRTL ? '30%' : 'auto', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(205, 62, 253, 0.03) 0%, rgba(205, 62, 253, 0) 80%)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
      <div style={{ position: 'absolute', bottom: '20%', right: isRTL ? 'auto' : '25%', left: isRTL ? '25%' : 'auto', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(180, 41, 227, 0.05) 0%, rgba(180, 41, 227, 0) 70%)', borderRadius: '50%', filter: 'blur(10px)' }}></div>

      {/* Floating decorative elements positioned to not interfere with text */}
      <FloatingIcon top="65%" left={isRTL ? "auto" : "8%"} right={isRTL ? "8%" : "auto"} animationDelay="0s" duration="6s">
        <IconBox background="rgba(205, 62, 253, 0.15)" borderRadius="12px">
          <span style={{ fontSize: '24px' }} role="img" aria-label={t('seo.alt.computer')}>💻</span>
        </IconBox>
      </FloatingIcon>
      
      <FloatingIcon top="40%" left={isRTL ? "10%" : "auto"} right={isRTL ? "auto" : "10%"} animationDelay="1s" duration="7s">
        <IconBox background="rgba(205, 62, 253, 0.12)" borderRadius="50%" size="45px">
          <span style={{ fontSize: '22px' }} role="img" aria-label={t('seo.alt.rocket')}>🚀</span>
        </IconBox>
      </FloatingIcon>
      
      <FloatingIcon bottom="25%" left={isRTL ? "auto" : "20%"} right={isRTL ? "20%" : "auto"} animationDelay="0.5s" duration="5s">
        <IconBox background="rgba(205, 62, 253, 0.18)" borderRadius="10px" size="40px" transform="rotate(45deg)">
          <span style={{ fontSize: '20px', transform: 'rotate(-45deg)' }} role="img" aria-label={t('seo.alt.lightning')}>⚡</span>
        </IconBox>
      </FloatingIcon>
      
      <PulsingIcon bottom="15%" left={isRTL ? "15%" : "auto"} right={isRTL ? "auto" : "15%"}>
        <IconBox background="rgba(205, 62, 253, 0.15)" borderRadius="15px" size="60px">
          <span style={{ fontSize: '30px' }} role="img" aria-label={t('seo.alt.sparkles')}>✨</span>
        </IconBox>
      </PulsingIcon>
      
      {/* Code quality badge positioned away from text - visible in both English and Arabic modes */}
      <FloatingIcon bottom="30%" left={isRTL ? "auto" : "12%"} right={isRTL ? "12%" : "auto"} animationDelay="1.2s" duration="6.5s">
        <IconBox 
          background="rgba(205, 62, 253, 0.2)" 
          borderRadius="15px" 
          size="65px"
        >
          <span style={{ fontSize: '18px' }} role="img" aria-label={t('seo.alt.star')}>⭐️</span>
        </IconBox>
      </FloatingIcon>
      
      {/* Additional background decorative elements */}
      <FloatingIcon top="20%" left={isRTL ? "auto" : "25%"} right={isRTL ? "25%" : "auto"} animationDelay="2s" duration="8s">
        <IconBox 
          background="rgba(205, 62, 253, 0.1)" 
          borderRadius="12px" 
          size="35px"
          transform="rotate(15deg)"
        >
          <span style={{ fontSize: '16px', transform: 'rotate(-15deg)' }} role="img" aria-label={t('seo.alt.magnifier')}>🔍</span>
        </IconBox>
      </FloatingIcon>
      
      <FloatingIcon top="60%" left={isRTL ? "22%" : "auto"} right={isRTL ? "auto" : "22%"} animationDelay="0.8s" duration="7.2s">
        <IconBox 
          background="rgba(205, 62, 253, 0.13)" 
          borderRadius="50%" 
          size="40px"
        >
          <span style={{ fontSize: '18px' }} role="img" aria-label={t('seo.alt.crystalBall')}>🔮</span>
        </IconBox>
      </FloatingIcon>

      <HeroContainer isRTL={isRTL}>
        <HeroContent isRTL={isRTL}>
          <div className="bubble" style={{ display: 'inline-block', marginBottom: '1rem', transform: isRTL ? 'rotate(2deg)' : 'rotate(-2deg)', fontSize: '1rem', textAlign: isRTL ? 'right' : 'left' }}>
            <span role="img" aria-label={t('seo.alt.waving')}>👋</span> {t('hero.welcome')}
          </div>
          <HeroHeading as="h1">
            {t('hero.title')}
            <div style={{ marginTop: '-0.5rem' }}>
              <HeroHighlight>{t('hero.highlight')}</HeroHighlight>
            </div>
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
              <img src={logoImage} alt="S.N.P Logo" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              
              {/* Floating bubbles */}
              <FloatingBubble style={{ top: '-30px', left: isRTL ? 'auto' : '-30px', right: isRTL ? '-30px' : 'auto', background: 'var(--accent-2)', opacity: 0.25, width: '60px', height: '60px', filter: 'blur(8px)' }} />
              <FloatingBubble style={{ top: '10%', right: isRTL ? 'auto' : '-35px', left: isRTL ? '-35px' : 'auto', background: 'var(--accent-1)', opacity: 0.15, width: '50px', height: '50px', filter: 'blur(5px)' }} />
              <FloatingBubble style={{ bottom: '-35px', left: isRTL ? 'auto' : '20%', right: isRTL ? '20%' : 'auto', background: 'var(--accent-3)', opacity: 0.18, width: '70px', height: '70px', filter: 'blur(10px)' }} />
              <FloatingBubble style={{ bottom: '-25px', right: isRTL ? 'auto' : '-25px', left: isRTL ? '-25px' : 'auto', background: 'var(--accent-4)', opacity: 0.12, width: '40px', height: '40px', filter: 'blur(6px)' }} />
            </LogoContainer>
          </div>
          
          {/* Cartoon-style floating elements - improved RTL positioning */}
          <div className="bubble" style={{ position: 'absolute', top: '-20px', right: isRTL ? 'auto' : '10%', left: isRTL ? '10%' : 'auto', transform: isRTL ? 'rotate(-5deg)' : 'rotate(5deg)', zIndex: 5, padding: '10px 15px', fontSize: '0.9rem', textAlign: isRTL ? 'right' : 'left' }}>
            <span role="img" aria-label={t('seo.alt.sparkles')}>✨</span> {t('hero.techBubble')}
          </div>
        </HeroImageContainer>
      </HeroContainer>
    </HeroSection>
  );
};

export default Hero;
