import { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
  useLocation
} from "@tanstack/react-router";
import { Suspense, useEffect, useState } from "react";
import Footer from "./-components/footer";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotFoundPage from "./-components/notfound";
import LoadingScreen from "./-components/loading-screen";
import { Toaster } from "sonner";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => {
    const { status } = useRouterState();

    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');


    const isLoading = status === "pending";

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 1024); // 'lg' breakpoint
      };

      checkMobile();

      window.addEventListener('resize', checkMobile);

      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Show navbar if: not an admin route OR if on mobile (even on admin routes)
    const showNavbar = !isAdminRoute || isMobile;
    return (
      <>
        <SidebarProvider defaultOpen={false}>
          <div className="flex flex-col w-full relative">
            {showNavbar && <Navbar />}
            <main className="flex-grow">
              <Suspense fallback={<LoadingScreen />}>
                {isLoading ? <LoadingScreen /> : <Outlet />}
              </Suspense>
            </main>
            {!isLoading && <Footer />}
            <Toaster />
          </div>
          <AppSidebar />
        </SidebarProvider>
      </>
    );
  },
  notFoundComponent: () => <NotFoundPage />,
});

