
import { queryOptions, useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./axiosconf";
import { Bracket, Category, Tournament, TournamentSize, TournamentType } from "@/types/types";
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

export type TournamentTypesResposne = {
    data: TournamentType[] | null
    message: string;
    error: string | null;
}

export type TournamentCategoriesResponse = {
    data: Category[] | null
    message: string;
    error: string | null;
}


export type TournamentSizeResposne = {
    data: TournamentSize[] | null
    message: string;
    error: string | null;
}

export function UseGetTournamentTypes() {
    return useQuery<TournamentTypesResposne>({
        queryKey: ["tournament_types"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/types`, {
                withCredentials: true
            })
            return data
        },
    })
}

export function UseGetTournamentCategories() {
    return useQuery<TournamentCategoriesResponse>({
        queryKey: ["tournament_categories"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/categories`, {
                withCredentials: true
            })
            return data
        },
    })
}


export function UseGetTournamentSizes() {
    return useQuery<TournamentSizeResposne>({
        queryKey: ["tournament_sizes"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/sizes`, {
                withCredentials: true
            })
            return data
        },
    })
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

export const UseGetTournamentQuery = (id: number) => {
    return useQuery<TournamentResponse>({
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

export interface BracketReponse {
    data: Bracket[] | null
    message: string;
    error: string | null;
}

export const UseStartTournament = (tournament_id: number) => {
    const queryClient = useQueryClient()
    return useMutation<BracketReponse, unknown, boolean>({
        mutationFn: async (start: boolean) => {
            const { data } = await axiosInstance.post(`/api/v1/tournaments/${tournament_id}`, JSON.stringify({ start }), {
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
            queryClient.resetQueries({ queryKey: ['tournament', id] })
            queryClient.resetQueries({ queryKey: ['bracket', id] })
            queryClient.resetQueries({ queryKey: ['matches', id] })
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
            queryClient.resetQueries({ queryKey: ['tournaments'] })
        },
    })
}

