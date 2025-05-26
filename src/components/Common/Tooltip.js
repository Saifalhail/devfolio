import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

/**
 * Tooltip component shows a text bubble when hovering over its children.
 * RTL layout is supported automatically.
 *
 * @param {React.ReactNode} children - Element that triggers the tooltip on hover
 * @param {React.ReactNode} content - Tooltip content to display
 */
const Tooltip = ({ children, content }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Wrapper>
      {children}
      <Bubble isRTL={isRTL}>{content}</Bubble>
    </Wrapper>
  );
};

const Wrapper = styled.span`
  position: relative;
  display: inline-flex;

  &:hover > div,
  &:focus-within > div {
    opacity: 1;
    visibility: visible;
  }
`;

const Bubble = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  ${props => (props.isRTL ? 'right: 50%; transform: translateX(50%);' : 'left: 50%; transform: translateX(-50%);')}
  background: #513a52;
  color: #fff;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
  z-index: 1000;

  &:before {
    content: '';
    position: absolute;
    top: 100%;
    ${props => (props.isRTL ? 'right: 50%; transform: translateX(50%);' : 'left: 50%; transform: translateX(-50%);')}
    border-width: 6px;
    border-style: solid;
    border-color: #513a52 transparent transparent transparent;
  }
`;

export default Tooltip;
