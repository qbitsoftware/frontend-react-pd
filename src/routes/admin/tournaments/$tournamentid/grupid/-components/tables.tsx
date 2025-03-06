// src/components/tournament-tables.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import type { Tournament, TournamentTable } from "@/types/types"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { parseTableType } from "@/lib/utils"
import { useTranslation } from "react-i18next"


interface TournamentTablesProps {
  tables: TournamentTable[] | null | undefined
  tournament: Tournament
}


export const TournamentTables: React.FC<TournamentTablesProps> = ({ tables }) => {
  const { tournamentid } = useParams({ strict: false })
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <Card className="border-none shadow-none px-10">
      <CardHeader className="flex md:flex-row flex-col items-center gap-4 px-0">
        <CardTitle className="text-lg">{t("admin.tournaments.groups.title")}</CardTitle>
        <Link className="w-full md:w-auto flex justify-center items-center" to={`/admin/tournaments/${tournamentid}/grupid/uus`}>
          <Button className="w-full md:w-auto h-8">
            <Plus className="w-4 h-4 mr-2" />
            {t("admin.tournaments.groups.add_new")}
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-2">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.tournaments.groups.table.group")}</TableHead>
              <TableHead>{t("admin.tournaments.groups.table.number_and_team_size")}</TableHead>
              <TableHead>{t("admin.tournaments.groups.table.type")}</TableHead>
              <TableHead>{t("admin.tournaments.groups.table.format")}</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {tables ? tables.map((table) => (
              <TableRow key={table.id} onClick={() => (navigate({ to: `${table.id}` }))} className="cursor-pointer h-[100px] sm:h-[40px]">
                <TableCell className="font-medium">{table.class}</TableCell>
                <TableCell><span className="font-semibold">{table.participants.length}</span>/{table.size}</TableCell>
                <TableCell className="truncate">{parseTableType(table.type)}</TableCell>
                <TableCell>{table.solo ? 'Üksik' : 'Meeskondadega'}</TableCell>

              </TableRow>
            ))
              :
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  {t("admin.tournaments.groups.no_tables")}
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}