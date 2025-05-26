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
  color: ${props => props.active ? colors.text.primary : colors.text.secondary};
  border: none;
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.md};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: ${transitions.medium};
  
  &:hover {
    background: ${props => props.active ? colors.accent.secondary : 'rgba(255, 255, 255, 0.08)'};
    transform: translateY(-2px);
  }
  
  svg {
    font-size: ${typography.fontSizes.md};
    color: ${props => props.active ? colors.text.primary : colors.accent.primary};
  }
`;

// Dashboard header with consistent styling
export const DashboardHeader = styled.div`
  margin-bottom: ${spacing.lg};
`;

// Flexible container for header content
export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.md};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: ${props => props.reverseRtl ? 'row-reverse' : 'row'};
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

// Title section with optional subtitle
export const TitleSection = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${spacing.md};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

// Subtitle or count text
export const Subtitle = styled.span`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
`;

// Search container
export const SearchContainer = styled.div`
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Search input with icon
export const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

// Search icon
export const SearchIcon = styled.div`
  position: absolute;
  left: ${spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.text.secondary};
  
  [dir="rtl"] & {
    left: auto;
    right: ${spacing.sm};
  }
`;

// Styled search input
export const StyledSearchInput = styled.input`
  width: 100%;
  background: ${colors.background.secondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.sm} ${spacing.sm} ${spacing.xl};
  color: ${colors.text.primary};
  font-size: ${typography.fontSizes.sm};
  transition: ${transitions.medium};
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px rgba(205, 62, 253, 0.2);
  }
  
  &::placeholder {
    color: ${colors.text.muted};
  }
  
  [dir="rtl"] & {
    padding: ${spacing.sm} ${spacing.xl} ${spacing.sm} ${spacing.sm};
  }
`;

// Action row for filters and buttons
export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
`;

// Filter group container
export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

// Filter label with icon
export const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
  
  svg {
    color: ${colors.accent.primary};
    font-size: ${typography.fontSizes.sm};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

// Tabs for filtering
export const FilterTabs = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.md};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

// Tab button with indicator
export const FilterTab = styled.button`
  background: ${props => props.active ? colors.background.hover : 'transparent'};
  color: ${props => props.active ? colors.text.primary : colors.text.secondary};
  border: none;
  padding: ${spacing.xs} ${spacing.md};
  cursor: pointer;
  font-size: ${typography.fontSizes.sm};
  transition: ${transitions.medium};
  position: relative;
  
  &:hover {
    background: ${colors.background.hover};
  }
  
  ${props => props.active && props.color && css`
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: ${props.color};
    }
  `}
`;

// Gradient button with animation
export const GradientButton = styled.button`
  ${mixins.flexCenter}
  background: ${colors.gradients.button};
  color: ${colors.text.primary};
  border: none;
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.lg};
  cursor: pointer;
  transition: ${transitions.medium};
  font-weight: ${typography.fontWeights.medium};
  gap: ${spacing.sm};
  box-shadow: ${shadows.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  svg {
    font-size: ${typography.fontSizes.md};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

// Empty state icon
export const EmptyStateIcon = styled.div`
  ${mixins.flexCenter}
  font-size: ${typography.fontSizes.xxl};
  color: ${colors.accent.primary};
  background: rgba(205, 62, 253, 0.1);
  width: 80px;
  height: 80px;
  border-radius: ${borderRadius.round};
  margin-bottom: ${spacing.md};
`;

// Project card styling
export const ProjectCard = styled(Card)`
  display: flex;
  flex-direction: column;
  transition: ${transitions.medium};
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.lg};
    border-color: rgba(205, 62, 253, 0.2);
  }
  
  /* For list view */
  ${props => !props.isGrid && css`
    flex-direction: row;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  `}
`;

// Project card inner content
export const ProjectCardInner = styled.div`
  padding: ${spacing.lg};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

// Project header with gradient indicator
export const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.md};
  position: relative;
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
