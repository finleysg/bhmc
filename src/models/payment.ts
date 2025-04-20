import { immerable } from "immer"
import { z } from "zod"

import { AdminPaymentDetailAction } from "./codes"
import { EventFee } from "./event-fee"

const transactionFixedCost = 0.3
const transactionPercentage = 0.029

export const PaymentDetailApiSchema = z.object({
  id: z.number(),
  event_fee: z.number(),
  registration_slot: z.number().nullish(), // caused by refunds
  payment: z.number(),
  is_paid: z.boolean().nullish(),
  amount: z.coerce.number().nullish(),
})

export const PaymentApiSchema = z.object({
  id: z.number(),
  event: z.number(),
  user: z.number().nullish(),
  payment_code: z.string(),
  payment_key: z.string().nullish(),
  payment_amount: z.coerce.number().nullish(),
  transaction_fee: z.coerce.number().nullish(),
  notification_type: z.string().nullish(),
  confirmed: z.boolean(),
  payment_details: z.array(PaymentDetailApiSchema).optional(),
})
// export const PaymentReportSchema = PaymentApiSchema.extend({
//   payment_date: z.coerce.date(),
//   user_first_name: z.string(),
//   user_last_name: z.string(),
// }).omit({ user: true })

export type PaymentDetailData = z.infer<typeof PaymentDetailApiSchema>
export type PaymentData = z.infer<typeof PaymentApiSchema>
// export type PaymentReportData = z.infer<typeof PaymentReportSchema>
export type PaymentAmount = {
  subtotal: number
  transactionFee: number
  total: number
}

export const NoAmount = {
  subtotal: 0,
  transactionFee: 0,
  total: 0,
} as PaymentAmount

export class PaymentDetail {
  [immerable] = true

  id: number
  eventFeeId: number
  slotId?: number | null
  paymentId: number
  isPaid: boolean
  amount: number
  selected: boolean

  constructor(json: PaymentDetailData) {
    this.id = json.id
    this.eventFeeId = json.event_fee
    this.slotId = json.registration_slot
    this.paymentId = json.payment
    this.isPaid = json.is_paid ?? false
    this.amount = +(json.amount ?? 0)
    this.selected = false
  }
}

export class PaymentDetailEdit {
  [immerable] = true

  eventFeeId: number
  slotId: number
  action: AdminPaymentDetailAction

  constructor() {
    this.eventFeeId = 0
    this.slotId = 0
    this.action = AdminPaymentDetailAction.None
  }
}

export class Payment {
  [immerable] = true

  id: number
  eventId: number
  userId?: number | null
  paymentCode: string
  paymentKey: string
  paymentAmount: number
  transactionFee: number
  notificationType?: string | null
  confirmed: boolean
  details: PaymentDetail[]
  edits: PaymentDetailEdit[]

  constructor(json: PaymentData) {
    this.id = json.id
    this.eventId = json.event
    this.paymentCode = json.payment_code
    this.paymentKey = json.payment_key ?? "n/a"
    this.paymentAmount = json.payment_amount ?? 0
    this.transactionFee = json.transaction_fee ?? 0
    this.notificationType = json.notification_type
    this.confirmed = json.confirmed
    this.userId = json.user
    this.details = json?.payment_details?.map((f) => new PaymentDetail(f)) ?? []
    this.edits = []
  }

  static createPlaceholder(eventId: number, userId: number) {
    return new this({
      id: 0,
      event: eventId,
      user: userId,
      payment_code: "",
      payment_key: "",
      confirmed: false,
    })
  }

  /**
   * Returns true if there are payment details
   */
  hasPaymentDetails() {
    return this.details.length > 0
  }

  /**
   * Calculates the amount due from the payment details
   * @param {Map} eventFees - The event fee map from the club event
   */
  getAmountDue(eventFees?: Map<number, EventFee>) {
    if (this.details.length === 0 || !eventFees) {
      return NoAmount
    }

    const subtotal = this.details.reduce((sum, detail) => sum + detail.amount, 0)
    const total = (subtotal + transactionFixedCost) / (1.0 - transactionPercentage)
    const transactionFee = total - subtotal
    return {
      subtotal,
      transactionFee,
      total,
    } as PaymentAmount
  }

  /**
   * Calculates the amount due from the payment edits
   * @param {Map} eventFees - The event fee map from the club event
   */
  // getAmountChange(eventFees: Map<number, EventFee>) {
  //   if (this.edits.length > 0) {
  //     const subtotal = this.edits
  //       .map(
  //         (e) =>
  //           eventFees.get(e.eventFeeId)?.amount ??
  //           0 * (e.action === AdminPaymentDetailAction.Add ? 1 : -1),
  //       )
  //       .reduce((f1, f2) => f1 + f2, 0)
  //     return Payment.calculateFees(subtotal, true)
  //   } else {
  //     return {
  //       subtotal: 0,
  //       transactionFee: 0,
  //       total: 0,
  //     }
  //   }
  // }
}
