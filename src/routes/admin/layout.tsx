import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Trophy,
  FileText,
  PersonStanding,
  MessagesSquare,
} from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { redirect } from '@tanstack/react-router'
import { useUser } from '@/providers/userProvider'
import { UseGetCurrentUser } from '@/queries/users'
import ErrorPage from '@/components/error'
import { ErrorResponse } from '@/types/errors'


export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  errorComponent: () => <ErrorPage />,
  loader: async ({ context: { queryClient } }) => {
    try {
      await queryClient.ensureQueryData(UseGetCurrentUser())
    } catch (error) {
      const err = error as ErrorResponse
      if (err.response.status === 401) {
        throw redirect({
          to: '/',
        })
      }
      throw error
    }
  },
})

function RouteComponent() {

  const router = useRouter()
  const location = useLocation()
  const { t } = useTranslation()
  const { user } = useUser()
  if (!user || user.role != 'admin') {
    router.navigate({ to: "/" })
  }

  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === "/admin/") {
      router.navigate({
        to: '/admin/dashboard',
      })
    }
  }, [location.pathname, router])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  const menuItems = [
    {
      id: 'dashboard',
      label: t('admin.layout.sidebar.dashboard'),
      icon: <LayoutDashboard className="w-4 h-4 sm:mr-2 text-[#03326B]" />,
      to: '/admin/dashboard',
    },
    {
      id: 'tournaments',
      label: t('admin.layout.sidebar.tournaments'),
      icon: <Trophy className="w-4 h-4 sm:mr-2 text-[#03326B]" />,
      to: '/admin/tournaments',
    },
    {
      id: 'blog',
      label: t('admin.layout.sidebar.blogs'),
      icon: <FileText className="w-4 h-4 sm:mr-2 text-[#03326B]" />,
      to: '/admin/blog',
    },
    {
      id: 'settings',
      label: t('admin.layout.sidebar.clubs'),
      icon: <PersonStanding className="w-4 h-4 sm:mr-2 text-[#03326B]" />,
      to: '/admin/clubs',
    },
    {
      id: 'feedback',
      label: t('admin.layout.sidebar.feedback'),
      icon: <MessagesSquare className="w-4 h-4 sm:mr-2 text-[#03326B]" />,
      to: '/admin/feedback',
    },
  ]

  return (
    <div className="flex flex-col  max-w-[1440px] mx-auto bg-[#F8F9F9]">
      {/* Main Content Area */}
      <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
        {/* Sidebar - Visible only on SM and above */}
        <div className="hidden sm:block w-16 md:w-56">
          <div className="p-4 md:px-6 md:pt-6 md:pb-2">
            <h6 className="hidden md:block font-medium text-stone-800">
              {t('admin.layout.description')}
            </h6>
          </div>
          <nav className="p-2 flex flex-col w-full">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className={`w-full flex flex-row items-center text-stone-800 rounded-md justify-start px-2 md:px-6 py-3 text-sm transition-colors duration-150 ${
                  location.pathname.includes(item.to)
                    ? 'bg-[#EFF0F2] border-l-4 border-[#4C97F1] font-medium'
                    : 'text-gray-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {item.icon}
                <span className="hidden md:inline ml-2">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white sm:border border-[#EFEFEF] rounded-[3px] sm:mx-4 sm:my-3  pb-20 sm:pb-0 overflow-x-scroll">
          <Outlet />
        </div>
      </div>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EFEFEF] z-40">
        <nav className="flex justify-between items-center px-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className={`flex flex-col items-center py-3 px-2 ${
                location.pathname.includes(item.to)
                  ? 'text-[#4C97F1] border-t-2 border-[#4C97F1] font-medium'
                  : 'text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}