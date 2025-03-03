import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "./axiosconf"

export type ImagesResponse = {
    data: string[],
    message: string,
    error: string | null,
}

export const usePostImage = () => {
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await axiosInstance.post('/api/v1/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            return data;
        },
    });
}

export const useGetGamedayImages = (tournament_id: number, game_day: string) => {
    return useQuery<ImagesResponse>({
        queryKey: ["images", tournament_id, game_day],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/images/${game_day}/get`, {
                withCredentials: true
            })
            return data
        },
        staleTime: Infinity,
        retry: false,
        refetchOnWindowFocus: true,
    })
}

export function usePostImages(tournament_id: number, gameday: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await axiosInstance.post(`/api/v1/auth/${tournament_id}/image/${gameday}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            return data;
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["images", tournament_id, gameday] }) }
    });
}


export function useDeleteImage(tournament_id: number, gameday: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (file_key: string) => {
            await axiosInstance.post('/api/v1/auth/image', { image_key: file_key }, {
                withCredentials: true,
            })
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["images", tournament_id, gameday] }) }
    })
}