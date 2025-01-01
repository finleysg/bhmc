import { useQuery } from "@tanstack/react-query"

import { httpClient } from "../utils/api-client"
import { apiUrl } from "../utils/api-utils"

export function usePaymentAmount(paymentId: number) {
  const endpoint = apiUrl(`payments/${paymentId}/amount/`)
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => httpClient(endpoint),
    staleTime: 0,
  })
}

export function useCustomerSession() {
  const endpoint = apiUrl("create-customer-session/")
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => httpClient(endpoint, { method: "POST", body: JSON.stringify({}) }),
    staleTime: 0,
    select: (data) => data.client_secret,
  })
}
