import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProtocolModal } from "@/providers/protocolProvider"
import { Player } from "@/types/players"
import { TableTennisExtraData } from "@/types/matches"
import { getCaptainKey, getPairKeys, getPairLabel, getPlayerKeys, getPlayerLabel } from "./utils"
import { useTranslation } from "react-i18next"

interface TeamPlayersProps {
    playerCount: number,
    players: Player[]
    team: number
}

const TeamPlayers: React.FC<TeamPlayersProps> = ({
    playerCount,
    players,
    team
}) => {
    const {
        match,
        handleCaptainChange,
        handlePlayerChange,
        teamACaptain,
        teamBCaptain,
    } = useProtocolModal()

    const playerKeys = getPlayerKeys(team, playerCount);
    const captainKey = getCaptainKey(team);
    const pairKeys = getPairKeys(team, playerCount)
    const { t } = useTranslation()

    const extraData = match.match.extra_data || {} as TableTennisExtraData;

    return (
        <div>
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                    <h5 className="font-bold text-sm">
                        {team === 1 ? match.p1?.name : match.p2?.name}
                    </h5>
                    <div className="flex items-center gap-1">
                        <span className="text-xs">{t('protocol.captain')}:</span>
                        <Input
                            type="text"
                            value={team === 1 ? teamACaptain : teamBCaptain}
                            onChange={(e) => handleCaptainChange(e.target.value, captainKey)}
                            placeholder={team === 1 ? t('protocol.captain') + " ABC" : t('protocol.captain') + " XYZ"}
                            className="h-7 text-xs w-28"
                        />
                    </div>
                </div>
                <div className="space-y-2 mt-2">
                    <div className="text-xs font-semibold text-gray-500 pl-1">
                        {t('protocol.table.solo_game')}
                    </div>
                    {playerKeys.map((playerKey, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <span className="text-sm font-medium w-8">{getPlayerLabel(index, team)}</span>
                            <Select
                                value={extraData[playerKey] || ''}
                                onValueChange={(value) => handlePlayerChange(playerKey, value, playerKeys, pairKeys)}
                            >
                                <SelectTrigger className="flex-1 h-8 text-sm">
                                    <SelectValue placeholder={t('protocol.choose_player')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {players.length > 0 ?
                                        players.map((p: Player) => (
                                            <SelectItem
                                                key={p.id}
                                                value={p.id.toString()}
                                                className="text-sm"
                                            >
                                                {p.first_name + " " + p.last_name || ""}
                                            </SelectItem>
                                        ))
                                        : <SelectItem disabled value="no-players" className="text-sm">
                                            {t('protocol.no_players')}
                                        </SelectItem>
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-500 pl-1">
                        {t('protocol.table.double_game')}
                    </div>
                    {pairKeys.map((pairKey, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <span className="text-sm font-medium w-8">{getPairLabel(index, team)}</span>
                            <Select
                                value={extraData[pairKey] || ''}
                                onValueChange={(value) => handlePlayerChange(pairKey, value, playerKeys, pairKeys)}
                            >
                                <SelectTrigger className="flex-1 h-8 text-sm">
                                    <SelectValue placeholder={t('protocol.choose_player')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {players.length > 0 ?
                                        players.map((p: Player) => (
                                            <SelectItem
                                                key={p.id}
                                                value={p.id.toString()}
                                                className="text-sm"
                                            >
                                                {p.first_name + " " + p.last_name || ""}
                                            </SelectItem>
                                        ))
                                        : <SelectItem disabled value="no-players" className="text-sm">
                                            {t('protocol.no_players')}
                                        </SelectItem>
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TeamPlayers