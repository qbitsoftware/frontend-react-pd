import { Window } from '@/components/window'
import { BracketReponse } from '@/queries/tournaments'
import { Bracket } from '@/types/types'
import React, { useEffect } from 'react'

interface BracketComponentProps {
  bracket: BracketReponse
}

const BracketComponent: React.FC<BracketComponentProps> = ({ bracket }) => {
  return (
    <div className='w-full h-full'>
      {bracket.data ?
        <Window data={bracket.data} />
        : <div></div>
      }
    </div>
  )
}

export default BracketComponent