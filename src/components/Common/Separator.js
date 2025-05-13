import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const Separator = ({ color1 = '#82a1bf', color2 = '#faaa93', style }) => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };
  
  return (
    <SeparatorContainer style={style}>
      <WaveSVG preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
          fill={`url(#${color1.replace('#', '')}-${color2.replace('#', '')})`}
          fillOpacity="0.2"
        />
        <defs>
          <linearGradient id={`${color1.replace('#', '')}-${color2.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
      </WaveSVG>
      
      <ShineEffect />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <IconRow>
          <motion.div variants={itemVariants}>
            <IconCircle color={color1}>
              <IconInner>⚡</IconInner>
            </IconCircle>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <IconCircle color={color2}>
              <IconInner>💻</IconInner>
            </IconCircle>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <IconCircle color={`linear-gradient(135deg, ${color1}, ${color2})`}>
              <IconInner>🚀</IconInner>
            </IconCircle>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <IconCircle color={color2}>
              <IconInner>🔧</IconInner>
            </IconCircle>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <IconCircle color={color1}>
              <IconInner>🌟</IconInner>
            </IconCircle>
          </motion.div>
        </IconRow>
      </motion.div>
    </SeparatorContainer>
  );
};

const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(3deg); }
  50% { transform: translateY(0) rotate(0deg); }
  75% { transform: translateY(10px) rotate(-3deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.5; }
`;

const shine = keyframes`
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SeparatorContainer = styled.div`
  position: relative;
  height: 150px;
  width: 100%;
  overflow: hidden;
  margin-top: -1px;
  margin-bottom: -1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    height: 120px;
  }
`;

const WaveSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const ShineEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  z-index: 2;
  animation: ${shine} 8s infinite linear;
  transform: translateX(-100%) rotate(45deg);
  pointer-events: none;
`;

const IconRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 3;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const IconCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  animation: ${float} 6s infinite ease-in-out;
  animation-delay: ${props => Math.random() * 2}s;
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover:before {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
  }
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
  }
`;

const IconInner = styled.div`
  font-size: 1.2rem;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export default Separator;
