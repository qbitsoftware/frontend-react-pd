import React, {useMemo} from 'react'
import { MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tournament } from '@/types/types';
import { useRouter } from '@tanstack/react-router';
import Sfumato from "@/components/sfumato/sfumato"

interface Props {
  tournaments: Tournament[] | null
}

const CalendarWidget: React.FC<Props> = ({ tournaments }) => {
  const router = useRouter()
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit'
    }).replace(/\//g, '.')
  };

  const tournamentsByMonth = useMemo(() => {
    if (!tournaments) return [];

    const futureTournaments = tournaments
      .filter(tournament => new Date(tournament.start_date) >= new Date())
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    const grouped: Record<string, Tournament[]> = {};
    
    futureTournaments.forEach(tournament => {
      const date = new Date(tournament.start_date);
      const monthYear = date.toLocaleDateString('et-EE', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      
      grouped[monthYear].push(tournament);
    });
    
    return grouped;
  }, [tournaments]);


  if (!tournaments || !tournamentsByMonth || Object.keys(tournamentsByMonth).length === 0) {
    return (
      <div className="flex flex-col space-y-2 h-full overflow-y-auto">
        <div className="flex flex-col bg-[#F0F4F7]/60 py-2 px-4 rounded-sm text-stone-800">
          <p className="font-bold pb-1 text-center">Hetkel tulevased turniirid puuduvad</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className='h-full pt-2'>
      <div className="flex flex-col space-y-4 h-full overflow-y-auto ">
        {Object.entries(tournamentsByMonth).map(([monthYear, tournaments]) => (
          <div key={monthYear} className="space-y-2 ">
          <Sfumato/>
            <h5 className="capitalize font-semibold text-stone-800/80">{monthYear}</h5>

          {tournaments.map((tournament) => (
            <div key={tournament.id} className="group flex flex-col bg-[#F2F7FD] hover:bg-[#F2F7FD]/80 space-y-2 py-2 px-3 rounded-md shadow-scheduleCard border border-[#eeeeee] text-stone-800 cursor-pointer"
            onClick={() => router.navigate({ to: "/voistlused/" + tournament.id })}
          >
            <h6 className="font-semibold flex flex-col text-stone-800">{formatDate(tournament.start_date)}
              <span className="group-hover:underline">{tournament.name}</span>
            </h6>
            
            <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{tournament.location}</p>
          </div>
          ))}
          </div>
        ))}
      </div>

    </ScrollArea>
  )
}

export default CalendarWidget
