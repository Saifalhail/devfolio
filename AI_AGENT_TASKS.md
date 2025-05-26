# DevFolio AI Agent Tasks

This document contains small, precise tasks for AI agents to complete. Each task is self-contained and focuses on bug fixes, small feature additions, testing, and code improvements. Each task includes references to relevant documentation files.

> **NOTE FOR CODEX AGENTS**: This project is undergoing UI modernization to match the dark purple theme with gradient effects. All new components must use white text on dark backgrounds for better visibility and accessibility. Components should use gradient backgrounds, subtle animations, and consistent hover effects as detailed in the UI documentation. Refer to UI_DESIGN_DOCUMENTATION.md for the complete style guide and GlobalComponents.js/GlobalTheme.js for implementation examples.

## Authentication Tasks
<!-- 
1. ✅ **Fix Google Authentication**
   - File: `src/components/Common/AuthModal.js` and `src/firebase.js`
   - Task: Properly implement the signInWithGoogle function and handle potential errors
   - Status: COMPLETED - Fixed API key issues and improved error handling

2. **Implement Phone Verification**
   - File: `src/components/Common/AuthModal.js`
   - Task: Add proper error handling for verification code submission in phone authentication
   - Docs: See FIREBASE_SETUP.md (Configure Phone Authentication section)
   - Priority: Medium
   - **ASSIGN TO CODEX AGENT**

3. **Add Form Validation**
   - File: `src/components/Common/AuthModal.js`
   - Task: Implement validation for email/password sign-up fields with appropriate error messages
   - Docs: See DOCUMENTATION.md (Authentication UI section)
   - Priority: Medium
   - **ASSIGN TO CODEX AGENT**

4. **Fix Modal Closing**
   - File: `src/components/Common/AuthModal.js`
   - Task: Fix the modal closing behavior to properly reset all state when closed
   - Docs: See WINDSURF_RULES.md (authentication section)
   - Priority: Low

5. **Add Loading Indicators**
   - File: `src/components/Common/AuthModal.js`
   - Task: Implement loading indicators for authentication buttons during authentication processes
   - Docs: See DOCUMENTATION.md (Authentication UI section)
   - Priority: Low

## Firebase Integration Tasks

6. **Standardize Error Messages**
   - File: Create `src/utils/errorHandling.js`
   - Task: Create a utility file to standardize Firebase error messages across the application
   - Docs: See FIREBASE_SETUP.md (Troubleshooting section) and WINDSURF_RULES.md (firebase section)
   - Priority: Medium
   - **ASSIGN TO CODEX AGENT**

7. ✅ **Update Firebase Initialization**
   - File: `src/firebase.js`
   - Task: Remove development fallback values for production builds
   - Status: COMPLETED - Ensured production builds use correct Firebase configuration

8. **Improve Error Logging**
   - File: `src/components/Home/NewContact.js`
   - Task: Add proper error logging for Firebase functions to improve debugging
   - Docs: See FIREBASE_SETUP.md (Troubleshooting section) and DOCUMENTATION.md (Contact Form Setup section)
   - Priority: Medium

9. **Create Security Rules**
   - File: Create `firestore.rules`
   - Task: Implement Firebase security rules based on the recommendations in FIREBASE_SETUP.md
   - Docs: See FIREBASE_SETUP.md (Firestore Security Rules section)
   - Priority: High
   - **ASSIGN TO CODEX AGENT**

10. **Implement Listener Cleanup**
    - File: All components using Firebase listeners
    - Task: Add proper cleanup for Firebase listeners to prevent memory leaks
    - Docs: See WINDSURF_RULES.md (firebase section)
    - Priority: Medium

## UI Improvement Tasks

11. **Fix Responsive Layout**
    - File: `src/components/Common/AuthModal.js`
    - Task: Fix responsive layout issues in the AuthModal component for small mobile screens
    - Docs: See DOCUMENTATION.md (Authentication UI section) and WINDSURF_RULES.md (styling section)
    - Priority: Medium

12. **Improve Focus States**
    - File: `src/components/Home/NewContact.js`
    - Task: Add proper focus states and keyboard navigation to form inputs
    - Docs: See WINDSURF_RULES.md (accessibility section) and DOCUMENTATION.md (Accessibility Features section)
    - Priority: Medium

13. **Add Form Validation Feedback**
    - File: `src/components/Home/NewContact.js`
    - Task: Implement form validation feedback for the contact form
    - Docs: See DOCUMENTATION.md (Contact Form Setup section) and WINDSURF_RULES.md (forms section)
    - Priority: High

14. **Fix RTL Layout Issues**
    - File: `src/components/Home/NewContact.js`
    - Task: Fix right-to-left layout issues in the contact form for Arabic language
    - Docs: See DOCUMENTATION.md (Internationalization section) and WINDSURF_RULES.md (internationalization section)
    - Priority: High

15. **Add Loading Skeletons**
    - File: Create components as needed
    - Task: Add loading skeleton components for async data loading sections
    - Docs: See WINDSURF_RULES.md (styling section) and DOCUMENTATION.md (UI Components and Design System section)
    - Priority: Low

## Dashboard Tasks

16. **Implement Mobile Sidebar Toggle**
    - File: `src/components/Dashboard/Dashboard.js`
    - Task: Add a backdrop overlay when sidebar is open on mobile to allow clicking outside to close it
    - Docs: See WINDSURF_RULES.md (responsive design section) and PROJECT_BUILDING_TASKS.md (Dashboard Implementation section)
    - Priority: High
    - **ASSIGN TO CODEX AGENT**

17. ✅ **Implement TasksPanel Component**
    - File: `src/components/Dashboard/TasksPanel.js`
    - Task: Create a Kanban-style task management component with three columns (To Do, In Progress, Done)
    - Status: COMPLETED - Basic implementation with mock data is in place

18. **Add Dashboard Loading State**
    - File: `src/components/Dashboard/Dashboard.js`
    - Task: Implement a loading state for the dashboard while user authentication is being verified
    - Docs: See DOCUMENTATION.md (Authentication System section) and WINDSURF_RULES.md (UI feedback section)
    - Priority: High
    - **ASSIGN TO CODEX AGENT**

19. **Enhance TasksPanel with Data Persistence**
    - File: `src/components/Dashboard/TasksPanel.js`
    - Task: Replace mock data with actual data storage using Firebase or local storage
    - Docs: See PROJECT_BUILDING_TASKS.md (Dashboard Implementation section, item 4)
    - Priority: High
    - **ASSIGN TO CODEX AGENT**

20. **Fix Sidebar RTL Support**
    - File: `src/components/Dashboard/Sidebar.js`
    - Task: Ensure proper RTL (right-to-left) support for sidebar navigation icons and text alignment
    - Docs: See DOCUMENTATION.md (Internationalization section) and WINDSURF_RULES.md (internationalization section)
    - Priority: Medium

21. **Add Active Route Highlighting**
    - File: `src/components/Dashboard/Sidebar.js`
    - Task: Enhance the sidebar navigation to properly highlight the active route with visual indicators
    - Docs: See WINDSURF_RULES.md (navigation section) and PROJECT_BUILDING_TASKS.md (Dashboard Implementation section)
    - Priority: Medium

22. **Implement Keyboard Navigation**
    - File: `src/components/Dashboard/Sidebar.js`
    - Task: Add keyboard navigation support for the sidebar menu items for better accessibility
    - Docs: See WINDSURF_RULES.md (accessibility section) and DOCUMENTATION.md (Accessibility Features section)
    - Priority: Low -->
<!-- 
23. **Add Tooltip Components**

## UI Enhancement Tasks

23. ✅ **Enhance UI Consistency and Text Visibility**
    - Files: `src/components/Dashboard/FormsPanel.js`, `src/components/Dashboard/ProjectsPanel.js`, `src/styles/GlobalComponents.js`, `src/styles/GlobalTheme.js`
    - Task: Ensure all buttons have white text for better visibility, improve hover effects, and make sure styles are consistent across components
    - Status: COMPLETED - Enhanced text contrast, added consistent hover animations, improved component styling, and fixed circular dependencies
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Buttons and Cards sections)

24. **Implement Circular Progress Animation**
    - File: Create `src/components/Common/Tooltip.js`
    - Task: Create a reusable tooltip component for providing additional information on hover
    - Docs: See WINDSURF_RULES.md (UI components section) and DOCUMENTATION.md (UI Components and Design System section)
    - Priority: Low

24. **Implement Collapsible Sidebar**
    - File: `src/components/Dashboard/Sidebar.js`
    - Task: Add functionality to collapse the sidebar to show only icons on desktop view to save space
    - Docs: See PROJECT_BUILDING_TASKS.md (Dashboard Implementation section) and WINDSURF_RULES.md (responsive design section)
    - Priority: Medium

## UI Modernization Tasks

25. **Remove Purple Background from Icons**
    - Files: `src/components/Dashboard/OverviewPanel.js` and related components
    - Task: Update icons to display without purple backgrounds to match the design in UI_DESIGN_DOCUMENTATION.md
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Icon Implementation section)
    - Priority: High
    - **ASSIGN TO CODEX AGENT**

26. **Standardize Dashboard Cards Styling**
    - Files: Dashboard panel components (Forms, Projects, Files, etc.)
    - Task: Update white card components to use dark purple gradient backgrounds with animations matching the Overview panel
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Dashboard Components section)
    - Priority: High
    - **ASSIGN TO CODEX AGENT**

27. **Add Animation Effects to UI Components**
    - Files: Various components throughout the application
    - Task: Implement subtle animations for hovering, loading, and transitions as specified in UI_DESIGN_DOCUMENTATION.md
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Animations section)
    - Priority: Medium

28. **Improve RTL Support for Arabic**
    - Files: Multiple components with layout issues in RTL mode
    - Task: Fix alignment, padding, and icon placement for RTL layout in Arabic language mode
    - Docs: See UI_DESIGN_DOCUMENTATION.md (RTL Support section) and WINDSURF_RULES.md (internationalization section)
    - Priority: High
    - **ASSIGN TO CODEX AGENT**

29. **Enhance Mobile Responsiveness**
    - Files: Multiple components with responsive design issues
    - Task: Improve layout and component sizing for small screens
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Responsive Design section)
    - Priority: High

## UI Refinement Tasks


## Refactoring Tasks

40. **Create Reusable Styled Components**
    - File: Create `src/styles/components.js`
    - Task: Extract common styled components into a reusable library (cards, buttons, form elements, etc.)
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Components section) and WINDSURF_RULES.md (styling section)
    - Priority: High
    - **ASSIGN TO CODEX AGENT**
    - Priority: Medium
    - **ASSIGN TO CODEX AGENT**

## Testing Tasks

34. **Test AuthContext Provider**
    - File: Create `src/contexts/__tests__/AuthContext.test.js`
    - Task: Write tests for the AuthContext provider functionality
    - Docs: See DOCUMENTATION.md (Authentication System section) and package.json for testing setup
    - Priority: High

35. **Test Contact Form Submission**
    - File: Create `src/components/Home/__tests__/NewContact.test.js`
    - Task: Write tests for the contact form submission functionality
    - Docs: See DOCUMENTATION.md (Contact Form Setup section) and package.json for testing setup
    - Priority: Medium

36. **Add Form Validation Tests**
    - Files: Create test files for AuthModal and Contact components
    - Task: Add validation tests for form inputs in both components
    - Docs: See DOCUMENTATION.md (Form Validation section) and package.json for testing setup
    - Priority: Low

37. **Create Snapshot Tests**
    - Files: Create test files for UI components
    - Task: Implement snapshot tests to detect unexpected visual changes
    - Docs: See package.json for testing setup
    - Priority: Low

38. **Implement Integration Tests**
    - File: Create `src/__tests__/authentication.test.js`
    - Task: Create integration tests for the complete authentication flow
    - Docs: See DOCUMENTATION.md (Authentication System section) and package.json for testing setup
    - Priority: Low

39. **Test Dashboard Sidebar**
    - File: Create `src/components/Dashboard/__tests__/Sidebar.test.js`
    - Task: Write tests for the sidebar navigation functionality and responsive behavior
    - Docs: See PROJECT_BUILDING_TASKS.md (Dashboard Implementation section) and package.json for testing setup
    - Priority: Medium

40. **Test Dashboard Layout**
    - File: Create `src/components/Dashboard/__tests__/Dashboard.test.js`
    - Task: Test the dashboard layout structure and responsive behavior
    - Docs: See PROJECT_BUILDING_TASKS.md (Dashboard Implementation section) and package.json for testing setup
    - Priority: Medium -->

20. **Complete Arabic Translation Integration**
    - Files: `src/locales/ar/translation.json` and all dashboard components
    - Task: Add missing Arabic translations for all dashboard components and ensure all text strings are properly internationalized
    - Docs: See DOCUMENTATION.md (Internationalization section) and WINDSURF_RULES.md (internationalization section)
    - Priority: High

21. **Enhance RTL Layout Support**
    - Files: `src/styles/GlobalComponents.js` and all dashboard panel components
    - Task: Ensure all components properly flip layout direction, icon positions, and text alignment in RTL mode
    - Docs: See UI_DESIGN_DOCUMENTATION.md (RTL Support section)
    - Priority: High
    - **ASSIGN TO CODEX AGENT**

22. **Create Reusable Modal Component**
    - File: Create `src/components/Common/Modal.js`
    - Task: Implement a flexible, reusable modal component with animation effects for add/edit operations
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Components section) and WINDSURF_RULES.md (styling section)
    - Priority: High

23. **Refine ProjectsPanel UI**
    - File: `src/components/Dashboard/ProjectsPanel.js`
    - Task: Improve alignment of filter/sort controls, enhance Add Project button styling, and ensure consistent spacing
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Dashboard Components section)
    - Priority: Medium

24. **Implement Skeleton Loading States**
    - Files: Create `src/components/Common/SkeletonLoader.js` and integrate with panel components
    - Task: Add animated skeleton loading states for all dashboard panels during data fetching
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Animations section) and WINDSURF_RULES.md (UI feedback section)
    - Priority: Medium

25. **Enhance Forms UI**
    - File: `src/components/Dashboard/FormsPanel.js`
    - Task: Improve form card styling, add subtle entrance animations, and enhance visual feedback for interactions
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Form Elements section)
    - Priority: Medium

26. **Create Animated Tab Component**
    - File: Create `src/components/Common/Tabs.js`
    - Task: Implement a reusable tab component with smooth transition animations for content switching
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Components section) and WINDSURF_RULES.md (UI components section)
    - Priority: Low

27. **Add Mobile Navigation Drawer**
    - File: Modify `src/components/Dashboard/Sidebar.js` and `Dashboard.js`
    - Task: Create a mobile-optimized navigation drawer with touch gestures and smooth animations
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Responsive Design section) and WINDSURF_RULES.md (responsive design section)
    - Priority: High

28. **Implement Toast Notification System**
    - File: Create `src/components/Common/Toast.js` and `src/contexts/ToastContext.js`
    - Task: Create a reusable toast notification system for displaying success/error messages with animations
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Components section) and WINDSURF_RULES.md (UI feedback section)
    - Priority: Medium

29. **Create Theme Switch Animation**
    - File: Modify `src/contexts/ThemeContext.js` and create `src/components/Common/ThemeSwitch.js`
    - Task: Implement a smooth theme transition animation when switching between light/dark modes
    - Docs: See UI_DESIGN_DOCUMENTATION.md (Animations section)
    - Priority: Low


## Performance Optimization Tasks

30. **Optimize Image Loading**
    - File: Hero section component
    - Task: Implement lazy loading for images to improve page load performance
    - Docs: See DOCUMENTATION.md (Performance Optimization section) and WINDSURF_RULES.md (styling section)
    - Priority: Medium

31. **Refactor Styled Components**
    - File: `src/components/Home/NewContact.js`
    - Task: Refactor styled components to reduce duplication and improve maintainability
    - Docs: See WINDSURF_RULES.md (styling section)
    - Priority: Low

32. **Implement Code Splitting**
    - File: `src/components/Dashboard/Dashboard.js`
    - Task: Use React.lazy and Suspense to implement code splitting and reduce initial load time
    - Docs: See DOCUMENTATION.md (Performance Optimization section)
    - Priority: Medium

33. **Add Component Memoization**
    - Files: Various components with expensive renders
    - Task: Implement React.memo, useMemo, and useCallback to optimize rendering performance
    - Docs: See WINDSURF_RULES.md (project_structure section)
    - Priority: Low

34. **Optimize Dashboard Rendering**
    - File: `src/components/Dashboard/Dashboard.js`
    - Task: Implement virtualization for lists and optimize rendering of dashboard components
    - Docs: See DOCUMENTATION.md (Performance Optimization section) and PROJECT_BUILDING_TASKS.md (Dashboard Implementation section)
    - Priority: Medium

35. **Optimize Firebase Queries**
    - Files: All components using Firebase
    - Task: Optimize Firebase queries to minimize reads and writes
    - Docs: See FIREBASE_SETUP.md and WINDSURF_RULES.md (firebase section)
    - Priority: High

## Accessibility Tasks

36. **Add ARIA Labels**
    - File: `src/components/Common/AuthModal.js`
    - Task: Add proper ARIA labels to all interactive elements for screen reader accessibility
    - Docs: See DOCUMENTATION.md (Accessibility Features section) and WINDSURF_RULES.md (accessibility section)
    - Priority: Medium

37. **Improve Form Accessibility**
    - File: `src/components/Home/NewContact.js`
    - Task: Ensure all form inputs have properly associated labels and error messages
    - Docs: See DOCUMENTATION.md (Accessibility Features section) and WINDSURF_RULES.md (accessibility section)
    - Priority: High

38. **Fix Color Contrast**
    - Files: Various UI components
    - Task: Fix color contrast issues to meet WCAG AA standards
    - Docs: See DOCUMENTATION.md (Accessibility Features section) and WINDSURF_RULES.md (accessibility section)
    - Priority: Medium

39. **Implement Keyboard Navigation**
    - File: Language switcher component
    - Task: Ensure the language switcher is fully accessible via keyboard
    - Docs: See DOCUMENTATION.md (Internationalization section) and WINDSURF_RULES.md (accessibility section)
    - Priority: Medium

40. **Add Screen Reader Announcements**
    - Files: Components with status changes
    - Task: Implement screen reader announcements for form submission status changes
    - Docs: See DOCUMENTATION.md (Accessibility Features section) and WINDSURF_RULES.md (accessibility section)
    - Priority: Low

41. **Dashboard Accessibility Audit**
    - File: `src/components/Dashboard/Dashboard.js` and `src/components/Dashboard/Sidebar.js`
    - Task: Perform an accessibility audit on dashboard components and fix any issues
    - Docs: See DOCUMENTATION.md (Accessibility Features section) and WINDSURF_RULES.md (accessibility section)
    - Priority: Medium

## Dashboard Initial Components

42. **Create Project Card Component**
    - File: Create `src/components/Dashboard/ProjectCard.js`
    - Task: Implement a card component to display project information
    - Docs: See PROJECT_BUILDING_TASKS.md (Dashboard Implementation section) and DOCUMENTATION.md
    - Priority: High

43. **Implement Status Badge Component**
    - File: Create `src/components/Dashboard/StatusBadge.js`
    - Task: Create a reusable badge component for showing project status (Not Started, In Progress, Review, Done)
    - Docs: See PROJECT_BUILDING_TASKS.md (Dashboard Implementation section)
    - Priority: Medium

44. **Create Project Timeline Component**
    - File: Create `src/components/Dashboard/ProjectTimeline.js`
    - Task: Implement a timeline component to display project milestone dates
    - Docs: See PROJECT_BUILDING_TASKS.md (Dashboard Implementation section)
    - Priority: Medium

45. **Add Activity Log Component**
    - File: Create `src/components/Dashboard/ActivityLog.js`
    - Task: Create a component to display recent project updates in chronological order
    - Docs: See PROJECT_BUILDING_TASKS.md (Dashboard Implementation section)
    - Priority: Low

46. **Implement Summary Card Component**
    - File: Create `src/components/Dashboard/SummaryCard.js`
    - Task: Create a component for displaying dashboard statistics and summary information
    - Docs: See PROJECT_BUILDING_TASKS.md (Dashboard Implementation section)
    - Priority: Medium

47. **Create Empty State Components**
    - File: Create `src/components/Dashboard/EmptyState.js`
    - Task: Implement empty state components for dashboard sections when no data is available
    - Docs: See PROJECT_BUILDING_TASKS.md (Dashboard Implementation section) and WINDSURF_RULES.md (UI feedback section)
    - Priority: Low

## Bug Fixes

48. **Fix Circular Dependency**
    - Files: Firebase initialization and components
    - Task: Resolve circular dependency issue in Firebase initialization
    - Docs: See FIREBASE_SETUP.md and WINDSURF_RULES.md (firebase section)
    - Priority: High
    - Note: This was previously identified in the project memories

49. **Fix List Rendering Keys**
    - Files: Components with list rendering
    - Task: Add proper key props to list items to resolve console errors
    - Docs: See WINDSURF_RULES.md (project_structure section)
    - Priority: Medium

50. **Improve Error Handling**
    - File: `src/components/Home/NewContact.js`
    - Task: Fix form submission error handling with proper user feedback
    - Docs: See DOCUMENTATION.md (Contact Form Setup section) and WINDSURF_RULES.md (forms section)
    - Priority: High

51. **Fix Language Switching**
    - Files: Components with translation issues
    - Task: Ensure all translated content updates properly when switching languages
    - Docs: See DOCUMENTATION.md (Internationalization section) and WINDSURF_RULES.md (internationalization section)
    - Priority: Medium

52. **Fix Authentication Persistence**
    - Files: `src/contexts/AuthContext.js` and related components
    - Task: Ensure authentication state persists after page refresh
    - Docs: See DOCUMENTATION.md (Authentication System section) and WINDSURF_RULES.md (authentication section)
    - Priority: High

## Documentation Tasks

53. **Add JSDoc Comments**
    - Files: All utility functions in `src/utils/`
    - Task: Add comprehensive JSDoc comments to improve code documentation
    - Docs: See WINDSURF_RULES.md (project_structure section)
    - Priority: Medium

54. **Create Dashboard README**
    - File: Create `src/components/Dashboard/README.md`
    - Task: Write comprehensive documentation for the Dashboard feature
    - Docs: See PROJECT_BUILDING_TASKS.md (Dashboard Implementation section)
    - Priority: Low

55. **Document Authentication Flow**
    - Files: Authentication-related components and contexts
    - Task: Add clear comments explaining the authentication flow throughout the codebase
    - Docs: See DOCUMENTATION.md (Authentication System section) and WINDSURF_RULES.md (authentication section)
    - Priority: Medium

56. **Document Styled Components**
    - Files: Components with complex styled-components
    - Task: Add inline documentation for complex styled-components to improve maintainability
    - Docs: See WINDSURF_RULES.md (styling section)
    - Priority: Low

57. **Create i18n Examples**
    - File: Create `src/locales/README.md`
    - Task: Document usage examples for the internationalization system
    - Docs: See DOCUMENTATION.md (Internationalization section) and WINDSURF_RULES.md (internationalization section)
    - Priority: Low
