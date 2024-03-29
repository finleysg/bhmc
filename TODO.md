# 2024 TODO List

## High Priority

- [x] Upgrade MySQL to version 8.0 so we can upgrade Django
      (https://www.pythonanywhere.com/forums/topic/32791/).
- [x] Server-side: register.utils is using a hard-coded tee time split. Needs to be dynamic.
- [x] Refactor registration edit to work within new routing.
- [x] Rework membership report to show returning vs new members.
- [x] Refresh the event signup document.
- [x] Add a warning to event report if payment is not confirmed. (Notify treasurer that player owes
      us money.) For now, rely on $0 paid. Revisit in April/May.
- [x] Add a payment detail screen to assist researching payment issues/history.
- [x] Friend picker rendering: pullout menu (right side) on mobile.
- [x] Support returning member only registration.
- [x] Priority sign up one hour before regular sign up (can-choose events only).
- [x] Countdown on the register button and enable without the need for a refresh.
- [x] Champions page (with pics per season).
- [x] Fix any issues with transition from tokens to same-site cookies.
- [x] Rework event report to reflect changes in payment amounts.
- [x] Rework payment report to reflect changes in payment amounts.
- [x] Rethink - when player is dropped, should we delete the fee records? (no)
- [x] Import champions for major events (Excel).
- [x] In the rates card, show the override fees as well.
- [x] Mobile formatting review and repair.
- [x] Convert to typescript
- [x] Skins report
- [x] Player registration notes (admin)
- [x] Registration notes report
- [x] Can-choose admin: TODO: Need to support the 'isMoneyOwed' flag

## Would Like To Do

- [x] Select "All" on my scores.
- [ ] Export scores from my scores.
- [ ] Import Chicago scores.
- [x] Anchors on the policy page for direct links to specific policies.
- [ ] Standard "view more" on long lists.
- [ ] Tables with sorting (reports and list of registered players).
- [ ] Server-side validation of payment overrides.
- [ ] Job/command to reset membership at year end.
- [ ] Add senior/non-senior to the registration types.
- [ ] Support dark mode (problem with Bootsrap cards).
- [ ] Clean up restriction modeling on server-side (remove from FeeType).
- [ ] Update expired card (https://stripe.com/docs/api/payment_methods/update).
- [ ] Save image in a separate folder.
- [ ] Remove images no longer selected.
- [ ] View season long points by event.
- [ ] View season long points by player.
- [ ] View my season long points by year.
- [ ] Hide the event documents card when no documents are found.
- [ ] Refresh the event scoring document.
- [ ] Manage a version number and render in the footer.
- [x] Improve payment report with better currency and date formatting.

## Bugs

- [x] Bug - Saving cc info doesn't appear to work after stripe upgrade.
- [x] Bug - photo gallery / infinite scroll not working.
- [x] Bug - navigate directly to a controlled page doesn't work (sent home).
- [x] Bug - refund amounts must reflect override amount if that applies.
- [ ] Bug - on the edit flow, existing checked fees should render as disabled.
- [ ] Bug - Dates on the detail page not rendering well on mobile.
- [ ] Bug - admin header menu does not render well on mobile.
- [ ] Bug - champions page has key collisions (warning in dev tools).
- [ ] Bug - registration-slot-line-item: existing fees should be a map. Expression is not right.
