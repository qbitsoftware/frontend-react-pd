import TournamentCard from './TournamentCard';
import { Tournament } from '@/types/types';
import { useTranslation } from 'react-i18next';
import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from 'react';
import { UseGetTournamentCategories } from '@/queries/tournaments';


interface CalendarViewProps {
    tournaments: Tournament[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tournaments }) => {
    const { t } = useTranslation()
    const categoriesQuery = UseGetTournamentCategories()
    const availableYears = useMemo(() => {
        const years = tournaments.map(tournament => new Date(tournament.start_date).getFullYear());
        return Array.from(new Set(years)).sort((a, b) => a - b);
    }, [tournaments]);

    const categories = useMemo(() => {
        if (!categoriesQuery.data) return [];
        return categoriesQuery.data.data || [];
    }, [categoriesQuery.data]);

    const defaultYear = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return availableYears.includes(currentYear)
            ? currentYear
            : availableYears[0] || currentYear;
    }, [availableYears]);

    const [selectedYear, setSelectedYear] = useState(defaultYear);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredTournaments = useMemo(() => {
        return tournaments.filter(tournament => {
            const tournamentYear = new Date(tournament.start_date).getFullYear();
            const matchesYear = tournamentYear === selectedYear;
            const matchesCategory = selectedCategory === 'all' || tournament.category === selectedCategory;

            const matchesSearch = searchTerm === '' ||
                tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tournament.location.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesYear && matchesCategory && matchesSearch;

        });
    }, [tournaments, selectedYear, searchTerm, selectedCategory]);


    const handleYearChange = (year: string) => {
        setSelectedYear(Number(year));
    };
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const tournamentsByMonth = useMemo(() => {
        const grouped: Record<string, Tournament[]> = {};

        for (let i = 0; i < 12; i++) {
            const monthTournaments = filteredTournaments.filter(
                tournament => new Date(tournament.start_date).getMonth() === i
            ).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

            const monthKey = new Date(selectedYear, i).toLocaleString('en-US', { month: 'long' }).toLowerCase();
            const monthName = t(`calendar.months.${monthKey}`);
            grouped[monthName] = monthTournaments;
        }

        return grouped;
    }, [filteredTournaments, selectedYear, t]);


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
            <div className="lg:rounded-lg bg-white px-4 sm:px-6 md:px-12 py-6 space-y-4">
                <h2 className="font-bold">{t("calendar.title")}</h2>

                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <div className="relative w-full lg:w-1/3">
                        <input
                            type="text"
                            placeholder={t("calendar.search_placeholder") || "Search tournament"}
                            className="h-12 w-full pl-4 pr-10 py-2 border rounded-lg text-sm bg-[#F7F6F7] focus:outline-none focus:ring-1 focus:ring-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>

                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <Select
                            value={selectedCategory}
                            onValueChange={handleCategoryChange}
                            defaultValue='all'
                        >
                            <SelectTrigger className="h-12 flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm bg-[#F7F6F7] w-full sm:w-[180px]">
                                <SelectValue placeholder={t("calendar.all_categories") || "All categories"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {t("calendar.all_categories") || "All categories"}
                                </SelectItem>
                                {categories.map(category => category && category.category != "" && (
                                    <SelectItem key={category.id} value={category.category}>
                                        {category.category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedYear.toString()}
                            onValueChange={handleYearChange}
                        >
                            <SelectTrigger className="h-12 flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm bg-[#F7F6F7] w-full sm:w-[120px]">
                                <SelectValue placeholder={t("calendar.select_year") || "Select Year"} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableYears.map(year => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-4">
                    {columns.map((columnMonths, columnIndex) => (
                        <div key={columnIndex} className="space-y-6 md:space-y-8">
                            {columnMonths.map(month => (
                                <div
                                    key={month.name}
                                    className={`mb-4 md:mb-6 ${month.tournaments.length === 0 ? 'opacity-70' : ''}`}
                                >
                                    <h2 className={`text-lg md:text-xl font-bold pb-2 pl-1 ${month.tournaments.length > 0 ? 'text-stone-700' : 'text-stone-400'}`}>
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
                                                {t("calendar.no_tournaments")}
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
