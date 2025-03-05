import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { UseGetBlogsOption } from '@/queries/blogs'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { categories } from '@/lib/utils'

const categoryMapping: Record<string, string> = categories.reduce((acc, cat) => ({
    ...acc,
    [cat.label]: cat.id
}), {});

const reverseCategoryMapping: Record<string, string> = categories.reduce((acc, cat) => ({
    ...acc,
    [cat.id]: cat.label
}), {});

const displayCategories = categories.map(cat => cat.label);

export const Route = createFileRoute('/uudised/')({
    component: RouteComponent,
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
        const articles_data = await queryClient.ensureQueryData(
            UseGetBlogsOption(deps.page, deps.category, deps.search)
        )
        return articles_data
    }
})

export default function RouteComponent() {
    const articles_data = Route.useLoaderData()
    const { category, page, search } = Route.useSearch()
    const navigate = Route.useNavigate()

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)

        navigate({
            search: (prev) => ({
                ...prev,
                search: searchInput || undefined,
                page: 1
            }),
            replace: true
        })
    }

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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Uudised</h1>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="w-full md:w-auto flex items-center gap-4">
                        <p className="text-sm font-medium  ">Otsi kategooria järgi:</p>
                        <Tabs value={activeDisplayCategory} className="w-full md:w-auto">
                            <TabsList className="bg-transparent flex flex-wrap gap-2">
                                <TabsTrigger
                                    value="all"
                                    onClick={() => handleCategoryChange('all')}
                                    className="px-4 py-1 bg-white border border-gray-300 rounded-full data-[state=active]:border-blue-400 data-[state=active]:border-2"
                                >
                                    Kõik
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

                    <form onSubmit={handleSearch} className="flex w-full md:w-64">
                        <Input
                            type="text"
                            placeholder="Otsi sisu järgi"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="rounded-r-none"
                        />
                        <Button type="submit" variant="default" className="rounded-l-none bg-blue-400">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>

            {articles_data.data.blogs.length > 0 && (
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    {articles_data.data.blogs.slice(0, 3).map((article, index) => (
                        <Card key={index} className="w-full md:w-1/3">
                            <div className="flex flex-col">
                                <div className="md:w-full h-64 md:h-48">
                                    {article.has_image && article.image_url ? (
                                        <img
                                            src={article.image_url}
                                            alt={article.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">No image available</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 md:w-2/3">
                                    <CardTitle className="text-xl font-bold">{article.title}</CardTitle>
                                    <p className="text-sm text-gray-500 mb-3">
                                        {formatDate(article.created_at)}
                                    </p>
                                    <CardContent className="px-0 py-2">
                                        <p className="text-gray-700 text-sm">
                                            {truncateDescription(article.description || '')}
                                        </p>
                                    </CardContent>
                                    <div className="border-t border-gray-200 mt-2 pt-2">
                                        <Link to={`/uudised/${article.id}`}>
                                            <Button variant="link" className="text-blue-600 p-0">
                                                Loe edasi →
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <div className="flex mt-[10px]">
                <div className="w-full md:w-1/2 space-y-6">
                    {articles_data.data.blogs.slice(3).map((article) => (
                        <Link key={article.id} to={`/uudised/${article.id}`}>
                            <div className="flex p-2 border-b h-[96px] border-gray-200 cursor-pointer hover:bg-gray-50 rounded">
                                <div className="flex-1 flex flex-col h-full justify-between">
                                    <h3 className="font-medium text-lg">{article.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(article.created_at)}
                                    </p>
                                </div>
                                <div className="w-[176px] h-full ml-4">
                                    {article.has_image && article.image_url ? (
                                        <img
                                            src={article.image_url}
                                            alt={article.title}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                                            <span className="text-xs text-gray-400">No image</span>
                                        </div>
                                    )}
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
