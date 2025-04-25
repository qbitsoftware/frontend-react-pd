import React, { useEffect, useState } from "react";
import { TableMatch } from "@/types/brackets";
import { useLocation, useParams } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { TournamentTable } from "@/types/groups";
import { GroupType } from "@/types/matches";

interface MatchComponentProps {
  match: TableMatch;
  tournament_table: TournamentTable
  index: number;
  HEIGHT: number;
  WIDTH: number;
  HORIZONTAL_GAP: number;
  topCoord: number;
  starting_y: number;
  starting_x: number;
  isEditingMode?: boolean;
  selectedPlayer?: {
    matchId: string | number;
    playerId: string | number;
    position: "home" | "away";
  } | null;
  onPlayerSelect?: (
    matchId: string,
    playerId: string,
    position: "home" | "away",
  ) => void;
}

const setScore = (match: TableMatch | undefined) => {
  let p1_sets = 0;
  let p2_sets = 0;

  if (match && match.match.extra_data.score) {
    match.match.extra_data.score.forEach((set) => {
      const player1Points = set.p1_score;
      const player2Points = set.p2_score;

      if (player1Points >= 11 && player1Points - player2Points >= 2) {
        p1_sets++;
      } else if (player2Points >= 11 && player2Points - player1Points >= 2) {
        p2_sets++;
      }
    });
  } else if (
    match &&
    (match.match.extra_data.team_1_total || match.match.extra_data.team_2_total)
  ) {
    p1_sets = match.match.extra_data.team_1_total || 0;
    p2_sets = match.match.extra_data.team_2_total || 0;
  }

  return { p1_sets, p2_sets };
};

const MatchComponent: React.FC<MatchComponentProps> = ({
  match,
  index,
  HEIGHT,
  HORIZONTAL_GAP,
  topCoord,
  starting_y,
  starting_x,
  WIDTH,
  tournament_table,
  isEditingMode = false,
  selectedPlayer = null,
  onPlayerSelect = () => { },
}) => {
  const isHomeSelected =
    selectedPlayer &&
    selectedPlayer.matchId === match.match.id &&
    selectedPlayer.playerId === match.participant_1.id &&
    selectedPlayer.position === "home";

  const isAwaySelected =
    selectedPlayer &&
    selectedPlayer.matchId === match.match.id &&
    selectedPlayer.playerId === match.participant_2.id &&
    selectedPlayer.position === "away";

  const handlePlayerClick = (playerId: string, position: "home" | "away") => {
    if (isEditingMode && onPlayerSelect) {
      onPlayerSelect(match.match.id, playerId, position);
    }
  };

  const firstRound = match.match.round == 0;

  const { tournamentid } = useParams({ strict: false });

  const location = useLocation();
  const [isDisabled, setIsDisabled] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (location.pathname.includes("admin")) {
      setIsDisabled(false);
    }
  }, [location]);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  void isOpen, isOpen2, tournamentid;

  const { p1_sets, p2_sets } = setScore(match);

  return (
    <div key={index}>
      <div
        key={match.match.id}
        style={{
          top: `${topCoord + starting_y + 30}px`,
          left: `${match.match.round * HORIZONTAL_GAP + starting_x}px`,
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
        }}
        onClick={() =>
          !isDisabled &&
          (match.match.table_type == "champions_league"
            ? setIsOpen2(true)
            : setIsOpen(true))
        }
        className={`pdf-participant-box absolute flex flex-col ${firstRound ? "z-30" : "z-10"} bg-white text-sm`}
      >
        {match.participant_1.id != "empty" &&
          match.participant_2.id != "empty" && (
            <div className="absolute top-[-20px] w-[60px] text-left text-[10px] pdf-game-court">
              {t("admin.tournaments.matches.table.table")}{" "}
              {match.match.extra_data.table}
            </div>
          )}
        {match.participant_1.id != "empty" &&
          match.participant_2.id != "empty" && (
            <div className="absolute left-[0px] text-right top-[-20px] w-[100px] text-[10px]">
              {match.match.bracket}
            </div>
          )}
        <div
          style={{ height: `${HEIGHT / 2}px` }}
          className={cn("flex items-center ")}
        >
          {/* 3 different layouts, one for byeybe, another for regular player and another for empty player */}
          {match.participant_1.id == "empty" ? (
            <>
              <div className="text-center px-2">{""}</div>
              <div className="w-full text-gray-500 pdf-participant">(Bye)</div>
              <div className="text-right pr-4">{""}</div>
            </>
          ) : match.participant_1.id === "" ? (
            <div></div>
          ) : (
            <div
              className={cn(
                "flex w-full",
                isHomeSelected ? "bg-blue-100 border-blue-500" : "",
                isEditingMode && firstRound
                  ? "cursor-pointer hover:bg-blue-200"
                  : "",
              )}
              onClick={() =>
                match.participant_1.id &&
                firstRound &&
                handlePlayerClick(match.participant_1.id, "home")
              }
            >
              {isEditingMode && match.participant_1.id && firstRound && (
                <span className="ml-1 text-xs text-blue-500">
                  {isHomeSelected ? "✓" : ""}
                </span>
              )}
              <div className="text-center font-medium px-2 w-[35px]">{tournament_table.type !== GroupType.CHAMPIONS_LEAGUE && match.match.type == "winner" && firstRound && match.participant_1.order}</div>
              <div
                className={cn(
                  "text-[12px] overflow-ellipsis overflow-hidden whitespace-nowrap pr-2 w-full text-[#575757] font-bold pdf-participant",
                  match.match.winner_id == match.participant_1.id ||
                    match.participant_2.id == "empty"
                    ? ""
                    : "font-medium",
                )}
              >
                {match.participant_1.name}
              </div>
              {/* If another player is byebye, don't show score, but only - */}
              <div
                className={cn(
                  "w-[50px]  items-center flex justify-center h-full font-semibold",
                  p1_sets > p2_sets
                    ? "bg-[#F3F9FC]"
                    : p1_sets < p2_sets
                      ? ""
                      : "",
                )}
              >
                {match.participant_2.id == "empty" ? "" : p1_sets}
              </div>
            </div>
          )}
        </div>

        {/* <Separator className="bg-gray-300" /> */}
        <div
          style={{ height: `${HEIGHT / 2}px` }}
          className={cn("flex items-center")}
        >
          {/* 3 different layouts, one for byeybe, another for regular player and another for empty player */}
          {match.participant_2.id == "empty" ? (
            <>
              <div className="text-center px-2">{""}</div>
              <div className="w-full text-gray-500 pdf-participant">(Bye)</div>
              <div className="text-right pr-4">{""}</div>
            </>
          ) : match.participant_2.id === "" ? (
            <div></div>
          ) : (
            <div
              className={cn(
                "flex w-full",
                isAwaySelected ? "bg-blue-100 border-blue-500 " : "",
                isEditingMode && firstRound
                  ? "cursor-pointer hover:bg-blue-200"
                  : "",
              )}
              onClick={() =>
                match.participant_2.id &&
                firstRound &&
                handlePlayerClick(match.participant_2.id, "away")
              }
            >
              {isEditingMode && match.participant_2.id && firstRound && (
                <span className="ml-1 text-xs text-blue-500">
                  {isAwaySelected ? "✓" : ""}
                </span>
              )}
              <div className="text-center font-medium px-2 w-[35px]">{tournament_table.type !== GroupType.CHAMPIONS_LEAGUE && match.match.type == "winner" && firstRound && match.participant_2.order}</div>
              <div
                className={cn(
                  "text-[12px] overflow-ellipsis overflow-hidden whitespace-nowrap pr-2 w-full  text-[#575757] font-bold pdf-participant",
                  match.match.winner_id == match.participant_2.id ||
                    match.participant_1.id == "empty"
                    ? ""
                    : "font-medium",
                )}
              >
                {match.participant_2.name}
              </div>
              {/* If another player is byebye, don't show score, but only - */}
              <div
                className={cn(
                  "w-[50px] items-center flex justify-center h-full font-semibold",
                  p1_sets < p2_sets
                    ? "bg-[#F3F9FC]"
                    : p1_sets > p2_sets
                      ? ""
                      : "",
                )}
              >
                {match.participant_1.id == "empty" ? "" : p2_sets}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* {match.match.table_type == "champions_league"
                ? <TableTennisProtocolModal isOpen={isOpen2} onClose={() => { setIsOpen2(false) }} match={{ match: match.match, p1: match.participant_1, p2: match.participant_2, class: "" }} tournament_id={Number(tournamentid)} />
                : <MatchDialog match={{ match: match.match, p1: match.participant_1, p2: match.participant_2, class: "" }} tournament_id={Number(tournamentid)} open={isOpen} onClose={() => setIsOpen(false)} />
            } */}
    </div>
    // <div
    //     className="absolute transition-all"
    //     style={{
    //         width: WIDTH,
    //         height: HEIGHT,
    //         top: `${starting_y + topCoord}px`,
    //         left: `${starting_x + match.match.round * HORIZONTAL_GAP}px`,
    //     }}
    // >
    //     <div className="w-full h-full flex flex-col border rounded overflow-hidden shadow-sm">
    //         {/* Home player */}
    //         <div
    //             className={`w-full h-1/2 flex items-center px-2 border-b ${isEditingMode ? "cursor-pointer" : ""
    //                 } ${isHomeSelected ? "bg-blue-100 border-blue-500" : "bg-white"
    //                 }`}
    //             onClick={() => match.participant_1.id && handlePlayerClick(match.participant_1.id, "home")}
    //         >
    //             <div className="truncate text-sm">
    //                 {match.participant_1.name || "TBD"}
    //                 {isEditingMode && match.participant_1.id && (
    //                     <span className="ml-1 text-xs text-blue-500">
    //                         {isHomeSelected ? "✓" : ""}
    //                     </span>
    //                 )}
    //             </div>
    //             <div className="ml-auto">{p1_sets}</div>
    //         </div>

    //         {/* Away player */}
    //         <div
    //             className={`w-full h-1/2 flex items-center px-2 ${isEditingMode ? "cursor-pointer" : ""
    //                 } ${isAwaySelected ? "bg-blue-100 border-blue-500" : "bg-white"
    //                 }`}
    //             onClick={() => match.participant_2.id && handlePlayerClick(match.participant_2.id, "away")}
    //         >
    //             <div className="truncate text-sm">
    //                 {match.participant_2.name || "TBD"}
    //                 {isEditingMode && match.participant_2.id && (
    //                     <span className="ml-1 text-xs text-blue-500">
    //                         {isAwaySelected ? "✓" : ""}
    //                     </span>
    //                 )}
    //             </div>
    //             <div className="ml-auto">{p2_sets}</div>
    //         </div>
    //     </div>
    // </div>
  );
};

export default MatchComponent;
