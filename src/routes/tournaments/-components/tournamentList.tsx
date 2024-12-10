'use client'

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Table, Brackets, Trophy, Users, ChevronRight } from 'lucide-react'
import { capitalize } from "lodash"
import { Link } from "@tanstack/react-router"

export type TournamentColumn = {
  ID: number
  name: string
  CreatedAt: string
  start_date: string
  end_date: string
  type: string
}

interface TournamentProps {
  tournaments: TournamentColumn[]
}

export default function TournamentList({ tournaments }: TournamentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [expandedType, setExpandedType] = useState<string | null>(null)

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((tournament) =>
      (tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedType || tournament.type.toLowerCase() === selectedType.toLowerCase())
    )
  }, [tournaments, searchTerm, selectedType])

  const groupedTournaments = useMemo(() => {
    return filteredTournaments.reduce((acc, tournament) => {
      const type = tournament.type.toLowerCase()
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(tournament)
      return acc
    }, {} as Record<string, TournamentColumn[]>)
  }, [filteredTournaments])

  const tournamentTypes = useMemo(() => {
    return Array.from(new Set(tournaments.map(t => t.type)))
  }, [tournaments])

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
    <div className="container mx-auto p-4 space-y-8 from-blue-50 to-white min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 mt-4 md:mt-10">Turniirid</h1>
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Otsi turniiri..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <Select onValueChange={(value) => setSelectedType(value === 'all' ? null : value)}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Vali turniiri tüüp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Kõik tüübid</SelectItem>
            {tournamentTypes.map((type) => (
              <SelectItem key={type} value={type}>{capitalize(type.replace('_', ' '))}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-20">
        {Object.entries(groupedTournaments).map(([type, typeTournaments]) => (
          <div key={type} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-semibold text-black/70 capitalize">{type.replace('_', ' ')}</h2>
              <button
                onClick={() => setExpandedType(expandedType === type ? null : type)}
                className="flex items-center transition-colors duration-200 text-blue-600 hover:text-blue-800"
              >
                {expandedType === type ? 'Show Less' : 'See All'}
                <ChevronRight className={`ml-1 h-4 w-4 transform transition-transform ${expandedType === type ? 'rotate-90' : ''}`} />
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {(expandedType === type ? typeTournaments : typeTournaments.slice(0, 6)).map((tournament) => (
                <Card key={tournament.ID} className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer hover:scale-105 border-blue-200">
                  <Link to={"/tournaments/" + tournament.ID} preload="intent">
                    <CardHeader className="bg-blue-600 text-white p-0">
                      <div className="relative w-full aspect-[16/9]">
                        <img className="absolute w-full h-full object-fill" src="/public/test/table_tennis_background.png" alt="Tournament background" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 p-0">
                      <div className="p-4 md:p-6">
                        <CardTitle className="flex items-center justify-between  md:mb-4">
                          <span className="text-lg md:text-2xl">{tournament.name}</span>
                          {getIcon(tournament.type)}
                        </CardTitle>
                        <p className="text-sm text-gray-900 mb-2">Formaat: {capitalize(tournament.type.replace('_', ' '))}</p>
                        <p className="text-sm text-gray-600">
                          Algus: {format(new Date(tournament.start_date), "MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-gray-600">
                          Lõpp: {format(new Date(tournament.end_date), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

