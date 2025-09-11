# Research: Skins Account Management UI

## Technical Research

### Existing Architecture Analysis

- **Framework**: React 18+ with TypeScript
- **State Management**: TanStack Query for server state
- **Styling**: Bootstrap 5 + SCSS
- **Routing**: React Router (existing patterns in `/src/screens/`)
- **Authentication**: Existing auth context (`/src/context/auth-context.tsx`)
- **API Integration**: Existing utilities in `/src/utils/api-client.ts`

### API Investigation

- **Endpoint**: https://data.bhmc.org/api
- **Authentication**: Must integrate with existing BHMC auth system
- **Data Format**: Django REST API (consistent with existing patterns)
- **Required Endpoints**:
  - GET `/skins/account/{user_id}` - Current balance and settings
  - GET `/skins/winnings?season={season}&user={user_id}` - Seasonal winnings
  - GET `/skins/transactions?season={season}&user={user_id}` - Transaction history
  - PATCH `/skins/account/{user_id}/preferences` - Update payout settings

### Integration Points

- **Navigation**: Add route to existing router configuration
- **Layout**: Use existing layout components (`/src/layout/`)
- **Components**: Follow existing patterns in `/src/components/`
- **Hooks**: Create custom hooks following `/src/hooks/` patterns
- **Models**: Create models following `/src/models/` patterns

### UI/UX Considerations

- **Responsive Design**: Bootstrap grid system
- **Loading States**: Existing spinner components
- **Error Handling**: Existing error display components
- **Empty States**: Graceful handling of no data scenarios
- **Data Tables**: Existing table components for transaction history

### Performance Requirements

- **Initial Load**: <2s for page load with authentication check
- **Data Fetching**: <500ms for API responses
- **Caching**: TanStack Query for data caching and invalidation
- **Pagination**: Consider for large transaction histories

### Security Considerations

- **Authentication**: Must verify current member status
- **Authorization**: Users can only access their own data
- **Data Validation**: Client-side validation matching API constraints
- **Error Messages**: No sensitive information exposure

## Dependencies Analysis

### New Dependencies Required

- None - all required dependencies already present in project

### Existing Dependencies to Leverage

- `@tanstack/react-query` - Server state management
- `react-router-dom` - Navigation and routing
- `bootstrap` - UI framework
- `react-hook-form` - Form handling for preferences
- `date-fns` - Date formatting and manipulation

### Development Dependencies

- `@testing-library/react` - Component testing
- `vitest` - Test runner
- `msw` - API mocking for tests

## Component Structure Research

### Page Components

- `SkinsAccountScreen` - Main page container
- `SkinsBalance` - Balance display component
- `SkinsWinnings` - Winnings table component
- `SkinsTransactions` - Transaction history component
- `SkinsPreferences` - Payout settings component

### Utility Components

- `SeasonSelector` - Dropdown for season filtering
- `EmptyState` - No data display
- `LoadingState` - Data loading indicators

### Hooks

- `useSkinsAccount` - Account data and balance
- `useSkinsWinnings` - Seasonal winnings data
- `useSkinsTransactions` - Transaction history
- `useSkinsPreferences` - Settings management

### Models

- `SkinsAccount` - Account model with balance and settings
- `SkinsWinning` - Individual winning record
- `SkinsTransaction` - Transaction record
- `PayoutPreference` - Settings model

## Research Conclusions

✅ **Technical Feasibility**: All requirements can be met with existing tech stack ✅ **Integration
Readiness**: Clear integration points with existing codebase ✅ **Performance Achievable**: Existing
patterns support performance requirements ✅ **Security Compliant**: Authentication and
authorization patterns established ✅ **UI Consistency**: Bootstrap and existing component patterns
ensure consistency

**Risk Assessment**: Low risk - leveraging established patterns and technologies **Unknowns
Resolved**: All technical clarifications completed in specification phase
