import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useParams } from "@tanstack/react-router"
import { UsePatchMatch } from "@/queries/match"
import { useToast } from "@/hooks/use-toast"
import { useToastNotification } from "@/components/toast-notification"
import { Match } from "@/types/matches"
import { UseGetFreeVenues } from "@/queries/venues"

interface TableNumberFormProps {
  match: Match
  initialTableNumber: string
}

export function TableNumberForm({ match, initialTableNumber }: TableNumberFormProps) {
  const params = useParams({ strict: false })
  const { data: freeVenues, isLoading, isError } = UseGetFreeVenues(Number(params.tournamentid))

  const [tableNumber, setTableNumber] = useState<string>(initialTableNumber)
  const toast = useToast()
  const { errorToast } = useToastNotification(toast)

  const matchMutation = UsePatchMatch(Number(params.tournamentid), match.tournament_table_id, match.id)

  const handleChange = async (value: string) => {
    setTableNumber(value)
    try {
      const data: Match = { ...match, extra_data: { ...match.extra_data, table: value.trim()} }
      await matchMutation.mutateAsync(data)
    } catch (error) {
      void error
      errorToast("Lauanumbri muutmine ebaõnnestus")
    }
  }

  if (isLoading) {
    return <div></div>
  }

  if (!freeVenues?.data || isError) {
    return <div></div>
  }

  return (
    <div>
      <Select value={String(tableNumber)} onValueChange={handleChange}>
        <SelectTrigger>
          <span>{tableNumber}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="min-h-[30px]" value=" "></SelectItem>
          {freeVenues.data.map((table) => (
            <SelectItem key={table.name} value={String(table.name)}>
              {table.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}