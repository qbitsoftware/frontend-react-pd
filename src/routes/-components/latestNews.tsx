import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next";

export function LatestNews() {

    const recentBlogs = [
        { id: 1, title: 'Eesti meeskond särab Euroopa meistrivõistlustel', date: '2024-02-28', category: 'Rahvusvaheline', image: "/test/blog.jpg" },
        { id: 2, title: 'Noorte arendusprogramm käivitatud', date: '2024-02-25', category: 'Noored', image: "/test/blog.jpg" },
        { id: 3, title: 'Uued treeningrajatised avatud Tallinnas', date: '2024-02-20', category: 'Rajatised', image: "/test/blog.jpg" },
    ]

    const { t } = useTranslation();

    return (
        <div>
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
                                <Button variant="outline" className="w-full border border-blue-500">{t('homepage.news.read_more')}</Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}