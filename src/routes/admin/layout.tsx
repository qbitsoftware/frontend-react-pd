import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Trophy,
  FileText,
  PersonStanding,
} from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { redirect } from '@tanstack/react-router'
import { ErrorResponse } from '@/types/types'
import { useUser } from '@/providers/userProvider'
import { UseGetCurrentUser } from '@/queries/users'
import ErrorPage from '@/components/error'


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



  const menuItems = [
    {
      id: 'dashboard',
      label: t('admin.layout.sidebar.dashboard'),
      icon: <LayoutDashboard className="w-4 h-4 sm:mr-2" />,
      to: '/admin/dashboard',
    },
    {
      id: 'tournaments',
      label: t('admin.layout.sidebar.tournaments'),
      icon: <Trophy className="w-4 h-4 sm:mr-2" />,
      to: '/admin/tournaments',
    },
    {
      id: 'blog',
      label: t('admin.layout.sidebar.blogs'),
      icon: <FileText className="w-4 h-4 sm:mr-2" />,
      to: '/admin/blog',
    },
    {
      id: 'settings',
      label: t('admin.layout.sidebar.clubs'),
      icon: <PersonStanding className="w-4 h-4 sm:mr-2" />,
      to: '/admin/clubs',
    },
  ]

  return (
    <div className="flex flex-col sm:flex-row max-w-[1440px] mx-auto bg-[#F8F9F9]">
      {/* Sidebar */}
      <div className="w-16 md:w-56">
        <div className=" p-2 sm:p-4 md:p-6">
          <h5 className="hidden md:block  font-bold text-gray-900">
            {t('admin.layout.title')}
          </h5>
          <p className="hidden md:block text-sm text-gray-500 mt-1">
            {t('admin.layout.description')}
          </p>
        </div>
        <nav className="p-2 flex sm:flex-col justify-between w-screen sm:w-full">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className={`w-full flex flex-col sm:flex-row items-center justify-center md:justify-start px-2 md:px-6 py-3 text-sm transition-colors duration-150 ${location.pathname.includes(item.to)
                ? 'bg-blue-50 sm:border-r-4 border-b-4 sm:border-b-0 border-[#4C97F1] font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              {item.icon}
              <span className="sm:hidden md:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white sm:border border-[#EFEFEF] rounded-[3px] sm:mx-4 sm:my-3 overflow-x-scroll">
        <Outlet />
      </div>
    </div>
  )
}
