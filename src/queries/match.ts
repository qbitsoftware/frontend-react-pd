import { useQueryClient, useMutation, queryOptions, useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./axiosconf"
import { Match, MatchWrapper } from "@/types/types"

export interface MatchesResponse {
    data: MatchWrapper[] | null
    message: string
    error: string | null
}

export const UsePatchMatch = (id: number, match_id: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: Match) => {
            const { data } = await axiosInstance.patch(`/api/v1/tournaments/${id}/match/${match_id}`, formData, {
                withCredentials: true
            })
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bracket', id] })
            queryClient.refetchQueries({ queryKey: ['bracket', id] })
            queryClient.invalidateQueries({ queryKey: ['matches', id] })
            queryClient.resetQueries({ queryKey: ['matches', id]})
        }
    })
}

export const UseGetMatches = (tournament_id: number) => {
    return queryOptions({
        queryKey: ['matches', tournament_id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/matches`, {
                withCredentials: true
            })
            return data;
        }
    })
}

export const UseGetMatchesQuery = (tournament_id: number) => {
    return useQuery<MatchesResponse>({
        queryKey: ['matches', tournament_id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/matches`, {
                withCredentials: true
            })
            return data;
        }
    })
}

