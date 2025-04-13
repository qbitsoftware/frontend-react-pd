import { Window } from '@/components/window'
import { BracketReponse } from '@/queries/tournaments'
import React from 'react'
import GroupStageBracket from "@/components/group-stage-bracket";
import { Button } from '@/components/ui/button';
import { PrintPDF } from '@/components/print-pdf';
import { Printer } from 'lucide-react';
import { TournamentTable } from '@/types/groups';

interface BracketComponentProps {
  bracket: BracketReponse
  tournament_table: TournamentTable | null
}

const BracketComponent: React.FC<BracketComponentProps> = ({ bracket, tournament_table }) => {
  if (!bracket.data || !tournament_table) {
    return <div>No bracket data available</div>
  }
  
  const hasEliminations = Array.isArray(bracket.data.eliminations) && bracket.data.eliminations.length > 0
  const hasRoundRobins = Array.isArray(bracket.data.round_robins) && bracket.data.round_robins.length > 0
  
  const handlePrint = () => {
    const title = tournament_table ? `${tournament_table.class} Tournament` : 'Tournament Bracket';
    PrintPDF('bracket-container', title);
  };
  
  return (
    <div className='w-full h-full'>
      <Button onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        Print Bracket
      </Button>
      <div id="bracket-container">
        {hasEliminations ? (
          <Window data={bracket.data} tournament_table={tournament_table} />
        ) : hasRoundRobins ? (
          <GroupStageBracket
            brackets={bracket.data.round_robins[0]}
            onMatchSelect={() => { }}
            name={tournament_table.class}
          />
        ) : (
          <div>No elimination or round robin data available</div>
        )}
      </div>
    </div>
  )
}

export default BracketComponent