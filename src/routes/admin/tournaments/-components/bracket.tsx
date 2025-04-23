import { Window } from "@/components/window";
import { BracketReponse } from "@/queries/tournaments";
import React, { useState } from "react";
import GroupStageBracket from "@/components/group-stage-bracket";
import { Button } from "@/components/ui/button";
import { PrintPDF } from "@/components/print-pdf";
import { Printer } from "lucide-react";
import { TournamentTable } from "@/types/groups";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface BracketComponentProps {
  bracket: BracketReponse;
  tournament_table: TournamentTable | null;
}

const BracketComponent: React.FC<BracketComponentProps> = ({
  bracket,
  tournament_table,
}) => {
  const { t } = useTranslation()
  if (!bracket.data || !tournament_table) {
    return <div>{t('admin.tournaments.groups.tables.no_data')}</div>;
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
    PrintPDF("bracket-container", title, true);
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
              className={`w-full md:w-auto bg-midnightTable transition-colors ${isEditingMode
                ? " bg-stone-700 border border-dashed"
                : ""
                }`}
            >
              {isEditingMode ? t('admin.tournaments.groups.tables.editing.exit') : t('admin.tournaments.groups.tables.editing.enter')}
            </Button>
            {isEditingMode && (
              <div className="text-xs text-gray-600">
                {selectedPlayer
                  ? t('admin.tournaments.groups.tables.editing.select_p2')
                  : t('admin.tournaments.groups.tables.editing.select_p1')}
              </div>
            )}
            <Button
              variant="outline"
              className="self-end"
              onClick={handlePrint}
            >
              <Printer className="mr-1 h-4 w-4" />
              {t('admin.tournaments.groups.tables.print')}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {hasEliminations ? (
              <Window data={bracket.data} tournament_table={tournament_table} toggleEditingMode={toggleEditingMode} isEditingMode={isEditingMode} setIsEditingMode={setIsEditingMode} selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} />
            ) : hasRoundRobins ? (
              <GroupStageBracket
                brackets={bracket.data.round_robins[0]}
                onMatchSelect={() => { }}
                name={tournament_table.class}
              />
            ) : (
              <div>{t('admin.tournaments.groups.tables.no_data')}</div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default BracketComponent;
