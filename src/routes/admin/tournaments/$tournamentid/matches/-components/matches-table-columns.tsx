import type { ColumnDef } from "@tanstack/react-table"
import type { Match } from "@/types/types" 
import { TableNumberForm } from "./table-number-form"

export const columns: ColumnDef<Match>[] = [
  {
    accessorKey: "",
    header: "JKNR.",
    cell: ({ row }) => {
      return row.index + 1
    }
  },
  {
    accessorKey: "match.round",
    header: "Round",
  },
  {
    accessorKey: "extra_data.table",
    header: "Table",
    cell: ({ row }) => {
      const match = row.original
      return <TableNumberForm matchId={match.id} initialTableNumber={match.extra_data ? match.extra_data.table : 0} />
    },
  },
  {
    accessorKey: "p1.name",
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
    accessorKey: "p2.name",
    header: "Player 2",
  },
  {
    accessorKey: "match.next_winner_match_id",
    header: "Winner Placement",
  },
  {
    accessorKey: "match.next_loser_match_id",
    header: "Loser Placement",
  },
  {
    accessorKey: "winner_id",
    header: "Winner",
    cell: ({ row }) => {
      const match = row.original
      const winner_name = match.winner_id == match.p1_id ? match.p1.name : match.p2.name
      return match.winner_id ? winner_name : "Mängimata"
    }
  },
]

