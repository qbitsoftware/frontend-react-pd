import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useFadeIn } from '@/hooks/useFadeIn'


interface Blog {
    id: number
    title: string
    date: string
    category: string
    excerpt: string
    image: string
}

export const Route = createFileRoute('/uudised/')({
    component: RouteComponent,
})


const blogs: Blog[] = [
    { id: 1, title: 'Estonian Team Shines in European Championships', date: '2024-02-28', category: 'International', excerpt: 'The Estonian national team showcased exceptional skill and teamwork...', image: '/test/blog.jpg?height=400&width=600' },
    { id: 2, title: 'Youth Development Program Launched', date: '2024-02-25', category: 'Youth', excerpt: 'A new initiative aims to nurture young table tennis talent across Estonia...', image: '/test/blog.jpg?height=300&width=400' },
    { id: 3, title: 'New Training Facilities Open in Tallinn', date: '2024-02-20', category: 'Facilities', excerpt: 'State-of-the-art training center unveiled in the capital city...', image: '/test/blog.jpg?height=300&width=400' },
    { id: 4, title: 'National Championships Recap', date: '2024-02-15', category: 'National', excerpt: 'Exciting matches and surprising upsets marked this year\'s national championships...', image: '/test/blog.jpg' },
    { id: 5, title: 'Upcoming International Tournament in Tartu', date: '2024-02-10', category: 'Tournaments', excerpt: 'Tartu prepares to host a major international table tennis event...', image: '/test/blog.jpg' },
    { id: 6, title: 'Rising Star: Interview with Junior Champion', date: '2024-02-05', category: 'Youth', excerpt: 'We sit down with Estonia\'s latest junior champion to discuss their journey...', image: '/test/blog.jpg?height=300&width=400' },
    { id: 7, title: 'Table Tennis in Schools Initiative', date: '2024-01-30', category: 'Youth', excerpt: 'New program aims to introduce table tennis to more schools across Estonia...', image: '/test/blog.jpg' },
    { id: 8, title: 'Veteran Players Reunion Tournament', date: '2024-01-25', category: 'National', excerpt: 'Former champions gather for a special reunion tournament...', image: '/test/blog.jpg?height=300&width=400' },
    { id: 9, title: 'Estonia Hosts International Coaching Seminar', date: '2024-01-20', category: 'International', excerpt: 'Top coaches from around the world gather in Tallinn for a week-long seminar...', image: '/test/blog.jpg?height=400&width=800' },
    { id: 10, title: 'Local Club Spotlight: Narva Net Smashers', date: '2024-01-15', category: 'National', excerpt: 'We take a closer look at one of Estonia\'s most vibrant table tennis clubs...', image: '/test/blog.jpg?height=400&width=800' },
    { id: 11, title: 'New Ranking System Announced', date: '2024-01-10', category: 'National', excerpt: 'The Estonian Table Tennis Association unveils a new player ranking system...', image: '/test/blog.jpg' },
    { id: 12, title: 'Youth Summer Camp Registration Opens', date: '2024-01-05', category: 'Youth', excerpt: 'Annual summer camp for young table tennis enthusiasts now accepting registrations...', image: '/test/blog.jpg?height=300&width=400' },
    { id: 13, title: 'Tallinn to Host 2025 European Championships', date: '2023-12-30', category: 'International', excerpt: 'Breaking news: Estonia selected as the host for next year\'s European Championships...', image: '/test/blog.jpg?height=400&width=600' },
    { id: 14, title: 'Year in Review: Top 10 Estonian Table Tennis Moments', date: '2023-12-25', category: 'National', excerpt: 'We count down the most memorable moments in Estonian table tennis this year...', image: '/test/blog.jpg' },
    { id: 15, title: 'Fundraising Initiative for Para Table Tennis', date: '2023-12-20', category: 'National', excerpt: 'New campaign launched to support Estonia\'s para table tennis athletes...', image: '/test/blog.jpg?height=300&width=400' },
]

interface SearchParams {
    [key: string]: string;
}

export default function RouteComponent() {
    const [activeCategory, setActiveCategory] = useState('All')
    const [searchParams, setSearchParams] = useState<SearchParams>({});
    const { t } = useTranslation()
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    const [heroControls, heroRef] = useFadeIn()

    const blogCategories = ['All', 'Announcements', 'Tournaments', 'Youth', 'Newsletter']

    const blogCategoriesDisplay = [t('navbar.menu.news.all'), t('navbar.menu.news.announcements'), t('navbar.menu.news.tournaments'), t('navbar.menu.news.youth'), t('navbar.menu.news.newsletter')]

    useEffect(() => {
        const queryString = window.location.search;

        const params = new URLSearchParams(queryString);

        const paramsObj: SearchParams = {};
        for (let [key, value] of params.entries()) {
            paramsObj[key] = value;
        }

        setSearchParams(paramsObj);
    }, []);

    useEffect(() => {
        if (searchParams['category'] && blogCategories.includes(searchParams['category'])) {
            setActiveCategory(searchParams['category'])
        }
    }, [searchParams])

    const filteredBlogs = activeCategory === 'All'
        ? blogs
        : blogs.filter(blog => blog.category === activeCategory)

    const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE)
    const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const BlogCard = ({ blog, className = "" }: { blog: Blog, className?: string }) => (
        <Card className={`overflow-hidden ${className}`}>
            {blog.image && (
                <img
                    src={blog.image}
                    alt={blog.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                />
            )}
            <CardHeader>
                <div className="text-sm font-medium text-blue-600">{blog.category}</div>
                <CardTitle className="mt-2">{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-500">{blog.excerpt}</p>
            </CardContent>
            <CardFooter>
                <Link href={`/uudised/${blog.id}`}>
                    <Button variant="outline">Read More</Button>
                </Link>
            </CardFooter>
        </Card>
    )

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">News and Updates</h1>

            <Tabs value={activeCategory} className="mb-8">
                <TabsList className="bg-blue-100 p-1 rounded-lg">
                    {blogCategoriesDisplay.map((category, index) => (
                        <TabsTrigger
                            key={category}
                            value={blogCategories[index]}
                            onClick={() => setActiveCategory(blogCategories[index])}
                            className="px-4 py-2 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>


            <div className="space-y-12">

                {paginatedBlogs.length > 0 && (
                    <>
                        <motion.div
                            className="text-center text-white"
                            ref={heroRef}
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroControls}
                        >
                            {/* First blog - full width */}
                            <Card className="overflow-hidden bg-blue-600 text-white">
                                <div className="md:flex items-center">
                                    <div className="md:w-1/3 p-8">
                                        <CardHeader>
                                            <div className="uppercase tracking-wide text-sm font-semibold">{paginatedBlogs[0].category}</div>
                                            <CardTitle className="mt-2 text-2xl">{paginatedBlogs[0].title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="mt-2">{paginatedBlogs[0].excerpt}</p>
                                        </CardContent>
                                        <CardFooter>
                                            <Link href={`/uudised/${paginatedBlogs[0].id}`}>
                                                <Button variant="secondary" className="mt-4">Read More</Button>
                                            </Link>
                                        </CardFooter>
                                    </div>
                                    <div className="md:w-2/3">
                                        <img
                                            src={paginatedBlogs[0].image}
                                            alt={paginatedBlogs[0].title}
                                            width={800}
                                            height={400}
                                            className="w-full h-64 object-cover md:h-full"
                                        />
                                    </div>
                                </div>
                            </Card>

                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            {paginatedBlogs.slice(1, 3).map(blog => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </motion.div>
                        {/* Third row - 4 text-only blogs, responsive grid */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {paginatedBlogs.slice(3, 7).map(blog => (
                                    <Card key={blog.id} className="flex flex-col justify-between">
                                        <CardHeader>
                                            <div className="text-sm font-medium text-blue-600">{blog.category}</div>
                                            <CardTitle className="mt-2">{blog.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-500 line-clamp-3">{blog.excerpt}</p>
                                        </CardContent>
                                        <CardFooter>
                                            <Link href={`/uudised/${blog.id}`}>
                                                <Button variant="link">Read More</Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                        {/* Fourth row - 2 blogs with images, different layout */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            {paginatedBlogs.slice(7, 9).map(blog => (
                                <Card key={blog.id} className="overflow-hidden">
                                    <div className="md:flex flex-col md:flex-row-reverse">
                                        <div className="md:w-1/2">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                width={400}
                                                height={300}
                                                className="w-full h-48 object-cover md:h-full"
                                            />
                                        </div>
                                        <div className="p-6 md:w-1/2">
                                            <CardHeader>
                                                <div className="text-sm font-medium text-blue-600">{blog.category}</div>
                                                <CardTitle className="mt-2">{blog.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-500">{blog.excerpt}</p>
                                            </CardContent>
                                            <CardFooter>
                                                <Link href={`/uudised/${blog.id}`}>
                                                    <Button variant="outline">Read More</Button>
                                                </Link>
                                            </CardFooter>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </motion.div>
                        {/* Last blog - full width, different layout */}
                        {paginatedBlogs[9] && (
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                <Card className="overflow-hidden">
                                    <div className="md:flex">
                                        <div className="md:flex-shrink-0 md:w-2/5">
                                            <img
                                                src={paginatedBlogs[9].image}
                                                alt={paginatedBlogs[9].title}
                                                width={600}
                                                height={400}
                                                className="h-64 w-full object-cover md:h-full"
                                            />
                                        </div>
                                        <div className="p-8 md:w-3/5">
                                            <CardHeader>
                                                <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">{paginatedBlogs[9].category}</div>
                                                <CardTitle className="mt-2 text-2xl">{paginatedBlogs[9].title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="mt-2 text-gray-500">{paginatedBlogs[9].excerpt}</p>
                                            </CardContent>
                                            <CardFooter>
                                                <Link href={`/uudised/${paginatedBlogs[9].id}`}>
                                                    <Button className="mt-4">Read More</Button>
                                                </Link>
                                            </CardFooter>
                                        </div>
                                    </div>
                                </Card>

                            </motion.div>

                        )}
                    </>
                )}

                {paginatedBlogs.length === 0 && (
                    <p className="text-center text-gray-500">No blog posts found for this category.</p>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center space-x-2 mt-8">
                        <Button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-4 py-2 bg-blue-100 rounded-md">
                            {currentPage} of {totalPages}
                        </span>
                        <Button
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
