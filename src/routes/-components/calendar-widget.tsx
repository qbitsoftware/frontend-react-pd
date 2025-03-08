import React, { useMemo } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tournament } from '@/types/types';
import { useRouter } from '@tanstack/react-router';
import {cn} from "@/lib/utils"
import SfumatoBackground from '@/components/sfumato/sfumatoBg';


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

  const { upcomingTournaments, pastTournaments } = useMemo(() => {
    if (!tournaments) return { upcomingTournaments: [], pastTournaments: [] };

    const now = new Date();
    
    const upcoming = tournaments
      .filter(tournament => new Date(tournament.start_date) >= now)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      .slice(0, 4); 
    
    
    const past = tournaments
      .filter(tournament => new Date(tournament.start_date) < now)
      .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
      .slice(0, 4); 
    
    return { upcomingTournaments: upcoming, pastTournaments: past };
  }, [tournaments]);

  const TournamentCard = ({ tournament, hasEnded }: { tournament: Tournament, hasEnded: boolean }) => (
    <SfumatoBackground>
    <div 
      key={tournament.id} 
      className={cn(`relative rounded-tl-[2px] rounded-tr-[6px] rounded-br-[6px] rounded-bl-[2px] border-l-4 border-[#90D3FF] group flex flex-col  hover:bg-[#white] py-4 px-6 shadow-eventCard cursor-pointer text-stone-800 ${hasEnded && "shadow-sm bg-[#EEEFF2] px-4 border-none rounded-[6px]"} transition-shadow`)}
      onClick={() => router.navigate({ to: "/voistlused/" + tournament.id })}
    >

      <span className="font-medium">{formatDate(tournament.start_date)}</span>
      <h6 className={`font-bold flex flex-col text-stone-800 ${hasEnded && "font-medium"}`}>
        <span className="group-hover:underline">{tournament.name}</span>
      </h6>
      
    </div>
    </SfumatoBackground>
  );

  if (!tournaments || (!upcomingTournaments.length && !pastTournaments.length)) {
    return (
      <div className="flex flex-col space-y-2 h-full">
        <div className="flex flex-col bg-[#F0F4F7]/60 py-2 px-4 rounded-sm text-stone-800">
          <p className="font-bold pb-1 text-center">Hetkel turniirid puuduvad</p>
        </div>
      </div>
    )
  }

  return (
      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="space-y-4 ">
          <h6 className="font-medium text-stone-800/80">Tulemas</h6>
          
          <div className="space-y-2">
            {upcomingTournaments.length > 0 ? (
              upcomingTournaments.map(tournament => (
                
                <TournamentCard key={tournament.id} tournament={tournament} hasEnded={false} />
                
              ))
            ) : (
              <div className="flex flex-col bg-[#F0F4F7]/60 py-2 px-4 rounded-sm text-stone-800">
                <p className="text-center">Pole</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h6 className="font-medium text-stone-800/80">Lõppenud</h6>
          
          <div className="space-y-2">
            {pastTournaments.length > 0 ? (
              pastTournaments.map(tournament => (
                <TournamentCard key={tournament.id} tournament={tournament} hasEnded={true} />
              ))
            ) : (
              <div className="flex flex-col bg-[#F0F4F7]/60 py-2 px-4 rounded-sm text-stone-800">
                <p className="text-center">Pole</p>
              </div>
            )}
          </div>
        </div>
      </div>
  )
}

export default CalendarWidget