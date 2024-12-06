import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function TopMonthPerformers() {

    const { t } = useTranslation();
    const bestPerformers = [
        { nr: 1, id: "EE001", pp: 2500, rp: 2450, firstName: "Andres", lastName: "Kask", birthYear: 1995, club: "Tallinn TTC", rankChange: 2 },
        { nr: 2, id: "EE002", pp: 2450, rp: 2500, firstName: "Maria", lastName: "Tamm", birthYear: 1997, club: "Tartu PP", rankChange: -1 },
        { nr: 3, id: "EE003", pp: 2400, rp: 2400, firstName: "Jaan", lastName: "Lepp", birthYear: 1993, club: "Pärnu Paddlers", rankChange: 1 },
        { nr: 4, id: "EE004", pp: 2350, rp: 2350, firstName: "Liis", lastName: "Kuusk", birthYear: 1999, club: "Narva Net Smashers", rankChange: -1 },
        { nr: 5, id: "EE005", pp: 2300, rp: 2300, firstName: "Mart", lastName: "Mägi", birthYear: 1996, club: "Viljandi Victory", rankChange: 0 },
    ]
    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">{t('homepage.best_performers.title')}</h2>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-5">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">NR</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">PP</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">RP</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">First Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Birth Year</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Club</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {bestPerformers.map((performer) => (
                                <tr key={performer.id} className="hover:bg-blue-50 transition-colors duration-200">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {performer.nr}
                                        {performer.rankChange > 0 && <span className="text-green-600 ml-1">▲</span>}
                                        {performer.rankChange < 0 && <span className="text-red-600 ml-1">▼</span>}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{performer.id}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{performer.pp}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{performer.rp}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{performer.firstName}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{performer.lastName}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{performer.birthYear}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{performer.club}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='text-center'>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">{t('homepage.best_performers.button')}</Button>
            </div>
        </div>
    )
}