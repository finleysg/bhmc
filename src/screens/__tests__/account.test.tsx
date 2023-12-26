import { expect, test } from "vitest"

import userEvent from "@testing-library/user-event"

import {
  renderWithAuth,
  screen,
  setupAuthenticatedUser,
  waitForLoadingToFinish,
} from "../../test/test-utils"
import { AccountScreen } from "../account"

test("can edit profile on the player account screen", async () => {
  setupAuthenticatedUser()

  renderWithAuth(<AccountScreen />)

  await waitForLoadingToFinish()

  // update player
  await userEvent.click(screen.getByRole("button", { name: /update your player profile/i }))
  await userEvent.clear(screen.getByRole("textbox", { name: /ghin/i }))
  await userEvent.type(screen.getByRole("textbox", { name: /ghin/i }), "1234567")
  await userEvent.click(screen.getByRole("button", { name: /save changes/i }))

  await screen.findByRole("alert") // toast
  expect(screen.getByText("👍 Your account changes have been saved.")).toBeInTheDocument()
})

test("the form is not submitted when it fails validation", async () => {
  setupAuthenticatedUser()

  renderWithAuth(<AccountScreen />)

  await waitForLoadingToFinish()

  // perform an invalid update
  await userEvent.click(screen.getByRole("button", { name: /update your player profile/i }))
  await userEvent.clear(screen.getByRole("textbox", { name: /email/i }))
  await userEvent.type(screen.getByRole("textbox", { name: /email/i }), "not valid")
  await userEvent.click(screen.getByRole("button", { name: /save/i }))

  await screen.findByText(/please provide a valid email address/i)
})
