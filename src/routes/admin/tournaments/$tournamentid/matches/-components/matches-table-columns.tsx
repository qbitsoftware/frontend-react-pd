import type { ColumnDef } from "@tanstack/react-table"
import type { Match } from "@/types/types" 
import { TableNumberForm } from "./table-number-form"

export const columns: ColumnDef<Match>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "round",
    header: "Round",
  },
  {
    accessorKey: "p1_id",
    header: "Player 1",
  },
  {
    accessorKey: "p2_id",
    header: "Player 2",
  },
  {
    accessorKey: "winner_id",
    header: "Winner",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "bracket",
    header: "Bracket",
  },
  {
    accessorKey: "extra_data.table",
    header: "Table",
    cell: ({ row }) => {
      const match = row.original
      return <TableNumberForm matchId={match.id} initialTableNumber={match.extra_data.table} />
    },
  },
]

