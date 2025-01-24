import { Score } from "@/types/types";
import { axiosInstance } from "./axiosconf";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const UsePatchScore = (match_id: string, tournament_id: number)  => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: Score) => {
            const { data } = await axiosInstance.patch(`/api/v1/matches/${match_id}/score`, formData, {
                withCredentials: true
            })
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches', tournament_id] })
            queryClient.refetchQueries({ queryKey: ['matches', tournament_id] })
        }
    })
}