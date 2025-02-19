import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import type { MatchWrapper } from "@/types/types"
import { columns } from "./matches-table-columns"
import MatchDialog from "@/components/match-dialog"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableTennisProtocolModal } from "./tt-modal"
import { UseRegroupMatches } from "@/queries/match"
import { useParams } from "@tanstack/react-router"
import { useToastNotification } from "@/components/toast-notification"
import { useToast } from "@/hooks/use-toast"

interface MatchesTableProps {
  data: MatchWrapper[] | []
  tournament_id: number
}

type FilterOption = "all" | "winner_declared" | "ongoing" | "not_started"

export const MatchesTable: React.FC<MatchesTableProps> = ({ data, tournament_id }: MatchesTableProps) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchWrapper | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const params = useParams({ strict: false })
  const regroupMutation = UseRegroupMatches(tournament_id, Number(params.groupid))

  const toast = useToast()
  const { successToast, errorToast } = useToastNotification(toast)

  const [filterValue, setFilterValue] = useState<FilterOption>("all")

  const filteredData = useMemo(() => {
    switch (filterValue) {
      case "winner_declared":
        return data.filter((match) => match.match.winner_id !== "")
      case "ongoing":
        return data.filter((match) => match.match.p1_id !== "" && match.match.p2_id !== "" && match.match.winner_id === "" && match.match.p1_id !== "empty" && match.match.p2_id !== "empty")
      case "not_started":
        return data.filter((match) => match.match.winner_id === "" && (match.match.p1_id !== "empty" || match.match.p2_id !== "empty"))
      default:
        return data
    }
  }, [data, filterValue])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


  const handleRowClick = (match: MatchWrapper) => {
    setSelectedMatch(match)
    setIsOpen(true)
  }

  const handleRegrouping = async () => {
    try {
      await regroupMutation.mutateAsync()
      successToast("Mängud on edukalt regrupeeritud")
    } catch (error) {
      void error
      errorToast("Mängude regrupeerimine ebaõnnestus")
    }
  }


  return (
    <div className="py-4">
      <div className="flex gap-4">
        <Select value={filterValue} onValueChange={(value: FilterOption) => setFilterValue(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter matches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Kõik mängud</SelectItem>
            <SelectItem value="winner_declared">Lõppenud mängud</SelectItem>
            <SelectItem value="ongoing">Käimasolevad mängud</SelectItem>
            <SelectItem value="not_started">Upcoming matches</SelectItem>
          </SelectContent>
        </Select>
        <Button className="text-white bg-secondary"  onClick={() => handleRegrouping()}>Regrupeeri</Button>
      </div>
      <div className="rounded-md border my-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className={cn("!h-auto bg-green-100",
                  (row.original.p1.id == "" && row.original.p2.id == ""
                    || row.original.p1.id == "" && row.original.p2.id != ""
                    || row.original.p1.id != "" && row.original.p2.id == ""
                    || row.original.match.winner_id != ""
                  )
                  && "bg-white")}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="py-0 !h-auto" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                  <TableCell><Button disabled={row.original.p1.id == "" && row.original.p2.id == ""} variant={"ghost"} onClick={() => handleRowClick(row.original)}>Muuda</Button></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {selectedMatch && selectedMatch.match.table_type == "champions_league" &&
          <TableTennisProtocolModal tournament_id={tournament_id} match={selectedMatch} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        }
        {selectedMatch && selectedMatch.match.table_type != "champions_league" &&
          <MatchDialog tournament_id={tournament_id} match={selectedMatch} open={isOpen} onClose={() => setIsOpen(false)} />
        }
      </div>
    </div>
  )
}

