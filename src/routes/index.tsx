import { createFileRoute } from "@tanstack/react-router";
import HomePageGrid from "./-components/home-grid";
import { UseGetTournaments } from "@/queries/tournaments";
import { UseGetUsers } from "@/queries/users";
import ErrorPage from "@/components/error";

export const Route = createFileRoute("/")({
  component: Index,
  loader: async ({ context: { queryClient } }) => {
    const tournaments = await queryClient.ensureQueryData(UseGetTournaments())
    const users = await queryClient.ensureQueryData(UseGetUsers())
    return { tournaments, users }
  },
  errorComponent: () => <ErrorPage />
});

function Index() {
  const { tournaments, users } = Route.useLoaderData();

  return (
    <HomePageGrid tournaments={tournaments.data} users={users.data} />
  )
}