import styled, { css } from 'styled-components';
import { fadeInUp } from './animations';

//-----------------------------------------------------------------------------
// BASE COMPONENTS - Foundational styled components that others inherit from
//-----------------------------------------------------------------------------

// Base Container - Common styles for containers with gradient background and decorative elements
export const BaseContainer = styled.div`
  background: linear-gradient(145deg, #1a1a20, #1d1d25);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(205, 62, 253, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
    border-radius: 50%;
    pointer-events: none;
  }
`;

// Base Card - Foundation for card-like elements
export const BaseCard = styled.div`
  background: linear-gradient(145deg, #1c1c24, #1e1e28);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.5s ease-out;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    border-color: rgba(205, 62, 253, 0.3);
  }
`;

// Base Button - Foundation for button components
export const BaseButton = styled.button`
  border-radius: 8px;
  padding: 0.7rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    font-size: 1rem;
  }
`;

// Base Input - Common styles for form inputs
export const BaseInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
  }
`;

// Base Title - Common styles for section titles
export const BaseTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  font-weight: 600;
  position: relative;
`;

//-----------------------------------------------------------------------------
// TYPOGRAPHY COMPONENTS - Text and heading styled components
//-----------------------------------------------------------------------------

// Title styles used across dashboard components
export const DashboardTitle = styled(BaseTitle)`
  color: #fff;
  font-size: 1.5rem;
  background: linear-gradient(90deg, #cd3efd, #7b2cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #cd3efd, #7b2cbf);
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

// Common container for dashboard panel components
export const DashboardPanelContainer = styled(BaseContainer)`
  width: 100%;
  padding: 1.5rem 0;
  
  /* Override the :before pseudo-element from BaseContainer to change position */
  &:before {
    top: -50px;
    left: -50px;
    background: radial-gradient(circle, rgba(123, 44, 191, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 0;
  }
`;

//-----------------------------------------------------------------------------
// PANEL & HEADER COMPONENTS - Panel, header, and container components
//-----------------------------------------------------------------------------

// Header style used in dashboard panels
export const PanelHeader = styled(BaseContainer)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  
  /* Override the :before pseudo-element from BaseContainer */
  &:before {
    top: -50px;
    right: -50px;
    background: radial-gradient(circle, rgba(205, 62, 253, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

// Dashboard panel
export const DashboardPanel = styled(BaseContainer)`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: ${fadeInUp} 0.6s ease-out;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Panel container
export const PanelContainer = styled.div`
  padding: 1.5rem;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

//-----------------------------------------------------------------------------
// CARD COMPONENTS - Reusable card components 
//-----------------------------------------------------------------------------

// Card container for dashboard items
export const Card = styled(BaseCard)`
  padding: 1.5rem;
`;

// Grid layout for cards
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  
  /* Add specific decoration to cards */
  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(123, 44, 191, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
    border-radius: 50%;
    transform: translate(30%, 30%);
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem;
    margin-bottom: 1rem;
  }
`;

//-----------------------------------------------------------------------------
// QUICK ACTION COMPONENTS - Quick action buttons and containers
//-----------------------------------------------------------------------------

// Quick Actions Container
export const QuickActionsContainer = styled(BaseContainer)`
  padding: 1.8rem;
  margin-bottom: 2rem;
  
  /* Override the :before pseudo-element from BaseContainer */
  &:before {
    top: -50px;
    left: -50px;
    background: radial-gradient(circle, rgba(123, 44, 191, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

// Quick Action Button
export const QuickActionButton = styled(BaseButton)`
  flex-direction: column;
  width: 110px;
  height: 100px;
  background: linear-gradient(145deg, #1c1c24, #1e1e28);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, #cd3efd, #7b2cbf);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  svg {
    font-size: 1.8rem;
    margin-bottom: 0.7rem;
    color: #cd3efd;
    filter: drop-shadow(0 2px 4px rgba(205, 62, 253, 0.4));
  }
  
  span {
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  &:hover {
    background: linear-gradient(145deg, #1d1d25, #1f1f2a);
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    
    &:after {
      transform: scaleX(1);
    }
    
    svg {
      transform: scale(1.1);
    }
  }
  
  &:active {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
    
    svg {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    span {
      font-size: 0.75rem;
    }
  }
`;

//-----------------------------------------------------------------------------
// WELCOME SECTION COMPONENTS - Components for the welcome/greeting section
//-----------------------------------------------------------------------------

// Welcome Section container
export const WelcomeSection = styled(BaseContainer)`
  margin-bottom: 2rem;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

// Welcome Text
export const WelcomeText = styled.div`
  flex: 1;
  
  h1 {
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    color: #fff;
    font-weight: 700;
    background: linear-gradient(90deg, #fff, #e0e0e0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
  }
  
  h2 {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 500;
    color: #999;
    
    span {
      font-weight: 600;
      color: #fff;
      position: relative;
      
      &:after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, #cd3efd, #7b2cbf);
      }
    }
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 1.8rem;
    }
    
    h2 {
      font-size: 1.3rem;
    }
  }
`;

// Quick Action Buttons
export const QuickActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  
  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

//-----------------------------------------------------------------------------
// KANBAN BOARD COMPONENTS - Kanban layout and task management components
//-----------------------------------------------------------------------------

// Kanban Board - Main container for Kanban columns
export const KanbanBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// Kanban Column - Container for a column of tasks
export const KanbanColumn = styled(BaseContainer)`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
`;

// Column Header - Header for each Kanban column
export const ColumnHeader = styled.div`
  padding: 1rem 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Column Title - Title for each Kanban column
export const ColumnTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.color || '#cd3efd'};
  }
`;

// Empty Column Message - Displayed when a column has no tasks
export const EmptyColumnMessage = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #666;
  font-size: 0.9rem;
`;

// Column Content - Container for tasks in a column
export const ColumnContent = styled.div`
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(123, 44, 191, 0.5);
    border-radius: 3px;
  }
`;

// Quick Action Title - Title for quick action sections
export const QuickActionTitle = styled.h3`
  margin: 0 0 1.2rem 0;
  font-size: 1.2rem;
  color: #fff;
  font-weight: 600;
  position: relative;
  padding-left: 1rem;
  display: inline-block;
  background-color: ${props => {
    switch (props.priority) {
      case 'high':
        return 'rgba(244, 67, 54, 0.2)';
      case 'medium':
        return 'rgba(255, 152, 0, 0.2)';
      case 'low':
        return 'rgba(76, 175, 80, 0.2)';
      default:
        return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#ccc';
    }
  }};
`;

export const TaskDescription = styled.p`
  margin: 0 0 0.8rem 0;
  font-size: 0.9rem;
  color: #ccc;
  line-height: 1.4;
`;

export const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #999;
`;

export const TaskMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;





//-----------------------------------------------------------------------------
// PROGRESS COMPONENTS - Progress bars, indicators, and related components
//-----------------------------------------------------------------------------

// Progress Title - Title for progress sections
export const ProgressTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

// Progress Text - Descriptive text for progress indicators
export const ProgressText = styled.div`
  font-size: 0.9rem;
  color: #aaa;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Progress Bar - Base progress bar component
export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 0.8rem 0;
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(to right, #cd3efd, #7b2cbf);
    border-radius: 3px;
  }
`;

//-----------------------------------------------------------------------------
// TASK CARD COMPONENTS - Task cards and related components
//-----------------------------------------------------------------------------

// Progress components for focus section
export const FocusProgressBar = styled(ProgressBar)`
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  position: relative;
  overflow: hidden;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(to right, #cd3efd, #7b2cbf);
    border-radius: 4px;
  }
`;

// Task components
export const TaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

export const TaskStatus = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  ${props => props.status === 'done' && css`
    background: linear-gradient(145deg, #2a9d8f, #20796c);
    box-shadow: 0 2px 5px rgba(42, 157, 143, 0.5);
    color: #fff;
  `}
  
  ${props => props.status === 'pending' && css`
    background: linear-gradient(145deg, #454545, #353535);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    color: #999;
  `}
  
  svg {
    font-size: 0.7rem;
  }
`;

export const TaskText = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  text-decoration: ${props => props.status === 'done' ? 'line-through' : 'none'};
  opacity: ${props => props.status === 'done' ? 0.7 : 1};
`;

export const TaskCard = styled.div`
  background: linear-gradient(145deg, #1c1c24, #1e1e28);
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.4s ease-out;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
    border-color: rgba(205, 62, 253, 0.2);
  }
`;

// Compact progress components for overview
export const CompactProgressWrapper = styled.div`
  width: 60px;
  height: 60px;
  margin-right: 1rem;
`;

export const CompactProgressTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.3rem;
`;

export const CompactStatItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

export const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #cd3efd;
`;

export const StatLabel = styled.span`
  font-size: 0.85rem;
  color: #aaa;
`;

// Focus container
export const FocusContainer = styled.div`
  padding: 0 1.5rem 1.5rem;
`;

// Timeline components
export const TimelineContainer = styled.div`
  padding: 1rem;
`;

export const DateGroup = styled.div`
  margin-bottom: 2rem;
`;

export const DateHeader = styled.div`
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  position: relative;
`;

export const DateLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #cd3efd;
  background: linear-gradient(145deg, #1c1c24, #1e1e28);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: inline-block;
  border: 1px solid rgba(205, 62, 253, 0.3);
`;

export const TimelineItem = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  position: relative;
`;

export const TimelineIconContainer = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  box-shadow: none;
  
  svg {
    color: #cd3efd;
    font-size: 1rem;
  }
  
  ${props => props.type === 'project' && css`
    svg {
      color: #3ecffd;
    }
  `}
  
  ${props => props.type === 'task' && css`
    svg {
      color: #fdcd3e;
    }
  `}
  
  ${props => props.type === 'comment' && css`
    svg {
      color: #3efd9a;
    }
  `}
`;

export const TimelineContent = styled.div`
  flex: 1;
`;

export const ActivityTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: #fff;
  margin-bottom: 0.5rem;
  
  span {
    font-weight: 600;
    color: #cd3efd;
  }
`;

export const ActivityMeta = styled.div`
  font-size: 0.8rem;
  color: #999;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  span {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

export const ActivityComment = styled.div`
  font-size: 0.9rem;
  color: #ccc;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  margin-top: 0.5rem;
  border-left: 3px solid #cd3efd;
`;

// Empty state components
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: none;
  
  svg {
    color: #7b2cbf;
    font-size: 2rem;
    opacity: 0.7;
  }
`;

export const EmptyText = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #aaa;
  margin-bottom: 1.5rem;
  max-width: 400px;
`;

//-----------------------------------------------------------------------------
// BUTTON COMPONENTS - Various button styles used throughout the dashboard
//-----------------------------------------------------------------------------

// Primary action button with gradient background
export const PrimaryButton = styled(BaseButton)`
  background: linear-gradient(90deg, #cd3efd, #7b2cbf);
  color: #fff;
  border: none;
  box-shadow: 0 4px 10px rgba(123, 44, 191, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(123, 44, 191, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(123, 44, 191, 0.3);
  }
`;

// Secondary action button with subtle styling
export const SecondaryButton = styled(BaseButton)`
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.15);
  }
`;



// Task Count - Counter for tasks in a column
export const TaskCount = styled.span`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  color: #aaa;
`;

//-----------------------------------------------------------------------------
// TASK CARD COMPONENTS - Components for task cards in the Kanban board
//-----------------------------------------------------------------------------

export const TaskCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
`;

export const TaskTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

export const PriorityBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  
  ${props => props.priority === 'high' && css`
    background: rgba(255, 82, 82, 0.2);
    color: #ff5252;
  `}
  
  ${props => props.priority === 'medium' && css`
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
  `}
  
  ${props => props.priority === 'low' && css`
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  `}
`;

//-----------------------------------------------------------------------------
// FORM COMPONENTS - Form inputs and related components
//-----------------------------------------------------------------------------

// Form input
export const Input = styled(BaseInput)`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  
  &:focus {
    border-color: rgba(205, 62, 253, 0.5);
    box-shadow: 0 0 0 2px rgba(205, 62, 253, 0.2);
  }
  
  &::placeholder {
    color: #666;
  }
`;





// Add Task Button - Button for adding new tasks
export const AddTaskButton = styled(BaseButton)`
  width: 100%;
  padding: 0.8rem;
  background: rgba(123, 44, 191, 0.2);
  border: 1px dashed rgba(205, 62, 253, 0.5);
  border-radius: 10px;
  color: #cd3efd;
  
  &:hover {
    background: rgba(123, 44, 191, 0.3);
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

//-----------------------------------------------------------------------------
// MODAL COMPONENTS - Modal dialogs and related components
//-----------------------------------------------------------------------------

// Enhanced Modal Content with dark theme and decorative elements
export const ModalContent = styled(BaseContainer)`
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 550px;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  svg {
    font-size: 0.8rem;
    color: #cd3efd;
    margin-right: 0.3rem;
  }
`;
