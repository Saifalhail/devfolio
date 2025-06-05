import React, { useState } from 'react';
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
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  // Handle mouse events
  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

  return (
    <TooltipContainer style={style}>
      <TriggerWrapper 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children || <FaQuestionCircle size={iconSize} color="#cd3efd" />}
      </TriggerWrapper>
      
      {isVisible && (
        <TooltipContent position={position}>
          {content}
          <TooltipArrow position={position} />
        </TooltipContent>
      )}
    </TooltipContainer>
  );
};

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TriggerWrapper = styled.div`
  cursor: help;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const TooltipContent = styled.div`
  position: absolute;
  background-color: #ffffff;
  color: #000000;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  z-index: 99999;
  max-width: 250px;
  text-align: center;
  white-space: normal;
  word-wrap: break-word;
  border: 1px solid #cd3efd;
  pointer-events: auto;
  
  /* Position the tooltip based on the position prop */
  ${props => {
    switch (props.position) {
      case 'top':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 10px;
        `;
      case 'right':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 10px;
        `;
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 10px;
        `;
      case 'left':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-right: 10px;
        `;
      default:
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 10px;
        `;
    }
  }}
`;

const TooltipArrow = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  
  ${props => {
    switch (props.position) {
      case 'top':
        return `
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid #cd3efd;
        `;
      case 'right':
        return `
          left: -5px;
          top: 50%;
          transform: translateY(-50%);
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-right: 5px solid #cd3efd;
        `;
      case 'bottom':
        return `
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 5px solid #cd3efd;
        `;
      case 'left':
        return `
          right: -5px;
          top: 50%;
          transform: translateY(-50%);
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 5px solid #cd3efd;
        `;
      default:
        return ``;
    }
  }}
`;

export default Tooltip;
