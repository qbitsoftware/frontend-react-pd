import * as React from 'react';
import TournamentCard from './TournamentCard';
import { Tournament } from '@/types/types';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';


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

    return (
        <div className="py-4">
            <div className="rounded-lg bg-white px-6 py-6 space-y-4">
                <h2>{t("calendar.title")}</h2>
                <div className="p-1 rounded-t-[2px] mb-1 bg-[#F0F4F7] w-full ">
                    <Tabs
                        defaultValue={selectedYear.toString()}
                        value={selectedYear.toString()}
                        onValueChange={(value) => setSelectedYear(parseInt(value))}
                        className=""
                    >
                        <TabsList className="w-1/2 flex">
                            {availableYears.map(year => (
                                <TabsTrigger
                                    key={year}
                                    value={year.toString()}
                                    className="flex-1 py-[5px]"
                                >
                                    {year}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
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

                                    <div className="space-y-1">

                                        {month.tournaments.length > 0 ? (

                                            month.tournaments.map(tournament => (
                                                <TournamentCard
                                                    id={tournament.id}
                                                    key={tournament.id}
                                                    date={formatDate(tournament.start_date)}
                                                    name={tournament.name}
                                                    location={tournament.location}
                                                    isCompleted={tournament.state === 'completed'}
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
