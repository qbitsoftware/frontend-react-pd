import { ReactNode } from "react"
import { ChevronRight } from "lucide-react"

interface WidgetProps {
  heading?: string,
  view_all?: string,
  addr?: string,
  children?: ReactNode
}

const WidgetWrapper = ({ heading, addr, children }: WidgetProps) => {
  return (
    <div className="h-full flex-grow">
      <div className="pb-6 px-4 flex justify-start items-center gap-2">
        <a href={`/${addr}`} className="flex items-center justify-center gap-3 rounded-sm hover:bg-gradient-to-r hover:from-[#f4f4f3] hover:to-[#f5f5f5] transition-all duration-300"><h3 className="font-bold text-foreground/80">{heading}</h3><ChevronRight className="mt-1"/>
          <path d="M13.0312 3.01562V0.015625L17.0156 4L13.0312 7.98438V4.98438H0.984375V3.01562H13.0312Z" fill="black" />
        </a>
      </div>
      {children}
    </div>
  )
}

export default WidgetWrapper
