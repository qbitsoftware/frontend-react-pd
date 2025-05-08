import { TableMatch } from "@/types/brackets"
import { TournamentTable } from "@/types/groups"
import { cn } from "@/lib/utils"
import { extractMatchSets } from "./utils/utils"

interface EliminationMatchProps {
    match: TableMatch
    tournamentTable: TournamentTable
}

const EliminationMatch = ({
    match,
    tournamentTable
}: EliminationMatchProps) => {

    const { p1_sets, p2_sets } = extractMatchSets(match)

    return (
        <div className="w-[220px] h-[60px] bg-white flex flex-col">
            <div className="flex w-full h-1/2 items-center">
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
                        <span className="px-2 font-medium">{match.participant_1.order}</span>
                        <p className="w-full text-xs">{match.participant_1.name}</p>
                        <p className={cn("px-2 h-full flex items-center", p1_sets > p2_sets && "bg-[#F3F9FC]")}>{p1_sets}</p>
                    </>
                )}
            </div>
            <div className="flex w-full h-1/2 items-center">
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
                        <span className="px-2 font-medium">{match.participant_2.order}</span>
                        <p className="w-full text-xs">{match.participant_2.name}</p>
                        <p className={cn("px-2 h-full flex items-center", p2_sets > p1_sets && "bg-[#F3F9FC]")}>{p2_sets}</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default EliminationMatch