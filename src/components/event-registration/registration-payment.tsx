import { ChangeEvent, useEffect, useState } from "react"

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"

import { useAuth } from "../../hooks/use-auth"
import { useEventRegistration } from "../../hooks/use-event-registration"
import { useMyCards } from "../../hooks/use-my-cards"
import { NoAmount } from "../../models/payment"
import { ErrorDisplay } from "../feedback/error-display"
import { Checkbox } from "../forms/checkbox"
import { CreditCardList } from "../payment/credit-card-list"
import { StyledCardElement } from "../payment/styled-card-element"
import { OverlaySpinner } from "../spinners/overlay-spinner"

interface RegistrationPaymentProps {
  selectedStart: string
  title: string
  onBack: () => void
  onCancel: () => void
  onComplete: () => void
}

export function RegistrationPayment({
  onBack,
  onComplete,
  onCancel,
  selectedStart,
  title,
}: RegistrationPaymentProps) {
  const [cardUsed, setCardUsed] = useState<string | undefined>()
  const [isBusy, setIsBusy] = useState(false)
  const [saveCard, setSaveCard] = useState(false)
  const { user } = useAuth()
  const { clubEvent, confirmPayment, error, payment, setError } = useEventRegistration()
  const { data: myCards } = useMyCards()
  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    if (myCards === undefined || myCards.length === 0) {
      setCardUsed("new")
    } else {
      setCardUsed(myCards[0].paymentMethod)
    }
  }, [myCards])

  const amountDue = payment?.getAmountDue(clubEvent?.feeMap) ?? NoAmount

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
        onComplete()
      })
    } catch (err) {
      setIsBusy(false)
    }
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <OverlaySpinner loading={isBusy} />
        <h4 className="card-header mb-2">{title}</h4>
        {error && (
          <ErrorDisplay error={error?.message} delay={5000} onClose={() => setError(null)} />
        )}
        <p className="text-info fst-italic mb-4">{selectedStart}</p>
        <h6 className="text-primary">Amount due: ${amountDue.total.toFixed(2)}</h6>
        <div className="mb-4">
          {myCards && myCards[0] && (
            <CreditCardList cards={myCards} onSelect={(pm) => setCardUsed(pm)} />
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
          <button className="btn btn-secondary" disabled={isBusy} onClick={onBack}>
            Back
          </button>
          <button className="btn btn-secondary ms-2" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary ms-2" disabled={isBusy} onClick={handlePaymentClick}>
            Submit Payment
          </button>
        </div>
      </div>
    </div>
  )
}
