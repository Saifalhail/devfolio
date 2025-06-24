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

### Tab Design Implementation
- **Minimalist Approach**: Tabs use a clean, icon-only design with minimal visual elements
- **Selection Indicators**: Active tabs are indicated by a colored border and icon color change only
- **No Background Effects**: Tabs have transparent backgrounds with no gradients or highlights

#### Tab Container Implementation
```jsx
const TabsList = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.itemCount}, 1fr);
  width: 100%;
  margin-bottom: ${spacing.md};
  background: transparent;
  gap: ${spacing.xs};
`;
```

#### Tab Button Implementation
```jsx
const TabButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: ${props => props.active ? `2px solid ${colors.accent.primary}` : '2px solid transparent'};
  padding: ${spacing.sm};
  box-shadow: none;
  border-radius: ${borderRadius.md};
  width: 100%;
  height: 70px;
  cursor: pointer;
  transition: all ${transitions.fast};
  position: relative;
  
  /* No pseudo-elements for clean design */
  &:before, &:after {
    display: none;
  }
  
  &:hover {
    border: 2px solid ${props => props.active ? colors.accent.primary : 'rgba(255, 255, 255, 0.2)'};
    background: transparent;
  }
`;
```

#### Tab Icon Implementation
```jsx
const TabIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${props => props.active ? colors.accent.primary : 'rgba(255, 255, 255, 0.7)'};
  transition: all ${transitions.fast};
  
  /* Icon sizing */
  svg {
    font-size: 1.8rem;
  }
  
  ${TabButton}:hover & {
    color: ${props => props.active ? colors.accent.primary : 'white'};
  }
`;
```

#### Tab Usage Example
```jsx
<TabsList itemCount={tabItems.length}>
  {tabItems.map(tab => (
    <TabButton
      key={tab.id}
      active={activeTab === tab.id}
      onClick={() => setActiveTab(tab.id)}
      aria-selected={activeTab === tab.id}
      role="tab"
      id={`${tab.id}-tab`}
      aria-controls={`${tab.id}-panel`}
    >
      <TabIconWrapper active={activeTab === tab.id}>
        {tab.icon}
      </TabIconWrapper>
    </TabButton>
  ))}
</TabsList>
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

## Modal Design

### Modal Structure
- **Clean, Minimalist Design**: Modals use a dark background with clean lines and minimal visual elements
- **Responsive Sizing**: Modals adjust their size based on screen dimensions
- **Centered Content**: All content and buttons are centered for better visual balance

### Modal Header
- **Padding**: Adequate padding to prevent overlap with close button
- **Title Alignment**: Centered on mobile, left-aligned on desktop
- **Close Button**: Positioned in the top-right corner with adequate touch target size

```jsx
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.md} ${spacing.lg};
  padding-right: ${spacing.xl}; /* Extra padding to prevent overlap with close button */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: ${breakpoints.sm}) {
    padding: ${spacing.sm} ${spacing.md};
    padding-right: ${spacing.lg};
  }
`;
```

### Modal Footer
- **Button Alignment**: Centered for better visual balance and mobile usability
- **Button Spacing**: Consistent gap between buttons using theme spacing variables
- **RTL Support**: Proper direction handling for right-to-left languages

```jsx
const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${spacing.md} ${spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
  width: 100%;
  gap: ${spacing.md};
  
  @media (max-width: ${breakpoints.sm}) {
    flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
    justify-content: center;
    padding: ${spacing.md} ${spacing.lg};
    gap: ${spacing.sm};
  }
  
  @media (max-width: ${breakpoints.xs}) {
    padding: ${spacing.md};
  }
`;
```

### Modal Buttons
- **Mobile-Optimized**: Larger touch targets on mobile devices
- **Consistent Styling**: Follows the application's button styling guidelines
- **Visual Hierarchy**: Primary actions are visually distinct from secondary actions

```jsx
const ModalButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all ${transitions.fast};
  min-width: 100px;
  
  @media (max-width: ${breakpoints.sm}) {
    min-width: 120px;
    height: 44px;
    padding: ${spacing.xs} ${spacing.sm};
  }
`;
```

## SelectableCards Component

### Design Principles
- **Clean Card Design**: Cards use a minimalist design with subtle gradients and borders
- **Mobile-First Approach**: Optimized for touch interactions on small screens
- **Native Scrolling**: Uses browser's native horizontal scrolling for better performance

### Card Container
- **Responsive Layout**: Adjusts spacing and scrolling behavior based on screen size
- **Touch-Optimized**: Enhanced for smooth touch scrolling on mobile devices

```jsx
const CardsContainer = styled.div`
  position: relative;
  width: 100%;
  margin: ${spacing.md} 0;
  
  @media (max-width: 768px) {
    margin: ${spacing.sm} 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;
```

### Cards Wrapper
- **Horizontal Scrolling**: Enables smooth horizontal scrolling of cards
- **No Scrollbars**: Hidden scrollbars for cleaner appearance while maintaining functionality
- **Flexible Layout**: Adapts to different screen sizes with appropriate spacing

```jsx
const CardsWrapper = styled.div`
  display: flex;
  gap: ${spacing.md};
  padding: ${spacing.md} 0;
  overflow-x: auto;
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  position: relative;
  width: 100%;
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
  
  /* Prevent text selection during drag */
  user-select: none;
  
  @media (max-width: 768px) {
    gap: ${spacing.sm};
    padding: ${spacing.sm} 0;
    margin-bottom: ${props => props.isMobile ? spacing.xs : '0'};
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: none; /* Remove snap on mobile to improve scrolling */
    flex-wrap: nowrap;
  }
`;
```

### Individual Card
- **Consistent Sizing**: Fixed width and height for uniform appearance
- **Visual Feedback**: Subtle hover and active states for better interaction feedback
- **Selection State**: Clear visual indication of selected state with gradient background

```jsx
const Card = styled.div`
  width: 140px;
  height: 180px;
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, rgba(74, 108, 247, 0.3), rgba(138, 43, 226, 0.3))'
    : 'linear-gradient(135deg, rgba(74, 108, 247, 0.05), rgba(255, 255, 255, 0.05))'};
  border: 2px solid ${props => props.selected 
    ? 'rgba(138, 43, 226, 0.8)' 
    : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  cursor: pointer;
  transition: all ${transitions.fast};
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  touch-action: pan-x; /* Improve touch scrolling */
  
  @media (max-width: 768px) {
    width: 160px;
    height: 200px;
    padding: ${spacing.md} ${spacing.sm};
  }
  
  /* Left border accent removed */
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(138, 43, 226, 0.5);
    box-shadow: ${shadows.md};
  }
`;
```

### Mobile Optimization
- **No Scroll Arrows**: Removed arrow buttons on mobile for cleaner UI
- **No Blue Left Lines**: Removed vertical accent lines on cards for mobile
- **Larger Touch Targets**: Increased card size on mobile for better touch interaction
- **Native Scrolling**: Uses browser's native touch scrolling for better performance
- **Scroll Indicators**: Visual feedback when scrolling with smooth fade-in/out

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

## Reusable Components

### IconContainer Component

The IconContainer is a reusable component designed to provide consistent icon styling across the application. It follows the same design pattern as the invoice icons, with colored backgrounds and white icons.

#### Usage

```jsx
<IconContainer 
  icon={FaCheck} 
  color="white" 
  size="1.2em" 
  background="#00c27a" 
  padding="8px" 
  round={true} 
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | React Component or JSX | required | The icon component to render |
| `color` | String | "currentColor" | Color of the icon |
| `size` | String | "1em" | Size of the icon (e.g., "1.2em", "24px") |
| `background` | String | "transparent" | Background color of the icon container |
| `round` | Boolean | false | Whether to make the container round |
| `padding` | String | "0" | Padding around the icon |
| `margin` | String | "0" | Margin around the container |
| `onClick` | Function | undefined | Click handler for interactive icons |
| `disabled` | Boolean | false | Whether the icon is disabled |
| `className` | String | undefined | Custom class name |

#### Implementation

The IconContainer component is implemented in `GlobalComponents.js` and can be imported and used throughout the application. It provides consistent styling for all icons, including:

- Status icons in task cards
- Dashboard summary card icons
- Panel header icons
- Action button icons

### Enhanced Modal Component

The Modal component has been enhanced to improve reusability, mobile responsiveness, and RTL support for Arabic.

#### Key Enhancements

1. **Mobile Responsiveness**: 
   - Added `fullScreenOnMobile` prop to control whether the modal takes up the full screen on mobile devices
   - Improved responsive styling with better handling of different screen sizes
   - Added proper overflow handling for mobile views

2. **RTL Support for Arabic**:
   - Enhanced RTL support with proper text alignment and direction
   - Fixed icon placement in RTL mode
   - Adjusted margins and paddings to work correctly in both LTR and RTL modes
   - Ensured header elements are properly aligned in RTL mode

3. **Reusability Improvements**:
   - Added comprehensive documentation and usage examples
   - Enhanced ModalButton component with better styling and theme support
   - Added support for custom styles via the `customStyles` prop
   - Improved accessibility with proper ARIA attributes

#### Usage Example

```jsx
<Modal
  isOpen={isModalOpen}
  onClose={closeModal}
  title={t('yourModule.modalTitle', 'Your Modal Title')}
  icon={<FaPlus />}
  size="lg"
  theme="todo"
  animation="zoom"
  centered={true}
  closeOnClickOutside={true}
  fullScreenOnMobile={true}
>
  {/* Modal content */}
</Modal>
```

---

## 📌 Forums & Mockups Addendum (June 2025)

> *This section documents **only** the extra tokens, layout rules, and component patterns introduced by the new Forums page.  
> Everything else continues to follow the primary DevFolio design system above.*

### 1 · Additional Color Tokens  
| Token | Hex | Purpose |
|-------|-----|----------|
| `--clr-forum-accent` | `#CBBC9F` | Highlight for discussion headings, mockup card borders, "Send" buttons |
| `--clr-forum-glass`  | `rgba(255,255,255,0.04)` | Glassy card fill on dark panels |
| `--clr-forum-backdrop` | `rgba(0,0,0,0.65)` | Modal backdrop |

> **Note:** These tokens **layer on top** of the primary palette. They are *not* global replacements. Use them **only inside Forums components** (scope via CSS module / styled-component `Forums*`).

### 2 · Layout Rules  
| Breakpoint | Discussion | Mockups |
|------------|------------|----------|
| **Desktop ≥ 1024 px** | Occupies left 50% (single column) | Right 50% grid (3 cols) |
| **Tablet ≥ 640 px**   | Stacked ↕; Discussion first | Grid collapses to 2 cols |
| **Mobile < 640 px**   | Full-width accordion | Full-width grid (1 col) |

*Gutters remain DevFolio standard (`gap-6`).*

### 3 · Component Specs

| Component | Key Styles | Interaction |
|-----------|------------|-------------|
| **MockupCard** | `card-glass` mix-in, border `2px solid transparent`, `hover:border-[var(--clr-forum-accent)]`, img radius `8px` | Entire card is a button; activates modal |
| **MockupModal** | Backdrop `var(--clr-forum-backdrop)`, panel uses `card-glass` + `p-6` | `fadeIn` + scale `0.95→1` over 200 ms |
| **CommentRow** | Flex left/right, bubble bg `--clr-forum-accent/20` (self) or `#ffffff14` (others) | On hover, show timestamp (`opacity` 0→1) |
| **DiscussionAccordion** | Card border accent on hover, expands with `max-height` transition | Arrow icon rotates `0→90 deg` |

### 4 · Animation Map  
| Name | From → To | Usage |
|------|-----------|-------|
| `forumFade` | `opacity:0 → 1` | Modal backdrop |
| `forumSlideUp` | `translateY(8px) → 0` + `opacity 0→1` | MockupCard on first render |
| `forumPulse` | `scale 1 → 1.05 → 1` | "Send" button hover |

*(Durations inherit DevFolio's `transitions.fast` ≈ 200 ms.)*

### 5 · Accessibility & RTL  
* Mirrors DevFolio guidelines:  
  * All icon-only buttons have `aria-label`.  
  * Modal traps focus; closes on **Esc**.  
  * RTL: flex directions flip; arrow rotations reversed.*
