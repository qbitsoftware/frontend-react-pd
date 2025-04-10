import { Window } from '@/components/window'
import { BracketReponse } from '@/queries/tournaments'
import { TournamentTable } from '@/types/types'
import React from 'react'
import GroupStageBracket from "@/components/group-stage-bracket";

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

  return (
    <div className='w-full h-full'>
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
  )
}

export default BracketComponent