import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ErrorPage from '@/components/error'
import { replaceSpecialCharacters } from '@/lib/utils'
import { UseGetBlog } from '@/queries/blogs'
import Editor from '../admin/-components/yooptaeditor'
import { useState } from 'react'
import { YooptaContentValue } from '@yoopta/editor'

export const Route = createFileRoute('/uudised/$blogid')({
    errorComponent: ({ error, reset }) => {
        return <ErrorPage error={error} reset={reset} />
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


    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card>
                <CardHeader>
                    <div className="mb-2">
                        <Link href="/uudised">
                            <Button variant="link">&larr; Back to News</Button>
                        </Link>
                    </div>
                    <div className="text-sm font-medium text-blue-600 mb-2">{categories.map((category, idx) => {
                        if (idx === categories.length - 1) {
                            return (
                                <Link href={`/uudised?category=${replaceSpecialCharacters(category)}`}>
                                    <span key={category}>{category}</span>
                                </Link>
                            )
                        } else {
                            return (
                                <>
                                    <Link href={`/uudised?category=${replaceSpecialCharacters(category)}`}>
                                        <span key={category} className="mr-2">{category}</span>
                                    </Link>
                                    <span className='mr-2'>/</span>
                                </>
                            )
                        }
                    })}</div>
                </CardHeader>
                <CardContent className="prose max-w-none mt-6">
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

