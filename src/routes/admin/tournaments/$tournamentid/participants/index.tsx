import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import type { ErrorResponse, Participant, UserNew } from "@/types/types"
import {
  UseDeleteParticipant,
  UseGetParticipants,
  UseCreateParticipants,
  UseUpdateParticipant,
  UsePostOrder,
} from "@/queries/participants"
import { UseGetTournament } from "@/queries/tournaments"
import ErrorPage from "@/components/error"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useToastNotification } from "@/components/toast-notification"
import { capitalize, useDebounce } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { UseGetUsersDebounce, fetchUserByName } from "@/queries/users"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const Route = createFileRoute("/admin/tournaments/$tournamentid/participants/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    let participants
    let tournamentData
    try {
      participants = await queryClient.ensureQueryData(UseGetParticipants(Number(params.tournamentid)))
    } catch (error) {
      const err = error as ErrorResponse
      if (err.response.status !== 404) {
        throw error
      }
    }
    try {
      tournamentData = await queryClient.ensureQueryData(UseGetTournament(Number(params.tournamentid)))
    } catch (error) {
      const err = error as ErrorResponse
      if (err.response.status !== 404) {
        throw error
      }
    }
    return { participants, tournamentData }
  },
})

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
        name: z.string().min(1, "Player name is required"),
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
    )
    .min(1, "Participant must have at least one player"),
  class: z.string().optional(),
})

type ParticipantFormValues = z.infer<typeof participantSchema>

function RouteComponent() {
  const [selectedOrderValue, setSelectedOrderValue] = useState<string | undefined>()
  const navigate = useNavigate()
  const router = useRouter()
  const toast = useToast()
  const { successToast, errorToast } = useToastNotification(toast)
  const { tournamentid } = Route.useParams()
  const { participants, tournamentData } = Route.useLoaderData()
  const [editParticipantId, setEditParticipantId] = useState<string>("")
  const deleteMutation = UseDeleteParticipant(Number(tournamentid))
  const createParticipant = UseCreateParticipants(Number(tournamentid))
  const updateParticipant = UseUpdateParticipant(Number(tournamentid))
  const updateOrdering = UsePostOrder(Number(tournamentid))

  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { data: playerSuggestions, refetch } = UseGetUsersDebounce(debouncedSearchTerm)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const form = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: "",
      tournament_id: Number(tournamentid),
      players: [
        {
          name: "",
          first_name: "",
          last_name: "",
          user_id: 0,
          sport_type: "tabletennis",
          sex: "",
          number: 0,
          extra_data: { rate_order: 0, club: "", rate_points: 0, eltl_id: 0, class: "" },
        },
      ],
    },
  })

  const editForm = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantSchema),
  })

  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)

  const handleOrder = async (order: string | undefined) => {
    if (!order) {
      return
    }
    try {
      const res = await updateOrdering.mutateAsync({ order })
      navigate({
        to: `/admin/tournaments/${tournamentid}/participants`,
        replace: true,
      })
      successToast(res.message)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (debouncedSearchTerm) {
      refetch()
    }
  }, [debouncedSearchTerm, refetch])

  const handleDeleteParticipant = async (participantId: string) => {
    try {
      const res = await deleteMutation.mutateAsync(participantId)
      router.navigate({
        to: `/admin/tournaments/${tournamentid}/participants`,
      })
      successToast(res.message)
    } catch (error) {
      errorToast("Osaleja kustutamisel tekkis viga")
    }
  }

  const handleEditParticipant = (participant: Participant) => {
    setEditingParticipant(participant)
    editForm.reset({
      name: participant.name,
      order: participant.order,
      tournament_id: Number(tournamentid),
      class: participant.extra_data.class,
      sport_type: participant.sport_type || "tabletennis",
      players: participant.players.map((player) => ({
        id: player.id,
        user_id: player.user_id,
        first_name: player.first_name,
        last_name: player.last_name,
        name: `${player.first_name} ${player.last_name}`,
        sport_type: player.sport_type || "tabletennis",
        sex: player.sex,
        number: player.number,
        extra_data: {
          rate_order: player.extra_data.rate_order,
          club: player.extra_data.club,
          rate_points: player.extra_data.rate_points,
          eltl_id: player.extra_data.eltl_id,
          class: player.extra_data.class,
        },
      })),
    })
  }

  const handleAddOrUpdateParticipant = async (values: ParticipantFormValues, participantId?: string) => {
    try {
      if (participantId) {
        await updateParticipant.mutateAsync({ formData: values, participantId })
        successToast("Participant updated successfully")
        setEditingParticipant(null)
      } else {
        await createParticipant.mutateAsync(values)
        successToast("Participant added successfully")
      }

      form.reset()
      editForm.reset()
      router.navigate({
        to: `/admin/tournaments/${tournamentid}/participants`,
      })
    } catch (error) {
      errorToast(`Error ${participantId ? "updating" : "adding"} participant: ${error}`)
    }
  }

  const handleAddParticipant = async (values: ParticipantFormValues) => {
    try {
      for (const player of values.players) {
        if (player.user_id === 0 || !player.user_id) {
          const user = await fetchUserByName(player.name)
          if (user) {
            player.first_name = user.first_name
            player.last_name = user.last_name
            player.user_id = user.id
          } else {
            const names = player.name.split(" ")
            player.first_name = names.slice(0, -1).join(" ")
            player.last_name = names[names.length - 1]
          }
        }
      }

      await handleAddOrUpdateParticipant(values)
    } catch (error) {
      errorToast(`Error adding participant: ${error}`)
    }
  }

  const setFormValues = (user: UserNew) => {
    form.setValue("players.0.name", `${capitalize(user.first_name)} ${capitalize(user.last_name)}`)
    form.setValue("players.0.first_name", user.first_name)
    form.setValue("players.0.last_name", user.last_name)
    form.setValue("players.0.user_id", user.id)
    form.setValue("players.0.extra_data.rate_order", user.rate_order)
    form.setValue("players.0.sex", user.sex)
    form.setValue("players.0.extra_data.club", user.club_name)
    form.setValue("players.0.extra_data.eltl_id", user.eltl_id)
    form.setValue("players.0.extra_data.rate_points", user.rate_points)
    if (tournamentData?.data?.solo) {
      form.setValue("name", `${user.first_name} ${user.last_name}`)
    }
  }

  if (tournamentData && tournamentData.data) {
    return (
      <div className="container mx-auto py-6 space-y-6 overflow-x-auto">
        <div className="flex w-[250px] gap-4">
          <Select onValueChange={setSelectedOrderValue} defaultValue={selectedOrderValue}>
            <SelectTrigger className="">
              <SelectValue placeholder="Järjestus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">Suvaline</SelectItem>
              <SelectItem value="rating">Reitingu alusel</SelectItem>
            </SelectContent>
          </Select>
          <Button disabled={!selectedOrderValue} onClick={() => handleOrder(selectedOrderValue)}>
            Järjesta
          </Button>
        </div>
        <Card className="overflow-x-auto container">
          <CardHeader>
            <CardTitle>Registered Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {tournamentData.data && tournamentData.data.solo ? (
                    <>
                      <TableHead>JKNR.</TableHead>
                      <TableHead>Positsioon</TableHead>
                      <TableHead>Nimi</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Sugu</TableHead>
                      <TableHead>Klubi</TableHead>
                      <TableHead>ELTL ID</TableHead>
                      <TableHead>Koht Reitingus</TableHead>
                      <TableHead>Klass</TableHead>
                      <TableHead>Actions</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>Name</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Sport</TableHead>
                      <TableHead>Actions</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {participants &&
                  participants.data &&
                  participants.data.map((participant, idx) => (
                    <TableRow key={participant.id} className="py-0">
                      {tournamentData.data && tournamentData.data.solo ? (
                        <>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{participant.order}</TableCell>
                          <TableCell className="font-medium">
                            {editingParticipant?.id === participant.id ? (
                              <Input {...editForm.register("name")} defaultValue={participant.name} />
                            ) : (
                              participant.name
                            )}
                          </TableCell>
                          <TableCell>
                            {editingParticipant?.id === participant.id ? (
                              <Input
                                {...editForm.register("players.0.extra_data.rate_points", { valueAsNumber: true })}
                                defaultValue={participant.players[0].extra_data.rate_points}
                              />
                            ) : (
                              participant.players[0].extra_data.rate_points
                            )}
                          </TableCell>
                          <TableCell>
                            {editingParticipant?.id === participant.id ? (
                              <Input
                                {...editForm.register("players.0.sex")}
                                defaultValue={participant.players[0].sex}
                              />
                            ) : (
                              participant.players[0].sex
                            )}
                          </TableCell>
                          <TableCell>
                            {editingParticipant?.id === participant.id ? (
                              <Input
                                {...editForm.register("players.0.extra_data.club")}
                                defaultValue={participant.players[0].extra_data.club}
                              />
                            ) : (
                              participant.players[0].extra_data.club
                            )}
                          </TableCell>
                          <TableCell>
                            {editingParticipant?.id === participant.id ? (
                              <Input
                                {...editForm.register("players.0.extra_data.eltl_id", {valueAsNumber: true})}
                                defaultValue={participant.players[0].extra_data.eltl_id}
                              />
                            ) : (
                              participant.players[0].extra_data.eltl_id
                            )}
                          </TableCell>
                          <TableCell>
                            {editingParticipant?.id === participant.id ? (
                              <Input
                                {...editForm.register("players.0.extra_data.rate_order", { valueAsNumber: true })}
                                defaultValue={participant.players[0].extra_data.rate_order}
                              />
                            ) : (
                              participant.players[0].extra_data.rate_order
                            )}
                          </TableCell>
                          <TableCell>
                            {editingParticipant?.id === participant.id ? (
                              <Input
                                {...editForm.register("players.0.extra_data.class")}
                                defaultValue={participant.extra_data.class}
                              />
                            ) : (
                              participant.extra_data.class
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {editingParticipant?.id === participant.id ? (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      handleAddOrUpdateParticipant(editForm.getValues(), participant.id)
                                    }}
                                  >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Save
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleEditParticipant(participant)}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleDeleteParticipant(participant.id)}>
                                  <Trash className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium">
                            {editingParticipant?.id === participant.id ? (
                              <Input {...editForm.register("name")} defaultValue={capitalize(participant.name)} />
                            ) : (
                              capitalize(participant.name)
                            )}
                          </TableCell>
                          <TableCell>{participant.players.length}</TableCell>
                          <TableCell>
                            {editingParticipant?.id === participant.id ? (
                              <Input {...editForm.register("sport_type")} defaultValue={participant.sport_type} />
                            ) : (
                              participant.sport_type
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {editingParticipant?.id === participant.id ? (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      handleAddOrUpdateParticipant(editForm.getValues(), participant.id)
                                    }}
                                  >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Save
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleEditParticipant(participant)}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleDeleteParticipant(participant.id)}>
                                  <Trash className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                <TableRow>
                  {tournamentData.data && tournamentData.data.solo ? (
                    <>
                      <TableCell>{(participants && participants.data ? participants.data.length : 0) + 1}</TableCell>
                      <TableCell>
                        <Input disabled className="min-w-[100px] border-none" type="text" />
                      </TableCell>
                      <TableCell>
                        <div className="">
                          <Input
                            type="text"
                            {...form.register("players.0.name")}
                            onChange={(e) => {
                              form.setValue("players.0.name", e.target.value)
                              setSearchTerm(e.target.value)
                              if (tournamentData.data?.solo) {
                                form.setValue("name", e.target.value)
                              }
                            }}
                            className="min-w-[100px] text-sm md:text-base"
                            autoComplete="off"
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                            placeholder="Nimi"
                          />
                          {focusedField === "name" &&
                            playerSuggestions &&
                            playerSuggestions.data &&
                            playerSuggestions.data.length > 0 && (
                              <div className="absolute w-[200px] h-full max-h-[400px] overflow-x-auto overflow-y-auto mt-1 py-1 bg-background border rounded-md shadow-lg z-10">
                                {playerSuggestions.data.map((user, i) => (
                                  <div
                                    key={i}
                                    className="px-3 py-2 cursor-pointer hover:bg-accent"
                                    onClick={() => setFormValues(user)}
                                  >
                                    {capitalize(user.first_name)} {capitalize(user.last_name)}
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          className="min-w-[100px]"
                          type="number"
                          {...form.register("players.0.extra_data.rate_points", { valueAsNumber: true })}
                          placeholder="Rank"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="min-w-[100px]"
                          type="text"
                          {...form.register("players.0.sex")}
                          placeholder="Sugu"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="min-w-[100px]"
                          type="text"
                          {...form.register("players.0.extra_data.club")}
                          placeholder="Klubi"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          disabled
                          className="min-w-[100px] border-none"
                          type="number"
                          {...form.register("players.0.extra_data.eltl_id", { valueAsNumber: true })}
                          placeholder="ELTL ID"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          disabled
                          className="border-none"
                          type="number"
                          {...form.register("players.0.extra_data.rate_order", { valueAsNumber: true })}
                          placeholder="Koht Reitingus"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="min-w-[100px]"
                          type="text"
                          {...form.register("players.0.extra_data.class")}
                          placeholder="Klass"
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={form.handleSubmit((values) => handleAddOrUpdateParticipant(values))}>
                          Add Participant
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        <Input type="text" {...form.register("name")} placeholder="New team name" />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          {...form.register("players.0.number", { valueAsNumber: true })}
                          placeholder="Number of participants"
                        />
                      </TableCell>
                      <TableCell>
                        <Input type="text" {...form.register("sport_type")} placeholder="Sport type" />
                      </TableCell>
                      <TableCell>
                        <Button onClick={form.handleSubmit((values) => handleAddOrUpdateParticipant(values))}>
                          Add Team
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  } else {
    return <ErrorPage error={new Error("Tournament not found")} reset={() => {}} />
  }
}

