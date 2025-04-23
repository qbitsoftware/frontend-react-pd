import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { Button } from "./ui/button"

interface User {
  ID: number
  CreatedAt: Date
  UpdatedAt: Date
  DeletedAt?: Date | null
  first_name: string
  last_name: string
  birth_date: Date
  club_id: string
  email: string
  password?: string
  sex: string
  rating_points: number
  placement_points: number
  weight_points: number
  eltl_id: number
  confirmation: string
  has_rating: boolean
  nationality: string,
  placing_order: number,
}

interface UserTableProps {
  users: User[]
}

export default function PlayersTable({ users }: UserTableProps = { users: [] }) {
  const formatDate = (date: Date) => {
    return new Date(date).getFullYear()
  }

  const [sex, setSex] = useState("M")

  const [, setSelectedPlayerId] = useState<number | null>(null)
  const filteredUsers = users.filter((user) => user.sex == sex)

  return (
    <div className="h-full w-full">
      <div>
        <Button variant={sex === "N" ? "default" : "outline"} onClick={() => setSex("N")}>Naised</Button>
        <Button variant={sex === "M" ? "default" : "outline"} onClick={() => setSex("M")}>Mehed</Button>
      </div>
      <ScrollArea className="h-full w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[100px]">ID</TableHead> */}
              {/* <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
          <TableHead>Deleted At</TableHead> */}
              <TableHead>NR</TableHead>
              <TableHead>PP</TableHead>
              <TableHead>RP</TableHead>
              <TableHead>KL</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>PERENIMI</TableHead>
              <TableHead>EESNIMI</TableHead>
              <TableHead>SA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, idx) => {
              if (user.sex == sex) {
                return (
                  <TableRow key={user.ID}>
                    {/* <TableCell>{user.ID}</TableCell>G
                <TableCell>{formatDate(user.CreatedAt)}</TableCell>
                <TableCell>{formatDate(user.UpdatedAt)}</TableCell>
              <TableCell>{user.DeletedAt ? formatDate(user.DeletedAt) : 'N/A'}</TableCell> */}
                    <TableCell>{idx}</TableCell>
                    <TableCell>{user.placement_points}</TableCell>
                    <TableCell>{user.rating_points}</TableCell>
                    <TableCell>{user.weight_points}</TableCell>
                    <TableCell>{user.eltl_id}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{formatDate(user.birth_date)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setSelectedPlayerId(user.ID) }}
                      >
                        View Matches
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              }
            })}
          </TableBody>
        </Table>
      </ScrollArea>
      {/* {SelectedPlayerId != null && SelectedPlayerId > 0 && <MatchesPopup
        playerId={SelectedPlayerId || 0}
        isOpen={SelectedPlayerId !== null}
        onClose={() => setSelectedPlayerId(null)}
        players={filteredUsers}
      />} */}

    </div>
  )
}
