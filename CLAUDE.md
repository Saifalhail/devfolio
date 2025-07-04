# CLAUDE.md - AI Assistant Instructions for DevFolio Project

## <� Project Overview

DevFolio is a modern portfolio website for a solo software developer offering various tech services. The project uses React.js with styled-components, Firebase for backend services, and supports multiple languages (English/Arabic with RTL).

#important
7 Claude rules

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the [todo.md](http://todo.md/) file with a summary of the changes you made and any other relevant information.

Security prompt:

Please check through all the code you just wrote and make sure it follows security best practices. make sure there are no sensitive information in the front and and there are no vulnerabilities that can be exploited

## =� Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server (DO NOT use npm start or npm run dev)
# Instead, open the built-in browser view as external browser

# Run tests in Codex environment
bash codex-setup.sh
node src/__tests__/runTests.js

# Lint and format
npm run lint

# Build for production
npm run build
```

## =� Essential Project Information

### Current Status

- **ALWAYS** check PROJECT_BUILDING_TASKS.md at the start to see current progress
- Continue from the last completed task
- Use TodoWrite tool to track your work

### Tech Stack

- **Frontend**: React.js, styled-components, React Router
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **i18n**: react-i18next (EN/AR with RTL support)
- **Forms**: react-hook-form + Yup validation
- **Email**: SendGrid integration (optional)
- **Testing**: Jest + React Testing Library

### Color Palette

```css
--primary-bg: #513a52 (dark purple)
--accent-1: #feefc4
--accent-2: #faaa93
--accent-3: #82a1bf
```

## <� Project Structure

```
/src
   assets/                 # Images, icons, fonts
   components/
      Common/            # Reusable UI components (ALWAYS check here first!)
      Layout/            # Navbar, Footer, structural components
      Home/              # Homepage components
      Dashboard/         # Authenticated user components
         Forums/        # Forum feature with TypeScript
         DesignSection/ # Design-related components
         Invoicing/     # Invoice management
         PostLaunch/    # Post-launch features
      Dashboard/WizardComponents/ # Wizard UI elements
   contexts/              # React Contexts (Auth, Theme, Toast)
   hooks/                 # Custom hooks
   locales/              # Translation files (en/ar)
   styles/               # Global styles, theme
   utils/                # Utilities, Firebase config
   __tests__/            # Test files
   __mocks__/            # Mock implementations
```

## =� Critical Rules

### 1. NEVER Do These

- L Create files unless absolutely necessary
- L Create documentation files (\*.md) unless explicitly requested
- L Use `npm start` or `npm run dev` commands
- L Hardcode colors - use theme tokens
- L Hardcode text - use translation keys
- L Commit Firebase credentials
- L Use `find`, `grep`, `cat`, `head`, `tail` commands
- L Add emojis unless user requests
- L Create malicious code

### 2. ALWAYS Do These

-  Search for existing components before creating new ones
-  Use Common components from the catalog (see below)
-  Add translation keys for ALL text (en + ar)
-  Support RTL layout for Arabic
-  Use styled-components with theme tokens
-  Validate forms on client AND server
-  Handle errors gracefully
-  Use TodoWrite tool for complex tasks
-  Run lint before committing
-  Test offline with mocked Firebase

## =� Reusable Component Catalog

Before creating ANY new UI element, check `/src/components/Common/`:

| Component        | Props/Variants                        | Usage                |
| ---------------- | ------------------------------------- | -------------------- |
| Button           | variant (primary/secondary/text/icon) | CTAs, dialog actions |
| Modal            | open, onClose, size                   | Confirmations, forms |
| Toast            | severity (info/success/error/warn)    | Global feedback      |
| Tabs             | activeKey, onChange, lazy             | Settings, dashboards |
| LoadingSkeleton  | -                                     | Loading states       |
| LanguageSwitcher | -                                     | Language toggle      |
| ThemeSwitch      | -                                     | Dark/light mode      |
| Separator        | -                                     | Visual dividers      |
| FormComponents   | Various input types                   | Form fields          |

## <

Internationalization

```javascript
// ALWAYS use translations
import { useTranslation } from "react-i18next";

const Component = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return <h1>{t("header.title")}</h1>;
};

// Style with RTL support
const Container = styled.div`
  direction: ${(props) => (props.isRTL ? "rtl" : "ltr")};
  text-align: ${(props) => (props.isRTL ? "right" : "left")};
`;
```

## =% Firebase Integration

### Configuration

```javascript
// Environment variables (NEVER hardcode)
REACT_APP_FIREBASE_API_KEY;
REACT_APP_FIREBASE_AUTH_DOMAIN;
REACT_APP_FIREBASE_PROJECT_ID;
// etc...
```

### Security Rules

- Always validate inputs
- Use Firestore security rules
- Handle authentication states properly
- Never expose sensitive data

## >� Testing Guidelines

### Setup for Codex Environment

```bash
bash codex-setup.sh
node src/__tests__/runTests.js
```

### Key Testing Principles

- Tests run offline without network access
- Use mocks in `src/__mocks__/`
- Use `useFirebaseListener` hook for Firebase
- Clean up effects properly
- Test RTL layouts
- Follow patterns in existing tests

## =� Common Workflows

### Adding a New Feature

1. Check PROJECT_BUILDING_TASKS.md
2. Use TodoWrite to plan steps
3. Search for similar existing components
4. Reuse Common components
5. Add translation keys
6. Write tests
7. Run lint
8. Update task status

### Creating a Component

```javascript
// 1. Check if it exists in Common/
// 2. Use styled-components
import styled from "styled-components";

// 3. Use theme tokens
const StyledComponent = styled.div`
  background: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.medium};
`;

// 4. Add translations
const Component = () => {
  const { t } = useTranslation();
  return <StyledComponent>{t("component.text")}</StyledComponent>;
};
```

### Working with Forums (TypeScript)

- Forum components use TypeScript
- Check `/src/components/Dashboard/Forums/`
- Follow existing type definitions
- Use contexts: DiscussionUIContext, MockupUIContext

## =� Error Handling

```javascript
try {
  // Firebase operation
} catch (error) {
  console.error("Operation failed:", error);
  // Show user-friendly message
  toast.error(t("errors.generic"));
}
```

## =� Responsive Design

- Mobile-first approach
- Test all breakpoints
- Support touch interactions
- Optimize images for mobile

## =' Git Workflow

```bash
# Check status first
git status

# Stage changes
git add -A

# Commit with clear message
git commit -m "feat: add feature description"

# NEVER push unless asked
```

## =� Quick Reference

### File Paths

- Components: `/src/components/`
- Styles: `/src/styles/`
- Utils: `/src/utils/`
- Tests: `/src/__tests__/`
- Translations: `/src/locales/`

### Key Hooks

- `useAuth()` - Authentication state
- `useTranslation()` - i18n
- `useFirebaseListener()` - Firebase real-time data

### Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Add Firebase credentials
3. Never commit `.env.local`

## <� Design Guidelines

Refer to UI_DESIGN_DOCUMENTATION.md for:

- Detailed color schemes
- Typography rules
- Component spacing
- Animation guidelines
- Responsive breakpoints

## =� Performance Targets

- Lighthouse score e 90
- LCP < 2.5s
- CLS < 0.1
- Bundle size < 250KB gzipped

## =

Debugging Tips

1. Check browser console for errors
2. Verify Firebase connection
3. Check translation keys exist
4. Ensure RTL styles apply correctly
5. Validate form inputs
6. Check network tab for API calls

## =� Remember

- Quality over quantity
- Reuse over recreate
- Test everything
- Handle errors gracefully
- Support both languages
- Follow existing patterns
- Ask if unsure

## =� Gemini AI Integration

### Setup Instructions
1. **Get your Gemini API Key**:
   - Visit https://ai.google.dev/gemini-api/docs/api-key
   - Create a new API key
   - Save it securely - NEVER commit to git

2. **Configure Backend Environment**:
   ```bash
   cd backend/functions
   cp .env.example .env
   # Edit .env and add your Gemini API key:
   # GEMINI_API_KEY=your-actual-gemini-api-key-here
   ```

3. **Install Dependencies**:
   ```bash
   cd backend/functions
   npm install
   ```

4. **Deploy Cloud Functions**:
   ```bash
   firebase deploy --only functions
   ```

### How It Works
- When users submit a project through the wizard, it automatically generates AI insights
- The `generateProjectInsights` Cloud Function uses Gemini 2.0 Flash model
- Insights include: feasibility analysis, tech recommendations, timeline, budget, and next steps
- All API calls are secured through backend - frontend never sees the API key
- Fallback summary is provided if AI generation fails

### Security Features
- API key stored only in backend environment variables
- User authentication required for all AI requests
- Rate limiting and error handling implemented
- Input validation and sanitization
- Graceful fallback for API failures

## =� Recent Updates (2025-07-02)

### Gemini AI Integration
- **Added Gemini API**: Integrated Google's Gemini AI for project analysis
- **Created Cloud Function**: `generateProjectInsights` for secure AI processing
- **Updated Project Wizard**: AI insights now display in success screen
- **Enhanced Security**: API key stored securely in backend only

### Cleanup Tasks
- `/functions/` directory (was template, kept `/backend/functions/` with actual implementation)
- `/backend/firebase.json` (merged into root `firebase.json`)
- `/src/__tests__/contactFormTests.js` (referenced non-existent component)
- `/src/__tests__/contactValidationTests.js` (referenced non-existent component)
- `/src/components/Dashboard/Forum.jsx` (replaced by TypeScript Forums/ directory)
- `/src/components/Dashboard/Forums/DiscussionList.new.tsx` (duplicate file)

### Firebase Configuration Updates
- **Fixed Storage URL**: Changed from `firebasestorage.app` to `appspot.com` in `src/firebase.js`
- **Consolidated Firebase Config**: All imports now use `src/firebase/config.js` instead of `src/firebase.js`
- **Fixed Authentication**: Replaced dummy API keys with real Firebase credentials
- **Added GoogleAuthProvider**: Exported from firebase/config.js for auth components

### Project Wizard Fixes
- **Fixed Missing Data Storage UI**: Added CheckboxCardSelector for data storage features in Step 3
- **Fixed Industry Field**: Corrected mapping from `industry.value` to `industry.id`
- **Fixed Geographic Locations**: Fixed MultiSelectDropdown component key and click handlers
- **Re-enabled Validation**: Restored validation for all required fields in Steps 1-3
- **Added Missing Translations**: Added dataStorageFeatures translations in EN/AR

### Firebase Storage CORS Workaround
- **Implemented Base64 Fallback**: Added automatic fallback to base64 upload if CORS fails
- **Created APPLY_CORS_FIX.md**: Instructions for applying CORS configuration with gsutil
- **Enhanced Error Handling**: Better error messages and retry logic for file uploads

### Import Consolidation
Updated all Firebase imports from `src/firebase.js` to `src/firebase/config.js`:
- `/src/components/Dashboard/AddTaskModal.js`
- `/src/components/Dashboard/Forums/MockupModal.tsx`
- `/src/components/Dashboard/PostLaunch/FeedbackForm.js`
- `/src/components/Dashboard/ProjectNotes.js`
- `/src/components/Dashboard/ProjectsPanel.js`
- `/src/components/Home/NewContact.js`
- `/src/hooks/useTasks.js`

### Known Issues
- **Firebase Storage CORS**: Requires manual gsutil configuration (see APPLY_CORS_FIX.md)
- **Project Submission**: Some errors may still occur - needs further investigation

---

**Last Updated**: 2025-07-02
**Current Task**: Investigate remaining project submission errors
