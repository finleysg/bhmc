import { MdAccountCircle } from "react-icons/md"

import { RegisterAccountHandler } from "../forms/register-account-handler"
import { RoutingMenu } from "../layout/routing-menu"

export function RegisterAccountScreen() {
	return (
		<div className="login">
			<div className="login__block active">
				<div className="login__header bg-primary">
					<i>
						<MdAccountCircle />
					</i>
					Create an Account
					<RoutingMenu
						links={[
							{ to: "/session/login", name: "Login" },
							{ to: "/session/reset-password", name: "Reset My Password" },
							{ to: "/home", name: "Home" },
						]}
					/>
				</div>
				<div className="login__body">
					<RegisterAccountHandler />
				</div>
			</div>
		</div>
	)
}
