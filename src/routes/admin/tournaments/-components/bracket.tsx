import { Window } from '@/components/window'
import { BracketReponse } from '@/queries/tournaments'
import { TournamentTable } from '@/types/types'
import React from 'react'

interface BracketComponentProps {
  bracket: BracketReponse
  tournament_table: TournamentTable | null
}

const BracketComponent: React.FC<BracketComponentProps> = ({ bracket, tournament_table }) => {
  return (
    <div className='w-full h-full'>
      {bracket.data && tournament_table ?
        <Window data={bracket.data} tournament_table={tournament_table}/>
        : <div></div>
      }
    </div>
  )
}

export default BracketComponent