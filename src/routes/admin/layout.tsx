import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
  useRouter,
} from '@tanstack/react-router'
import {

  SidebarProvider,
} from "@/components/ui/sidebar";
import AdminSidebar from "./-components/admin-sidebar";
import AdminBottomNav from "./-components/admin-bottom-nav";
import { useEffect } from 'react';
import ErrorPage from '@/components/error';
import { UseGetCurrentUser } from '@/queries/users';
import { ErrorResponse } from '@/types/errors';
import { useUser } from '@/providers/userProvider';

// Helper function to get cookie value
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  errorComponent: () => <ErrorPage />,
  loader: async ({ context: { queryClient } }) => {
    try {
      await queryClient.ensureQueryData(UseGetCurrentUser());
    } catch (error) {
      const err = error as ErrorResponse;
      if (err.response.status === 401) {
        throw redirect({
          to: "/",
        });
      }
      throw error;
    }
  },
});

function RouteComponent() {
  const router = useRouter();
  const location = useLocation();
  const { user } = useUser();

  // Get the default state from the cookie
  const defaultOpen = getCookie("sidebar:state") !== "false";

  if (!user || user.role != "admin") {
    router.navigate({ to: "/" });
  }

  useEffect(() => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      router.navigate({
        to: "/admin/dashboard",
      });
    }
  }, [location.pathname, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col mx-auto bg-[#F8F9F9]">
      <div className="overflow-hidden">
        <SidebarProvider defaultOpen={defaultOpen}>
          <AdminSidebar />
          {/* Main Content */}
          <div className="w-full overflow-x-auto">
            <Outlet />
          </div>
        </SidebarProvider>
        <AdminBottomNav />
      </div>
    </div>
  );
}
