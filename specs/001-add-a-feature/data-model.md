# Data Model: Skins Account Management

## Core Entities

### SkinsAccount

```typescript
interface SkinsAccount {
  id: number
  userId: number
  currentBalance: number // In cents
  payoutFrequency: PayoutFrequency
  lastPayoutDate: Date | null
  createdAt: Date
  updatedAt: Date
}

enum PayoutFrequency {
  BI_MONTHLY = "bi-monthly", // 1st and 15th
  MONTHLY = "monthly", // 1st of month
  YEARLY = "yearly", // October 1st
}
```

### SkinsWinning

```typescript
interface SkinsWinning {
  id: number
  userId: number
  eventId: number
  eventName: string
  eventDate: Date
  holeNumber: number
  amount: number // In cents
  season: number // Year
  createdAt: Date
}
```

### SkinsTransaction

```typescript
interface SkinsTransaction {
  id: number
  userId: number
  type: TransactionType
  amount: number // In cents (positive or negative)
  description: string
  eventId?: number // Optional, for win transactions
  season: number
  processedAt: Date
  createdAt: Date
}

enum TransactionType {
  WIN = "win",
  PAYOUT = "payout",
  ADJUSTMENT = "adjustment",
  REFUND = "refund",
}
```

### Season

```typescript
interface Season {
  year: number
  startDate: Date
  endDate: Date
  isActive: boolean
}
```

## API Response Formats

### Account Balance Response

```typescript
interface AccountBalanceResponse {
  account: SkinsAccount
  seasons: Season[]
  currentSeason: number
}
```

### Winnings Response

```typescript
interface WinningsResponse {
  winnings: SkinsWinning[]
  totalAmount: number // Sum of all winnings for the season
  season: number
  count: number
}
```

### Transactions Response

```typescript
interface TransactionsResponse {
  transactions: SkinsTransaction[]
  season: number
  summary: {
    totalWins: number
    totalPayouts: number
    totalAdjustments: number
    netAmount: number
  }
}
```

### Preferences Update Request

```typescript
interface UpdatePreferencesRequest {
  payoutFrequency: PayoutFrequency
}

interface UpdatePreferencesResponse {
  account: SkinsAccount
  success: boolean
  message: string
}
```

## Data Transformation

### Currency Formatting

```typescript
// Convert cents to dollars for display
const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}
```

### Date Formatting

```typescript
// Format dates for display
const formatDate = (date: Date): string => {
  return format(date, "MMM d, yyyy")
}

const formatDateTime = (date: Date): string => {
  return format(date, "MMM d, yyyy h:mm a")
}
```

### Season Utilities

```typescript
// Get current season year
const getCurrentSeason = (): number => {
  const now = new Date()
  const year = now.getFullYear()
  // Season runs from Nov 1 to Oct 31
  return now.getMonth() >= 10 ? year + 1 : year
}

// Format season for display
const formatSeason = (year: number): string => {
  return `${year - 1}-${year}`
}
```

## Validation Rules

### Client-Side Validation

```typescript
// Payout frequency validation
const isValidPayoutFrequency = (frequency: string): frequency is PayoutFrequency => {
  return Object.values(PayoutFrequency).includes(frequency as PayoutFrequency)
}

// Amount validation (API returns cents, display in dollars)
const isValidAmount = (amount: number): boolean => {
  return Number.isInteger(amount) && amount >= 0
}

// Season validation
const isValidSeason = (season: number): boolean => {
  const currentYear = new Date().getFullYear()
  return season >= 2020 && season <= currentYear + 1
}
```

## Error Handling

### API Error Types

```typescript
interface ApiError {
  message: string
  field?: string
  code: string
}

interface ApiErrorResponse {
  errors: ApiError[]
  statusCode: number
}
```

### Client Error Handling

```typescript
// Handle API errors consistently
const handleApiError = (error: ApiErrorResponse): string => {
  if (error.errors.length > 0) {
    return error.errors[0].message
  }
  return "An unexpected error occurred"
}
```

## State Management

### TanStack Query Keys

```typescript
const skinsQueryKeys = {
  all: ["skins"] as const,
  account: (userId: number) => [...skinsQueryKeys.all, "account", userId] as const,
  winnings: (userId: number, season: number) =>
    [...skinsQueryKeys.all, "winnings", userId, season] as const,
  transactions: (userId: number, season: number) =>
    [...skinsQueryKeys.all, "transactions", userId, season] as const,
}
```

### Cache Invalidation Strategy

```typescript
// Invalidate related queries after preference updates
const invalidateSkinsData = (queryClient: QueryClient, userId: number) => {
  queryClient.invalidateQueries({ queryKey: skinsQueryKeys.account(userId) })
}
```
