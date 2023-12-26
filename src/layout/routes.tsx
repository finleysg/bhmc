import { AboutUsScreen } from "../screens/about-us"
import { AccountScreen } from "../screens/account"
import { AccountSettingsScreen } from "../screens/account-settings"
import { CalendarScreen } from "../screens/calendar"
import { ContactScreen } from "../screens/contact"
import { DamCupScreen } from "../screens/dam-cup"
import { DirectoryScreen } from "../screens/directory"
import { EventDetailScreen } from "../screens/event-detail"
import { GalleryImageScreen } from "../screens/gallery-image"
import { HomeScreen } from "../screens/home"
import { MaintenanceScreen } from "../screens/maintenance"
import { MatchPlayScreen } from "../screens/match-play"
import { MembershipScreen } from "../screens/membership"
import { NotFoundScreen } from "../screens/not-found"
import { PhotoGalleryScreen } from "../screens/photo-gallery"
import { PlayerProfileScreen } from "../screens/player-profile"
import { PlayerScoresScreen } from "../screens/player-scores"
import { PolicyScreen } from "../screens/policies"
import { RegisteredScreen } from "../screens/registered"
import { ResultsScreen } from "../screens/results"
import { SeasonLongPointsScreen } from "../screens/season-long-points"
import { SendMessageScreen } from "../screens/send-message"
import * as config from "../utils/app-config"

export const mainRoutes = () =>
  config.maintenanceMode
    ? [{ path: "*", element: <MaintenanceScreen /> }]
    : [
        { path: "/", element: <HomeScreen /> },
        { path: "/home", element: <HomeScreen /> },
        { path: "/membership", element: <MembershipScreen /> },
        { path: "/calendar/:year/:monthName", element: <CalendarScreen /> },
        { path: "/event/:eventDate/:eventName", element: <EventDetailScreen /> },
        { path: "/event/:eventDate/:eventName/registrations", element: <RegisteredScreen /> },
        { path: "/results/:eventType/:season", element: <ResultsScreen /> },
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
