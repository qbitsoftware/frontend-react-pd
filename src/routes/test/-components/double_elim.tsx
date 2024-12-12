import { Separator } from '@/components/ui/separator';
import { CalcCurrentRoundMatches, CalculateSVGHeight, CalculateSVGWidth } from '@/lib/utils';
import { Data } from '@/types/types';

interface BracketProps {
    starting_x: number,
    starting_y: number,
    data: Data
}

const DoubleElimBracket = ({ data, starting_x, starting_y }: BracketProps) => {
    const WIDTH = 160;
    const HEIGHT = 80;
    const VERTICAL_GAP = 80;
    const HORIZONTAL_GAP = 240;
    const SVG_WIDTH = CalculateSVGWidth(data.matches, VERTICAL_GAP, WIDTH);
    const SVG_HEIGHT = CalculateSVGHeight(data.matches, HORIZONTAL_GAP, HEIGHT);

    if (data && data.matches) {
        return (
            <div className="relative">
                {data.matches.map((match, index) => {
                    let topCoord;
                    // if (match.roundIndex < 4) { // Winners bracket
                    // topCoord = match.order * (HEIGHT + VERTICAL_GAP);
                    // } else { // Losers bracket
                    const prevMatches = data.matches!.filter(
                        (m) => m.roundIndex === match.roundIndex - 1
                    );

                    // Align losers' matches at the same level
                    console.log("match round index", match.roundIndex)
                    if (match.roundIndex % 2 === 0) {
                        const firstMatch = prevMatches[2 * match.order];
                        const secondMatch = prevMatches[2 * match.order + 1];

                        if (firstMatch && secondMatch) {
                            topCoord = (firstMatch.topCoord + secondMatch.topCoord) / 2;
                        } else {
                            topCoord = match.order * (HEIGHT + VERTICAL_GAP);
                        }
                    } else {
                        topCoord = match.order * (HEIGHT + VERTICAL_GAP);
                    }
                    // }
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
                            className={`absolute flex flex-col ${match.roundIndex === 0 ? "bg-red-200" :
                                match.roundIndex === 1 ? "bg-green-200" :
                                    match.roundIndex === 3 ? "bg-yellow-200" : "bg-blue-200"} flex items-center justify-center`}>
                            <div>
                                {match.sides &&
                                    <div> Contestant 0: {match.sides[0].contestantId}</div>
                                }
                            </div>
                            <Separator />
                            <div>
                                {match.sides &&
                                    <div> Contestant 1: {match.sides[1].contestantId}</div>
                                }
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

                        // For winners' bracket, connect to previous round in the winners' bracket
                        if (match.roundIndex % 2 == 0) {
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
                                        stroke="black"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <path
                                        d={`M${startX} ${startY} H${startX - HEIGHT / 2} V${endY2} H${endX}`}
                                        stroke="black"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                </g>
                            );
                        } else { // Losers' bracket
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
                                        stroke="black"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <path
                                        d={`M${startX} ${startY} H${startX - HEIGHT / 2} V${endY2} H${endX}`}
                                        stroke="black"
                                        strokeWidth="2"
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