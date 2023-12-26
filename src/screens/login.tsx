import { MdAccountCircle } from "react-icons/md"

import { LoginHandler } from "../forms/login-handler"
import { RoutingMenu } from "../layout/routing-menu"

export function LoginScreen() {
  return (
    <div className="login">
      <div className="login__block active">
        <div className="login__header bg-primary">
          <i>
            <MdAccountCircle />
          </i>
          Sign In to Your Account
          <RoutingMenu
            links={[
              { to: "/session/account", name: "Create an Account" },
              { to: "/session/reset-password", name: "Reset My Password" },
              { to: "/home", name: "Home" },
            ]}
          />
        </div>

        <div className="login__body">
          <LoginHandler />
        </div>
      </div>
    </div>
  )
}
