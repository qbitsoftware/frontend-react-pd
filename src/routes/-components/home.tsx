'use client'

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
        { id: 1, title: 'Eesti meeskond särab Euroopa meistrivõistlustel', date: '2024-02-28', category: 'Rahvusvaheline' },
        { id: 2, title: 'Noorte arendusprogramm käivitatud', date: '2024-02-25', category: 'Noored' },
        { id: 3, title: 'Uued treeningrajatised avatud Tallinnas', date: '2024-02-20', category: 'Rajatised' },
    ]

    const [heroControls, heroRef] = useFadeIn()
    const [tournamentsControls, tournamentsRef] = useFadeIn(0.2)
    const [newsControls, newsRef] = useFadeIn(0.4)

    return (
        <div className="bg-gradient-to-b from-white to-gray-100 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.section
                    className="mb-16 text-center"
                    ref={heroRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroControls}
                >
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">{t('title')}</h1>
                    <p className="text-xl text-gray-600 mb-8">{t('description.part1')}</p>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">Uuri võistlusi</Button>
                </motion.section>

                <motion.section
                    className="mb-16"
                    ref={tournamentsRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={tournamentsControls}
                >
                    <h2 className="text-3xl font-semibold text-gray-900 mb-6">Tulevased võistlused</h2>
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nimi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kuupäev</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asukoht</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {upcomingTournaments.map((tournament) => (
                                    <tr key={tournament.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tournament.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tournament.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tournament.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/voistlused/${tournament.id}`} className="text-blue-600 hover:text-blue-900">Üksikasjad</Link>
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
                >
                    <h2 className="text-3xl font-semibold text-gray-900 mb-6">Viimased uudised</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recentBlogs.map((blog) => (
                            <div key={blog.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <p className="text-sm font-medium text-blue-600 mb-1">{blog.category}</p>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{blog.title}</h3>
                                    <p className="text-gray-500 mb-4">{blog.date}</p>
                                    <Link href={`/uudised/${blog.id}`}>
                                        <Button variant="outline" className="w-full">Loe edasi</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </div>
    )
}