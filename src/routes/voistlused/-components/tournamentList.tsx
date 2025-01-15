'use client'

import { useState, useMemo } from "react"
import { format, isWithinInterval, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Table, Brackets, Trophy, Users, ChevronRight, Calendar } from 'lucide-react'
import { capitalize } from "lodash"
import { Link } from "@tanstack/react-router"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { Tournament } from "@/types/types"

interface TournamentProps {
  tournaments: Tournament[]
}

export default function TournamentList({ tournaments }: TournamentProps) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [expandedType, setExpandedType] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((tournament) => {
      const nameMatch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
      const typeMatch = tournament.type.toLowerCase().includes(searchTerm.toLowerCase())
      const selectedTypeMatch = !selectedType || tournament.type.toLowerCase() === selectedType.toLowerCase()

      let dateMatch = true
      if (startDate && endDate) {
        const tournamentStart = parseISO(tournament.start_date)
        const tournamentEnd = parseISO(tournament.end_date)
        dateMatch = isWithinInterval(tournamentStart, { start: startDate, end: endDate }) ||
          isWithinInterval(tournamentEnd, { start: startDate, end: endDate }) ||
          (tournamentStart <= startDate && tournamentEnd >= endDate)
      }

      return (nameMatch || typeMatch) && selectedTypeMatch && dateMatch
    })
  }, [tournaments, searchTerm, selectedType, startDate, endDate])

  const groupedTournaments = useMemo(() => {
    return filteredTournaments.reduce((acc, tournament) => {
      const type = tournament.type.toLowerCase()
      if (!acc[type]) {
        acc[type] = []
      }

      if (tournament.state === "started") {
        acc[type].push(tournament)
      }
      return acc
    }, {} as Record<string, Tournament[]>)
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
      <h1 className="text-4xl font-bold text-center mb-8 mt-4 md:mt-10">{t("tournaments.header")}</h1>
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder={t("tournaments.inputs.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full border-secondary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <Select onValueChange={(value) => setSelectedType(value === 'all' ? null : value)}>
          <SelectTrigger className="w-full md:w-[200px] border-secondary" >
            <SelectValue placeholder={t("tournaments.inputs.type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Kõik tüübid</SelectItem>
            {tournamentTypes.map((type) => (
              <SelectItem key={type} value={type}>{capitalize(type.replace('_', ' '))}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-4 max-w-4xl mx-auto !mt-4">
        <div className="flex gap-2">
          <Popover >
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal border-secondary",
                  !startDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>{t("tournaments.inputs.start_date")}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal border-secondary",
                  !endDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>{t("tournaments.inputs.end_date")}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          onClick={() => {
            setStartDate(undefined)
            setEndDate(undefined)
          }}
          className="border-secondary"
          variant="outline"
        >
          {t("tournaments.inputs.reset_dates")}
        </Button>
      </div>
      <div className="flex flex-col gap-20 md:pt-10">
        {Object.entries(groupedTournaments).map(([type, typeTournaments]) => (
          <div key={type} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl md:text-4xl font-semibold text-black/70 capitalize">{type === "double_elimination_full_placement" ? "Haapsalu Karikasari" : "Viljandi Cup"}</h2>
              <Button
                onClick={() => setExpandedType(expandedType === type ? null : type)}
                className="flex items-center transition-colors duration-200 border-secondary hover:bg-transparent"
                variant="ghost"
              >
                {expandedType === type ? <div>{t("tournaments.show.less")}</div> : <div>{t("tournaments.show.more")}</div>}
                <ChevronRight className={`ml-1 h-4 w-4 transform transition-transform ${expandedType === type ? 'rotate-90' : ''}`} />
              </Button>
            </div>
            <Separator className="w-full h-[0.5px] p-0 m-0 bg-secondary/50" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {(expandedType === type ? typeTournaments : typeTournaments.slice(0, 6)).map((tournament) => (
                <Card key={tournament.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer hover:scale-105 border-blue-200">
                  <Link to={"/voistlused/" + tournament.id} preload="intent">
                    <CardHeader className="bg-secondary text-white p-0">
                      <div className="relative w-full aspect-[16/9]">
                        <img className="absolute w-full h-full object-fill" src="/public/test/table_tennis_background.png" alt="Tournament background" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 p-0">
                      <div className="p-2 md:p-6">
                        <CardTitle className="flex items-center justify-between  md:mb-4">
                          <span className="text-lg md:text-2xl">{tournament.name}</span>
                          {getIcon(tournament.type)}
                        </CardTitle>
                        Formaat: {capitalize(tournament.type.replace(/_/g, ' '))}
                        <div className="">
                          <p className="text-xs md:text-base text-gray-600">
                            Algus: {format(new Date(tournament.start_date), "MMMM d, yyyy")}
                          </p>
                          <p className="text-xs md:text-base text-gray-600">
                            Lõpp: {format(new Date(tournament.end_date), "MMMM d, yyyy")}
                          </p>
                        </div>
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

