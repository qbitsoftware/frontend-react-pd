import { ReactNode } from "react"

interface WidgetProps {
  heading?: string,
  view_all?: string,
  addr?: string,
  children?: ReactNode
}

const WidgetWrapper = ({ heading, view_all, addr, children }: WidgetProps) => {
  return (
    <div className="border border-[#F5F6F8] rounded-[8px] shadow-sm h-full flex-grow bg-white"
    >
      <div className="py-4 px-4 flex justify-between items-center bg-gradient-to-b from-[#F0F4F7] via-[#F4F8FB] to-[#F9FBFD] rounded-t-[8px] border-b border-[#F5F6F8]">
        <h3 className="font-medium text-foreground/80">{heading}</h3><a href={`/${addr}`} className="hover:underline px-2 py-3 hover:bg-stone-600/5 rounded-sm">{view_all}</a>
      </div>
      {children}
    </div>
  )
}

export default WidgetWrapper
