import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { Suspense } from "react"
import { TanStackRouterDevtools } from "@/React.lazy"

const queryClient = new QueryClient()

export const Route = createRootRouteWithContext<{}>()({
    component: () => (
        <>
            <QueryClientProvider client={queryClient}>
                <div className="p-2 flex gap-2">
                    <Link to="/" className="[&.active]:font-bold">
                        Home
                    </Link>{' '}
                    <Link to="/about" className="[&.active]:font-bold">
                        About
                    </Link>
                </div>
                <hr />
                <Outlet />
                <Suspense >
                    <TanStackRouterDevtools />
                </Suspense>
            </QueryClientProvider>
        </>
    ),
    notFoundComponent: () => {
        return (
            <div>
                <p>This is the notFoundComponent configured on root route</p>
                <Link to="/">Start Over</Link>
            </div>
        )
    }
})