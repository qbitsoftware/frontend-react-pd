import { useQueryClient, useMutation } from "@tanstack/react-query"
import { axiosInstance } from "./axiosconf"
import { Match } from "@/types/types"

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
            queryClient.refetchQueries({ queryKey: ['bracker', id] })
        }
    })
}