import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./axiosconf";
import { Participant } from "@/types/types";
import { ParticipantFormValues } from "@/routes/admin/tournaments/$tournamentid/-components/participant-form";

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


export function UseGetParticipants(tournament_id: number) {
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


export function UseCreateParticipants(tournament_id: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: ParticipantFormValues) => {
            const { data } = await axiosInstance.post(`/api/v1/tournaments/${tournament_id}/participants`, formData, {
                withCredentials: true,
            })
            return data;
        },
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["participants", tournament_id] })
        }
    })
}

export function UseUpdateParticipant(tournament_id: number, participant_id: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: ParticipantFormValues) => {
            const { data } = await axiosInstance.patch(`/api/v1/tournaments/${tournament_id}/participants/${participant_id}`, formData, {
                withCredentials: true,
            })
            return data;
        },
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["participants", tournament_id] })
        }
    })
}

export function UseDeleteParticipant(tournament_id: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (participantId: string) => {
            const { data } = await axiosInstance.delete(`/api/v1/tournaments/${tournament_id}/participants/${participantId}`, {
                withCredentials: true,
            })
            return data;
        },
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["participants", tournament_id] })
        }
    })
}
