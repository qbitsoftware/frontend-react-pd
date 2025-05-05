import { CalculateSVGHeight, CalculateSVGWidth } from "@/lib/utils";
import MatchComponent from "./match";
import { EliminationBracket } from "@/types/brackets";
import { TournamentTable } from "@/types/groups";
import { MatchWrapper } from "@/types/matches";

interface BracketProps {
  starting_x: number;
  starting_y: number;
  index: number;
  tournament_table: TournamentTable
  data: EliminationBracket;
  handleSelectMatch?: (match: MatchWrapper) => void
}

const DoubleElimBracket = ({
  data,
  starting_x,
  starting_y,
  tournament_table,
  index,
  handleSelectMatch
}: BracketProps) => {
  const WIDTH = 220;
  const HEIGHT = 60;
  const VERTICAL_GAP = 30;
  const HORIZONTAL_GAP = 250;
  if (!data.matches) {
    return null;
  }
  const SVG_WIDTH = CalculateSVGWidth(data.matches, HORIZONTAL_GAP);
  const SVG_HEIGHT = CalculateSVGHeight(data.matches, VERTICAL_GAP, HEIGHT);

  // const matches_len = data.matches.reduce((max, item) => item.match.round > max.round ? item.match : max, { round: -Infinity }).round


  if (data && data.matches) {
    return (
      <div className="relative pr-10" key={index}>
        {data.matches.map((match, index) => {
          let topCoord;
          const prevMatches = data.matches!.filter(
            (m) => m.match.round === match.match.round - 1,
          );

          if (match.match.round % 2 === 0 && match.match.round != 0) {
            const firstMatch = prevMatches[2 * match.match.order];
            const secondMatch = prevMatches[2 * match.match.order + 1];

            if (firstMatch && secondMatch) {
              topCoord =
                (firstMatch.match.topCoord + secondMatch.match.topCoord) / 2;
            } else {
              topCoord = match.match.order * (HEIGHT + VERTICAL_GAP);
            }
          } else {
            if (match.match.round == 0) {
              topCoord = match.match.order * (HEIGHT + VERTICAL_GAP);
            } else {
              //check if final match
              if (match.match.bracket == "5-6") {
                const firstMatch = prevMatches[2 * match.match.order];
                const secondMatch = prevMatches[2 * match.match.order + 1];
                topCoord =
                  (firstMatch.match.topCoord + secondMatch.match.topCoord) / 2;
              } else {
                topCoord = prevMatches[match.match.order].match.topCoord;
              }
            }
          }
          match.match.topCoord = topCoord;
          return (
            <MatchComponent
              handleSelectMatch={handleSelectMatch}
              key={index}
              tournament_table={tournament_table}
              WIDTH={WIDTH}
              HEIGHT={HEIGHT}
              match={match}
              index={index}
              HORIZONTAL_GAP={HORIZONTAL_GAP}
              starting_x={starting_x}
              starting_y={starting_y}
              topCoord={topCoord}
            />
          );
        })}

        <svg
          className="absolute"
          style={{ top: `${starting_y + 30}`, left: `${starting_x}` }}
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
        >
          {data.matches.map((match) => {
            if (match.match.round === 0) return null;

            const prevMatches = data.matches!.filter(
              (m) => m.match.round === match.match.round - 1,
            );

            if (match.match.round % 2 == 0 || match.match.bracket == "5-6") {
              const firstMatch = prevMatches[2 * match.match.order];
              const secondMatch = prevMatches[2 * match.match.order + 1];

              if (!firstMatch || !secondMatch) return null;

              const startX = match.match.round * HORIZONTAL_GAP + 15;
              const startY = match.match.topCoord + HEIGHT / 2 + 1;

              const endX = (match.match.round - 1) * HORIZONTAL_GAP + WIDTH;
              const endY1 = firstMatch.match.topCoord + HEIGHT / 2 + 1;
              const endY2 = secondMatch.match.topCoord + HEIGHT / 2 + 1;

              return (
                <g key={`line-${match.match.round}-${match.match.order}`}>
                  <path
                    d={`M${startX} ${startY - 5} H${startX - HEIGHT / 2} V${endY1} H${endX}`}
                    className="stroke-gray-300"
                    strokeWidth="1"
                    fill="none"
                    shapeRendering={"crispEdges"}
                  />
                  <path
                    d={`M${startX} ${startY + 5} H${startX - HEIGHT / 2} V${endY2} H${endX}`}
                    className="stroke-gray-300"
                    strokeWidth="1"
                    fill="none"
                    shapeRendering={"crispEdges"}
                  />
                </g>
              );
            } else {
              const startX = match.match.round * HORIZONTAL_GAP;
              const startY = match.match.topCoord + HEIGHT / 2 + 1;

              const endX = (match.match.round - 1) * HORIZONTAL_GAP + WIDTH;
              const endY1 =
                prevMatches[match.match.order].match.topCoord + HEIGHT / 2 + 1;
              const endY2 =
                prevMatches[match.match.order].match.topCoord + HEIGHT / 2 + 1;

              return (
                <g key={`line-${match.match.round}-${match.match.order}`}>
                  <path
                    d={`M${startX} ${startY} H${startX - HEIGHT / 2} V${endY1} H${endX}`}
                    className="stroke-gray-300"
                    strokeWidth="1"
                    fill="none"
                    shapeRendering={"crispEdges"}
                  />
                  <path
                    d={`M${startX} ${startY} H${startX - HEIGHT / 2} V${endY2} H${endX}`}
                    className="stroke-gray-300"
                    strokeWidth="1"
                    fill="none"
                    shapeRendering={"crispEdges"}
                  />
                </g>
              );
            }
          })}
        </svg>
      </div>
    );
  }
};

export default DoubleElimBracket;

