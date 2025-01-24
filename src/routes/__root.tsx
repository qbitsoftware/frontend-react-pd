import { QueryClient } from "@tanstack/react-query"
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { Suspense } from "react"
import { TanStackQueryDevtools, TanStackRouterDevtools } from "@/React.lazy"
import Footer from "./-components/footer"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useLocation } from "@tanstack/react-router"

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient
}>()({
    component: () => {
        const location = useLocation();

        const isAdminPage = location.pathname.startsWith('/admin');
        return (
            <>
                <SidebarProvider defaultOpen={false}>
                    <div className="flex flex-col h-screen w-full">
                        <div className="flex-shrink-0">
                            <Navbar />
                        </div>
                        <div className={`flex-1 ${isAdminPage ? 'overflow-hidden' : ''}`}>
                            <Outlet />
                        </div>

                        <Footer />
                        <Toaster />
                        <Suspense>
                            <TanStackRouterDevtools />
                            <TanStackQueryDevtools />
                        </Suspense>
                    </div>
                    <AppSidebar />
                </SidebarProvider>
            </>
        )
    },
    notFoundComponent: () => {
        return (
            <div>
                <p>This is the notFoundComponent configured on root route</p>
                <Link to="/">Start Over</Link>
            </div>
        )
    }
})