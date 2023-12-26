import { useQuery } from "@tanstack/react-query"

import { PaymentReportData, PaymentReportSchema } from "../models/payment"
import { getMany } from "../utils/api-client"

export function usePaymentData(eventId: number) {
  const endpoint = `events/${eventId}/payment-report/`
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => getMany<PaymentReportData>(endpoint, PaymentReportSchema),
  })
}
