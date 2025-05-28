import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { BaseCard, BaseButton, BaseInput } from './dashboardStyles';
import { colors, spacing, shadows, borderRadius, typography, mixins, transitions, breakpoints } from './GlobalTheme';
import { shine } from './animations';

// Additional animations for card effects
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(205, 62, 253, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(205, 62, 253, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(205, 62, 253, 0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

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

// Card - Enhanced card styling with customizable options
export const Card = styled(BaseCard)`
  display: flex;
  flex-direction: column;
  padding: ${spacing.lg};
  transition: ${transitions.medium};
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.5s ease-out, slideUp 0.5s ease-out;
  animation-fill-mode: both;
  background: ${props => props.gradient ? 'linear-gradient(135deg, rgba(35, 38, 85, 0.7) 0%, rgba(58, 30, 101, 0.8) 100%)' : 'rgba(35, 38, 85, 0.4)'};
  border: 1px solid ${props => props.borderColor || 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(5px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${props => props.accentColor ? 
      `linear-gradient(90deg, ${props.accentColor}, transparent)` : 
      'linear-gradient(90deg, #cd3efd, transparent)'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.lg};
    border-color: ${props => props.hoverBorderColor || 'rgba(205, 62, 253, 0.3)'};
    
    &::before {
      opacity: 1;
    }
  }
  
  ${props => props.interactive && css`
    cursor: pointer;
    
    &:active {
      transform: translateY(-2px);
    }
  `}
  
  ${props => props.glow && css`
    &:hover {
      box-shadow: 0 8px 32px ${props.glowColor || 'rgba(205, 62, 253, 0.3)'};
    }
  `}
  
  ${props => props.floating && css`
    animation: float 6s ease-in-out infinite;
  `}
  
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${spacing.sm};
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

// Search input with icon
export const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

// Search icon
export const SearchIcon = styled.div`
  position: absolute;
  left: ${spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  
  [dir="rtl"] & {
    left: auto;
    right: ${spacing.sm};
  }
`;

// Styled search input
export const StyledSearchInput = styled.input`
  width: 100%;
  padding: ${spacing.sm} ${spacing.sm} ${spacing.sm} ${spacing.xl};
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: ${colors.background.secondary};
  color: ${colors.text.primary};
  font-size: ${typography.fontSizes.sm};
  transition: ${transitions.medium};
  
  &:focus {
    outline: none;
    border-color: rgba(205, 62, 253, 0.5);
    box-shadow: ${shadows.sm};
  }
  
  &::placeholder {
    color: ${colors.text.muted};
  }
  
  [dir="rtl"] & {
    padding: ${spacing.sm} ${spacing.xl} ${spacing.sm} ${spacing.sm};
    text-align: right;
  }
  
  @media (max-width: 768px) {
    font-size: ${typography.fontSizes.xs};
    padding: ${spacing.xs} ${spacing.xs} ${spacing.xs} ${spacing.lg};
    
    [dir="rtl"] & {
      padding: ${spacing.xs} ${spacing.lg} ${spacing.xs} ${spacing.xs};
    }
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

// Project name with gradient text effect
export const ProjectName = styled.h3`
  margin: 0;
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.semibold};
  color: ${colors.text.primary};
  background: ${colors.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

// Status chip for project cards
export const StatusChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${borderRadius.round};
  font-size: ${typography.fontSizes.xs};
  font-weight: ${typography.fontWeights.medium};
  
  ${props => {
    switch(props.status) {
      case 'inProgress': return css`
        background-color: rgba(255, 193, 7, 0.15);
        color: ${colors.status.warning};
      `;
      case 'done': return css`
        background-color: rgba(76, 175, 80, 0.15);
        color: ${colors.status.success};
      `;
      case 'awaitingFeedback': return css`
        background-color: rgba(33, 150, 243, 0.15);
        color: ${colors.status.info};
      `;
      default: return css`
        background-color: rgba(158, 158, 158, 0.15);
        color: ${colors.status.neutral};
      `;
    }
  }}
`;

// Project description with truncation
export const ProjectDescription = styled.p`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
  margin: ${spacing.sm} 0 ${spacing.md};
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.lines || 3};
  -webkit-box-orient: vertical;
`;

// Detail item container
export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.sm};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
    text-align: right;
  }
`;

// Detail icon container
export const DetailIcon = styled.div`
  ${mixins.flexCenter}
  width: 28px;
  height: 28px;
  border-radius: ${borderRadius.round};
  background-color: rgba(123, 44, 191, 0.1);
  color: ${colors.accent.primary};
  flex-shrink: 0;
  
  svg {
    font-size: ${typography.fontSizes.sm};
  }
`;

// Detail content container
// Summary Card - For displaying summary information with icon
export const SummaryCard = styled(Card)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md};
  min-height: 100px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

// Summary Card Icon - Styled icon container for summary cards
export const SummaryCardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => {
    switch(props.status) {
      case 'success': return 'linear-gradient(135deg, #4cc9f0, #4361ee)';
      case 'warning': return 'linear-gradient(135deg, #f7b801, #f18701)';
      case 'error': return 'linear-gradient(135deg, #ef476f, #b5179e)';
      case 'info': return 'linear-gradient(135deg, #8338ec, #3a0ca3)';
      default: return 'linear-gradient(135deg, #4cc9f0, #4361ee)';
    }
  }};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  svg {
    font-size: 1.5rem;
    color: white;
  }
`;

// Summary Card Content - Container for text content in summary cards
export const SummaryCardContent = styled.div`
  flex: 1;
`;

// Summary Card Title - Title styling for summary cards
export const SummaryCardTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 500;
  color: #a0a0a0;
  margin: 0 0 0.3rem 0;
`;

// Summary Card Value - Value styling for summary cards
export const SummaryCardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  
  ${props => props.gradient && css`
    background: linear-gradient(90deg, #fff, #4cc9f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 10px rgba(76, 201, 240, 0.3);
  `}
`;

// Task Card - Enhanced specialized card for task items
export const TaskCard = styled(Card)`
  padding: ${spacing.md} ${spacing.lg};
  cursor: pointer;
  transition: ${transitions.medium};
  min-height: 140px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: ${props => {
      switch(props.status) {
        case 'done': return 'linear-gradient(to bottom, #4cc9f0, #4361ee)';
        case 'doing': return 'linear-gradient(to bottom, #f7b801, #f18701)';
        case 'todo': return 'linear-gradient(to bottom, #8338ec, #3a0ca3)';
        case 'blocked': return 'linear-gradient(to bottom, #ef476f, #b5179e)';
        default: return 'linear-gradient(to bottom, #8338ec, #3a0ca3)';
      }
    }};
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.md};
    border-color: ${props => {
      switch(props.status) {
        case 'done': return 'rgba(76, 201, 240, 0.5)';
        case 'doing': return 'rgba(247, 184, 1, 0.5)';
        case 'todo': return 'rgba(131, 56, 236, 0.5)';
        case 'blocked': return 'rgba(239, 71, 111, 0.5)';
        default: return 'rgba(205, 62, 253, 0.3)';
      }
    }};
    
    &::before {
      opacity: 1;
    }
  }
  
  /* Add subtle background color based on status */
  ${props => props.status && css`
    background: ${() => {
      switch(props.status) {
        case 'done': return 'rgba(76, 201, 240, 0.05)';
        case 'doing': return 'rgba(247, 184, 1, 0.05)';
        case 'todo': return 'rgba(131, 56, 236, 0.05)';
        case 'blocked': return 'rgba(239, 71, 111, 0.05)';
        default: return 'rgba(35, 38, 85, 0.4)';
      }
    }};
  `}
`;

// Icon Feature Card - Card with prominent centered icon for feature highlights
export const IconFeatureCard = styled(Card)`
  padding: ${spacing.xl};
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
  }
`;

// Icon Feature Card Icon - Icon container for icon feature cards
export const IconFeatureCardIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${props => props.background || 'linear-gradient(135deg, #4cc9f0, #4361ee)'};
  box-shadow: 0 8px 24px rgba(76, 201, 240, 0.3);
  
  svg {
    font-size: 2rem;
    color: white;
  }
`;

// Animated Card - Card with pulsing animation effect
export const AnimatedCard = styled(Card)`
  animation: ${pulse} 2s infinite;
  transition: all 0.3s ease;
  
  &:hover {
    animation: none;
    transform: translateY(-8px);
    box-shadow: 0 10px 30px rgba(205, 62, 253, 0.3);
  }
`;

// Gradient Border Card - Card with animated gradient border
export const GradientBorderCard = styled(Card)`
  position: relative;
  border: none;
  padding: ${spacing.lg};
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: ${borderRadius.lg};
    padding: 2px;
    background: linear-gradient(90deg, #cd3efd, #4cc9f0, #cd3efd);
    background-size: 200% 100%;
    animation: ${shimmer} 3s linear infinite;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
  }
  
  &:hover::before {
    animation-duration: 1.5s;
  }
`;

// Floating Card - Card with floating animation
export const FloatingCard = styled(Card)`
  animation: ${float} 6s ease-in-out infinite;
  transition: all 0.3s ease;
  
  &:hover {
    animation-play-state: paused;
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
`;

// Interactive Card - Card with interactive hover effects
export const InteractiveCard = styled(Card)`
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-style: preserve-3d;
  perspective: 1000px;
  
  &:hover {
    transform: rotateX(5deg) rotateY(5deg) translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: rotateX(0) rotateY(0) translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

// Task Card Components
export const TaskCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.sm};
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

export const TaskTitle = styled.h4`
  margin: 0;
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.text.primary};
  ${mixins.truncate}
`;

export const TaskDescription = styled.p`
  margin: ${spacing.sm} 0;
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
  flex-grow: 1;
  line-height: 1.5;
`;

export const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: ${spacing.sm};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

export const TaskMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.text.muted};
  font-size: ${typography.fontSizes.xs};
  
  svg {
    font-size: ${typography.fontSizes.sm};
  }
  
  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

export const TaskStatusBadge = styled.span`
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.xs};
  font-weight: ${typography.fontWeights.medium};
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  
  ${props => {
    switch(props.status) {
      case 'done':
        return css`
          background-color: rgba(76, 201, 240, 0.15);
          color: #4cc9f0;
        `;
      case 'doing':
        return css`
          background-color: rgba(247, 184, 1, 0.15);
          color: #f7b801;
        `;
      case 'todo':
        return css`
          background-color: rgba(131, 56, 236, 0.15);
          color: #8338ec;
        `;
      case 'blocked':
        return css`
          background-color: rgba(239, 71, 111, 0.15);
          color: #ef476f;
        `;
      default:
        return css`
          background-color: rgba(131, 56, 236, 0.15);
          color: #8338ec;
        `;
    }
  }}
`;

export const TaskPriorityBadge = styled.span`
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.xs};
  font-weight: ${typography.fontWeights.medium};
  
  ${props => {
    switch(props.priority) {
      case 'high':
        return css`
          background-color: rgba(239, 71, 111, 0.15);
          color: #ef476f;
        `;
      case 'medium':
        return css`
          background-color: rgba(247, 184, 1, 0.15);
          color: #f7b801;
        `;
      case 'low':
        return css`
          background-color: rgba(76, 201, 240, 0.15);
          color: #4cc9f0;
        `;
      default:
        return css`
          background-color: rgba(131, 56, 236, 0.15);
          color: #8338ec;
        `;
    }
  }}
`;

export const TaskDueDate = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${props => props.overdue ? '#ef476f' : colors.text.muted};
  font-size: ${typography.fontSizes.xs};
  
  svg {
    font-size: ${typography.fontSizes.sm};
  }
`;

export const TaskAssignee = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  span {
    font-size: ${typography.fontSizes.xs};
    color: ${colors.text.muted};
  }
`;

export const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
`;

// Detail label
export const DetailLabel = styled.span`
  font-size: ${typography.fontSizes.xs};
  color: ${colors.text.muted};
  margin-bottom: 2px;
`;

// Detail value with optional emphasis
export const DetailValue = styled.span`
  font-size: ${typography.fontSizes.sm};
  color: ${props => props.highlight ? colors.accent.primary : colors.text.secondary};
  font-weight: ${props => props.bold ? typography.fontWeights.medium : typography.fontWeights.regular};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

// Pagination container
export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${spacing.xl};
  padding-top: ${spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: ${breakpoints.sm}) {
    flex-direction: column;
    gap: ${spacing.md};
  }
`;

// Pagination text showing current page info
export const PaginationText = styled.div`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
`;

// Pagination controls container
export const PaginationControls = styled.div`
  display: flex;
  gap: ${spacing.xs};
`;

// Pagination button for page navigation
export const PaginationButton = styled.button`
  ${mixins.flexCenter}
  width: 36px;
  height: 36px;
  border-radius: ${borderRadius.sm};
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: ${props => props.active ? colors.accent.secondary : colors.background.secondary};
  color: ${props => props.active ? colors.text.primary : colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: ${transitions.medium};
  
  &:hover {
    background: ${props => props.active ? colors.accent.secondary : colors.background.hover};
    transform: translateY(-2px);
  }
`;
