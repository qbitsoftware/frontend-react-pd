import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export interface Blog {
    id: number
    title: string
    date: string
    category: string
    excerpt: string
    image: string
}

export const BlogCard = ({ blog, className = "" }: { blog: Blog, className?: string }) => (
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
                <Button variant="outline" className=" border border-blue-secondary hover:bg-blue-100">Read More</Button>
            </Link>
        </CardFooter>
    </Card>
)