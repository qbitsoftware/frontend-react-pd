import { Separator } from '@/components/ui/separator';
import { CalculateSVGHeight, CalculateSVGWidth, FindContestant, formatName, getRandomFlag } from '@/lib/utils';
import { Data } from '@/types/types';

interface BracketProps {
    starting_x: number,
    starting_y: number,
    data: Data
}

const DoubleElimBracket = ({ data, starting_x, starting_y }: BracketProps) => {
    const WIDTH = 250;
    const HEIGHT = 80;
    const VERTICAL_GAP = 80;
    const HORIZONTAL_GAP = 330;
    const SVG_WIDTH = CalculateSVGWidth(data.matches, HORIZONTAL_GAP);
    const SVG_HEIGHT = CalculateSVGHeight(data.matches, VERTICAL_GAP, HEIGHT);

    if (data && data.matches) {
        return (
            <div className="relative">
                {data.matches.map((match, index) => {
                    let topCoord;
                    const prevMatches = data.matches!.filter(
                        (m) => m.roundIndex === match.roundIndex - 1
                    );

                    if (match.roundIndex % 2 === 0 && match.roundIndex != 0) {
                        const firstMatch = prevMatches[2 * match.order];
                        const secondMatch = prevMatches[2 * match.order + 1];

                        if (firstMatch && secondMatch) {
                            topCoord = (firstMatch.topCoord + secondMatch.topCoord) / 2;
                        } else {
                            topCoord = match.order * (HEIGHT + VERTICAL_GAP);
                            console.log("we are never getting her")
                        }
                    } else {
                        if (match.roundIndex == 0) {
                            topCoord = match.order * (HEIGHT + VERTICAL_GAP);
                        } else {
                            //check if final match
                            if (match.bracket == "5-6") {
                                const firstMatch = prevMatches[2 * match.order];
                                const secondMatch = prevMatches[2 * match.order + 1];
                                topCoord = (firstMatch.topCoord + secondMatch.topCoord) / 2;
                            } else {
                                topCoord = prevMatches[match.order].topCoord
                            }
                        }
                    }
                    match.topCoord = topCoord;
                    return (
                        <div
                            style={{
                                top: `${topCoord + starting_y}px`,
                                left: `${(match.roundIndex * HORIZONTAL_GAP) + starting_x}px`,
                                width: `${WIDTH}px`,
                                height: `${HEIGHT}px`,
                            }}
                            key={index}
                            className={`absolute flex flex-col border border-gray-500 hover:border-blue-600 z-10`}>
                            {/* <div>
                                {match.sides &&
                                    <div> Contestant 0: {match.sides[0].contestantId}</div>
                                }
                            </div> */}
                            <div style={{ height: `${HEIGHT / 2}px` }} className="flex items-center">
                                {/* 3 different layouts, one for byeybe, another for regular player and another for empty player */}
                                {(match.sides && match.sides[0].contestantId == "empty") ? (
                                    <>
                                        <div className="text-center px-2">{"👋"}</div>
                                        <div className="w-full">Bye-Bye</div>
                                        <div className="text-right pr-4">{"-"}</div>
                                    </>
                                ) : match.sides && match.sides[0].contestantId === "" ? (
                                    <div></div>
                                ) : (
                                    <>
                                        <div className="text-center px-2">{getRandomFlag()}</div>
                                        <div className="w-full">
                                            {match.sides && match.sides[0].contestantId && (
                                                <div>
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
                            <div style={{ height: `${HEIGHT / 2}px` }} className="flex items-center">
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
                                                <div>
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
                    );
                })}

                <svg className="absolute" style={{ top: `${starting_y}`, left: `${starting_x}` }} width={SVG_WIDTH} height={SVG_HEIGHT}>
                    {data.matches.map((match) => {
                        if (match.roundIndex === 0) return null;

                        const prevMatches = data.matches!.filter(
                            (m) => m.roundIndex === match.roundIndex - 1
                        );

                        if (match.roundIndex % 2 == 0 || match.bracket == "5-6") {
                            const firstMatch = prevMatches[2 * match.order];
                            const secondMatch = prevMatches[2 * match.order + 1];

                            if (!firstMatch || !secondMatch) return null;

                            const startX = match.roundIndex * HORIZONTAL_GAP;
                            const startY = match.topCoord + HEIGHT / 2;

                            const endX = (match.roundIndex - 1) * HORIZONTAL_GAP + WIDTH;
                            const endY1 = firstMatch.topCoord + HEIGHT / 2;
                            const endY2 = secondMatch.topCoord + HEIGHT / 2;

                            return (
                                <g key={`line-${match.roundIndex}-${match.order}`}>
                                    <path
                                        d={`M${startX} ${startY} H${startX - HEIGHT / 2} V${endY1} H${endX}`}
                                        className="stroke-gray-500"
                                        strokeWidth="1"
                                        fill="none"
                                    />
                                    <path
                                        d={`M${startX} ${startY} H${startX - HEIGHT / 2} V${endY2} H${endX}`}
                                        className="stroke-gray-500"
                                        strokeWidth="1"
                                        fill="none"
                                    />
                                </g>
                            );
                        } else {
                            const startX = match.roundIndex * HORIZONTAL_GAP
                            const startY = match.topCoord + HEIGHT / 2

                            const endX = (match.roundIndex - 1) * HORIZONTAL_GAP + WIDTH
                            const endY1 = prevMatches[match.order].topCoord + HEIGHT / 2
                            const endY2 = prevMatches[match.order].topCoord + HEIGHT / 2

                            return (
                                <g key={`line-${match.roundIndex}-${match.order}`}>
                                    <path
                                        d={`M${startX} ${startY} H${startX - HEIGHT / 2} V${endY1} H${endX}`}
                                        className="stroke-gray-500"
                                        strokeWidth="1"
                                        fill="none"
                                    />
                                    <path
                                        d={`M${startX} ${startY} H${startX - HEIGHT / 2} V${endY2} H${endX}`}
                                        className="stroke-gray-500"
                                        strokeWidth="1"
                                        fill="none"
                                    />
                                </g>
                            );
                        }
                    })}
                </svg>
            </div>
        );
    }
}

export default DoubleElimBracket;