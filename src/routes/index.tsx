import { createFileRoute } from "@tanstack/react-router";
import HomePageGrid from "./-components/home-grid";
import { UseGetTournaments } from "@/queries/tournaments";
import { UseGetUsers } from "@/queries/users";
import { UseGetBlogsOption } from "@/queries/blogs";
import ErrorPage from "@/components/error";


export const Route = createFileRoute("/")({
  component: Index,
  loader: async ({ context: { queryClient } }) => {
    const tournaments = await queryClient.ensureQueryData(UseGetTournaments())
    const users = await queryClient.ensureQueryData(UseGetUsers())
    const articles_data = await queryClient.ensureQueryData(UseGetBlogsOption())
    return { tournaments, users, articles_data }
  },
  errorComponent: () => <ErrorPage />
});

function Index() {
  const { tournaments, users, articles_data } = Route.useLoaderData();

  return (
    <HomePageGrid tournaments={tournaments.data} users={users.data} articles={articles_data.data.blogs} />
  )
}