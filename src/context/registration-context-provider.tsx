import { PropsWithChildren, useCallback, useEffect, useReducer, useRef } from "react"

import { PaymentIntent } from "@stripe/stripe-js"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "../hooks/use-auth"
import { useMyPlayerRecord } from "../hooks/use-my-player-record"
import { EventType } from "../models/codes"
import { ClubEventProps } from "../models/common-props"
import { Course } from "../models/course"
import { EventFee } from "../models/event-fee"
import { Payment, PaymentApiSchema, PaymentDetail } from "../models/payment"
import { Player } from "../models/player"
import {
	Registration,
	RegistrationApiSchema,
	RegistrationFee,
	RegistrationFeeApiSchema,
	RegistrationSlot,
	ServerRegistrationApiSchema,
	ServerRegistrationData,
} from "../models/registration"
import { getMany, getOne, httpClient } from "../utils/api-client"
import { apiUrl, serverUrl } from "../utils/api-utils"
import { currentSeason } from "../utils/app-config"
import { getCorrelationId } from "../utils/correlation"
import {
	defaultRegistrationState,
	eventRegistrationReducer,
	IRegistrationStep,
	RegistrationMode,
} from "./registration-reducer"
import { EventRegistrationContext } from "./registration-context"

export function EventRegistrationProvider({ clubEvent, children }: PropsWithChildren<ClubEventProps>) {
	const queryClient = useQueryClient()
	const [state, dispatch] = useReducer(eventRegistrationReducer, defaultRegistrationState)

	const { user } = useAuth()
	const { data: player } = useMyPlayerRecord()

	useEffect(() => {
		const correlationId = getCorrelationId(clubEvent?.id)
		dispatch({
			type: "load-event",
			payload: { clubEvent: clubEvent, correlationId: correlationId },
		})
	}, [clubEvent])

	const { mutateAsync: _createPayment } = useMutation({
		mutationFn: (payment: Partial<Payment>) => {
			return httpClient(apiUrl("payments"), {
				body: JSON.stringify({
					event: state.clubEvent?.id,
					user: user.id,
					notification_type: payment.notificationType,
					payment_details: payment.details?.map((f) => {
						return {
							event_fee: f.eventFeeId,
							registration_slot: f.slotId,
							amount: f.amount,
						}
					}),
				}),
				headers: { "X-Correlation-ID": state.correlationId },
			})
		},
		onSuccess: (data) => {
			queryClient.setQueryData(["payment", state.clubEvent?.id], data)
			dispatch({ type: "update-payment", payload: { payment: new Payment(data) } })
		},
		onError: (error) => {
			dispatch({ type: "update-error", payload: { error } })
		},
	})

	const { mutateAsync: _updatePayment } = useMutation({
		mutationFn: (payment: Payment) => {
			return httpClient(apiUrl(`payments/${payment.id}`), {
				method: "PUT",
				body: JSON.stringify({
					event: state.clubEvent?.id,
					user: user.id,
					notification_type: payment.notificationType,
					payment_details: payment.details?.map((f) => {
						return {
							event_fee: f.eventFeeId,
							registration_slot: f.slotId,
							amount: f.amount,
						}
					}),
				}),
				headers: { "X-Correlation-ID": state.correlationId },
			})
		},
		onSuccess: (data) => {
			queryClient.setQueryData(["payment", state.clubEvent?.id], data)
			dispatch({ type: "update-payment", payload: { payment: new Payment(data) } })
		},
		onError: (error) => {
			dispatch({ type: "update-error", payload: { error } })
		},
	})

	const { mutateAsync: _createPaymentIntent } = useMutation({
		mutationFn: () => {
			return httpClient(apiUrl(`payments/${state.payment?.id}/payment_intent/`), {
				body: JSON.stringify({
					event_id: state.clubEvent?.id,
					registration_id: state.registration?.id,
				}),
				headers: { "X-Correlation-ID": state.correlationId },
			}) as Promise<PaymentIntent>
		},
	})

	const { mutate: _updateRegistrationSlotPlayer } = useMutation({
		mutationFn: ({ slotId, playerId }: { slotId: number; playerId: number | null }) => {
			return httpClient(apiUrl(`registration-slots/${slotId}`), {
				method: "PATCH",
				body: JSON.stringify({
					player: playerId,
				}),
				headers: { "X-Correlation-ID": state.correlationId },
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["event-registration-slots", state.clubEvent?.id] })
		},
		onError: (error) => {
			dispatch({ type: "update-error", payload: { error } })
		},
	})

	const { mutateAsync: _cancelRegistration } = useMutation({
		mutationFn: ({ reason }: { reason: "user" | "timeout" | "navigation" | "violation" }) => {
			const regId = state.registration?.id ?? 0
			const pmtId = state.payment?.id ?? 0
			const endpoint = `registration/${regId}/cancel/?reason=${reason}&payment_id=${pmtId}`
			return httpClient(apiUrl(endpoint), {
				method: "PUT",
				headers: { "X-Correlation-ID": state.correlationId },
			})
		},
		onSuccess: () => {
			dispatch({ type: "cancel-registration", payload: null })
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["registration"] })
			queryClient.invalidateQueries({ queryKey: ["event-registrations", state.clubEvent?.id] })
			queryClient.invalidateQueries({ queryKey: ["event-registration-slots", state.clubEvent?.id] })
		},
		onError: (error) => {
			dispatch({ type: "update-error", payload: { error } })
		},
	})

	const { mutate: _updateRegistrationNotes } = useMutation({
		mutationFn: (notes: string) => {
			return httpClient(apiUrl(`registration/${state.registration?.id}`), {
				method: "PATCH",
				body: JSON.stringify({
					notes: notes,
				}),
				headers: { "X-Correlation-ID": state.correlationId },
			})
		},
		onError: (error) => {
			dispatch({ type: "update-error", payload: { error } })
		},
	})

	const { mutateAsync: createRegistrationMutate } = useMutation({
		mutationFn: ({ course, slots }: { course?: Course; slots?: RegistrationSlot[]; selectedStart?: string }) => {
			return httpClient(serverUrl("registration"), {
				body: JSON.stringify({
					eventId: state.clubEvent?.id,
					courseId: course?.id,
					slotIds: slots?.map((s) => s.id),
				}),
				headers: { "X-Correlation-ID": state.correlationId },
			})
		},
		onSuccess: (data, args) => {
			const registrationData = ServerRegistrationApiSchema.parse(data)
			dispatch({
				type: "create-registration",
				payload: {
					registration: Registration.fromServerData(registrationData, args.selectedStart),
					payment: _createInitialPaymentRecord(registrationData),
				},
			})
			queryClient.setQueryData(["registration", state.clubEvent?.id], registrationData)
		},
		onError: (error) => {
			// conflict - the slots have been taken
			if (error.message.startsWith("One or more of the slots")) {
				queryClient.invalidateQueries({
					queryKey: ["event-registration-slots", state.clubEvent?.id],
				})
			}
			dispatch({ type: "update-error", payload: { error } })
		},
	})

	/**
	 * Creates a new registration record for the current user, attempting to
	 * reserve the specified slots.
	 */
	const createRegistrationRef = useRef(createRegistrationMutate)
	createRegistrationRef.current = createRegistrationMutate

	const createRegistration = useCallback((course?: Course, slots?: RegistrationSlot[], selectedStart?: string) => {
		return createRegistrationRef.current({ course, slots, selectedStart })
	}, [])

	const _createInitialPaymentRecord = (registration: ServerRegistrationData) => {
		if (!state.clubEvent || !user.id) {
			throw new Error("Cannot create an initial payment record without a club event or user.")
		}
		if (!registration.slots?.length) {
			throw new Error("Cannot create an initial payment record without registration slots.")
		}
		const payment = Payment.createPlaceholder(state.clubEvent.id, user.id)
		state.clubEvent.fees
			.filter((f) => f.isRequired)
			.forEach((fee) => {
				payment.details.push(
					new PaymentDetail({
						id: 0,
						payment: 0,
						event_fee: fee.id,
						registration_slot: registration.slots[0].id,
						amount: fee.amountDue(player),
					}),
				)
			})
		return payment
	}

	/**
	 * Updates query state so the UI reflects the completed registration.
	 */
	const _invalidateQueries = useCallback(() => {
		if (state.clubEvent?.eventType === EventType.Membership) {
			queryClient.setQueryData(["player", user.email], {
				...player?.data,
				is_member: true,
				last_season: currentSeason - 1,
			})
		} else {
			queryClient.invalidateQueries({ queryKey: ["player", user.email] })
		}
		queryClient.invalidateQueries({ queryKey: ["my-cards"] })
		queryClient.invalidateQueries({ queryKey: ["my-events"] })
		queryClient.invalidateQueries({ queryKey: ["event-registrations", state.clubEvent?.id] })
		queryClient.invalidateQueries({ queryKey: ["event-registration-slots", state.clubEvent?.id] })
	}, [player?.data, queryClient, state.clubEvent?.eventType, state.clubEvent?.id, user.email])

	/**
	 * Changes the current step in the registration process.
	 */
	const updateStep = useCallback((step: IRegistrationStep) => {
		dispatch({ type: "update-step", payload: { step } })
	}, [])

	/**
	 * Loads an existing registration for a given player, if it exists.
	 */
	const loadRegistration = useCallback(
		async (player: Player) => {
			try {
				const registrationData = await getOne(
					`registration/?event_id=${state.clubEvent?.id}&player_id=${player.id}`,
					RegistrationApiSchema,
				)
				if (registrationData) {
					const registration = new Registration(registrationData)
					const feeData = await getMany(
						`registration-fees/?registration_id=${registration.id}&confirmed=true`,
						RegistrationFeeApiSchema,
					)
					const fees = feeData?.map((f) => new RegistrationFee(f))
					dispatch({
						type: "load-registration",
						payload: {
							registration,
							payment: Payment.createPlaceholder(state.clubEvent?.id ?? 0, user.id ?? 0),
							existingFees: fees,
						},
					})
					queryClient.setQueryData(["registration", state.clubEvent?.id], registrationData)
				}
			} catch (error) {
				dispatch({ type: "update-error", payload: { error: error as Error } })
			}
		},
		[state.clubEvent?.id, queryClient, user.id],
	)

	/**
	 * Adds one or more players to an existing registration.
	 */
	const editRegistration = useCallback(
		async (registrationId: number, playerIds: number[]) => {
			try {
				const registrationData = await httpClient(apiUrl(`registration/${registrationId}/add_players`), {
					method: "PUT",
					body: JSON.stringify({
						players: playerIds.map((id) => ({ id })),
					}),
				})
				if (registrationData) {
					const registration = new Registration(registrationData.registration)
					const payment = await getOne(`payments/${registrationData.payment_id}/`, PaymentApiSchema)
					if (!payment) {
						throw new Error("Failed to load payment data after editing registration.")
					}
					const feeData = await getMany(
						`registration-fees/?registration_id=${registration.id}`,
						RegistrationFeeApiSchema,
					)
					if (!feeData) {
						throw new Error("Failed to load registration fee data after editing registration.")
					}
					const fees = feeData.map((f) => new RegistrationFee(f))
					dispatch({
						type: "load-registration",
						payload: {
							registration,
							payment: new Payment(payment),
							existingFees: fees,
						},
					})
					queryClient.setQueryData(["registration", state.clubEvent?.id], registrationData)
					queryClient.invalidateQueries({ queryKey: ["event-registrations", state.clubEvent?.id] })
					queryClient.invalidateQueries({ queryKey: ["event-registration-slots", state.clubEvent?.id] })
				}
			} catch (error) {
				dispatch({ type: "update-error", payload: { error: error as Error } })
			}
		},
		[queryClient, state.clubEvent?.id],
	)

	/**
	 * Updates the current registration record with notes.
	 */
	const updateRegistrationNotes = useCallback(
		(notes: string) => {
			dispatch({ type: "update-registration-notes", payload: { notes } })
			_updateRegistrationNotes(notes)
		},
		[_updateRegistrationNotes],
	)

	/**
	 * Cancels the current registration and resets the registration process flow.
	 */
	const cancelRegistration = useCallback(
		(reason: "user" | "timeout" | "navigation" | "violation", mode: RegistrationMode) => {
			if (mode === "new") {
				return _cancelRegistration({ reason })
			} else {
				queryClient.invalidateQueries({ queryKey: ["registration"] })
				return Promise.resolve()
			}
		},
		[_cancelRegistration, queryClient],
	)

	/**
	 * Completes the registration process, clearing registration state and
	 * setting the mode to "idle", which enables the guard on the register routes.
	 */
	const completeRegistration = useCallback(() => {
		_invalidateQueries()
		dispatch({ type: "complete-registration", payload: null })
	}, [_invalidateQueries])

	/**
	 * Create and return a stripe customer session, which allows the user to
	 * save their payment information for future use.
	 */
	const initiateStripeSession = useCallback(() => {
		httpClient(apiUrl("payments/customer_session/"), {
			method: "POST",
			body: JSON.stringify({}),
			headers: { "X-Correlation-ID": state.correlationId },
		})
			.then((data) => {
				dispatch({
					type: "initiate-stripe-session",
					payload: { clientSessionKey: data.client_secret },
				})
			})
			.catch((error) => {
				dispatch({ type: "update-error", payload: { error } })
			})
	}, [state.correlationId])

	/**
	 * Create a payment intent for client-side processing.
	 */
	const createPaymentIntent = useCallback(() => {
		return _createPaymentIntent()
	}, [_createPaymentIntent])

	/**
	 * Saves the current payment record.
	 */
	const savePayment = useCallback(() => {
		if (state.payment?.id) {
			return _updatePayment(state.payment)
		} else {
			const payment = { ...state.payment }
			return _createPayment(payment)
		}
	}, [_createPayment, _updatePayment, state.payment])

	/**
	 * Add a player to a given registration slot.
	 */
	const addPlayer = useCallback(
		(slot: RegistrationSlot, player: Player) => {
			_updateRegistrationSlotPlayer(
				{ slotId: slot.id, playerId: player.id },
				{
					onSuccess: () => dispatch({ type: "add-player", payload: { slot, player } }),
				},
			)
		},
		[_updateRegistrationSlotPlayer],
	)

	/**
	 * Removes the player on a given registration slot.
	 */
	const removePlayer = useCallback(
		(slot: RegistrationSlot) => {
			_updateRegistrationSlotPlayer(
				{ slotId: slot.id, playerId: null },
				{
					onSuccess: () => dispatch({ type: "remove-player", payload: { slotId: slot.id } }),
				},
			)
		},
		[_updateRegistrationSlotPlayer],
	)

	/**
	 * Adds an event fee to a given registration slot.
	 */
	const addFee = useCallback((slot: RegistrationSlot, eventFee: EventFee, player: Player) => {
		dispatch({ type: "add-fee", payload: { slotId: slot.id, eventFee, player } })
	}, [])

	/**
	 * Removes an event fee from a given registration slot.
	 */
	const removeFee = useCallback((slot: RegistrationSlot, eventFee: EventFee) => {
		dispatch({ type: "remove-fee", payload: { eventFeeId: eventFee.id, slotId: slot.id } })
	}, [])

	const canRegister = useCallback(() => {
		const slots = state.registration?.slots ?? []
		if (state.clubEvent?.priorityRegistrationIsOpen()) {
			// During priority registration, the minimum signup group size is enforced.
			return slots.filter((s) => s.playerId).length >= (state.clubEvent?.minimumSignupGroupSize ?? 1)
		} else if (state.clubEvent?.registrationIsOpen()) {
			return slots.filter((s) => s.playerId).length >= 1
		}
		return false
	}, [state.clubEvent, state.registration])

	const setError = useCallback((error: Error | null) => {
		dispatch({ type: "update-error", payload: { error } })
	}, [])

	const value = {
		...state,
		addFee,
		addPlayer,
		cancelRegistration,
		canRegister,
		completeRegistration,
		createPaymentIntent,
		createRegistration,
		editRegistration,
		initiateStripeSession,
		loadRegistration,
		removeFee,
		removePlayer,
		savePayment,
		setError,
		updateRegistrationNotes,
		updateStep,
	}

	return <EventRegistrationContext.Provider value={value}>{children}</EventRegistrationContext.Provider>
}
