import { useQueryClient, useMutation, queryOptions, useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./axiosconf"
import { Match, MatchWrapper } from "@/types/types"

export interface MatchesResponse {
    data: MatchWrapper[] | null
    message: string
    error: string | null
}

export const UsePatchMatch = (id: number, group_id: number, match_id: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: Match) => {
            const { data } = await axiosInstance.patch(`/api/v1/tournaments/${id}/tables/${group_id}/match/${match_id}`, formData, {
                withCredentials: true
            })
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bracket', id] })
            queryClient.refetchQueries({ queryKey: ['bracket', id] })
            queryClient.invalidateQueries({ queryKey: ['matches', group_id] })
            // queryClient.resetQueries({ queryKey: ['matches', group_id] })
        }
    })
}

export const UseGetMatches = (tournament_id: number, group_id: number) => {
    return queryOptions<MatchesResponse>({
        queryKey: ['matches', group_id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/tables/${group_id}/matches`, {
                withCredentials: true
            })
            return data;
        }
    })
}

export const UseGetTournamentMatches = (tournament_id: number) => {
    return queryOptions<MatchesResponse>({
        queryKey: ['matches', tournament_id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/matches`, {
                withCredentials: true
            })
            return data;
        }
    })
}


export const UseGetMatchesQuery = (tournament_id: number, group_id: number) => {
    return useQuery<MatchesResponse>({
        queryKey: ['matches', group_id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/tables/${group_id}/matches`, {
                withCredentials: true
            })
            return data;
        }
    })
}

export const UseGetChildMatchesQuery = (tournament_id: number, group_id: number, match_id: string) => {
    return useQuery<MatchesResponse>({
        queryKey: ['matches', group_id, match_id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/tables/${group_id}/matches/${match_id}`, {
                withCredentials: true
            })
            return data;
        }
    })
}

export const UseStartMatch = (tournament_id: number, group_id: number, match_id: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosInstance.post(`/api/v1/tournaments/${tournament_id}/tables/${group_id}/matches/${match_id}/start`, {}, {
                withCredentials: true
            })
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bracket', tournament_id] })
            queryClient.refetchQueries({ queryKey: ['bracket', tournament_id] })
            queryClient.invalidateQueries({ queryKey: ['matches', group_id] })
            queryClient.resetQueries({ queryKey: ['matches', group_id] })
        }
    })
}

export const UseRegroupMatches = (tournament_id: number, group_id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosInstance.post(`/api/v1/tournaments/${tournament_id}/tables/${group_id}/matches/regroup`, {}, {
                withCredentials: true
            })
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bracket', tournament_id] })
            queryClient.refetchQueries({ queryKey: ['bracket', tournament_id] })
            queryClient.invalidateQueries({ queryKey: ['matches', group_id] })
            queryClient.resetQueries({ queryKey: ['matches', group_id] })
        }
    })
}