# Quickstart Guide: Skins Account Management Implementation (Mobile-First)

## Overview

This guide provides a rapid development path for implementing the mobile-first skins account
management feature. All code is organized in the `/src/skins` subfolder with colocated tests. Follow
these steps in order for the most efficient implementation.

## Phase 1: Foundation (Day 1)

### 1. Set up project structure

```bash
# Create skins feature directory structure
mkdir -p src/skins/{screens,components,hooks,services,models}
mkdir -p src/skins/screens/__tests__
mkdir -p src/skins/components/__tests__
mkdir -p src/skins/hooks/__tests__
mkdir -p src/skins/services/__tests__
```

### 2. Set up routing

```bash
# Add route to existing router
# File: src/app.tsx or routing config
```

### 3. Create basic page structure

```bash
# Create main mobile-first page component
touch src/skins/screens/skins-account-screen.tsx
touch src/skins/screens/__tests__/skins-account-screen.test.tsx
```

### 4. Set up data models

```bash
# Create TypeScript interfaces
touch src/skins/models/skins-account.ts
touch src/skins/models/skins-winning.ts
touch src/skins/models/skins-transaction.ts
touch src/skins/models/index.ts
```

### 5. Create API service

```bash
# Set up TanStack Query integration with local development endpoint
touch src/skins/services/skins-api.ts
touch src/skins/services/__tests__/skins-api.test.ts
```

## Phase 2: Core Components (Day 2)

### 6. Build main screen layout

```typescript
// src/skins/screens/skins-account-screen.tsx
// - Use existing BHMC layout with mobile-first responsive design
// - Bootstrap grid system with mobile breakpoints
// - Header with page title and mobile navigation
```

### 7. Implement balance display

```typescript
// src/skins/components/skins-balance.tsx
// - Large, prominent balance (mobile-optimized)
// - Currency formatting
// - Loading states
// - Touch-friendly design
```

### 8. Add season selector

```typescript
// src/skins/components/season-selector.tsx
// - Mobile-friendly dropdown component
// - Bootstrap styling with responsive utilities
// - Touch event handling
```

## Phase 3: Data Tables (Day 3-4)

### 8. Create winnings table

```typescript
// src/components/skins/skins-winnings.tsx
// - Bootstrap table
// - Date formatting
// - Sortable columns
// - Empty states
```

### 9. Build transactions table

```typescript
// src/components/skins/skins-transactions.tsx
// - Transaction type badges
// - Amount formatting
// - Summary totals
```

## Phase 4: Preferences (Day 5)

### 10. Implement preferences form

```typescript
// src/components/skins/skins-preferences.tsx
// - Radio button groups
// - Form validation
// - Update handling
```

## Phase 5: Polish (Day 6)

### 11. Add error handling

- Global error boundaries
- Retry mechanisms
- User-friendly messages

### 12. Implement loading states

- Skeleton loaders
- Spinner components
- Progressive loading

### 13. Mobile responsiveness

- Bootstrap responsive classes
- Touch-friendly interactions
- Optimized layouts

## Development Commands

### Start development server

```bash
npm run dev
```

### Run tests

```bash
npm run test
```

### Build for production

```bash
npm run build
```

## Key Files to Create

### Core Components

- `src/skins/screens/skins-account-screen.tsx`
- `src/skins/components/skins-balance.tsx`
- `src/skins/components/skins-winnings.tsx`
- `src/skins/components/skins-transactions.tsx`
- `src/skins/components/skins-preferences.tsx`
- `src/skins/components/season-selector.tsx`

### Data Layer

- `src/skins/models/skins-account.ts`
- `src/skins/models/skins-winning.ts`
- `src/skins/models/skins-transaction.ts`
- `src/skins/services/skins-api.ts`
- `src/skins/hooks/use-skins-account.ts`
- `src/skins/hooks/use-skins-winnings.ts`
- `src/skins/hooks/use-skins-transactions.ts`

### Tests

- `src/skins/screens/__tests__/skins-account-screen.test.tsx`
- `src/skins/components/__tests__/skins-balance.test.tsx`
- `src/skins/hooks/__tests__/use-skins-account.test.ts`
- `src/skins/services/__tests__/skins-api.test.ts`

## Implementation Tips

### 1. Use existing patterns

- Follow existing component structure in `src/components/`
- Use existing API patterns from other hooks
- Match existing styling conventions

### 2. Bootstrap 5 integration

- Use existing Bootstrap utilities
- Follow responsive grid patterns
- Match existing card/table styles

### 3. TanStack Query best practices

- Use proper cache keys
- Implement background refetching
- Handle stale-while-revalidate

### 4. Authentication integration

- Use existing auth context
- Follow existing auth patterns
- Handle authentication errors

### 5. Error handling

- Use existing error components
- Follow error boundary patterns
- Provide meaningful user feedback

## Testing Strategy

### Unit Tests

1. Component rendering
2. Hook logic
3. API service functions
4. Utility functions

### Integration Tests

1. Page navigation
2. Data fetching flows
3. Form submissions
4. Error scenarios

### Manual Testing

1. Authentication flows
2. Season selection
3. Data refresh
4. Mobile responsiveness
5. Error conditions

## Performance Considerations

### Data Fetching

- Use React.memo for expensive components
- Implement proper loading states
- Cache API responses appropriately

### Bundle Size

- Use code splitting for the skins section
- Lazy load components when possible
- Optimize asset imports

### User Experience

- Implement optimistic updates for preferences
- Show immediate feedback for actions
- Graceful degradation for network issues

## Deployment Checklist

### Before Production

- [ ] All tests passing
- [ ] Error handling tested
- [ ] Mobile responsive verified
- [ ] Authentication working
- [ ] API integration tested
- [ ] Performance optimized
- [ ] Accessibility verified

### Production Deployment

- [ ] Feature flag enabled (if applicable)
- [ ] Monitoring in place
- [ ] Rollback plan ready
- [ ] User documentation updated
