import * as React from 'react';
import { Check, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from '@tanstack/react-router';

interface TournamentCardProps {
    id: number;
    date: string;
    name: string;
    location: string;
    isCompleted: boolean;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
    date,
    name,
    location,
    id,
    isCompleted,
}) => {
    const router = useRouter()
    return (
        <div className={cn(` group flex flex-col bg-[#ECEFF2]/55 hover:bg-[#f9f9f9]  py-2 px-3 rounded-md shadow-sm cursor-pointer text-stone-800  ${isCompleted ? "bg-[#D2D8DD]" : "bg-[#F0F4F7]"}  transition-shadow`)}
            onClick={() => router.navigate({ to: "/voistlused/" + id })}
        >
            <div className="text-sm text-stone-700 font-semibold">{date}</div>
            <h6 className="font-semibold">{name}</h6>
            <div className="flex items-center text-sm mt-2 text-gray-600">
                <MapPin size={14} className="mr-1 flex-shrink-0" />
                <span>{location}</span>
            </div>

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
