# Component Contracts: Skins Account Management (Mobile-First)

## Page Component

### SkinsAccountScreen

Main container component for the skins account page (mobile-first design).

```typescript
interface SkinsAccountScreenProps {
  // No props - uses authentication context internally
}

// Route: /my-skins
// Authentication: Required (current member)
// Layout: Uses existing BHMC layout with mobile-first responsive design
// Location: /src/skins/screens/skins-account-screen.tsx
// Tests: /src/skins/screens/__tests__/skins-account-screen.test.tsx
```

---

## Display Components

### SkinsBalance

Displays current balance prominently.

```typescript
interface SkinsBalanceProps {
  balance: number // In cents
  loading?: boolean
  error?: string | null
}

// Renders:
// - Current balance in large, prominent text
// - Currency formatting
// - Loading state
// - Error state
```

### SkinsWinnings

Displays seasonal winnings in a table format.

```typescript
interface SkinsWinningsProps {
  winnings: SkinsWinning[]
  totalAmount: number
  season: number
  loading?: boolean
  error?: string | null
  onRefresh?: () => void
}

// Renders:
// - Table with date, event, hole, amount columns
// - Total amount header
// - Empty state for no winnings
// - Loading skeleton
// - Error state with retry option
```

### SkinsTransactions

Displays transaction history in a table format.

```typescript
interface SkinsTransactionsProps {
  transactions: SkinsTransaction[]
  summary: TransactionSummary
  season: number
  loading?: boolean
  error?: string | null
  onRefresh?: () => void
}

// Renders:
// - Table with date, type, description, amount columns
// - Summary totals
// - Transaction type badges
// - Pagination if needed
// - Empty state
// - Loading skeleton
```

### SkinsPreferences

Form for updating payout preferences.

```typescript
interface SkinsPreferencesProps {
  currentFrequency: PayoutFrequency
  onUpdate: (frequency: PayoutFrequency) => Promise<void>
  loading?: boolean
  error?: string | null
}

// Renders:
// - Radio buttons for frequency options
// - Clear descriptions of each option
// - Save button
// - Loading state during updates
// - Success/error feedback
```

---

## Utility Components

### SeasonSelector

Dropdown for selecting viewing season.

```typescript
interface SeasonSelectorProps {
  seasons: Season[]
  currentSeason: number
  selectedSeason: number
  onSeasonChange: (season: number) => void
  disabled?: boolean
}

// Renders:
// - Bootstrap dropdown
// - Season formatting (e.g., "2024-2025")
// - Current season indicator
// - Disabled state
```

### EmptyState

Shows when no data is available.

```typescript
interface EmptyStateProps {
  title: string
  message: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

// Renders:
// - Centered content
// - Icon (optional)
// - Title and message
// - Optional action button
```

### LoadingState

Shows loading indicators.

```typescript
interface LoadingStateProps {
  type: "spinner" | "skeleton"
  rows?: number // For skeleton type
  className?: string
}

// Renders:
// - Bootstrap spinner or
// - Skeleton rows for table loading
```

---

## Hook Contracts

### useSkinsAccount

Manages account data and balance.

```typescript
interface UseSkinsAccountReturn {
  account: SkinsAccount | null
  seasons: Season[]
  currentSeason: number
  loading: boolean
  error: string | null
  refetch: () => void
}

function useSkinsAccount(): UseSkinsAccountReturn
```

### useSkinsWinnings

Manages seasonal winnings data.

```typescript
interface UseSkinsWinningsReturn {
  winnings: SkinsWinning[]
  totalAmount: number
  loading: boolean
  error: string | null
  refetch: () => void
}

function useSkinsWinnings(season: number): UseSkinsWinningsReturn
```

### useSkinsTransactions

Manages transaction history.

```typescript
interface UseSkinsTransactionsReturn {
  transactions: SkinsTransaction[]
  summary: TransactionSummary
  loading: boolean
  error: string | null
  refetch: () => void
}

function useSkinsTransactions(season: number): UseSkinsTransactionsReturn
```

### useSkinsPreferences

Manages preference updates.

```typescript
interface UseSkinsPreferencesReturn {
  updatePreferences: (frequency: PayoutFrequency) => Promise<void>
  loading: boolean
  error: string | null
}

function useSkinsPreferences(): UseSkinsPreferencesReturn
```

---

## Event Handlers

### Navigation Events

```typescript
// Route navigation
onNavigateToSkins: () => void

// Season change
onSeasonChange: (season: number) => void
```

### Data Events

```typescript
// Refresh data
onRefreshAccount: () => void
onRefreshWinnings: () => void
onRefreshTransactions: () => void

// Update preferences
onUpdatePreferences: (frequency: PayoutFrequency) => Promise<void>
```

### UI Events

```typescript
// Error handling
onDismissError: () => void
onRetry: () => void

// Form events
onFormSubmit: (data: FormData) => void
onFormReset: () => void
```

---

## CSS Classes

### Layout Classes

```css
.skins-account-page
.skins-section
.skins-header
.skins-content
```

### Component Classes

```css
.skins-balance
.skins-balance-amount
.skins-winnings-table
.skins-transactions-table
.skins-preferences-form
.season-selector
```

### State Classes

```css
.loading
.error
.empty
.success
```

### Bootstrap Integration

```css
/* Uses existing Bootstrap classes */
.card
.table
.btn
.form-control
.alert
.badge
```

---

## File Organization

### Directory Structure

```
/src/skins/
├── screens/
│   ├── skins-account-screen.tsx
│   └── __tests__/
│       └── skins-account-screen.test.tsx
├── components/
│   ├── skins-balance.tsx
│   ├── skins-winnings.tsx
│   ├── skins-transactions.tsx
│   ├── skins-preferences.tsx
│   ├── season-selector.tsx
│   ├── empty-state.tsx
│   ├── loading-state.tsx
│   └── __tests__/
│       ├── skins-balance.test.tsx
│       ├── skins-winnings.test.tsx
│       ├── skins-transactions.test.tsx
│       ├── skins-preferences.test.tsx
│       └── season-selector.test.tsx
├── hooks/
│   ├── use-skins-account.ts
│   ├── use-skins-winnings.ts
│   ├── use-skins-transactions.ts
│   ├── use-skins-preferences.ts
│   └── __tests__/
│       ├── use-skins-account.test.ts
│       ├── use-skins-winnings.test.ts
│       ├── use-skins-transactions.test.ts
│       └── use-skins-preferences.test.ts
├── services/
│   ├── skins-api.ts
│   └── __tests__/
│       └── skins-api.test.ts
├── models/
│   ├── skins-account.ts
│   ├── skins-winning.ts
│   ├── skins-transaction.ts
│   └── index.ts
└── index.ts
```

### Mobile-First Considerations

- All components use Bootstrap responsive utilities
- Touch-friendly button sizes (min 44px)
- Optimized table layouts for small screens
- Swipe gestures for navigation where appropriate
- Progressive enhancement for larger screens
