import { addDays, isWithinInterval, parse } from "date-fns"
import { immerable } from "immer"
import { z } from "zod"

import { dayDateAndTimeFormat, isoDayFormat } from "../utils/date-utils"
import { EventType, RegistrationType, StartType, getEventTypeName } from "./codes"
import { Course, CourseApiSchema } from "./course"
import { EventFee, EventFeeApiSchema } from "./event-fee"
import { RegistrationSlot } from "./registration"

export const slugify = (text: string) => {
  if (text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace("/", " ")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
  }
  return ""
}

export type RegistrationWindow = "future" | "registration" | "past" | "n/a"

export const ClubEventApiSchema = z.object({
  id: z.number(),
  can_choose: z.boolean(),
  courses: z.array(CourseApiSchema).optional(),
  default_tag: z.string().optional(),
  event_type: z.string(),
  external_url: z.string().nullish(),
  fees: z.array(EventFeeApiSchema).optional(),
  ghin_required: z.boolean(),
  group_size: z.number().nullish(),
  maximum_signup_group_size: z.number().nullish(),
  minimum_signup_group_size: z.number().nullish(),
  name: z.string(),
  notes: z.string().optional(),
  payments_end: z.coerce.date().nullish(),
  portal_url: z.string().url().nullish(),
  priority_signup_start: z.coerce.date().nullish(),
  registration_maximum: z.number().nullish(),
  registration_type: z.string(),
  registration_window: z.string(),
  rounds: z.number().nullish(),
  season: z.number(),
  season_points: z.number().nullish(),
  signup_start: z.coerce.date().nullish(),
  signup_end: z.coerce.date().nullish(),
  skins_type: z.string().nullish(),
  start_date: z.string(),
  start_time: z.string().nullish(),
  start_type: z.string().nullish(),
  status: z.string(),
  team_size: z.number().nullish(),
  tee_time_splits: z.string().nullish(),
  total_groups: z.number().nullish(),
})

export type ClubEventData = z.infer<typeof ClubEventApiSchema>

export class ClubEvent {
  [immerable] = true

  id: number
  adminUrl: string
  canChoose: boolean
  courses: Course[]
  defaultTag?: string
  endDate?: Date
  eventType: string
  eventTypeClass: string
  eventUrl: string
  externalUrl?: string | null
  fees: EventFee[]
  feeMap: Map<number, EventFee>
  ghinRequired: boolean
  groupSize?: number | null
  maximumSignupGroupSize?: number | null
  minimumSignupGroupSize?: number | null
  name: string
  notes?: string | undefined
  paymentsEnd?: Date | null
  portalUrl?: string | null
  prioritySignupStart?: Date | null
  registrationMaximum?: number | null
  registrationType: string
  registrationWindow: RegistrationWindow
  rounds: number
  season: number
  seasonPoints?: number | null
  signupStart?: Date | null
  signupEnd?: Date | null
  signupWindow: string
  skinsType?: string | null
  slugName: string
  slugDate: string
  startDate: Date
  startDateString: string
  startTime?: string | null
  startType?: string | null
  status: string
  teamSize: number
  teeTimeSplits?: string | null
  totalGroups?: number | null

  constructor(json: ClubEventData) {
    this.id = json.id
    this.canChoose = json.can_choose
    this.courses = json.courses?.map((c) => new Course(c)) ?? []
    this.defaultTag = json.default_tag
    this.eventType = json.event_type
    this.externalUrl = json.external_url
    this.fees =
      json.fees?.sort((a, b) => (a.display_order = b.display_order)).map((f) => new EventFee(f)) ??
      []
    this.ghinRequired = json.ghin_required
    this.groupSize = json.group_size
    this.maximumSignupGroupSize = json.maximum_signup_group_size
    this.minimumSignupGroupSize = json.minimum_signup_group_size
    this.name = json.name
    this.notes = json.notes
    this.paymentsEnd = json.payments_end ?? json.signup_end
    this.portalUrl = json.portal_url
    this.prioritySignupStart = json.priority_signup_start
    this.registrationMaximum = json.registration_maximum
    this.registrationType = json.registration_type
    this.registrationWindow = json.registration_window
      ? (json.registration_window as RegistrationWindow)
      : "n/a"
    this.rounds = json.rounds ?? 0
    this.season = json.season
    this.seasonPoints = json.season_points
    this.signupStart = json.signup_start
    this.signupEnd = json.signup_end
    this.skinsType = json.skins_type
    this.startDate = parse(json.start_date, "yyyy-MM-dd", new Date())
    this.startDateString = json.start_date
    this.startTime = json.start_time
    this.startType = json.start_type
    this.status = json.status
    this.teamSize = json.team_size || 1
    this.teeTimeSplits = json.tee_time_splits || ""
    this.totalGroups = json.total_groups

    // derived properties
    this.adminUrl = `/admin/event/${this.id}`
    this.endDate = this.rounds <= 1 ? this.startDate : addDays(this.startDate, this.rounds - 1)
    this.eventTypeClass = getEventTypeName(json.event_type).toLowerCase().replace(" ", "-")
    this.eventUrl = `/event/${isoDayFormat(this.startDate)}/${slugify(json.name)}`
    this.feeMap = new Map(this.fees.map((f) => [f.id, f]))
    this.slugName = slugify(json.name)
    this.slugDate = isoDayFormat(this.startDate)
    this.signupWindow = `${dayDateAndTimeFormat(this.signupStart)} to ${dayDateAndTimeFormat(
      this.signupEnd,
    )}`
  }

  /**
   * Returns true if a payment end date is configured.
   * @returns boolean
   */
  canEditRegistration() {
    return (
      (this.eventType === EventType.Major || this.eventType === EventType.Weeknight) &&
      Boolean(this.paymentsEnd)
    )
  }

  /**
   * Returns true if the current date and time is between signup start and payments end.
   * @returns boolean
   */
  paymentsAreOpen() {
    if (this.registrationType === RegistrationType.None || !this.signupStart || !this.paymentsEnd) {
      return false
    }
    return isWithinInterval(new Date(), {
      start: this.signupStart,
      end: this.paymentsEnd,
    })
  }

  /**
   * Returns true if the current date and time is between signup start and signup end.
   * @returns boolean
   */
  registrationIsOpen() {
    if (this.registrationType === RegistrationType.None || !this.signupStart || !this.signupEnd) {
      return false
    }

    return isWithinInterval(new Date(), {
      start: this.signupStart,
      end: this.signupEnd,
    })
  }

  /**
   * Returns true if this event starts in the given year and (0-based) month.
   * @param {number} year
   * @param {number} month
   */
  isCurrent(year: number, month: number) {
    return this.startDate.getFullYear() === year && this.startDate.getMonth() === month
  }

  /**
   * Returns the number of available spots, without
   * regard to existing or ongoinng registrations.
   */
  availableSpots() {
    if (this.registrationType === RegistrationType.None) {
      return null
    }
    // TODO: custom validation - the combo of canChoose (true) and groupSize (null) is invalid
    if (this.canChoose && this.groupSize) {
      if (this.startType === StartType.Shotgun) {
        const holes = this.courses[0]?.numberOfHoles
        return 2 * this.groupSize * (this.courses.length * holes)
      } else {
        if (!this.totalGroups) {
          throw "TotalGroups must have a non-zero value to calculate the available spots."
        }
        return this.groupSize * this.totalGroups * this.courses.length
      }
    } else {
      return this.registrationMaximum
    }
  }

  /**
   * Given the current registration state (slots), how many openings are left?
   * @param slots RegistrationSlot array for this event
   * @returns Number of openings or -1 (unlimited)
   */
  openSpots(slots: RegistrationSlot[]) {
    if (this.canChoose) {
      const filled = slots.filter((s) => s.status !== "A").length
      return slots.length - filled
    } else {
      const filled = slots.filter((s) => s.status === "R").length
      if (this.registrationMaximum) {
        return this.registrationMaximum - filled
      }
      return -1 // unlimited
    }
  }

  /**
   * Given a file name, ensure the name will be valid and unique.
   * @param filename The name of an event-related file (like tee times)
   * @returns A normalized file name
   */
  normalizeFilename(filename: string) {
    const name = filename
      .toLowerCase()
      .trim()
      .replace("/", " ")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
    return `${this.slugDate}-${this.slugName}-${name}`
  }

  static getClubEvent(events?: ClubEvent[], eventDate?: string, eventName?: string) {
    if (events && eventDate && eventName) {
      const event = events.find((e) => e.slugDate === eventDate && e.slugName === eventName)
      if (!event) {
        return { found: false, clubEvent: null }
      }
      return { found: true, clubEvent: event }
    }
    return { found: false, clubEvent: null }
  }
}
