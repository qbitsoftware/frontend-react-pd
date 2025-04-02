import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ErrorPage from '@/components/error'
import { UseGetBlog } from '@/queries/blogs'
import Editor from '../admin/-components/yooptaeditor'
import { useState, useEffect } from 'react'
import { YooptaContentValue } from '@yoopta/editor'
import { useTranslation } from 'react-i18next'
import { getFormattedDate } from '../voistlused/$tournamentid/ajakava/-components/schedule-utils'

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
    const { t } = useTranslation()

    const [value, setValue] = useState<YooptaContentValue | undefined>(article.data.full_content ? JSON.parse(article.data.full_content) : undefined);

    const categories = article.data.category.split('/').map((category) => category.trim())
    const category = categories[0]

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    return (
        <div className="max-w-[1440px] mx-auto px-1 sm:px-6 lg:px-8 py-4">
            <Card>
                <CardHeader className='pb-2 pt-4'>
                    <div className="text-sm font-medium text-blue-600 mb-2 flex flex-wrap">
                        <Link
                            href="/uudised/"
                            className="mr-2"
                        >
                            {t('news.all_news')}
                        </Link>

                        {category && (
                            <>
                                <span className="mr-2">/</span>
                                <Link
                                    href={`/uudised/?category=${category}`}
                                    className="mr-2 capitalize"
                                >
                                    {t('news.categories.' + category.toLowerCase())}
                                </Link>
                            </>
                        )}

                        <span className="mr-2">/</span>
                        <span className="font-bold">{article.data.title}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        {t('news.published')}{" "}{getFormattedDate(article.data.created_at)}
                    </div>
                </CardHeader>
                <CardContent className="prose max-w-none mx-auto md:w-2/3 overflow-hidden">
                    {value ? (
                        <Editor value={value} setValue={setValue} readOnly={true} />
                    ) : (
                        <div className="p-8 text-center">
                            <p>{t('news.loading')}</p>
                        </div>
                    )}

                </CardContent>
                <CardFooter className="flex justify-center items-center mt-4">
                    <Button variant="outline" asChild>
                        <Link href="/uudised">{t('news.all_news')}</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

