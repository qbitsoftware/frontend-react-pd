import { createFileRoute } from '@tanstack/react-router'
import { UseStartTournament } from '@/queries/tournaments'
import { useEffect, useState } from 'react'
import { Bracket } from '@/types/types'
import { Window } from '../../components/window'
export const Route = createFileRoute('/tere/')({
  component: RouteComponent,

})

function RouteComponent() {
  const tournamentMutation = UseStartTournament(1)
  const [data, setData] = useState<Bracket[]>([])

  useEffect(() => {
    const fetch = async () => {
      const data = await tournamentMutation.mutateAsync(false)
      if (data.data) {
        setData(data.data)
      }
    }
    fetch()
  }, [])
  if (data && data.length > 1) {
    return (
      <div className='w-screen h-screen'>
        <div className='h-[90vh] w-[90vw] mx-auto'>
          <Window data={data} />
        </div>
      </div>
    )
  } else {
    return <div>Somethign wvery bad</div>
  }
}
