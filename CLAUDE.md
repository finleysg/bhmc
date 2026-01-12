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

## Testing

Use a flat test structure. No nested `describe` and `it` aliases. Example:

```typescript
test("test data is generated correctly", () => {
	const slots = buildTeetimeSlots(1, 1, 5, 5)
	const result = RegistrationSlotApiSchema.safeParse(slots[0])
	if (!result.success) {
		console.error(result.error.message)
	}
	expect(result.success).toBe(true)
})
```

Strive for high coverage of functional code.

If you create UX component tests, do not test implementation details. Test from the point
of view of a user of a component.

To run a single test file:

```bash
npx vitest run src/components/buttons/__tests__/register-button.test.tsx
```

## Standards

- Zero tolerance for lint errors or warnings.

## Plans

- At the end of each plan, give me a list of unresolved questions to answer, if any. Make the questions extremely concise.
