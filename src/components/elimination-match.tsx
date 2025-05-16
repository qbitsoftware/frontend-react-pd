import { TableMatch } from "@/types/brackets"
import { TournamentTable } from "@/types/groups"
import { capitalizeWords, cn } from "@/lib/utils"
import { extractMatchSets } from "./utils/utils"
// import { }

interface EliminationMatchProps {
    match: TableMatch
    tournamentTable: TournamentTable
}

const EliminationMatch = ({
    match,
    tournamentTable
}: EliminationMatchProps) => {
    void tournamentTable

    const { p1_sets, p2_sets } = extractMatchSets(match)

    const isTournamentWinner = (match: TableMatch, participant_id: string): boolean => {
        const parts = match.match.bracket.split('-')
        if (parts.length == 2) {
            if (Math.abs(Number(parts[0]) - Number(parts[1])) == 1) {
                return match.match.winner_id == participant_id && match.match.winner_id != ""
            }
            return false
        }
        return false
    }

    return (
        <div className="relative w-[220px] h-[60px] bg-white flex flex-col">
            <div className="absolute"></div>
            <div className={cn("relative flex w-full h-1/2 items-center", isTournamentWinner(match, match.participant_1.id) && "bg-green-200/50")}>
                <div className="absolute text-[8px] left-1">
                    {match.match.previous_match_readable_id_1 >= 0 ? "" : match.match.previous_match_readable_id_1}
                </div>
                {match.participant_1.id === "empty" ? (
                    <>
                        <div className="text-center px-2">{""}</div>
                        <div className="w-full text-gray-500 ml-2 pdf-participant text-xs">(Bye)</div>
                        <div className="text-right pr-4">{""}</div>
                    </>
                ) : match.participant_1.id === "" ? (
                    <div className="w-full" />
                ) : (
                    <>
                        <span className="px-2 font-medium w-[30px]">
                            {`${(match.match.type == "winner" && match.match.round == 0) ? match.participant_1.order : ""}`}
                        </span>
                        <p className={cn("w-full text-xs", p1_sets > p2_sets && "font-semibold")}>{capitalizeWords(match.participant_1.name)}</p>
                        <p className={cn("px-3 h-full flex items-center", p1_sets > p2_sets && "bg-[#F3F9FC] font-semibold")}>{p1_sets}</p>
                    </>
                )}
            </div>
            <div className={cn("relative flex w-full h-1/2 items-center", isTournamentWinner(match, match.participant_2.id) && "bg-green-200/50")}>
                <div className="absolute text-[8px] left-1">
                    {match.match.previous_match_readable_id_2 >= 0 ? "" : match.match.previous_match_readable_id_2}
                </div>
                {match.participant_2.id === "empty" ? (
                    <>
                        <div className="text-center px-2">{""}</div>
                        <div className="w-full text-gray-500 ml-2 pdf-participant text-xs">(Bye)</div>
                        <div className="text-right pr-4">{""}</div>
                    </>
                ) : match.participant_2.id === "" ? (
                    <div className="w-full" />
                ) : (
                    <>
                        <span className="px-2 font-medium w-[30px]">
                            {`${(match.match.type == "winner" && match.match.round == 0) ? match.participant_2.order : ""}`}
                        </span>
                        <p className={cn("w-full text-xs", p2_sets > p1_sets && "font-semibold")}>{capitalizeWords(match.participant_2.name)}</p>
                        <p className={cn("px-3 h-full flex items-center", p2_sets > p1_sets && "bg-[#F3F9FC]")}>{p2_sets}</p>
                    </>
                )}
            </div>
        </div >
    )
}

export default EliminationMatch