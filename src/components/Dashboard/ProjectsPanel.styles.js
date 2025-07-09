import styled, { css, keyframes } from 'styled-components';
import { fadeIn, slideUp } from '../../styles/animations';
import { 
  colors, 
  spacing, 
  borderRadius, 
  shadows, 
  typography, 
  transitions,
  mixins,
  breakpoints 
} from '../../styles/GlobalTheme';

// Animation keyframes
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Additional mixins specific to ProjectsPanel
const localMixins = {
  glassmorphism: css`
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.15);
  `,
  glassmorphismDark: css`
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `,
  glowEffect: css`
    box-shadow: 
      0 0 20px rgba(205, 62, 253, 0.3),
      0 0 40px rgba(205, 62, 253, 0.1),
      inset 0 0 20px rgba(205, 62, 253, 0.05);
  `,
  shimmerEffect: css`
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite;
  `
};

export const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
  text-align: ${props => props.dir === 'rtl' ? 'right' : 'left'};
  background: ${colors.background.primary};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: radial-gradient(ellipse at top, rgba(205, 62, 253, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: ${props => props.$isRTL ? 'row-reverse' : 'row'};
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.lg};
  
  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.md};
  }
`;

export const PanelTitle = styled.h2`
  font-size: ${props => props.$isRTL ? `calc(${typography.fontSizes.xl} * 1.05)` : typography.fontSizes.xl};
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.text.primary};
  margin: 0;
  text-align: ${props => props.$isRTL ? 'right' : 'left'};
`;

export const StatusFilterTab = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$active 
    ? colors.gradients.accent
    : 'transparent'};
  color: ${props => props.$active ? colors.text.primary : colors.text.secondary};
  border: 1px solid ${props => props.$active 
    ? 'transparent' 
    : 'rgba(205, 62, 253, 0.3)'};
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.md};
  font-size: ${props => props.$isRTL ? `calc(${typography.fontSizes.sm} * 1.05)` : typography.fontSizes.sm};
  cursor: pointer;
  transition: ${transitions.medium};
  position: relative;
  font-weight: ${props => props.$active ? typography.fontWeights.semiBold : typography.fontWeights.medium};
  
  &:hover {
    background: ${props => props.$active 
      ? colors.gradients.hover
      : 'rgba(205, 62, 253, 0.1)'};
    color: ${colors.text.primary};
    border-color: ${props => props.$active ? 'transparent' : colors.accent.primary};
    transform: translateY(-2px);
    box-shadow: ${props => props.$active 
      ? '0 4px 12px rgba(205, 62, 253, 0.4)' 
      : '0 2px 8px rgba(205, 62, 253, 0.2)'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    font-size: 1rem;
    color: ${props => props.$active ? colors.text.primary : 'currentColor'};
  }
`;

export const CustomFilterTabs = styled.div`
  display: flex;
  background: rgba(205, 62, 253, 0.05);
  border: 1px solid rgba(205, 62, 253, 0.2);
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xs};
  gap: ${spacing.xs};
  flex-direction: ${props => props.$isRTL ? 'row-reverse' : 'row'};
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(205, 62, 253, 0.1);
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  background-color: transparent;
  color: ${colors.text.secondary};
  border: 1px solid ${colors.border.default};
  border-radius: ${borderRadius.md};
  padding: ${spacing.xs} ${spacing.sm};
  font-size: ${typography.fontSizes.sm};
  cursor: pointer;
  transition: ${transitions.medium};
  
  &:hover {
    background-color: ${colors.background.hover};
  }
  
  svg {
    font-size: 0.875rem;
  }
`;

export const DashboardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
`;

export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${spacing.lg};
  margin-top: ${spacing.lg};
  
  @media (max-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  margin-top: ${spacing.lg};
`;

export const ProjectCard = styled.div`
  background: linear-gradient(145deg, ${colors.background.card}, ${colors.background.secondary});
  border: 1px solid transparent;
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.md};
  overflow: hidden;
  transition: ${transitions.medium};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: ${borderRadius.lg};
    padding: 1px;
    background: linear-gradient(135deg, rgba(205, 62, 253, 0.3), rgba(123, 44, 191, 0.3));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(205, 62, 253, 0.2);
    
    &::before {
      opacity: 1;
    }
  }
`;

export const ProjectCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.md};
  border-bottom: 1px solid ${colors.border.default};
`;

export const ProjectCardContent = styled.div`
  padding: ${spacing.md};
`;

export const ProjectCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.md};
  border-top: 1px solid ${colors.border.default};
  background-color: ${colors.background.subtle};
`;

export const ProjectTitle = styled.h3`
  font-size: ${typography.fontSizes.lg};
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.text.primary};
  margin: 0;
  margin-bottom: ${spacing.xs};
`;

export const ProjectType = styled.span`
  font-size: ${typography.fontSizes.xs};
  color: ${colors.text.secondary};
  background-color: ${colors.background.subtle};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: ${typography.fontSizes.xs};
  font-weight: ${typography.fontWeights.medium};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.full};
  
  ${props => {
    if (props.$status === 'completed') {
      return css`
        background-color: rgba(46, 204, 113, 0.1);
        color: ${colors.status.success};
      `;
    } else if (props.$status === 'in-progress') {
      return css`
        background-color: rgba(52, 152, 219, 0.1);
        color: ${colors.status.info};
      `;
    } else if (props.$status === 'pending') {
      return css`
        background-color: rgba(241, 196, 15, 0.1);
        color: ${colors.status.warning};
      `;
    } else {
      return css`
        background-color: rgba(189, 195, 199, 0.1);
        color: ${colors.text.secondary};
      `;
    }
  }}
`;

export const ClientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  margin: ${spacing.sm} 0;
`;

export const MoodIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${borderRadius.round};
  
  ${props => {
    if (props.$mood === 'happy') {
      return css`
        color: ${colors.status.success};
      `;
    } else if (props.$mood === 'neutral') {
      return css`
        color: ${colors.status.warning};
      `;
    } else {
      return css`
        color: ${colors.status.error};
      `;
    }
  }}
`;

export const ProjectDeadline = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
`;

export const ProjectActions = styled.div`
  display: flex;
  gap: ${spacing.xs};
`;

export const ActionIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: ${colors.text.secondary};
  border: none;
  width: 32px;
  height: 32px;
  border-radius: ${borderRadius.round};
  cursor: pointer;
  transition: ${transitions.medium};
  
  &:hover {
    color: ${colors.accent.primary};
  }
`;

export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${spacing.xl} 0;
  min-height: 300px;
`;

export const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: ${colors.text.muted};
  margin-bottom: ${spacing.md};
`;

export const EmptyStateTitle = styled.h3`
  font-size: ${typography.fontSizes.xl};
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.text.primary};
  margin: 0;
  margin-bottom: ${spacing.sm};
`;

export const EmptyStateText = styled.p`
  font-size: ${typography.fontSizes.md};
  color: ${colors.text.secondary};
  max-width: 500px;
  margin: 0 auto;
  margin-bottom: ${spacing.lg};
`;

export const EmptyStateButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  background-color: ${colors.accent.primary};
  color: ${colors.text.onAccent};
  border: none;
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.md};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: ${transitions.medium};
  
  &:hover {
    background-color: ${colors.accent.primaryDark};
  }
  
  svg {
    font-size: 1rem;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  
  @media (max-width: ${breakpoints.md}) {
    flex-wrap: wrap;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${spacing.xl};
`;

export const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: ${props => props.disabled ? colors.text.muted : colors.text.primary};
  border: 1px solid ${props => props.disabled ? colors.border.muted : colors.border.default};
  border-radius: ${borderRadius.md};
  padding: ${spacing.xs} ${spacing.sm};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: ${transitions.medium};
  
  &:not(:disabled):hover {
    background-color: ${colors.background.hover};
  }
`;

export const PaginationInfo = styled.div`
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.secondary};
`;

export const ErrorMessage = styled.div`
  background-color: rgba(244, 67, 54, 0.1);
  color: ${colors.status.error};
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.md};
  border-left: 4px solid ${colors.status.error};
`;

export const Card = styled.div`
  background-color: ${colors.background.card};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  box-shadow: ${shadows.medium};
  transition: ${transitions.medium};
  border: 1px solid ${colors.border.default};
  margin-bottom: ${spacing.md};
  overflow: hidden;
  position: relative;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.$isRTL ? 'right' : 'left'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.large};
    border-color: ${colors.border.muted};
  }
  
  @media (max-width: ${breakpoints.md}) {
    padding: ${spacing.sm};
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.xs};
  background: ${props => props.$glow 
    ? 'linear-gradient(135deg, #8338ec 0%, #6a1fd0 100%)' 
    : props.$primary 
      ? colors.accent.primary 
      : 'rgba(50, 50, 80, 0.8)'};
  color: ${props => (props.$glow || props.$primary) ? '#ffffff' : colors.text.primary};
  border: ${props => (props.$glow || props.$primary) ? 'none' : `1px solid rgba(255, 255, 255, 0.2)`};
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm} ${spacing.md};
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: ${transitions.medium};
  flex-direction: ${props => props.$isRTL ? 'row-reverse' : 'row'};
  position: relative;
  overflow: hidden;
  
  ${props => props.$glow && css`
    box-shadow: 0 4px 15px rgba(131, 56, 236, 0.3);
    
    &::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      transform: scale(0);
      transition: transform 0.5s ease;
    }
    
    &:hover::after {
      transform: scale(1);
    }
  `}
  
  &:hover {
    background: ${props => props.$glow 
      ? 'linear-gradient(135deg, #9a4ffd 0%, #7b2cbf 100%)' 
      : props.$primary 
        ? colors.accent.primaryDark 
        : 'rgba(60, 60, 100, 0.9)'};
    transform: translateY(-2px);
    box-shadow: ${props => props.$glow 
      ? '0 6px 20px rgba(131, 56, 236, 0.4)' 
      : '0 4px 10px rgba(0, 0, 0, 0.2)'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    font-size: 1rem;
    color: ${props => (props.$glow || props.$primary) ? '#ffffff' : 'currentColor'};
  }
  
  @media (max-width: ${breakpoints.md}) {
    padding: ${spacing.xs} ${spacing.sm};
    font-size: ${typography.fontSizes.xs};
  }
`;
