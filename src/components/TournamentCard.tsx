import * as React from 'react';
import { Check, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from '@tanstack/react-router';

interface TournamentCardProps {
    id: number;
    date: string;
    name: string;
    location: string;
    category: string;
    isCompleted: boolean;
    hasEnded: boolean;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
    date,
    name,
    location,
    id,
    category,
    isCompleted,
    hasEnded
}) => {
    const router = useRouter()
    return (
        <div className={cn(`relative rounded-tl-[2px] rounded-tr-[6px] rounded-br-[6px] rounded-bl-[2px] border-l-4 border-[#90D3FF] group flex flex-col bg-white hover:bg-[#f9f9f9]  py-2 px-3 shadow-eventCard cursor-pointer text-stone-800 ${hasEnded && "shadow-sm bg-[#EEEFF2] border-none rounded-[6px]"}  transition-shadow`)}
            onClick={() => router.navigate({ to: "/voistlused/" + id })}
        >
            <div className="text-sm text-stone-700 font-semibold">{date}</div>
            <h6 className="font-bold text-[#212121]">{name}</h6>
            <div className="flex items-center text-sm mt-2 text-gray-600">
                <MapPin size={14} className="mr-1 flex-shrink-0" />
                <span className="capitalize">{location}</span>
            </div>
            <p className="text-xs absolute top-2 right-2">{category}</p>

            {
                isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-100 rounded-full p-1">
                        <Check size={16} className="text-green-600" />
                    </div>
                )
            }
        </div >
    );
};

export default TournamentCard;
