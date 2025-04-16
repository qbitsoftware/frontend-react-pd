import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useParticipantForm } from "@/providers/participantProvider"
import { TournamentTable } from "@/types/groups"
import { Tournament } from "@/types/tournaments"
import { User } from "@/types/users"
import { PlusCircle, Trash2, UserPlus, Edit, Save } from "lucide-react"
import { useState } from "react"
import { UseGetUsersDebounce } from "@/queries/users"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDebounce } from "@/lib/utils"
import placeholderImg from "@/assets/placheolderImg.svg"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RoundRobinFormProps {
    tournament_data: Tournament
    table_data: TournamentTable
}

const RoundRobinForm = ({ tournament_data, table_data }: RoundRobinFormProps) => {
    const {
        participantsState,
        handleAddOrUpdateParticipant,
        handleDeleteParticipant,
    } = useParticipantForm()

    // Local state for team name input and search
    const [teamName, setTeamName] = useState("")
    const [groupId, setGroupId] = useState<string>("1")
    const [searchTerm, setSearchTerm] = useState("")
    const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
    const [editingTeamName, setEditingTeamName] = useState("")
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    // Get player suggestions
    const { data: userSuggestions } = UseGetUsersDebounce(debouncedSearchTerm)

    // Handle adding a new team
    const handleAddTeam = async () => {
        await handleAddOrUpdateParticipant({
            name: teamName || `Team ${Date.now()}`,
            tournament_id: tournament_data.id,
            group: parseInt(groupId),
            sport_type: "tabletennis",
            players: []
        })
        setTeamName("")
    }

    // Handle adding a new group
    const handleAddNewGroup = async () => {
        const newGroupId = Math.max(...groupIds) + 1;

        // Create a placeholder team for the new group
        await handleAddOrUpdateParticipant({
            name: `Group ${newGroupId}`,
            tournament_id: tournament_data.id,
            group: newGroupId,
            sport_type: "tabletennis",
            players: []
        });

        // Update the selected group to the newly created one
        setGroupId(newGroupId.toString());
    };

    // Handle selecting a player to add to team
    const handleSelectPlayer = (user: User) => {
        if (!selectedTeamId) return

        const team = participantsState?.find(p => p.id === selectedTeamId)
        if (!team) return

        const updatedTeam = {
            name: team.name,
            tournament_id: team.tournament_id,
            group: team.group || parseInt(groupId),
            sport_type: team.sport_type || "tabletennis",
            players: [
                ...(team.players || []).map(player => ({
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
                    }
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
                    }
                }
            ]
        }

        handleAddOrUpdateParticipant(updatedTeam, selectedTeamId)
        setSearchTerm("")
    }

    // Save edited team name
    const saveTeamName = (teamId: string) => {
        console.log("Test we are here")
        const team = participantsState?.find(p => p.id === teamId)
        if (!team) return
        console.log("team", team)

        const updatedTeam = {
            ...team,
            deleted_at: team.deleted_at.Time,
            name: editingTeamName,
            tournament_id: team.tournament_id,
            group: team.group || parseInt(groupId),
            sport_type: team.sport_type || "tabletennis",
            players: team.players && team.players.map(player => ({
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
            }))
        }

        handleAddOrUpdateParticipant(updatedTeam, teamId)
        setEditingTeamId(null)
    }

    // Handle removing a player from team
    const removePlayerFromTeam = (teamId: string, playerIndex: number) => {
        const team = participantsState?.find(p => p.id === teamId)
        if (!team) return

        const updatedTeam = {
            name: team.name,
            tournament_id: team.tournament_id,
            group: team.group || parseInt(groupId),
            sport_type: team.sport_type || "tabletennis",
            players: team.players.filter((_, index) => index !== playerIndex)
                .map(player => ({
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
                    }
                }))
        }

        handleAddOrUpdateParticipant(updatedTeam, teamId)
    }

    // Get all unique group IDs
    const groupIds = participantsState ?
        [...new Set(participantsState.map(p => p.group || 1))] : [1]

    return (
        <div className="space-y-6">
            {/* Add new team section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Add New Team</CardTitle>
                    <Button
                        variant="outline"
                        onClick={handleAddNewGroup}
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create New Group
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="team-name">Team Name</Label>
                            <Input
                                id="team-name"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                placeholder="Enter team name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="group-id">Group</Label>
                            <Select value={groupId} onValueChange={setGroupId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {groupIds.map(id => (
                                        <SelectItem key={id} value={id.toString()}>
                                            Group {id}
                                        </SelectItem>
                                    ))}
                                    {/* Add option for new group */}
                                    <SelectItem value={(Math.max(...groupIds) + 1).toString()}>
                                        New Group {Math.max(...groupIds) + 1}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button onClick={handleAddTeam} className="w-full">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add Team
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Display teams by group */}
            {groupIds.map(groupId => (
                <div key={groupId} className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Group {groupId}</h2>
                    </div>

                    {/* Teams in this group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {participantsState?.filter(p => (p.group || 1) === groupId).map(team => (
                            <Card key={team.id} className="relative">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        {editingTeamId === team.id ? (
                                            <div className="flex gap-2 w-full">
                                                <Input
                                                    value={editingTeamName}
                                                    onChange={(e) => setEditingTeamName(e.target.value)}
                                                    className="flex-1"
                                                />
                                                <Button size="sm" onClick={() => saveTeamName(team.id)}>
                                                    <Save className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <CardTitle className="flex items-center gap-2">
                                                {team.name}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingTeamId(team.id);
                                                        setEditingTeamName(team.name);
                                                    }}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </CardTitle>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteParticipant(team.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <h3 className="font-medium">Players</h3>
                                        <ul className="space-y-2">
                                            {team.players && team.players.map((player, index) => (
                                                <li
                                                    key={`${player.id || index}`}
                                                    className="flex justify-between items-center p-2 rounded bg-gray-50"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Avatar>
                                                            <AvatarImage src={placeholderImg} />
                                                            <AvatarFallback>
                                                                {player.first_name?.[0]}{player.last_name?.[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span>{player.first_name} {player.last_name}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removePlayerFromTeam(team.id, index)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Add player section */}
                                        <div className="mt-4">
                                            {selectedTeamId === team.id ? (
                                                <div className="space-y-2">
                                                    <Input
                                                        placeholder="Search for player..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />

                                                    {userSuggestions && userSuggestions.data && searchTerm && (
                                                        <div className="border rounded max-h-48 overflow-y-auto">
                                                            {userSuggestions.data.map((user: User) => (
                                                                <div
                                                                    key={user.id}
                                                                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                                    onClick={() => handleSelectPlayer(user)}
                                                                >
                                                                    <Avatar className="w-6 h-6">
                                                                        <AvatarImage src={placeholderImg} />
                                                                        <AvatarFallback>
                                                                            {user.first_name?.[0]}{user.last_name?.[0]}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <span>{user.first_name} {user.last_name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedTeamId(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => setSelectedTeamId(team.id)}
                                                >
                                                    <UserPlus className="w-4 h-4 mr-2" />
                                                    Add Player
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RoundRobinForm