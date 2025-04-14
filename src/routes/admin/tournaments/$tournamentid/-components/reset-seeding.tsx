import { Button } from "@/components/ui/button";
import { UsePostOrderReset } from "@/queries/participants";

const ResetSeeding = ({
  tournament_id,
  table_id,
}: {
  tournament_id: number;
  table_id: number;
}) => {
  const resetSeedingMutation = UsePostOrderReset(tournament_id, table_id);

  const handleReset = () => {
    try {
      resetSeedingMutation.mutateAsync();
    } catch (error) {
      void error;
    }
  };
  return (
    <Button onClick={handleReset} variant="ghost">
      Reset seeding
    </Button>
  );
};

export default ResetSeeding;
