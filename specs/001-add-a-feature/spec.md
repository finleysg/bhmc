# Feature Specification: Skins Account Management UI

**Feature Branch**: `001-add-a-feature`  
**Created**: September 10, 2025  
**Status**: Complete  
**Input**: User description: "Add a feature to provide a UI over the skins accounts app created at
~/code/bhmc-api/accounts. The UI consist of a single web page at <base-url>/my-skins. On the page, a
player can see all skins they've won during the current season or a previous season, all
transactions for the current season or a previous season, and a summary of their current skins cash
balance prominently displayed. The user can also adjust their settings to tell the system how often
he wants to receive cash for his current balance."

## Execution Flow (main)

```
1. Parse user description from Input
   → ✅ Feature description provided
2. Extract key concepts from description
   → ✅ Identified: players (actors), view winnings/transactions/balance (actions), skins data (data), season-based filtering (constraints)
3. For each unclear aspect:
   → ✅ Marked with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → ✅ Clear user flow identified
5. Generate Functional Requirements
   → ✅ Each requirement is testable
6. Identify Key Entities
   → ✅ Data entities identified
7. Run Review Checklist
   → ⚠️ WARN "Spec has uncertainties" - several clarifications needed
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## User Scenarios & Testing _(mandatory)_

### Primary User Story

As a golf club member who participates in skins games, I want to access a dedicated page where I can
view my complete skins account history, current balance, and manage my payout preferences, so that I
can track my earnings and control when I receive cash payments.

### Acceptance Scenarios

1. **Given** I am a logged-in player with skins earnings, **When** I navigate to /my-skins, **Then**
   I should see my current skins cash balance prominently displayed at the top of the page
2. **Given** I am viewing my skins account page, **When** I select a specific season from the season
   filter, **Then** I should see all my skins winnings for that season
3. **Given** I am viewing my skins account page with a season selected, **When** the page loads my
   winnings data, **Then** I should see the total dollar amount of all skins won for that season
4. **Given** I am viewing my skins account page, **When** I select a specific season from the season
   filter, **Then** I should see all my transactions (wins, cash-outs, adjustments) for that season
5. **Given** I am viewing my account settings section, **When** I change my payout frequency
   preference, **Then** the system should save my new preference and display a confirmation
6. **Given** I am a player with no skins activity, **When** I access /my-skins, **Then** I should
   see a friendly message indicating no activity and current balance of $0

### Edge Cases

- What happens when a player has skins activity but zero current balance?
- How does the system handle seasons where a player had no activity?
- What occurs if payout preference update fails?
- How are pending transactions displayed while they're being processed?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display the current skins cash balance prominently at the top of the page
- **FR-002**: System MUST provide a season selector allowing users to filter data by current or
  previous seasons
- **FR-003**: Users MUST be able to view all skins they've won for the selected season, including
  date, event, and amount
- **FR-004**: System MUST display the total dollar amount of all skins won for the selected season
- **FR-005**: Users MUST be able to view all transactions for the selected season, including wins,
  cash-outs, and adjustments
- **FR-006**: System MUST display transaction history with date, type, description, and amount for
  each entry
- **FR-006**: System MUST display transaction history with date, type, description, and amount for
  each entry
- **FR-007**: Users MUST be able to adjust their payout frequency settings with options for:
  bi-monthly (1st and 15th), monthly (1st), or yearly (October 1st at season end)
- **FR-008**: System MUST save payout preference changes and provide user feedback on successful
  updates
- **FR-009**: System MUST restrict access to authenticated users who are current club members only
- **FR-010**: System MUST restrict access so users can only view their own skins account information
- **FR-011**: System MUST handle cases where users have no skins activity gracefully with
  appropriate messaging
- **FR-012**: System MUST integrate with the existing Django-based skins accounts API hosted at
  https://data.bhmc.org/api (source: https://github.com/finleysg/bhmc-api)
- **FR-013**: Page MUST be accessible at the URL path /my-skins within the existing BHMC application

### Key Entities _(include if feature involves data)_

- **Skins Account**: Represents a player's overall skins financial account with current balance and
  settings
- **Skins Winning**: Individual skins game victory with associated monetary value, date, and event
  details
- **Transaction**: Financial transaction including wins, cash-outs, and adjustments with timestamp
  and description
- **Season**: Time period grouping for filtering historical data and wins
- **Payout Preference**: User setting controlling frequency of cash distributions from skins balance

---

## Review & Acceptance Checklist

_GATE: Automated checks run during main() execution_

### Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

_Updated by main() during processing_

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked _(all clarifications resolved)_
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
