import { TournamentTable } from "@/types/types";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./axiosconf";
import TournamentTableForm from "@/routes/admin/tournaments/$tournamentid/grupid/-components/table-form";

interface TournamentTableResponse {
    data: TournamentTable | null
    message: string;
    error: string | null;
}

interface TournamentTablesResponse {
    data: TournamentTable[] | null
    message: string;
    error: string | null;
}


export function UseGetTournamentTables(tournament_id: number) {
    return queryOptions<TournamentTablesResponse>({
        queryKey: ["tournament_tables", tournament_id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/tables`, {
                withCredentials: true,
            })
            return data;
        },
    });
}

export const UseGetTournamentTable = (tournament_id: number, tournament_table_id: number) => {
    return queryOptions<TournamentTableResponse>({
        queryKey: ["tournament_table", tournament_table_id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/tables/${tournament_table_id}`, {
                withCredentials: true
            })
            return data;
        }
    })
}

export const UsePatchTournamentTable = (tournament_id: number, tournament_table_id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: TournamentTableForm) => {
            const { data } = await axiosInstance.patch(`/api/v1/tournaments/${tournament_id}/tables/${tournament_table_id}`, formData, {
                withCredentials: true
            })
            return data;
        },

        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ['tournament_tables', tournament_id] })
            queryClient.resetQueries({ queryKey: ['tournament_table', tournament_table_id] })
            queryClient.resetQueries({ queryKey: ['bracket', tournament_table_id] })
            queryClient.resetQueries({ queryKey: ['matches', tournament_table_id] })
        }
    })
}

export const UsePostTournamentTable = (tournament_id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: TournamentTableForm) => {
            const { data } = await axiosInstance.post(`/api/v1/tournaments/${tournament_id}/tables`, formData, {
                withCredentials: true
            })
            return data;
        },

        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ['tournaments_tables', tournament_id] })
        }
    })
}

export const UseDeleteTournamentTable = (tournament_id: number, tournament_table_id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosInstance.delete(`/api/v1/tournaments/${tournament_id}/tables/${tournament_table_id}`, {
                withCredentials: true
            })
            return data;
        },
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ['tournament_tables', tournament_table_id] })
        },
    })
}

