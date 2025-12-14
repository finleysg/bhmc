import { useParams } from "react-router-dom"

import { PlayerScores } from "../../components/scores/player-scores"
import { Tab } from "../../components/tab/tab"
import { Tabs } from "../../components/tab/tabs"
import { SeasonMenu } from "../../layout/season-menu"
import { currentSeason } from "../../utils/app-config"

export function PlayerScoresScreen() {
	const { scoreType, season } = useParams()
	const year = season === "all" ? 0 : season ? +season : currentSeason

	return (
		<div className="content__inner">
			<SeasonMenu baseUrl={`/my-scores/${scoreType}`} includeAll={true} season={year} startAt={2021} />
			<div>
				<Tabs>
					<Tab to={`/my-scores/gross/${season}`}>Gross Scores</Tab>
					<Tab to={`/my-scores/net/${season}`}>Net Scores</Tab>
				</Tabs>
				<PlayerScores isNet={scoreType === "net"} season={year} />
			</div>
		</div>
	)
}
