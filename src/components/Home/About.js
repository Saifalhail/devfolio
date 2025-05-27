import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { floatAnimation } from './HeroAnimations';

const About = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const sectionRef = useRef(null);
  
  // Animation variants
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
    hidden: { y: 30, opacity: 0 },
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

  // Get skills and facts data with fallback to empty array if not properly structured
  const skillsData = t('about.skills', { returnObjects: true }) || [];
  const factsData = t('about.facts', { returnObjects: true }) || [];
  
  // Ensure skillsData and factsData are arrays
  const skillsArray = Array.isArray(skillsData) ? skillsData : [];
  const factsArray = Array.isArray(factsData) ? factsData : [];
  
  return (
    <AboutSection>
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
            <SectionTitle as="h2">{t('about.title')}</SectionTitle>
          </SectionTitleWrapper>
          <SectionSubtitle>{t('about.subtitle')}</SectionSubtitle>
        </SectionHeader>
        
        <ContentWrapper>
          <motion.div
            ref={sectionRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="content-grid"
          >
            <motion.div variants={itemVariants} className="bio-card">
              <ProfileImageWrapper>
                <ProfileGlow />
                <ProfileImage>
                  <LogoImage src={require('../../assets/logo_cropped.png')} alt="S.N.P Logo" />
                </ProfileImage>
                <ProfileBadge>
                  <span>8+</span>
                  <small>{isRTL ? 'سنوات' : 'YRS'}</small>
                </ProfileBadge>
              </ProfileImageWrapper>
              
              <BioContent>
                <BioParagraph>{t('about.description')}</BioParagraph>
                <CtaButton>{t('about.cta')}</CtaButton>
              </BioContent>
            </motion.div>
            
            <motion.div variants={itemVariants} className="skills-card">
              <CardTitle>
                <CardIcon role="img" aria-label={t('about.iconAlt.skills')}>💪</CardIcon>
                <span>{isRTL ? 'المهارات التقنية' : 'Technical Skills'}</span>
              </CardTitle>
              
              <SkillsList>
                {skillsArray.map((skill, index) => (
                  <SkillItem key={index}>
                    <SkillIcon role="img" aria-label={t(`about.iconAlt.${index}`)}>{skill.icon}</SkillIcon>
                    <SkillInfo>
                      <SkillName>{skill.name}</SkillName>
                      <SkillBarWrapper>
                        <SkillBar level={skill.level}>
                          <SkillBarFill level={skill.level} />
                        </SkillBar>
                        <SkillLevel>{skill.level}%</SkillLevel>
                      </SkillBarWrapper>
                    </SkillInfo>
                  </SkillItem>
                ))}
              </SkillsList>
            </motion.div>
            
            <motion.div variants={itemVariants} className="facts-card">
              <CardTitle>
                <CardIcon>🏆</CardIcon>
                <span>{isRTL ? 'حقائق سريعة' : 'Quick Facts'}</span>
              </CardTitle>
              
              <FactsGrid>
                {factsArray.map((fact, index) => (
                  <FactItem key={index}>
                    <FactIcon>{fact.icon}</FactIcon>
                    <FactValue>{fact.value}</FactValue>
                    <FactTitle>{fact.title}</FactTitle>
                  </FactItem>
                ))}
              </FactsGrid>
            </motion.div>
          </motion.div>
        </ContentWrapper>
      </Container>
    </AboutSection>
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

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
    background: linear-gradient(45deg, #82a1bf, var(--accent-4));
    top: 10%;
    left: -100px;
    animation: ${floatAnimation} 15s infinite ease-in-out;
  }
  
  &.circle2 {
    width: 200px;
    height: 200px;
    background: linear-gradient(45deg, #faaa93, var(--accent-3));
    bottom: 10%;
    right: -50px;
    animation: ${floatAnimation} 12s infinite ease-in-out 1s;
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
    background: #82a1bf;
    top: 30%;
    right: 10%;
    animation: ${floatAnimation} 10s infinite ease-in-out 0.5s;
  }
  
  &.square2 {
    width: 70px;
    height: 70px;
    background: var(--accent-3);
    bottom: 25%;
    left: 15%;
    animation: ${floatAnimation} 8s infinite ease-in-out 1.5s;
  }
`;

const DecorDot = styled.div`
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  
  &.dot1 {
    width: 20px;
    height: 20px;
    background: #82a1bf;
    opacity: 0.2;
    top: 20%;
    right: 20%;
    animation: ${pulse} 4s infinite ease-in-out;
  }
  
  &.dot2 {
    width: 15px;
    height: 15px;
    background: var(--accent-4);
    opacity: 0.15;
    bottom: 15%;
    left: 25%;
    animation: ${pulse} 3s infinite ease-in-out 1s;
  }
  
  &.dot3 {
    width: 10px;
    height: 10px;
    background: #faaa93;
    opacity: 0.2;
    top: 50%;
    left: 10%;
    animation: ${pulse} 5s infinite ease-in-out 0.5s;
  }
`;



const AboutSection = styled.section`
  padding: 7rem 0;
  background: linear-gradient(135deg, rgba(130, 161, 191, 0.05), rgba(250, 170, 147, 0.05));
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2382a1bf' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 0;
  }
  
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
  color: #82a1bf;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 0.5rem;
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(130, 161, 191, 0.1);
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
    background: linear-gradient(90deg, rgba(130, 161, 191, 0.2), rgba(130, 161, 191, 0));
    background-size: 200% 100%;
    border-radius: 30px;
    animation: ${shimmer} 3s infinite linear;
    z-index: -1;
  }
`;

const SectionSubtitle = styled.h3`
  font-size: 2.8rem;
  font-weight: 700;
  background: linear-gradient(to right, #82a1bf, #faaa93);
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

const ContentWrapper = styled.div`
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "bio bio"
      "skills facts";
    gap: 2rem;
    
    .bio-card {
      grid-area: bio;
    }
    
    .skills-card {
      grid-area: skills;
    }
    
    .facts-card {
      grid-area: facts;
    }
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      grid-template-areas:
        "bio"
        "skills"
        "facts";
    }
  }
`;

// Bio Card Styles
const ProfileImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 1.5rem;
  z-index: 1;
  
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 15px;
    left: 15px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(130, 161, 191, 0.3), rgba(250, 170, 147, 0.3));
    z-index: -1;
    transition: all 0.3s ease;
  }
  
  &:hover:after {
    transform: translate(-5px, -5px);
  }
`;

const ProfileGlow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #82a1bf, #faaa93);
  filter: blur(15px);
  opacity: 0.5;
  animation: ${pulse} 3s infinite ease-in-out;
`;

const ProfileImage = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #82a1bf, #faaa93);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 4px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(transparent, rgba(255, 255, 255, 0.3), transparent 30%);
    animation: ${rotate} 4s linear infinite;
  }
`;

const ProfileInitials = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 2;
`;

const LogoImage = styled.img`
  width: 85%;
  height: 85%;
  object-fit: contain;
  border-radius: 50%;
  z-index: 2;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
`;

const ProfileBadge = styled.div`
  position: absolute;
  bottom: -10px;
  right: -10px;
  background: linear-gradient(135deg, #faaa93, #ff8e53);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid white;
  z-index: 2;
  
  span {
    font-size: 0.8rem;
    line-height: 1;
  }
  
  small {
    font-size: 0.5rem;
    opacity: 0.8;
  }
`;

const BioContent = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
`;

const BioParagraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  position: relative;
  padding-left: 1rem;
  border-left: 3px solid rgba(130, 161, 191, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    border-left-color: rgba(250, 170, 147, 0.8);
    transform: translateX(5px);
  }
`;

const CtaButton = styled.button`
  background: linear-gradient(135deg, #82a1bf, #faaa93);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s ease;
    z-index: -1;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #faaa93, #82a1bf);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -2;
    border-radius: 30px;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    
    &:before {
      left: 100%;
    }
    
    &:after {
      opacity: 1;
    }
  }
`;

// Card Styles
const CardTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-title);
  margin-bottom: 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid rgba(130, 161, 191, 0.1);
`;

const CardIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #82a1bf, #faaa93);
  border-radius: 8px;
  font-size: 1.2rem;
`;

// Skills Styles
const SkillsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const SkillItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(130, 161, 191, 0.05);
    transform: translateX(5px);
  }
`;

const SkillIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(130, 161, 191, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: -100%;
    left: -100%;
    width: 300%;
    height: 300%;
    background: conic-gradient(transparent, rgba(255, 255, 255, 0.3), transparent 30%);
    animation: ${rotate} 4s linear infinite;
  }
  
  ${SkillItem}:hover & {
    background: linear-gradient(135deg, rgba(130, 161, 191, 0.2), rgba(250, 170, 147, 0.2));
    transform: scale(1.1);
  }
`;

const SkillInfo = styled.div`
  flex: 1;
`;

const SkillName = styled.div`
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--text-primary);
`;

const SkillBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SkillBar = styled.div`
  flex: 1;
  height: 8px;
  background: rgba(130, 161, 191, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const SkillBarFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #82a1bf, #faaa93);
  border-radius: 4px;
  transition: width 1.5s ease;
  animation: fillAnimation 1.5s forwards;
  animation-delay: 0.5s;
  
  @keyframes fillAnimation {
    from { width: 0; }
    to { width: ${props => props.level}%; }
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 100%;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    opacity: 0.8;
  }
`;

const SkillLevel = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  min-width: 40px;
  text-align: right;
`;

// Facts Styles
const FactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FactItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #82a1bf, #faaa93);
    opacity: 0.5;
    transition: height 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    
    &:before {
      height: 8px;
      opacity: 0.8;
    }
  }
`;

const FactIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.8rem;
  background: linear-gradient(135deg, #82a1bf, #faaa93);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FactValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(to right, #82a1bf, #faaa93);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(to right, #82a1bf, #faaa93);
    transition: width 0.3s ease;
  }
  
  ${FactItem}:hover & {
    &:after {
      width: 80%;
    }
  }
`;

const FactTitle = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export default About;
