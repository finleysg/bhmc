import { EventFee } from "./event-fee"
import { PaymentData } from "./payment"
import { ReserveSlot } from "./reserve"

export interface Refund {
  id: number
  eventFee: EventFee
  paidBy: string
  payment: PaymentData
  amountPaid: number
  selected: boolean
}

export interface RefundInstance {
  event_fee_id: number
  amount_paid: number
}

export interface RefundData {
  payment: number
  refund_fees: RefundInstance[]
  notes: string
}

export const createRefunds = (slots: ReserveSlot[], notes: string) => {
  const feeDetails = slots.flatMap((slot) => slot.fees)
  return feeDetails
    .filter((fee) => fee.selected)
    .reduce((acc, curr) => {
      const refund = acc.get(curr.payment.id)
      if (refund) {
        refund.refund_fees.push({ event_fee_id: curr.eventFee.id, amount_paid: curr.amountPaid })
      } else {
        acc.set(curr.payment.id, {
          payment: curr.payment.id,
          refund_fees: [{ event_fee_id: curr.eventFee.id, amount_paid: curr.amountPaid }],
          notes,
        })
      }
      return acc
    }, new Map<number, RefundData>())
}
