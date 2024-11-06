import { User } from "@/types/types"
import { queryOptions} from "@tanstack/react-query"
import axiosInstance from "./axiosconf"

export interface PlayerResponse {
    error: string
    data: User[]
    message: string
}

export const useGetPlayers = () => {
    return queryOptions<PlayerResponse>({
        queryKey: ["players"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/users`)
            return data
        }
    })
}
