import { Search, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MatchWrapper } from '@/types/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import {
  distributeMatchesByTable,
  generateTimeSlotsForGameday,
  getUniqueMatches,
  getUniqueTables,
  getFormattedDate,
  getUniqueGamedays,
  getUniqueClasses,
  filterMatchesByGameday
} from "./schedule-utils";

export interface ScheduleProps {
  matches: MatchWrapper[];
  activeDay: number;
  setActiveDay: (day: number) => void;
  activeClass: string;
  setActiveClass: (classValue: string) => void;
}

export const TournamentSchedule = ({
  matches,
  activeDay,
  setActiveDay,
  activeClass,
  setActiveClass
}: ScheduleProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const safeMatches = Array.isArray(matches) ? getUniqueMatches(matches) : [];

  const uniqueClasses = getUniqueClasses(safeMatches);

  // Filter by class
  let classFilteredMatches = safeMatches;
  if (activeClass !== 'all') {
    classFilteredMatches = safeMatches.filter(
      match => match.class === activeClass
    )
  }

  // Filter by gamedays based on class
  const uniqueGamedays = getUniqueGamedays(classFilteredMatches);
  const totalDays = uniqueGamedays.length || 1;
  const safeDayIndex = activeDay >= 0 && activeDay < uniqueGamedays.length ? activeDay : 0;


  let filteredMatches = filterMatchesByGameday(classFilteredMatches, uniqueGamedays[safeDayIndex])

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredMatches = filteredMatches.filter(match =>
      match.p1?.name?.toLowerCase().includes(term) ||
      match.p2?.name?.toLowerCase().includes(term)
    );
  }

  useEffect(() => {
    setActiveClass("all");
  }, [setActiveClass]);

  // Generate time slots for the current gameday (column headers)
  const timeSlots = generateTimeSlotsForGameday(filteredMatches);

  // Get table names (row headers)
  const tables = getUniqueTables(filteredMatches);

  // Distribute matches by table and time (table cells)
  const matchesByTableAndTime = distributeMatchesByTable(filteredMatches);

  // Get the formatted date for display
  const formattedDate = getFormattedDate(uniqueGamedays[safeDayIndex] || '');

  return (
    <>
      <ScheduleFilters
        gamedays={uniqueGamedays}
        activeDay={safeDayIndex}
        setActiveDay={setActiveDay}
        totalDays={totalDays}
        classes={uniqueClasses}
        activeClass={activeClass}
        setActiveClass={setActiveClass}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {tables.length > 0 && timeSlots.length > 0 ? (
        <div className="w-full pr-4 overflow-auto my-4">
          <div className="">
            <Table className="border-separate">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32 text-[#212121] text-center font-medium">{formattedDate}</TableHead>
                  {timeSlots.map((timeSlot, index) => (
                    <TableHead
                      key={timeSlot.displayTime}
                      className={`w-40 font-medium ${index !== 0 ? 'border-l border-stone-200' : ''}`}
                    >
                      {timeSlot.displayTime}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map(tableId => (
                  <TableRow key={tableId}>
                    <TableCell className="bg-[#3E6156] font-medium text-center text-[#ececec] rounded-[2px]">
                      Laud {tableId}
                    </TableCell>
                    {timeSlots.map((timeSlot, index) => (
                      <TableCell
                        key={`${tableId}-${timeSlot.displayTime}`}
                        className={`p-2 ${index !== 0 ? 'border-l border-stone-100' : ''}`}
                      >
                        <MatchList
                          matches={matchesByTableAndTime[tableId]?.[timeSlot.key] || []}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md bg-slate-50">
          <p className="text-gray-500">Mänge pole selles klassis sel päeval</p>
        </div>
      )}
    </>
  );
};

interface ScheduleFiltersProps {
  gamedays: string[];
  activeDay: number;
  setActiveDay: (day: number) => void;
  totalDays: number;
  classes: string[];
  activeClass: string;
  setActiveClass: (classValue: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ScheduleFilters = ({
  gamedays,
  activeDay,
  setActiveDay,
  totalDays,
  classes,
  activeClass,
  setActiveClass,
  searchTerm,
  setSearchTerm
}: ScheduleFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative w-full md:w-auto">
        <Input
          type="text"
          placeholder="Otsi nime"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 pl-4 pr-10 py-2 text-sm bg-[#F7F6F7] focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {classes.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-12 flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm bg-[#F7F6F7]">
              <span>{activeClass === 'all' ? 'Kõik grupid' : `${activeClass}`}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => setActiveClass('all')}
              className={activeClass === 'all' ? "bg-slate-100" : ""}
            >
              Kõik grupid
            </DropdownMenuItem>
            {classes.map((classValue) => (
              <DropdownMenuItem
                key={classValue}
                onClick={() => setActiveClass(classValue)}
                className={activeClass === classValue ? "bg-slate-100" : ""}
              >
                {classValue}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-12 flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm bg-[#F7F6F7]">
            <span>
              {gamedays[activeDay] ?
                `Gameday ${activeDay + 1} (${getFormattedDate(gamedays[activeDay])})` :
                `Gameday ${activeDay + 1}`
              }
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Array.from({ length: totalDays }).map((_, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => setActiveDay(index)}
              className={activeDay === index ? "bg-slate-100" : ""}
            >
              {gamedays[index] ?
                `Gameday ${index + 1} (${getFormattedDate(gamedays[index])})` :
                `Gameday ${index + 1}`
              }
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>


    </div>
  );
};

interface MatchListProps {
  matches: MatchWrapper[];
}

const MatchList = ({ matches }: MatchListProps) => {
  if (!matches || !matches.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <div key={match.match.id} className={`relative p-4 border-y border-stone-300 hover:bg-slate-50 transition-colors ${match.match.winner_id ? "bg-stone-100" : "bg-transparent"}`}>
          <div className='absolute right-1 top-1'>
            {match.class &&
              <span className="text-xs bg-slate-100 px-1 rounded">{match.class}</span>
            }
          </div>
          <div className={` flex flex-col`}>

            <div className="flex justify-start space-x-4 items-center">
              <span className="font-medium text-sm text-stone-700">
                {match.p1?.name || 'TBD'}
              </span>
              {match.match.winner_id && match.match.winner_id === match.p1?.id && (
                <span className="text-xs font-bold text-stone-800">Winner</span>
              )}
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="text-xs">R{match.match.round || '?'}</span>

              {match.match.type === "winner" && match.match.bracket !== `1-2` && <div className="text-xs text-orange-600">Playoffs</div>}
              {match.match.type === "winner" && match.match.bracket === `1-2` && <div className='text-xs text-orange-600'>Final</div>}

            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm text-stone-700">
                {match.p2?.name || 'TBD'}
              </span>
              {match.match.winner_id && match.match.winner_id === match.p2?.id && (
                <span className="text-xs font-bold text-green-600">W</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TournamentSchedule;