import { z } from "zod";import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  UseGetTournamentParticipants, 
  UseCreateParticipants, 
  UseUpdateParticipant, 
  UseDeleteParticipant 
} from "@/queries/participants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User, UserPlus, Trash2, Edit2, Plus, UsersRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useToastNotification } from "@/components/toast-notification";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { addPlayerImage } from "@/queries/images";
import { useTournament } from "@/routes/voistlused/$tournamentid/-components/tournament-provider";
import { Participant, Player, Tournament, TournamentTable } from "@/types/types";

const participantSchema = z.object({
  name: z.string().min(1, "Participant name is required"),
  order: z.number().optional(),
  tournament_id: z.number().min(1),
  sport_type: z.string().default("tabletennis"),
  players: z
    .array(
      z.object({
        id: z.string().optional(),
        user_id: z.number().optional(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        name: z.string(),
        sport_type: z.string().default("tabletennis"),
        extra_data: z.object({
          rate_order: z.number().min(0, "Rating number is required").optional(),
          club: z.string().optional(),
          rate_points: z.number(),
          eltl_id: z.number().min(0, "eltl id is required").optional(),
          class: z.string().optional(),
        }),
        sex: z.string().optional(),
        number: z.number().optional(),
      }),
    ),
  class: z.string().optional(),
});

const playerFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  number: z.number().optional().nullable(),
  sex: z.string().default("M"),
  extra_data: z.object({
    rate_order: z.number().default(0).optional(),
    club: z.string().default("").optional(),
    rate_points: z.number().default(0),
    eltl_id: z.number().default(0).optional(),
    class: z.string().default("").optional(),
  }).optional(),
});

export type ParticipantFormValues = z.infer<typeof participantSchema>;
export type PlayerFormValues = z.infer<typeof playerFormSchema>;

interface ParticipantFormProps {
  participants: Participant[] | null;
  tournament_data: Tournament;
  table_data: TournamentTable;
}

// For file input change event
interface FileInputEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}

export default function TournamentParticipantsManager({ 
  participants,
  tournament_data,
  table_data 
}: ParticipantFormProps): JSX.Element {
  // Hooks and state
  const tournamentId = tournament_data.id;
  const tableId = table_data.id;
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const toast = useToast();
  const { successToast, errorToast } = useToastNotification(toast);
  
  // State management
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState<boolean>(false);
  const [isPlayerDialogOpen, setIsPlayerDialogOpen] = useState<boolean>(false);
  const [activeTeam, setActiveTeam] = useState<Participant | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [teamToDelete, setTeamToDelete] = useState<Participant | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerImage, setPlayerImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Form setup
  const teamForm = useForm<ParticipantFormValues>({
    defaultValues: {
      name: "",
      tournament_id: tournamentId,
      sport_type: "tabletennis",
      order: 0,
      players: []
    }
  });
  
  const playerForm = useForm<PlayerFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      number: null,
      sex: "M",
      extra_data: {
        rate_points: 0
      }
    }
  });
  
  // Query hooks
  const createParticipantMutation = UseCreateParticipants(tournamentId, tableId);
  const updateParticipantMutation = UseUpdateParticipant(tournamentId, tableId);
  const deleteParticipantMutation = UseDeleteParticipant(tournamentId, tableId);
  const playerImageMutation = addPlayerImage();
  
  // Handle team form submission
  const onTeamSubmit = (data: ParticipantFormValues): void => {
    if (isEditing && activeTeam) {
      // Update existing team
      updateParticipantMutation.mutate(
        {
          formData: data,
          participantId: activeTeam.id
        },
        {
          onSuccess: () => {
            successToast(t('toasts.team_updated'));
            setIsTeamDialogOpen(false);
            resetTeamForm();
          },
          onError: (error) => {
            console.error("Error updating team:", error);
            errorToast(t('toasts.error_update_team'));
          }
        }
      );
    } else {
      // Create new team
      createParticipantMutation.mutate(
        data,
        {
          onSuccess: () => {
            successToast(t('toasts.team_created'));
            setIsTeamDialogOpen(false);
            resetTeamForm();
          },
          onError: (error) => {
            console.error("Error creating team:", error);
            errorToast(t('toasts.error_create_team'));
          }
        }
      );
    }
  };
  
  // Handle player form submission
  const onPlayerSubmit = async (data: PlayerFormValues): Promise<void> => {
    if (!activeTeam) return;
    
    try {
      // Create a full name for the player
      const playerName = `${data.first_name} ${data.last_name}`;
      
      // Create the updated player array
      let updatedPlayers: Player[] = [...(activeTeam.players || [])];
      
      if (selectedPlayer) {
        // Update existing player
        const playerIndex = updatedPlayers.findIndex(p => 
          p.id === selectedPlayer.id
        );
        
        if (playerIndex !== -1) {
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            name: playerName,
            first_name: data.first_name,
            last_name: data.last_name,
            number: data.number || 0,
            sex: data.sex,
            extra_data: {
              ...updatedPlayers[playerIndex].extra_data,
              rate_points: data.extra_data?.rate_points || 0,
              club: data.extra_data?.club || "",
              rate_order: data.extra_data?.rate_order || 0,
              eltl_id: data.extra_data?.eltl_id || 0,
              class: data.extra_data?.class || ""
            }
          };
        }
      } else {
        // Check if we're at max players (5)
        if (updatedPlayers.length >= 5) {
          errorToast(t('toasts.max_players'));
          return;
        }
        
        // Create temporary ID - backend will assign real one
        const tempId = `temp-${Date.now()}`;
        
        // Add new player
        updatedPlayers.push({
          id: tempId,
          user_id: 0,
          name: playerName,
          first_name: data.first_name,
          last_name: data.last_name,
          number: data.number || 0,
          sex: data.sex,
          extra_data: {
            rate_points: data.extra_data?.rate_points || 0,
            club: data.extra_data?.club || "",
            rate_order: data.extra_data?.rate_order || 0,
            eltl_id: data.extra_data?.eltl_id || 0,
            class: data.extra_data?.class || ""
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
          rank: 0,
          sport_type: activeTeam.sport_type
        });
      }
      
      // Update the participant with the new players array
      const formData: ParticipantFormValues = {
        name: activeTeam.name,
        tournament_id: tournamentId,
        sport_type: activeTeam.sport_type,
        order: activeTeam.order,
        players: updatedPlayers
      };
      
      await updateParticipantMutation.mutateAsync({
        formData,
        participantId: activeTeam.id
      });
      
      // If there's a player image and we have a player ID, upload it
      if (playerImage && selectedPlayer) {
        await playerImageMutation.mutateAsync({
          player_id: selectedPlayer.id,
          image_file: playerImage
        });
      }
      
      successToast(
        selectedPlayer 
          ? t('toasts.player_updated')
          : t('toasts.player_added')
      );
      
      setIsPlayerDialogOpen(false);
      resetPlayerForm();
    } catch (error) {
      console.error("Error with player:", error);
      errorToast(t('toasts.error_player'));
    }
  };
  
  // Handle team deletion
  const confirmDeleteTeam = (team: Participant): void => {
    setTeamToDelete(team);
    setIsDeleteDialogOpen(true);
  };
  
  const deleteTeam = (): void => {
    if (!teamToDelete) return;
    
    deleteParticipantMutation.mutate(
      teamToDelete.id,
      {
        onSuccess: () => {
          successToast(t('toasts.team_deleted'));
          setIsDeleteDialogOpen(false);
          setTeamToDelete(null);
        },
        onError: (error) => {
          console.error("Error deleting team:", error);
          errorToast(t('toasts.error_delete_team'));
        }
      }
    );
  };
  
  // Handle player removal
  const removePlayer = (player: Player): void => {
    if (!activeTeam) return;
    
    try {
      // Filter out the player to remove
      const updatedPlayers = activeTeam.players.filter(
        p => p.id !== player.id
      );
      
      // Update the participant with the new players array
      const formData: ParticipantFormValues = {
        name: activeTeam.name,
        tournament_id: tournamentId,
        sport_type: activeTeam.sport_type,
        order: activeTeam.order,
        players: updatedPlayers
      };
      
      updateParticipantMutation.mutate(
        {
          formData,
          participantId: activeTeam.id
        },
        {
          onSuccess: () => {
            successToast(t('toasts.player_removed'));
          },
          onError: (error) => {
            console.error("Error removing player:", error);
            errorToast(t('toasts.error_remove_player'));
          }
        }
      );
    } catch (error) {
      console.error("Error removing player:", error);
      errorToast(t('toasts.error_remove_player'));
    }
  };
  
  // Open team dialog for editing
  const editTeam = (team: Participant): void => {
    setActiveTeam(team);
    setIsEditing(true);
    teamForm.reset({
      name: team.name,
      tournament_id: team.tournament_id,
      sport_type: team.sport_type,
      order: team.order,
      players: team.players || []
    });
    setIsTeamDialogOpen(true);
  };
  
  // Open player dialog for adding/editing
  const addPlayerToTeam = (team: Participant): void => {
    setActiveTeam(team);
    setSelectedPlayer(null);
    resetPlayerForm();
    setIsPlayerDialogOpen(true);
  };
  
  const editPlayer = (team: Participant, player: Player): void => {
    setActiveTeam(team);
    setSelectedPlayer(player);
    
    // Ensure all expected extra_data fields have default values
    const extraData = player.extra_data || {};
    
    playerForm.reset({
      first_name: player.first_name || "",
      last_name: player.last_name || "",
      number: player.number || null,
      sex: player.sex || "M",
      extra_data: {
        rate_points: extraData.rate_points || 0,
        club: extraData.club || "",
        rate_order: extraData.rate_order || 0,
        eltl_id: extraData.eltl_id || 0,
        class: extraData.class || ""
      }
    });
    setIsPlayerDialogOpen(true);
  };
  
  // Reset forms
  const resetTeamForm = (): void => {
    teamForm.reset({
      name: "",
      tournament_id: tournamentId,
      sport_type: "tabletennis",
      order: 0,
      players: []
    });
    setIsEditing(false);
    setActiveTeam(null);
  };
  
  const resetPlayerForm = (): void => {
    playerForm.reset({
      first_name: "",
      last_name: "",
      number: null,
      sex: "M",
      extra_data: {
        rate_points: 0,
        club: "",
        rate_order: 0,
        eltl_id: 0,
        class: ""
      }
    });
    setSelectedPlayer(null);
    setPlayerImage(null);
  };
  
  // Handle image upload for player
  const handleImageUpload = (e: FileInputEvent): void => {
    const file = e.target.files[0];
    if (file) {
      setPlayerImage(file);
    }
  };
  
  // Loading state
  if (!participants) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
        <Button 
          onClick={() => {
            resetTeamForm();
            setIsTeamDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('add_team')}
        </Button>
      </div>
      
      {participants && participants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map((team: Participant) => (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => editTeam(team)}
                      title={t('edit_team')}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">{t('edit_team')}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => confirmDeleteTeam(team)}
                      title={t('delete_team')}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">{t('delete_team')}</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <UsersRound className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {t('players', { count: team.players?.length || 0 })}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => addPlayerToTeam(team)}
                    disabled={team.players?.length >= 5}
                  >
                    <UserPlus className="h-4 w-4" />
                    {t('add_player')}
                  </Button>
                </div>
                
                {team.players && team.players.length > 0 ? (
                  <div className="space-y-2">
                    {team.players.map((player: Player) => (
                      <div 
                        key={player.id} 
                        className="flex justify-between items-center p-2 rounded-md bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-500" />
                            
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{player.last_name} {player.first_name}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editPlayer(team, player)}
                          >
                            <Edit2 className="h-3 w-3" />
                            <span className="sr-only">{t('edit_player')}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removePlayer(player)}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">{t('remove_player')}</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed rounded-lg">
                    <p className="text-muted-foreground text-sm">
                      {t('no_players')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <UsersRound className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">{t('no_teams')}</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {t('no_teams_description')}
            </p>
            <Button 
              onClick={() => {
                resetTeamForm();
                setIsTeamDialogOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('add_team')}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Team Dialog */}
      <Dialog open={isTeamDialogOpen} onOpenChange={(open: boolean) => {
        if (!open) {
          setIsTeamDialogOpen(false);
          resetTeamForm();
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing 
                ? t('edit_team_title') 
                : t('add_team_title')}
            </DialogTitle>
            <DialogDescription>
              {t('team_dialog_description')}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...teamForm}>
            <form onSubmit={teamForm.handleSubmit(onTeamSubmit)} className="space-y-4">
              <FormField
                control={teamForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('team_name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('team_name_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Add other team fields as needed */}
              
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsTeamDialogOpen(false);
                    resetTeamForm();
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
                  {isEditing 
                    ? t('update_team') 
                    : t('create_team')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Player Dialog */}
      <Dialog open={isPlayerDialogOpen} onOpenChange={(open: boolean) => {
        if (!open) {
          setIsPlayerDialogOpen(false);
          resetPlayerForm();
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedPlayer
                ? t('edit_player_title')
                : t('add_player_title')}
            </DialogTitle>
            <DialogDescription>
              {t('player_dialog_description')}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...playerForm}>
            <form onSubmit={playerForm.handleSubmit(onPlayerSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={playerForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('first_name')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={playerForm.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('last_name')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={playerForm.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('number')}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={playerForm.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('sex')}</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="M">{t('male')}</option>
                          <option value="F">{t('female')}</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Additional player fields from schema */}
              <div className="space-y-4">
                <FormField
                  control={playerForm.control}
                  name="extra_data.club"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('club')}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={playerForm.control}
                    name="extra_data.rate_points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('rating_points')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || 0}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={playerForm.control}
                    name="extra_data.eltl_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('eltl_id')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || 0}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={playerForm.control}
                  name="extra_data.class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('class')}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Player Image Upload */}
              <div>
                <FormLabel>{t('player_image')}</FormLabel>
                <div className="mt-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsPlayerDialogOpen(false);
                    resetPlayerForm();
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
                  {selectedPlayer
                    ? t('update_player')
                    : t('add_player')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirm_delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirm_delete_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTeam}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}