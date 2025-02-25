// src/components/tournament-tables.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import type { Tournament, TournamentTable } from "@/types/types"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { parseTableType } from "@/lib/utils"


interface TournamentTablesProps {
  tables: TournamentTable[] | null | undefined
  tournament: Tournament
}


export const TournamentTables: React.FC<TournamentTablesProps> = ({ tables }) => {
  const { tournamentid } = useParams({ strict: false })
  const navigate = useNavigate()
  return (
    <Card className="border-none shadow-none px-10">
      <CardHeader className="flex md:flex-row flex-col items-center gap-4 px-0">
        <CardTitle className="text-lg">Tournament Tables</CardTitle>
        <Link className="w-full md:w-auto flex justify-center items-center" to={`/admin/tournaments/${tournamentid}/grupid/uus`}>
          <Button className="w-full md:w-auto h-8">
            <Plus className="w-4 h-4 mr-2" />
            Lisa Uus
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-2">
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
            {tables ? tables.map((table) => (
              <TableRow key={table.id} onClick={() => (navigate({ to: `${table.id}` }))} className="cursor-pointer">
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
  )
}