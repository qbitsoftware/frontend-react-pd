import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { PlusCircle, Search, Edit, Trash2, AlertCircle } from 'lucide-react'
import { UseDeleteBlog, UseGetBlogsQuery } from '@/queries/blogs'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent
} from '@/components/ui/card'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/admin/blog/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [blogIdToDelete, setBlogIdToDelete] = useState<number | null>(null)
  const deleteMutation = UseDeleteBlog()
  const { data: blogData, isLoading, error } = UseGetBlogsQuery()
  const { toast } = useToast()
  const { t } = useTranslation()

  const handleDeleteClick = (blogId: number) => {
    setBlogIdToDelete(blogId)
  }

  const handleDeleteConfirm = async () => {
    if (blogIdToDelete === null) return

    try {
      await deleteMutation.mutateAsync(blogIdToDelete)
      toast({
        title: "Blog deleted",
        description: "The blog post has been successfully deleted.",
        variant: "default"
      })
      setBlogIdToDelete(null)
    } catch (err) {
      toast({
        title: "Failed to delete",
        description: "There was an error deleting the blog post.",
        variant: "destructive"
      })
      console.error('Failed to delete blog:', err)
    }
  }

  const handleDeleteCancel = () => {
    setBlogIdToDelete(null)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='w-full p-4'>
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-full sm:w-1/3" />
        </div>

        <Card className='overflow-y-auto h-[600px]'>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]"><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className='w-full p-4'>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("admin.blogs.title")}</h1>
            <p className="text-gray-600 mt-1">{t("admin.blogs.description")}</p>
          </div>
        </div>

        <div className="flex justify-center items-center h-[500px]">
          <div className="text-center p-8 bg-red-50 rounded-lg max-w-xl">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800">{t("admin.blogs.load_failed")}</h3>
            <p className="text-red-600 mt-2 mb-4">
              {t("admin.blogs.load_failed_description")}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("admin.blogs.refresh")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!blogData || !blogData.data) {
    return (
      <div className='w-full p-4'>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("admin.blogs.title")}</h1>
            <p className="text-gray-600 mt-1">{t("admin.blogs.description")}</p>
          </div>
          <Link href="/admin/blog/new">
            <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
              <PlusCircle className="w-4 h-4 mr-2" />
              {t("admin.blogs.add_new")}
            </Button>
          </Link>
        </div>

        <Card className='overflow-y-auto h-[600px]'>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <div className="text-center">
              <div className="bg-gray-100 p-6 rounded-full inline-flex items-center justify-center mb-4">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">{t("admin.blogs.not_found")}</h3>
              <p className="text-gray-500 mt-1 mb-4 max-w-sm">
                {t("admin.blogs.text")}
              </p>
              <Link href="/admin/blog/new">
                <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {t("admin.blogs.add_new")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Filter blogs based on search term
  const filteredBlogs = blogData.data.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='w-full p-4'>
      <div className=''>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("admin.blogs.title")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("admin.blogs.description")}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 ">
          <Link href="/admin/blog/new">
            <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
              <PlusCircle className="w-4 h-4 mr-2" />
              {t("admin.blogs.add_new")}
            </Button>
          </Link>

          <div className="relative w-full sm:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("admin.blogs.search")}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className='overflow-y-auto h-[600px]'>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">{t("admin.blogs.table.title")}</TableHead>
                  <TableHead>{t('admin.blogs.table.date')}</TableHead>
                  <TableHead>{t("admin.blogs.table.status")}</TableHead>
                  <TableHead className="text-right">{t("admin.blogs.table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.length > 0 ? (
                  filteredBlogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">{blog.title}</TableCell>
                      <TableCell>{blog.created_at ? format(new Date(blog.created_at), 'MMM dd, yyyy') : 'No date'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-800' :
                          blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {blog.status || 'Draft'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/blog/${blog.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              {t("admin.blogs.edit")}
                            </Button>
                          </Link>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(blog.id)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            {t("admin.blogs.delete")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                      {searchTerm ? 'No blogs match your search' : 'No blogs found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={blogIdToDelete !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.blogs.delete_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.blogs.delete_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>{t("admin.blogs.delete_cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              {t("admin.blogs.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
