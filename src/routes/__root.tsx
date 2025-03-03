import { QueryClient } from "@tanstack/react-query"
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { Suspense } from "react"
import { TanStackQueryDevtools, TanStackRouterDevtools } from "@/React.lazy"
import Footer from "./-components/footer"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient
}>()({
    component: () => {
        return (
            <>
                <SidebarProvider defaultOpen={false}>
                    <div className="flex flex-col w-full relative">
                        <Navbar />
                        <main className="flex-grow ">
                        <Outlet />
                        </main>
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