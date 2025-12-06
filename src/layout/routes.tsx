import { AboutUsScreen } from "../screens/about-us"
import { AccountScreen } from "../screens/account"
import { AccountSettingsScreen } from "../screens/account-settings"
import { CalendarScreen } from "../screens/calendar"
import { ChampionsScreen } from "../screens/champions"
import { ContactScreen } from "../screens/contact"
import { DamCupScreen } from "../screens/dam-cup"
import { DirectoryScreen } from "../screens/directory"
import { EditRegistrationScreen } from "../screens/edit-registration"
import { EventDetailScreen } from "../screens/event-detail"
import { EventViewScreen } from "../screens/event-view"
import { GalleryImageScreen } from "../screens/gallery-image"
import { HomeScreen } from "../screens/home"
import { MaintenanceScreen } from "../screens/maintenance"
import { MatchPlayScreen } from "../screens/match-play"
import { MembershipFull } from "../screens/membership-full"
import { NotFoundScreen } from "../screens/not-found"
import { PaymentScreen } from "../screens/payment"
import { PaymentFlow } from "../screens/payment-flow"
import { PhotoGalleryScreen } from "../screens/photo-gallery"
import { PlayerProfileScreen } from "../screens/player-profile"
import { PlayerScoresScreen } from "../screens/player-scores"
import { PolicyScreen } from "../screens/policies"
import { RegisterScreen } from "../screens/register"
import { RegisteredScreen } from "../screens/registered"
import { RegistrationCompleteScreen } from "../screens/registration-complete"
import { ReserveScreen } from "../screens/reserve"
import { ReviewRegistrationScreen } from "../screens/review-registration"
import { SeasonLongPointsScreen } from "../screens/season-long-points"
import { SendMessageScreen } from "../screens/send-message"
import * as config from "../utils/app-config"

export const mainRoutes = () =>
	config.maintenanceMode
		? [{ path: "*", element: <MaintenanceScreen /> }]
		: [
				{ path: "/", element: <HomeScreen /> },
				{ path: "/home", element: <HomeScreen /> },
				{ path: "/membership", element: <MembershipFull /> },
				{ path: "/calendar/:year/:monthName", element: <CalendarScreen /> },
				{
					path: "/event/:eventDate/:eventName",
					element: <EventDetailScreen />,
					children: [
						{ element: <EventViewScreen />, index: true },
						{ path: "reserve", element: <ReserveScreen /> },
						{ path: "register", element: <RegisterScreen /> },
						{ path: "edit", element: <EditRegistrationScreen /> },
						{ path: "review", element: <ReviewRegistrationScreen /> },
						{
							path: ":paymentId",
							element: <PaymentFlow />,
							children: [
								{ path: "payment", element: <PaymentScreen /> },
								{ path: "complete", element: <RegistrationCompleteScreen /> },
							],
						},
						{ path: "registrations", element: <RegisteredScreen /> },
					],
				},
				{ path: "/champions/:season", element: <ChampionsScreen /> },
				{ path: "/my-scores/:scoreType/:season", element: <PlayerScoresScreen /> },
				{ path: "/policies/:policyType", element: <PolicyScreen /> },
				{ path: "/match-play", element: <MatchPlayScreen /> },
				{ path: "/season-long-points", element: <SeasonLongPointsScreen /> },
				{ path: "/dam-cup", element: <DamCupScreen /> },
				{ path: "/directory", element: <DirectoryScreen /> },
				{ path: "/directory/:playerId", element: <PlayerProfileScreen /> },
				{ path: "/contact-us", element: <ContactScreen /> },
				{ path: "/contact-us/message", element: <SendMessageScreen /> },
				{ path: "/about-us", element: <AboutUsScreen /> },
				{ path: "/gallery", element: <PhotoGalleryScreen /> },
				{ path: "/gallery/:id", element: <GalleryImageScreen /> },
				{ path: "/my-account", element: <AccountScreen /> },
				{ path: "/my-activity", element: <AccountSettingsScreen /> },
				{ path: "*", element: <NotFoundScreen /> },
			]
