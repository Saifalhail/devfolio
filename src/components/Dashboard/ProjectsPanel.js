import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { fadeIn, slideUp } from '../../styles/animations';
import { 
  FaClock, 
  FaCheck, 
  FaPencilAlt, 
  FaPlus,
  FaEllipsisV,
  FaCalendarAlt,
  FaTags,
  FaListUl,
  FaSmile,
  FaMeh,
  FaFrown,
  FaThLarge,
  FaList,
  FaFilter,
  FaSort,
  FaArrowLeft,
  FaArrowRight,
  FaUserAlt,
  FaLightbulb,
  FaChevronDown,
  FaChevronUp,
  FaCode,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaTrophy,
  FaArrowCircleRight,
  FaChevronRight,
  FaServer,
  FaBolt,
  FaRocket,
  FaMapMarked,
  FaUserShield,
  FaTools,
  FaLink,
  FaChartBar,
  FaUsersCog
} from 'react-icons/fa';
import StarryBackground from '../Common/StarryBackground';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { firestore as db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import Modal from '../Common/Modal';
import LoadingSkeleton from '../Common/LoadingSkeleton';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  ActionButton,
  Card,
  FilterButton,
  SortButton,
  ViewToggleButton,
  ProjectsGrid,
  ProjectsList,
  ProjectCard,
  ProjectTitle,
  ProjectType,
  StatusBadge,
  ClientInfo,
  MoodIcon,
  ProjectCardFooter,
  ProjectCardHeader,
  ProjectCardContent,
  ProjectDeadline,
  ProjectActions,
  ActionIcon,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  EmptyStateButton,
  FilterContainer,
  PaginationContainer,
  PaginationButton,
  PaginationInfo,
  ErrorMessage
} from './ProjectsPanel.styles';
import {
  DashboardHeader,
  HeaderContent,
  TitleSection,
  Subtitle,
  SearchContainer,
  SearchInputWrapper,
  SearchIcon,
  StyledSearchInput,
  ActionsRow,
  FilterGroup,
  FilterLabel,
  GradientButton,
  ProjectCardInner,
  ProjectHeader,
  ProjectName,
  StatusChip,
  Pagination,
  PaginationText,
  PaginationControls,
  DetailItem,
  DetailIcon,
  DetailContent,
  DetailLabel,
  DetailValue,
  ProjectDescription
} from '../../styles/GlobalComponents';
import { 
  colors, 
  spacing, 
  borderRadius, 
  shadows, 
  mixins, 
  transitions, 
  typography,
  breakpoints 
} from '../../styles/GlobalTheme';

// Import ProjectWizard directly to fix the default export issue
import ProjectWizard from './ProjectWizard.jsx';

// Define animations
const pulse = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.3;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
`;

// Styled components moved outside to prevent dynamic creation warnings
const GradientTitleText = styled.span`
  ${mixins.gradientText}
  font-size: ${typography.fontSizes.xxl};
  font-weight: ${typography.fontWeights.semiBold};
  
  @media (max-width: 768px) {
    font-size: ${typography.fontSizes.xl};
  }
`;

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(
    135deg,
    ${colors.accent.secondary} 0%,
    ${colors.accent.primary} 100%
  );
  border-radius: ${borderRadius.md};
  color: white;
  font-size: 1.5rem;
  box-shadow: ${shadows.md};
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const ActionButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.md};
  
  @media (max-width: 768px) {
    gap: ${spacing.sm};
  }
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    gap: ${spacing.sm};
  }
`;

const AddButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;
  
  @media (max-width: 768px) {
    gap: ${spacing.sm};
  }
`;

const ProjectCount = styled.span`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.normal};
  white-space: nowrap;
`;

const ViewToggleContainer = styled.div`
  display: flex;
  gap: ${spacing.sm};
  background: rgba(74, 108, 247, 0.1);
  padding: 4px;
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(74, 108, 247, 0.2);
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  flex-wrap: wrap;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    gap: ${spacing.md};
    width: 100%;
    justify-content: space-between;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: ${spacing.xs};
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: ${borderRadius.md};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ToggleButton = styled.button`
  padding: 8px 12px;
  background: ${props => props.active ? 'rgba(74, 108, 247, 0.2)' : 'transparent'};
  color: ${props => props.active ? colors.accent.primary : colors.text.secondary};
  border: none;
  border-radius: ${borderRadius.sm};
  cursor: pointer;
  transition: ${transitions.fast};
  font-size: ${typography.fontSizes.sm};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  
  &:hover {
    background: ${props => props.active ? 'rgba(74, 108, 247, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
    color: ${props => props.active ? colors.accent.primary : colors.text.primary};
  }
  
  svg {
    font-size: 1rem;
  }
`;

const FilterContainerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    gap: ${spacing.sm};
  }
`;

const FilterIcon = styled.div`
  color: ${colors.text.secondary};
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  color: ${colors.text.primary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: ${transitions.fast};
  min-width: 120px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }
  
  option {
    background: ${colors.background.secondary};
    color: ${colors.text.primary};
  }
  
  @media (max-width: 768px) {
    min-width: 100px;
    font-size: ${typography.fontSizes.xs};
  }
`;

const ProjectsContainer = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$isGrid 
    ? 'repeat(auto-fill, minmax(320px, 1fr))' 
    : '1fr'};
  gap: ${spacing.lg};
  animation: fadeIn 0.3s ease-in-out;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${spacing.md};
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.text.secondary};
  font-size: ${typography.fontSizes.sm};
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${spacing.xxl};
`;

const ProjectFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: ${spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const MoodMeter = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const MoodLabel = styled.span`
  font-size: ${typography.fontSizes.xs};
  color: ${colors.text.secondary};
`;

const MoodValue = styled.div`
  font-size: ${typography.fontSizes.lg};
`;

const ActionButtonsGroup = styled.div`
  display: flex;
  gap: ${spacing.xs};
`;

// Modern icon button with accent colors
const WhiteIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(205, 62, 253, 0.3);
  border: 1px solid rgba(205, 62, 253, 0.5);
  border-radius: 50%;
  color: ${colors.text.primary}; /* Always white */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(205, 62, 253, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:hover {
    background: rgba(205, 62, 253, 0.2);
    border-color: ${colors.accent.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(205, 62, 253, 0.3);
    
    &::before {
      width: 100%;
      height: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(205, 62, 253, 0.2);
  }
  
  svg {
    font-size: 1rem;
    color: ${colors.text.primary}; /* Always white */
    position: relative;
    z-index: 1;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

// Modern action button with gradient accent
const WhiteActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.xs};
  padding: ${spacing.sm} ${spacing.lg};
  background: ${colors.gradients.accent};
  border: none;
  border-radius: ${borderRadius.md};
  color: ${colors.text.primary};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: ${colors.gradients.hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(205, 62, 253, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(205, 62, 253, 0.2);
  }
  
  svg {
    font-size: 1rem;
    color: ${colors.text.primary}; /* Always white */
  }
`;

// Modern pagination button with accent colors
const WhitePaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 ${spacing.sm};
  background: ${props => props.active 
    ? colors.gradients.accent 
    : 'rgba(205, 62, 253, 0.2)'};
  border: 1px solid ${props => props.active 
    ? 'transparent' 
    : 'rgba(205, 62, 253, 0.4)'};
  border-radius: ${borderRadius.md};
  color: ${colors.text.primary}; /* Always white */
  font-size: ${typography.fontSizes.sm};
  font-weight: ${props => props.active ? typography.fontWeights.medium : typography.fontWeights.normal};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:not(:disabled):hover {
    background: ${props => props.active 
      ? colors.gradients.hover 
      : 'rgba(205, 62, 253, 0.15)'};
    border-color: ${props => props.active ? 'transparent' : colors.accent.primary};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(205, 62, 253, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    font-size: 1rem;
    color: ${colors.text.primary}; /* Always white */
  }
`;

const EmptyStateIllustration = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto ${spacing.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
    opacity: 0.3;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing.xxl};
  
  h3 {
    color: ${colors.text.primary};
    font-size: ${typography.fontSizes.xl};
    margin-bottom: ${spacing.sm};
  }
  
  p {
    color: ${colors.text.secondary};
    font-size: ${typography.fontSizes.md};
    margin-bottom: ${spacing.xl};
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  @media (max-width: 768px) {
    padding: ${spacing.xl};
    
    h3 {
      font-size: ${typography.fontSizes.lg};
    }
    
    p {
      font-size: ${typography.fontSizes.sm};
    }
  }
`;

const ErrorMessageAlert = styled.div`
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  color: ${colors.status.error};
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.lg};
  text-align: center;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, ${colors.accent.primary}, ${colors.accent.secondary});
  color: white;
  border: none;
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSizes.md};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: ${transitions.fast};
  display: inline-flex;
  align-items: center;
  gap: ${spacing.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: ${shadows.md};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const ActionIconButton = styled.button`
  padding: 8px;
  background: transparent;
  color: ${colors.text.secondary};
  border: none;
  border-radius: ${borderRadius.sm};
  cursor: pointer;
  transition: ${transitions.fast};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${colors.text.primary};
  }
`;

const CustomFilterTabs = styled.div`
  display: flex;
  gap: ${spacing.xs};
  background: rgba(205, 62, 253, 0.05);
  padding: 4px;
  border-radius: ${borderRadius.lg};
  border: 1px solid rgba(205, 62, 253, 0.2);
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(205, 62, 253, 0.1);
  
  @media (max-width: 768px) {
    padding: 2px;
  }
`;

const StatusFilterTab = styled.button`
  position: relative;
  padding: 8px 16px;
  background: ${props => props.active 
    ? colors.gradients.accent
    : 'rgba(205, 62, 253, 0.2)'};
  color: ${colors.text.primary}; /* Always white */
  border: 1px solid ${props => props.active 
    ? 'transparent' 
    : 'rgba(205, 62, 253, 0.4)'};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: ${typography.fontSizes.sm};
  font-weight: ${props => props.active ? typography.fontWeights.semiBold : typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.active 
      ? colors.gradients.hover
      : 'rgba(205, 62, 253, 0.3)'};
    color: ${colors.text.primary};
    border-color: ${props => props.active ? 'transparent' : colors.accent.primary};
    transform: translateY(-2px);
    box-shadow: ${props => props.active 
      ? '0 4px 12px rgba(205, 62, 253, 0.4)' 
      : '0 2px 8px rgba(205, 62, 253, 0.2)'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    font-size: 1rem;
    color: ${colors.text.primary}; /* Always white icons */
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: ${typography.fontSizes.xs};
    
    svg {
      font-size: 0.875rem;
    }
  }
`;

const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: 4px 8px;
  border-radius: ${borderRadius.sm};
  font-size: 0.875rem;
  position: relative;
  background: ${props => {
    switch (props.status) {
      case 'active':
        return `${colors.status.success}20`;
      case 'inProgress':
        return `${colors.status.warning}20`;
      case 'done':
        return `${colors.status.success}20`;
      case 'awaitingFeedback':
        return `${colors.status.info}20`;
      case 'onHold':
        return `${colors.status.error}20`;
      default:
        return `${colors.text.secondary}20`;
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active':
        return colors.status.success;
      case 'inProgress':
        return colors.status.warning;
      case 'done':
        return colors.status.success;
      case 'awaitingFeedback':
        return colors.status.info;
      case 'onHold':
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  }};
  
  svg {
    font-size: 0.875rem;
  }
`;

const StatusTooltip = styled.span`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${colors.background.tertiary};
  color: ${colors.text.primary};
  padding: 6px 12px;
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.xs};
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  margin-bottom: 8px;
  box-shadow: ${shadows.sm};
  z-index: 10;
  
  ${StatusIndicator}:hover & {
    opacity: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${colors.background.tertiary};
  }
`;

const ProjectCardSkeleton = styled(Card)`
  ${mixins.card(false)}
  padding: ${spacing.lg};
  pointer-events: none;
  
  ${props => !props.isGridView && css`
    display: flex;
    flex-direction: column;
  `}
`;

const SkeletonHeader = styled(ProjectHeader)`
  align-items: center;
`;

const SkeletonBody = styled(ProjectDetails)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const CustomEmptyState = styled(EmptyState)`
  max-width: 500px;
  margin: 3rem auto;
  text-align: center;
  
  h3 {
    margin-top: ${spacing.md};
    margin-bottom: ${spacing.sm};
    font-size: ${typography.fontSizes.xl};
    color: ${colors.text.primary};
  }
  
  p {
    margin-bottom: ${spacing.md};
    color: ${colors.text.secondary};
  }
  
  button {
    margin-top: ${spacing.md};
  }
  
  /* RTL Support */
  &.rtl-content {
    direction: rtl;
    text-align: center;
    
    h3, p {
      text-align: center;
    }
    
    button svg {
      margin-left: 0;
      margin-right: ${spacing.xs};
    }
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    margin: 2rem auto;
    padding: ${spacing.md};
    
    h3 {
      font-size: ${typography.fontSizes.lg};
    }
  }
`;

const AIInsightsButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  background: ${props => props.disabled 
    ? 'rgba(255, 255, 255, 0.05)' 
    : colors.gradients.accent};
  color: ${props => props.disabled 
    ? colors.text.muted 
    : colors.text.primary};
  border: 1px solid ${props => props.disabled 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'transparent'};
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.lg};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  margin-top: ${spacing.md};
  width: 100%;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover:not(:disabled) {
    background: ${colors.gradients.hover};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(205, 62, 253, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
  }
  
  svg {
    font-size: 1.125rem;
  }
`;

const InsightsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg};
  animation: ${fadeIn} 0.2s ease;
`;

const InsightsContent = styled.div`
  background: ${colors.background.secondary};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(205, 62, 253, 0.2);
  border-radius: ${borderRadius.lg};
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  position: relative;
  animation: ${slideUp} 0.3s ease;
  display: flex;
  flex-direction: column;
  margin: auto;
  
  @media (max-width: 768px) {
    width: 95%;
    max-height: 90vh;
    border-radius: ${borderRadius.md};
  }
`;

const InsightsHeader = styled.div`
  padding: ${spacing.xl};
  background: linear-gradient(135deg, rgba(205, 62, 253, 0.1) 0%, rgba(130, 161, 191, 0.1) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  /* Removed glowing background effect for cleaner design */
  
  h2 {
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
    color: ${colors.text.primary};
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    position: relative;
    z-index: 1;
    
    svg {
      color: ${colors.accent.primary};
    }
  }
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${colors.text.secondary};
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: ${colors.text.primary};
    transform: rotate(90deg);
    box-shadow: ${shadows.sm};
  }
`;

const InsightsBody = styled.div`
  padding: ${spacing.lg};
  overflow-y: auto;
  flex: 1;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(205, 62, 253, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(205, 62, 253, 0.5);
    }
  }
`;

const InsightSection = styled.div`
  margin-bottom: ${spacing.xl};
  animation: ${fadeIn} 0.5s ease;
  
  h3 {
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
    color: ${colors.accent.primary};
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: ${spacing.md};
    position: relative;
    
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, rgba(205, 62, 253, 0.3) 0%, transparent 100%);
      margin-left: ${spacing.md};
    }
    
    svg {
      /* Removed drop-shadow for cleaner design */
    }
  }
`;

const InsightCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: ${spacing.lg};
  margin-bottom: ${spacing.md};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(205, 62, 253, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(205, 62, 253, 0.2);
    border-color: rgba(205, 62, 253, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  h4 {
    color: ${colors.accent.secondary};
    font-size: 1rem;
    margin-bottom: ${spacing.sm};
  }
  
  p {
    color: ${colors.text.secondary};
    line-height: 1.6;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      position: relative;
      padding-left: ${spacing.lg};
      margin-bottom: ${spacing.sm};
      color: ${colors.text.secondary};
      
      &::before {
        content: '▸';
        position: absolute;
        left: 0;
        color: ${colors.accent.primary};
      }
    }
  }
`;

const TechBadge = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, rgba(205, 62, 253, 0.2) 0%, rgba(130, 161, 191, 0.2) 100%);
  border: 1px solid rgba(205, 62, 253, 0.3);
  color: ${colors.text.primary};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: 20px;
  font-size: ${typography.fontSizes.sm};
  font-weight: 500;
  margin: ${spacing.xs};
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(205, 62, 253, 0.3) 0%, rgba(130, 161, 191, 0.3) 100%);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(205, 62, 253, 0.3);
  }
`;

const FeasibilityScore = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.score >= 7 ? colors.status.success : props.score >= 5 ? colors.status.warning : colors.status.error};
  
  &::after {
    content: '/10';
    font-size: 1.2rem;
    opacity: 0.7;
  }
`;

const NextStepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.sm};
  
  span {
    flex: 1;
  }
`;

const AIBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, ${colors.accent.primary}30, ${colors.accent.secondary}30);
  color: ${colors.accent.primary};
  padding: 2px 8px;
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.xs};
  font-weight: ${typography.fontWeights.medium};
  margin-left: ${spacing.sm};
  vertical-align: middle;
  
  svg {
    font-size: 0.75rem;
  }
`;

const AIMetricsRow = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-top: ${spacing.md};
  padding-top: ${spacing.md};
  border-top: 1px solid rgba(205, 62, 253, 0.1);
  flex-wrap: wrap;
`;

const AIMetric = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.primary};
  background: rgba(205, 62, 253, 0.1);
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  border: 1px solid rgba(205, 62, 253, 0.2);
  
  svg {
    font-size: 1rem;
  }
  
  span {
    font-weight: ${typography.fontWeights.medium};
  }
`;

const TabNavigation = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.lg};
  padding: ${spacing.xs};
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  justify-content: center;
  
  @media (max-width: 768px) {
    overflow-x: auto;
    justify-content: flex-start;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(205, 62, 253, 0.3);
      border-radius: 2px;
    }
  }
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.lg};
  background: ${props => props.active 
    ? colors.gradients.accent 
    : 'transparent'};
  border: 1px solid ${props => props.active 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${borderRadius.md};
  color: ${props => props.active ? colors.text.primary : colors.text.secondary};
  font-weight: ${props => props.active ? typography.fontWeights.semiBold : typography.fontWeights.medium};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  svg {
    font-size: 1rem;
  }
  
  &:hover {
    background: ${props => props.active 
      ? colors.gradients.hover
      : 'rgba(255, 255, 255, 0.05)'};
    color: ${colors.text.primary};
    border-color: ${props => props.active ? 'transparent' : 'rgba(205, 62, 253, 0.3)'};
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const IntegrationGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const IntegrationCategory = styled.div`
  h4 {
    color: ${colors.text.primary};
    font-size: ${typography.fontSizes.md};
    margin-bottom: ${spacing.sm};
  }
`;

const IntegrationBadge = styled.span`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.sm};
  margin: ${spacing.xs};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  
  ${props => props.type === 'required' && `
    background: ${colors.status.error}20;
    color: ${colors.status.error};
    border: 1px solid ${colors.status.error}40;
  `}
  
  ${props => props.type === 'recommended' && `
    background: ${colors.status.warning}20;
    color: ${colors.status.warning};
    border: 1px solid ${colors.status.warning}40;
  `}
  
  ${props => props.type === 'future' && `
    background: ${colors.status.info}20;
    color: ${colors.status.info};
    border: 1px solid ${colors.status.info}40;
  `}
`;

const RoadmapPhase = styled.div`
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.md};
  padding: ${spacing.lg};
  margin-bottom: ${spacing.md};
`;

const PhaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
  
  h4 {
    color: ${colors.accent.primary};
    font-size: ${typography.fontSizes.lg};
    margin: 0;
  }
`;

const PhaseDuration = styled.span`
  background: ${colors.accent.primary}20;
  color: ${colors.accent.primary};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
`;

const PhaseContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PhaseSection = styled.div`
  h5 {
    color: ${colors.text.primary};
    font-size: ${typography.fontSizes.md};
    margin-bottom: ${spacing.sm};
  }
  
  ul {
    margin: 0;
    padding-left: ${spacing.lg};
    color: ${colors.text.secondary};
    
    li {
      margin-bottom: ${spacing.xs};
    }
  }
`;

// Visual Data Representation Components
const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin: ${spacing.sm} 0;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, 
      ${props => props.type === 'success' ? colors.status.success : 
                  props.type === 'warning' ? colors.status.warning : 
                  props.type === 'error' ? colors.status.error : 
                  colors.accent.primary} 0%,
      ${props => props.type === 'success' ? '#66BB6A' : 
                  props.type === 'warning' ? '#FFCA28' : 
                  props.type === 'error' ? '#EF5350' : 
                  colors.accent.secondary} 100%);
    border-radius: 4px;
    transition: width 0.6s ease;
    box-shadow: 0 0 10px ${props => 
      props.type === 'success' ? 'rgba(76, 175, 80, 0.5)' : 
      props.type === 'warning' ? 'rgba(255, 193, 7, 0.5)' : 
      props.type === 'error' ? 'rgba(244, 67, 54, 0.5)' : 
      'rgba(205, 62, 253, 0.5)'};
  }
`;

const CircularProgress = styled.div`
  width: 120px;
  height: 120px;
  position: relative;
  margin: ${spacing.lg} auto;
  
  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  
  circle {
    fill: none;
    stroke-width: 8;
    
    &:first-child {
      stroke: rgba(255, 255, 255, 0.1);
    }
    
    &:last-child {
      stroke: ${props => props.score >= 7 ? colors.status.success : 
                         props.score >= 5 ? colors.status.warning : 
                         colors.status.error};
      stroke-dasharray: ${props => 2 * Math.PI * 52};
      stroke-dashoffset: ${props => 2 * Math.PI * 52 * (1 - props.score / 10)};
      transition: stroke-dashoffset 1s ease;
      /* Removed drop-shadow for cleaner design */
    }
  }
`;

const ScoreText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  
  .score {
    font-size: 2rem;
    font-weight: bold;
    color: ${props => props.score >= 7 ? colors.status.success : 
                      props.score >= 5 ? colors.status.warning : 
                      colors.status.error};
  }
  
  .label {
    font-size: ${typography.fontSizes.sm};
    color: ${colors.text.secondary};
  }
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: ${spacing.lg};
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(205, 62, 253, 0.2);
    border-color: rgba(205, 62, 253, 0.3);
  }
  
  .icon {
    font-size: 2.5rem;
    margin-bottom: ${spacing.sm};
    color: ${colors.accent.primary};
  }
  
  .value {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${colors.text.primary};
    margin-bottom: ${spacing.xs};
  }
  
  .label {
    font-size: ${typography.fontSizes.sm};
    color: ${colors.text.secondary};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.lg};
  margin: ${spacing.xl} 0;
`;

const TimelineVisualization = styled.div`
  position: relative;
  padding: ${spacing.lg} 0;
  
  &::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, 
      rgba(205, 62, 253, 0.3) 0%, 
      rgba(130, 161, 191, 0.3) 100%);
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-left: 60px;
  margin-bottom: ${spacing.xl};
  
  &::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 5px;
    width: 20px;
    height: 20px;
    background: ${colors.accent.primary};
    border-radius: 50%;
    box-shadow: ${shadows.sm};
    z-index: 1;
  }
  
  .phase {
    font-weight: bold;
    color: ${colors.text.primary};
    margin-bottom: ${spacing.xs};
  }
  
  .duration {
    font-size: ${typography.fontSizes.sm};
    color: ${colors.accent.secondary};
    margin-bottom: ${spacing.sm};
  }
  
  .tasks {
    font-size: ${typography.fontSizes.sm};
    color: ${colors.text.secondary};
  }
`;

const BudgetBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const BudgetItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.sm} 0;
  
  .label {
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
    color: ${colors.text.secondary};
    
    svg {
      color: ${colors.accent.primary};
    }
  }
  
  .value {
    font-weight: bold;
    color: ${colors.text.primary};
  }
`;

// Additional styled components for new sections
const StepNumber = styled.div`
  width: 30px;
  height: 30px;
  background: ${colors.accent.gradient};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.text.onAccent};
  font-weight: bold;
  font-size: ${typography.fontSizes.sm};
  flex-shrink: 0;
`;

const RiskCard = styled(InsightCard)`
  border-left: 4px solid ${props => 
    props.impact === 'High' ? colors.status.error : 
    props.impact === 'Medium' ? colors.status.warning : 
    colors.status.info};
`;

const RiskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.sm};
`;

const RiskTitle = styled.h4`
  color: ${colors.text.primary};
  margin: 0;
`;

const RiskImpact = styled.span`
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  background: ${props => 
    props.impact === 'High' ? `${colors.status.error}20` : 
    props.impact === 'Medium' ? `${colors.status.warning}20` : 
    `${colors.status.info}20`};
  color: ${props => 
    props.impact === 'High' ? colors.status.error : 
    props.impact === 'Medium' ? colors.status.warning : 
    colors.status.info};
`;

const RiskMitigation = styled.p`
  color: ${colors.text.secondary};
  margin: 0;
`;

const SecurityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${spacing.lg};
`;

const SecurityCategory = styled.div`
  h4 {
    color: ${colors.accent.secondary};
    margin-bottom: ${spacing.sm};
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      position: relative;
      padding-left: ${spacing.lg};
      margin-bottom: ${spacing.xs};
      color: ${colors.text.secondary};
      
      &::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: ${colors.status.success};
      }
    }
  }
`;

const TeamCategory = styled.div`
  h4 {
    color: ${colors.text.primary};
    font-size: ${typography.fontSizes.md};
    margin-bottom: ${spacing.sm};
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      padding: ${spacing.xs} 0;
      color: ${colors.text.secondary};
    }
  }
`;

const HoursGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.md};
  margin-top: ${spacing.md};
`;

const HourItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${spacing.sm};
  background: rgba(255, 255, 255, 0.03);
  border-radius: ${borderRadius.sm};
  
  span:first-child {
    color: ${colors.text.secondary};
  }
  
  span:last-child {
    color: ${colors.accent.primary};
    font-weight: ${typography.fontWeights.medium};
  }
`;

const BudgetTotal = styled.div`
  text-align: center;
  margin-bottom: ${spacing.lg};
  
  h4 {
    color: ${colors.text.secondary};
    font-size: ${typography.fontSizes.md};
    margin-bottom: ${spacing.sm};
  }
`;

const BudgetAmount = styled.div`
  font-size: ${typography.fontSizes.xxl};
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.accent.primary};
`;



const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.lg};
  margin-bottom: ${spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TeamBadge = styled.span`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.sm};
  margin: ${spacing.xs};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  
  ${props => props.type === 'immediate' && `
    background: ${colors.accent.primary}20;
    color: ${colors.accent.primary};
    border: 1px solid ${colors.accent.primary}40;
  `}
  
  ${props => props.type === 'future' && `
    background: ${colors.text.secondary}20;
    color: ${colors.text.secondary};
    border: 1px solid ${colors.text.secondary}40;
  `}
`;

const ProjectsPanel = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  // Search functionality removed as requested
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProjectInsights, setSelectedProjectInsights] = useState(null);
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  // Get status priority for sorting
  const getStatusPriority = (status) => {
    switch(status) {
      case 'inProgress': return 1;
      case 'done': return 2;
      case 'awaitingFeedback': return 3;
      default: return 4;
    }
  };

  // Using the existing error state for handling Firebase errors
  
  // Fetch projects from Firestore
  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);
    setError(null);
    let unsubscribe = null;

    const fetchProjects = async () => {
      try {
        const projectsRef = collection(db, 'projects');
        // Simple query without orderBy to avoid index requirements
        const projectQuery = query(projectsRef, where('userId', '==', currentUser.uid));

        unsubscribe = onSnapshot(projectQuery, (querySnapshot) => {
          console.log('Projects snapshot received:', querySnapshot.size, 'projects');
          let projectsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            statusPriority: getStatusPriority(doc.data().status)
          }));
          
          // Apply client-side sorting
          if (sortBy === 'deadline') {
            projectsList.sort((a, b) => {
              const dateA = a.deadline?.toDate ? new Date(a.deadline.toDate()) : new Date('9999-12-31');
              const dateB = b.deadline?.toDate ? new Date(b.deadline.toDate()) : new Date('9999-12-31');
              return dateA - dateB;
            });
          } else if (sortBy === 'name') {
            projectsList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          } else if (sortBy === 'status') {
            projectsList.sort((a, b) => a.statusPriority - b.statusPriority);
          }
          
          console.log('Projects list:', projectsList);
          setProjects(projectsList);
          setError(null); // Clear any previous errors
          setIsLoading(false);
        }, (error) => {
          console.error('Error fetching projects:', error);
          // Don't show error for empty collections
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error setting up projects listener:', error);
        setIsLoading(false);
      }
    };

    fetchProjects();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from projects listener:', error);
        }
      }
    };
  }, [currentUser, sortBy]);
  
  // Filter projects based on status only
  useEffect(() => {
    let result = [...projects];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(project => project.status === filterStatus);
    }
    
    setFilteredProjects(result);
    
    // Calculate total pages
    setTotalPages(Math.max(1, Math.ceil(result.length / itemsPerPage)));
    
    // Reset to first page when filters change
    if (activePage > 1) {
      setActivePage(1);
    }
  }, [projects, filterStatus, itemsPerPage, activePage]);
  
  // Get RTL status from i18n - removed duplicate declaration
  
  // Get icon for status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'inProgress': return <FaClock />;
      case 'done': return <FaCheck />;
      case 'awaitingFeedback': return <FaPencilAlt />;
      default: return <FaClock />;
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch(status) {
      case 'inProgress': return t('projects.inProgress', 'In Progress');
      case 'done': return t('projects.done', 'Done');
      case 'awaitingFeedback': return t('projects.awaitingFeedback', 'Awaiting Feedback');
      default: return t('projects.notStarted', 'Not Started');
    }
  };

  // Get mood emoji and translated label
  const getMoodEmoji = (mood) => {
    switch(mood) {
      case 'happy': return <FaSmile color="#4CAF50" />;
      case 'neutral': return <FaMeh color="#FFC107" />;
      case 'unhappy': return <FaFrown color="#F44336" />;
      default: return null;
    }
  };
  
  // Get mood label
  const getMoodLabel = (mood) => {
    switch(mood) {
      case 'happy': return t('projects.moods.happy', 'Happy');
      case 'neutral': return t('projects.moods.neutral', 'Neutral');
      case 'unhappy': return t('projects.moods.unhappy', 'Unhappy');
      default: return '';
    }
  };

  // Handle view toggle
  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  // Handle filter change
  const handleFilterChange = useCallback((e) => {
    setFilterStatus(e.target.value);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);
  
  // Get current page items
  const currentPageItems = useMemo(() => {
    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  }, [activePage, itemsPerPage, filteredProjects]);

  // Pagination handlers
  const handlePageChange = useCallback((pageNumber) => {
    setActivePage(pageNumber);
  }, []);

  // Open modal
  const openAddProjectModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);
  
  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
  }, []);
  
  // Open AI insights modal
  const openInsightsModal = useCallback((project) => {
    setSelectedProjectInsights(project);
    setIsInsightsModalOpen(true);
    setActiveTab('overview'); // Reset to overview tab
  }, []);
  
  // Close AI insights modal
  const closeInsightsModal = useCallback(() => {
    setSelectedProjectInsights(null);
    setIsInsightsModalOpen(false);
  }, []);
  
  // Handle form submission - Project is already created by ProjectWizard
  const handleAddProject = useCallback(async (projectData) => {
    console.log('Project added successfully:', projectData);
    // Just close the modal - the project is already created
    setIsModalOpen(false);
    setError(null);
  }, []);

  // Detect RTL direction
  const isRTL = i18n.language === 'ar';
  
  return (
    <PanelContainer>
      <StarryBackground intensity={0.5} />
      
      <PanelHeader>
        <PanelTitle>
          <IconContainer 
            icon={FaThLarge} 
            color="#8338ec" 
            size="1.2em" 
            margin={isRTL ? `0 0 0 ${spacing.sm}` : `0 ${spacing.sm} 0 0`} 
          />
          <GradientTitleText>
            {t('projects.yourProjects', 'Your Projects')}
          </GradientTitleText>
        </PanelTitle>
        
        <ActionButtonWrapper>
          <WhiteActionButton onClick={openAddProjectModal}>
            <FaPlus />
            {t('projects.addProject', 'Add New Project')}
          </WhiteActionButton>
        </ActionButtonWrapper>
      </PanelHeader>
      
      <ActionsRow isRTL={isRTL}>
        {isRTL ? (
            <>
              <FilterSection isRTL={isRTL}>
                <CustomFilterTabs isRTL={isRTL}>
                  <StatusFilterTab 
                    active={filterStatus === 'all'} 
                    onClick={() => setFilterStatus('all')}
                    title={t('projects.filters.all', 'All')}
                    aria-label={t('projects.filters.all', 'All')}
                  >
                    <FaListUl />
                  </StatusFilterTab>
                  <StatusFilterTab 
                    active={filterStatus === 'inProgress'} 
                    onClick={() => setFilterStatus('inProgress')}
                    status="inProgress"
                    title={t('projects.inProgress', 'In Progress')}
                    aria-label={t('projects.inProgress', 'In Progress')}
                  >
                    <FaClock />
                  </StatusFilterTab>
                  <StatusFilterTab 
                    active={filterStatus === 'done'} 
                    onClick={() => setFilterStatus('done')}
                    status="done"
                    title={t('projects.done', 'Done')}
                    aria-label={t('projects.done', 'Done')}
                  >
                    <FaCheck />
                  </StatusFilterTab>
                </CustomFilterTabs>
                <ProjectCount isRTL={isRTL}>
                  {`${filteredProjects.length} ${filteredProjects.length === 1 
                    ? t('projects.project', 'Project') 
                    : t('projects.projects', 'Projects')}`}
                </ProjectCount>
              </FilterSection>
            </>
          ) : (
            <>
              <FilterSection>
                <CustomFilterTabs>
                  <StatusFilterTab 
                    active={filterStatus === 'all'} 
                    onClick={() => setFilterStatus('all')}
                    title={t('projects.filters.all', 'All')}
                    aria-label={t('projects.filters.all', 'All')}
                  >
                    <FaListUl />
                  </StatusFilterTab>
                  <StatusFilterTab 
                    active={filterStatus === 'inProgress'} 
                    onClick={() => setFilterStatus('inProgress')}
                    status="inProgress"
                    title={t('projects.inProgress', 'In Progress')}
                    aria-label={t('projects.inProgress', 'In Progress')}
                  >
                    <FaClock />
                  </StatusFilterTab>
                  <StatusFilterTab 
                    active={filterStatus === 'done'} 
                    onClick={() => setFilterStatus('done')}
                    status="done"
                    tooltip={t('projects.done', 'Done')}
                    title={t('projects.done', 'Done')}
                    aria-label={t('projects.done', 'Done')}
                  >
                    <FaCheck />
                  </StatusFilterTab>
                </CustomFilterTabs>
                <ProjectCount>
                  {`${filteredProjects.length} ${filteredProjects.length === 1 
                    ? t('projects.project', 'Project') 
                    : t('projects.projects', 'Projects')}`}
                </ProjectCount>
              </FilterSection>

            </>
          )}
        </ActionsRow>
      
      {isLoading ? (
        <ProjectsContainer $isGrid={isGridView} aria-hidden="true">
          {Array.from({ length: 4 }).map((_, idx) => (
            <ProjectCardSkeleton key={idx} isGridView={isGridView}>
              <SkeletonHeader>
                <LoadingSkeleton width="60%" height="1.2rem" />
                <LoadingSkeleton width="30%" height="1rem" />
              </SkeletonHeader>
              <SkeletonBody>
                <LoadingSkeleton height="0.8rem" style={{ marginBottom: '0.5rem' }} />
                <LoadingSkeleton height="0.8rem" style={{ marginBottom: '0.5rem' }} />
                <LoadingSkeleton height="0.8rem" />
              </SkeletonBody>
            </ProjectCardSkeleton>
          ))}
        </ProjectsContainer>
      ) : filteredProjects.length === 0 ? (
        <CustomEmptyState className={isRTL ? 'rtl-content' : ''}>
          {filterStatus !== 'all' ? (
            <>
              <EmptyStateIllustration>
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10ZM60 100C37.9 100 20 82.1 20 60C20 37.9 37.9 20 60 20C82.1 20 100 37.9 100 60C100 82.1 82.1 100 60 100Z" fill="rgba(255,255,255,0.1)"/>
                  <path d="M65 40H55V65H65V40Z" fill="rgba(255,255,255,0.2)"/>
                  <path d="M65 75H55V85H65V75Z" fill="rgba(255,255,255,0.2)"/>
                </svg>
              </EmptyStateIllustration>
              <h3>{t('projects.noMatchingProjects', 'No matching projects')}</h3>
              <p>{t('projects.noMatchingMessage', 'Try adjusting your filters')}</p>
              <WhiteActionButton onClick={() => setFilterStatus('all')}>
                {t('projects.clearFilters', 'Clear Filters')}
              </WhiteActionButton>
            </>
          ) : (
            <>
              <EmptyStateIllustration>
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20" y="20" width="80" height="80" rx="4" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none"/>
                  <path d="M35 40H85" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
                  <path d="M35 60H85" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
                  <path d="M35 80H85" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
                </svg>
              </EmptyStateIllustration>
              <h3>{t('projects.noProjects', 'No projects yet')}</h3>
              <p>{t('projects.createNewProject', 'Create a new project using the button in the header')}</p>
            </>
          )}
        </CustomEmptyState>
      ) : (
        <>
          <ProjectsContainer $isGrid={isGridView}>
            {currentPageItems.map(project => (
              <ProjectCard 
                key={project.id} 
                $isGrid={isGridView} 
                onClick={() => openInsightsModal(project)}
                style={{ cursor: 'pointer' }}
              >
                <ProjectCardInner>
                  <ProjectHeader>
                    <div style={{ flex: 1 }}>
                      <ProjectName>
                        {project.name}
                      </ProjectName>
                      <ProjectType>{project.type} • {project.industry}</ProjectType>
                    </div>
                    <StatusIndicator 
                      status={project.status} 
                      title={getStatusLabel(project.status)}
                      aria-label={getStatusLabel(project.status)}
                    >
                      {getStatusIcon(project.status)}
                      <span>{getStatusLabel(project.status)}</span>
                    </StatusIndicator>
                  </ProjectHeader>
                  
                  <ProjectDetails>
                    <ProjectDescription>
                      {project.description || t('projects.noDescription', 'No description provided.')}
                    </ProjectDescription>
                    
                    <DetailRow style={{ marginTop: '1rem' }}>
                      <DetailItem>
                        <DetailIcon><FaUserAlt /></DetailIcon>
                        <DetailContent>
                          <DetailLabel>{t('projects.client', 'Client')}</DetailLabel>
                          <DetailValue>{project.client || t('projects.noClientSet', 'Not specified')}</DetailValue>
                        </DetailContent>
                      </DetailItem>
                      <DetailItem>
                        <DetailIcon><FaCalendarAlt /></DetailIcon>
                        <DetailContent>
                          <DetailLabel>{t('projects.deadline', 'Deadline')}</DetailLabel>
                          <DetailValue>
                            {project.deadline && project.deadline.toDate ? new Date(project.deadline.toDate()).toLocaleDateString() : t('projects.noDeadlineSet', 'No deadline set')}
                          </DetailValue>
                        </DetailContent>
                      </DetailItem>
                    </DetailRow>
                    
                    {project.aiInsights && (
                      <AIMetricsRow>
                        <AIMetric>
                          <FaTrophy style={{ color: colors.accent.primary }} />
                          <span>{t('projects.feasibilityScore', 'Feasibility')}: {project.aiInsights.projectFeasibility?.score ? `${project.aiInsights.projectFeasibility.score}/10` : t('projects.notAvailable', 'Not available')}</span>
                        </AIMetric>
                        <AIMetric>
                          <FaMoneyBillWave style={{ color: colors.accent.secondary }} />
                          <span>{project.aiInsights.budgetAnalysis?.estimatedCost || 'TBD'}</span>
                        </AIMetric>
                        <AIMetric>
                          <FaClock style={{ color: colors.accent.primary }} />
                          <span>{project.aiInsights.timelineEstimate?.totalDuration || 'TBD'}</span>
                        </AIMetric>
                      </AIMetricsRow>
                    )}
                  </ProjectDetails>
                </ProjectCardInner>
              </ProjectCard>
            ))}
          </ProjectsContainer>
          
          {/* Pagination */}
          {filteredProjects.length > itemsPerPage && (
            <Pagination>
              <PaginationText>
                {t('pagination.showing', 'Showing')} {(activePage - 1) * itemsPerPage + 1}-
                {Math.min(activePage * itemsPerPage, filteredProjects.length)} {t('pagination.of', 'of')} {filteredProjects.length}
              </PaginationText>
              
              <PaginationControls className={isRTL ? 'rtl-pagination' : ''}>
                <WhitePaginationButton 
                  onClick={() => handlePageChange(Math.max(1, activePage - 1))}
                  disabled={activePage === 1}
                  aria-label={t('pagination.previous', 'Previous page')}
                >
                  {isRTL ? <FaArrowRight /> : <FaArrowLeft />}
                </WhitePaginationButton>
                
                {[...Array(totalPages)].map((_, index) => (
                  <WhitePaginationButton
                    key={index + 1}
                    active={activePage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    aria-label={t('pagination.page', 'Page {{number}}', { number: index + 1 })}
                  >
                    {index + 1}
                  </WhitePaginationButton>
                ))}
                
                <WhitePaginationButton 
                  onClick={() => handlePageChange(Math.min(totalPages, activePage + 1))}
                  disabled={activePage === totalPages}
                  aria-label={t('pagination.next', 'Next page')}
                >
                  {isRTL ? <FaArrowLeft /> : <FaArrowRight />}
                </WhitePaginationButton>
              </PaginationControls>
            </Pagination>
          )}
        </>
      )}
      {/* Add Project Modal */}
      {error && isModalOpen && (
        <ErrorMessage role="alert" aria-live="assertive">{t('projects.addError', 'Error adding project. Please try again.')}</ErrorMessage>
      )}
      
      {/* Render ProjectWizard directly */}
      {isModalOpen && (
        <ProjectWizard
          isOpen={isModalOpen}
          onClose={closeModal}
          onProjectAdded={handleAddProject}
        />
      )}
      
      {/* AI Insights Modal */}
      {isInsightsModalOpen && selectedProjectInsights && (
        <InsightsModal onClick={closeInsightsModal}>
          <InsightsContent onClick={(e) => e.stopPropagation()}>
            <InsightsHeader>
              <h2>
                {t('projects.summary.title', 'Project Summary')}
              </h2>
              <CloseButton onClick={closeInsightsModal}>&times;</CloseButton>
            </InsightsHeader>
            
            <InsightsBody>
              {/* Project Basic Info */}
              <InsightSection>
                <h3>{t('projects.summary.projectInfo', 'Project Information')}</h3>
                <InsightCard>
                  <h4>{selectedProjectInsights.name}</h4>
                  <p><strong>{t('projects.type', 'Type')}:</strong> {selectedProjectInsights.type}</p>
                  <p><strong>{t('projects.industry', 'Industry')}:</strong> {selectedProjectInsights.industry}</p>
                  <p><strong>{t('projects.client', 'Client')}:</strong> {selectedProjectInsights.client || t('projects.noClientSet', 'Not specified')}</p>
                  <p><strong>{t('projects.deadline', 'Deadline')}:</strong> {selectedProjectInsights.deadline && selectedProjectInsights.deadline.toDate ? new Date(selectedProjectInsights.deadline.toDate()).toLocaleDateString() : t('projects.noDeadlineSet', 'No deadline set')}</p>
                  {selectedProjectInsights.description && (
                    <>
                      <h4 style={{ marginTop: '1rem' }}>{t('projects.description', 'Description')}</h4>
                      <p>{selectedProjectInsights.description}</p>
                    </>
                  )}
                </InsightCard>
              </InsightSection>
              
              {selectedProjectInsights.aiInsights ? (
                <>
                  {/* Tab Navigation - Simplified */}
                  <TabNavigation>
                    <TabButton 
                      active={activeTab === 'overview'} 
                      onClick={() => setActiveTab('overview')}
                    >
                      <FaLightbulb />
                      {t('projects.summary.tabs.overview', 'Overview')}
                    </TabButton>
                    <TabButton 
                      active={activeTab === 'technical'} 
                      onClick={() => setActiveTab('technical')}
                    >
                      <FaCode />
                      {t('projects.summary.tabs.technical', 'Technical')}
                    </TabButton>
                    <TabButton 
                      active={activeTab === 'timeline'} 
                      onClick={() => setActiveTab('timeline')}
                    >
                      <FaCalendarAlt />
                      {t('projects.summary.tabs.timeline', 'Timeline')}
                    </TabButton>
                    <TabButton 
                      active={activeTab === 'next'} 
                      onClick={() => setActiveTab('next')}
                    >
                      <FaArrowCircleRight />
                      {t('projects.summary.tabs.nextSteps', 'Next Steps')}
                    </TabButton>
                  </TabNavigation>

                  {/* Tab Content */}
                  {activeTab === 'overview' && (
                    <>
                      {/* Executive Summary */}
                      {selectedProjectInsights.aiInsights.executiveSummary && (
                        <InsightSection>
                          <h3>{t('projects.aiInsights.executiveSummary', 'Executive Summary')}</h3>
                          <InsightCard>
                            <p>{selectedProjectInsights.aiInsights.executiveSummary}</p>
                          </InsightCard>
                        </InsightSection>
                      )}
                  
                  {/* Project Feasibility with Visual Score */}
                  {selectedProjectInsights.aiInsights.projectFeasibility && (
                    <InsightSection>
                      <h3>
                        <FaTrophy />
                        {t('projects.aiInsights.feasibility', 'Project Feasibility')}
                      </h3>
                      <InsightCard>
                        <CircularProgress score={parseFloat(selectedProjectInsights.aiInsights.projectFeasibility.score)}>
                          <svg viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="52" />
                            <circle cx="60" cy="60" r="52" />
                          </svg>
                          <ScoreText score={parseFloat(selectedProjectInsights.aiInsights.projectFeasibility.score)}>
                            <div className="score">{selectedProjectInsights.aiInsights.projectFeasibility.score}</div>
                            <div className="label">{t('projects.aiInsights.outOf10', 'out of 10')}</div>
                          </ScoreText>
                        </CircularProgress>
                        <p>{selectedProjectInsights.aiInsights.projectFeasibility.assessment}</p>
                        {selectedProjectInsights.aiInsights.projectFeasibility.keyConsiderations && (
                          <ul>
                            {selectedProjectInsights.aiInsights.projectFeasibility.keyConsiderations.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </InsightCard>
                    </InsightSection>
                  )}
                  
                  {/* Technical Recommendations */}
                  {selectedProjectInsights.aiInsights.technicalRecommendations && (
                    <InsightSection>
                      <h3>
                        <FaCode />
                        {t('projects.aiInsights.technicalRecommendations', 'Technical Recommendations')}
                      </h3>
                      <InsightCard>
                        {selectedProjectInsights.aiInsights.technicalRecommendations.suggestedTechStack && (
                          <div>
                            <h4>{t('projects.aiInsights.suggestedStack', 'Suggested Tech Stack')}</h4>
                            {Object.entries(selectedProjectInsights.aiInsights.technicalRecommendations.suggestedTechStack).map(([category, techs]) => (
                              <div key={category}>
                                <h5>{category.charAt(0).toUpperCase() + category.slice(1)}:</h5>
                                {techs.map((tech, index) => (
                                  <TechBadge key={index}>{tech}</TechBadge>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                        {selectedProjectInsights.aiInsights.technicalRecommendations.architecturePattern && (
                          <p><strong>{t('projects.aiInsights.architecture', 'Architecture')}:</strong> {selectedProjectInsights.aiInsights.technicalRecommendations.architecturePattern}</p>
                        )}
                      </InsightCard>
                    </InsightSection>
                  )}
                  
                  {/* Timeline & Budget */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                    {selectedProjectInsights.aiInsights.timelineEstimate && (
                      <InsightSection>
                        <h3>
                          <FaClock />
                          {t('projects.aiInsights.timeline', 'Timeline')}
                        </h3>
                        <InsightCard>
                          <p><strong>{t('projects.aiInsights.duration', 'Duration')}:</strong> {selectedProjectInsights.aiInsights.timelineEstimate.totalDuration}</p>
                        </InsightCard>
                      </InsightSection>
                    )}
                    
                    {selectedProjectInsights.aiInsights.budgetAnalysis && (
                      <InsightSection>
                        <h3>
                          <FaMoneyBillWave />
                          {t('projects.aiInsights.budget', 'Budget')}
                        </h3>
                        <InsightCard>
                          <p><strong>{t('projects.aiInsights.estimate', 'Estimate')}:</strong> {selectedProjectInsights.aiInsights.budgetAnalysis.estimatedCost}</p>
                        </InsightCard>
                      </InsightSection>
                    )}
                  </div>
                  
                      {/* Competitive Analysis */}
                      {selectedProjectInsights.aiInsights.competitiveAnalysis && (
                        <InsightSection>
                          <h3>
                            <FaChartBar />
                            {t('projects.aiInsights.competitiveAnalysis', 'Market Analysis')}
                          </h3>
                          <InsightCard>
                            <p>{selectedProjectInsights.aiInsights.competitiveAnalysis.marketInsights}</p>
                            {selectedProjectInsights.aiInsights.competitiveAnalysis.differentiationOpportunities && (
                              <>
                                <h4>{t('projects.aiInsights.differentiation', 'Differentiation Opportunities')}</h4>
                                <ul>
                                  {selectedProjectInsights.aiInsights.competitiveAnalysis.differentiationOpportunities.map((opp, index) => (
                                    <li key={index}>{opp}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </InsightCard>
                        </InsightSection>
                      )}
                    </>
                  )}

                  {activeTab === 'technical' && (
                    <>
                      {/* Technical Specifications */}
                      {selectedProjectInsights.aiInsights.technicalSpecification && (
                        <InsightSection>
                          <h3>
                            <FaServer />
                            {t('projects.aiInsights.technicalSpec', 'Technical Specification')}
                          </h3>
                          <InsightCard>
                            <DetailGrid>
                              <DetailItem>
                                <strong>{t('projects.aiInsights.architecture', 'Architecture')}:</strong>
                                <span>{selectedProjectInsights.aiInsights.technicalSpecification.architecture}</span>
                              </DetailItem>
                              <DetailItem>
                                <strong>{t('projects.aiInsights.apiDesign', 'API Design')}:</strong>
                                <span>{selectedProjectInsights.aiInsights.technicalSpecification.apiDesign}</span>
                              </DetailItem>
                              <DetailItem>
                                <strong>{t('projects.aiInsights.deployment', 'Deployment')}:</strong>
                                <span>{selectedProjectInsights.aiInsights.technicalSpecification.deploymentArchitecture}</span>
                              </DetailItem>
                            </DetailGrid>
                            
                            {selectedProjectInsights.aiInsights.technicalSpecification.databases && (
                              <>
                                <h4>{t('projects.aiInsights.databases', 'Database Architecture')}</h4>
                                <DetailGrid>
                                  <DetailItem>
                                    <strong>{t('projects.aiInsights.primary', 'Primary')}:</strong>
                                    <span>{selectedProjectInsights.aiInsights.technicalSpecification.databases.primary}</span>
                                  </DetailItem>
                                  {selectedProjectInsights.aiInsights.technicalSpecification.databases.cache && (
                                    <DetailItem>
                                      <strong>{t('projects.aiInsights.cache', 'Cache')}:</strong>
                                      <span>{selectedProjectInsights.aiInsights.technicalSpecification.databases.cache}</span>
                                    </DetailItem>
                                  )}
                                  {selectedProjectInsights.aiInsights.technicalSpecification.databases.search && (
                                    <DetailItem>
                                      <strong>{t('projects.aiInsights.search', 'Search')}:</strong>
                                      <span>{selectedProjectInsights.aiInsights.technicalSpecification.databases.search}</span>
                                    </DetailItem>
                                  )}
                                </DetailGrid>
                              </>
                            )}
                          </InsightCard>
                        </InsightSection>
                      )}

                      {/* Scalability Plan */}
                      {selectedProjectInsights.aiInsights.scalabilityPlan && (
                        <InsightSection>
                          <h3>
                            <FaBolt />
                            {t('projects.aiInsights.scalability', 'Scalability Plan')}
                          </h3>
                          <InsightCard>
                            <p><strong>{t('projects.aiInsights.userGrowth', 'User Growth Strategy')}:</strong> {selectedProjectInsights.aiInsights.scalabilityPlan.userGrowthStrategy}</p>
                            <p><strong>{t('projects.aiInsights.dataGrowth', 'Data Growth Strategy')}:</strong> {selectedProjectInsights.aiInsights.scalabilityPlan.dataGrowthStrategy}</p>
                            
                            {selectedProjectInsights.aiInsights.scalabilityPlan.performanceTargets && (
                              <>
                                <h4>{t('projects.aiInsights.performanceTargets', 'Performance Targets')}</h4>
                                <DetailGrid>
                                  <DetailItem>
                                    <strong>{t('projects.aiInsights.responseTime', 'Response Time')}:</strong>
                                    <span>{selectedProjectInsights.aiInsights.scalabilityPlan.performanceTargets.responseTime}</span>
                                  </DetailItem>
                                  <DetailItem>
                                    <strong>{t('projects.aiInsights.uptime', 'Uptime')}:</strong>
                                    <span>{selectedProjectInsights.aiInsights.scalabilityPlan.performanceTargets.uptime}</span>
                                  </DetailItem>
                                  {selectedProjectInsights.aiInsights.scalabilityPlan.performanceTargets.concurrent_users && (
                                    <DetailItem>
                                      <strong>{t('projects.aiInsights.concurrentUsers', 'Concurrent Users')}:</strong>
                                      <span>{selectedProjectInsights.aiInsights.scalabilityPlan.performanceTargets.concurrent_users}</span>
                                    </DetailItem>
                                  )}
                                </DetailGrid>
                              </>
                            )}
                          </InsightCard>
                        </InsightSection>
                      )}

                      {/* Integration Map */}
                      {selectedProjectInsights.aiInsights.integrationMap && (
                        <InsightSection>
                          <h3>
                            <FaLink />
                            {t('projects.aiInsights.integrations', 'Integration Requirements')}
                          </h3>
                          <InsightCard>
                            <IntegrationGrid>
                              {selectedProjectInsights.aiInsights.integrationMap.required && (
                                <IntegrationCategory>
                                  <h4>{t('projects.aiInsights.required', 'Required')}</h4>
                                  {selectedProjectInsights.aiInsights.integrationMap.required.map((item, index) => (
                                    <IntegrationBadge key={index} type="required">{item}</IntegrationBadge>
                                  ))}
                                </IntegrationCategory>
                              )}
                              {selectedProjectInsights.aiInsights.integrationMap.recommended && (
                                <IntegrationCategory>
                                  <h4>{t('projects.aiInsights.recommended', 'Recommended')}</h4>
                                  {selectedProjectInsights.aiInsights.integrationMap.recommended.map((item, index) => (
                                    <IntegrationBadge key={index} type="recommended">{item}</IntegrationBadge>
                                  ))}
                                </IntegrationCategory>
                              )}
                              {selectedProjectInsights.aiInsights.integrationMap.future && (
                                <IntegrationCategory>
                                  <h4>{t('projects.aiInsights.future', 'Future Considerations')}</h4>
                                  {selectedProjectInsights.aiInsights.integrationMap.future.map((item, index) => (
                                    <IntegrationBadge key={index} type="future">{item}</IntegrationBadge>
                                  ))}
                                </IntegrationCategory>
                              )}
                            </IntegrationGrid>
                          </InsightCard>
                        </InsightSection>
                      )}
                    </>
                  )}

                  {/* Timeline Tab */}
                  {activeTab === 'timeline' && (
                    <>
                      {/* Timeline Estimate */}
                      {selectedProjectInsights.aiInsights.timelineEstimate && (
                        <InsightSection>
                          <h3>
                            <FaCalendarAlt />
                            {t('projects.summary.projectTimeline', 'Project Timeline')}
                          </h3>
                          <InsightCard>
                            <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
                              <h4>{t('projects.summary.totalDuration', 'Total Duration')}</h4>
                              <div style={{ fontSize: '1.5rem', color: colors.accent.primary, fontWeight: 'bold' }}>
                                {selectedProjectInsights.aiInsights.timelineEstimate.totalDuration}
                              </div>
                            </div>
                            
                            {selectedProjectInsights.aiInsights.timelineEstimate.phases && (
                              <TimelineVisualization>
                                {selectedProjectInsights.aiInsights.timelineEstimate.phases.map((phase, index) => (
                                  <TimelineItem key={index}>
                                    <div className="phase">{phase.phase}</div>
                                    <div className="duration">{phase.duration}</div>
                                    <div className="tasks">
                                      {phase.tasks?.slice(0, 2).map((task, taskIndex) => (
                                        <div key={taskIndex}>• {task}</div>
                                      ))}
                                    </div>
                                  </TimelineItem>
                                ))}
                              </TimelineVisualization>
                            )}
                          </InsightCard>
                        </InsightSection>
                      )}
                      
                      {/* MVP Definition */}
                      {selectedProjectInsights.aiInsights.mvpDefinition && (
                        <InsightSection>
                          <h3>
                            <FaRocket />
                            {t('projects.summary.mvp', 'MVP Timeline')}
                          </h3>
                          <InsightCard>
                            <DetailGrid>
                              <DetailItem>
                                <strong>{t('projects.summary.mvpTimeline', 'MVP Timeline')}:</strong>
                                <span>{selectedProjectInsights.aiInsights.mvpDefinition.timeline}</span>
                              </DetailItem>
                              <DetailItem>
                                <strong>{t('projects.summary.mvpCost', 'MVP Cost')}:</strong>
                                <span>{selectedProjectInsights.aiInsights.mvpDefinition.costEstimate}</span>
                              </DetailItem>
                            </DetailGrid>
                          </InsightCard>
                        </InsightSection>
                      )}
                    </>
                  )}

                  {/* Next Steps Tab */}
                  {activeTab === 'next' && (
                    <>
                      {selectedProjectInsights.aiInsights.nextSteps && selectedProjectInsights.aiInsights.nextSteps.length > 0 && (
                        <InsightSection>
                          <h3>
                            <FaArrowCircleRight />
                            {t('projects.summary.recommendedSteps', 'Recommended Next Steps')}
                          </h3>
                          <InsightCard>
                            {selectedProjectInsights.aiInsights.nextSteps.map((step, index) => (
                              <NextStepItem key={index}>
                                <StepNumber>{index + 1}</StepNumber>
                                <span>{step}</span>
                              </NextStepItem>
                            ))}
                          </InsightCard>
                        </InsightSection>
                      )}
                      
                      {/* Key Considerations */}
                      {selectedProjectInsights.aiInsights.projectFeasibility?.keyConsiderations && (
                        <InsightSection>
                          <h3>
                            <FaExclamationTriangle />
                            {t('projects.summary.keyConsiderations', 'Key Considerations')}
                          </h3>
                          <InsightCard>
                            <ul>
                              {selectedProjectInsights.aiInsights.projectFeasibility.keyConsiderations.map((consideration, index) => (
                                <li key={index}>{consideration}</li>
                              ))}
                            </ul>
                          </InsightCard>
                        </InsightSection>
                      )}
                    </>
                  )}

                  {/* Old tab content removed for simplified UI */}
                  {false && selectedProjectInsights.aiInsights.projectRoadmap && (
                    <InsightSection>
                      <h3>
                        <FaMapMarked />
                        {t('projects.aiInsights.projectRoadmap', 'Development Roadmap')}
                      </h3>
                      {selectedProjectInsights.aiInsights.projectRoadmap.phases.map((phase, index) => (
                            <RoadmapPhase key={index}>
                              <PhaseHeader>
                                <h4>{phase.phase}</h4>
                                <PhaseDuration>{phase.duration}</PhaseDuration>
                              </PhaseHeader>
                              <PhaseContent>
                                <PhaseSection>
                                  <h5>{t('projects.aiInsights.tasks', 'Tasks')}</h5>
                                  <ul>
                                    {phase.tasks.map((task, taskIndex) => (
                                      <li key={taskIndex}>{task}</li>
                                    ))}
                                  </ul>
                                </PhaseSection>
                                <PhaseSection>
                                  <h5>{t('projects.aiInsights.deliverables', 'Deliverables')}</h5>
                                  <ul>
                                    {phase.deliverables.map((deliverable, delIndex) => (
                                      <li key={delIndex}>{deliverable}</li>
                                    ))}
                                  </ul>
                                </PhaseSection>
                                {phase.dependencies && phase.dependencies.length > 0 && (
                                  <PhaseSection>
                                    <h5>{t('projects.aiInsights.dependencies', 'Dependencies')}</h5>
                                    <ul>
                                      {phase.dependencies.map((dep, depIndex) => (
                                        <li key={depIndex}>{dep}</li>
                                      ))}
                                    </ul>
                                  </PhaseSection>
                                )}
                              </PhaseContent>
                            </RoadmapPhase>
                          ))}
                        </InsightSection>
                      )}
                    </>
                  )}

                  {false && (
                    <>
                      {/* MVP Definition - Hidden */}
                      {selectedProjectInsights.aiInsights.mvpDefinition && (
                        <InsightSection>
                          <h3>
                            <FaRocket />
                            {t('projects.aiInsights.mvp', 'MVP Definition')}
                          </h3>
                          <InsightCard>
                            <DetailGrid>
                              <DetailItem>
                                <strong>{t('projects.aiInsights.mvpTimeline', 'Timeline')}:</strong>
                                <span>{selectedProjectInsights.aiInsights.mvpDefinition.timeline}</span>
                              </DetailItem>
                              <DetailItem>
                                <strong>{t('projects.aiInsights.mvpCost', 'Cost Estimate')}:</strong>
                                <span>{selectedProjectInsights.aiInsights.mvpDefinition.costEstimate}</span>
                              </DetailItem>
                            </DetailGrid>
                            
                            <h4>{t('projects.aiInsights.mvpFeatures', 'Core MVP Features')}</h4>
                            <ul>
                              {selectedProjectInsights.aiInsights.mvpDefinition.coreFeatures.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                            
                            {selectedProjectInsights.aiInsights.mvpDefinition.successMetrics && (
                              <>
                                <h4>{t('projects.aiInsights.successMetrics', 'Success Metrics')}</h4>
                                <ul>
                                  {selectedProjectInsights.aiInsights.mvpDefinition.successMetrics.map((metric, index) => (
                                    <li key={index}>{metric}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </InsightCard>
                        </InsightSection>
                      )}
                    </>
                  )}

                  {activeTab === 'financial' && (
                    <>
                      {/* Budget Analysis */}
                      {selectedProjectInsights.aiInsights.budgetAnalysis && (
                        <InsightSection>
                          <h3>
                            <FaMoneyBillWave />
                            {t('projects.aiInsights.budgetBreakdown', 'Budget Breakdown')}
                          </h3>
                          <InsightCard>
                            <BudgetTotal>
                              <h4>{t('projects.aiInsights.totalEstimate', 'Total Estimate')}</h4>
                              <BudgetAmount>{selectedProjectInsights.aiInsights.budgetAnalysis.estimatedCost}</BudgetAmount>
                            </BudgetTotal>
                            
                            {selectedProjectInsights.aiInsights.budgetAnalysis.costBreakdown && (
                              <BudgetBreakdown>
                                {Object.entries(selectedProjectInsights.aiInsights.budgetAnalysis.costBreakdown).map(([category, cost]) => (
                                  <BudgetItem key={category}>
                                    <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                                    <span>{cost}</span>
                                  </BudgetItem>
                                ))}
                              </BudgetBreakdown>
                            )}
                            
                            {selectedProjectInsights.aiInsights.budgetAnalysis.costOptimizationTips && (
                              <>
                                <h4>{t('projects.aiInsights.costOptimization', 'Cost Optimization Tips')}</h4>
                                <ul>
                                  {selectedProjectInsights.aiInsights.budgetAnalysis.costOptimizationTips.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </InsightCard>
                        </InsightSection>
                      )}

                      {/* Team Composition */}
                      {selectedProjectInsights.aiInsights.teamComposition && (
                        <InsightSection>
                          <h3>
                            <FaUsersCog />
                            {t('projects.aiInsights.teamRequirements', 'Team Requirements')}
                          </h3>
                          <InsightCard>
                            <TeamGrid>
                              <TeamCategory>
                                <h4>{t('projects.aiInsights.immediateTeam', 'Immediate Needs')}</h4>
                                {selectedProjectInsights.aiInsights.teamComposition.immediate.map((role, index) => (
                                  <TeamBadge key={index} type="immediate">{role}</TeamBadge>
                                ))}
                              </TeamCategory>
                              <TeamCategory>
                                <h4>{t('projects.aiInsights.futureTeam', 'Future Expansion')}</h4>
                                {selectedProjectInsights.aiInsights.teamComposition.future.map((role, index) => (
                                  <TeamBadge key={index} type="future">{role}</TeamBadge>
                                ))}
                              </TeamCategory>
                            </TeamGrid>
                            
                            {selectedProjectInsights.aiInsights.teamComposition.estimatedHours && (
                              <>
                                <h4>{t('projects.aiInsights.estimatedHours', 'Estimated Hours')}</h4>
                                <HoursGrid>
                                  {Object.entries(selectedProjectInsights.aiInsights.teamComposition.estimatedHours).map(([category, hours]) => (
                                    <HourItem key={category}>
                                      <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                                      <span>{hours} hours</span>
                                    </HourItem>
                                  ))}
                                </HoursGrid>
                              </>
                            )}
                          </InsightCard>
                        </InsightSection>
                      )}
                    </>
                  )}

                  {activeTab === 'risks' && (
                    <>
                      {/* Risk Assessment */}
                      {selectedProjectInsights.aiInsights.riskAssessment && (
                        <InsightSection>
                          <h3>
                            <FaExclamationTriangle />
                            {t('projects.aiInsights.riskAssessment', 'Risk Assessment')}
                          </h3>
                          {selectedProjectInsights.aiInsights.riskAssessment.potentialRisks.map((risk, index) => (
                            <RiskCard key={index} impact={risk.impact}>
                              <RiskHeader>
                                <RiskTitle>{risk.risk}</RiskTitle>
                                <RiskImpact impact={risk.impact}>{risk.impact}</RiskImpact>
                              </RiskHeader>
                              <RiskMitigation>
                                <strong>{t('projects.aiInsights.mitigation', 'Mitigation')}:</strong> {risk.mitigation}
                              </RiskMitigation>
                            </RiskCard>
                          ))}
                        </InsightSection>
                      )}

                      {/* Security Requirements */}
                      {selectedProjectInsights.aiInsights.securityRequirements && (
                        <InsightSection>
                          <h3>
                            <FaUserShield />
                            {t('projects.aiInsights.securityRequirements', 'Security Requirements')}
                          </h3>
                          <InsightCard>
                            <SecurityGrid>
                              {selectedProjectInsights.aiInsights.securityRequirements.authentication && (
                                <SecurityCategory>
                                  <h4>{t('projects.aiInsights.authentication', 'Authentication')}</h4>
                                  <ul>
                                    {selectedProjectInsights.aiInsights.securityRequirements.authentication.map((item, index) => (
                                      <li key={index}>{item}</li>
                                    ))}
                                  </ul>
                                </SecurityCategory>
                              )}
                              {selectedProjectInsights.aiInsights.securityRequirements.dataProtection && (
                                <SecurityCategory>
                                  <h4>{t('projects.aiInsights.dataProtection', 'Data Protection')}</h4>
                                  <ul>
                                    {selectedProjectInsights.aiInsights.securityRequirements.dataProtection.map((item, index) => (
                                      <li key={index}>{item}</li>
                                    ))}
                                  </ul>
                                </SecurityCategory>
                              )}
                              {selectedProjectInsights.aiInsights.securityRequirements.compliance && (
                                <SecurityCategory>
                                  <h4>{t('projects.aiInsights.compliance', 'Compliance')}</h4>
                                  <ul>
                                    {selectedProjectInsights.aiInsights.securityRequirements.compliance.map((item, index) => (
                                      <li key={index}>{item}</li>
                                    ))}
                                  </ul>
                                </SecurityCategory>
                              )}
                            </SecurityGrid>
                          </InsightCard>
                        </InsightSection>
                      )}

                      {/* Maintenance Strategy */}
                      {selectedProjectInsights.aiInsights.maintenanceStrategy && (
                        <InsightSection>
                          <h3>
                            <FaTools />
                            {t('projects.aiInsights.maintenance', 'Maintenance Strategy')}
                          </h3>
                          <InsightCard>
                            <DetailGrid>
                              <DetailItem>
                                <strong>{t('projects.aiInsights.updateFrequency', 'Update Frequency')}:</strong>
                                <span>{selectedProjectInsights.aiInsights.maintenanceStrategy.updateFrequency}</span>
                              </DetailItem>
                              <DetailItem>
                                <strong>{t('projects.aiInsights.backupStrategy', 'Backup Strategy')}:</strong>
                                <span>{selectedProjectInsights.aiInsights.maintenanceStrategy.backupStrategy}</span>
                              </DetailItem>
                              <DetailItem>
                                <strong>{t('projects.aiInsights.supportModel', 'Support Model')}:</strong>
                                <span>{selectedProjectInsights.aiInsights.maintenanceStrategy.supportModel}</span>
                              </DetailItem>
                            </DetailGrid>
                            
                            {selectedProjectInsights.aiInsights.maintenanceStrategy.monitoringTools && (
                              <>
                                <h4>{t('projects.aiInsights.monitoringTools', 'Monitoring Tools')}</h4>
                                <div>
                                  {selectedProjectInsights.aiInsights.maintenanceStrategy.monitoringTools.map((tool, index) => (
                                    <TechBadge key={index}>{tool}</TechBadge>
                                  ))}
                                </div>
                              </>
                            )}
                          </InsightCard>
                        </InsightSection>
                      )}
                    </>
                  )}

                  {/* Ideas Tab */}
                  {activeTab === 'ideas' && (
                    <>
                      {/* Project Ideas */}
                      {selectedProjectInsights.aiInsights.projectIdeas && (
                        <InsightSection>
                          <h3>
                            <FaRocket />
                            {t('projects.aiInsights.projectIdeas', 'Project Ideas & Innovations')}
                          </h3>
                          
                          {/* Innovative Features */}
                          {selectedProjectInsights.aiInsights.projectIdeas.innovativeFeatures && (
                            <InsightCard>
                              <h4>{t('projects.aiInsights.innovativeFeatures', 'Innovative Features')}</h4>
                              <ul>
                                {selectedProjectInsights.aiInsights.projectIdeas.innovativeFeatures.map((feature, index) => (
                                  <li key={index}>{feature}</li>
                                ))}
                              </ul>
                            </InsightCard>
                          )}
                          
                          {/* UX Enhancements */}
                          {selectedProjectInsights.aiInsights.projectIdeas.userExperienceEnhancements && (
                            <InsightCard>
                              <h4>{t('projects.aiInsights.uxEnhancements', 'User Experience Enhancements')}</h4>
                              <ul>
                                {selectedProjectInsights.aiInsights.projectIdeas.userExperienceEnhancements.map((enhancement, index) => (
                                  <li key={index}>{enhancement}</li>
                                ))}
                              </ul>
                            </InsightCard>
                          )}
                          
                          {/* AI Integration Opportunities */}
                          {selectedProjectInsights.aiInsights.projectIdeas.aiIntegrationOpportunities && (
                            <InsightCard>
                              <h4>{t('projects.aiInsights.aiIntegration', 'AI Integration Opportunities')}</h4>
                              <ul>
                                {selectedProjectInsights.aiInsights.projectIdeas.aiIntegrationOpportunities.map((opportunity, index) => (
                                  <li key={index}>{opportunity}</li>
                                ))}
                              </ul>
                            </InsightCard>
                          )}
                        </InsightSection>
                      )}
                      
                      {/* Project Thoughts */}
                      {selectedProjectInsights.aiInsights.projectThoughts && (
                        <InsightSection>
                          <h3>
                            <FaLightbulb />
                            {t('projects.aiInsights.projectThoughts', 'Strategic Analysis')}
                          </h3>
                          <MetricsGrid>
                            <MetricCard>
                              <div className="icon"><FaTrophy /></div>
                              <div className="value">{selectedProjectInsights.aiInsights.projectThoughts.strengths?.length || 0}</div>
                              <div className="label">{t('projects.aiInsights.strengths', 'Strengths')}</div>
                            </MetricCard>
                            <MetricCard>
                              <div className="icon"><FaExclamationTriangle /></div>
                              <div className="value">{selectedProjectInsights.aiInsights.projectThoughts.challenges?.length || 0}</div>
                              <div className="label">{t('projects.aiInsights.challenges', 'Challenges')}</div>
                            </MetricCard>
                            <MetricCard>
                              <div className="icon"><FaRocket /></div>
                              <div className="value">{selectedProjectInsights.aiInsights.projectThoughts.opportunities?.length || 0}</div>
                              <div className="label">{t('projects.aiInsights.opportunities', 'Opportunities')}</div>
                            </MetricCard>
                          </MetricsGrid>
                          
                          {selectedProjectInsights.aiInsights.projectThoughts.recommendations && (
                            <InsightCard>
                              <h4>{t('projects.aiInsights.recommendations', 'Strategic Recommendations')}</h4>
                              <p>{selectedProjectInsights.aiInsights.projectThoughts.recommendations}</p>
                            </InsightCard>
                          )}
                        </InsightSection>
                      )}
                    </>
                  )}
                  
                  {/* Metrics Tab */}
                  {activeTab === 'metrics' && (
                    <>
                      {/* Analytics and Metrics */}
                      {selectedProjectInsights.aiInsights.analyticsAndMetrics && (
                        <InsightSection>
                          <h3>
                            <FaChartBar />
                            {t('projects.aiInsights.analyticsMetrics', 'Analytics & Metrics')}
                          </h3>
                          
                          {/* KPIs */}
                          {selectedProjectInsights.aiInsights.analyticsAndMetrics.kpis && (
                            <InsightCard>
                              <h4>{t('projects.aiInsights.kpis', 'Key Performance Indicators')}</h4>
                              <ul>
                                {selectedProjectInsights.aiInsights.analyticsAndMetrics.kpis.map((kpi, index) => (
                                  <li key={index}>{kpi}</li>
                                ))}
                              </ul>
                            </InsightCard>
                          )}
                          
                          {/* Analytics Tools */}
                          {selectedProjectInsights.aiInsights.analyticsAndMetrics.analyticsTools && (
                            <InsightCard>
                              <h4>{t('projects.aiInsights.analyticsTools', 'Recommended Analytics Tools')}</h4>
                              <div>
                                {selectedProjectInsights.aiInsights.analyticsAndMetrics.analyticsTools.map((tool, index) => (
                                  <TechBadge key={index}>{tool}</TechBadge>
                                ))}
                              </div>
                            </InsightCard>
                          )}
                        </InsightSection>
                      )}
                      
                      {/* Performance Optimization */}
                      {selectedProjectInsights.aiInsights.performanceOptimization && (
                        <InsightSection>
                          <h3>
                            <FaBolt />
                            {t('projects.aiInsights.performanceOptimization', 'Performance Optimization')}
                          </h3>
                          <InsightCard>
                            <h4>{t('projects.aiInsights.frontendOptimizations', 'Frontend Optimizations')}</h4>
                            <ul>
                              {selectedProjectInsights.aiInsights.performanceOptimization.frontendOptimizations?.map((opt, index) => (
                                <li key={index}>{opt}</li>
                              ))}
                            </ul>
                          </InsightCard>
                          <InsightCard>
                            <h4>{t('projects.aiInsights.backendOptimizations', 'Backend Optimizations')}</h4>
                            <ul>
                              {selectedProjectInsights.aiInsights.performanceOptimization.backendOptimizations?.map((opt, index) => (
                                <li key={index}>{opt}</li>
                              ))}
                            </ul>
                          </InsightCard>
                        </InsightSection>
                      )}
                      
                      {/* Monetization Strategy */}
                      {selectedProjectInsights.aiInsights.monetizationStrategy && (
                        <InsightSection>
                          <h3>
                            <FaMoneyBillWave />
                            {t('projects.aiInsights.monetization', 'Monetization Strategy')}
                          </h3>
                          <InsightCard>
                            {selectedProjectInsights.aiInsights.monetizationStrategy.revenueModels && (
                              <>
                                <h4>{t('projects.aiInsights.revenueModels', 'Revenue Models')}</h4>
                                <ul>
                                  {selectedProjectInsights.aiInsights.monetizationStrategy.revenueModels.map((model, index) => (
                                    <li key={index}>{model}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                            
                            {selectedProjectInsights.aiInsights.monetizationStrategy.pricingStrategy && (
                              <>
                                <h4>{t('projects.aiInsights.pricingStrategy', 'Pricing Strategy')}</h4>
                                <p>{selectedProjectInsights.aiInsights.monetizationStrategy.pricingStrategy}</p>
                              </>
                            )}
                            
                            {selectedProjectInsights.aiInsights.monetizationStrategy.projectedRevenue && (
                              <>
                                <h4>{t('projects.aiInsights.projectedRevenue', 'Revenue Projections')}</h4>
                                <BudgetBreakdown>
                                  <BudgetItem>
                                    <span className="label">{t('projects.aiInsights.month3', '3 Months')}</span>
                                    <span className="value">{selectedProjectInsights.aiInsights.monetizationStrategy.projectedRevenue.month3}</span>
                                  </BudgetItem>
                                  <BudgetItem>
                                    <span className="label">{t('projects.aiInsights.month6', '6 Months')}</span>
                                    <span className="value">{selectedProjectInsights.aiInsights.monetizationStrategy.projectedRevenue.month6}</span>
                                  </BudgetItem>
                                  <BudgetItem>
                                    <span className="label">{t('projects.aiInsights.year1', 'Year 1')}</span>
                                    <span className="value">{selectedProjectInsights.aiInsights.monetizationStrategy.projectedRevenue.year1}</span>
                                  </BudgetItem>
                                </BudgetBreakdown>
                              </>
                            )}
                          </InsightCard>
                        </InsightSection>
                      )}
                    </>
                  )}
                    </>
                  )}

                  {/* Next steps moved to dedicated tab */}
                </>
              )}
            </InsightsBody>
          </InsightsContent>
        </InsightsModal>
      )}
    </PanelContainer>
  );
};

// Custom IconContainer component for ProjectsPanel
const IconContainer = ({ icon: Icon, color, size, background, round, padding, margin, onClick, disabled, className, ...props }) => {
  return (
    <StyledIconWrapper 
      color={color}
      size={size}
      background={background}
      round={round}
      padding={padding}
      margin={margin}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={className} 
      {...props}
    >
      <Icon />
    </StyledIconWrapper>
  );
};

// Helper function to get status background colors
const getStatusBackground = (status) => {
  switch(status) {
    case 'inProgress': return 'linear-gradient(90deg, #82a1bf, #5a8bbf)';
    case 'done': return 'linear-gradient(90deg, #4CAF50, #2E7D32)';
    case 'awaitingFeedback': return 'linear-gradient(90deg, #faaa93, #e57373)';
    default: return 'linear-gradient(90deg, #9E9E9E, #616161)';
  }
};

export default React.memo(ProjectsPanel);
