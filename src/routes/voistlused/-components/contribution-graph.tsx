import { useState } from "react"
import { ChevronLeft, ChevronRight, Info, ZoomIn, ZoomOut } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tournament } from "@/types/types"
import { getDaysInMonth, getTournamentColor } from "./calendar-utils"

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

interface Props {
    tournaments: Tournament[]
}

export function SportsTimetableGithubStyle({ tournaments }: Props) {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [selectedSport, setSelectedSport] = useState<string | null>(null)
    const [isZoomed, setIsZoomed] = useState(true)
    const [zoomStartMonth, setZoomStartMonth] = useState(currentMonth)

    // Filter tournaments by selected sport
    const filteredTournaments = selectedSport 
        ? tournaments.filter(t => t.sport === selectedSport) 
        : tournaments

    // Assign colors to tournaments
    filteredTournaments.forEach(t => {
        t.color = getTournamentColor(t.id)
    })

    // Get unique sports for filter
    const sports = Array.from(new Set(tournaments.map(t => t.sport)))

    // Get days in each month for the selected year
    const daysInMonthArray = getDaysInMonth(selectedYear)
    
    // Available years for selection (current year -5 to +5)
    const availableYears = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

    // Get visible months based on zoom state
    const visibleMonths = isZoomed
        ? months.slice(zoomStartMonth, zoomStartMonth + 3).map((month, index) => ({
            name: month,
            index: zoomStartMonth + index,
        }))
        : months.map((month, index) => ({
            name: month,
            index,
        }))

    // Handle zoom navigation
    const handlePrevMonths = () => {
        if (zoomStartMonth > 0) {
            setZoomStartMonth(zoomStartMonth - 1)
        }
    }

    const handleNextMonths = () => {
        if (zoomStartMonth < 9) {
            setZoomStartMonth(zoomStartMonth + 1)
        }
    }

    // Create a map of dates to tournaments
    const tournamentsByDate = new Map<string, Tournament[]>()
    
    filteredTournaments.forEach(tournament => {
        const startDate = new Date(tournament.start_date)
        const endDate = new Date(tournament.end_date)
        
        // Skip if not in the selected year
        if (startDate.getFullYear() !== selectedYear && endDate.getFullYear() !== selectedYear) {
            return
        }
        
        // Iterate through each day of the tournament
        const currentDate = new Date(startDate)
        while (currentDate <= endDate) {
            // Skip if not in the selected year
            if (currentDate.getFullYear() !== selectedYear) {
                currentDate.setDate(currentDate.getDate() + 1)
                continue
            }
            
            const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
            
            if (!tournamentsByDate.has(dateKey)) {
                tournamentsByDate.set(dateKey, [])
            }
            
            tournamentsByDate.get(dateKey)!.push(tournament)
            
            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1)
        }
    })
    
    // Get tournaments for a specific date
    const getTournamentsForDate = (year: number, month: number, day: number) => {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return tournamentsByDate.get(dateKey) || []
    }
    
    // Format date for display
    const formatDate = (year: number, month: number, day: number) => {
        const date = new Date(year, month, day)
        return date.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    }
    
    // Check if tournament is in the past
    const isPastTournament = (tournament: Tournament) => {
        return new Date(tournament.end_date) < currentDate
    }

    // Generate the calendar grid for a month
    const renderMonth = (monthInfo: { name: string, index: number }) => {
        const monthIndex = monthInfo.index
        const daysInMonth = daysInMonthArray[monthIndex]
        
        // Calculate the day of week for the first day of month (0 = Sunday, 6 = Saturday)
        const firstDayOfMonth = new Date(selectedYear, monthIndex, 1).getDay()
        const rows = 5 // Fixed number of rows
        
        // Generate cells for the month
        const cells = []
        
        // Create grid of day cells
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < 7; col++) {
                const dayNumber = row * 7 + col + 1 - firstDayOfMonth
                
                if (dayNumber < 1 || dayNumber > daysInMonth) {
                    // Empty cell
                    cells.push(
                        <div 
                            key={`${monthIndex}-${row}-${col}`} 
                            className="w-4 h-4 m-0.5 opacity-0"
                        />
                    )
                } else {
                    const tournamentsOnDay = getTournamentsForDate(selectedYear, monthIndex, dayNumber)
                    const hasEvents = tournamentsOnDay.length > 0
                    
                    if (hasEvents) {
                        // If there are tournaments on this day
                        const cellStyle = {
                            backgroundColor: tournamentsOnDay[0].color,
                            opacity: isPastTournament(tournamentsOnDay[0]) ? 0.4 : 1
                        }
                        
                        const tooltipContent = (
                            <div className="p-2 space-y-2">
                                <div className="font-medium">{formatDate(selectedYear, monthIndex, dayNumber)}</div>
                                <div className="space-y-2">
                                    {tournamentsOnDay.map(tournament => (
                                        <div key={tournament.id} className="flex items-start gap-2">
                                            <div 
                                                className="w-3 h-3 mt-1 rounded-sm flex-shrink-0" 
                                                style={{ backgroundColor: tournament.color }}
                                            />
                                            <div>
                                                <div className="font-medium">{tournament.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {tournament.sport} | {tournament.start_date} to {tournament.end_date}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                        
                        cells.push(
                            <Tooltip key={`${monthIndex}-${row}-${col}`}>
                                <TooltipTrigger asChild>
                                    <div 
                                        className={`w-4 h-4 m-0.5 rounded-sm cursor-pointer hover:ring-2 hover:ring-primary ${tournamentsOnDay.length > 1 ? 'ring-1 ring-white' : ''}`}
                                        style={cellStyle}
                                    />
                                </TooltipTrigger>
                                <TooltipContent sideOffset={5}>
                                    {tooltipContent}
                                </TooltipContent>
                            </Tooltip>
                        )
                    } else {
                        // No tournaments on this day
                        cells.push(
                            <div 
                                key={`${monthIndex}-${row}-${col}`} 
                                className="w-4 h-4 m-0.5 rounded-sm bg-muted/30"
                            />
                        )
                    }
                }
            }
        }
        
        return (
            <div key={monthIndex} className="flex flex-col items-center">
                <div className="text-xs font-medium mb-1">{monthInfo.name}</div>
                <div className="grid grid-cols-7 gap-0">
                    {cells}
                </div>
            </div>
        )
    }

    // Determine grid column count based on zoom state
    const gridColsClass = isZoomed 
        ? "grid-cols-3" 
        : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12"

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    {/* Year selector */}
                    <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableYears.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Zoom controls */}
                    <button
                        onClick={() => setIsZoomed(!isZoomed)}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-muted hover:bg-muted/80"
                    >
                        {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                        <span>{isZoomed ? "Show Full Year" : "Zoom In"}</span>
                    </button>

                    {/* Month navigation (only in zoomed mode) */}
                    {isZoomed && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handlePrevMonths}
                                disabled={zoomStartMonth === 0}
                                className="p-1 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-50"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span className="text-sm font-medium">
                                {months[zoomStartMonth]} - {months[Math.min(zoomStartMonth + 2, 11)]}
                            </span>
                            <button
                                onClick={handleNextMonths}
                                disabled={zoomStartMonth >= 9}
                                className="p-1 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-50"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Sport filter */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedSport(null)}
                        className={`px-3 py-1 rounded-full text-sm ${selectedSport === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                    >
                        All Sports
                    </button>
                    {sports.map((sport) => (
                        <button
                            key={sport}
                            onClick={() => setSelectedSport(sport)}
                            className={`px-3 py-1 rounded-full text-sm ${selectedSport === sport ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                        >
                            {sport}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calendar */}
            <div className="border rounded-lg p-6 bg-card space-y-6">
                {/* Day labels */}
                <div className="flex justify-center mb-2">
                    <div className="grid grid-cols-7 gap-0 w-fit">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <div key={i} className="w-4 h-4 m-0.5 flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Months grid */}
                <TooltipProvider>
                    <div className={`grid ${gridColsClass} gap-2`}>
                        {visibleMonths.map((monthInfo) => renderMonth(monthInfo))}
                    </div>
                </TooltipProvider>
            </div>

            {/* Legend */}
            <div className="border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">Events</h3>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs">
                                Each square represents a day. Colored squares indicate days with tournaments.
                                Days with multiple tournaments have a white outline.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {filteredTournaments.map((tournament) => {
                        const isPast = isPastTournament(tournament)
                        return (
                            <div key={tournament.id} className="flex items-center gap-2">
                                <div 
                                    style={{ backgroundColor: tournament.color }} 
                                    className={`w-3 h-3 rounded-sm ${isPast ? "opacity-40" : ""}`}
                                />
                                <span className="text-sm truncate">{tournament.name}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}