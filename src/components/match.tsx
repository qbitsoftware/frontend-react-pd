import React, { useState } from 'react'
import { TableMatch } from '@/types/types'
import { formatName, getRandomFlag } from '@/lib/utils'
import { Separator } from './ui/separator'
import MatchDialog from './match-dialog'

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



const MatchComponent: React.FC<MatchComponentProps> = ({ match, index, HEIGHT, HORIZONTAL_GAP, topCoord, starting_y, starting_x, WIDTH }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <div
                style={{
                    top: `${topCoord + starting_y + 100}px`,
                    left: `${(match.match.round * HORIZONTAL_GAP) + starting_x}px`,
                    width: `${WIDTH}px`,
                    height: `${HEIGHT}px`,
                }}
                onClick={() =>
                    setIsOpen(true)}
                key={index}
                className={`absolute flex flex-col border rounded-sm border-black/30 hover:border-blue-600 z-10 text-sm`}>
                <div style={{ height: `${HEIGHT / 2}px` }} className="flex items-center">
                    {/* 3 different layouts, one for byeybe, another for regular player and another for empty player */}
                    {(match.participant_1.id == "empty") ? (
                        <>
                            <div className="text-center px-2">{"👋"}</div>
                            <div className="w-full">Bye-Bye</div>
                            <div className="text-right pr-4">{"-"}</div>
                        </>
                    ) : match.participant_1.id === "" ? (
                        <div></div>
                    ) : (
                        <>
                            <div className="text-center px-2">{getRandomFlag()}</div>
                            <div className="overflow-ellipsis overflow-hidden whitespace-nowrap pr-2 w-full">
                                {formatName(match.participant_1.name)}
                            </div>
                            {/* If another player is byebye, don't show score, but only - */}
                            <div className="text-right pr-4">{match.participant_2.id == "empty" ? "-" : Math.round(Math.random() * 10)}</div>
                        </>
                    )}
                </div>

                <Separator className="bg-gray-300" />
                <div style={{ height: `${HEIGHT / 2}px` }} className="flex items-center">
                    {/* 3 different layouts, one for byeybe, another for regular player and another for empty player */}
                    {(match.participant_2.id == "empty") ? (
                        <>
                            <div className="text-center px-2">{"👋"}</div>
                            <div className="w-full">Bye-Bye</div>
                            <div className="text-right pr-4">{"-"}</div>
                        </>
                    ) : match.participant_2.id === "" ? (
                        <div></div>
                    ) : (
                        <>
                            <div className="text-center px-2">{getRandomFlag()}</div>
                            <div className="overflow-ellipsis overflow-hidden whitespace-nowrap pr-2 w-full">
                                {formatName(match.participant_2.name)}
                            </div>
                            {/* If another player is byebye, don't show score, but only - */}
                            <div className="text-right pr-4">{match.participant_1.id == "empty" ? "-" : Math.round(Math.random() * 10)}</div>
                        </>
                    )}
                </div>
            </div>
            <MatchDialog match={match} open={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    )
}

export default MatchComponent 