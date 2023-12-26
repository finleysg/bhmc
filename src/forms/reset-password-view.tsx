import { UseFormReturn } from "react-hook-form"

import { InputControl } from "../components/forms/input-control"
import { ResetPasswordData } from "../models/auth"

interface IResetPasswordView {
  form: UseFormReturn<ResetPasswordData>
  onSubmit: (args: ResetPasswordData) => void
}

export function ResetPasswordView({ form, onSubmit }: IResetPasswordView) {
  const { register, handleSubmit, formState } = form
  const { errors: formErrors, isSubmitting } = formState

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputControl
        name="password"
        label="Password"
        register={register("password")}
        error={formErrors.password}
        type="password"
      />
      <InputControl
        name="re_password"
        label="Confirm Password"
        register={register("re_password")}
        error={formErrors.re_password}
        type="password"
      />
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        Reset Password
      </button>
    </form>
  )
}
