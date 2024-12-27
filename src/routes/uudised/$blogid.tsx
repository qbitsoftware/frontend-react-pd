import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGetArticle } from '@/queries/articles'
import ErrorPage from '@/components/error'

export const Route = createFileRoute('/uudised/$blogid')({
    errorComponent: ({ error, reset }) => {
        return <ErrorPage error={error} reset={reset} />
      },
    component: RouteComponent,
    loader: async ({ context: { queryClient }, params }) => {
        const articledata = queryClient.ensureQueryData(useGetArticle(Number(params.blogid)))
        return articledata
    }
})

function RouteComponent() {

    const article = Route.useLoaderData()


    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card>
                <CardHeader>
                    <div className="mb-2">
                        <Link href="/uudised">
                            <Button variant="link">&larr; Back to News</Button>
                        </Link>
                    </div>
                    <div className="text-sm font-medium text-blue-600 mb-2">{article.data.category}</div>
                    <CardTitle className="text-3xl font-bold">{article.data.title}</CardTitle>
                    <div className="text-gray-500 mt-2">{article.data.created_at}</div>
                </CardHeader>
                {article.data.thumbnail && (
                    <img
                        src={article.data.thumbnail}
                        alt={article.data.title}
                        width={800}
                        height={500}
                        className="w-full h-[500px] object-cover"
                    />
                )}
                <CardContent className="prose max-w-none mt-6">
                    <p dangerouslySetInnerHTML={{__html: article.data.content_html}}></p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Published on {article.data.created_at}
                    </div>
                    <Button asChild>
                        <Link href="/uudised">Back to News</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

