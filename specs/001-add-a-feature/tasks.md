# Tasks: Skins Account Management UI

**Input**: Design documents from `/home/stuart/code/bhmc/specs/001-add-a-feature/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → ✅ Found: Mobile-first React web application
   → ✅ Extract: React 18+, TanStack Query, Bootstrap 5, TypeScript
2. Load optional design documents:
   → ✅ data-model.md: SkinsAccount, SkinsWinning, SkinsTransaction, Season → model tasks
   → ✅ contracts/: api.md, components.md → contract test tasks
   → ✅ research.md: Tech decisions extracted → setup tasks
3. Generate tasks by category:
   → Setup: /src/skins/ structure, TypeScript config, routing
   → Tests: API contract tests, component tests, integration tests
   → Core: models, hooks, services, components, screens
   → Integration: routing, authentication, API integration
   → Polish: unit tests, performance, accessibility
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → ✅ All contracts have tests
   → ✅ All entities have models
   → ✅ All endpoints implemented
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile-first web app**: `src/skins/` at repository root
- All tests colocated in `__tests__/` subfolders
- Paths assume React single-page application structure

## Phase 3.1: Setup

- [ ] T001 Create /src/skins/ directory structure with screens/, components/, hooks/, services/,
      models/ subdirectories and colocated **tests** folders
- [ ] T002 Add /my-skins route to existing React Router configuration in src/app.tsx
- [ ] T003 [P] Configure TypeScript interfaces and exports in src/skins/models/index.ts

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### API Contract Tests

- [ ] T004 [P] Contract test GET /api/accounts/skins/ in
      src/skins/services/**tests**/skins-api.test.ts
- [ ] T005 [P] Contract test GET /api/accounts/skin-transactions/ in
      src/skins/services/**tests**/skin-transactions-api.test.ts
- [ ] T006 [P] Contract test PATCH /api/accounts/skin-settings/ in
      src/skins/services/**tests**/skin-settings-api.test.ts

### Component Contract Tests

- [ ] T007 [P] Component test SkinsAccountScreen in
      src/skins/screens/**tests**/skins-account-screen.test.tsx
- [ ] T008 [P] Component test SkinsBalance in src/skins/components/**tests**/skins-balance.test.tsx
- [ ] T009 [P] Component test SkinsWinnings in
      src/skins/components/**tests**/skins-winnings.test.tsx
- [ ] T010 [P] Component test SkinsTransactions in
      src/skins/components/**tests**/skins-transactions.test.tsx
- [ ] T011 [P] Component test SkinsPreferences in
      src/skins/components/**tests**/skins-preferences.test.tsx
- [ ] T012 [P] Component test SeasonSelector in
      src/skins/components/**tests**/season-selector.test.tsx

### Integration Tests

- [ ] T013 [P] Integration test: View current balance and account info in
      src/skins/**tests**/account-view.integration.test.tsx
- [ ] T014 [P] Integration test: Filter winnings by season in
      src/skins/**tests**/winnings-filter.integration.test.tsx
- [ ] T015 [P] Integration test: Update payout preferences in
      src/skins/**tests**/preferences-update.integration.test.tsx
- [ ] T016 [P] Integration test: Authentication flow for /my-skins route in
      src/skins/**tests**/auth-guard.integration.test.tsx

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Data Models

- [ ] T017 [P] SkinsAccount interface in src/skins/models/skins-account.ts
- [ ] T018 [P] SkinsWinning interface in src/skins/models/skins-winning.ts
- [ ] T019 [P] SkinsTransaction interface in src/skins/models/skins-transaction.ts
- [ ] T020 [P] Season interface and PayoutFrequency enum in src/skins/models/season.ts

### API Services

- [ ] T021 [P] Skins API service with TanStack Query in src/skins/services/skins-api.ts
- [ ] T022 [P] Skin transactions API service in src/skins/services/skin-transactions-api.ts
- [ ] T023 [P] Skin settings API service in src/skins/services/skin-settings-api.ts

### Custom Hooks

- [ ] T024 [P] useSkinsAccount hook in src/skins/hooks/use-skins-account.ts
- [ ] T025 [P] useSkinsWinnings hook in src/skins/hooks/use-skins-winnings.ts
- [ ] T026 [P] useSkinsTransactions hook in src/skins/hooks/use-skins-transactions.ts
- [ ] T027 [P] useSkinsPreferences hook in src/skins/hooks/use-skins-preferences.ts

### Utility Components

- [ ] T028 [P] SeasonSelector dropdown component in src/skins/components/season-selector.tsx
- [ ] T029 [P] EmptyState component in src/skins/components/empty-state.tsx
- [ ] T030 [P] LoadingState component in src/skins/components/loading-state.tsx

### Display Components

- [ ] T031 SkinsBalance component with mobile-first design in src/skins/components/skins-balance.tsx
- [ ] T032 SkinsWinnings table component with responsive layout in
      src/skins/components/skins-winnings.tsx
- [ ] T033 SkinsTransactions table with Bootstrap styling in
      src/skins/components/skins-transactions.tsx
- [ ] T034 SkinsPreferences form component in src/skins/components/skins-preferences.tsx

### Main Screen

- [ ] T035 SkinsAccountScreen page component with mobile-first layout in
      src/skins/screens/skins-account-screen.tsx

## Phase 3.4: Integration

- [ ] T036 Connect SkinsAccountScreen to authentication context and add route protection
- [ ] T037 Integrate API services with existing BHMC authentication headers
- [ ] T038 Add error boundaries and global error handling for skins feature
- [ ] T039 Connect season filtering across all data components

## Phase 3.5: Polish

- [ ] T040 [P] Unit tests for currency formatting utilities in
      src/skins/utils/**tests**/format-currency.test.ts
- [ ] T041 [P] Unit tests for date formatting utilities in
      src/skins/utils/**tests**/format-date.test.ts
- [ ] T042 [P] Unit tests for season utilities in src/skins/utils/**tests**/season-utils.test.ts
- [ ] T043 Performance optimization with React.memo for expensive components
- [ ] T044 [P] Accessibility testing with screen reader and keyboard navigation
- [ ] T045 [P] Mobile responsiveness testing on various screen sizes
- [ ] T046 [P] Update main navigation to include /my-skins link
- [ ] T047 Run quickstart.md manual testing scenarios and verify all acceptance criteria

## Dependencies

- Setup (T001-T003) before all other tasks
- Tests (T004-T016) before implementation (T017-T035)
- Models (T017-T020) before services (T021-T023)
- Services before hooks (T024-T027)
- Hooks before components (T028-T034)
- Components before main screen (T035)
- Core implementation before integration (T036-T039)
- Implementation before polish (T040-T047)

## Parallel Example

```bash
# Phase 3.2: Launch API contract tests together
Task: "Contract test GET /api/accounts/skins/ in src/skins/services/__tests__/skins-api.test.ts"
Task: "Contract test GET /api/accounts/skin-transactions/ in src/skins/services/__tests__/skin-transactions-api.test.ts"
Task: "Contract test PATCH /api/accounts/skin-settings/ in src/skins/services/__tests__/skin-settings-api.test.ts"

# Phase 3.2: Launch component tests together
Task: "Component test SkinsBalance in src/skins/components/__tests__/skins-balance.test.tsx"
Task: "Component test SkinsWinnings in src/skins/components/__tests__/skins-winnings.test.tsx"
Task: "Component test SkinsTransactions in src/skins/components/__tests__/skins-transactions.test.tsx"

# Phase 3.3: Launch model creation together
Task: "SkinsAccount interface in src/skins/models/skins-account.ts"
Task: "SkinsWinning interface in src/skins/models/skins-winning.ts"
Task: "SkinsTransaction interface in src/skins/models/skins-transaction.ts"
```

## Notes

- [P] tasks = different files, no dependencies between them
- Verify all tests fail before implementing features
- Commit after each completed task
- Mobile-first approach: design for smallest screens first
- Use existing BHMC patterns for consistency
- Follow React constitution compliance verified in plan.md

## Task Generation Rules

_Applied during main() execution_

1. **From API Contracts**:
   - api.md → 3 contract test tasks [P] (different service files)
   - 3 API endpoints → 3 service implementation tasks [P]
2. **From Component Contracts**:

   - components.md → 6 component test tasks [P] (different component files)
   - Component interfaces → 6 component implementation tasks

3. **From Data Model**:
   - 4 core entities → 4 model creation tasks [P] (different files)
   - TanStack Query patterns → 4 hook creation tasks [P]
4. **From User Stories (spec.md)**:

   - 6 acceptance scenarios → 4 integration test tasks [P]
   - Mobile-first requirement → responsive testing tasks

5. **Ordering**:
   - Setup → Tests → Models → Services → Hooks → Components → Screen → Integration → Polish
   - Dependencies prevent parallel execution within phases

## Validation Checklist

_GATE: Checked by main() before returning_

- [x] All API contracts (3) have corresponding tests (T004-T006)
- [x] All component contracts (6) have component tests (T007-T012)
- [x] All entities (4) have model tasks (T017-T020)
- [x] All tests (T004-T016) come before implementation (T017-T035)
- [x] Parallel tasks truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Integration tests cover main user flows
- [x] Mobile-first design requirements addressed
- [x] Authentication integration included
- [x] Performance and accessibility testing included
