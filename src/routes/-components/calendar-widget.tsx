import React from 'react'
import { MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tournament } from '@/types/types';
import { useRouter } from '@tanstack/react-router';

interface Props {
  tournaments: Tournament[] | null
}

const CalendarWidget: React.FC<Props> = ({ tournaments }) => {
  const router = useRouter()
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!tournaments) {
    return (
      <div className="flex flex-col space-y-2 h-full overflow-y-auto">
        <div className="flex flex-col bg-[#F0F4F7]/60 py-2 px-4 rounded-sm text-stone-800">
          <p className="font-bold pb-1 text-center">Hetkel tulevased turniirid puuduvad</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className='h-full'>
      <div className="flex flex-col space-y-2 h-full overflow-y-auto">
        {tournaments.map((tournament) => (new Date(tournament.start_date) >= new Date()) && (
          <div key={tournament.id} className="flex flex-col bg-[#F0F4F7]/60 py-2 px-4 rounded-sm text-stone-800 cursor-pointer"
            onClick={() => router.navigate({ to: "/voistlused/" + tournament.id })}
          >
            <h6 className="font-semibold pb-1 ">{formatDate(tournament.start_date)}</h6>
            <span className="font-medium pb-1">{tournament.name}</span>
            <p className="flex items-center gap-1"><MapPin className="h-4 w-4" />{tournament.location}</p>
          </div>
        ))}
      </div>

    </ScrollArea>
  )
}

export default CalendarWidget
