import React, { useEffect, useState } from 'react'
import { TableMatch } from '@/types/brackets'
import { getRandomFlag } from '@/lib/utils'
import { useLocation, useParams } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface MatchComponentProps {
    match: TableMatch
    index: number
    HEIGHT: number
    WIDTH: number
    HORIZONTAL_GAP: number
    topCoord: number
    starting_y: number
    starting_x: number
}

const setScore = (match: TableMatch | undefined) => {
    let p1_sets = 0
    let p2_sets = 0

    if (match && match.match.extra_data.score) {
        match.match.extra_data.score.forEach((set) => {
            const player1Points = set.p1_score
            const player2Points = set.p2_score

            if (player1Points >= 11 && (player1Points - player2Points) >= 2) {
                p1_sets++
            } else if (player2Points >= 11 && (player2Points - player1Points) >= 2) {
                p2_sets++
            }
        })
    } else if (match && (match.match.extra_data.team_1_total || match.match.extra_data.team_2_total)) {
        p1_sets = match.match.extra_data.team_1_total || 0
        p2_sets = match.match.extra_data.team_2_total || 0
    }

    return { p1_sets, p2_sets }
}


const MatchComponent: React.FC<MatchComponentProps> = ({ match, index, HEIGHT, HORIZONTAL_GAP, topCoord, starting_y, starting_x, WIDTH }) => {

    const { tournamentid } = useParams({ strict: false })

    const location = useLocation()
    const [isDisabled, setIsDisabled] = useState(true)
    const { t } = useTranslation()

    useEffect(() => {
        if (location.pathname.includes("admin")) {
            setIsDisabled(false)
        }
    }, [location])

    const [isOpen, setIsOpen] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)
    void isOpen, isOpen2, tournamentid

    const { p1_sets, p2_sets } = setScore(match)

    return (
        <div key={index}>
            <div
                key={match.match.id}
                style={{
                    top: `${topCoord + starting_y + 30}px`,
                    left: `${(match.match.round * HORIZONTAL_GAP) + starting_x}px`,
                    width: `${WIDTH}px`,
                    height: `${HEIGHT}px`,
                }}
                onClick={() =>
                    !isDisabled &&
                    (match.match.table_type == "champions_league" ? setIsOpen2(true) : setIsOpen(true))}
                className={`absolute flex flex-col z-10 bg-white text-sm`}>
                {match.participant_1.id != "empty" && match.participant_2.id != "empty" && <div className='absolute top-[-20px] w-[60px] text-left text-[10px]'>{t("admin.tournaments.matches.table.table")} {match.match.extra_data.table}</div>}
                {/* match.participant_1.id != "empty" && match.participant_2.id != "empty" && <div className='absolute left-[112px] text-right top-[-20px] w-[100px] text-[10px]'>{match.match.start_date ? formatDateTimeBracket(match.match.start_date) : formatDateTimeBracket(new Date().toISOString())}</div>*/}
                {match.participant_1.id != "empty" && match.participant_2.id != "empty" && <div className='absolute left-[0px] text-right top-[-20px] w-[100px] text-[10px]'>{match.match.bracket}</div>}
                <div style={{ height: `${HEIGHT / 2}px` }} className="flex items-center">
                    {/* 3 different layouts, one for byeybe, another for regular player and another for empty player */}
                    {(match.participant_1.id == "empty") ? (
                        <>
                            <div className="text-center px-2">{""}</div>
                            <div className="w-full text-gray-500">(Bye)</div>
                            <div className="text-right pr-4">{""}</div>
                        </>
                    ) : match.participant_1.id === "" ? (
                        <div></div>
                    ) : (
                        <>
                            <div className="text-center px-2">{getRandomFlag()}</div>
                            <div className={cn(
                                "text-[12px] overflow-ellipsis overflow-hidden whitespace-nowrap pr-2 w-full text-[#575757] font-bold",
                                match.match.winner_id == match.participant_1.id || match.participant_2.id == "empty" ? "" : "font-medium"
                            )}>
                                {match.participant_1.name}
                            </div>
                            {/* If another player is byebye, don't show score, but only - */}
                            <div className={cn("w-[50px]  items-center flex justify-center h-full font-semibold", p1_sets > p2_sets ? "bg-[#F3F9FC]" : p1_sets < p2_sets ? "" : "")}>{match.participant_2.id == "empty" ? "" : p1_sets}</div>
                        </>
                    )}
                </div>

                {/* <Separator className="bg-gray-300" /> */}
                <div style={{ height: `${HEIGHT / 2}px` }} className="flex items-center">
                    {/* 3 different layouts, one for byeybe, another for regular player and another for empty player */}
                    {(match.participant_2.id == "empty") ? (
                        <>
                            <div className="text-center px-2">{""}</div>
                            <div className="w-full text-gray-500">(Bye)</div>
                            <div className="text-right pr-4">{""}</div>
                        </>
                    ) : match.participant_2.id === "" ? (
                        <div></div>
                    ) : (
                        <>
                            <div className="text-center px-2">{getRandomFlag()}</div>
                            <div className={cn(
                                "text-[12px] overflow-ellipsis overflow-hidden whitespace-nowrap pr-2 w-full  text-[#575757] font-bold",
                                match.match.winner_id == match.participant_2.id || match.participant_1.id == "empty" ? "" : "font-medium"
                            )}>
                                {match.participant_2.name}
                            </div>
                            {/* If another player is byebye, don't show score, but only - */}
                            <div className={cn("w-[50px] items-center flex justify-center h-full font-semibold", p1_sets < p2_sets ? "bg-[#F3F9FC]" : p1_sets > p2_sets ? "" : "")}>{match.participant_1.id == "empty" ? "" : p2_sets}</div>
                        </>
                    )}
                </div>
            </div>
            {/* {match.match.table_type == "champions_league"
                ? <TableTennisProtocolModal isOpen={isOpen2} onClose={() => { setIsOpen2(false) }} match={{ match: match.match, p1: match.participant_1, p2: match.participant_2, class: "" }} tournament_id={Number(tournamentid)} />
                : <MatchDialog match={{ match: match.match, p1: match.participant_1, p2: match.participant_2, class: "" }} tournament_id={Number(tournamentid)} open={isOpen} onClose={() => setIsOpen(false)} />
            } */}
        </div>
    )
}

export default MatchComponent 