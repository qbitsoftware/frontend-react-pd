import { createFileRoute } from "@tanstack/react-router";
import TeamPlayerTable from "./-components/team-player-table";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./-components/sidebar";

export const Route = createFileRoute("/testing/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100 z-100">
        <AppSidebar />
        <main className="flex-1 p-4">
          <div className="flex items-center mb-4">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-2xl font-bold">Teams and Players</h1>
          </div>
          <TeamPlayerTable />
        </main>
      </div>
    </SidebarProvider>
  );
}
