import { Button } from "@/components/ui/button"
import { Article } from "@/types/types";
import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next";

interface LatestArticlesProps {
    articles: Article[]
}

export const LatestArticles:React.FC<LatestArticlesProps> = ({articles}) => {
    const { t } = useTranslation();

    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">{t('homepage.latest_news')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles.map((blog) => (
                    <div key={blog.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img src={blog.thumbnail} alt={blog.title} width={300} height={300} className="w-full h-[300px] object-cover" />
                        <div className="p-6">
                            <p className="text-sm font-medium text-blue-600 mb-1">{blog.category}</p>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{blog.title}</h3>
                            <p className="text-gray-500 mb-4">{blog.created_at}</p>
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