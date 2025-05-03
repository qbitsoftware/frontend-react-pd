"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GripVertical, Plus, Pencil, Save, X, ChevronDown, ChevronUp } from "lucide-react"

// Define types for our data structure
type Player = {
  id: string
  name: string
  yearOfBirth: string
  club: string
  sex: "M" | "F"
  playerId: string
  rating: number
  isEditing?: boolean
  isNew?: boolean
}

type Team = {
  id: string
  name: string
  position: number
  players: Player[]
  isExpanded: boolean
  isEditing?: boolean
  isNew?: boolean
}

export default function TeamPlayerTable() {
  // Initial dummy data
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "team-1",
      name: "Maardu Eagles",
      position: 1,
      isExpanded: true,
      players: [
        {
          id: "player-1",
          name: "Jaan Kross",
          yearOfBirth: "1990",
          club: "Maardu Lõvid",
          sex: "M",
          playerId: "14924",
          rating: 788,
        },
        {
          id: "player-2",
          name: "Mari Tamm",
          yearOfBirth: "1992",
          club: "Maardu Lõvid",
          sex: "F",
          playerId: "15632",
          rating: 745,
        },
      ],
    },
    {
      id: "team-2",
      name: "Tallinn Stars",
      position: 2,
      isExpanded: true,
      players: [
        {
          id: "player-3",
          name: "Peeter Kask",
          yearOfBirth: "1988",
          club: "Tallinn SK",
          sex: "M",
          playerId: "12475",
          rating: 812,
        },
        {
          id: "player-4",
          name: "Liisa Mets",
          yearOfBirth: "1995",
          club: "Tallinn SK",
          sex: "F",
          playerId: "17834",
          rating: 732,
        },
      ],
    },
    {
      id: "team-3",
      name: "Tartu Tigers",
      position: 3,
      isExpanded: true,
      players: [
        {
          id: "player-5",
          name: "Andres Kuusk",
          yearOfBirth: "1991",
          club: "Tartu TK",
          sex: "M",
          playerId: "13567",
          rating: 795,
        },
        {
          id: "player-6",
          name: "Kati Lepp",
          yearOfBirth: "1993",
          club: "Tartu TK",
          sex: "F",
          playerId: "16423",
          rating: 756,
        },
      ],
    },
  ])

  const [draggedTeamId, setDraggedTeamId] = useState<string | null>(null)
  const draggedItemRef = useRef<HTMLDivElement | null>(null)
  const dragOverItemRef = useRef<HTMLDivElement | null>(null)

  // Function to handle team expansion
  const toggleTeamExpansion = (teamId: string) => {
    setTeams(teams.map((team) => (team.id === teamId ? { ...team, isExpanded: !team.isExpanded } : team)))
  }

  // Function to start editing a team
  const startEditingTeam = (teamId: string) => {
    setTeams(teams.map((team) => (team.id === teamId ? { ...team, isEditing: true } : team)))
  }

  // Function to save team edits
  const saveTeamEdits = (teamId: string, newName: string, newPosition: number) => {
    setTeams(
      teams
        .map((team) =>
          team.id === teamId
            ? {
                ...team,
                name: newName,
                position: newPosition,
                isEditing: false,
                isNew: false,
              }
            : team,
        )
        .sort((a, b) => a.position - b.position),
    )
  }

  // Function to cancel team edits
  const cancelTeamEdits = (teamId: string) => {
    setTeams(
      teams
        .filter((team) => !(team.id === teamId && team.isNew))
        .map((team) => (team.id === teamId ? { ...team, isEditing: false } : team)),
    )
  }

  // Function to add a new team
  const addNewTeam = () => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: "",
      position: teams.length + 1,
      players: [],
      isExpanded: true,
      isEditing: true,
      isNew: true,
    }
    setTeams([...teams, newTeam])
  }

  // Function to start editing a player
  const startEditingPlayer = (teamId: string, playerId: string) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              players: team.players.map((player) => (player.id === playerId ? { ...player, isEditing: true } : player)),
            }
          : team,
      ),
    )
  }

  // Function to save player edits
  const savePlayerEdits = (
    teamId: string,
    playerId: string,
    name: string,
    yearOfBirth: string,
    club: string,
    sex: "M" | "F",
    playerIdValue: string,
    rating: number,
  ) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              players: team.players.map((player) =>
                player.id === playerId
                  ? {
                      ...player,
                      name,
                      yearOfBirth,
                      club,
                      sex,
                      playerId: playerIdValue,
                      rating,
                      isEditing: false,
                      isNew: false,
                    }
                  : player,
              ),
            }
          : team,
      ),
    )
  }

  // Function to cancel player edits
  const cancelPlayerEdits = (teamId: string, playerId: string) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              players: team.players
                .filter((player) => !(player.id === playerId && player.isNew))
                .map((player) => (player.id === playerId ? { ...player, isEditing: false } : player)),
            }
          : team,
      ),
    )
  }

  // Function to add a new player to a team
  const addNewPlayer = (teamId: string) => {
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: "",
      yearOfBirth: "",
      club: "",
      sex: "M",
      playerId: "",
      rating: 0,
      isEditing: true,
      isNew: true,
    }

    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              players: [...team.players, newPlayer],
            }
          : team,
      ),
    )
  }

  // Drag and drop functions
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, teamId: string) => {
    setDraggedTeamId(teamId)
    e.currentTarget.classList.add("opacity-50")
    draggedItemRef.current = e.currentTarget
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, teamId: string) => {
    e.preventDefault()
    dragOverItemRef.current = e.currentTarget
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove("opacity-50")

    if (!draggedTeamId || !draggedItemRef.current || !dragOverItemRef.current) return

    // Get the positions
    const draggedTeam = teams.find((team) => team.id === draggedTeamId)
    const dragOverTeamId = dragOverItemRef.current.getAttribute("data-team-id")
    const dragOverTeam = teams.find((team) => team.id === dragOverTeamId)

    if (!draggedTeam || !dragOverTeam) return

    // Create a copy of teams and update positions
    const teamsCopy = [...teams]
    const draggedTeamIndex = teamsCopy.findIndex((team) => team.id === draggedTeamId)
    const dragOverTeamIndex = teamsCopy.findIndex((team) => team.id === dragOverTeamId)

    // Swap positions
    const tempPosition = teamsCopy[draggedTeamIndex].position
    teamsCopy[draggedTeamIndex].position = teamsCopy[dragOverTeamIndex].position
    teamsCopy[dragOverTeamIndex].position = tempPosition

    // Sort by position
    teamsCopy.sort((a, b) => a.position - b.position)

    setTeams(teamsCopy)
    setDraggedTeamId(null)
  }

  const handlePositionChange = (teamId: string, newPosition: number) => {
    // Ensure position is within bounds
    const boundedPosition = Math.max(1, Math.min(teams.length, newPosition))

    // Find the team to update
    const teamToUpdate = teams.find((team) => team.id === teamId)
    if (!teamToUpdate) return

    // Create a copy of teams
    const teamsCopy = [...teams]

    // Update positions for all teams
    teamsCopy.forEach((team) => {
      if (team.id === teamId) {
        // Update the target team's position
        team.position = boundedPosition
      } else if (
        // If moving up, decrement positions of teams in between
        teamToUpdate.position > boundedPosition &&
        team.position >= boundedPosition &&
        team.position < teamToUpdate.position
      ) {
        team.position += 1
      } else if (
        // If moving down, increment positions of teams in between
        teamToUpdate.position < boundedPosition &&
        team.position <= boundedPosition &&
        team.position > teamToUpdate.position
      ) {
        team.position -= 1
      }
    })

    // Sort by position
    teamsCopy.sort((a, b) => a.position - b.position)

    setTeams(teamsCopy)
  }

  return (
    <div className="container mx-auto py-6 bg-gray-100 rounded-lg p-6">
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl font-bold">Teams and Players Management</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4">
            {teams
              .sort((a, b) => a.position - b.position)
              .map((team) => (
                <div
                  key={team.id}
                  className="bg-white rounded-md shadow-sm mb-4 overflow-hidden hover:shadow-md transition-shadow"
                  draggable={!team.isEditing}
                  onDragStart={(e) => handleDragStart(e, team.id)}
                  onDragEnter={(e) => handleDragEnter(e, team.id)}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  data-team-id={team.id}
                >
                  <div className="bg-gray-50 p-3 flex items-center border-b">
                    {team.isEditing ? (
                      <>
                        <div className="flex items-center space-x-2 flex-1">
                          <Input
                            type="number"
                            className="w-16"
                            defaultValue={team.position}
                            min={1}
                            max={teams.length}
                            id={`team-position-${team.id}`}
                          />
                          <Input
                            className="flex-1"
                            placeholder="Team Name"
                            defaultValue={team.name}
                            id={`team-name-${team.id}`}
                          />
                        </div>
                        <div className="flex space-x-2 ml-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const nameInput = document.getElementById(`team-name-${team.id}`) as HTMLInputElement
                              const positionInput = document.getElementById(
                                `team-position-${team.id}`,
                              ) as HTMLInputElement
                              saveTeamEdits(team.id, nameInput.value, Number.parseInt(positionInput.value))
                            }}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => cancelTeamEdits(team.id)}>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="flex items-center cursor-move mr-2 p-1 hover:bg-gray-200 rounded"
                          title="Drag to reorder"
                        >
                          <GripVertical className="h-5 w-5 text-gray-500" />
                          <Input
                            type="number"
                            className="w-12 h-8 ml-1"
                            value={team.position}
                            min={1}
                            max={teams.length}
                            onChange={(e) => handlePositionChange(team.id, Number.parseInt(e.target.value))}
                          />
                        </div>
                        <div className="flex-1 font-medium">{team.name}</div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => startEditingTeam(team.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => toggleTeamExpansion(team.id)}>
                            {team.isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {team.isExpanded && (
                    <div className="p-3">
                      <div className="mb-3">
                        {/* Floating header */}
                        <div className="grid grid-cols-7 gap-2 px-3 py-2 mb-2 bg-gray-100 rounded-md shadow-sm">
                          <div className="font-medium text-sm text-gray-600">Name</div>
                          <div className="font-medium text-sm text-gray-600">Year of Birth</div>
                          <div className="font-medium text-sm text-gray-600">Club</div>
                          <div className="font-medium text-sm text-gray-600">Sex</div>
                          <div className="font-medium text-sm text-gray-600">ID</div>
                          <div className="font-medium text-sm text-gray-600">Rating</div>
                          <div className="font-medium text-sm text-gray-600">Actions</div>
                        </div>

                        {/* Player rows as floating cards */}
                        <div className="space-y-2">
                          {team.players.map((player) => (
                            <div
                              key={player.id}
                              className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="grid grid-cols-7 gap-2 p-3">
                                {player.isEditing ? (
                                  <>
                                    <div>
                                      <Input
                                        placeholder="Name"
                                        defaultValue={player.name}
                                        id={`player-name-${player.id}`}
                                      />
                                    </div>
                                    <div>
                                      <Input
                                        placeholder="Year of Birth"
                                        defaultValue={player.yearOfBirth}
                                        id={`player-year-${player.id}`}
                                      />
                                    </div>
                                    <div>
                                      <Input
                                        placeholder="Club"
                                        defaultValue={player.club}
                                        id={`player-club-${player.id}`}
                                      />
                                    </div>
                                    <div>
                                      <Select defaultValue={player.sex}>
                                        <SelectTrigger id={`player-sex-${player.id}`} className="w-full">
                                          <SelectValue placeholder="Sex" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="M">M</SelectItem>
                                          <SelectItem value="F">F</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Input
                                        placeholder="ID"
                                        defaultValue={player.playerId}
                                        id={`player-id-${player.id}`}
                                      />
                                    </div>
                                    <div>
                                      <Input
                                        type="number"
                                        placeholder="Rating"
                                        defaultValue={player.rating}
                                        id={`player-rating-${player.id}`}
                                      />
                                    </div>
                                    <div>
                                      <div className="flex space-x-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const nameInput = document.getElementById(
                                              `player-name-${player.id}`,
                                            ) as HTMLInputElement
                                            const yearInput = document.getElementById(
                                              `player-year-${player.id}`,
                                            ) as HTMLInputElement
                                            const clubInput = document.getElementById(
                                              `player-club-${player.id}`,
                                            ) as HTMLInputElement
                                            const sexSelect = document.getElementById(
                                              `player-sex-${player.id}`,
                                            ) as HTMLSelectElement
                                            const idInput = document.getElementById(
                                              `player-id-${player.id}`,
                                            ) as HTMLInputElement
                                            const ratingInput = document.getElementById(
                                              `player-rating-${player.id}`,
                                            ) as HTMLInputElement

                                            savePlayerEdits(
                                              team.id,
                                              player.id,
                                              nameInput.value,
                                              yearInput.value,
                                              clubInput.value,
                                              sexSelect.value as "M" | "F",
                                              idInput.value,
                                              Number.parseInt(ratingInput.value),
                                            )
                                          }}
                                        >
                                          <Save className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => cancelPlayerEdits(team.id, player.id)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="text-sm">{player.name}</div>
                                    <div className="text-sm">{player.yearOfBirth}</div>
                                    <div className="text-sm">{player.club}</div>
                                    <div className="text-sm">{player.sex}</div>
                                    <div className="text-sm">{player.playerId}</div>
                                    <div className="text-sm">{player.rating}</div>
                                    <div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => startEditingPlayer(team.id, player.id)}
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3">
                          <Button variant="outline" size="sm" onClick={() => addNewPlayer(team.id)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Player
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

            <div className="mt-4">
              <Button onClick={addNewTeam}>
                <Plus className="h-4 w-4 mr-1" />
                Add New Team
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
