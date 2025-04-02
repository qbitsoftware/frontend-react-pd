import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { UseGetBlogsOption } from '@/queries/blogs'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  FileText,
  FileX,
} from 'lucide-react'
import { Blog } from '@/types/types'

// Define interfaces
interface LoaderData {
  blogs: Blog[]
  totalPages: number
  isLoading: boolean
  error: string | null
}

interface CategoryItem {
  id: string
  label: string
}

// Hardcoded categories
export const categories: CategoryItem[] = [
  { id: 'competitions', label: 'Competitions' },
  { id: 'news', label: 'News' },
  { id: 'good_read', label: 'Good Read' },
  { id: 'results', label: 'Results' },
]

// Define the search params schema
const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  category: z.string().optional(),
  search: z.string().optional(),
})

type SearchParams = z.infer<typeof searchParamsSchema>

// Create the route
export const Route = createFileRoute('/uudised/')({
  component: BlogPage,
  validateSearch: searchParamsSchema,

  loaderDeps: ({ search }) => ({
    page: search.page || 1,
    category: search.category,
    search: search.search,
  }),

  loader: async ({ context, deps }): Promise<LoaderData> => {
    const { queryClient } = context

    try {
      const response = await queryClient.ensureQueryData(
        UseGetBlogsOption(deps.page, deps.category, deps.search),
      )

      return {
        blogs: response?.data?.blogs || [],
        totalPages: response?.data?.total_pages || 0,
        isLoading: false,
        error: null,
      }
    } catch (error) {
      console.error('Error loading blogs:', error)
      return {
        blogs: [],
        totalPages: 0,
        isLoading: false,
        error: 'Failed to load blog posts',
      }
    }
  },
})

function BlogPage(): JSX.Element {
  const { t } = useTranslation()
  const { blogs, totalPages, error } = Route.useLoaderData()
  const searchParams = Route.useSearch()
  const page = searchParams.page || 1
  const { category, search } = searchParams
  const navigate = Route.useNavigate()

  // Local state for search input
  const [searchQuery, setSearchQuery] = useState(search || '')

  const availableCategories = [
    { id: "competitions", label: "Competitions" },
    { id: "news", label: "News" },
    { id: "good_read", label: "Good Read" },
    { id: "results", label: "Results" }
  ];

  // Format date function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Truncate text function
  const truncateText = (
    text: string | undefined,
    maxLength: number = 150,
  ): string => {
    if (!text) return ''
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  // Handle category change
  const handleCategoryChange = (newCategory: string): void => {
    navigate({
      search: (prev: SearchParams) => ({
        ...prev,
        category: newCategory === 'all' ? undefined : newCategory,
        page: 1,
      }),
    })
  }

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    navigate({
      search: (prev: SearchParams) => ({
        ...prev,
        search: searchQuery || undefined,
        page: 1,
      }),
    })
  }

  // Handle page change
  const handlePageChange = (newPage: number): void => {
    navigate({
      search: (prev: SearchParams) => ({
        ...prev,
        page: newPage,
      }),
      replace: true,
    })
    window.scrollTo(0, 0)
  }

  // Clear filters
  const clearFilters = (): void => {
    setSearchQuery('')
    navigate({
      search: {
        page: 1,
      },
    })
  }

  // Empty state component
  const EmptyState = (): JSX.Element => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileX size={48} className="text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold mb-2">
        {t('blog.no_posts_found', 'No posts found')}
      </h2>
      <p className="text-gray-500 max-w-md mb-6">
        {t(
          'blog.try_different_filters',
          'Try different search terms or filters',
        )}
      </p>
      <Button variant="outline" onClick={clearFilters}>
        {t('blog.clear_filters', 'Clear all filters')}
      </Button>
    </div>
  )

  // If we have an error, display error message
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-12">
          <FileX size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            {t('blog.error_title', 'Something went wrong')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t(
              'blog.error_message',
              'Failed to load blog posts. Please try again later.',
            )}
          </p>
          <Button onClick={clearFilters}>
            {t('blog.try_again', 'Try again')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">
          {t('blog.title', 'Our Blog')}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t(
            'blog.description',
            'Discover our latest news, tutorials, and insights',
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-8">
        {/* Category Tabs */}
        <Tabs
          value={category || 'all'}
          className="w-full"
          onValueChange={(value) => handleCategoryChange(value)}
        >
          <div className="flex justify-center mb-2">
            <TabsList className="bg-gray-100 p-1 rounded-full">
              <TabsTrigger value="all" className="px-4 py-2 rounded-full">
                {t('blog.categories.all', 'All')}
              </TabsTrigger>

              {availableCategories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="px-4 py-2 rounded-full"
                >
                  {t(`blog.categories.${cat.id}`, cat.label)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {/* Search Bar */}
        <div className="flex justify-center">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
            <div className="relative">
              <Input
                type="text"
                placeholder={t('blog.search_placeholder', 'Search posts...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 rounded-full"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
              >
                <Search size={18} />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Blog Posts Grid */}
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogs.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
            >
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                {/* Featured Image */}
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  {post.has_image && post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FileText size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-grow p-5">
                  {/* Category */}
                  {post.category && (
                    <div className="mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                        {categories.find((c) => c.id === post.category)
                          ?.label || post.category}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <CardTitle className="mb-3 text-xl">{post.title}</CardTitle>

                  {/* Excerpt */}
                  <CardContent className="p-0 flex-grow">
                    <p className="text-gray-600 text-sm">
                      {truncateText(post.description)}
                    </p>
                  </CardContent>

                  {/* Footer */}
                  <CardFooter className="px-0 pt-4 pb-0 mt-auto flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    <time dateTime={post.created_at}>
                      {formatDate(post.created_at)}
                    </time>
                  </CardFooter>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft size={16} />
            </Button>

            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1

                // Show first, last, current and pages around current
                const shouldShowPage =
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  Math.abs(pageNumber - page) <= 1

                // Show ellipsis if needed
                const shouldShowEllipsis =
                  (pageNumber === 2 && page > 3) ||
                  (pageNumber === totalPages - 1 && page < totalPages - 2)

                if (shouldShowPage) {
                  return (
                    <Button
                      key={pageNumber}
                      variant={page === pageNumber ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className="w-10 h-10"
                    >
                      {pageNumber}
                    </Button>
                  )
                } else if (shouldShowEllipsis) {
                  return (
                    <span key={pageNumber} className="px-2">
                      …
                    </span>
                  )
                }

                return null
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogPage
