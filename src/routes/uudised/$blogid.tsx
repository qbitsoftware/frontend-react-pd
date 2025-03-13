import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ErrorPage from '@/components/error'
import { UseGetBlog } from '@/queries/blogs'
import Editor from '../admin/-components/yooptaeditor'
import { useState, useEffect } from 'react'
import { YooptaContentValue } from '@yoopta/editor'
import { formatDateString } from '@/lib/utils'

export const Route = createFileRoute('/uudised/$blogid')({
    errorComponent: () => {
        return <ErrorPage />
    },
    component: RouteComponent,
    loader: async ({ context: { queryClient }, params }) => {
        const articledata = queryClient.ensureQueryData(UseGetBlog(Number(params.blogid)))
        return articledata
    }
})

function RouteComponent() {

    const article = Route.useLoaderData()

    const [value, setValue] = useState<YooptaContentValue | undefined>(article.data.full_content ? JSON.parse(article.data.full_content) : undefined);

    const categories = article.data.category.split('/').map((category) => category.trim())
    const category = categories[0]

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Card>
                <CardHeader className='pb-2 pt-4'>
                    <div className="text-sm font-medium text-blue-600 mb-2">
                        <Link
                            href="/uudised/"
                            className="mr-2"
                        >
                            Kõik uudised
                        </Link>

                        {category && (
                            <>
                                <span className="mr-2">/</span>
                                <Link
                                    href={`/uudised/?category=${category}`}
                                    className="mr-2 capitalize"
                                >
                                    {category}
                                </Link>
                            </>
                        )}

                        <span className="mr-2">/</span>
                        <span className="font-bold">{article.data.title}</span>
                    </div>
                </CardHeader>
                <CardContent className="prose max-w-none overflow-scroll">
                    {/* <p className='blog-content' dangerouslySetInnerHTML={{ __html: article.data.content_html }}></p> */}
                    {value ? (
                        <Editor value={value} setValue={setValue} readOnly={true} />
                    ) : (
                        <div className="p-8 text-center">
                            <p>Loading editor...</p>
                        </div>
                    )}

                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Published on {formatDateString(article.data.created_at)}
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/uudised">Kõik uudised</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

