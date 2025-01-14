import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Trophy,
  Users,
  FileText,
  Settings,
} from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'


export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {

  const router = useRouter()
  const location = useLocation()
  const { t } = useTranslation()

  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === "/admin/") {
      router.navigate({
        to: '/admin/dashboard',
      })
    }
  }, [location.pathname])



  const menuItems = [
    {
      id: 'dashboard',
      label: t('admin.layout.sidebar.dashboard'),
      icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
      to: '/admin/dashboard',
    },
    {
      id: 'tournaments',
      label: t('admin.layout.sidebar.tournaments'),
      icon: <Trophy className="w-4 h-4 mr-2" />,
      to: '/admin/tournaments',
    },
    {
      id: 'blog',
      label: t('admin.layout.sidebar.blogs'),
      icon: <FileText className="w-4 h-4 mr-2" />,
      to: '/admin/blog',
    },
    {
      id: 'settings',
      label: t('admin.layout.sidebar.settings'),
      icon: <Settings className="w-4 h-4 mr-2" />,
      to: '/admin/settings',
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 md:w-64 bg-white border-r border-gray-200">
        <div className="p-4 md:p-6">
          <h1 className="hidden md:block text-xl font-bold text-gray-900">
            {t('admin.layout.title')}
          </h1>
          <p className="hidden md:block text-sm text-gray-500 mt-1">
            {t('admin.layout.description')}
          </p>
        </div>
        <nav className="mt-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className={`w-full flex items-center justify-center md:justify-start px-2 md:px-6 py-3 text-sm transition-colors duration-150 ${location.pathname.includes(item.to)
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-8 py-10 pt-4 ">
        <Outlet />
      </div>
    </div>
  )
}
