import { MdAccountCircle } from "react-icons/md"

import { RequestPasswordResetHandler } from "../forms/request-password-reset-handler"
import { RoutingMenu } from "../layout/routing-menu"

export function ResetPasswordRequestScreen() {
  return (
    <div className="login">
      <div className="login__block active">
        <div className="login__header bg-primary">
          <i>
            <MdAccountCircle />
          </i>
          Reset My Password
          <RoutingMenu
            links={[
              { to: "/session/login", name: "Login" },
              { to: "/session/account", name: "Create an Account" },
              { to: "/home", name: "Home" },
            ]}
          />
        </div>

        <div className="login__body">
          <p>
            Enter your email below. If you have an account with us with that email address, we will
            email you a link you can use to create a new password.
          </p>
          <RequestPasswordResetHandler />
        </div>
      </div>
    </div>
  )
}
