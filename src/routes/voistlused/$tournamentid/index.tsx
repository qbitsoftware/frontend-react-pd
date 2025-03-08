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
  errorComponent: ({ error, reset }) => {
    return <ErrorPage error={error} reset={reset} />
  },
  component: RouteComponent,
})

function RouteComponent() {
  const tournament = useTournament()
  const [value, setValue] = useState<YooptaContentValue | undefined>(JSON.parse(tournament.information))

  return (
    <div className="overflow-y-auto flex flex-col items-start justify-center md:flex-row py-12 px-12 md:space-x-12 min-h-[75vh]">
      <div className="w-full md:w-1/2 flex flex-col space-y-1 p-3 border border-[#F1EEEE] rounded-[6px] mb-4 md:mb-0">
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
          Peakohtunik: <strong>Heino Mülgas</strong>
          <span className="rounded-[6px] border border-[#EAEDEC] px-2 py-1 ml-4">
            Kontakt
          </span>
        </p>
        <p>
          Tabeleid: <strong>{tournament.total_tables}</strong>
        </p>
      </div>
      <div className="w-full md:w-1/2">
        <h6 className="font-medium">Lisainfo:</h6>
        <Editor value={value} setValue={setValue} readOnly />
      </div>
    </div>
  )
}
