import { useRef, useState } from "react"

import { useBlocker, useNavigate } from "react-router-dom"

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"

import { CancelButton } from "../components/event-registration/cancel-button"
import { RegisterCountdown } from "../components/event-registration/register-countdown"
import { ErrorDisplay } from "../components/feedback/error-display"
import { OverlaySpinner } from "../components/spinners/overlay-spinner"
import { ReviewStep } from "../context/registration-reducer"
import { useAuth } from "../hooks/use-auth"
import { useEventRegistration } from "../hooks/use-event-registration"
import { useEventRegistrationGuard } from "../hooks/use-event-registration-guard"
import * as config from "../utils/app-config"
import { useCurrentPaymentAmount } from "./payment-flow"

export function PaymentScreen() {
  const { user } = useAuth()
  const [isBusy, setIsBusy] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentCanceled, setPaymentCanceled] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { amount: stripeAmount } = useCurrentPaymentAmount()
  const {
    currentStep,
    error,
    mode,
    registration,
    cancelRegistration,
    completeRegistration,
    createPaymentIntent,
    setError,
    updateStep,
  } = useEventRegistration()

  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  useEventRegistrationGuard(registration)

  // This flag means the user has started the payment process, but
  // something went wrong and they need to cancel before leaving.
  const blocker = useBlocker(paymentProcessing)
  if (blocker.state === "blocked" && paymentCanceled) {
    blocker.proceed()
  }

  const handleBack = () => {
    updateStep(ReviewStep)
    navigate("../../review", { replace: true })
  }

  const handleCancelPayment = async () => {
    if (blocker.state === "blocked") {
      await cancelRegistration("navigation", mode)
      blocker.proceed()
    }
  }

  const handlePaymentCanceled = () => {
    setPaymentProcessing(false)
    setPaymentCanceled(true) // Overrides the blocker
    navigate("../../", { replace: true }) // event detail
  }

  const handleError = (error: unknown) => {
    console.error(error)
    if (error instanceof Error) {
      setError(error)
    } else if (Object.prototype.hasOwnProperty.call(error, "message")) {
      setError(new Error((error as { message: string }).message))
    } else {
      setError(new Error("An unknown error occurred."))
    }
  }

  const handleSubmitPayment = async () => {
    if (!buttonRef.current) {
      throw new Error("Inconceivable! Button ref not found.")
    }

    // It's unlikely we need to do both of these, but we really,
    // really, really don't want to leave the "Pay" button enabled.
    buttonRef.current.disabled = true
    setIsBusy(true)

    // Without this the spinner doesn't show up.
    setTimeout(() => {
      // no-op
    }, 10)

    try {
      // 1. Validate the payment element.
      const { error: submitError } = await elements!.submit()
      if (submitError) {
        handleError(submitError)
        return
      }
      // 2. Create the payment intent.
      const intent = await createPaymentIntent()
      setPaymentProcessing(true)

      // 3. Confirm the payment.
      const { error: confirmError } = await stripe!.confirmPayment({
        elements: elements!,
        clientSecret: intent.client_secret!,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: user.name,
              email: user.email,
              address: {
                country: "US",
              },
            },
          },
          return_url: `${window.location.origin}${window.location.pathname.replace("payment", "complete")}`,
        },
      })

      if (confirmError) {
        handleError(confirmError)
        return
      }

      // Payment processed = safe to navigate away.
      setPaymentProcessing(false)
      completeRegistration()
    } catch (err) {
      handleError(err)
    } finally {
      buttonRef.current.disabled = false
      setIsBusy(false)
    }
  }

  return (
    <div className="row">
      <div className="col-12 col-md-6">
        <div className="card mb-4">
          <div className="card-body">
            <OverlaySpinner loading={isBusy} />
            <h4 className="card-header mb-2">{currentStep.title}</h4>
            <p className="text-info fst-italic mb-4">{registration?.selectedStart}</p>
            <h6 className="text-primary">
              Amount due: {config.currencyFormatter.format(stripeAmount / 100)}
            </h6>
            {error && <ErrorDisplay error={error?.message} onClose={() => setError(null)} />}
            {blocker.state === "blocked" && (
              <div className="mb-4">
                <p>Your payment should be canceled before leaving this page.</p>
                <button className="btn btn-danger" onClick={handleCancelPayment}>
                  Cancel and Proceed
                </button>
              </div>
            )}
            <div className="mb-4">
              <PaymentElement
                options={{
                  business: { name: "BHMC" },
                  layout: {
                    type: "accordion",
                    defaultCollapsed: false,
                    radios: true,
                    spacedAccordionItems: true,
                  },
                  fields: {
                    billingDetails: {
                      name: "never",
                      email: "never",
                      address: { country: "never" },
                    },
                  },
                }}
              />
            </div>
            <hr />
            <div style={{ textAlign: "right" }}>
              <RegisterCountdown doCountdown={mode === "new"} />
              <button
                className="btn btn-secondary"
                disabled={isBusy || paymentProcessing}
                onClick={handleBack}
              >
                Back
              </button>
              <CancelButton mode={mode} onCanceled={handlePaymentCanceled} />
              <button
                disabled={!stripe || !elements || isBusy}
                className="btn btn-primary ms-2"
                ref={buttonRef}
                onClick={handleSubmitPayment}
              >
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
