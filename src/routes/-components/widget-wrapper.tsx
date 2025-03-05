import { ReactNode } from "react"
import {ArrowRight} from "lucide-react";

interface WidgetProps {
  heading?: string,
  view_all?: string,
  addr?: string,
  children?: ReactNode
}

const WidgetWrapper = ({ heading, view_all, addr, children }: WidgetProps) => {
  return (
    <div className="sm:border sm:rounded-[16px] h-full flex-grow bg-white"
    >
      <div className="py-4 px-4 flex justify-between items-center gap-4 bg-[#F9F9F9] sm:rounded-t-[16px] border-b border-[#F5F6F8]">
        <h3 className="font-semibold text-foreground/80">{heading}</h3><a href={`/${addr}`} className="flex items-center text-sm font-medium gap-1 px-2 py-2 mt-1 hover:bg-stone-600/5 rounded-sm">{view_all}<ArrowRight className="h-4 w-4"/></a>
      </div>
      {children}
    </div>
  )
}

export default WidgetWrapper
