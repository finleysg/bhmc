import { useEffect } from "react"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { DuplicateEmail } from "../components/feedback/duplicate-email"
import { ErrorDisplay } from "../components/feedback/error-display"
import { usePlayerCreate } from "../hooks/use-players"
import { RegisterAccountSchema } from "../models/auth"
import { GuestPlayerData, Player, PlayerApiSchema } from "../models/player"
import { getOne } from "../utils/api-client"
import { AddPlayerView } from "./add-player-view"

interface AddPlayerHandlerProps {
  onCancel: () => void
  onCreated: (player: Player) => void
}

export function AddPlayerHandler({ onCancel, onCreated }: AddPlayerHandlerProps) {
  const { mutate, isError, error, reset } = usePlayerCreate()
  const form = useForm<GuestPlayerData>({
    resolver: zodResolver(RegisterAccountSchema),
  })

  useEffect(() => {
    // clear any errors on unmount
    return () => reset()
  }, [reset])

  const isDuplicate = isError && (error?.message?.indexOf("user already exists") ?? -1) >= 0

  const handleSubmit = (args: GuestPlayerData) => {
    mutate(args, {
      onSuccess: (data) => {
        const playerData = PlayerApiSchema.parse(data)
        onCreated(new Player(playerData))
      },
      onError: (error) => {
        if (error.message.indexOf("player with this Email already exists.") >= 0) {
          getOne(`players/?email=${args.email}`, PlayerApiSchema).then((playerData) => {
            onCreated(new Player(playerData))
          })
        } else if (error.message.indexOf("player with this GHIN already exists.") >= 0) {
          getOne(`players/?ghin=${args.ghin}`, PlayerApiSchema).then((playerData) => {
            onCreated(new Player(playerData))
          })
        }
      },
    })
  }

  const handleCancel = () => {
    reset()
    onCancel()
  }

  return (
    <div>
      <AddPlayerView form={form} onSubmit={handleSubmit} onCancel={handleCancel} />
      {isDuplicate ? <DuplicateEmail /> : <ErrorDisplay error={error?.message ?? ""} />}
    </div>
  )
}
