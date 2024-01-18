import { useCallback } from "react"

import { RefundData } from "../models/refund"
import { httpClient } from "../utils/api-client"
import { apiUrl } from "../utils/api-utils"

// TODO: this will fail because we need to create a new endpoint for refunds
// that accepts an array of refunds and refund fee ids.
export function useIssueRefunds() {
  return useCallback((refunds: Map<number, RefundData>) => {
    const posts: Promise<void>[] = []
    refunds.forEach((refund) => {
      if (refund.refund_fees?.length > 0) {
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

export function useIssueMultipleRefunds() {
  return useCallback((refunds: Map<number, RefundData>) => {
    const refundList: RefundData[] = []
    refunds.forEach((refund) => {
      if (refund.refund_fees?.length > 0) {
        refundList.push(refund)
      }
    })

    if (refundList.length > 0) {
      return httpClient(apiUrl("issue-refunds"), {
        body: JSON.stringify({ refunds: refundList }),
      })
    } else {
      return Promise.resolve()
    }
  }, [])
}
