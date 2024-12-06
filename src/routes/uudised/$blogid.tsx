import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const getBlogPost = (id: string) => {
    const blogPost = blogs.find(blog => blog.id.toString() === id)
    if (!blogPost) {
        return null
    }
    return blogPost
}

const blogs = [
    { id: 1, title: 'Estonian Team Shines in European Championships', date: '2024-02-28', category: 'International', content: 'The Estonian national team showcased exceptional skill and teamwork in the recent European Championships. Our players demonstrated remarkable prowess, securing several medals and establishing Estonia as a formidable force in the international table tennis arena. This performance not only brings pride to our nation but also inspires the next generation of players.', image: '/test/blog.jpg' },
    { id: 2, title: 'Youth Development Program Launched', date: '2024-02-25', category: 'Youth', content: 'A new initiative aims to nurture young table tennis talent across Estonia. The program, launched by the Estonian Table Tennis Association, will provide structured training, mentorship, and competitive opportunities for aspiring players aged 8-16. This comprehensive approach is designed to build a strong foundation for the future of Estonian table tennis.', image: '/placeholder.svg?height=300&width=400' },
    // Add more blog posts here...
]

export const Route = createFileRoute('/uudised/$blogid')({
    component: RouteComponent,
})

function RouteComponent() {
    const post = getBlogPost(String(1))
    if (!post) {
        return
    }


    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card>
                <CardHeader>
                    <div className="mb-2">
                        <Link href="/uudised">
                            <Button variant="link">&larr; Back to News</Button>
                        </Link>
                    </div>
                    <div className="text-sm font-medium text-blue-600 mb-2">{post.category}</div>
                    <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
                    <div className="text-gray-500 mt-2">{post.date}</div>
                </CardHeader>
                {post.image && (
                    <img
                        src={post.image}
                        alt={post.title}
                        width={800}
                        height={500}
                        className="w-full h-[500px] object-cover"
                    />
                )}
                <CardContent className="prose max-w-none mt-6">
                    <p>{post.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Published on {post.date}
                    </div>
                    <Button asChild>
                        <Link href="/uudised">Back to News</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

