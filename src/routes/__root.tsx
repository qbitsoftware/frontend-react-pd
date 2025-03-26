import { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { Suspense } from "react";
import { TanStackQueryDevtools, TanStackRouterDevtools } from "@/React.lazy";
import Footer from "./-components/footer";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotFoundPage from "./-components/notfound";
import LoadingScreen from "./-components/loading-screen";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => {
    const { status } = useRouterState();

    const isLoading = status === "pending";
    return (
      <>
        <SidebarProvider defaultOpen={false}>
          <div className="flex flex-col w-full relative">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<LoadingScreen />}>
                {isLoading ? <LoadingScreen /> : <Outlet />}
              </Suspense>
            </main>
            {!isLoading && <Footer />}
            <Toaster />
            <Suspense>
              <TanStackRouterDevtools />
              <TanStackQueryDevtools />
            </Suspense>
          </div>
          <AppSidebar />
        </SidebarProvider>
      </>
    );
  },
  notFoundComponent: () => <NotFoundPage />,
});
