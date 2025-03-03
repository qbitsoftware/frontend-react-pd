import type { ColumnDef } from "@tanstack/react-table"
import type { MatchWrapper } from "@/types/types"
import { TableNumberForm } from "./table-number-form"

export const columns: ColumnDef<MatchWrapper>[] = [
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
    accessorKey: "class",
    header: "Grupp",
  },
  {
    accessorKey: "match.extra_data.table",
    header: "Table",
    cell: ({ row }) => {
      const match = row.original
      return <TableNumberForm match={match.match} initialTableNumber={match.match.extra_data ? match.match.extra_data.table : 0} />
    },
  },
  {
    accessorKey: "",
    header: "Player 1",
    cell: ({ row }) => {
      if (row.original.match.p1_id == "empty") {
        return <div className="text-gray-400">{"Bye Bye"}</div>
      } else if (row.original.match.p1_id == "") {
        return <div></div>
      } else {
        return <>{row.original.p1.name}</>
      }
    }
  },
  {
    accessorKey: "p1_score",
    header: "Player 1 Score",
    cell: ({ row }) => {
      if (row.original.match.table_type == "champions_league") {
        return <>{row.original.match.extra_data.team_1_total}</>
      } else {
        let p1_score = 0
        const scores = row.original.match.extra_data.score
        if (!scores) {
          return <>{0}</>
        }
        for (let i = 0; i < scores.length; i++) {
          if (scores[i].p1_score >= 11 && scores[i].p1_score - scores[i].p2_score >= 2) {
            p1_score++
          }
        }
        return <>{p1_score}</>
      }
    }
  },
  {
    accessorKey: "p2_score",
    header: "Player 2 Score",
    cell: ({ row }) => {
      if (row.original.match.table_type == "champions_league") {
        return <>{row.original.match.extra_data.team_2_total}</>
      } else {
        let p2_score = 0
        const scores = row.original.match.extra_data.score
        if (!scores) {
          return <>{0}</>
        }
        for (let i = 0; i < scores.length; i++) {
          if (scores[i].p2_score >= 11 && scores[i].p2_score - scores[i].p1_score >= 2) {
            p2_score++
          }
        }
        return <>{p2_score}</>
      }
    }
  },
  {
    accessorKey: "",
    header: "Player 2",
    cell: ({ row }) => {
      if (row.original.match.p2_id == "empty") {
        return <div className="text-gray-400">{"Bye Bye"}</div>
      } else if (row.original.match.p2_id == "") {
        return <div></div>
      } else {
        return <>{row.original.p2.name}</>
      }
    }
  },
  {
    accessorKey: "match.next_winner_bracket",
    header: "Winner Placement",
  },
  {
    accessorKey: "match.next_loser_bracket",
    header: "Loser Placement",
  },
  {
    accessorKey: "winner_id",
    header: "Winner",
    cell: ({ row }) => {
      const match = row.original
      const winner_name = match.match.winner_id == match.match.p1_id ? match.p1.name : match.p2.name
      if (match.match.p1_id == "empty" && match.match.p2_id == "empty") {
        return <div></div>
      } else if (match.match.winner_id) {
        return winner_name
      } else {
        return "Mängimata"
      }
    }
  },
]

