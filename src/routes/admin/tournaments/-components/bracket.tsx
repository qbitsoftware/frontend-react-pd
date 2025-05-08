import { BracketReponse } from "@/queries/tournaments";
import React from "react";
import GroupStageBracket from "@/components/group-stage-bracket";
import { Button } from "@/components/ui/button";
import { PrintPDF } from "@/components/print-pdf";
import { Printer } from "lucide-react";
import { TournamentTable } from "@/types/groups";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { EliminationBrackets } from "@/components/window2";

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

  return (
    <div className="w-full h-full">
      <Card className="border-stone-100">
        <div id="bracket-container" className="flex flex-col">
          <CardContent className="p-0">
            {hasEliminations ? (
              <EliminationBrackets
                data={bracket.data}
                tournament_table={tournament_table} />
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
