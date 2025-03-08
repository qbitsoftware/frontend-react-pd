import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { MatchWrapper } from '@/types/types';
import { formatDateString } from '@/lib/utils'

interface ScheduleLayoutProps {
  children: React.ReactNode;
  days: number;
  activeDay: number;
  setActiveDay: (day: number) => void;
  startDate: string;
}

const getDateForDay = (startDate: string, dayIndex: number): string => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + dayIndex);
  return date.toISOString();
}

export const ScheduleLayout = ({ children, days, activeDay, setActiveDay, startDate }: ScheduleLayoutProps) => {
  const currentDate = getDateForDay(startDate, activeDay);
  const formattedDate = formatDateString(currentDate);
  return (
    <div className="p-12 bg-white">
      <div className="max-h-screen rounded-lg">
        <div className="flex flex-col h-full">
          <div className="flex-none">
            <div className="">
              <Filters days={days} activeDay={activeDay} setActiveDay={setActiveDay} />
            </div>
          </div>
          <p className="p-2">{formattedDate}</p>
          <div className="flex-1 min-h-0">
            <ScrollArea className="w-full h-full whitespace-nowrap">
              <div className="inline-flex space-x-4 py-4 px-4 ">
                {children}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TableCard = ({ title, matches }: { title: string; matches: MatchWrapper[] }) => {
  return (
    <div className="inline-block w-80 bg-[#F9F8F8] rounded-md shadow-scheduleCard">
      <div className="py-4">
        <div className="border-b mb-2">
          <h2 className="text-xl font-bold text-center text-[#565656] mb-4">{title}</h2>
        </div>
        
        <ScrollArea className="h-[60vh]">
          <div className="space-y-1 pr-4 pl-1">
            {matches.map((match) => (
              <MatchTicket key={match.match.id} match={match} />
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      </div>
    </div>
  );
};

export const MatchTicket = ({ match }: { match: MatchWrapper }) => {
  const date = new Date(match.match.start_date);
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="flex items-center w-full p-2 bg-white rounded hover:bg-gray-100 transition-colors cursor-pointer border border-[#F5F4F4]">
      <span className="bg-[#F1F5F9] w-1/6 text-sm text-center rounded-sm">
        {time}
      </span>
      <div className="w-2/3 font-medium text-[#575757] space-y-1 px-4">
        <p className="">
          {match.p1.id !== "" ? match.p1.name : "Player 1"}
        </p>
        <p className="">
          {match.p2.id !== "" ? match.p2.name : "Player 2"}
        </p>
      </div>
      <div className="w-1/6 text-xs text-right">
        Round {match.match.round}
      </div>
    </div>
  );
};

interface FiltersProps {
  days: number;
  activeDay: number;
  setActiveDay: (day: number) => void;
}

export const Filters = ({ days, activeDay, setActiveDay }: FiltersProps) => {

  return (
    <div className="flex flex-col md:flex-row lg:justify-between  px-1 rounded-[6px] gap-8 mb-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Otsi"
            className="h-12 w-full pl-4 pr-10 py-2 border rounded-lg text-sm bg-[#F7F6F7] focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button variant="ghost" className="h-12 flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm bg-[#F7F6F7]">
          <span>Päev 1</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button variant="ghost" className="h-12 flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm bg-[#F7F6F7]">
          <span>Kõik tabelid</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      {/*<div className="flex flex-wrap md:flex-nowrap md:space-x-2  py-3 px-2 rounded-md">
        {days > 1 && [...Array(days)].map((_, index) => (
          <Button
            variant={activeDay === index ? "outline" : "ghost"}
            className={`
                    h-8 rounded-sm
                  ${activeDay === index
                ? "border-none shadow-sm bg-white hover:bg-white"
                : "hover:bg-gray-100/90 active:bg-gray-200/90"
              }
                  transition-all duration-200
                  
                  disabled:opacity-50
                `}
            key={index}
            onClick={() => setActiveDay(index)}
          >
            Päev {index + 1}
          </Button>
        ))}
      </div> */}
      
      
    </div>
  );
};

interface ScheduleProps {
  matches: MatchWrapper[];
  days: number;
  activeDay: number;
  setActiveDay: (day: number) => void;
  startDate: string
}

export const Schedule: React.FC<ScheduleProps> = ({ matches, activeDay, setActiveDay, days, startDate }) => {

  const matchesByTable = matches.reduce((acc, match) => {
    const table = match.match.extra_data.table;
    if (!acc[table]) {
      acc[table] = [];
    }
    acc[table].push(match);
    return acc;
  }, {} as Record<string, MatchWrapper[]>);

  return (
    <ScheduleLayout days={days} activeDay={activeDay} setActiveDay={setActiveDay} startDate={startDate}
    >
      {Object.entries(matchesByTable).map(([table, tableMatches]) => (
        <TableCard
          key={table}
          title={`Laud ${table}`}
          matches={tableMatches}
        />
      ))}
    </ScheduleLayout>
  );
};