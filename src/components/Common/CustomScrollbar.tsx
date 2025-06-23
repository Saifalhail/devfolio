import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface CustomScrollbarProps {
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
  hideOnMobile?: boolean;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({ 
  children, 
  maxHeight = '100%',
  className,
  hideOnMobile = false
}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  return (
    <ScrollContainer 
      maxHeight={maxHeight} 
      className={className}
      isMobile={isMobile}
      hideOnMobile={hideOnMobile}
    >
      {children}
    </ScrollContainer>
  );
};

interface ScrollContainerProps {
  maxHeight: string;
  isMobile: boolean;
  hideOnMobile: boolean;
}

const ScrollContainer = styled.div<ScrollContainerProps>`
  max-height: ${props => props.maxHeight};
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  padding-right: ${props => props.isMobile ? '0' : '5px'};
  
  /* Hide scrollbar on mobile if specified */
  ${props => props.isMobile && props.hideOnMobile && `
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  `}
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: ${props => props.isMobile ? '6px' : '10px'};
    background: transparent;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(20, 20, 35, 0.3);
    border-radius: 100px;
    margin: 10px 0;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #cd3efd 0%, #7b2cbf 100%);
    border-radius: 100px;
    border: 2px solid rgba(20, 20, 35, 0.5);
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #e85ffd 0%, #9b3ccf 100%);
    box-shadow: 0 2px 15px rgba(205, 62, 253, 0.7);
    cursor: pointer;
  }
  
  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #cd3efd rgba(255, 255, 255, 0.05);
`

export default CustomScrollbar;
