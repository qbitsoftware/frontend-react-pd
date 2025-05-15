import { UseCreateParticipants, UseUpdateParticipant, UseDeleteParticipant} from '@/queries/participants';
import { createParticipantUtils } from '@/routes/admin/tournaments/$tournamentid/grupid/$groupid/osalejad/-components/participant-utils';

export function useParticipantUtils(tournamentId: number, tableId: number) {
  
  const createMutation = UseCreateParticipants(tournamentId, tableId);
  const updateMutation = UseUpdateParticipant(tournamentId, tableId);
  const deleteMutation = UseDeleteParticipant(tournamentId, tableId);
  
  return createParticipantUtils({
    createParticipantMutation: createMutation,
    updateParticipantMutation: updateMutation,
    deleteParticipantMutation: deleteMutation,
  });
}