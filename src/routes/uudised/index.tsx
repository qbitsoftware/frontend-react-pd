import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { UseGetBlogsOption, type BlogsResponseUser } from '@/queries/blogs'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { useTranslation } from 'react-i18next'
import ErrorPage from '@/components/error'
import { ArrowLeft, FileX } from 'lucide-react'
import axios from 'axios'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/uudised/')({
    component: RouteComponent,
    errorComponent: () => {
        return <ErrorPage />
    },
    validateSearch: z.object({
        category: z.string().optional(),
        page: z.number().optional(),
        search: z.string().optional(),
    }),
    loaderDeps: ({ search }) => ({
        category: search.category,
        page: search.page,
        search: search.search,
    }),
    loader: async ({ context: { queryClient }, deps }) => {
        let articles_data: BlogsResponseUser = { 
            data: {
              blogs: [],
              total_pages: 0
            },
            message: "Default empty state",
            error: null 
          };

        try {
            articles_data = await queryClient.ensureQueryData(
                UseGetBlogsOption(deps.page, deps.category, deps.search)
            )
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn("Blogs API returned 404")
            } else {
                throw error
            }
        }

        const dataStatus = {
            blogsEmpty: !articles_data?.data?.blogs?.length
        }

        return { articles_data, dataStatus }
    }
})

export default function RouteComponent() {
    const { articles_data, dataStatus } = Route.useLoaderData()
    const { category, page, search } = Route.useSearch()
    const navigate = Route.useNavigate()

    const { t } = useTranslation()

    const categories = [
        { id: "competitions", label: t("news.categories.competitions") },
        { id: "news", label: t("news.categories.news") },
        { id: "good_read", label: t("news.categories.good_read") },
        { id: "results", label: t("news.categories.results") }
    ];

    const categoryMapping: Record<string, string> = categories.reduce((acc, cat) => ({
        ...acc,
        [cat.label]: cat.id
    }), {});

    const reverseCategoryMapping: Record<string, string> = categories.reduce((acc, cat) => ({
        ...acc,
        [cat.id]: cat.label
    }), {});

    const displayCategories = categories.map(cat => cat.label);

    const [searchInput, setSearchInput] = useState(search || '')
    const [currentPage, setCurrentPage] = useState(page || 1)

    useEffect(() => {
        setSearchInput(search || '')
        setCurrentPage(page || 1)
    }, [search, page])

    const backendCategory = category || 'all'
    const activeDisplayCategory = backendCategory === 'all' ? 'all' :
        (reverseCategoryMapping[backendCategory] || backendCategory)

    const handleCategoryChange = (displayCategory: string) => {
        const backendValue = displayCategory === 'all' ? undefined :
            categoryMapping[displayCategory] || displayCategory

        navigate({
            search: (prev) => ({
                ...prev,
                category: backendValue,
                page: 1
            })
        })
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== search) {
                navigate({
                    search: (prev) => ({
                        ...prev,
                        search: searchInput || undefined,
                        page: 1
                    }),
                    replace: true
                })
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchInput, navigate, search])

    const handlePageChange = (page: number) => {
        navigate({
            search: (prev) => ({
                ...prev,
                page
            }),
            replace: true,
        })
        window.scrollTo(0, 0)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('et-EE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const truncateDescription = (text: string, maxLength: number = 200) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (dataStatus.blogsEmpty) {
        return (
            <div className="w-full mx-auto lg:px-4 max-w-[1440px]">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0 }}
                >
                    <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-md m-8 space-y-2">
                        <FileX className="h-12 w-12 text-stone-600" />
                        <h2 className="font-semibold">{t("news.no_news") || "No articles available"}</h2>
                        <p className="text-stone-500 pb-2">
                            {t("news.no_news_subtitle") || "There are currently no articles that match your criteria."}
                        </p>
                        <Button asChild variant="outline">
                            <Link to="/">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t("errors.general.home") || "Mine kodulehele"}
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-3">
                <h2 className="font-bold text-gray-900">{t("news.title")}</h2>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="w-full lg:w-auto flex flex-col lg:flex-row lg:items-center gap-4">
                        <p className="text-sm font-medium">{t("news.search_category")}</p>
                        <Tabs value={activeDisplayCategory} className="w-full md:w-auto">
                            <TabsList className="bg-transparent flex flex-wrap gap-2 justify-start">
                                <TabsTrigger
                                    value="all"
                                    onClick={() => handleCategoryChange('all')}
                                    className="px-4 py-1 bg-white border border-gray-300 rounded-full data-[state=active]:border-blue-400 data-[state=active]:border-2"
                                >
                                    {t("news.categories.all")}
                                </TabsTrigger>
                                {displayCategories.map((displayCategory) => (
                                    <TabsTrigger
                                        key={displayCategory}
                                        value={displayCategory}
                                        onClick={() => handleCategoryChange(displayCategory)}
                                        className="px-4 py-1 bg-white border border-gray-300 rounded-full data-[state=active]:border-blue-400 data-[state=active]:border-2"
                                    >
                                        {displayCategory}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="flex w-full md:w-64">
                        <Input
                            type="text"
                            placeholder={t("news.search_content")}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className=""
                        />
                    </div>
                </div>
            </div>

            {articles_data.data.blogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 md:flex-row items-start gap-4 mt-4">
                    {articles_data.data.blogs.slice(0, 3).map((article, index) => (
                        <Link key={article.id} to={`/uudised/${article.id}`} >
                            <Card key={index} className="bg-[#fafafa] hover:bg-white">
                                <div className="flex flex-col ">
                                    <div className="md:w-full h-64 md:h-48">
                                        {article.has_image && article.image_url ? (
                                            <img
                                                src={article.image_url}
                                                alt={article.title}
                                                className="w-full h-full object-cover rounded-t-md"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-md">
                                                <span className="text-gray-400">{t("news.no_image")}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 space-y-1">
                                        <CardTitle className="text-xl font-bold">{article.title}</CardTitle>
                                        <p className="text-sm text-stone-600 mb-3">
                                            {formatDate(article.created_at)}
                                        </p>
                                        <CardContent className="px-0 py-2">
                                            <p className="text-stone-800 text-sm">
                                                {truncateDescription(article.description || '')}
                                            </p>
                                        </CardContent>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            <div className="flex mt-4">
                <div className="w-full md:w-1/2 flex flex-col space-y-2">
                    {articles_data.data.blogs.slice(3).map((article) => (
                        <Link key={article.id} to={`/uudised/${article.id}`}>
                            <div className="flex justify-between bg-[#fafafa] hover:bg-white p-2 rounded border-b">
                                <div className="flex-1 flex flex-col h-full justify-between pr-4">
                                    <h3 className="font-medium text-lg">{article.title}</h3>
                                    <p className="text-sm text-stone-600">
                                        {formatDate(article.created_at)}
                                    </p>
                                </div>
                                <div className="w-32 flex-shrink-0">
                                    <div className="aspect-[3/2] relative">
                                        {article.has_image && article.image_url ? (
                                            <img
                                                src={article.image_url}
                                                alt={article.title}
                                                className="absolute inset-0 w-full h-full object-cover rounded"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center rounded">
                                                <span className="text-xs text-gray-400">No image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="hidden md:block md:w-1/2"></div>
            </div>

            {/* Pagination with numbers */}
            {articles_data.data.total_pages > 1 && (
                <div className="flex justify-center mt-12">
                    <nav className="flex items-center space-x-2" aria-label="Pagination">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &laquo;
                        </Button>

                        {Array.from({ length: articles_data.data.total_pages }, (_, i) => i + 1).map((page) => {
                            const shouldShow =
                                page === 1 ||
                                page === articles_data.data.total_pages ||
                                Math.abs(page - currentPage) <= 1;

                            if (shouldShow) {
                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className="w-10 h-10"
                                    >
                                        {page}
                                    </Button>
                                );
                            } else if (
                                (page === 2 && currentPage > 3) ||
                                (page === articles_data.data.total_pages - 1 && currentPage < articles_data.data.total_pages - 2)
                            ) {
                                return <span key={page} className="px-2">...</span>;
                            }
                            return null;
                        })}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === articles_data.data.total_pages}
                        >
                            &raquo;
                        </Button>
                    </nav>
                </div>
            )}
        </div>
    )
}