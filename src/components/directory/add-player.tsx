import React, { ComponentPropsWithoutRef } from "react"

import { AddPlayerHandler } from "../../forms/add-player-handler"
import { Player } from "../../models/player"
import { Modal } from "../dialog/modal"

interface AddPlayerProps extends ComponentPropsWithoutRef<"div"> {
  onAdd: (player: Player) => void
}

export function AddPlayer({ onAdd, ...rest }: AddPlayerProps) {
  const [showAdd, setShowAdd] = React.useState(false)

  return (
    <div {...rest}>
      <button className="btn btn-primary" onClick={() => setShowAdd(true)} title="Add a new player">
        Add New Player
      </button>
      <Modal show={showAdd} title="Add a New Player">
        <AddPlayerHandler onCancel={() => setShowAdd(false)} onCreated={onAdd} />
      </Modal>
    </div>
  )
}
