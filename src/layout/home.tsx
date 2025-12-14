import { GoHome } from "react-icons/go"
import { useNavigate } from "react-router-dom"

export function Home() {
	const navigate = useNavigate()

	return (
		<div
			className="actions actions--inverse login__actions"
			role="button"
			tabIndex={0}
			onClick={() => navigate("/")}
			onKeyDown={() => navigate("/")}
		>
			<i className="actions__item">
				<GoHome />
			</i>
		</div>
	)
}
