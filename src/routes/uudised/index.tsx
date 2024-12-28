import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useFadeIn } from '@/hooks/useFadeIn'
import { BlogCard } from './-components/blog-card'
import { UseGetArticles } from '@/queries/articles'



export const Route = createFileRoute('/uudised/')({
    component: RouteComponent,
    loader: async ({ context: { queryClient } }) => {
        const articles_data = queryClient.ensureQueryData(UseGetArticles())
        return articles_data
    }
})


interface SearchParams {
    [key: string]: string;
}

export default function RouteComponent() {

    const articles_data = Route.useLoaderData()

    const [activeCategory, setActiveCategory] = useState('All')
    const [searchParams, setSearchParams] = useState<SearchParams>({});
    const { t } = useTranslation()
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    const [heroControls, heroRef] = useFadeIn()
    
    const blogCategories = [...new Set(articles_data.data.map(blog => blog.category.split('/').map(category => category.trim())).flat())];
    console.log(blogCategories)
    const blogCategoriesDisplay = [t('navbar.menu.news.all'), t('navbar.menu.news.announcements'), t('navbar.menu.news.tournaments'), t('navbar.menu.news.newsletter')]

    useEffect(() => {
        const queryString = window.location.search;

        const params = new URLSearchParams(queryString);

        const paramsObj: SearchParams = {};
        for (const [key, value] of params.entries()) {
            paramsObj[key] = value;
        }

        setSearchParams(paramsObj);
    }, []);

    useEffect(() => {
        if (searchParams['category'] && blogCategories.includes(searchParams['category'])) {
            setActiveCategory(searchParams['category'])
        }
    }, [searchParams])

    const filtered_articles = activeCategory === 'All'
        ? articles_data.data
        : articles_data.data.filter(article => article.category.includes(activeCategory))

    const totalPages = Math.ceil(filtered_articles.length / ITEMS_PER_PAGE)
    const paginated_articles = filtered_articles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const handleCategoryChange = (index: number) => {
        setActiveCategory(blogCategories[index])
        setCurrentPage(1)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('news.title')}</h1>

            <Tabs value={activeCategory} className="mb-8">
                <TabsList className="bg-blue-100 p-1 rounded-lg">
                    {blogCategoriesDisplay.map((category, index) => (
                        <TabsTrigger
                            key={category}
                            value={blogCategories[index]}
                            onClick={() => handleCategoryChange(index)}
                            className="px-4 py-2 rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        >
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>


            <div className="space-y-12">

                {paginated_articles.length > 0 && (
                    <>
                        <motion.div
                            className="text-center text-white"
                            ref={heroRef}
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroControls}
                        >
                            {/* <Card className="overflow-hidden bg-blue-500 text-white">
                                <div className="md:flex items-center">
                                    <div className="md:w-1/3 p-8">
                                        <CardHeader>
                                            <div className="uppercase tracking-wide text-sm font-semibold">{paginated_articles[0].category}</div>
                                            <CardTitle className="mt-2 text-2xl">{paginated_articles[0].title}</CardTitle>
                                        </CardHeader>
                                        <CardFooter>
                                            <Link to={`/uudised/${paginated_articles[0].id}`}>
                                                <Button variant="secondary" className="mt-4">Read More</Button>
                                            </Link>
                                        </CardFooter>
                                    </div>
                                    <div className="md:w-2/3 h-32 md:h-full overflow-hidden">
                                        {paginated_articles[0].thumbnail ? (
                                            <img
                                                src={paginated_articles[0].thumbnail}
                                                alt={paginated_articles[0].title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-blue-400 flex items-center justify-center">
                                                {paginated_articles[0].thumbnail ? (
                                                    <img
                                                        src={paginated_articles[0].thumbnail}
                                                        alt={paginated_articles[0].title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img src="/racket.svg" alt={paginated_articles[0].title} className="w-full h-full object-fill" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card> */}

                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            {paginated_articles.slice(1, 3).map(blog => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {paginated_articles.slice(3, 7).map(blog => (
                                    <BlogCard key={blog.id} blog={blog} />
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            {paginated_articles.slice(7, 9).map(blog => (
                                <Card key={blog.id} className="overflow-hidden">
                                    <div className="md:flex flex-col md:flex-row-reverse">
                                        <div className="md:w-1/2 h-48 md:h-full overflow-hidden">
                                            {blog.thumbnail ? (
                                                <img
                                                    src={blog.thumbnail}
                                                    alt={blog.title}
                                                    className="w-full h-full object-fill"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400">No image available</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 md:w-1/2">
                                            <CardHeader>
                                                <div className="text-sm font-medium text-blue-600">{blog.category}</div>
                                                <CardTitle className="mt-2">{blog.title}</CardTitle>
                                            </CardHeader>
                                            <CardFooter>
                                                <Link to={`/uudised/${blog.id}`}>
                                                    <Button variant="outline" className="border-blue-500 hover:bg-blue-100">Read More</Button>
                                                </Link>
                                            </CardFooter>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </motion.div>
                        {paginated_articles[9] && (
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                <Card className="overflow-hidden">
                                    <div className="md:flex">
                                        <div className="md:flex-shrink-0 md:w-2/5 h-64 md:h-full overflow-hidden">
                                            {paginated_articles[9].thumbnail ? (
                                                <img
                                                    src={paginated_articles[9].thumbnail}
                                                    alt={paginated_articles[9].title}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400">No image available</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-8 md:w-3/5">
                                            <CardHeader>
                                                <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">{paginated_articles[9].category}</div>
                                                <CardTitle className="mt-2 text-2xl">{paginated_articles[9].title}</CardTitle>
                                            </CardHeader>
                                            <CardFooter>
                                                <Link to={`/uudised/${paginated_articles[9].id}`}>
                                                    <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">Read More</Button>
                                                </Link>
                                            </CardFooter>
                                        </div>
                                    </div>
                                </Card>

                            </motion.div>

                        )}
                    </>
                )}

                {paginated_articles.length === 0 && (
                    <p className="text-center text-gray-500">No blog posts found for this category.</p>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center space-x-2 mt-8">
                        <Button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            variant='outline'
                            className='border border-blue-500'
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-4 py-2 rounded-md">
                            {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            className='border border-blue-500 hover:bg-blue-100'
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div >
    )
}

