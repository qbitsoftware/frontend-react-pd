import { createFileRoute } from '@tanstack/react-router'
import Editor from '../-components/yooptaeditor'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'

export const Route = createFileRoute('/admin/blog/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='w-full'>
      <div className=''>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Blogs
            </h1>
            <p className="text-gray-600 mt-1">
              Manage blogs here
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Link href="/admin/blog/new">
            <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create New blog
            </Button>
          </Link>
        </div>

      </div>
      {/* <Editor /> */}
    </div>

  )
}
