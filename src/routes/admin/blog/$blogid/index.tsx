import { createFileRoute, useParams, useRouter } from '@tanstack/react-router'
import { UseGetBlog, UseUpdateBlog } from '@/queries/blogs'
import { useEffect, useState } from 'react'
import { YooptaContentValue } from '@yoopta/editor'
import { contentParser } from '@/lib/utils'
import { Blog } from '@/types/types'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Editor from '../../-components/yooptaeditor'
import { useToast } from '@/hooks/use-toast'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@tanstack/react-router'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const Route = createFileRoute('/admin/blog/$blogid/')({
    component: RouteComponent,
})

function RouteComponent() {
    const params = useParams({ strict: false })
    const { data: blogData, isLoading } = UseGetBlog(Number(params.blogid))
    const [value, setValue] = useState<YooptaContentValue | undefined>(undefined);
    const [category, setCategory] = useState<string>('');
    const [isPublished, setIsPublished] = useState(false);
    const blogUpdateMutation = UseUpdateBlog()
    const router = useRouter()
    const { toast } = useToast()

    const categories = [
        { id: "announcements", label: "Announcements" },
        { id: "news", label: "News" },
        { id: "good-read", label: "Good Read" },
        { id: "tournaments", label: "Tournaments" }
    ];

    useEffect(() => {
        // Only set the editor value and publication status after data is loaded
        if (!isLoading && blogData?.data) {
            try {
                setValue(JSON.parse(blogData.data.full_content));
                setIsPublished(blogData.data.status === 'published');
                setCategory(blogData.data.category);
            } catch (error) {
                console.error('Error parsing blog content:', error);
                toast({
                    title: "Error loading blog",
                    description: "There was an issue loading the blog content.",
                    variant: "destructive"
                });
            }
        }

        if (!isLoading && (!blogData || !blogData.data)) {
            toast({
                title: "Blog not found",
                description: "The blog post you're looking for could not be found.",
                variant: "destructive"
            });

            router.navigate({ to: '/admin/blog' });
        }
    }, [isLoading, blogData, toast, router]);

    const handleClick = async () => {
        if (!value) {
            toast({
                title: "Content is empty",
                description: "Please add some content to your blog post.",
                variant: "destructive"
            });
            return;
        }

        const { title, description, hasImages, imageUrl } = contentParser(value)

        if (!title) {
            toast({
                title: "Title is missing",
                description: "Please add a title to your blog post.",
                variant: "destructive"
            });
            return;
        }

        if (blogData) {
            try {
                toast({
                    title: "Saving changes",
                    description: "Please wait while we update your post...",
                });

                const blog: Blog = {
                    ...blogData.data,
                    id: blogData.data.id,
                    updated_at: new Date().toISOString(),
                    title,
                    description,
                    has_image: hasImages,
                    image_url: imageUrl,
                    full_content: JSON.stringify(value),
                    status: isPublished ? 'published' : 'draft',
                    category,
                }

                await blogUpdateMutation.mutateAsync(blog)

                toast({
                    title: "Success!",
                    description: `Blog post has been ${isPublished ? 'published' : 'saved as draft'}.`,
                    variant: "default"
                });

                router.navigate({ to: '/admin/blog' })
            } catch (error) {
                toast({
                    title: "Failed to update",
                    description: "An error occurred while updating your blog post.",
                    variant: "destructive"
                });
                console.error('Failed to update blog:', error)
            }

        } else {
            toast({
                title: "Refresh the page",
                description: "Something went wrong",
            });

        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-[600px] w-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        <div className="flex items-center">
                            <div
                                onClick={() => { router.navigate({ to: '/admin/blog' }) }}
                                className='flex items-center cursor-pointer px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Tagasi
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="publish-mode"
                                    checked={isPublished}
                                    onCheckedChange={setIsPublished}
                                />
                                <Label htmlFor="publish-mode">
                                    {isPublished ? 'Published' : 'Draft'}
                                </Label>
                            </div>
                            <Button
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={handleClick}
                                disabled={blogUpdateMutation.isPending}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {blogUpdateMutation.isPending ? "Saving..." : (isPublished ? 'Publish' : 'Save Draft')}
                            </Button>
                        </div>
                    </div>
                </div>
            </header> */}

            <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                href='/admin/blog'
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Tagasi
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Add category selector */}
                            <div className="flex items-center space-x-2">
                                <Select
                                    value={category}
                                    onValueChange={value => setCategory(value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="publish-mode"
                                    checked={isPublished}
                                    onCheckedChange={setIsPublished}
                                />
                                <Label htmlFor="publish-mode">
                                    {isPublished ? 'Publish' : 'Save as Draft'}
                                </Label>
                            </div>

                            <Button
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={handleClick}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isPublished ? 'Publish' : 'Save Draft'}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className='flex items-center justify-center'>
                {value ? (
                    <Editor value={value} setValue={setValue} readOnly={false} />
                ) : (
                    <div className="p-8 text-center">
                        <p>Loading editor...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
