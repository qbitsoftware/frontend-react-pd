import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { UseGetTournamentQuery } from "@/queries/tournaments"
import { useParams } from "@tanstack/react-router"
import { UseGetMatchesQuery, UsePatchMatch } from "@/queries/match"
import { useToast } from "@/hooks/use-toast"
import { useToastNotification } from "@/components/toast-notification"
import { Match } from "@/types/types"

interface TableNumberFormProps {
  match: Match
  initialTableNumber: number
}

export function TableNumberForm({ match, initialTableNumber }: TableNumberFormProps) {
  const [tableNumber, setTableNumber] = useState(initialTableNumber)
  const toast = useToast()
  const { successToast, errorToast } = useToastNotification(toast)

  const params = useParams({ strict: false })
  const { data: tournament_data, isLoading: isTournamentLoading } = UseGetTournamentQuery(Number(params.tournamentid))
  const { data: match_data, isLoading: isMatchLoading } = UseGetMatchesQuery(Number(params.tournamentid), match.tournament_table_id)
  const matchMutation = UsePatchMatch(Number(params.tournamentid), match.tournament_table_id, match.id)

  const handleChange = async (value: string) => {
    const newTableNumber = Number(value)
    setTableNumber(newTableNumber)
    try {
      const data: Match = { ...match, extra_data: { ...match.extra_data, table: newTableNumber } }
      const res = await matchMutation.mutateAsync(data)
      successToast(res.message)
    } catch (error) {
      void error
      errorToast("Lauanumbri muutmine ebaõnnestus")
    }
  }

  if (isTournamentLoading || isMatchLoading) {
    return <div></div>
  }

  if (!tournament_data?.data || !match_data?.data) {
    return <div>0</div>
  }

  const totalTables = tournament_data.data.total_tables || 20

  const occupiedTables = match_data?.data
    .map((match) => match.match.extra_data.table)
    .filter((table) => table !== null) as number[]

  const allTables = Array.from({ length: totalTables }, (_, i) => i + 1)

  const availableTables = allTables.filter((table) => !occupiedTables.includes(table))

  return (
    <div>
      <Select value={String(tableNumber)} onValueChange={handleChange}>
        <SelectTrigger>
          <span>{tableNumber}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="min-h-[30px]" value="0"></SelectItem>
          {availableTables.map((table) => (
            <SelectItem key={table} value={String(table)}>
              Laud {table}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}