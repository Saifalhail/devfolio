import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion, useInView, useAnimation } from 'framer-motion';

// Tech stack logos - Frontend
import reactLogo from '../../assets/icons/react.svg';
import reactNativeLogo from '../../assets/icons/react-native.svg';
import nextjsLogo from '../../assets/icons/nextjs.svg';
import vueLogo from '../../assets/icons/vue.svg';
import tailwindLogo from '../../assets/icons/tailwind.svg';
import typescriptLogo from '../../assets/icons/typescript.svg';

// Tech stack logos - Backend & Tools
import pythonLogo from '../../assets/icons/python.svg';
import nodejsLogo from '../../assets/icons/nodejs.svg';
import expressLogo from '../../assets/icons/express.svg';
import yoloLogo from '../../assets/icons/yolo.svg';
import djangoLogo from '../../assets/icons/django.svg';
import graphqlLogo from '../../assets/icons/graphql.svg';

// Tech stack logos - Databases & Hosting
import mongodbLogo from '../../assets/icons/mongodb.svg';
import supabaseLogo from '../../assets/icons/supabase.svg';
import firebaseLogo from '../../assets/icons/firebase.svg';
import vercelLogo from '../../assets/icons/vercel.svg';
import awsLogo from '../../assets/icons/aws.svg';

// Animations
const glowEffect = keyframes`
  0% { box-shadow: 0 0 5px rgba(205, 62, 253, 0.6); }
  50% { box-shadow: 0 0 15px rgba(205, 62, 253, 0.8), 0 0 20px rgba(180, 41, 227, 0.6); }
  100% { box-shadow: 0 0 5px rgba(205, 62, 253, 0.6); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulseGlow = keyframes`
  0% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
  50% { text-shadow: 0 0 15px rgba(205, 62, 253, 0.9), 0 0 20px rgba(255, 255, 255, 0.7); }
  100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
`;

const movingGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const TechStackSection = styled.section`
  position: relative;
  padding: 6rem 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primaryGradient};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }
  
  &::before, &::after {
    filter: blur(1px);
  }
`;

const BackgroundParticle = styled.div`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.size};
  height: ${props => props.size};
  background: ${props => props.theme.colors[props.color]};
  opacity: ${props => props.opacity};
  border-radius: 50%;
  filter: blur(40px);
  z-index: 1;
  pointer-events: none;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  text-align: center;
  position: relative;
  z-index: 2;
  
  .section-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 3rem;
  }
`;

const SectionTitle = styled.h2`
  position: relative;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.white};
  background: linear-gradient(to right, #cd3efd, #ff5b92, #00e5bd, #cd3efd);
  background-size: 300% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${movingGradient} 5s ease infinite;
  text-shadow: 0 0 15px rgba(205, 62, 253, 0.4);
  display: inline-block;
  letter-spacing: 0.5px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #cd3efd, #ff5b92);
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(205, 62, 253, 0.6);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.2rem;
  }
`;

const SubTitle = styled.p`
  font-size: 1.1rem;
  font-weight: 400;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 600px;
  text-align: center;
  line-height: 1.6;
  opacity: 0.8;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 0.95rem;
    padding: 0 1rem;
  }
`;

const BannerOverlay = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  direction: ${props => props.direction};
  margin: 3rem 0;
  padding: 1.2rem 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(180, 41, 227, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 30%, rgba(255, 91, 146, 0.15) 0%, transparent 50%),
    linear-gradient(90deg, rgba(18, 20, 44, 0.8), rgba(58, 30, 101, 0.9), rgba(18, 20, 44, 0.8));
  border-top: 1px solid rgba(205, 62, 253, 0.3);
  border-bottom: 1px solid rgba(205, 62, 253, 0.3);
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.4), 
    inset 0 0 30px rgba(205, 62, 253, 0.2),
    inset 0 0 10px rgba(255, 255, 255, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
    z-index: 0;
    pointer-events: none;
  }
  
  // Add the glowing mask at left and right
  .mask-left,
  .mask-right {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 120px;
    z-index: 3;
    pointer-events: none;
  }
  
  .mask-left {
    left: 0;
    background: linear-gradient(to right, rgba(18, 20, 44, 1) 0%, rgba(18, 20, 44, 0) 100%);
  }
  
  .mask-right {
    right: 0;
    background: linear-gradient(to left, rgba(18, 20, 44, 1) 0%, rgba(18, 20, 44, 0) 100%);
  }
`;

const BannerWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(5px);
  border-radius: 10px;
  padding: 0.3rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  &:hover {
    cursor: grab;
  }
  
  &:active {
    cursor: grabbing;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -30%;
    left: -30%;
    width: 160%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent 45%,
      rgba(255, 255, 255, 0.03) 45%,
      rgba(255, 255, 255, 0.03) 55%,
      transparent 55%
    );
    z-index: -1;
  }
`;

const InfiniteScrollBanner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem 0;
  will-change: transform;
  gap: 0.5rem;
  position: relative;
  
  /* Center scaling effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 100px;
    transform: translateX(-50%);
    background: radial-gradient(
      circle at center,
      rgba(205, 62, 253, 0.1) 0%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const TechIconItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 1.8rem;
  padding: 0.8rem 1rem;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  z-index: 2;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  direction: ltr; /* Keep tech items always LTR regardless of page direction */
  will-change: transform;
  transform-style: preserve-3d;
  
  // Different styling for categories
  ${props => props.category === 'frontend' && `
    .logo-wrapper {
      background: linear-gradient(135deg, rgba(205, 62, 253, 0.2), rgba(0, 229, 189, 0.2));
      border-color: rgba(205, 62, 253, 0.5);
    }
    
    h3 {
      color: ${props.theme.colors.accent1};
    }
  `};
  
  ${props => props.category === 'backend' && `
    .logo-wrapper {
      background: linear-gradient(135deg, rgba(0, 229, 189, 0.2), rgba(0, 229, 189, 0.1));
      border-color: rgba(0, 229, 189, 0.5);
    }
    
    h3 {
      color: ${props.theme.colors.accent4};
    }
  `};
  
  ${props => props.category === 'database' && `
    .logo-wrapper {
      background: linear-gradient(135deg, rgba(255, 91, 146, 0.2), rgba(205, 62, 253, 0.1));
      border-color: rgba(255, 91, 146, 0.5);
    }
    
    h3 {
      color: ${props.theme.colors.accent3};
    }
  `};
  
  ${props => props.category === 'hosting' || props.category === 'ai' && `
    .logo-wrapper {
      background: linear-gradient(135deg, rgba(180, 41, 227, 0.2), rgba(255, 91, 146, 0.1));
      border-color: rgba(180, 41, 227, 0.5);
    }
    
    h3 {
      color: ${props.theme.colors.accent2};
    }
  `};

  &:hover {
    z-index: 5;
    transform: translateY(-8px);
    
    .logo-wrapper {
      transform: scale(1.1) rotateY(10deg);
      box-shadow: 
        0 15px 30px rgba(0, 0, 0, 0.4),
        0 0 30px rgba(205, 62, 253, 0.7),
        inset 0 0 15px rgba(255, 255, 255, 0.1);
      border-color: rgba(205, 62, 253, 0.8);
    }
    
    h3 {
      animation: ${pulseGlow} 2s infinite;
      color: ${({ theme }) => theme.colors.accent1};
      transform: scale(1.1);
    }
  }
`;

const LogoWrapper = styled.div`
  width: 75px;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(18, 20, 44, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 50%;
  border: 2px solid rgba(205, 62, 253, 0.4);
  padding: 1rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-bottom: 0.7rem;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  transform: perspective(800px);
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.4),
    0 6px 10px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(205, 62, 253, 0.5),
    inset 0 0 15px rgba(205, 62, 253, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      90deg, 
      transparent, 
      rgba(255, 255, 255, 0.1), 
      transparent
    );
    transform: rotate(45deg);
    transition: all 0.3s ease;
  }
  
  &:hover::before {
    animation: ${shimmer} 1.5s infinite linear;
  }
  
  &.logo-wrapper {
    box-sizing: border-box;
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  
  .logo-wrapper:hover & {
    transform: translateZ(10px);
    animation: ${float} 3s ease infinite;
  }
`;

const TechName = styled.h3`
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0.25rem 0;
  color: ${({ theme }) => theme.colors.white};
  white-space: nowrap;
  transition: all 0.3s ease;
  opacity: 0.95;
  text-shadow: 0 0 8px rgba(205, 62, 253, 0.6);
  background: linear-gradient(to right, ${({ theme }) => theme.colors.white}, #cd3efd);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TechStack = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const sectionRef = useRef(null);
  const bannerRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const controls = useAnimation();
  
  // Tech icons categorized
  const techIcons = [
    // Frontend Technologies
    { name: 'React', logo: reactLogo, alt: t('techStack.altTexts.react'), category: 'frontend' },
    { name: 'Next.js', logo: nextjsLogo, alt: t('techStack.altTexts.nextjs'), category: 'frontend' },
    { name: 'Vue', logo: vueLogo, alt: t('techStack.altTexts.vue'), category: 'frontend' },
    { name: 'TypeScript', logo: typescriptLogo, alt: t('techStack.altTexts.typescript'), category: 'frontend' },
    { name: 'React Native', logo: reactNativeLogo, alt: t('techStack.altTexts.reactNative'), category: 'frontend' },
    { name: 'Tailwind CSS', logo: tailwindLogo, alt: t('techStack.altTexts.tailwind'), category: 'frontend' },
    
    // Backend Technologies
    { name: 'Python', logo: pythonLogo, alt: t('techStack.altTexts.python'), category: 'backend' },
    { name: 'Node.js', logo: nodejsLogo, alt: t('techStack.altTexts.nodejs'), category: 'backend' },
    { name: 'Express', logo: expressLogo, alt: t('techStack.altTexts.express'), category: 'backend' },
    { name: 'Django', logo: djangoLogo, alt: t('techStack.altTexts.django'), category: 'backend' },
    { name: 'GraphQL', logo: graphqlLogo, alt: t('techStack.altTexts.graphql'), category: 'backend' },
    
    // AI & Tools
    { name: 'YOLO', logo: yoloLogo, alt: t('techStack.altTexts.yolo'), category: 'ai' },
    
    // Databases & Hosting
    { name: 'MongoDB', logo: mongodbLogo, alt: t('techStack.altTexts.mongodb'), category: 'database' },
    { name: 'Supabase', logo: supabaseLogo, alt: t('techStack.altTexts.supabase'), category: 'database' },
    { name: 'Firebase', logo: firebaseLogo, alt: t('techStack.altTexts.firebase'), category: 'database' },
    { name: 'Vercel', logo: vercelLogo, alt: t('techStack.altTexts.vercel'), category: 'hosting' },
    { name: 'AWS', logo: awsLogo, alt: t('techStack.altTexts.aws'), category: 'hosting' },
  ];
  
  // Define state to keep track of center element
  const [centerIndex, setCenterIndex] = useState(-1);
  
  // Duplicate the array to make seamless scrolling
  const duplicatedIcons = [...techIcons, ...techIcons];
  
  // Auto-scrolling animation with RTL support
  useEffect(() => {
    let scrollTimeout;
    if (isInView && bannerRef.current) {
      const duration = 20; // seconds for one complete scroll (increased speed)
      const bannerWidth = bannerRef.current.scrollWidth / 2; // Width of one set of icons
      
      const startScrollAnimation = () => {
        try {
          controls.start({
            x: isRTL ? bannerWidth : -bannerWidth, // Reverse direction for RTL
            transition: {
              duration: duration,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }
          });
        } catch (error) {
          console.error('Animation error:', error);
          // Fallback to basic scroll position if animation fails
          if (bannerRef.current) {
            bannerRef.current.style.transform = `translateX(0px)`;
          }
        }
      };
      
      scrollTimeout = setTimeout(() => {
        startScrollAnimation();
      }, 1000); // Small delay before starting
    }
    
    return () => {
      clearTimeout(scrollTimeout);
    };
  }, [isInView, controls, isRTL]);
  
  // Hover and drag functionality
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  
  const handleMouseEnter = () => {
    controls.stop();
  };
  
  const handleMouseLeave = () => {
    if (!isDragging && isInView && bannerRef.current) {
      const duration = 20; // Match faster speed from above
      const bannerWidth = bannerRef.current.scrollWidth / 2;
      
      try {
        controls.start({
          x: isRTL ? bannerWidth : -bannerWidth, // Reverse direction for RTL
          transition: {
            duration: duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
          }
        });
      } catch (error) {
        console.error('Animation error on mouse leave:', error);
      }
    }
    
    setIsDragging(false);
  };
  
  const handleMouseDown = (e) => {
    try {
      setIsDragging(true);
      setStartPosition(e.clientX);
      setCurrentTranslate(controls.get('x') || 0);
    } catch (error) {
      console.error('Error on mouse down:', error);
      // Prevent the error from breaking user experience
      setIsDragging(false);
    }
    // Prevent default behavior to avoid text selection while dragging
    e.preventDefault();
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      try {
        const currentPosition = e.clientX;
        const diff = currentPosition - startPosition;
        controls.set({
          x: currentTranslate + diff
        });
      } catch (error) {
        console.error('Error on mouse move:', error);
        setIsDragging(false);
      }
    }
  };
  
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      
      // Resume animation after drag
      if (isInView && bannerRef.current) {
        const duration = 20; // Match faster speed
        const bannerWidth = bannerRef.current.scrollWidth / 2;
        
        try {
          controls.start({
            x: isRTL ? bannerWidth : -bannerWidth,
            transition: {
              duration: duration,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }
          });
        } catch (error) {
          console.error('Error on mouse up animation:', error);
        }
      }
    }
  };
  
  // Add touch event handlers for mobile support
  const handleTouchStart = (e) => {
    try {
      setIsDragging(true);
      setStartPosition(e.touches[0].clientX);
      setCurrentTranslate(controls.get('x') || 0);
    } catch (error) {
      console.error('Error on touch start:', error);
      setIsDragging(false);
    }
  };
  
  const handleTouchMove = (e) => {
    if (isDragging) {
      try {
        const currentPosition = e.touches[0].clientX;
        const diff = currentPosition - startPosition;
        controls.set({
          x: currentTranslate + diff
        });
      } catch (error) {
        console.error('Error on touch move:', error);
        setIsDragging(false);
      }
    }
  };
  
  const handleTouchEnd = () => {
    handleMouseUp(); // Reuse the mouse up handler logic
  };
  
  // Track center position for icon scaling effect
  useEffect(() => {
    if (!bannerRef.current || isDragging) return;
    
    // Function to update center element
    const updateCenterElement = () => {
      try {
        const bannerRect = bannerRef.current?.getBoundingClientRect();
        const centerX = bannerRect?.left + bannerRect?.width / 2;
        
        // Get all tech items
        const techItems = bannerRef.current?.querySelectorAll('[id^="tech-item-"]');
        if (!techItems || !centerX) return;
        
        let closestIndex = -1;
        let minDistance = Infinity;
        
        // Find the tech item closest to center
        techItems.forEach((item, idx) => {
          const rect = item.getBoundingClientRect();
          const itemCenterX = rect.left + rect.width / 2;
          const distance = Math.abs(itemCenterX - centerX);
          
          if (distance < minDistance && distance < 100) {
            minDistance = distance;
            closestIndex = idx;
          }
        });
        
        if (closestIndex !== centerIndex) {
          setCenterIndex(closestIndex);
        }
      } catch (error) {
        console.error('Error updating center element:', error);
      }
    };
    
    // Update initially and set up animation frame loop
    updateCenterElement();
    
    // Use requestAnimationFrame for smooth tracking
    const animationId = requestAnimationFrame(function animate() {
      updateCenterElement();
      requestAnimationFrame(animate);
    });
    
    return () => cancelAnimationFrame(animationId);
  }, [isInView, isDragging, centerIndex]);
  
  // Background elements animation with more dynamic movements
  const particleVariants = {
    animate: {
      y: [0, -15, 5, -5, 0],
      x: [0, 8, -5, 10, 0],
      rotate: [0, 15, -5, 10, 0],
      scale: [1, 1.2, 0.9, 1.1, 1],
      filter: [
        'blur(40px) brightness(1)',
        'blur(35px) brightness(1.2)',
        'blur(45px) brightness(0.9)',
        'blur(38px) brightness(1.1)',
        'blur(40px) brightness(1)'
      ],
      transition: {
        duration: 15,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <TechStackSection ref={sectionRef} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background decorative elements */}
      <BackgroundParticle 
        as={motion.div}
        variants={particleVariants}
        animate="animate"
        custom={1}
        top="15%"
        left="10%"
        size="150px"
        color="accent1"
        opacity={0.15}
      />
      <BackgroundParticle 
        as={motion.div}
        variants={particleVariants}
        animate="animate"
        custom={2}
        top="75%"
        left="85%"
        size="180px"
        color="accent3"
        opacity={0.12}
      />
      <BackgroundParticle 
        as={motion.div}
        variants={particleVariants}
        animate="animate"
        custom={3}
        top="35%"
        left="80%"
        size="100px"
        color="accent4"
        opacity={0.15}
      />
      <BackgroundParticle 
        as={motion.div}
        variants={particleVariants}
        animate="animate"
        custom={4}
        top="70%"
        left="15%"
        size="120px"
        color="accent2"
        opacity={0.14}
      />
      <BackgroundParticle 
        as={motion.div}
        variants={particleVariants}
        animate="animate"
        custom={5}
        top="25%"
        left="50%"
        size="90px"
        color="accent1"
        opacity={0.12}
      />
      <BackgroundParticle 
        as={motion.div}
        variants={particleVariants}
        animate="animate"
        custom={6}
        top="60%"
        left="40%"
        size="70px"
        color="accent3"
        opacity={0.1}
      />
      
      <SectionContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <SectionTitle as="h2">{isRTL ? t('techStack.title', 'ترسانتي التقنية') : 'My Technical Arsenal'}</SectionTitle>
          <SubTitle>
            {isRTL 
              ? t('techStack.subtitle', 'التقنيات والأدوات المتطورة التي أتقنها لتحويل أفكارك الإبداعية إلى تجارب رقمية استثنائية')
              : t('techStack.subtitle', 'The powerful technologies and tools I\'ve mastered to transform your creative ideas into exceptional digital experiences')}
          </SubTitle>
        </motion.div>
        
        <BannerOverlay direction={isRTL ? 'rtl' : 'ltr'}>
          <div className="mask-left"></div>
          <div className="mask-right"></div>
          <BannerWrapper 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <InfiniteScrollBanner
              ref={bannerRef}
              as={motion.div}
              animate={controls}
            >
              {duplicatedIcons.map((tech, index) => (
                <TechIconItem 
                  id={`tech-item-${index}`}
                  key={`${tech.name}-${index}`}
                  category={tech.category}
                  whileHover={{ 
                    scale: 1.15, 
                    filter: 'drop-shadow(0 0 10px rgba(205, 62, 253, 0.8))', 
                    zIndex: 5 
                  }}
                  animate={{
                    scale: centerIndex === index ? 1.3 : 1,
                    zIndex: centerIndex === index ? 10 : 2,
                    filter: centerIndex === index ? 
                      'drop-shadow(0 0 15px rgba(205, 62, 253, 0.9))' : 
                      'none'
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 300, damping: 15 },
                    filter: { duration: 0.4 }
                  }}
                >
                  <LogoWrapper className="logo-wrapper">
                    <LogoImage src={tech.logo} alt={tech.alt} />
                  </LogoWrapper>
                  <TechName>{tech.name}</TechName>
                </TechIconItem>
              ))}
            </InfiniteScrollBanner>
          </BannerWrapper>
        </BannerOverlay>
      </SectionContainer>
    </TechStackSection>
  );
};

export default TechStack;
