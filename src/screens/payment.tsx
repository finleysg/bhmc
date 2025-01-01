import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react"

import { useNavigate } from "react-router-dom"

import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"

import { CancelButton } from "../components/event-registration/cancel-button"
import { RegisterCountdown } from "../components/event-registration/register-countdown"
import { ErrorDisplay } from "../components/feedback/error-display"
import { Checkbox } from "../components/forms/checkbox"
import { CreditCardList } from "../components/payment/credit-card-list"
import { StyledCardElement } from "../components/payment/styled-card-element"
import { OverlaySpinner } from "../components/spinners/overlay-spinner"
import {
  CompleteStep,
  ReviewStep,
} from "../context/registration-reducer"
import { useAuth } from "../hooks/use-auth"
import { useEventRegistration } from "../hooks/use-event-registration"
import { useEventRegistrationGuard } from "../hooks/use-event-registration-guard"
import { useMyCards } from "../hooks/use-my-cards"
import { NoAmount } from "../models/payment"
import { useCurrentEvent } from "./event-detail"

export function PaymentOldScreen() {
  const [cardUsed, setCardUsed] = useState<string | undefined>()
  const [isBusy, setIsBusy] = useState(false)
  const [saveCard, setSaveCard] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { user } = useAuth()
  const { clubEvent } = useCurrentEvent()
  const { data: myCards } = useMyCards()
  const { currentStep, error, mode, payment, registration, confirmPayment, setError, updateStep } =
    useEventRegistration()
  useEventRegistrationGuard(registration)

  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  useEffect(() => {
    if (myCards === undefined || myCards.length === 0) {
      setCardUsed("new")
    } else {
      setCardUsed(myCards[0].paymentMethod)
    }
  }, [myCards])

  const amountDue = payment?.getAmountDue(clubEvent.feeMap) ?? NoAmount

  const handleBack = () => {
    updateStep(ReviewStep)
    navigate("../review", { replace: true })
  }

  const handleSaveCard = (e: ChangeEvent<HTMLInputElement>) => {
    setSaveCard(e.target.checked)
  }

  const handlePaymentClick = async () => {
    if (!buttonRef.current) {
      throw new Error("Inconceivable! Button ref not found.")
    }

    // It's unlikely we need to do both of these, but we really,
    // really, really don't want to leave the "Pay" button enabled.
    buttonRef.current.disabled = true
    setIsBusy(true)

    // Without this the spinner doesn't show up.
    setTimeout(() => {
      console.log("Payment processing...")
    }, 10)

    try {
      const method = await getPaymentMethod()
      await confirmPayment(method, cardUsed === "new" && saveCard)
      updateStep(CompleteStep)
      navigate("../complete", { replace: true })
    } catch (err) {
      setError(err as Error)
    } finally {
      buttonRef.current.disabled = false
      setIsBusy(false)
    }
  }

  const getPaymentMethod = async () => {
    // Using a saved card
    if (cardUsed !== "new" && cardUsed) {
      return cardUsed
    }

    if (!stripe) {
      throw new Error("Stripe is not initialized")
    }

    const cardElement = elements?.getElement(CardElement)
    if (!cardElement) {
      throw new Error("Card element not found")
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        email: user.email,
        name: user.name,
      },
    })

    // Invalid card, expired card, etc.
    if (error) {
      throw new Error(error.message)
    }

    return paymentMethod.id
  }

  return (
    <div className="row">
      <div className="col-12 col-md-6">
        <div className="card mb-4">
          <div className="card-body">
            <OverlaySpinner loading={isBusy} />
            <h4 className="card-header mb-2">{currentStep.title}</h4>
            {error && (
              <ErrorDisplay error={error?.message} delay={5000} onClose={() => setError(null)} />
            )}
            <p className="text-info fst-italic mb-4">{registration?.selectedStart}</p>
            <h6 className="text-primary">Amount due: ${amountDue.total.toFixed(2)}</h6>
            <div className="mb-4">
              {myCards && myCards[0] && (
                <CreditCardList cards={myCards} onSelect={(pm: string) => setCardUsed(pm)} />
              )}
            </div>
            {cardUsed === "new" && (
              <>
                <div className="mb-4">
                  <StyledCardElement />
                </div>
                <div>
                  <Checkbox
                    label="Save this card for future payments"
                    checked={saveCard}
                    onChange={handleSaveCard}
                  />
                </div>
              </>
            )}
            <hr />
            <div style={{ textAlign: "right" }}>
              <RegisterCountdown doCountdown={mode === "new"} />
              <button className="btn btn-secondary" disabled={isBusy} onClick={handleBack}>
                Back
              </button>
              <CancelButton mode={mode} />
              <button className="btn btn-primary ms-2" ref={buttonRef} onClick={handlePaymentClick}>
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
