import { ReactNode } from "react"

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
        <a href={`/${addr}`} className="flex items-center gap-3 rounded-sm hover:bg-gradient-to-r hover:from-[#f4f4f3] hover:to-[#f5f5f5] transition-all duration-300"><h3 className="font-bold text-foreground/80">{heading}</h3><svg className="mt-1 " width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.0312 3.01562V0.015625L17.0156 4L13.0312 7.98438V4.98438H0.984375V3.01562H13.0312Z" fill="black" />
        </svg></a>
      </div>
      {children}
    </div>
  )
}

export default WidgetWrapper
