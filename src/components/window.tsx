import { useState, useRef } from "react";
import SingleElimBracket from "./single_elim";
import DoubleElimBracket from "./double_elim";
import { CalculateSVGHeight, parseTableType } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { TournamentTable } from "@/types/groups";
import { Bracket, PlayerSwitch } from "@/types/brackets";
import { UsePostPlayerSwitch } from "@/queries/brackets";

interface WindowProps {
  data: Bracket;
  tournament_table: TournamentTable;
  toggleEditingMode?: () => void;
  isEditingMode?: boolean;
  setIsEditingMode?: (edit: boolean) => void;
  selectedPlayer?: {
    matchId: string;
    playerId: string;
    position: "home" | "away";
  } | null;
  setSelectedPlayer?: React.Dispatch<
    React.SetStateAction<{
      matchId: string;
      playerId: string;
      position: "home" | "away";
    } | null>
  >;
}

export const Window: React.FC<WindowProps> = ({
  data,
  tournament_table,
  isEditingMode,
  selectedPlayer,
  setSelectedPlayer,
}) => {
  const [bracket, setBracket] = useState(0);
  const bracketRef = useRef<HTMLDivElement | null>(null);
  const usePostPlayerSwitchMutation = UsePostPlayerSwitch(
    tournament_table.tournament_id,
    tournament_table.id,
  );

  const handlePlayerSelect = async (
    matchId: string,
    playerId: string,
    position: "home" | "away",
  ) => {
    if (!isEditingMode) return;

    if (!selectedPlayer) {
      // Add null check before calling setSelectedPlayer
      if (setSelectedPlayer) {
        setSelectedPlayer({ matchId, playerId, position });
      }
    } else {
      if (
        selectedPlayer.matchId === matchId &&
        selectedPlayer.playerId === playerId
      ) {
        // Add null check before calling setSelectedPlayer
        if (setSelectedPlayer) {
          setSelectedPlayer(null);
        }
        return;
      }
      const data: PlayerSwitch = {
        match_1_id: selectedPlayer.matchId,
        match_2_id: matchId,
        participant_1_id: selectedPlayer.playerId,
        participant_1_position: selectedPlayer.position,
        participant_2_id: playerId,
        participant_2_position: position,
      };
      try {
        await usePostPlayerSwitchMutation.mutateAsync(data);
      } catch (error) {
        void error;
      }
      // Add null check before calling setSelectedPlayer
      if (setSelectedPlayer) {
        setSelectedPlayer(null);
      }
    }
  };

  const renderBracket = () => {
    let previousTop: number = 0;

    return (
      <div className="mt-0 h-screen" key={"test"}>
        {/* {data.eliminations.map((elimination, index1) => {
          return (
            <>
              {elimination.elimination.map((table, index) => {
                if (index1 !== 0 && index1 >= 1) {
                  previousTop += CalculateSVGHeight(
                    table.matches,
                    140,
                    40,
                  );
                }
                if (table.name === "Miinusring") {
                  return (
                    <div className="xl:pt-24" key={index}>
                      <DoubleElimBracket
                        tournament_table={tournament_table}
                        key={index}
                        starting_x={0}
                        starting_y={previousTop}
                        data={table}
                        index={index}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="" key={index}>
                      <SingleElimBracket
                        tournament_table={tournament_table}
                        key={index}
                        starting_x={0}
                        starting_y={previousTop}
                        data={table}
                        isEditingMode={isEditingMode}
                        selectedPlayer={selectedPlayer}
                        onPlayerSelect={handlePlayerSelect}
                      />
                    </div>
                  );
                }
              })}
            </>
          )
        })} */}
        {data.eliminations[bracket].elimination.map((table, index) => {
          if (index !== 0 && index >= 1) {
            previousTop += CalculateSVGHeight(
              data.eliminations[bracket].elimination[index - 1].matches,
              45,
              50,
            );
          }

          if (table.name === "Miinusring") {
            return (
              <div className="xl:pt-24" key={index}>
                <DoubleElimBracket
                  tournament_table={tournament_table}
                  key={index}
                  starting_x={0}
                  starting_y={previousTop}
                  data={table}
                  index={index}
                />
              </div>
            );
          } else {
            return (
              <div className="" key={index}>
                <SingleElimBracket
                  tournament_table={tournament_table}
                  key={index}
                  starting_x={0}
                  starting_y={previousTop}
                  data={table}
                  isEditingMode={isEditingMode}
                  selectedPlayer={selectedPlayer}
                  onPlayerSelect={handlePlayerSelect}
                />
              </div>
            );
          }
        })}
      </div>
    );
  };
  return (
    <div className="flex flex-col w-full h-full mx-auto relative">
      <div className=" z-40 top-0 w-full flex xl:justify-end ">
        <div className=" px-4 flex flex-col w-full bg-[#F8F9FA] rounded-t pdf-background">
          <div className="flex justify-between mt-2 items-center"></div>
          <div className="flex justify-between z-10">
            <h1 className="text-base font-medium">{tournament_table.class}</h1>
            <p
              className="text-xs underline cursor-pointer"
              onClick={() => console.log()}
            >
              {/* Download */}
            </p>
          </div>
          <div className="z-10 pdf-remove-in-print">
            <h2 className="pdf-remove-in-print text-xs">
              {parseTableType(tournament_table.type)}
            </h2>
          </div>
          <Separator className="my-1 z-10" />
          <Tabs
            defaultValue={data?.eliminations[0]?.elimination[0].name}
            className="z-10"
          >
            <TabsList className="flex w-full justify-start gap-6 px-0 text-black bg-transparent overflow-x-auto">
              {data.eliminations.map((item, index) => (
                <TabsTrigger
                  key={index}
                  value={item.elimination[0].name}
                  className="px-0 text-sm data-[state=active]:underline data-[state=active]:bg-transparent data-[state=active]:text-gray-500 data-[state=active]:shadow-none data-[state=active]:border-none bg-transparent"
                  onClick={() => setBracket(index)}
                >
                  {item.elimination[0].name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div
        className="w-full h-full px-4 overflow-auto bg-[#F8F9FA] pdf-background"
        ref={bracketRef}
      >
        {renderBracket()}
      </div>
    </div>
  );
};
