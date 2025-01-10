import { Separator } from "@/components/ui/separator";
import { CalculateSVGHeight, CalculateSVGWidth, FindContestant, formatName, getRandomFlag } from "@/lib/utils";
import { Data } from "@/types/types";

interface BracketProps {
    starting_x: number,
    starting_y: number,
    data: Data
}

const SingleElimBracket = ({ data, starting_x, starting_y }: BracketProps) => {
    const WIDTH = 180
    const HEIGTH = 60
    const VERTICAL_GAP = 80
    const HORISONTAL_GAP = 240
    const SVG_WIDTH = CalculateSVGWidth(data.matches, HORISONTAL_GAP)
    const SVG_HEIGTH = CalculateSVGHeight(data.matches, VERTICAL_GAP, HEIGTH)
    const matches_len = data.matches.reduce((max, item) => item.roundIndex > max.roundIndex ? item : max, { roundIndex: -Infinity }).roundIndex

    if (data && data.matches) {
        return (
            <div className="relative h-full w-full">
                {/* Match boxes */}
                {data.matches.map((match, index) => {
                    let topCoord;
                    if (match.isBronzeMatch) {
                        const finalMatch = data.matches!.filter(
                            (m) => m.roundIndex === match.roundIndex && !m.isBronzeMatch
                        )
                        topCoord = finalMatch[0].topCoord + HEIGTH + VERTICAL_GAP
                    } else
                        if (match.roundIndex === 0) {

                            topCoord = match.order * (HEIGTH + VERTICAL_GAP)
                        } else {
                            const prevMatches = data.matches!.filter(
                                (m) => m.roundIndex === match.roundIndex - 1
                            )
                            const firstMatch = prevMatches[2 * match.order]
                            const secondMatch = prevMatches[2 * match.order + 1]

                            if (firstMatch && secondMatch) {
                                topCoord = (firstMatch.topCoord + secondMatch.topCoord) / 2
                            } else {
                                topCoord = match.order * (HEIGTH + VERTICAL_GAP)
                            }
                        }
                    match.topCoord = topCoord
                    return (
                        <div
                            style={{
                                top: `${topCoord + starting_y + 100}px`,
                                left: `${(match.roundIndex * HORISONTAL_GAP) + starting_x}px`,
                                width: `${WIDTH}px`,
                                height: `${HEIGTH}px`,
                            }}
                            key={index}
                            className={`absolute flex flex-col border border-black/30 rounded-sm hover:border-blue-600 z-10 text-sm`}>
                            <div style={{ height: `${HEIGTH / 2}px` }} className="flex items-center">
                                {/* 3 different layouts, one for byeybe, another for regular player and another for empty player */}
                                {(match.sides && match.sides[0].contestantId == "empty") ? (
                                    <>
                                        <div className="text-center px-2">{"👋"}</div>
                                        <div className="w-full overflow-ellipsis overflow-hidden whitespace-nowrap">Bye-Bye</div>
                                        <div className="text-right pr-4">{"-"}</div>
                                    </>
                                ) : match.sides && match.sides[0].contestantId === "" ? (
                                    <div></div>
                                ) : (
                                    <>
                                        <div className="text-center px-2">{getRandomFlag()}</div>
                                        <div className="w-full">
                                            {match.sides && match.sides[0].contestantId && (
                                                <div className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                                                    {formatName(
                                                        FindContestant(data, match.sides[0].contestantId).players[0].title
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {/* If another player is byebye, don't show score, but only - */}
                                        <div className="text-right pr-4">{match.sides && match.sides[1].contestantId == "empty" ? "-" : Math.round(Math.random() * 10)}</div>
                                    </>
                                )}
                            </div>
                            <Separator className="bg-gray-300" />
                            <div style={{ height: `${HEIGTH / 2}px` }} className="flex items-center">
                                {/* 3 different layouts, one for byeybe, another for regular player and another for empty player */}
                                {(match.sides && match.sides[1].contestantId == "empty") ? (
                                    <>
                                        <div className="text-center px-2">{"👋"}</div>
                                        <div className="w-full">Bye-Bye</div>
                                        <div className="text-right pr-4">{"-"}</div>
                                    </>
                                ) : match.sides && match.sides[1].contestantId === "" ? (
                                    <div></div>
                                ) : (
                                    <>
                                        <div className="text-center px-2">{getRandomFlag()}</div>
                                        <div className="w-full">
                                            {match.sides && match.sides[1].contestantId && (
                                                <div className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                                                    {formatName(
                                                        FindContestant(data, match.sides[1].contestantId).players[0].title
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {/* If another player is byebye, don't show score, but only - */}
                                        <div className="text-right pr-4">{match.sides && match.sides[0].contestantId == "empty" ? "-" : Math.round(Math.random() * 10)}</div>
                                    </>
                                )}
                            </div>
                        </div>
                    )
                })}
                {/* Bracket lines */}
                <svg className="absolute" style={{ top: `${starting_y + 100}`, left: `${starting_x}` }} width={SVG_WIDTH} height={SVG_HEIGTH}>
                    {data.matches.map((match) => {
                        if (match.roundIndex === 0) return null

                        const prevMatches = data.matches!.filter(
                            (m) => m.roundIndex === match.roundIndex - 1
                        );

                        const firstMatch = prevMatches[2 * match.order]
                        const secondMatch = prevMatches[2 * match.order + 1]

                        if (!firstMatch || !secondMatch) return null

                        const startX = (match.roundIndex * HORISONTAL_GAP)
                        const startY = (match.topCoord + HEIGTH / 2 + 1)

                        const endX = ((match.roundIndex - 1) * HORISONTAL_GAP + WIDTH)
                        const endY1 = (firstMatch.topCoord + HEIGTH / 2 + 1)
                        const endY2 = (secondMatch.topCoord + HEIGTH / 2 + 1)

                        return (
                            <g key={`line-${match.roundIndex}-${match.order}`}>
                                <path
                                    d={`M${startX} ${startY} H${startX - HEIGTH / 2} V${endY1} H${endX}`}
                                    className="stroke-black/30"
                                    strokeWidth="1"
                                    shapeRendering={"crispEdges"}
                                    fill="none"
                                />
                                <path
                                    d={`M${startX} ${startY} H${startX - HEIGTH / 2} V${endY2} H${endX}`}
                                    strokeWidth="1"
                                    shapeRendering={"crispEdges"}
                                    className="stroke-black/30"
                                    fill="none"
                                />
                            </g>
                        );
                    })}
                </svg>
                {/* Bracket info */}
                {Array.from({ length: matches_len + 1 }).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            top: `${starting_y}px`,
                            left: `${starting_x + (WIDTH + VERTICAL_GAP + (matches_len === index ? -15 : -20)) * index}px`,
                            width: `${WIDTH}px`
                        }}
                        className="absolute text-center border-none bg-black/10 rounded-md py-2"
                    >
                        <div className="font-semibold">Round {index + 1}</div>
                    </div>
                ))}
            </div>
        );
    }
}

export default SingleElimBracket;