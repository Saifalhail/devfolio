import React, { useState, useRef, useEffect } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

/**
 * Tooltip - A component that displays additional information when hovered
 * 
 * @param {string} content - The tooltip content
 * @param {string} position - Position of the tooltip (top, right, bottom, left)
 * @param {React.ReactNode} children - Optional children to wrap with tooltip
 * @param {string} iconSize - Size of the question icon if no children
 * @param {object} style - Additional inline styles
 */
const Tooltip = ({
  content,
  position = 'top',
  children,
  iconSize = '1em',
  style = {}
}) => {
  // We'll use translation in the future if needed
  useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // Handle mouse events
  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);
  
  // Calculate tooltip position when visibility changes
  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      // Calculate position based on the trigger element
      const top = triggerRect.top + scrollTop;
      const left = triggerRect.left + scrollLeft;
      const width = triggerRect.width;
      const height = triggerRect.height;
      
      // Adjust position based on the specified position prop
      let newPosition = { top: 0, left: 0 };
      
      switch (position) {
        case 'top':
          newPosition = {
            top: top - 10, // Add some space between tooltip and trigger
            left: left + (width / 2)
          };
          break;
        case 'right':
          newPosition = {
            top: top + (height / 2),
            left: left + width + 10
          };
          break;
        case 'bottom':
          newPosition = {
            top: top + height + 10,
            left: left + (width / 2)
          };
          break;
        case 'left':
          newPosition = {
            top: top + (height / 2),
            left: left - 10
          };
          break;
        default:
          newPosition = {
            top: top - 10,
            left: left + (width / 2)
          };
      }
      
      setTooltipPosition(newPosition);
    }
  }, [isVisible, position]);

  // Get tooltip styles
  const getTooltipStyles = () => {
    // Base styles for all tooltips
    return {
      position: 'absolute',
      top: `${tooltipPosition.top}px`,
      left: `${tooltipPosition.left}px`,
      transform: position === 'top' || position === 'bottom' ? 'translateX(-50%)' : 
                position === 'left' ? 'translateX(-100%)' : 'none',
      backgroundColor: '#333',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 'normal',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      zIndex: 99999,
      maxWidth: '250px',
      textAlign: 'center',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      pointerEvents: 'none',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.2s',
      border: '1px solid #555',
      marginTop: position === 'bottom' ? '10px' : '0',
      marginBottom: position === 'top' ? '10px' : '0',
      marginLeft: position === 'right' ? '10px' : '0',
      marginRight: position === 'left' ? '10px' : '0',
    };
  };

  // Get arrow styles based on position
  const getArrowStyles = () => {
    const baseStyles = {
      position: 'absolute',
      width: 0,
      height: 0,
    };
    
    switch (position) {
      case 'top':
        return {
          ...baseStyles,
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid #333',
        };
      case 'right':
        return {
          ...baseStyles,
          left: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderRight: '5px solid #333',
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderBottom: '5px solid #333',
        };
      case 'left':
        return {
          ...baseStyles,
          right: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: '5px solid #333',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div 
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style
      }}
    >
      {/* Trigger element */}
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        style={{
          cursor: 'help',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {children || <FaQuestionCircle size={iconSize} color="#cd3efd" />}
      </div>
      
      {/* Tooltip content - rendered in the document body */}
      {isVisible && (
        <div
          ref={tooltipRef}
          style={getTooltipStyles()}
          role="tooltip"
        >
          {content}
          
          {/* Tooltip arrow */}
          <div style={getArrowStyles()} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
