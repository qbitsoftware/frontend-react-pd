import * as React from 'react';
import TournamentCard from './TournamentCard';
import { Tournament } from '@/types/types';
import { useTranslation } from 'react-i18next';
import {Button} from "@/components/ui/button";
import {ChevronDown, Search} from "lucide-react";


interface CalendarViewProps {
    tournaments: Tournament[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tournaments }) => {
    const { t } = useTranslation()
    const availableYears = React.useMemo(() => {
        const years = tournaments.map(tournament => new Date(tournament.start_date).getFullYear());
        return Array.from(new Set(years)).sort((a, b) => a - b);
    }, [tournaments]);

    const defaultYear = React.useMemo(() => {
        const currentYear = new Date().getFullYear();
        return availableYears.includes(currentYear)
            ? currentYear
            : availableYears[0] || currentYear;
    }, [availableYears]);

    const [selectedYear, setSelectedYear] = React.useState(defaultYear);

    const tournamentsByMonth = React.useMemo(() => {
        const filtered = tournaments.filter(
            tournament => new Date(tournament.start_date).getFullYear() === selectedYear
        );

        const grouped: Record<string, Tournament[]> = {};

        for (let i = 0; i < 12; i++) {
            const monthTournaments = filtered.filter(
                tournament => new Date(tournament.start_date).getMonth() === i
            ).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

            const monthName = new Date(selectedYear, i).toLocaleString('default', { month: 'long' });
            grouped[monthName] = monthTournaments;
        }

        return grouped;
    }, [tournaments, selectedYear]);

    const months = Object.keys(tournamentsByMonth).map(month => ({
        name: month,
        tournaments: tournamentsByMonth[month],
    }));

    const columnCount = 3;
    const monthsPerColumn = Math.ceil(months.length / columnCount);
    const columns = [];

    for (let i = 0; i < columnCount; i++) {
        columns.push(months.slice(i * monthsPerColumn, (i + 1) * monthsPerColumn));
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const isTournamentEnd = (endDate: string) => {
        const now = new Date();
        const tournamentEndDate = new Date(endDate);
        return now > tournamentEndDate;
    };


    return (
        <div className="py-4">
            <div className="rounded-lg bg-white px-12 py-6 space-y-4 ">
                <h2 className="font-bold">{t("calendar.title")}</h2>
                <div className="p-2 rounded-[6px] flex space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Otsi turniiri"
                            className="h-12 w-full pl-4 pr-10 py-2 border rounded-lg text-sm bg-[#F7F6F7] focus:outline-none focus:ring-1 focus:ring-gray-300"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>

                    <Button variant="ghost" className="h-12 flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm bg-[#F7F6F7]">
                        <span>Kõik kategooriad</span>
                        <ChevronDown className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" className="h-12 flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm bg-[#F7F6F7]">
                        <span>2025</span>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                    
            </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {columns.map((columnMonths, columnIndex) => (
                        <div key={columnIndex} className="space-y-8">
                            {columnMonths.map(month => (
                                <div
                                    key={month.name}
                                    className={`mb-6 ${month.tournaments.length === 0 ? 'opacity-70' : ''}`}
                                >
                                    <h2 className={`text-xl font-bold pb-2 pl-1 ${month.tournaments.length > 0 ? 'text-stone-700' : 'text-stone-400'}`}>
                                        {month.name} {selectedYear}
                                    </h2>

                                    <div className="space-y-2">

                                        {month.tournaments.length > 0 ? (

                                            month.tournaments.map(tournament => (
                                                <TournamentCard
                                                    id={tournament.id}
                                                    key={tournament.id}
                                                    date={formatDate(tournament.start_date)}
                                                    name={tournament.name}
                                                    category={tournament.category}
                                                    location={tournament.location}
                                                    isCompleted={tournament.state === 'completed'}
                                                    hasEnded={isTournamentEnd(tournament.end_date)}
                                                />
                                            ))


                                        ) : (
                                            <div className="text-stone-400 italic py-2 bg-gray-50 px-3 rounded-md select-none">
                                                No tournaments
                                            </div>
                                        )}
                                    </div>

                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
