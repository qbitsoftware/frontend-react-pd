import { Search, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MatchWrapper } from '@/types/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
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

  let filteredMatches = filterMatchesByGameday(classFilteredMatches, uniqueGamedays[safeDayIndex]);

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

  // Calculate grid template columns based on number of timeslots
  const calculateGridColumns = () => {
    // Fixed width for the Laud column
    const labelColumn = "10rem";

    if (timeSlots.length === 1) {
      // For single timeslot, set a maximum width to prevent excessive stretching
      return `${labelColumn} minmax(16rem, 24rem)`;
    } else if (timeSlots.length === 2) {
      return `${labelColumn} repeat(${timeSlots.length}, minmax(14rem, 18rem))`;
    } else if (timeSlots.length <= 4) {
      // For 3-4 timeslots, balance width
      return `${labelColumn} repeat(${timeSlots.length}, minmax(12rem, 1fr))`;
    } else {
      // For many timeslots, make them narrower
      return `${labelColumn} repeat(${timeSlots.length}, minmax(12rem, 1fr))`;
    }
  };

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
        <div className="w-full pr-4 overflow-auto my-8">
          <div
            className="grid max-w-fit"
            style={{
              gridTemplateColumns: calculateGridColumns(),
              gap: "12px"
            }}
          >
            <div className="p-3 text-[#212121] text-center font-medium whitespace-nowrap">{formattedDate}</div>

            {timeSlots.map((timeSlot) => (
              <div
                key={timeSlot.displayTime}
                className="p-3"
              >
                {timeSlot.displayTime}

              </div>
            ))}

            {tables.map(tableId => (
              <React.Fragment key={tableId}>
                <div className="bg-[#3E6156] font-medium text-[#ececec] rounded-[2px] flex items-center justify-center p-3">
                  Laud {tableId}
                </div>

                {/* Match cells for each timeslot */}
                {timeSlots.map((timeSlot) => (
                  <div
                    key={`${tableId}-${timeSlot.displayTime}`}
                    className="p-2 flex items-center justify-center"
                  >
                    <MatchList
                      matches={matchesByTableAndTime[tableId]?.[timeSlot.key] || []}
                    />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-8 mt-2 border rounded-md bg-slate-50">
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

// Helper function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const MatchList = ({ matches }: MatchListProps) => {
  if (!matches || !matches.length) {
    return null;
  }

  return (
    <div className="space-y-3 w-full" style={{}}>
      {matches.map((match) => (
        <MatchCard key={match.match.id} match={match} />
      ))}
    </div>
  );
};

interface MatchCardProps {
  match: MatchWrapper;
}

const MatchCard = ({ match }: MatchCardProps) => {
  // Define a fixed height for all cards (adjust as needed)
  const cardHeight = "7rem";
  const maxNameLength = 20; // Maximum characters to show before truncating

  // Check if either name needs truncation
  const p1NameTruncated = truncateText(match.p1?.name || 'TBD', maxNameLength);
  const p2NameTruncated = truncateText(match.p2?.name || 'TBD', maxNameLength);


  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`relative mx-auto px-4 py-6 border-y border-gray-300 hover:bg-slate-100 transition-colors cursor-pointer ${match.match.winner_id ? "bg-gray-100" : "bg-transparent"} w-full`}
          style={{ height: cardHeight }}
        >
          <div className='absolute right-1 top-0'>
            {match.class &&
              <span className="text-xs bg-[#EEEFF2] px-1 rounded">{match.class}</span>
            }

          </div>

          <div className={`flex flex-col h-full justify-around`}>
            <div className="flex justify-start space-x-4 items-center">
              <span className={`text-sm text-stone-700 ${match.match.winner_id === match.p1?.id ? "font-bold" : "font-medium"}`}>
                {p1NameTruncated}
              </span>
            </div>



            <div className="flex justify-between items-center">
              <span className={`text-sm text-stone-700 ${match.match.winner_id === match.p2?.id ? "font-bold" : "font-medium"}`}>
                {p2NameTruncated}
              </span>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Match Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Player 1 Information */}
          <div className="border-b pb-3">
            <p className="font-medium text-sm text-gray-500 mb-1">Player 1:</p>
            <p className={`text-lg ${match.match.winner_id === match.p1?.id ? "font-bold" : ""}`}>
              {match.p1?.name || 'TBD'}
            </p>
          </div>

          {/* Player 2 Information */}
          <div className="border-b pb-3">
            <p className="font-medium text-sm text-gray-500 mb-1">Player 2:</p>
            <p className={`text-lg ${match.match.winner_id === match.p2?.id ? "font-bold" : ""}`}>
              {match.p2?.name || 'TBD'}
            </p>
          </div>

          {/* Match Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-medium text-sm text-gray-500 mb-1">Class:</p>
              <p>{match.class || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-sm text-gray-500 mb-1">Round:</p>
              <p>Round {match.match.round || '?'}</p>
            </div>
            <div>
              <p className="font-medium text-sm text-gray-500 mb-1">Type:</p>
              <p>{match.match.type === "winner" ? "Playoffs" : "Table match"}</p>
            </div>
            <div>
              <p className="font-medium text-sm text-gray-500 mb-1">Status:</p>
              <p>{match.match.winner_id ? "Completed" : "Pending"}</p>
            </div>
            {match.match.bracket && (
              <div>
                <p className="font-medium text-sm text-gray-500 mb-1">Bracket:</p>
                <p>{match.match.bracket === "1-2" ? "Final" : match.match.bracket}</p>
              </div>
            )}
          </div>

          {/* Winner Information (if available) */}
          {match.match.winner_id && (
            <div className="mt-3 pt-3 border-t">
              <p className="font-medium text-sm text-gray-500 mb-1">Winner:</p>
              <p className="font-bold">
                {match.match.winner_id === match.p1?.id ? match.p1?.name :
                  match.match.winner_id === match.p2?.id ? match.p2?.name : 'Unknown'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentSchedule;