import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { colors, spacing, borderRadius, shadows, transitions, typography } from '../../../styles/GlobalTheme';
import { useTranslation } from 'react-i18next';

/**
 * SelectableCards - A horizontally scrollable set of selectable cards with icons
 * 
 * @param {Array} options - Array of option objects with { id, label, icon, description }
 * @param {string} selectedValue - Currently selected value
 * @param {function} onChange - Callback when selection changes
 * @param {boolean} required - Whether selection is required
 */
const SelectableCards = ({ 
  options = [], 
  selectedValue, 
  onChange, 
  required = false 
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const cardsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollTimeout = useRef(null);
  const scrollHandler = useRef(null);

  // Check if on mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add scroll event listener to detect when scrolling happens
  useEffect(() => {
    const currentRef = cardsRef.current;
    if (currentRef) {
      const handleScroll = () => {
        setIsScrolling(true);
        
        // Clear previous timeout
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
        
        // Set new timeout to stop animation after scrolling stops
        scrollTimeout.current = setTimeout(() => {
          setIsScrolling(false);
        }, 800);
      };
      
      currentRef.addEventListener('scroll', handleScroll, { passive: true });
      scrollHandler.current = handleScroll;
      
      return () => {
        currentRef.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // We'll let the browser handle the scrolling natively
  // This is more reliable on mobile devices
  const handleScroll = () => {
    setIsScrolling(true);
    
    // Clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    // Set new timeout to stop animation after scrolling stops
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };

  // Function to scroll cards left or right
  const scrollCards = (scrollOffset) => {
    if (cardsRef.current) {
      const newScrollLeft = cardsRef.current.scrollLeft + scrollOffset;
      cardsRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      setIsScrolling(true);
      
      // Clear previous timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Set new timeout to stop animation after scrolling stops
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    }
  };

  return (
    <CardsContainer>
      
      <CardsWrapper 
        ref={cardsRef}
        isMobile={isMobile}
        onScroll={handleScroll}
      >
        {options.map(option => (
          <Card 
            key={option.id} 
            selected={option.id === selectedValue}
            onClick={() => onChange(option.id)}
            isMobile={isMobile}
          >
            <CardIcon>
              {option.icon}
            </CardIcon>
            <CardLabel>
              {option.label}
            </CardLabel>
            {option.description && (
              <CardDescription>
                {option.description}
              </CardDescription>
            )}
          </Card>
        ))}
      </CardsWrapper>
      {isMobile && <ScrollIndicator isScrolling={isScrolling} />}
    </CardsContainer>
  );
};

const CardsContainer = styled.div`
  position: relative;
  width: 100%;
  margin: ${spacing.md} 0;
  
  @media (max-width: 768px) {
    margin: ${spacing.sm} 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const ScrollArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${shadows.md};
  transition: all ${transitions.fast};
  
  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    font-size: 1.4rem;
  }
  
  ${props => props.direction === 'left' ? `
    left: -5px;
  ` : `
    right: -5px;
  `}
  
  &:hover {
    background: rgba(74, 108, 247, 0.8);
    transform: translateY(-50%) scale(1.1);
  }
  
  /* RTL Support */
  ${props => props.isRTL && props.direction === 'left' ? `
    left: auto;
    right: -5px;
  ` : props.isRTL && props.direction === 'right' ? `
    right: auto;
    left: -5px;
  ` : ''}
`;

const CardsWrapper = styled.div`
  display: flex;
  gap: ${spacing.md};
  padding: ${spacing.md} 0;
  overflow-x: auto;
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  position: relative;
  width: 100%;
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
  
  /* Prevent text selection during drag */
  user-select: none;
  
  @media (max-width: 768px) {
    gap: ${spacing.sm};
    padding: ${spacing.sm} 0;
    margin-bottom: ${props => props.isMobile ? spacing.xs : '0'};
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: none; /* Remove snap on mobile to improve scrolling */
    flex-wrap: nowrap;
  }
`;

const Card = styled.div`
  width: 140px;
  height: 180px;
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3))'
    : 'linear-gradient(135deg, rgba(74, 108, 247, 0.05), rgba(255, 255, 255, 0.05))'};
  border: 2px solid ${props => props.selected 
    ? 'rgba(138, 43, 226, 0.8)' 
    : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  cursor: pointer;
  transition: all ${transitions.fast};
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  touch-action: pan-x; /* Improve touch scrolling */
  
  @media (max-width: 768px) {
    width: 160px;
    min-width: 160px;
    height: 200px;
    padding: ${spacing.md} ${spacing.sm};
    border: ${props => props.selected ? '2px solid rgba(138, 43, 226, 0.8)' : '2px solid rgba(255, 255, 255, 0.1)'};
  }
  
  @media (max-width: 480px) {
    width: 180px;
    min-width: 180px;
    height: 220px;
    padding: ${spacing.md} ${spacing.sm};
  }
  
  /* Left border accent removed */
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(138, 43, 226, 0.5);
    box-shadow: ${shadows.md};
    
    &:after {
      left: 100%;
      transition: 0.8s;
    }
  }
  
  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-2px);
    }
    
    &:active {
      transform: scale(0.98);
      border-color: rgba(138, 43, 226, 0.8);
    }
  }
  
  &:active {
    transform: translateY(-2px);
    box-shadow: ${shadows.sm};
  }
  
  /* Subtle background variations for each card type while maintaining consistent styling */
  &:nth-child(1) {
    background: ${props => props.selected 
      ? 'linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3))'
      : 'linear-gradient(135deg, rgba(74, 108, 247, 0.05), rgba(30, 30, 70, 0.1))'};
  }
  
  &:nth-child(2) {
    background: ${props => props.selected 
      ? 'linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3))'
      : 'linear-gradient(135deg, rgba(74, 108, 247, 0.05), rgba(40, 40, 80, 0.1))'};
  }
  
  &:nth-child(3) {
    background: ${props => props.selected 
      ? 'linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3))'
      : 'linear-gradient(135deg, rgba(74, 108, 247, 0.05), rgba(50, 50, 90, 0.1))'};
  }
  
  &:nth-child(4) {
    background: ${props => props.selected 
      ? 'linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3))'
      : 'linear-gradient(135deg, rgba(74, 108, 247, 0.05), rgba(60, 60, 100, 0.1))'};
  }
`;

const CardIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${spacing.sm};
  color: rgba(138, 43, 226, 0.9);
  transition: all ${transitions.fast};
  
  ${Card}:hover & {
    transform: scale(1.1);
    color: rgba(138, 43, 226, 1);
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: ${spacing.md};
  }
  
  @media (max-width: 480px) {
    font-size: 3rem;
  }
`;

const CardLabel = styled.div`
  font-weight: ${typography.fontWeights.semiBold};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSizes.md};
  text-align: center;
  margin-bottom: ${spacing.xs};
  transition: all ${transitions.fast};
  
  ${Card}:hover & {
    color: white;
  }
  
  @media (max-width: 768px) {
    font-size: ${typography.fontSizes.lg};
    margin-bottom: ${spacing.sm};
  }
  
  @media (max-width: 480px) {
    font-size: ${typography.fontSizes.xl};
  }
`;

const CardDescription = styled.div`
  font-size: ${typography.fontSizes.xs};
  font-family: ${typography.fontFamily};
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  transition: all ${transitions.fast};
  
  ${Card}:hover & {
    color: rgba(255, 255, 255, 0.9);
  }
  
  @media (max-width: 768px) {
    font-size: ${typography.fontSizes.sm};
  }
  
  @media (max-width: 480px) {
    font-size: ${typography.fontSizes.md};
  }
`;

const ScrollIndicator = styled.div`
  height: 4px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  margin-top: ${spacing.xs};
  position: relative;
  overflow: hidden;
  display: block;
  opacity: ${props => props.isScrolling ? 1 : 0};
  transition: opacity 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 30%;
    background: linear-gradient(to right, rgba(74, 108, 247, 0.5), rgba(138, 43, 226, 0.5));
    border-radius: 2px;
    animation: ${props => props.isScrolling ? 'scrollIndicator 1.5s ease-in-out infinite' : 'none'};
  }
  
  @keyframes scrollIndicator {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(200%); }
    100% { transform: translateX(-100%); }
  }
`;

export default SelectableCards;
