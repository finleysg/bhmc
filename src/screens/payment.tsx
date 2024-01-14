import { ChangeEvent, useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"

import { ConfirmDialog } from "../components/dialog/confirm"
import { ErrorDisplay } from "../components/feedback/error-display"
import { Checkbox } from "../components/forms/checkbox"
import { CreditCardList } from "../components/payment/credit-card-list"
import { StyledCardElement } from "../components/payment/styled-card-element"
import { OverlaySpinner } from "../components/spinners/overlay-spinner"
import { CompleteStep, ReviewStep } from "../context/registration-reducer"
import { useAuth } from "../hooks/use-auth"
import { useEventRegistration } from "../hooks/use-event-registration"
import { useEventRegistrationGuard } from "../hooks/use-event-registration-guard"
import { useMyCards } from "../hooks/use-my-cards"
import { NoAmount } from "../models/payment"
import { useCurrentEvent } from "./event-detail"

export function PaymentScreen() {
  const [cardUsed, setCardUsed] = useState<string | undefined>()
  const [isBusy, setIsBusy] = useState(false)
  const [saveCard, setSaveCard] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const { user } = useAuth()
  const { clubEvent } = useCurrentEvent()
  const {
    currentStep,
    error,
    payment,
    registration,
    cancelRegistration,
    confirmPayment,
    setError,
    updateStep,
  } = useEventRegistration()
  const { data: myCards } = useMyCards()
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  useEventRegistrationGuard(clubEvent, registration)

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
    navigate(-1)
  }

  const handleCancel = () => {
    setShowCancelDialog(false)
    cancelRegistration()
    navigate("../")
  }

  const handleSaveCard = (e: ChangeEvent<HTMLInputElement>) => {
    setSaveCard(e.target.checked)
  }

  const handlePaymentClick = async () => {
    setIsBusy(true)
    if (cardUsed === "new" || !cardUsed) {
      const cardElement = elements?.getElement(CardElement)
      if (stripe && cardElement) {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            email: user.email,
            name: user.name,
          },
        })
        if (error) {
          console.error(error)
          setError(new Error(error.message))
          setIsBusy(false)
        } else {
          finishPayment(paymentMethod.id)
        }
      }
    } else {
      finishPayment(cardUsed)
    }
  }

  const finishPayment = (method: string) => {
    try {
      confirmPayment(method, cardUsed === "new" && saveCard, () => {
        updateStep(CompleteStep)
        navigate("../complete")
      })
    } finally {
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
              <button className="btn btn-secondary" disabled={isBusy} onClick={handleBack}>
                Back
              </button>
              <button className="btn btn-secondary ms-2" onClick={() => setShowCancelDialog(true)}>
                Cancel
              </button>
              <button
                className="btn btn-primary ms-2"
                disabled={isBusy}
                onClick={handlePaymentClick}
              >
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-3">
        <ConfirmDialog
          show={showCancelDialog}
          title="Cancel Registration?"
          message="Cancel this registration and return to the event detail page."
          onClose={(result) => (result ? handleCancel() : setShowCancelDialog(false))}
        />
      </div>
    </div>
  )
}
