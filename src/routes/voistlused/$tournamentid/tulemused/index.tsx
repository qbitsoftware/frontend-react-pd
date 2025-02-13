import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { UseGetTournamentTables } from '@/queries/tables'
import { ErrorResponse } from '@/types/types'
import { parseTableType } from '@/lib/utils'

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
  // const BracketComponent = (matches: BracketReponse) => {
  //   const tournament = useTournament()
  //   if (matches_data.data) {

  //   }
  // }

  return (
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

        {/* {matches_data.data ? (
          <Window data={matches_data.data} />
        ) : (
          <Card className="w-full">
              <CardContent className="p-6">
                <p className="text-center text-xl font-semibold">Tabelid Hetkel puuduvad</p>
              </CardContent>
            </Card>
        )} */}
      </div>
    </div>
  )
}


