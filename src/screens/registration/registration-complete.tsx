import { useEffect, useState } from "react"

import { Link, useSearchParams } from "react-router-dom"

import { useStripe } from "@stripe/react-stripe-js"
import { PaymentIntent } from "@stripe/stripe-js"

import { ErrorDisplay } from "../../components/feedback/error-display"
import { RandomGif } from "../../components/giphy/random-gif"
import { useAuth } from "../../hooks/use-auth"
import { useEventRegistration } from "../../hooks/use-event-registration"
import * as config from "../../utils/app-config"
import { useCurrentPaymentAmount } from "./payment-flow"

export function RegistrationCompleteScreen() {
	const [params] = useSearchParams()
	const { user } = useAuth()
	const { clubEvent } = useEventRegistration()
	const { amount: stripeAmount } = useCurrentPaymentAmount()
	const [error, setError] = useState<Error | null>(null)
	const [intent, setIntent] = useState<PaymentIntent | null>(null)
	const stripe = useStripe()

	useEffect(() => {
		if (!stripe) return

		const clientSecret = params.get("payment_intent_client_secret")
		if (!clientSecret) {
			setError(new Error("Missing payment intent client secret"))
			return
		}

		stripe.retrievePaymentIntent(clientSecret).then(({ error, paymentIntent }) => {
			setIntent(paymentIntent ?? null)
			if (error) {
				setError(new Error(error.message))
				return
			}
		})
	}, [stripe, params])

	return (
		<div className="row">
			<div className="col-12 col-md-6">
				<div className="card border border-primary mb-4">
					<div className="card-body">
						<h4 className="card-header mb-2">Payment Complete</h4>
						<div className="row mb-4">
							<div className="col-12">
								{error && (
									<>
										<h5 className="text-danger">An error occurred processing your payment</h5>
										<ErrorDisplay error={error?.message} delay={10000} onClose={() => setError(null)} />
									</>
								)}
								{intent?.status === "succeeded" && (
									<>
										<h5 className="text-primary-emphasis">
											Your payment for {config.currencyFormatter.format(stripeAmount / 100)} has been processed.
										</h5>
										<p>
											A confirmation email will be sent to {user.email} and anyone you signed up unless this is just an
											update (skins, for example). A payment receipt will also be sent from Stripe, our payment
											provider.
										</p>
										<RandomGif enabled={true} />
									</>
								)}
								{intent?.status !== "succeeded" && !error && <p>Payment status is {intent?.status}.</p>}
							</div>
						</div>
						<hr />
						<div className="row">
							<div className="col-12" style={{ textAlign: "right" }}>
								{clubEvent && (
									<Link className="btn btn-info btn-sm" to={clubEvent.eventUrl + "/registrations"} replace={true}>
										See All Players
									</Link>
								)}
								<Link to="/home" className="btn btn-sm btn-primary ms-2">
									Home
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
