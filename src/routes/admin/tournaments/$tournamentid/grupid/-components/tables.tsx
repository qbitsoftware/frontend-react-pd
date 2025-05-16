// src/components/tournament-tables.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { parseTableType } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { TournamentTable } from "@/types/groups"
import { Tournament } from "@/types/tournaments"
import { GroupType } from "@/types/matches"


interface TournamentTablesProps {
  tables: TournamentTable[] | null | undefined
  tournament: Tournament
}


export const TournamentTables: React.FC<TournamentTablesProps> = ({ tables }) => {
  const { tournamentid } = useParams({ strict: false })
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardHeader className="px-0 flex-col gap-4 md:gap-0 md:flex-row md:justify-between items-start md:items-center space-y-0">
        <h5 className="font-medium">
          {t("admin.tournaments.groups.title")}
        </h5>
        <Link className="mt-0 mb-0" to={`/admin/tournaments/${tournamentid}/grupid/uus`}>
          <Button className="w-full md:w-auto ">
            <Plus className="w-4 h-4 mr-1" />
            {t("admin.tournaments.groups.add_new")}
          </Button>
        </Link>

      </CardHeader>
      <CardContent className="px-0 md:px-2">
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
            {tables ? tables.map((table) => {
              let participants = table.participants.length
              if (table.type === GroupType.ROUND_ROBIN || table.type === GroupType.ROUND_ROBIN_FULL_PLACEMENT) {
                participants = table.participants.filter((participant) => participant.type === "round_robin").length

              }
              return (
                <TableRow key={table.id} onClick={() => (navigate({ to: `${table.id}` }))} className="cursor-pointer h-[100px] sm:h-[40px]">
                  <TableCell className="font-medium">{table.class}</TableCell>
                  <TableCell><span className="font-semibold">{participants}</span>/{table.size}</TableCell>
                  <TableCell className="truncate">{parseTableType(table.type)}</TableCell>
                  <TableCell>{table.solo ? t('admin.tournaments.groups.solo') : t('admin.tournaments.groups.team')}</TableCell>

                </TableRow>
              )
            })
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