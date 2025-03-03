import * as React from 'react';
import TournamentCard from './TournamentCard';
import { Tournament } from '@/types/types';

interface CalendarViewProps {
    tournaments: Tournament[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tournaments }) => {
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
        <div className="w-full bg-white p-4 rounded-lg shadow-sm">
            {/* Year filter as tabs */}
            <div className="sticky top-0 z-10 bg-white pb-2 border-b mb-6">
                <div className="flex flex-wrap justify-center w-full">
                    {availableYears.map(year => (
                        <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={`px-6 py-3 border-b-2 mx-1 transition-colors ${selectedYear === year
                                ? 'border-blue-600 text-blue-600 font-medium'
                                : 'border-transparent hover:border-gray-300 text-gray-600'
                                }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calendar grid - scrollable */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[calc(100vh-320px)] overflow-y-auto pr-2">
                {columns.map((columnMonths, columnIndex) => (
                    <div key={columnIndex} className="space-y-8">
                        {columnMonths.map(month => (
                            <div
                                key={month.name}
                                className={`mb-6 ${month.tournaments.length === 0 ? 'opacity-70' : ''}`}
                            >
                                <h2 className={`text-xl font-bold mb-4 pb-2 ${month.tournaments.length === 0
                                    ? 'text-gray-400 border-b border-gray-200'
                                    : 'border-b'
                                    }`}>
                                    {month.name} {selectedYear}
                                </h2>

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
                                    <div className="text-gray-300 italic py-2 bg-gray-50 px-3 rounded-md text-center">
                                        No tournaments
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarView;
