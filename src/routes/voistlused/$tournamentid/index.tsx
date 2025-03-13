import { createFileRoute } from '@tanstack/react-router'
import ErrorPage from '../../../components/error'
import {
  formatDateString,
} from '@/lib/utils'
import { useTournament } from './-components/tournament-provider'
import Editor from '@/routes/admin/-components/yooptaeditor'
import { useState } from 'react'
import { YooptaContentValue } from '@yoopta/editor'

export const Route = createFileRoute('/voistlused/$tournamentid/')({
  errorComponent: () => {
    return <ErrorPage />
  },
  component: RouteComponent,
})

function RouteComponent() {
  const tournament = useTournament()
  const [value, setValue] = useState<YooptaContentValue | undefined>(JSON.parse(tournament.information))
  console.log(tournament)

  return (
    <div className="px-2 md:px-12 py-4 md:py-8">
      <h5 className="font-bold mb-4 md:mb-8 text-center md:text-left">Info</h5>
      <div className="pb-8 overflow-y-auto flex flex-col items-start justify-center md:flex-row md:space-x-12 md:min-h-[75vh]">
        {tournament ? (
          <>
            <div className="w-full md:w-1/3 flex flex-col space-y-1 p-3 md:p-6 shadow-sm border border-[#EBEFF5] rounded-[10px] mb-4 md:mb-0">
              <p>
                Kategooria: <strong>{tournament.category}</strong>
              </p>
              <p>
                Kuupäevad:{' '}
                <strong>
                  {formatDateString(tournament.start_date)} -{' '}
                  {formatDateString(tournament.end_date)}
                </strong>
              </p>
              <p>
                Toimumiskoht: <strong>{tournament.location}</strong>
              </p>
              <p>
                Tabeleid: <strong>{tournament.total_tables}</strong>
              </p>
            </div>

            {tournament.information &&
              <div className="w-full md:w-2/3">
                <h6 className="font-medium">Lisainfo:</h6>
                <Editor value={value} setValue={setValue} readOnly />
              </div>
            }


          </>) : <div>Turniiri info puudub</div>}

      </div>
    </div>
  )
}
