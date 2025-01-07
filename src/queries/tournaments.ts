
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "./axiosconf";
import { Bracket, Tournament } from "@/types/types";
import { TournamentFormValues } from "@/routes/admin/tournaments/-components/tournament-form";

export type TournamentsResponse = {
    data: Tournament[] | null
    message: string;
    error: string | null;
};

export type TournamentResponse = {
    data: Tournament | null
    message: string;
    error: string | null;
};


export function UseGetTournaments() {
    return queryOptions<TournamentsResponse>({
        queryKey: ["tournaments"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments`, {
                withCredentials: true,
            })
            return data;
        },
    });
}


export const UseGetTournament = (id: number) => {
    return queryOptions<TournamentResponse>({
        queryKey: ["tournament", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${id}`, {
                withCredentials: true
            })
            return data;
        }

    })
}

export const UsePostTournament = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: TournamentFormValues) => {
            const { data } = await axiosInstance.post(`/api/v1/tournaments`, formData, {
                withCredentials: true
            })
            return data;
        },

        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ['tournaments'] })
        }
    })
}

export const UsePatchTournament = (id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: TournamentFormValues) => {
            const { data } = await axiosInstance.patch(`/api/v1/tournaments/${id}`, formData, {
                withCredentials: true
            })
            return data;
        },

        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ['tournaments'] })
        }
    })
}

export const UseDeleteTournament = (id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosInstance.delete(`/api/v1/tournaments/${id}`, {
                withCredentials: true
            })
            return data;
        },
        onSuccess: () => {
            // queryClient.setQueryData(['tournaments'], (oldData: any) => {
            //     if (!oldData?.data) return oldData;
            //     return {
            //         ...oldData,
            //         data: oldData.data.filter((tournament: any) => tournament.id !== id),
            //     };
            // });
            queryClient.resetQueries({ queryKey: ['tournaments'] })
        },
    })
}

interface BracketReponse {
    data: Bracket[] | null
    message: string;
    error: string | null;
}

export const UseGetBracket = (id: number) => {
    return queryOptions<BracketReponse>({
        queryKey: ["bracket_info", id],
        queryFn: async () => {
            // const { data } = await axiosInstance.get(`/api/v1/tournaments/${id}/bracket`, {

            const { data } = await axiosInstance.get(`/tournaments/test`, {
                withCredentials: true
            })
            return data;
        }
    })
}

