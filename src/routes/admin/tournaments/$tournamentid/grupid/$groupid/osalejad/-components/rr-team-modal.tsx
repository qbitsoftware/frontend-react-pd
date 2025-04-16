import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { capitalize } from "@/lib/utils";
import { Trash2, UserPlus, Edit, Save } from "lucide-react";
import placeholderImg from "@/assets/placheolderImg.svg";
import { useParticipantForm } from "@/providers/participantProvider";
import { Participant } from "@/types/participants";
import { User } from "@/types/users";

interface RoundrobinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Participant | null;
  groupIds: number[];
}

const RoundrobinTeamModal = ({
  isOpen,
  onClose,
  team,
  groupIds,
}: RoundrobinTeamModalProps) => {
  // Use the participant form context
  const {
    participantsState,
    handleAddOrUpdateParticipant,
    handleDeleteParticipant,
    playerSuggestions,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm
  } = useParticipantForm();

  // Local UI state
  const [teamName, setTeamName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Initialize state when modal opens with a team
  useEffect(() => {
    if (team) {
      setTeamName(team.name);
    }
  }, [team, isOpen]);

  // Handle popover visibility based on search term
  useEffect(() => {
    if (debouncedSearchTerm && isAddingPlayer) {
      const timeout = setTimeout(() => setPopoverOpen(true), 50);
      return () => clearTimeout(timeout);
    } else {
      setPopoverOpen(false);
    }
  }, [debouncedSearchTerm, isAddingPlayer]);

  // Cancel all editing states
  const handleCancel = () => {
    setIsEditingName(false);
    setIsAddingPlayer(false);
    setSearchTerm("");
    onClose();
  };

  // Save team name changes
  const saveTeamName = () => {
    if (!team) return;
    
    const updatedTeam = {
      ...team,
      name: teamName,
    };
    
    handleAddOrUpdateParticipant(updatedTeam, team.id);
    setIsEditingName(false);
  };

  // Change team's group
  const handleChangeGroup = (groupId: string) => {
    if (!team) return;
    
    const updatedTeam = {
      ...team,
      group: parseInt(groupId),
    };
    
    handleAddOrUpdateParticipant(updatedTeam, team.id);
  };

  // Handle selecting a player to add to team
  const handleSelectPlayer = (user: User) => {
    if (!team) return;

    const existingPlayers = team.players || [];
    const updatedTeam = {
      ...team,
      players: [
        ...existingPlayers.map((player) => ({
          id: player.id,
          name: `${player.first_name} ${player.last_name}`,
          first_name: player.first_name,
          last_name: player.last_name,
          user_id: player.user_id,
          sex: player.sex,
          sport_type: player.sport_type || "tabletennis",
          extra_data: {
            rate_order: player.extra_data?.rate_order || 0,
            club: player.extra_data?.club || "",
            rate_points: player.extra_data?.rate_points || 0,
            eltl_id: player.extra_data?.eltl_id || 0,
            class: player.extra_data?.class || "",
          },
        })),
        {
          name: `${user.first_name} ${user.last_name}`,
          first_name: user.first_name,
          last_name: user.last_name,
          user_id: user.id,
          sex: user.sex,
          sport_type: "tabletennis",
          extra_data: {
            rate_order: user.rate_order || 0,
            club: user.club_name || "",
            rate_points: user.rate_points || 0,
            eltl_id: user.eltl_id || 0,
            class: "",
            image_url: "",
          },
        },
      ],
    };

    handleAddOrUpdateParticipant(updatedTeam, team.id);
    setSearchTerm("");
    setIsAddingPlayer(false);
    setPopoverOpen(false);
  };

  // Remove player from team
  const removePlayerFromTeam = (playerIndex: number) => {
    if (!team) return;

    const updatedTeam = {
      ...team,
      players: team.players
        .filter((_, index: number) => index !== playerIndex)
        .map((player) => ({
          id: player.id,
          name: `${player.first_name} ${player.last_name}`,
          first_name: player.first_name,
          last_name: player.last_name,
          user_id: player.user_id,
          sex: player.sex,
          sport_type: player.sport_type || "tabletennis",
          extra_data: {
            rate_order: player.extra_data?.rate_order || 0,
            club: player.extra_data?.club || "",
            rate_points: player.extra_data?.rate_points || 0,
            eltl_id: player.extra_data?.eltl_id || 0,
            class: player.extra_data?.class || "",
            image_url: player.extra_data?.image_url || "",
          },
        })),
    };

    handleAddOrUpdateParticipant(updatedTeam, team.id);
  };

  if (!team) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex gap-2 items-center">
                  <Input
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-64"
                  />
                  <Button size="sm" onClick={saveTeamName}>
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  {team.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingName(true)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                handleDeleteParticipant(team.id);
                onClose();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Group selection */}
        <div className="mb-4">
          <Label htmlFor="group-selection">Group Assignment</Label>
          <Select 
            value={team.group?.toString() || "1"} 
            onValueChange={handleChangeGroup}
          >
            <SelectTrigger id="group-selection">
              <SelectValue placeholder="Select Group" />
            </SelectTrigger>
            <SelectContent>
              {groupIds.map((id) => (
                <SelectItem key={id} value={id.toString()}>
                  Group {id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Players list */}
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Players</h3>
          
          {/* Current players */}
          <div className="max-h-[200px] overflow-y-auto">
            <ul className="space-y-2">
              {team.players && team.players.length > 0 ? (
                team.players.map((player, index) => (
                  <li
                    key={`${player.id || index}`}
                    className="flex justify-between items-center p-2 rounded bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={player.extra_data?.image_url || placeholderImg} />
                        <AvatarFallback>
                          {player.first_name?.[0]}
                          {player.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {player.first_name} {player.last_name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlayerFromTeam(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No players in this team</p>
              )}
            </ul>
          </div>

          {/* Add player section */}
          <div className="mt-4">
            <Popover
              open={popoverOpen}
              onOpenChange={(open) => setPopoverOpen(open)}
            >
              <PopoverTrigger asChild>
                <div className="flex relative">
                  {isAddingPlayer ? (
                    <>
                      <Input
                        placeholder="Search for player..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                        autoComplete="off"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => {
                          setIsAddingPlayer(false);
                          setSearchTerm("");
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsAddingPlayer(true)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Player
                    </Button>
                  )}
                </div>
              </PopoverTrigger>
              
              {playerSuggestions && 
               playerSuggestions.data && 
               debouncedSearchTerm && 
               isAddingPlayer && (
                <PopoverContent
                  className="p-0 w-[200px] max-h-[400px] overflow-y-auto suggestion-dropdown"
                  align="start"
                  sideOffset={5}
                  onInteractOutside={(e) => {
                    if ((e.target as HTMLElement).closest('input')) {
                      e.preventDefault();
                    } else {
                      setPopoverOpen(false);
                    }
                  }}
                  onOpenAutoFocus={(e) => {
                    e.preventDefault();
                  }}
                >
                  {playerSuggestions.data.map((user: User, i: number) => (
                    <div
                      key={i}
                      className="px-3 py-2 cursor-pointer hover:bg-accent"
                      onClick={() => handleSelectPlayer(user)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={placeholderImg} />
                          <AvatarFallback>
                            {user.first_name?.[0]}
                            {user.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {capitalize(user.first_name)} {capitalize(user.last_name)} {user.eltl_id}
                        </span>
                      </div>
                    </div>
                  ))}
                </PopoverContent>
              )}
            </Popover>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoundrobinTeamModal;