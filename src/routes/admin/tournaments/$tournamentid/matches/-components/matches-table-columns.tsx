import type { ColumnDef } from "@tanstack/react-table"
import type { Match } from "@/types/types" 
import { TableNumberForm } from "./table-number-form"

export const columns: ColumnDef<Match>[] = [
  {
    accessorKey: "",
    header: "JKNR.",
  },
  {
    accessorKey: "round",
    header: "Round",
  },
  {
    accessorKey: "table",
    header: "Table",
  },
  {
    accessorKey: "p1_id",
    header: "Player 1",
  },
  {
    accessorKey: "p1_score",
    header: "Player 1 Score",
  },
  {
    accessorKey: "p2_score",
    header: "Player 2 Score",
  },
  {
    accessorKey: "p2_id",
    header: "Player 2",
  },
  {
    accessorKey: "winner",
    header: "Winner Placement",
  },
  {
    accessorKey: "loser",
    header: "Loser Placement",
  },
  {
    accessorKey: "winner_id",
    header: "Winner",
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

