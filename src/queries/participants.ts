import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./axiosconf";
import { ParticipantFormValues } from "@/routes/admin/tournaments/$tournamentid/-components/participant-forms/form-utils";
import { Participant } from "@/types/participants";

export type ParticipantResponse = {
    data: Participant | null
    message: string;
    error: string | null
}

export type ParticipantsResponse = {
    data: Participant[] | null
    message: string;
    error: string | null
}

// Praegu ei huvita
export function UseGetTournamentParticipants(tournament_id: number) {
    return queryOptions<ParticipantsResponse>({
        queryKey: ["participants", tournament_id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/participants`, {
                withCredentials: true,
            })
            return data;
        }
    })
}


export function UseGetParticipants(tournament_id: number, table_id: number) {
    return queryOptions<ParticipantsResponse>({
        queryKey: ["participants", table_id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/tables/${table_id}/participants`, {
                withCredentials: true,
            })
            return data;
        }
    })
}

export function UseGetParticipantsQuery(tournament_id: number, table_id: number, regrouped: boolean = false, initialData?: ParticipantsResponse) {
    return useQuery<ParticipantsResponse>({
        queryKey: ["participants", table_id],
        initialData,
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/tables/${table_id}/participants?regrouped=${regrouped}`, {
                withCredentials: true,
            })
            return data;
        }
    })
}


export function UseCreateParticipants(tournament_id: number, table_id: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: ParticipantFormValues): Promise<ParticipantResponse> => {
            const { data } = await axiosInstance.post(`/api/v1/tournaments/${tournament_id}/tables/${table_id}/participants`, formData, {
                withCredentials: true,
            })
            return data;
        },
        onSuccess: (data: ParticipantResponse) => {
            queryClient.setQueryData(["participants", table_id],
                (oldData: ParticipantsResponse | undefined) => {
                    if (!oldData) return { data: [data.data], message: data.message, error: null };
                    return data
                }
            )
        }
    })
}

export function UseChangeSubgroupName(tournament_id: number, table_id: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: { participant_ids: string[], group_name: string }) => {
            const { data } = await axiosInstance.patch(`/api/v1/tournaments/${tournament_id}/tables/${table_id}/participants/group`, formData, {
                withCredentials: true,
            })
            return data;
        },
        onSuccess: (data: ParticipantResponse) => {
            queryClient.setQueryData(["participants", table_id],
                (oldData: ParticipantsResponse) => {
                    if (!oldData || !oldData.data) return oldData;
                    return {
                        data: oldData.data,
                        message: data.message,
                        error: null
                    };
                }
            )
        }
    })
}

type UpdateParticipantArgs = {
    formData: ParticipantFormValues;
    participantId: string;
}

export function UseUpdateParticipant(tournament_id: number, table_id: number) {
    const queryClient = useQueryClient()

    return useMutation<ParticipantResponse, Error, UpdateParticipantArgs>({
        mutationFn: async ({ formData, participantId }) => {
            const { data } = await axiosInstance.patch(
                `/api/v1/tournaments/${tournament_id}/tables/${table_id}/participants/${participantId}`,
                formData,
                { withCredentials: true }
            )
            return data
        },
        onSuccess: (data: ParticipantResponse) => {
            queryClient.setQueryData(["participants", table_id],
                (oldData: ParticipantsResponse | undefined) => {
                    if (!oldData || !oldData.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map(participant =>
                            participant.id === data.data?.id ? data.data : participant
                        ),
                        message: data.message,
                        error: null
                    };
                }
            )

            // Since match data may depend on participant data, still reset the matches query
            queryClient.resetQueries({ queryKey: ["matches", table_id] })
        }
    })
}

export function UseDeleteParticipant(tournament_id: number, table_id: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (participantId: string) => {
            const { data } = await axiosInstance.delete(`/api/v1/tournaments/${tournament_id}/tables/${table_id}/participants/${participantId}`, {
                withCredentials: true,
            })
            return data;
        },
        onSuccess: (data: ParticipantResponse, variables: string) => {
            // Update cache by filtering out the deleted participant
            queryClient.setQueryData(["participants", table_id],
                (oldData: ParticipantsResponse | undefined) => {
                    if (!oldData || !oldData.data) return oldData;

                    return {
                        ...oldData,
                        data: oldData.data.filter(participant => participant.id !== variables),
                        message: data.message,
                        error: null
                    };
                }
            )
        }
    })
}

export type Order = {
    order: string
}

export function UsePostOrder(tournament_id: number, table_id: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (order: Order) => {
            const { data } = await axiosInstance.post(`/api/v1/tournaments/${tournament_id}/tables/${table_id}/participants/order`, order, {
                withCredentials: true,
            })
            return data;
        },
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["participants", table_id] })
            queryClient.resetQueries({ queryKey: ["bracket", table_id] })
            queryClient.resetQueries({ queryKey: ["matches", table_id] })
        },
    })
}