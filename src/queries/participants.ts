import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./axiosconf";
import { Participant } from "@/types/types";
import { ParticipantFormValues } from "@/routes/admin/tournaments/$tournamentid/-components/participants-form";

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

export function UseGetParticipantsQuery(tournament_id: number, table_id: number, regrouped: boolean = false) {
    return useQuery<ParticipantsResponse>({
        queryKey: ["participants", table_id],
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
        mutationFn: async (formData: ParticipantFormValues) => {
            const { data } = await axiosInstance.post(`/api/v1/tournaments/${tournament_id}/tables/${table_id}/participants`, formData, {
                withCredentials: true,
            })
            return data;
        },
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["participants", table_id] })
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
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["participants", table_id] })
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
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["participants", table_id] })
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