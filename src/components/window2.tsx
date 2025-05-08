import { Bracket, BracketType } from "@/types/brackets";
import { TournamentTable } from "@/types/groups";
import { MatchWrapper } from "@/types/matches";
import { SingleElimination } from "./single-elimination";
import { DoubleElimination } from "./double-elimination";

interface TournamentTableProps {
    data: Bracket;
    tournament_table: TournamentTable
    handleSelectMatch?: (match: MatchWrapper) => void
}

export const EliminationBrackets = ({
    data,
    tournament_table,
    handleSelectMatch
}: TournamentTableProps) => {



    return (
        <div className="bg-[#F8F9FA] flex flex-col gap-20 p-10 overflow-auto">
            {data.eliminations.map((eliminations, index) => {
                return (
                    eliminations.elimination.map((table, index) => (
                        <div>
                            <div className="font-bold text-xl py-4">{table.name}</div>
                            {table.name !== BracketType.MIINUSRING ? (
                                <div className="" key={index}>
                                    <SingleElimination
                                        tournament_table={tournament_table}
                                        key={index}
                                        data={table}
                                        handleSelectMatch={handleSelectMatch}
                                    />
                                </div>
                            ) : (
                                <div className="" key={index}>
                                    <DoubleElimination
                                        tournament_table={tournament_table}
                                        key={index}
                                        data={table}
                                        handleSelectMatch={handleSelectMatch}
                                    />
                                </div>

                            )
                            }
                        </div>
                    ))
                )
            })}
        </div>
    )
}