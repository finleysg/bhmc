import React from "react"

import {
  FaCcAmex,
  FaCcDinersClub,
  FaCcDiscover,
  FaCcJcb,
  FaCcMastercard,
  FaCcVisa,
} from "react-icons/fa"
import { GiCheckMark } from "react-icons/gi"
import { GoPlus } from "react-icons/go"
import { MdRemoveCircle } from "react-icons/md"

import { CardElement } from "@stripe/react-stripe-js"

import { SavedCard } from "../../models/saved-card"
import * as colors from "../../styles/colors"

// type Brands = "visa" | "mastercard" | "discover" | "amex" | "jcb" | "diners"

const cardImage = (brand: string) => {
  switch (brand) {
    case "visa":
      return <FaCcVisa />
    case "mastercard":
      return <FaCcMastercard />
    case "discover":
      return <FaCcDiscover />
    case "amex":
      return <FaCcAmex />
    case "jcb":
      return <FaCcJcb />
    case "diners":
      return <FaCcDinersClub />
    default:
      return <GoPlus />
  }
}

const cardName = (brand: string) => {
  switch (brand) {
    case "visa":
      return "Visa"
    case "mastercard":
      return "Mastercard"
    case "discover":
      return "Discover"
    case "jcb":
      return "JCB"
    case "diners":
      return "Diners Club"
    case "amex":
      return "American Express"
    default:
      throw new Error("Unsupported card brand.")
  }
}

interface SavedCardProps {
  card: SavedCard
}

interface SavedCardsProps {
  cards: SavedCard[]
}

interface CreditCardListProps extends SavedCardsProps {
  onSelect: (paymentMethod: string) => void
}

interface CreditCardProps {
  card: SavedCard
  selected: boolean
  onSelect: (paymentMethod: string) => void
}

interface ManageCreditCardsProps extends SavedCardsProps {
  onAdd: () => void
  onRemove: (card: SavedCard) => void
}

interface ManageCreditCardProps extends SavedCardProps {
  onRemove: (card: SavedCard) => void
}

interface CardImageProps {
  brand: string
}

function CardImage({ brand }: CardImageProps) {
  return <div style={{ fontSize: "2rem", height: "24px" }}>{cardImage(brand)}</div>
}

export function CreditCard({ card, selected, onSelect }: CreditCardProps) {
  return (
    <div
      className={selected ? "text-primary" : "text-muted"}
      style={{ display: "flex", alignItems: "center", marginBottom: "10px", cursor: "pointer" }}
      role="button"
      onClick={() => onSelect(card.paymentMethod)}
      onKeyDown={() => onSelect(card.paymentMethod)}
      tabIndex={0}
    >
      <div style={{ flex: "1" }}>
        <CardImage brand={card.brand} />
      </div>
      <div style={{ flex: "4" }}>
        <span style={{ marginLeft: "8px" }}>
          {card.paymentMethod === "new" ? (
            <strong>Use a new card</strong>
          ) : (
            <React.Fragment>
              <strong>{cardName(card.brand)}</strong> ending in <strong>{card.last4}</strong>
            </React.Fragment>
          )}
        </span>
      </div>
      <div style={{ flex: "1", textAlign: "right" }}>{selected && <GiCheckMark />}</div>
    </div>
  )
}

export function CreditCardList({ cards, onSelect }: CreditCardListProps) {
  const [selectedCard, setSelectedCard] = React.useState<string>()

  React.useEffect(() => {
    if (cards.length > 0) {
      setSelectedCard(cards[0].paymentMethod)
    }
  }, [cards])

  const handleSelection = (paymentMethod: string) => {
    setSelectedCard(paymentMethod)
    onSelect(paymentMethod)
  }

  return (
    <div>
      {cards.map((card) => {
        return (
          <CreditCard
            key={card.paymentMethod}
            card={card}
            selected={selectedCard === card.paymentMethod}
            onSelect={handleSelection}
          />
        )
      })}
      <CreditCard
        card={new SavedCard()}
        onSelect={handleSelection}
        selected={selectedCard === "new"}
      />
    </div>
  )
}

export function ManageCreditCards({ cards, onAdd, onRemove }: ManageCreditCardsProps) {
  return (
    <div>
      {cards.map((card) => {
        return <ManagedCreditCard key={card.paymentMethod} card={card} onRemove={onRemove} />
      })}
      <div
        style={{ display: "flex", cursor: "pointer" }}
        role="button"
        onClick={() => onAdd()}
        onKeyDown={() => onAdd()}
        tabIndex={0}
      >
        <div style={{ flex: "1" }}>
          <CardImage brand="add" />
        </div>
        <div style={{ flex: "7" }}>
          <span style={{ marginLeft: "8px" }}>
            <strong>Add a payment method</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

export function ManagedCreditCard({ card, onRemove }: ManageCreditCardProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
      <div style={{ flex: "1" }}>
        <CardImage brand={card.brand} />
      </div>
      <div style={{ flex: "4" }}>
        <span style={{ marginLeft: "8px" }}>
          <strong>{cardName(card.brand)}</strong> ending in <strong>{card.last4}</strong>
        </span>
      </div>
      <div style={{ flex: "2" }}>
        {card.isExpired ? (
          <span className="text-warning">expired</span>
        ) : (
          <span>exp {card.expires}</span>
        )}
      </div>
      <div style={{ flex: "1", height: "1.5rem", textAlign: "right" }}>
        <span
          className="text-danger"
          style={{ fontSize: "1.5rem", cursor: "pointer" }}
          role="button"
          onClick={() => onRemove(card)}
          onKeyDown={() => onRemove(card)}
          tabIndex={0}
        >
          <MdRemoveCircle />
        </span>
      </div>
    </div>
  )
}

export function StyledCardElement() {
  return (
    <CardElement
      className="form-control"
      options={{
        style: {
          base: {
            color: colors.dark,
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: colors.gray200,
            },
          },
          invalid: {
            color: colors.danger,
            iconColor: colors.danger,
          },
        },
      }}
    />
  )
}
