import { expect, test, vi } from "vitest"

import { PendingStep } from "../../../context/registration-reducer"
import { ClubEvent, ClubEventApiSchema } from "../../../models/club-event"
import { RegistrationType } from "../../../models/codes"
import { TestEventType, getTestEvent } from "../../../test/data/test-events"
import {
  renderWithAuth,
  screen,
  setupAnonymousUser,
  setupAuthenticatedUser,
  setupReturningMember,
  verifyNeverOccurs,
  waitFor,
} from "../../../test/test-utils"
import { RegisterButton } from "../register-button"

test("renders the button for an authenticated user in the season sign-up event", async () => {
  setupAuthenticatedUser()

  const eventData = getTestEvent(TestEventType.season, "registration")
  const clubEvent = new ClubEvent(ClubEventApiSchema.parse(eventData))

  renderWithAuth(
    <div>
      <RegisterButton
        clubEvent={clubEvent}
        hasSignedUp={false}
        currentStep={PendingStep}
        onClick={vi.fn()}
      />
    </div>,
  )

  await waitFor(() => expect(screen.getByRole("button")).toBeEnabled())
})

test("renders null for an authenticated user who has already signed up for the season sign-up event", async () => {
  setupAuthenticatedUser()

  const eventData = getTestEvent(TestEventType.season, "registration")
  const clubEvent = new ClubEvent(ClubEventApiSchema.parse(eventData))

  renderWithAuth(
    <div>
      <RegisterButton
        clubEvent={clubEvent}
        hasSignedUp={true}
        currentStep={PendingStep}
        onClick={vi.fn()}
      />
    </div>,
  )

  await verifyNeverOccurs(() => expect(screen.getByRole("button")).toBeVisible(), {
    timeout: 100,
  })
})

test("renders the button for an authenticated returning member", async () => {
  const eventData = getTestEvent(TestEventType.season, "registration")
  const clubEvent = new ClubEvent(
    ClubEventApiSchema.parse({
      ...eventData,
      registration_type: RegistrationType.ReturningMembersOnly,
    }),
  )

  setupReturningMember(clubEvent.season)

  renderWithAuth(
    <div>
      <RegisterButton
        clubEvent={clubEvent}
        hasSignedUp={false}
        currentStep={PendingStep}
        onClick={vi.fn()}
      />
    </div>,
  )

  await waitFor(() => expect(screen.getByRole("button")).toBeEnabled())
})

test("does not enable the button for a rando and a ReturningMembersOnly event", async () => {
  const eventData = getTestEvent(TestEventType.season, "registration")
  const clubEvent = new ClubEvent(
    ClubEventApiSchema.parse({
      ...eventData,
      registration_type: RegistrationType.ReturningMembersOnly,
    }),
  )

  setupAuthenticatedUser(false)

  renderWithAuth(
    <div>
      <RegisterButton
        clubEvent={clubEvent}
        hasSignedUp={false}
        currentStep={PendingStep}
        onClick={vi.fn()}
      />
    </div>,
  )

  const btn = await screen.findByRole("button")
  expect(btn).toBeDisabled()
})

test("renders the button for a member and a weeknight event", async () => {
  setupAuthenticatedUser()

  const eventData = getTestEvent(TestEventType.weeknight, "registration")
  const clubEvent = new ClubEvent(ClubEventApiSchema.parse(eventData))

  renderWithAuth(
    <div>
      <RegisterButton
        clubEvent={clubEvent}
        hasSignedUp={false}
        currentStep={PendingStep}
        onClick={vi.fn()}
      />
    </div>,
  )

  await waitFor(() => expect(screen.getByRole("button")).toBeEnabled())
})

test("renders disabled for a non-member and a weeknight event", async () => {
  setupAuthenticatedUser(false) // false = non-member

  const eventData = getTestEvent(TestEventType.weeknight, "registration")
  const clubEvent = new ClubEvent(ClubEventApiSchema.parse(eventData))

  renderWithAuth(
    <div>
      <RegisterButton
        clubEvent={clubEvent}
        hasSignedUp={false}
        currentStep={PendingStep}
        onClick={vi.fn()}
      />
    </div>,
  )

  const btn = await screen.findByRole("button")
  expect(btn).toBeDisabled()
})

test("renders disabled for an anonymous user and a weeknight event", async () => {
  setupAnonymousUser()

  const eventData = getTestEvent(TestEventType.weeknight, "registration")
  const clubEvent = new ClubEvent(ClubEventApiSchema.parse(eventData))

  renderWithAuth(
    <div>
      <RegisterButton
        clubEvent={clubEvent}
        hasSignedUp={false}
        currentStep={PendingStep}
        onClick={vi.fn()}
      />
    </div>,
  )

  const btn = await screen.findByRole("button")
  expect(btn).toBeDisabled()
})

test("renders disabled for a member and a weeknight event in the future", async () => {
  setupAuthenticatedUser()

  const eventData = getTestEvent(TestEventType.weeknight, "future")
  const clubEvent = new ClubEvent(ClubEventApiSchema.parse(eventData))

  renderWithAuth(
    <div>
      <RegisterButton
        clubEvent={clubEvent}
        hasSignedUp={false}
        currentStep={PendingStep}
        onClick={vi.fn()}
      />
    </div>,
  )

  const btn = await screen.findByRole("button")
  expect(btn).toBeDisabled()
})

test("renders null for a member and a weeknight event in the past", async () => {
  setupAuthenticatedUser()

  const eventData = getTestEvent(TestEventType.weeknight, "past")
  const clubEvent = new ClubEvent(ClubEventApiSchema.parse(eventData))

  renderWithAuth(
    <div>
      <RegisterButton
        clubEvent={clubEvent}
        hasSignedUp={false}
        currentStep={PendingStep}
        onClick={vi.fn()}
      />
    </div>,
  )

  await verifyNeverOccurs(() => expect(screen.getByRole("button")).toBeVisible(), {
    timeout: 100,
  })
})

test("renders the button for a non-member and an open event", async () => {
  setupAuthenticatedUser(false) // false = non-member

  const eventData = getTestEvent(TestEventType.open, "registration")
  const clubEvent = new ClubEvent(ClubEventApiSchema.parse(eventData))

  renderWithAuth(
    <div>
      <RegisterButton
        clubEvent={clubEvent}
        hasSignedUp={false}
        currentStep={PendingStep}
        onClick={vi.fn()}
      />
    </div>,
  )

  await waitFor(() => expect(screen.getByRole("button")).toBeEnabled())
})

test("renders disabled for a non-member without a ghin and an open event", async () => {
  setupAuthenticatedUser(false, null) // false = non-member, null = no ghin

  const eventData = getTestEvent(TestEventType.open, "registration")
  const clubEvent = new ClubEvent(ClubEventApiSchema.parse(eventData))

  renderWithAuth(
    <div>
      <RegisterButton
        clubEvent={clubEvent}
        hasSignedUp={false}
        currentStep={PendingStep}
        onClick={vi.fn()}
      />
    </div>,
  )

  const btn = await screen.findByRole("button")
  expect(btn).toBeDisabled()
})

test("renders disabled for a non-member and a member-guest event", async () => {
  setupAuthenticatedUser(false) // false = non-member

  const eventData = getTestEvent(TestEventType.guest, "registration")
  const clubEvent = new ClubEvent(ClubEventApiSchema.parse(eventData))

  renderWithAuth(
    <div>
      <RegisterButton
        clubEvent={clubEvent}
        hasSignedUp={false}
        currentStep={PendingStep}
        onClick={vi.fn()}
      />
    </div>,
  )

  const btn = await screen.findByRole("button")
  expect(btn).toBeDisabled()
})

test("renders null for an event without registration", async () => {
  setupAuthenticatedUser()

  const eventData = getTestEvent(TestEventType.deadline, "registration")
  const clubEvent = new ClubEvent(ClubEventApiSchema.parse(eventData))

  renderWithAuth(
    <div>
      <RegisterButton
        clubEvent={clubEvent}
        hasSignedUp={false}
        currentStep={PendingStep}
        onClick={vi.fn()}
      />
    </div>,
  )

  await verifyNeverOccurs(() => expect(screen.getByRole("button")).toBeVisible(), {
    timeout: 100,
  })
})
