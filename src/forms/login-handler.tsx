import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { zodResolver } from "@hookform/resolvers/zod"

import { ErrorDisplay } from "../components/feedback/error-display"
import { useAuth } from "../hooks/use-auth"
import { LoginData, LoginSchema } from "../models/auth"
import { LoginView } from "./login-view"

export function LoginHandler() {
  const {
    login: { mutate, error },
  } = useAuth()
  const navigate = useNavigate()
  const form = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
  })

  const submitHandler = (args: LoginData) => {
    mutate(args, {
      onSuccess: () => {
        navigate("/home")
      },
    })
  }

  return (
    <div>
      <LoginView form={form} onSubmit={submitHandler} />
      {error && <ErrorDisplay error={error.message} delay={3000} />}
    </div>
  )
}
