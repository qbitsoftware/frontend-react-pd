import { createFileRoute } from "@tanstack/react-router";
import { MatchesResponse, UseGetMatchesAllQuery, UseGetMatchesQuery } from "@/queries/match";
import { MatchesTable } from "../../../-components/matches-table";
import { UseGetTournamentTable } from "@/queries/tables";
import Loader from "@/components/loader";
import ErrorPage from "@/components/error";
import { ErrorResponse } from "@/types/errors";

export const Route = createFileRoute(
  "/admin/tournaments/$tournamentid/grupid/$groupid/mangud/"
)({
  errorComponent: () => <ErrorPage />,
  loader: async ({ context: { queryClient }, params }) => {
    const matches: MatchesResponse | undefined = undefined;
    let table_data;
    try {
      table_data = await queryClient.ensureQueryData(
        UseGetTournamentTable(
          Number(params.tournamentid),
          Number(params.groupid)
        )
      );
    } catch (error) {
      const err = error as ErrorResponse;
      if (err.response.status !== 404) {
        throw error;
      }
    }
    return { matches, params, table_data };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { tournamentid, groupid } = Route.useParams();

  const { data: matches } = UseGetMatchesQuery(
    Number(tournamentid),
    Number(groupid)
  );

  const { data: matches_for_time_change } = UseGetMatchesAllQuery(
    Number(tournamentid),
    Number(groupid)
  );

  const { table_data } = Route.useLoaderData();
  if (matches && table_data && table_data.data && matches_for_time_change) {
    return (
      <div className="pb-12">
        <MatchesTable
          tournament_id={Number(tournamentid)}
          player_count={table_data.data.min_team_size}
          data={matches.data || []}
          all_matches={matches_for_time_change.data || []}
          tournament_table={table_data.data}
        />
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader />
      </div>
    );
  }
}
