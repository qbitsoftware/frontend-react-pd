import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { useFadeIn } from '@/hooks/useFadeIn'
import { useTranslation } from 'react-i18next';

export default function Home() {
    const { t } = useTranslation();

    const upcomingTournaments = [
        { id: 1, name: 'Tallinna Lahtised', date: '2024-03-15', location: 'Tallinn' },
        { id: 2, name: 'Tartu Meistrivõistlused', date: '2024-04-02', location: 'Tartu' },
        { id: 3, name: 'Pärnu Suvekarikas', date: '2024-06-20', location: 'Pärnu' },
    ]

    const recentBlogs = [
        { id: 1, title: 'Eesti meeskond särab Euroopa meistrivõistlustel', date: '2024-02-28', category: 'Rahvusvaheline', image: "/test/blog.jpg" },
        { id: 2, title: 'Noorte arendusprogramm käivitatud', date: '2024-02-25', category: 'Noored', image: "/test/blog.jpg" },
        { id: 3, title: 'Uued treeningrajatised avatud Tallinnas', date: '2024-02-20', category: 'Rajatised', image: "/test/blog.jpg" },
    ]

    const bestPerformers = [
        { nr: 1, id: "EE001", pp: 2500, rp: 2450, firstName: "Andres", lastName: "Kask", birthYear: 1995, club: "Tallinn TTC", rankChange: 2 },
        { nr: 2, id: "EE002", pp: 2450, rp: 2500, firstName: "Maria", lastName: "Tamm", birthYear: 1997, club: "Tartu PP", rankChange: -1 },
        { nr: 3, id: "EE003", pp: 2400, rp: 2400, firstName: "Jaan", lastName: "Lepp", birthYear: 1993, club: "Pärnu Paddlers", rankChange: 1 },
        { nr: 4, id: "EE004", pp: 2350, rp: 2350, firstName: "Liis", lastName: "Kuusk", birthYear: 1999, club: "Narva Net Smashers", rankChange: -1 },
        { nr: 5, id: "EE005", pp: 2300, rp: 2300, firstName: "Mart", lastName: "Mägi", birthYear: 1996, club: "Viljandi Victory", rankChange: 0 },
    ]


    const [heroControls, heroRef] = useFadeIn()
    const [tournamentsControls, tournamentsRef] = useFadeIn(0.2)
    const [newsControls, newsRef] = useFadeIn(0.2)

    return (
        <div className="bg-gradient-to-b from-white to-gray-200 ">
            <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('/test/table_tennis_background.png?height=1080&width=1920')" }}>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <motion.div
                        className="text-center text-white"
                        ref={heroRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={heroControls}
                    >
                        <h1 className="text-5xl font-bold mb-4">{t('homepage.title')}</h1>
                        <p className="text-xl mb-8">{t('homepage.description')}</p>
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">{t('homepage.title_button')}</Button>
                    </motion.div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.section
                    className="mb-16"
                    ref={tournamentsRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={tournamentsControls}
                >
                    <h2 className="text-3xl font-semibold text-gray-900 mb-6">{t('homepage.upcoming_tournaments')}</h2>
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">{t('homepage.tournaments.name')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">{t('homepage.tournaments.date')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('homepage.tournaments.location')}</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {upcomingTournaments.map((tournament) => (
                                    <tr key={tournament.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tournament.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tournament.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tournament.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/voistlused/${tournament.id}`} className="text-blue-600 hover:text-blue-900">{t('homepage.details')}</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.section>

                <motion.section
                    ref={newsRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={newsControls}
                    className='mb-16'
                >
                    <h2 className="text-3xl font-semibold text-gray-900 mb-6">{t('homepage.latest_news')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recentBlogs.map((blog) => (
                            <div key={blog.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <img src={blog.image} alt={blog.title} width={300} height={300} className="w-full h-[300px] object-cover" />
                                <div className="p-6">
                                    <p className="text-sm font-medium text-blue-600 mb-1">{blog.category}</p>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{blog.title}</h3>
                                    <p className="text-gray-500 mb-4">{blog.date}</p>
                                    <Link href={`/uudised/${blog.id}`}>
                                        <Button variant="outline" className="w-full">{t('homepage.news.read_more')}</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>
                <motion.section
                    ref={newsRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={newsControls}
                >
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
                </motion.section>
            </div>
        </div>
    )
}