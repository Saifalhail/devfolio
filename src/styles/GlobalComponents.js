import React from 'react';
import styled, { css } from 'styled-components';
import { BaseCard, BaseButton, BaseInput } from './dashboardStyles';
import { colors, spacing, shadows, borderRadius, typography, mixins, transitions } from './GlobalTheme';
import { shine } from './animations';

// Panel Container - Consistent container for all dashboard panels
export const PanelContainer = styled(BaseCard)`
  ${mixins.flexColumn}
  width: 100%;
  padding: ${spacing.lg};
  position: relative;
  overflow: hidden;
  ${mixins.decorativeElement}
  animation: fadeIn 0.4s ease-out, slideUp 0.4s ease-out;
  animation-fill-mode: both;
  
  @media (max-width: 768px) {
    padding: ${spacing.md};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
`;

// Panel Header - Consistent header for all panels
export const PanelHeader = styled.div`
  ${mixins.flexBetween}
  margin-bottom: ${spacing.lg};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.md};
  }
`;

// Panel Title - Consistent styling for panel titles
export const PanelTitle = styled.h2`
  margin: 0;
  font-size: ${typography.fontSizes.xxl};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${colors.text.primary};
  
  @media (max-width: 768px) {
    font-size: ${typography.fontSizes.xl};
  }
`;

// Section Title - For subsections within panels
export const SectionTitle = styled.h3`
  margin: 0 0 ${spacing.md} 0;
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.text.primary};
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -${spacing.xs};
    left: 0;
    width: 40px;
    height: 2px;
    background: ${colors.gradients.accent};
    
    [dir="rtl"] & {
      left: auto;
      right: 0;
    }
  }
`;

// Action Button - Primary action button used across panels
export const ActionButton = styled(BaseButton)`
  ${mixins.gradientButton}
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  color: ${colors.text.primary}; /* Ensure white text for better visibility */
  font-weight: ${typography.fontWeights.medium};
  position: relative;
  overflow: hidden;
  box-shadow: ${shadows.sm};
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    pointer-events: none;
  }
  
  svg {
    font-size: ${typography.fontSizes.md};
    color: ${colors.text.primary};
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.md};
    
    &:after {
      animation: ${shine} 0.8s forwards;
    }
    
    svg {
      transform: translateX(2px);
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: ${shadows.sm};
  }
  
  [dir="rtl"] & {
    flex-direction: row-reverse;
    
    &:hover svg {
      transform: translateX(-2px);
    }
  }
  
  ${props => props.small && css`
    padding: ${spacing.xs} ${spacing.md};
    font-size: ${typography.fontSizes.sm};
    
    svg {
      font-size: ${typography.fontSizes.sm};
    }
  `}
`;

// Search Bar - Consistent search input across panels
export const SearchInput = styled(BaseInput)`
  display: flex;
  align-items: center;
  background-color: ${colors.background.card};
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.md};
  box-shadow: ${shadows.sm};
  width: 100%;
  max-width: 350px;
  transition: ${transitions.medium};
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:focus-within {
    box-shadow: ${shadows.md};
    border-color: rgba(205, 62, 253, 0.3);
    transform: translateY(-2px);
  }
  
  svg {
    color: ${colors.text.muted};
    ${props => props.isRTL 
      ? css`margin-left: ${spacing.sm};`
      : css`margin-right: ${spacing.sm};`
    }
    transition: color 0.3s ease;
  }
  
  &:focus-within svg {
    color: ${colors.accent.primary};
  }
  
  input {
    border: none;
    outline: none;
    width: 100%;
    background: transparent;
    font-size: ${typography.fontSizes.sm};
    color: ${colors.text.secondary};
    direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
    
    &::placeholder {
      color: ${colors.text.disabled};
      transition: color 0.3s ease;
    }
    
    &:focus::placeholder {
      color: ${colors.text.muted};
    }
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

// Card Grid - Consistent grid layout for cards across panels
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${spacing.lg};
  margin-top: ${spacing.lg};
  width: 100%;
  animation: fadeIn 0.5s ease-out;
  
  & > * {
    animation: fadeIn 0.5s ease-out, slideUp 0.5s ease-out;
    animation-fill-mode: both;
  }
  
  & > *:nth-child(1) { animation-delay: 0.1s; }
  & > *:nth-child(2) { animation-delay: 0.2s; }
  & > *:nth-child(3) { animation-delay: 0.3s; }
  & > *:nth-child(4) { animation-delay: 0.4s; }
  & > *:nth-child(5) { animation-delay: 0.5s; }
  & > *:nth-child(6) { animation-delay: 0.6s; }
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${spacing.md};
  }
`;

// Card - Consistent card styling
export const Card = styled(BaseCard)`
  display: flex;
  flex-direction: column;
  padding: ${spacing.lg};
  transition: ${transitions.medium};
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.5s ease-out, slideUp 0.5s ease-out;
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.lg};
    border-color: rgba(205, 62, 253, 0.3);
  }
  
  /* Optional decorative element on the side */
  ${props => props.withAccent && css`
    &:before {
      content: '';
      position: absolute;
      top: 0;
      ${props => props.isRTL ? 'right: 0;' : 'left: 0;'}
      width: 4px;
      height: 100%;
      background: ${colors.gradients.accent};
      opacity: 0.8;
    }
  `}
`;

// Empty State - Consistent empty state styling
export const EmptyState = styled.div`
  ${mixins.flexColumn}
  ${mixins.flexCenter}
  padding: ${spacing.xl};
  text-align: center;
  color: ${colors.text.muted};
  background: ${colors.background.card};
  border-radius: ${borderRadius.lg};
  border: 1px dashed rgba(255, 255, 255, 0.1);
  
  svg {
    font-size: 3rem;
    margin-bottom: ${spacing.md};
    opacity: 0.6;
  }
`;

// Status Badge - Consistent status badge styling
export const StatusBadge = props => {
  let status;
  
  switch(props.status) {
    case 'active':
      status = 'success';
      break;
    case 'inactive':
      status = 'warning';
      break;
    case 'error':
      status = 'error';
      break;
    case 'info':
      status = 'info';
      break;
    default:
      status = 'neutral';
  }
  
  const Badge = styled.span`
    ${mixins.statusBadge(status)}
  `;
  
  return <Badge>{props.children}</Badge>;
};

// Feature Card - For highlighting features
export const FeatureCard = styled(Card)`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.md};
  padding: ${spacing.lg};
  animation-delay: ${props => props.index * 0.1}s;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${colors.gradients.accent};
    opacity: 0.8;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.lg};
  }
  
  [dir="rtl"] & {
    flex-direction: row-reverse;
    text-align: right;
    
    &:before {
      left: auto;
      right: 0;
    }
  }
`;

// Feature Icon - Consistent icon styling
export const FeatureIcon = styled.div`
  ${mixins.flexCenter}
  width: 48px;
  height: 48px;
  border-radius: ${borderRadius.round};
  background: none;
  color: ${colors.accent.primary};
  transition: ${transitions.medium};

  svg {
    font-size: ${typography.fontSizes.lg};
    position: relative;
    transition: ${transitions.medium};
    z-index: 1;
  }

  ${FeatureCard}:hover & {
    transform: scale(1.1);
    box-shadow: ${shadows.lg};
    svg {
      color: ${colors.text.primary};
    }
  }
`;

// Filter Button - Consistent filter button styling
export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  background: ${props => props.active ? colors.accent.secondary : 'rgba(255, 255, 255, 0.05)'};
  color: ${colors.text.primary}; /* Always white text for better visibility */
  border: 1px solid ${props => props.active ? 'transparent' : 'rgba(255, 255, 255, 0.05)'};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: ${transitions.medium};
  box-shadow: ${props => props.active ? shadows.sm : 'none'};
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.4s ease-out;
  animation-fill-mode: both;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${colors.gradients.accent};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  svg {
    font-size: ${typography.fontSizes.sm};
    color: ${colors.text.primary}; /* Ensure icon is also white */
  }
  
  &:hover {
    background: ${props => props.active ? colors.accent.secondary : 'rgba(123, 44, 191, 0.2)'};
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
    
    &:after {
      transform: scaleX(1);
    }
  }
  
  [dir="rtl"] & {
    flex-direction: row-reverse;
    
    &:after {
      transform-origin: right;
    }
  }
`;
