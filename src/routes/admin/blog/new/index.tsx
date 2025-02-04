import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Save } from 'lucide-react'
import Editor from '../../-components/yooptaeditor'
import { Button } from '@/components/ui/button'
import { useMemo, useState } from 'react'
import { createYooptaEditor, YooptaContentValue } from '@yoopta/editor'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/blog/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [value, setValue] = useState<YooptaContentValue>();

  const handleClick = async () => {
    console.log(value)
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div>
              <Button
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleClick}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvesta
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className='flex items-center justify-center'>
        <Editor value={value} setValue={setValue} readOnly={false} />
      </div>
    </div>
  )
}
