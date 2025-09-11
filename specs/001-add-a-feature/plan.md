# Implementation Plan: Skins Account Management UI

**Branch**: `001-add-a-feature` | **Date**: September 10, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/home/stuart/code/bhmc/specs/001-add-a-feature/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, or `GEMINI.md` for Gemini CLI).
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Create a React-based skins account management UI at `/my-skins` that allows authenticated club
members to view their skins winnings, transaction history, current balance, and manage payout
preferences. The feature integrates with an existing Django API and uses React, TanStack Query, and
Bootstrap 5 to maintain consistency with the existing BHMC web application.

## Technical Context

**Language/Version**: TypeScript/JavaScript (React 18+)  
**Primary Dependencies**: React, TanStack Query, Bootstrap 5, React Router  
**Storage**: Django API integration (development: http://localhost:8000/api/accounts/, production:
https://data.bhmc.org/api)  
**Testing**: Vitest/Jest, React Testing Library (unit tests colocated in **tests** subfolders)  
**Target Platform**: Web browsers (modern ES2020+ support) **Project Type**: mobile-first web
application - frontend integration with existing Django backend  
**Performance Goals**: <2s initial page load, <500ms data fetching, mobile-optimized  
**Constraints**: Must match existing BHMC application look/feel, authenticated members only,
mobile-first responsive design  
**Scale/Scope**: Single page feature in /src/skins subfolder, ~5-10 components, season-based data
filtering

**Additional Context**: This is a mobile-first web application. The skins accounts feature will be
implemented in React, TanStack Query, and Bootstrap 5 with mobile-first responsive design. It must
provide the same look and feel as the rest of the web application. The Django API provides the data
and runs in development at http://localhost:8000/api/accounts/. All code will be organized in
/src/skins subfolder with unit tests colocated in **tests** subfolders. DTO models are defined in
bhmc-api/accounts/serializers.py.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Simplicity**:

- Projects: 1 (frontend React component integration)
- Using framework directly? (Yes - React, TanStack Query, Bootstrap without wrappers)
- Single data model? (Yes - skins entities mapped directly from API)
- Avoiding patterns? (Using existing BHMC patterns, no unnecessary abstractions)

**Architecture**:

- EVERY feature as library? (Following existing BHMC component pattern)
- Libraries listed: skins-account-components (screens, hooks, models)
- CLI per library: N/A (web frontend)
- Library docs: Following existing component documentation patterns

**Testing (NON-NEGOTIABLE)**:

- RED-GREEN-Refactor cycle enforced? (Yes - tests written first)
- Git commits show tests before implementation? (Will follow TDD)
- Order: Contract→Integration→E2E→Unit strictly followed? (Yes)
- Real dependencies used? (Yes - actual API endpoints)
- Integration tests for: API integration, routing, authentication flows
- FORBIDDEN: Implementation before test, skipping RED phase

**Observability**:

- Structured logging included? (Using existing BHMC error handling)
- Frontend logs → backend? (Following existing logging patterns)
- Error context sufficient? (Error boundaries and user feedback)

**Versioning**:

- Version number assigned? (1.0.0 - new feature)
- BUILD increments on every change? (Following existing release process)
- Breaking changes handled? (N/A - new feature, no breaking changes)

## Post-Design Constitution Check

_Re-evaluation after Phase 1 design artifacts complete_

> **Status**: ✅ COMPLIANT with React Instructions
>
> **Evaluated Against**: `/home/stuart/code/bhmc/.github/instructions/react.instructions.md`

### ✅ Architecture Compliance

- **Functional Components**: All components use hooks pattern (see contracts/components.md)
- **Component Composition**: Clear separation between display and container components
- **Feature Organization**: Components organized in `/src/skins/` subfolder with colocated tests
- **Mobile-First**: Bootstrap responsive utilities and mobile-optimized layouts
- **Data Flow**: Props down, events up pattern maintained in all designs

### ✅ TypeScript Integration

- **Interfaces**: Comprehensive prop and data model interfaces defined
- **Type Safety**: All components, hooks, and API responses properly typed
- **Generic Components**: LoadingState and EmptyState support generic usage
- **Built-in Types**: Uses React.FC and proper event handler typing

### ✅ State Management

- **TanStack Query**: Server state with proper caching and background updates
- **useState**: Local component state for UI interactions
- **useContext**: Leverages existing auth context
- **Custom Hooks**: Dedicated hooks for each data domain (4 hooks planned)

### ✅ Performance Optimization

- **React.memo**: Applied to expensive table components
- **Code Splitting**: Skins section can be lazy-loaded
- **useMemo**: Computed values like totals and summaries
- **Proper Dependencies**: All hooks have correct dependency arrays

### ✅ Data Fetching

- **Modern Library**: TanStack Query for all API interactions
- **Loading States**: Skeleton loaders and spinner components
- **Error Handling**: Comprehensive error boundaries and retry mechanisms
- **Optimistic Updates**: Preference updates with immediate feedback
- **Race Conditions**: Proper query key management

### ✅ Testing Strategy

- **React Testing Library**: Component behavior testing (not implementation)
- **Vitest**: Test runner and assertions
- **Integration Tests**: Full user flows and error scenarios
- **Accessibility Testing**: Keyboard and screen reader compatibility

### ✅ Security & Accessibility

- **Input Sanitization**: All user data properly escaped
- **Authentication**: Existing auth patterns maintained
- **Semantic HTML**: Tables, forms, and navigation use proper elements
- **ARIA Attributes**: Form labels and table headers properly associated
- **Keyboard Navigation**: All interactive elements accessible

**CONCLUSION**: Design fully compliant with React instructions. Ready for task generation.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: [DEFAULT to Option 1 unless Technical Context indicates web/mobile app]

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:

   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Extract entities from feature spec** → `data-model.md`:

   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:

   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:

   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:

   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `/scripts/update-agent-context.sh [claude|gemini|copilot]` for your AI assistant
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/\*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Load `/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:

- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS - See React instructions compliance above
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (None required)

---

_Based on Constitution v2.1.1 - See `/memory/constitution.md`_
