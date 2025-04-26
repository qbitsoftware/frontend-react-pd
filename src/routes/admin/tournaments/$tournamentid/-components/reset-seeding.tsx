import { Button } from "@/components/ui/button";
import { UsePostOrderReset } from "@/queries/participants";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ResetSeeding = ({
  tournament_id,
  table_id,
}: {
  tournament_id: number;
  table_id: number;
}) => {
  const { t } = useTranslation();
  const resetSeedingMutation = UsePostOrderReset(tournament_id, table_id);

  const handleReset = async () => {
    try {
      await resetSeedingMutation.mutateAsync();
    } catch (error) {
      void error;
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">
          {t('admin.tournaments.groups.reset_seeding.title')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('admin.tournaments.groups.reset_seeding.title', 'Reset Seeding')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('admin.tournaments.groups.reset_seeding.subtitle', 'Are you sure you want to reset the seeding? This action cannot be undone.')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t('common.cancel', 'Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>
            {t('common.confirm', 'Confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResetSeeding;