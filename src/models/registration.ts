import { immerable } from "immer"
import { z } from "zod"

import { PlayerApiSchema } from "./player"

export const RegistrationFeeApiSchema = z.object({
  id: z.number(),
  event_fee: z.number(),
  registration_slot: z.number().nullish(),
  payment: z.number().nullish(),
  is_paid: z.boolean(),
  amount: z.string().nullish(),
})

export const RegistrationSlotApiSchema = z.object({
  id: z.number(),
  event: z.number(),
  registration: z.number().nullish(),
  hole: z.number().nullish(),
  player: PlayerApiSchema.nullish(),
  starting_order: z.number(),
  slot: z.number(),
  status: z.string(),
})

export const RegistrationApiSchema = z.object({
  id: z.number(),
  event: z.number(),
  course: z.number().nullish(),
  signed_up_by: z.string(),
  expires: z.coerce.date(),
  starting_hole: z.number(),
  starting_order: z.number(),
  notes: z.string().nullish(),
  created_date: z.coerce.date(),
  slots: z.array(RegistrationSlotApiSchema),
})

export type RegistrationFeeData = z.infer<typeof RegistrationFeeApiSchema>
export type RegistrationSlotData = z.infer<typeof RegistrationSlotApiSchema>
export type RegistrationData = z.infer<typeof RegistrationApiSchema>

export class RegistrationFee {
  [immerable] = true

  id: number
  eventFeeId: number
  registrationSlotId: number
  paymentId: number | null
  isPaid: boolean
  amount: number

  constructor(json: RegistrationFeeData) {
    this.id = json.id
    this.eventFeeId = json.event_fee
    this.registrationSlotId = json.registration_slot ?? 0
    this.paymentId = json.payment ?? 0
    this.isPaid = json.is_paid
    this.amount = json.amount ? +json.amount : 0
  }
}

export class RegistrationSlot {
  [immerable] = true

  id: number
  eventId: number
  registrationId: number
  holeId: number
  playerId: number
  playerName?: string
  startingOrder: number
  slot: number
  status: string
  // paidFeeIds: number[]
  obj: RegistrationSlotData

  constructor(json: RegistrationSlotData) {
    this.id = json.id
    this.eventId = json.event
    this.registrationId = json.registration ?? 0
    this.holeId = json.hole ?? 0
    this.playerId = json.player?.id ?? 0
    this.playerName = json.player
      ? `${json.player?.first_name} ${json.player?.last_name}`
      : undefined
    this.startingOrder = json.starting_order
    this.slot = json.slot
    this.status = json.status
    // this.paidFeeIds = []
    this.obj = json
  }

  getTeamNumber = (teamSize: number) => {
    if (!teamSize || teamSize === 1) {
      return 0 // no team number for singles
    }
    return this.slot < teamSize ? 1 : 2
  }
}

export class Registration {
  [immerable] = true

  id: number
  eventId: number
  courseId?: number | null
  signedUpBy: string
  expires: Date
  startingHole: number
  startingOrder: number
  notes?: string | null
  createdDate: Date
  selectedStart?: string
  slots: RegistrationSlot[]

  constructor(json: RegistrationData, selectedStart?: string) {
    this.id = json.id
    this.eventId = json.event
    this.courseId = json.course
    this.signedUpBy = json.signed_up_by
    this.expires = new Date(json.expires)
    this.startingHole = json.starting_hole
    this.startingOrder = json.starting_order
    this.notes = json.notes
    this.createdDate = new Date(json.created_date)
    this.selectedStart = selectedStart
    this.slots = json.slots ? json.slots.map((s) => new RegistrationSlot(s)) : []
  }

  addSlots = (slots: RegistrationSlot[]) => {
    this.slots = [...slots]
  }

  static emptyRegistration = () => {
    return new Registration({
      id: 0,
      event: 0,
      signed_up_by: "",
      expires: new Date(),
      starting_hole: 0,
      starting_order: 0,
      created_date: new Date(),
      slots: [],
      notes: "",
    })
  }
}
