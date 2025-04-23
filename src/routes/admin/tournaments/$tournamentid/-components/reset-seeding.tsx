import { Button } from "@/components/ui/button";
import { UsePostOrderReset } from "@/queries/participants";
import { useTranslation } from "react-i18next";

const ResetSeeding = ({
  tournament_id,
  table_id,
}: {
  tournament_id: number;
  table_id: number;
}) => {
  const { t } = useTranslation()
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
      {t('admin.tournaments.groups.reset_seeding')}
    </Button>
  );
};

export default ResetSeeding;
