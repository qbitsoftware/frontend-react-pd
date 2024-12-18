import { Separator } from "@/components/ui/separator";
import { CalculateSVGHeight, CalculateSVGWidth, FindContestant } from "@/lib/utils";
import { Data } from "@/types/types";

interface BracketProps {
    starting_x: number,
    starting_y: number,
    data: Data
}

const SingleElimBracket = ({ data, starting_x, starting_y }: BracketProps) => {
    const WIDTH = 200
    const HEIGTH = 80
    const VERTICAL_GAP = 80
    const HORISONTAL_GAP = 290
    const SVG_WIDTH = CalculateSVGWidth(data.matches, HORISONTAL_GAP)
    const SVG_HEIGTH = CalculateSVGHeight(data.matches, VERTICAL_GAP, HEIGTH)

    if (data && data.matches) {
        return (
            <div>
                <div className="relative">
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
                                    top: `${topCoord + starting_y}px`,
                                    left: `${(match.roundIndex * HORISONTAL_GAP) + starting_x}px`,
                                    width: `${WIDTH}px`,
                                    height: `${HEIGTH}px`,
                                }}
                                key={index}
                                className={`absolute flex flex-col bg-red-400 items-center justify-center`}>
                                <div>
                                    {match.sides &&
                                        <div>{FindContestant(data, match.sides[0].contestantId).players[0].title}</div>
                                    }
                                </div>
                                <Separator />
                                <div>
                                    {match.sides &&
                                        <div> {FindContestant(data, match.sides[1].contestantId).players[0].title}</div>
                                    }
                                </div>
                            </div>
                        )
                    })}
                    <svg className="absolute" style={{ top: `${starting_y}`, left: `${starting_x}` }} width={SVG_WIDTH} height={SVG_HEIGTH}>
                        {data.matches.map((match) => {
                            if (match.roundIndex === 0) return null

                            const prevMatches = data.matches!.filter(
                                (m) => m.roundIndex === match.roundIndex - 1
                            );

                            const firstMatch = prevMatches[2 * match.order]
                            const secondMatch = prevMatches[2 * match.order + 1]

                            if (!firstMatch || !secondMatch) return null

                            const startX = (match.roundIndex * HORISONTAL_GAP)
                            const startY = (match.topCoord + HEIGTH / 2)

                            const endX = ((match.roundIndex - 1) * HORISONTAL_GAP + WIDTH)
                            const endY1 = (firstMatch.topCoord + HEIGTH / 2)
                            const endY2 = (secondMatch.topCoord + HEIGTH / 2)

                            return (
                                <g key={`line-${match.roundIndex}-${match.order}`}>
                                    <path
                                        d={`M${startX} ${startY} H${startX - HEIGTH / 2} V${endY1} H${endX}`}
                                        stroke="black"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <path
                                        d={`M${startX} ${startY} H${startX - HEIGTH / 2} V${endY2} H${endX}`}
                                        stroke="black"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
        );
    }
}

export default SingleElimBracket;