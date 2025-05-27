# DevFolio UI Design Documentation

## Overview
This document outlines the UI design elements, animations, and interaction patterns used in the DevFolio application. It serves as a reference for maintaining design consistency across the application.

## Color Palette

### Primary Colors
- **Background Color**: `#feefc4` - Light cream background that provides a warm, inviting canvas
- **Accent Color 1**: `#faaa93` - Coral pink used for primary actions and highlights
- **Accent Color 2**: `#82a1bf` - Soft blue used for secondary actions and information
- **Dark Color**: `#513a52` - Deep purple used for text and important elements

### Secondary Colors
- **Success**: `#4CAF50` - Green used for success states and active indicators
- **Warning**: `#FFC107` - Amber used for warning states and pending indicators
- **Neutral**: `#9E9E9E` - Gray used for inactive or draft states
- **White**: `#FFFFFF` - Used for card backgrounds and text on dark backgrounds
- **Light Gray**: `#f7f9fc` - Used for inactive button backgrounds

## Typography

### Headings
- **H1 (Page Title)**: 1.75rem, 600 weight, `#513a52` color
- **H2 (Section Title)**: 1.5rem, 600 weight, `#513a52` color
- **H3 (Card Title)**: 1.1rem, 600 weight, `#513a52` color

### Body Text
- **Regular Text**: 0.95rem, 400 weight, `#513a52` color
- **Small Text**: 0.85rem, 400 weight, `#666` color
- **Badge Text**: 0.75rem, 500 weight, white color

## Icons

### Icon Implementation
- **Clean Design**: All icons must be implemented without backgrounds or decorative elements
- **Size Standard**: 32px × 32px for interactive icons, 24px × 24px for inline icons
- **Color Coding**: Icons use semantic colors to indicate status and actions:
  - In Progress: `#4a6cf7` (blue)
  - Done: `#27ae60` (green)
  - Awaiting Feedback: `#e74c3c` (red)
  - Edit: `#FFC107` (yellow)
  - Delete: `#e74c3c` (red)
  - View: `#4a6cf7` (blue)
  - Neutral/Default: `#666` (gray)

### Icon Styling Guidelines
- **Base Implementation**: Icons should be rendered directly without any container elements that might add unwanted styling
- **CSS Requirements**:
  ```css
  /* Icon button styling */
  const IconButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    box-shadow: none;
    border-radius: 0;
    width: 32px;
    height: 32px;
    
    /* Explicitly remove any potential background or decoration */
    &::before, &::after {
      display: none;
    }
    
    /* Icon sizing */
    svg {
      font-size: 1.25rem;
    }
    
    /* Hover effect */
    &:hover {
      transform: scale(1.15);
      background: transparent;
    }
  `;
  ```

### Layout and Filter Controls
- **Clean Implementation**: Layout toggles, filter buttons, and sort controls must follow the same clean icon implementation
- **Container Styling**:
  ```css
  /* Container for icon groups */
  const ControlGroup = styled.div`
    display: flex;
    gap: ${spacing.sm};
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
  `;
  ```

- **Toggle Button Styling**:
  ```css
  /* Toggle button for layout switching */
  const ToggleButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    position: relative;
    transition: ${transitions.medium};
    border: none;
    cursor: pointer;
    background: transparent;
    padding: 0;
    box-shadow: none;
    border-radius: 0;
    color: ${props => props.active ? colors.accent.primary : colors.text.secondary};
    
    /* Remove any potential background or decoration */
    &::before, &::after {
      display: none;
    }
    
    svg {
      font-size: 1.25rem;
    }
    
    &:hover {
      transform: scale(1.15);
      background: transparent;
    }
  `;
  ```

- **Select Control Styling**:
  ```css
  /* Clean select dropdown */
  const Select = styled.select`
    background: transparent;
    color: ${colors.text.primary};
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: ${spacing.xs} ${spacing.sm};
    appearance: none;
    cursor: pointer;
    transition: ${transitions.medium};
    font-size: ${typography.fontSizes.sm};
    min-width: 120px;
    
    &:focus {
      outline: none;
      border-bottom-color: ${colors.accent.primary};
    }
    
    &:hover {
      border-bottom-color: ${colors.accent.primary};
    }
  `;
  ```

### Accessibility
- All icons must include `title` and `aria-label` attributes
- Interactive icons should have tooltips for better usability
- Tooltip implementation should be consistent across the application

## Animations

### Keyframes
- **fadeIn**: Simple opacity transition from 0 to 1
- **slideUp**: Combination of vertical movement and opacity change
- **slideInRight**: Horizontal slide from right with opacity change
- **slideInLeft**: Horizontal slide from left with opacity change
- **pulse**: Subtle scaling effect for drawing attention
- **shimmer**: Background position animation for loading states
- **rotate**: 360-degree rotation for loading indicators
- **shine**: Gradient sweep effect for buttons

### Animation Usage
- **Card Entrance**: Cards use staggered animations with `fadeIn`, `slideUp`, `slideInLeft`, or `slideInRight`
- **Hover Effects**: Elements scale, change shadow depth, and may trigger color transitions
- **Button Interactions**: Buttons use `shine` effect on hover and transform on click
- **Status Indicators**: Badges use subtle scaling and glow effects

## Components

### Dashboard Components

#### Dark Theme Elements
The dashboard implements a consistent dark theme with the following design characteristics:

- **Background**: Dark purple gradient (`linear-gradient(145deg, #1a1a20, #1d1d25)`) for all containers and panels
- **Card Elements**: Deep background gradient with subtle shadows and border highlights
- **Text**: White text (`#fff`) for ALL text on dark backgrounds to ensure visibility and accessibility
- **Accent Colors**: Purple gradient (`linear-gradient(90deg, #cd3efd, #7b2cbf)`) for interactive elements and highlights
- **Secondary Background**: Slightly lighter dark background for cards and form elements (`#272730`)

#### Interactive Elements
- **Hover Effects**: Elements scale slightly and increase shadow depth on hover with subtle glow effects
- **Progress Bars**: Animated gradient fills with smooth transitions
- **Action Buttons**: Gradient backgrounds with hover animations and shadow effects
- **Transitions**: All interactive elements use consistent transition times (300ms) for smooth interactions

#### Key Dashboard Components

- **DashboardPanel**: Container for dashboard sections with gradient background and subtle decorative elements
- **WelcomeSection**: Personalized greeting area with gradient background and status information
- **FocusContainer**: Container for prioritized weekly tasks with status indicators
- **QuickActionsContainer**: Grid of action buttons for common tasks with hover effects
- **TaskItem**: List items with status indicators (done/pending) and appropriate visual styling
- **ProgressBar/FocusProgressBar**: Visual indicators for completion status with gradient fills
- **MockupDetail**: Detailed view for design mockups with annotation tools, version history, and approval workflow

### Buttons

#### Primary Action Button (ActionButton)
- Background: Gradient background (`linear-gradient(90deg, #cd3efd, #7b2cbf)`)
- Text: Always white for visibility and contrast
- Border Radius: 8px
- Shadow: `0 4px 12px rgba(123, 44, 191, 0.3)`
- Hover: Scale up (-2px Y-translation), deeper shadow, subtle glow effect
- Active: Less Y-translation (-1px), reduced shadow
- Transitions: Smooth 300ms transitions for all properties

#### Filter/Sort Button
- Background: `#7b2cbf` (active), slightly darker variant (inactive)
- Text: Always white for visibility and contrast
- Border Radius: 6px
- Hover: Scale up, deeper shadow, gradient accent underline animation
- Active: Applied accent color with matching icon color

#### Icon Button
- Background: Transparent or subtle gradient
- Color: Always visible against background (white or bright accent colors)
- Hover: Scale up, subtle rotation, glow effect
- Active: Slight scale down

#### Add/Create Button
- Background: Gradient background (`linear-gradient(90deg, #cd3efd, #7b2cbf)`)
- Text: White with matching icon
- Border Radius: 8px
- Shadow: Medium depth shadow
- Hover: Y-translation up, increased shadow depth, subtle background shift
- RTL Support: Proper icon positioning for right-to-left languages

### Cards

#### General Card Component
- Background: Dark gradient (`#272730` to `#1d1d25`)
- Border: Subtle highlight border or left accent border (3-4px) with accent color
- Text: White for all text to ensure visibility against dark backgrounds
- Shadow: Medium depth with increased shadow on hover
- Animation: Smooth entrance animations with `fadeIn` and `slideUp` effects
- Hover: Y-translation up (-5px), increased shadow depth, subtle background shift
- Decorative Elements: Subtle gradient orbs/circles in corners for visual interest

#### Form Card
- Background: Dark gradient with accent border-left
- Header: White text with animated underline effect on hover
- Icons: Accent colored with rotation/scale effects on hover
- Metadata: Lighter colored text with upward animation on parent hover
- Border Radius: 12px
- Shadow: `0 3px 10px rgba(0, 0, 0, 0.08)`
- Padding: 1.5rem
- Hover: Scale up, deeper shadow, content animations
- Special Effects: 
  - Color indicator on left side
  - Radial gradient overlay on hover
  - Staggered animations for child elements

#### Task Card & File Card
- Background: White
- Border Radius: 8px
- Shadow: `0 2px 8px rgba(0, 0, 0, 0.05)`
- Padding: 1rem
- Border Left: 4px solid category color
- Hover: Scale up slightly (`translateY(-2px)`), deeper shadow
- Category Colors:
  - Design: `#82a1bf`
  - Docs: `#27ae60`
  - Feedback: `#faaa93`

#### Empty State
- Background: White
- Border Radius: 12px
- Shadow: `0 3px 10px rgba(0, 0, 0, 0.05)`
- Hover: Scale up, deeper shadow, gradient animations
- Content: Icon, title, description, and action button

### Form Elements

#### Search Input
- Border: 1px solid `#ddd`
- Border Radius: 4px
- Focus: Border color change, shadow effect
- Icon: Left-aligned, color changes on focus

## Responsive Design

### Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 768px to 1023px
- **Mobile**: Below 768px

### Mobile Adaptations
- Grid changes to single column
- Reduced padding and margins
- Smaller font sizes
- Adjusted button sizes
- Simplified layouts for better touch interaction

## Interaction Patterns

### Hover States
- Cards scale up and increase shadow depth
- Buttons show shine effect and may change color
- Text elements may reveal underlines or change color
- Icons may rotate or scale

### Active States
- Buttons scale down slightly
- Shadow depth reduces
- Color may darken

### Focus States
- Input fields show border color change and shadow
- Focus indicators follow accessibility guidelines

## RTL Support
The interface supports right-to-left languages with the following adaptations:
- Text alignment flips
- Icon positioning flips
- Margins and paddings adjust accordingly
- Animations direction changes where appropriate

## Accessibility Considerations
- Color contrast ratios meet WCAG 2.1 AA standards
- Interactive elements have appropriate focus states
- Icons include title attributes for screen readers
- Animations can be reduced based on user preferences

## Implementation Notes
- Styled-components is used for all styling
- Animations leverage CSS transitions and keyframes
- Responsive design uses media queries

### Icon Implementation
- Icons use the `react-icons/fa` library for consistent styling
- Action icons (delete, edit, view, etc.) use the reusable `IconButton` component
- **IMPORTANT**: Icons MUST appear without any backgrounds or containers for a cleaner, modern look
- Icon interactions include scale transforms on hover (1.15x) for subtle feedback (never use background changes)
- Color-coding for common actions:
  - Primary actions: #4a6cf7 (blue)
  - Secondary actions: #27ae60 (green)
  - Destructive actions: #e74c3c (red)
  - Neutral actions: #666 (gray)
- Icon buttons maintain consistent sizing (32px × 32px by default)
- All icons MUST include title and aria-label attributes for accessibility
- RTL support is implemented via conditional styling based on language context
- When grouping icons, use a simple flex container with appropriate spacing (gap: 8px to 12px) without any background
- Never use background colors behind icons as this reduces visual clarity and creates inconsistencies

### File Card Design
- Cards feature a modern, clean design with subtle animations
- Hover effects include:
  - A gradient top border that animates from 0 to 100% width
  - Elevation change with translateY(-5px) and enhanced shadow
  - Subtle scaling of icons and images (1.05x)
- File previews use different visual treatments based on file type:
  - Images: Actual thumbnail with subtle zoom on hover
  - Documents: Color-coded icon representation with shimmer effect
- Card footer displays essential metadata (upload date, file size)
- Action buttons have ripple-like hover effects with color-coded backgrounds
- Title underline animation provides visual feedback on hover
  - Neutral actions: #666 (gray)
- Icon buttons maintain consistent sizing (32px × 32px by default)
- All icons include title attributes for accessibility
- RTL support is implemented via conditional styling based on language context

## Recent UI Updates

### FileCard Component Redesign (May 2025)
- **Issue Fixed**: Eliminated unwanted purple background color that was overriding the intended design
- **Solution**: 
  - Completely rewrote the FileCard component to match the TaskCard styling
  - Removed duplicate styled component declarations that were causing conflicts
  - Implemented inline category color function in the Card styled component
  - Maintained consistent styling between TaskCard and FileCard for UI coherence
- **Benefits**:
  - Consistent UI between file and task components
  - Proper color scheme adherence using the project's color palette
  - Improved component structure with cleaner, more maintainable code
  - Enhanced user experience with consistent hover effects and transitions
