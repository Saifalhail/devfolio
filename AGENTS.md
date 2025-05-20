# Codex Agent Instructions

## Branching Strategy
- Always create a new branch from the latest `main` branch
- Use the naming convention: `codex/task-description`
- One task per branch, one PR per task

## PR Instructions
- Title format: [Component] Brief description of changes
- Include a summary of what was changed and why
- Reference the task number from AI_AGENT_TASKS.md
- Tag @YourUsername for review

## Development Guidelines
- Run tests before submitting: `npm test`
- Ensure linting passes: `npm run lint`
- Follow the existing code style and patterns
- Document any new functions or components