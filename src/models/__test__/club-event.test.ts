import { isBefore, isEqual } from "date-fns"
import { expect, test } from "vitest"

import { getTestEvent, getTestEvents, TestEventType } from "../../test/data/test-events"
import { ClubEvent, ClubEventApiSchema, ClubEventData } from "../club-event"

test("club event test data is valid", () => {
  const events = getTestEvents()
  events.forEach((eventJson) => {
    const result = ClubEventApiSchema.safeParse(eventJson)

    if (!result.success) {
      const { error } = result
      console.error(`${eventJson.name} failed: ${error.message}`)
    }
    expect(result.success).toBe(true)
    if (result.success) {
      const { data } = result
      expect(data).toBeInstanceOf<ClubEventData>

      const model = new ClubEvent(data)
      expect(model).toBeInstanceOf<ClubEvent>
    }
  })
})

test("generates the correct event urls", () => {
  const eventData = getTestEvent(TestEventType.major)
  eventData.name = "2 Man Best Ball"
  eventData.start_date = "2020-10-03"
  const event1 = new ClubEvent(ClubEventApiSchema.parse(eventData))
  expect(event1.eventUrl).toEqual("/event/2020-10-03/2-man-best-ball")

  eventData.name = "Individual LG/LN Test"
  const event2 = new ClubEvent(ClubEventApiSchema.parse(eventData))
  expect(event2.eventUrl).toEqual("/event/2020-10-03/individual-lg-ln-test")

  eventData.name = "Individual LG / LN Test"
  const event3 = new ClubEvent(ClubEventApiSchema.parse(eventData))
  expect(event3.eventUrl).toEqual("/event/2020-10-03/individual-lg-ln-test")

  eventData.name = "Red, White & Blue"
  const event4 = new ClubEvent(ClubEventApiSchema.parse(eventData))
  expect(event4.eventUrl).toEqual("/event/2020-10-03/red-white-blue")
})

test("spreads multi-day events by determining an end date", () => {
  const eventData = getTestEvent(TestEventType.major)
  eventData.name = "2 Man Best Ball"
  eventData.start_date = "2020-10-03"
  const event1 = new ClubEvent(ClubEventApiSchema.parse(eventData))
  expect(isEqual(event1.startDate, event1.endDate!)).toBe(true)

  const event2 = new ClubEvent(ClubEventApiSchema.parse({ ...eventData, ...{ rounds: 2 } }))
  expect(isEqual(event2.startDate, event2.endDate!)).toBe(false)
  expect(isBefore(event2.startDate, event2.endDate!)).toBe(true)
})

test("converts event fee array into a map", () => {
  const eventData = getTestEvent(TestEventType.major)
  const event = new ClubEvent(ClubEventApiSchema.parse(eventData))

  expect(typeof event.feeMap).toBe("object")
  expect(event.feeMap.get(5)?.amount).toBe(5)
  expect(event.feeMap.get(8)?.amount).toBe(5)
  expect(event.feeMap.get(9)?.amount).toBe(5)
  expect(event.feeMap.get(10)?.amount).toBe(20)
  expect(event.feeMap.get(11)?.amount).toBe(10)
})

test("calculates the available spots for a major", () => {
  const eventData = getTestEvent(TestEventType.major)
  const event = new ClubEvent(ClubEventApiSchema.parse(eventData))
  expect(event.availableSpots()).toEqual(100)
})

test("calculates the available spots for a shotgun event", () => {
  const eventData = getTestEvent(TestEventType.shotgun)
  const event = new ClubEvent(ClubEventApiSchema.parse(eventData))
  expect(event.availableSpots()).toEqual(270)
})

test("calculates the available spots for tee times", () => {
  const eventData = getTestEvent(TestEventType.weeknight) // 2o teetimes per 9
  const event = new ClubEvent(ClubEventApiSchema.parse(eventData))
  expect(event.availableSpots()).toEqual(300)
})

test.each([
  "2024-06-11T17:00:00Z",
  "2024-06-11T18:15:00Z",
  "2024-06-14T19:59:00Z",
  "2024-06-15T10:59:00Z",
])(
  "payments are open if the current time is after priority payments start and before the payment deadline",
  (currentTime: string) => {
    const eventData = getTestEvent(TestEventType.weeknight)
    eventData.priority_signup_start = "2024-06-11T17:00:00Z"
    eventData.signup_start = "2024-06-11T18:00:00Z"
    eventData.signup_end = "2024-06-14T20:00:00Z"
    eventData.payments_end = "2024-06-15T11:00:00Z"
    const event = new ClubEvent(ClubEventApiSchema.parse(eventData))

    expect(event.paymentsAreOpen(new Date(currentTime))).toBe(true)
  },
)

test.each(["2024-06-11T16:59:00Z", "2024-06-15T11:01:00Z"])(
  "payments are not open if the current time is before priority payments start or after the payment deadline",
  (currentTime: string) => {
    const eventData = getTestEvent(TestEventType.weeknight)
    eventData.priority_signup_start = "2024-06-11T17:00:00Z"
    eventData.signup_start = "2024-06-11T18:00:00Z"
    eventData.signup_end = "2024-06-14T20:00:00Z"
    eventData.payments_end = "2024-06-15T11:00:00Z"
    const event = new ClubEvent(ClubEventApiSchema.parse(eventData))

    expect(event.paymentsAreOpen(new Date(currentTime))).toBe(false)
  },
)

test.each(["2024-06-11T18:15:00Z", "2024-06-14T19:59:00Z"])(
  "registration is open if the current time is after signup start and before signup end",
  (currentTime: string) => {
    const eventData = getTestEvent(TestEventType.weeknight)
    eventData.priority_signup_start = "2024-06-11T17:00:00Z"
    eventData.signup_start = "2024-06-11T18:00:00Z"
    eventData.signup_end = "2024-06-14T20:00:00Z"
    eventData.payments_end = "2024-06-15T11:00:00Z"
    const event = new ClubEvent(ClubEventApiSchema.parse(eventData))

    expect(event.registrationIsOpen(new Date(currentTime))).toBe(true)
  },
)

test.each(["2024-06-11T17:59:00Z", "2024-06-14T20:01:00Z"])(
  "registration is not open if the current time is before signup start or after signup end",
  (currentTime: string) => {
    const eventData = getTestEvent(TestEventType.weeknight)
    eventData.priority_signup_start = "2024-06-11T17:00:00Z"
    eventData.signup_start = "2024-06-11T18:00:00Z"
    eventData.signup_end = "2024-06-14T20:00:00Z"
    eventData.payments_end = "2024-06-15T11:00:00Z"
    const event = new ClubEvent(ClubEventApiSchema.parse(eventData))

    expect(event.registrationIsOpen(new Date(currentTime))).toBe(false)
  },
)

test.each(["2024-06-11T17:01:00Z", "2024-06-11T17:59:00Z"])(
  "priority registration is open if the current time is after priority signup start and before signup start",
  (currentTime: string) => {
    const eventData = getTestEvent(TestEventType.weeknight)
    eventData.priority_signup_start = "2024-06-11T17:00:00Z"
    eventData.signup_start = "2024-06-11T18:00:00Z"
    eventData.signup_end = "2024-06-14T20:00:00Z"
    eventData.payments_end = "2024-06-15T11:00:00Z"
    const event = new ClubEvent(ClubEventApiSchema.parse(eventData))

    expect(event.priorityRegistrationIsOpen(new Date(currentTime))).toBe(true)
  },
)

test.each(["2024-06-11T16:59:00Z", "2024-06-11T18:01:00Z"])(
  "priority registration is not open if the current time is before priority signup start or after signup start",
  (currentTime: string) => {
    const eventData = getTestEvent(TestEventType.weeknight)
    eventData.priority_signup_start = "2024-06-11T17:00:00Z"
    eventData.signup_start = "2024-06-11T18:00:00Z"
    eventData.signup_end = "2024-06-14T20:00:00Z"
    eventData.payments_end = "2024-06-15T11:00:00Z"
    const event = new ClubEvent(ClubEventApiSchema.parse(eventData))

    expect(event.priorityRegistrationIsOpen(new Date(currentTime))).toBe(false)
  },
)
