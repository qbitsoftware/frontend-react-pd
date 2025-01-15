import { CalculateSVGHeight, CalculateSVGWidth } from '@/lib/utils';
import { Data } from '@/types/types';
import MatchComponent from './match';

interface BracketProps {
    starting_x: number,
    starting_y: number,
    index: number,
    data: Data,
}

const DoubleElimBracket = ({ data, starting_x, starting_y, index }: BracketProps) => {
    const WIDTH = 180
    const HEIGHT = 60
    const VERTICAL_GAP = 60
    const HORIZONTAL_GAP = 240
    if (!data.matches) {
        return null
    }
    const SVG_WIDTH = CalculateSVGWidth(data.matches, HORIZONTAL_GAP);
    const SVG_HEIGHT = CalculateSVGHeight(data.matches, VERTICAL_GAP, HEIGHT);

    const matches_len = data.matches.reduce((max, item) => item.match.round > max.round ? item.match : max, { round: -Infinity }).round


    if (data && data.matches) {
        return (
            <div className="relative pr-10" key={index}>
                {data.matches.map((match, index) => {
                    let topCoord;
                    const prevMatches = data.matches!.filter(
                        (m) => m.match.round === match.match.round - 1
                    );

                    if (match.match.round % 2 === 0 && match.match.round != 0) {
                        const firstMatch = prevMatches[2 * match.match.order];
                        const secondMatch = prevMatches[2 * match.match.order + 1];

                        if (firstMatch && secondMatch) {
                            topCoord = (firstMatch.match.topCoord + secondMatch.match.topCoord) / 2;
                        } else {
                            topCoord = match.match.order * (HEIGHT + VERTICAL_GAP);
                            console.log("we are never getting her")
                        }
                    } else {
                        if (match.match.round == 0) {
                            topCoord = match.match.order * (HEIGHT + VERTICAL_GAP);
                        } else {
                            //check if final match
                            if (match.match.bracket == "5-6") {
                                const firstMatch = prevMatches[2 * match.match.order];
                                const secondMatch = prevMatches[2 * match.match.order + 1];
                                topCoord = (firstMatch.match.topCoord + secondMatch.match.topCoord) / 2;
                            } else {
                                topCoord = prevMatches[match.match.order].match.topCoord
                            }
                        }
                    }
                    match.match.topCoord = topCoord;
                    return (
                        <MatchComponent key={index} WIDTH={WIDTH} HEIGHT={HEIGHT} match={match} index={index} HORIZONTAL_GAP={HORIZONTAL_GAP} starting_x={starting_x} starting_y={starting_y} topCoord={topCoord} />
                    )
                })}

                <svg className="absolute" style={{ top: `${starting_y + 100}`, left: `${starting_x}` }} width={SVG_WIDTH} height={SVG_HEIGHT}>
                    {data.matches.map((match) => {
                        if (match.match.round === 0) return null;

                        const prevMatches = data.matches!.filter(
                            (m) => m.match.round === match.match.round - 1
                        );

                        if (match.match.round % 2 == 0 || match.match.bracket == "5-6") {
                            const firstMatch = prevMatches[2 * match.match.order];
                            const secondMatch = prevMatches[2 * match.match.order + 1];

                            if (!firstMatch || !secondMatch) return null;

                            const startX = match.match.round * HORIZONTAL_GAP;
                            const startY = match.match.topCoord + HEIGHT / 2 + 1;

                            const endX = (match.match.round - 1) * HORIZONTAL_GAP + WIDTH;
                            const endY1 = firstMatch.match.topCoord + HEIGHT / 2 + 1;
                            const endY2 = secondMatch.match.topCoord + HEIGHT / 2 + 1;

                            return (
                                <g key={`line-${match.match.round}-${match.match.order}`}>
                                    <path
                                        d={`M${startX} ${startY} H${startX - HEIGHT / 2} V${endY1} H${endX}`}
                                        className="stroke-black/30"
                                        strokeWidth="1"
                                        fill="none"
                                        shapeRendering={"crispEdges"}
                                    />
                                    <path
                                        d={`M${startX} ${startY} H${startX - HEIGHT / 2} V${endY2} H${endX}`}
                                        className="stroke-black/30"
                                        strokeWidth="1"
                                        fill="none"
                                        shapeRendering={"crispEdges"}
                                    />
                                </g>
                            );
                        } else {
                            const startX = match.match.round * HORIZONTAL_GAP
                            const startY = match.match.topCoord + HEIGHT / 2 + 1

                            const endX = (match.match.round - 1) * HORIZONTAL_GAP + WIDTH
                            const endY1 = prevMatches[match.match.order].match.topCoord + HEIGHT / 2 + 1
                            const endY2 = prevMatches[match.match.order].match.topCoord + HEIGHT / 2 + 1

                            return (
                                <g key={`line-${match.match.round}-${match.match.order}`}>
                                    <path
                                        d={`M${startX} ${startY} H${startX - HEIGHT / 2} V${endY1} H${endX}`}
                                        className="stroke-black/30"
                                        strokeWidth="1"
                                        fill="none"
                                        shapeRendering={"crispEdges"}
                                    />
                                    <path
                                        d={`M${startX} ${startY} H${startX - HEIGHT / 2} V${endY2} H${endX}`}
                                        className="stroke-black/30"
                                        strokeWidth="1"
                                        fill="none"
                                        shapeRendering={"crispEdges"}
                                    />
                                </g>
                            );
                        }
                    })}
                </svg>
                {Array.from({ length: matches_len + 1 }).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            top: `${starting_y}px`,
                            left: `${starting_x + (WIDTH + VERTICAL_GAP + (matches_len === index ? 5 : 0)) * index}px`,
                            width: `${WIDTH}px`
                        }}
                        className="absolute text-center border-[1px] border-black/10 shadow-md rounded-md py-2"
                    >
                        <div className="font-semibold">Round {index + 1}</div>
                    </div>
                ))}

            </div>
        );
    }
}

export default DoubleElimBracket;