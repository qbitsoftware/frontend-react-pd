import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import type { MatchWrapper } from "@/types/types"
import { columns } from "./matches-table-columns"
import MatchDialog from "@/components/match-dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MatchesTableProps {
  data: MatchWrapper[] | []
}

export const MatchesTable: React.FC<MatchesTableProps> = ({ data }: MatchesTableProps) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchWrapper | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleRowClick = (match: MatchWrapper) => {
    setSelectedMatch(match)
    setIsOpen(true)
  }

  return (
    <div className="rounded-md border">
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
      {selectedMatch && <MatchDialog match={selectedMatch} open={isOpen} onClose={() => setIsOpen(false)} />}
    </div>
  )
}

