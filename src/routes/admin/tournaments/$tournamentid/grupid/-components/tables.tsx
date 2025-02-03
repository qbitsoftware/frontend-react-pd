// src/components/tournament-tables.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Pencil, Trash, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { TournamentTable } from "@/types/types"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { capitalize } from "@/lib/utils"
import { strict } from "assert"

interface TournamentTablesProps {
  tables: TournamentTable[] | null
}

export const TournamentTables: React.FC<TournamentTablesProps> = ({ tables }) => {
  const { tournamentid } = useParams({ strict: false })
  const navigate = useNavigate()
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tournament Tables</CardTitle>
        <Link to={`/admin/tournaments/${tournamentid}/tabelid/new`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Team Size</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables ? tables.map((table) => (
              <TableRow key={table.id} onClick={() => (navigate({to: `${table.id}`}))} className="cursor-pointer">
                <TableCell className="font-medium">{table.class}</TableCell>
                <TableCell>{capitalize(table.type)}</TableCell>
                <TableCell>{table.solo ? 'Individual' : 'Team'}</TableCell>
                <TableCell>{table.size}</TableCell>
                <TableCell>
                  {table.solo ? 'N/A' : `${table.min_team_size}-${table.max_team_size}`}
                </TableCell>
                <TableCell>{new Date(table.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {/* <DropdownMenuItem onClick={() => onEdit(table)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(table.id)}
                        className="text-red-600"
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
              :
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No tables created yet
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}