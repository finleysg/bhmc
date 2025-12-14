# CLAUDE.md

In all interactions and commit messages, be extremely concise and sacrifice grammar for the
sake of concision.

## Common Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # TypeScript compile + Vite production build
npm run test         # Run Vitest tests (single run)
npm run lint         # ESLint check
npm run format       # Prettier check
npm run format:fix   # Prettier auto-fix
```

To run a single test file:
```bash
npx vitest run src/components/buttons/__tests__/register-button.test.tsx
```

## Standards

- Zero tolerance for lint errors or warnings.

## Plans

- At the end of each plan, give me a list of unresolved questions to answer, if any. Make the questions extremely concise.
