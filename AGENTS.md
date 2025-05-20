# Codex Agent Instructions

## Branching Strategy
- Always create a new branch from the latest `main` branch
- Use the naming convention: `codex/task-description`
- One task per branch, one PR per task

## PR Instructions
- Title format: [Component] Brief description of changes
- Include a summary of what was changed and why
- Reference the task number from AI_AGENT_TASKS.md
- Tag @Saifalhail for review

## Development Guidelines
- Run tests before submitting: `npm test`
- Ensure linting passes: `npm run lint`
- Follow the existing code style and patterns

## What to Run

- Run `npm run lint` and `npm test` on any change in:
  - `src/`
  - `backend/functions/`
  - `firebase.json`
  - `.env.local`

## When to Skip

- Skip tests and lint if only:
  - `.md` or `README` files change
  - `src/locales/` (translation files)
  - `src/assets/` (images, SVGs)

## Rules

- If `backend/functions/` is updated → run `firebase deploy --only functions`
- If `firestore.rules` is updated → run `firebase deploy --only firestore:rules`
- Maintain bilingual support for English and Arabic in all user-facing text
- Follow the established color palette and design system
- Ensure all components support RTL layout for Arabic language
- Document any new functions or components