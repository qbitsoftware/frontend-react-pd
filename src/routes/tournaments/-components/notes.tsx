import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CircleHelp } from 'lucide-react'

interface InfoComponentProps {
    content: React.ReactNode
}

export default function Notes({ content }: InfoComponentProps) {
    return (
        <div className='flex items-center'>
            <div className='text-black/70'>
                Märkused:
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <button className="inline-flex items-center justify-center rounded-full w-6 h-6 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                        <CircleHelp className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">Märkus</span>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 text-sm" align="start">
                    {content || "Märkused puuduvad."}
                </PopoverContent>
            </Popover>
        </div>
    )
}