import { CalculateSVGHeight, CalculateSVGWidth } from "@/lib/utils";
import { Data } from "@/types/types";
import MatchComponent from "./match";

interface BracketProps {
    starting_x: number,
    starting_y: number,
    data: Data,
}

const SingleElimBracket = ({ data, starting_x, starting_y }: BracketProps) => {
    const WIDTH = 180
    const HEIGTH = 60
    const VERTICAL_GAP = 80
    const HORISONTAL_GAP = 240
    const SVG_WIDTH = CalculateSVGWidth(data.matches, HORISONTAL_GAP)
    const SVG_HEIGTH = CalculateSVGHeight(data.matches, VERTICAL_GAP, HEIGTH)
    const matches_len = data.matches.reduce((max, item) => item.match.round > max.round ? item.match : max, { round: -Infinity }).round
    console.log("matche len", matches_len)
    console.log("svg width", SVG_WIDTH)
    console.log("svg heigth", SVG_HEIGTH)

    if (data && data.matches) {
        return (
            <div className="relative h-full w-full">
                {/* Match boxes */}
                {data.matches.map((match, index) => {
                    let topCoord;
                    if (match.is_bronze_match) {
                        const finalMatch = data.matches!.filter(
                            (m) => m.match.round === match.match.round && !m.is_bronze_match
                        )
                        topCoord = finalMatch[0].match.topCoord + HEIGTH + VERTICAL_GAP
                    } else
                        if (match.match.round === 0) {

                            topCoord = match.match.order * (HEIGTH + VERTICAL_GAP)
                        } else {
                            const prevMatches = data.matches!.filter(
                                (m) => m.match.round === match.match.round - 1
                            )
                            const firstMatch = prevMatches[2 * match.match.order]
                            const secondMatch = prevMatches[2 * match.match.order + 1]

                            if (firstMatch && secondMatch) {
                                topCoord = (firstMatch.match.topCoord + secondMatch.match.topCoord) / 2
                            } else {
                                topCoord = match.match.order * (HEIGTH + VERTICAL_GAP)
                            }
                        }
                    match.match.topCoord = topCoord
                    return (
                        <MatchComponent WIDTH={WIDTH} HEIGHT={HEIGTH} match={match} index={index} HORIZONTAL_GAP={HORISONTAL_GAP} starting_x={starting_x} starting_y={starting_y} topCoord={topCoord} />
                    )
                })}
                {/* Bracket lines */}
                <svg className="absolute" style={{ top: `${starting_y + 100}`, left: `${starting_x}` }} width={SVG_WIDTH} height={SVG_HEIGTH}>
                    {data.matches.map((match) => {
                        if (match.match.round === 0) return null

                        const prevMatches = data.matches!.filter(
                            (m) => m.match.round === match.match.round - 1
                        );

                        const firstMatch = prevMatches[2 * match.match.order]
                        const secondMatch = prevMatches[2 * match.match.order + 1]

                        if (!firstMatch || !secondMatch) return null

                        const startX = (match.match.round * HORISONTAL_GAP)
                        const startY = (match.match.topCoord + HEIGTH / 2 + 1)

                        const endX = ((match.match.round - 1) * HORISONTAL_GAP + WIDTH)
                        const endY1 = (firstMatch.match.topCoord + HEIGTH / 2 + 1)
                        const endY2 = (secondMatch.match.topCoord + HEIGTH / 2 + 1)

                        return (
                            <g key={`line-${match.match.round}-${match.match.order}`}>
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