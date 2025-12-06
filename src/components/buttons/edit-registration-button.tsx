import { ComponentPropsWithoutRef } from "react"

import { ClubEventProps } from "../../models/common-props"

interface EditRegistrationButtonProps extends ComponentPropsWithoutRef<"button"> {
	hasSignedUp: boolean
}

export function EditRegistrationButton({
	clubEvent,
	hasSignedUp,
	onClick,
	...rest
}: EditRegistrationButtonProps & ClubEventProps) {
	if (hasSignedUp && clubEvent.canEditRegistration() && clubEvent.paymentsAreOpen()) {
		return (
			<button className="btn btn-warning btn-sm" onClick={onClick} {...rest}>
				Skins
			</button>
		)
	}
	return null
}
