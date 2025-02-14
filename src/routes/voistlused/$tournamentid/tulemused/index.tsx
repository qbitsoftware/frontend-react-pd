import { createFileRoute } from '@tanstack/react-router'
import { UseGetTournamentTables } from '@/queries/tables'
import { ErrorResponse } from '@/types/types'
import { parseTableType } from '@/lib/utils'
import { useTournament } from '../-components/tournament-provider'
import { formatDateTimeNew } from '@/lib/utils'
import {UsersRound} from 'lucide-react';
import { Link } from '@tanstack/react-router'


export const Route = createFileRoute('/voistlused/$tournamentid/tulemused/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    let tournament_tables
    try {
      tournament_tables = await queryClient.ensureQueryData(
        UseGetTournamentTables(Number(params.tournamentid)),
      )
    } catch (error) {
      const err = error as ErrorResponse
      if (err.response.status !== 404) {
        throw error
      }
    }
    return { tournament_tables }
  },
})

function RouteComponent() {
  // const { matches_data } = Route.useLoaderData()
  const { tournament_tables } = Route.useLoaderData()
  const tournament = useTournament();
  // const BracketComponent = (matches: BracketReponse) => {
  //   const tournament = useTournament()
  //   if (matches_data.data) {

  //   }
  // }
  console.log(tournament_tables)

  const startDate = formatDateTimeNew(tournament.start_date);

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
          <circle cx="6" cy="6" r="4.5" fill="#D2FFE7" stroke="#0C6351"/>
          <circle className='animate-pulse' cx="6" cy="6" r="2" fill="#029344"/>
        </svg>
        <span className='font-medium'>Live</span>
      </div>
    )
  }

  const stateComponents = {
    finished: <p>Finished</p>,
    live: <LiveIndicator/>,
    default: <p className='font-medium text-[#26314D]'>{startDate}</p>
  }


  return (
      <div className='w-full md:max-w-2xl mx-auto py-12'>
      <h2 className='font-semibold text-[#020817] border-b border-stone-100 pb-2 px-1'>Tabelid</h2>
        <ul className='py-4 flex flex-col gap-2'>
          {tournament_tables && tournament_tables.data ? tournament_tables.data.map((table) => (
            <Link href={`/voistlused/${tournament.id}/tulemused/${table.id}`}>
            <li  key={table.id} className='bg-white flex flex-row items-center justify-between border border-stone-100 pr-12 pl-6 py-4 rounded-sm shadow-scheduleCard cursor-pointer hover:bg-[#F9F9FB]'>
              
              <div className='flex flex-row items-center'>
              <div className='flex flex-row items-center gap-2 border border-stone-100 rounded-sm p-1'><UsersRound className='h-6 w-6'/><span className=' text-lg font-medium'>{table.participants.length}</span></div>
              <div className='px-6 flex flex-col'>
                <h3 className='text-xl font-medium'>{table.class}</h3>
                <span className=''>{parseTableType(table.type)}</span>
              </div>
              </div>
              {stateComponents[tournamentState()]}
            </li>
            </Link>
            ))  :
            <div>
              No tables created yet
            </div>
          }
        </ul>
    </div>
  )

{/*   return ( 
    <div className='w-full h-[75vh]'>
      <div className='h-full w-full mt-[20px] lg:mt-[60px]'>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tournament Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grupp</TableHead>
                  <TableHead>Osalejate arv/Tabeli suurus</TableHead>
                  <TableHead>Tabeli tüüp</TableHead>
                  <TableHead>Formaat</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {tournament_tables && tournament_tables.data ? tournament_tables.data.map((table) => (
                  <TableRow key={table.id} onClick={() => console.log("GOING")} className="cursor-pointer">
                    <TableCell className="font-medium">{table.class}</TableCell>
                    <TableCell><span className="font-semibold">{table.participants.length}</span>/{table.size}</TableCell>
                    <TableCell>{parseTableType(table.type)}</TableCell>
                    <TableCell>{table.solo ? 'Üksik' : 'Meeskondadega'}</TableCell>

                  </TableRow>
                ))
                  :
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No tables created yet
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>

         {matches_data.data ? (
          <Window data={matches_data.data} />
        ) : (
          <Card className="w-full">
              <CardContent className="p-6">
                <p className="text-center text-xl font-semibold">Tabelid Hetkel puuduvad</p>
              </CardContent>
            </Card>
        )} 
      </div>
    </div>
  )
} */}
}
