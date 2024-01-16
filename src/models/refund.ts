import { EventFee } from "./event-fee"
import { PaymentData } from "./payment"
import { ReserveSlot } from "./reserve"

export interface Refund {
  id: number
  eventFee: EventFee
  paidBy: string
  payment: PaymentData
  selected: boolean
}

export interface RefundData {
  payment: number
  refund_amount: number
  notes: string
}

export const createRefunds = (slots: ReserveSlot[], notes: string) => {
  const feeDetails = slots.flatMap((slot) => slot.fees)
  return feeDetails
    .filter((fee) => fee.selected)
    .reduce((acc, curr) => {
      const refund = acc.get(curr.payment.id)
      if (refund) {
        refund.refund_amount += curr.eventFee.amount
      } else {
        acc.set(curr.payment.id, {
          payment: curr.payment.id,
          refund_amount: curr.eventFee.amount,
          notes,
        })
      }
      return acc
    }, new Map<number, RefundData>())
}
