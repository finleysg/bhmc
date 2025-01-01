import { useState } from "react"

import { Outlet, useOutletContext, useParams } from "react-router-dom"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { useEventRegistration } from "../hooks/use-event-registration"
import { usePaymentAmount } from "../hooks/use-payments"
import * as config from "../utils/app-config"

export type PaymentAmountContextType = { amount: number }

export function PaymentFlow() {
  const { paymentId } = useParams()
  const [stripePromise] = useState(() => loadStripe(config.stripePublicKey))
  const { data: stripeAmount, status } = usePaymentAmount(+paymentId!)
  const { stripeClientSession } = useEventRegistration()

  if (status === "pending") {
    return null
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        currency: "usd",
        amount: stripeAmount,
        customerSessionClientSecret: stripeClientSession,
      }}
    >
      <Outlet context={{ amount: stripeAmount! } satisfies PaymentAmountContextType} />
    </Elements>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCurrentPaymentAmount() {
  return useOutletContext<PaymentAmountContextType>()
}
