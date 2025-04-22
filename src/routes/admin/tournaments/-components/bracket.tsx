import { Window } from "@/components/window";
import { BracketReponse } from "@/queries/tournaments";
import React, { useState } from "react";
import GroupStageBracket from "@/components/group-stage-bracket";
import { Button } from "@/components/ui/button";
import { PrintPDF } from "@/components/print-pdf";
import { Printer } from "lucide-react";
import { TournamentTable } from "@/types/groups";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface BracketComponentProps {
  bracket: BracketReponse;
  tournament_table: TournamentTable | null;
}

const BracketComponent: React.FC<BracketComponentProps> = ({
  bracket,
  tournament_table,
}) => {
  if (!bracket.data || !tournament_table) {
    return <div>No bracket data available</div>;
  }

  const hasEliminations =
    Array.isArray(bracket.data.eliminations) &&
    bracket.data.eliminations.length > 0;
  const hasRoundRobins =
    Array.isArray(bracket.data.round_robins) &&
    bracket.data.round_robins.length > 0;

  const handlePrint = () => {
    const title = tournament_table
      ? `${tournament_table.class} Tournament`
      : "Tournament Bracket";
    PrintPDF("bracket-container", title);
  };

  const [isEditingMode, setIsEditingMode] = useState(false);

  const toggleEditingMode = () => {
    setIsEditingMode(!isEditingMode);
    setSelectedPlayer(null);
  };

  const [selectedPlayer, setSelectedPlayer] = useState<{
      matchId: string;
      playerId: string;
      position: "home" | "away";
    } | null>(null);


  return (
    <div className="w-full h-full">
      <Card className="border-stone-100">
        <div id="bracket-container" className="flex flex-col">
          <CardHeader className="flex-col-reverse md:flex-row gap-4 justify-between items-start md:items-center space-y-0">
          <Button
              onClick={toggleEditingMode}
              className={`w-full md:w-auto px-3 py-1 text-xs rounded transition-colors ${isEditingMode
                ? " bg-stone-700 border border-dashed"
                : ""
                }`}
            >
              {isEditingMode ? "Exit Editing Mode" : "Enter Editing Mode"}
            </Button>
            {isEditingMode && (
              <div className="text-xs text-gray-600">
                {selectedPlayer
                  ? "Select second player to switch"
                  : "Select first player"}
              </div>
            )}
            <Button
              variant="outline"
              className="self-end"
              onClick={handlePrint}
            >
              <Printer className="mr-1 h-4 w-4" />
              Print Bracket
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {hasEliminations ? (
              <Window data={bracket.data} tournament_table={tournament_table} toggleEditingMode={toggleEditingMode} isEditingMode={isEditingMode} setIsEditingMode={setIsEditingMode} selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer}/>
            ) : hasRoundRobins ? (
              <GroupStageBracket
                brackets={bracket.data.round_robins[0]}
                onMatchSelect={() => {}}
                name={tournament_table.class}
              />
            ) : (
              <div>No elimination or round robin data available</div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default BracketComponent;
