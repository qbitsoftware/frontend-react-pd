import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import type { MatchWrapper, TournamentTable } from "@/types/types"
import MatchDialog from "@/components/match-dialog"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableTennisProtocolModal } from "./tt-modal"
import ReGrouping from "./regrouping"
// import TimeEditingModal from "./time-editing-modal"
import TimeEditingModal from "./time-editing-modal"
import { createColumns } from "./matches-table-columns"
import { useTranslation } from "react-i18next"

interface MatchesTableProps {
  data: MatchWrapper[] | []
  tournament_id: number
  tournament_table: TournamentTable
}

type FilterOption = "all" | "winner_declared" | "ongoing" | "not_started"

export const MatchesTable: React.FC<MatchesTableProps> = ({ data, tournament_id, tournament_table }: MatchesTableProps) => {
  const [isRegroupingModalOpen, setIsRegroupingModalOpen] = useState(false)
  const [isTimeEditingModalOpen, setIsTimeEditingModalOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<MatchWrapper | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [filterValue, setFilterValue] = useState<FilterOption>("all")
  const [initialTab, setInitialTab] = useState<"regrouping" | "finals">("regrouping");
  const { t } = useTranslation()


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
  const columns = useMemo(() => createColumns(t), [t])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


  const handleRowClick = (match: MatchWrapper) => {
    setSelectedMatch(match)
    setIsOpen(true)
  }

  return (
    <div className="py-4">
      <div className="flex gap-4">
        <Select value={filterValue} onValueChange={(value: FilterOption) => setFilterValue(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter matches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.tournaments.filters.all_games")}</SelectItem>
            <SelectItem value="winner_declared">{t("admin.tournaments.filters.winner_declared")}</SelectItem>
            <SelectItem value="ongoing">{t("admin.tournaments.filters.ongoing_games")}</SelectItem>
            <SelectItem value="not_started">{t("admin.tournaments.filters.upcoming_games")}</SelectItem>
          </SelectContent>
        </Select>
        {tournament_table.type == "champions_league" && (
          <div className="flex gap-4">
            <Button className="text-white bg-secondary" onClick={() => {
              setInitialTab("regrouping")
              setIsRegroupingModalOpen(true)
            }}
            >Regrupeeri</Button>
            <Button className="text-white bg-secondary" onClick={() => { setInitialTab("finals"); setIsRegroupingModalOpen(true) }}>Finaalid</Button>
            <Button className="text-white bg-secondary" onClick={() => setIsTimeEditingModalOpen(true)}>Muuda aegu</Button>
          </div>
        )
        }
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
      <ReGrouping
        tournament_id={tournament_id}
        isOpen={isRegroupingModalOpen}
        onClose={() => setIsRegroupingModalOpen(false)}
        state={initialTab}
      />
      <TimeEditingModal
        matches={data}
        tournament_table_id={tournament_table.id}
        tournament_id={tournament_id}
        isOpen={isTimeEditingModalOpen}
        onClose={() => setIsTimeEditingModalOpen(false)}
      />
    </div>
  )
}

