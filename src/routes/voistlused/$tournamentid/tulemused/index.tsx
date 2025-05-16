import { createFileRoute } from '@tanstack/react-router'
import { UseGetTournamentTables } from '@/queries/tables'
import { parseTableType } from '@/lib/utils'
import { useTournament } from '../-components/tournament-provider'
import { formatDateString } from '@/lib/utils'
import { UsersRound } from 'lucide-react';
import { Link } from '@tanstack/react-router'
import ErrorPage from '@/components/error'
import { useTranslation } from 'react-i18next'
import { ErrorResponse } from '@/types/errors'


export const Route = createFileRoute('/voistlused/$tournamentid/tulemused/')({
  component: RouteComponent,
  errorComponent: () => <ErrorPage />,
  loader: async ({ context: { queryClient }, params }) => {
    let tournament_tables = null;
    try {
      tournament_tables = await queryClient.ensureQueryData(
        UseGetTournamentTables(Number(params.tournamentid)),
      )
      return { tournament_tables }
    } catch (error) {
      const err = error as ErrorResponse
      if (err.response?.status === 404) {
        return { tournament_tables: null }
      }
      throw error
    }
  },
})

function RouteComponent() {
  const { tournament_tables } = Route.useLoaderData()
  const tournament = useTournament();
  const { t } = useTranslation()
  const startDate = formatDateString(tournament.start_date);

  const tournamentState = () => {
    const now = new Date()
    const start = new Date(tournament.start_date)
    const end = new Date(tournament.end_date)

    if (now > end) {
      return "finished";
    } else if (now >= start && now <= end) {
      return "live"
    } else {
      return "default"
    }
  }

  const LiveIndicator = () => {
    return (
      <div className='flex items-center gap-2'>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="4.5" fill="#D2FFE7" stroke="#0C6351" />
          <circle className='animate-pulse' cx="6" cy="6" r="2" fill="#029344" />
        </svg>
        <span className='font-medium'>Live</span>
      </div>
    )
  }

  const stateComponents = {
    finished: <p>{t('competitions.results.finished')}</p>,
    live: <LiveIndicator />,
    default: <p className='font-medium text-[#26314D]'>{startDate}</p>
  }

  const tablesWithParticipants = tournament_tables?.data?.filter(table =>
    table.participants && table.participants.length > 0
  ) || [];


  const hasTableWithParticipants = tablesWithParticipants.length > 0;


  return (
    <>
      {hasTableWithParticipants ? (
        <div className='mx-auto px-4 md:px-12 py-4 md:py-8'>
          <h5 className='font-bold mb-4 md:mb-8 text-center md:text-left'>{t('competitions.navbar.results')}</h5>
          <ul className='pb-8 flex flex-col gap-2'>
            {tablesWithParticipants.map((table) => (
              <Link key={table.id} href={`/voistlused/${tournament.id}/tulemused/${table.id}`} className="md:w-2/3">
                <li className=' bg-white flex flex-row items-center justify-between border border-stone-100 px-4 md:pr-12 md:pl-6 py-4 rounded-sm shadow-scheduleCard cursor-pointer hover:bg-[#F9F9FB]'>
                  <div className='flex flex-row items-center'>
                    <div className='flex flex-row items-center gap-2 border border-stone-100 rounded-sm p-1'>
                      <UsersRound className='h-4 w-4 md:h-6 md:w-6' />
                      <span className='md:text-lg font-medium'>{table.participants.length}</span>
                    </div>
                    <div className='px-6 flex flex-col'>
                      <h3 className='text-base md:text-xl font-medium'>{table.class}</h3>
                      <span className='hidden md:block'>{parseTableType(table.type)}</span>
                    </div>
                  </div>
                  {stateComponents[tournamentState()]}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-6 text-center rounded-sm">
          <p className="text-stone-500">{t('competitions.errors.no_groups')}</p>
        </div>
      )}
    </>
  )
}
