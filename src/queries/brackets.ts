import { axiosInstance } from "./axiosconf";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BracketReponse } from "./tournaments";

export function UseGetBracket(tournament_id: number) {
    return queryOptions<BracketReponse>({
        queryKey: ["bracket", tournament_id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/brackets`, {
                withCredentials: true
            });
            return data
        }
    })
}

export function UseGetBracketQuery(tournament_id: number) {
    return useQuery<BracketReponse>({
        queryKey: ["bracket", tournament_id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/brackets`, {
                withCredentials: true
            });
            return data
        }
    })
}

export function UseDeleteBrackets(tournament_id: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosInstance.delete(`/api/v1/tournaments/${tournament_id}/brackets`, {
                withCredentials: true
            });
            return data
        },
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["bracket", tournament_id] })
            queryClient.resetQueries({ queryKey: ["tournaments"] })
        }
    })
}