import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProtocolModal } from "@/providers/protocolProvider"
import { Player } from "@/types/players"
import { TableTennisExtraData } from "@/types/matches"
import { getCaptainKey, getPairKeys, getPairLabel, getPlayerKeys, getPlayerLabel } from "./utils"

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
    } = useProtocolModal()

    const playerKeys = getPlayerKeys(team, playerCount);
    const captainKey = getCaptainKey(team);
    const pairKeys = getPairKeys(team, playerCount)

    const extraData = match.match.extra_data || {} as TableTennisExtraData;

    return (
        <div>
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                    <h5 className="font-bold text-sm">
                        {team === 1 ? match.p1?.name : match.p2?.name}
                    </h5>
                    <div className="flex items-center gap-1">
                        <span className="text-xs">Kapten:</span>
                        <Input
                            type="text"
                            value={extraData[captainKey] || ''}
                            onChange={(e) => handleCaptainChange(e.target.value, captainKey)}
                            placeholder={team === 1 ? "Kapten ABC" : "Kapten XYZ"}
                            className="h-7 text-xs w-28"
                        />
                    </div>
                </div>
                <div className="space-y-2 mt-2">
                    <div className="text-xs font-semibold text-gray-500 pl-1">
                        Üksikmäng
                    </div>
                    {playerKeys.map((playerKey, index) => (
                        <div key={playerKey} className="flex items-center space-x-2">
                            <span className="text-sm font-medium w-8">{getPlayerLabel(index, team)}</span>
                            <Select
                                value={extraData[playerKey] || ''}
                                onValueChange={(value) => handlePlayerChange(playerKey, value, playerKeys, pairKeys)}
                            >
                                <SelectTrigger className="flex-1 h-8 text-sm">
                                    <SelectValue placeholder={`Vali mängija`} />
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
                                            No players available
                                        </SelectItem>
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-500 pl-1">
                        Paarismäng
                    </div>
                    {pairKeys.map((pairKey, index) => (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium w-8">{getPairLabel(index, team)}</span>
                            <Select
                                value={extraData[pairKey] || ''}
                                onValueChange={(value) => handlePlayerChange(pairKey, value, playerKeys, pairKeys)}
                            >
                                <SelectTrigger className="flex-1 h-8 text-sm">
                                    <SelectValue placeholder={`Vali mängija`} />
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
                                            No players available
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