import ErrorPage from "@/components/error";
import Standings from "@/components/standings";
import { UseGetPlacements } from "@/queries/brackets";
import EmptyComponent from "@/routes/-components/empty-component";
import LoadingScreen from "@/routes/-components/loading-screen";
import { useParams } from "@tanstack/react-router";

const StandingsProtocol = ({group_id}: {group_id: number}) => {
  const { tournamentid } = useParams({ strict: false });
  const {
    data: participants,
    isLoading,
    isError,
  } = UseGetPlacements(Number(tournamentid), group_id);
  console.log("participants", participants);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    <div>
      <ErrorPage />
    </div>;
  }

  if (participants && participants.data) {
    return (
      <>
        <Standings participants={participants.data} />
      </>
    );
  }

  return (
    <div>
      <EmptyComponent errorMessage="competitions.errors.standings_missing" />
    </div>
  );
};

export default StandingsProtocol;
