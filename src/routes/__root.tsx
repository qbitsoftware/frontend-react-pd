import { QueryClient } from "@tanstack/react-query"
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { Suspense } from "react"
import { TanStackQueryDevtools, TanStackRouterDevtools } from "@/React.lazy"

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient
}>()({
    component: () => {
        return (
            <>
                <div className="p-2 flex gap-2">
                    <Link to="/" className="[&.active]:font-bold">
                        Home
                    </Link>{' '}
                    <Link to="/about" className="[&.active]:font-bold">
                        About
                    </Link>
                    <Link to="/tournaments" className="[&.active]:font-bold">
                        Tournaments
                    </Link>
                </div>
                <hr />

                <Outlet />
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