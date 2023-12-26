import { useCallback } from "react"

import { RefundData } from "../models/refund"
import { httpClient } from "../utils/api-client"
import { apiUrl } from "../utils/api-utils"

export function useIssueRefunds() {
  return useCallback((refunds: Map<number, RefundData>) => {
    const posts: Promise<void>[] = []
    refunds.forEach((refund) => {
      if (refund.refund_amount > 0) {
        posts.push(httpClient(apiUrl("refunds"), { body: JSON.stringify(refund) }))
      }
    })

    if (posts.length > 0) {
      return Promise.all(posts)
    } else {
      return Promise.resolve()
    }
  }, [])
}
