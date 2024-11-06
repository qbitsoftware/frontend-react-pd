import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Table, Brackets, Trophy, Users } from "lucide-react"
import { capitalize } from "lodash"
import { Link } from "@tanstack/react-router"

export type TournamentColumn = {
  ID: number
  name: string
  createdAt: string
  start_date: string
  end_date: string
  type: string
}

interface TournamentProps {
  tournaments: TournamentColumn[]
}

export default function TournamentList({ tournaments }: TournamentProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "double_elimination":
        return <Brackets className="h-6 w-6 text-blue-500" />
      case "meistriliiga":
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case "round_robin":
        return <Users className="h-6 w-6 text-green-500" />
      case "single_elimination":
        return <Table className="h-6 w-6 text-red-500" />
      default:
        return <Table className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Turniirid</h1>
      <div className="relative">
        <Input
          type="text"
          placeholder="Otsi turniiri..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTournaments.map((tournament) => (
          <Card key={tournament.ID} className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer hover:scale-105">
            <Link to={"/tournaments/" + tournament.ID} preload={"intent"}>
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{tournament.name}</span>
                  {getIcon(tournament.type)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">Formaat: {capitalize(tournament.type)}</p>
                <p className="text-sm text-muted-foreground">
                  Algus: {format(new Date(tournament.start_date), "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Lõpp: {format(new Date(tournament.end_date), "MMMM d, yyyy")}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
