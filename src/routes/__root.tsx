import { QueryClient } from "@tanstack/react-query"
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { Suspense } from "react"
import { TanStackQueryDevtools, TanStackRouterDevtools } from "@/React.lazy"
import Footer from "./-components/footer"
import Navbar from "@/components/navbar"

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient
}>()({
    component: () => {
        return (
            <>
                <Navbar />
                <div className="min-h-screen">
                    <Outlet />
                </div>
                <Footer />
                <Suspense >
                    <TanStackRouterDevtools />
                    <TanStackQueryDevtools />
                </Suspense>
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