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
        <div className={cn(`border rounded-md p-2 px-4 mb-3 cursor-pointer shadow-sm relative  ${isCompleted ? "bg-[#D2D8DD]" : "bg-[#F0F4F7]"} hover:shadow-md transition-shadow`)}
            onClick={() => router.navigate({ to: "/voistlused/" + id })}
        >
            <div className="text-sm text-gray-700 font-bold">{date}</div>
            <div className="font-bold text-[16px]">{name}</div>
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
