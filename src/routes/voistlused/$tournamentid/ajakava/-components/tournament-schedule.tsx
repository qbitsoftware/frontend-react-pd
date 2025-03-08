import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from "@/components/ui/input";
import { formatDateString, getDateForDay } from '@/lib/utils';
import {Match, MatchWrapper, Player} from '@/lib/types'

export interface ScheduleProps {
  matches: MatchWrapper[];
  days: number;
  activeDay: number;
  setActiveDay: (day: number) => void;
  startDate: string;
}

const DISPLAY_TIME_SLOTS = ['11:00', '12:00', '13:00', '14:00', '15:00'];

// Main Schedule Component
export const TournamentSchedule = ({ 
  matches, 
  days, 
  activeDay, 
  setActiveDay, 
  startDate 
}: ScheduleProps) => {
  const currentDate = getDateForDay(startDate, activeDay);
  const formattedDate = formatDateString(currentDate);

  // Group and distribute matches
  const matchesByTableAndTime = distributeMatches(matches);

  return (
    <div className="px-12 py-8">
      <h6 className="font-semibold mb-8">Ajakava</h6>
      
      <ScheduleFilters 
        days={days} 
        activeDay={activeDay} 
        setActiveDay={setActiveDay} 
      />
      
      <div className="mt-4 mb-6">
        <p className="p-2">{formattedDate}</p>
      </div>
      
      {/* TABLE */}
      <ScrollArea className="w-full pr-4">
        <div className="min-w-max">
          {/* Time Headers */}
          <div className="flex">
            <div className="w-32 flex-shrink-0 p-4 text-center font-medium">
              26.03
            </div>
            {DISPLAY_TIME_SLOTS.map((time, index) => (
              <div key={time} className="w-40 p-4 text-center font-medium">
                {index === DISPLAY_TIME_SLOTS.length - 1 ? `mvk ${time}` : time}
              </div>
            ))}
          </div>
          
          {/* Table Rows */}
          {Object.entries(matchesByTableAndTime).map(([table, timeSlots]) => (
            <TableRow 
              key={table} 
              table={table} 
              timeSlots={timeSlots} 
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const distributeMatches = (matches: MatchWrapper[]) => {
  const tableTimeGrid: Record<string, Record<string, MatchWrapper[]>> = {};
  
  const validMatches = matches.filter(match => 
    match.p1.id !== "" && match.p2.id !== ""
  );
  
  const tables = [...new Set(validMatches.map(match => match.match.extra_data.table))];
  
  // Initialize structure
  tables.forEach(table => {
    tableTimeGrid[table] = {};
    DISPLAY_TIME_SLOTS.forEach(time => {
      tableTimeGrid[table][time] = [];
    });
  });

  const matchesByTable = tables.reduce((acc, table) => {
    acc[table] = validMatches.filter(match => match.match.extra_data.table === table);
    return acc;
  }, {} as Record<string, MatchWrapper[]>);
  
  // Distribute matches to time slots
  tables.forEach(table => {
    matchesByTable[table].forEach((match, index) => {
      const timeIndex = index % DISPLAY_TIME_SLOTS.length;
      const timeSlot = DISPLAY_TIME_SLOTS[timeIndex];
      tableTimeGrid[table][timeSlot].push(match);
    });
  });
  
  return tableTimeGrid;
};

const ScheduleFilters = ({ 
  days, 
  activeDay, 
  setActiveDay 
}: {
  days: number;
  activeDay: number;
  setActiveDay: (day: number) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative w-full md:w-auto">
        <Input
          type="text"
          placeholder="Otsi"
          className="h-12 pl-4 pr-10 py-2 text-sm bg-[#F7F6F7] focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      
      <Button variant="ghost" className="h-12 flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm bg-[#F7F6F7]">
        <span>Päev {activeDay + 1}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      <Button variant="ghost" className="h-12 flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm bg-[#F7F6F7]">
        <span>Kõik tabelid</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

const TableRow = ({ 
  table, 
  timeSlots 
}: {
  table: string;
  timeSlots: Record<string, MatchWrapper[]>;
}) => {
  return (
    <div className="flex border-t">
      <div className="w-32 flex-shrink-0 bg-gray-100 p-4 flex items-center justify-center">
        <h3 className="text-base font-medium">Laud {table}</h3>
      </div>
      
      {DISPLAY_TIME_SLOTS.map((time) => (
        <MatchCell 
          key={`${table}-${time}`} 
          matches={timeSlots[time] || []}
        />
      ))}
    </div>
  );
};

const MatchCell = ({ matches }: { matches: MatchWrapper[] }) => {
  if (!matches.length) {
    return <div className="border-l p-4 min-w-[150px]"></div>;
  }
  
  return (
    <div className="border-l p-2 max-w-[150px]">
      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.match.id} className="p-2 border-b border-gray-100 last:border-0">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm text-stone-700">
                  {match.p1.name}
                </span>
                <span className="text-xs">R{match.match.round}</span>
              </div>
              <div className="font-medium text-sm text-[#575757]">
                {match.p2.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TournamentSchedule;