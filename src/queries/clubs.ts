import { Club } from "@/types/types"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./axiosconf"
import { UsersResponse } from "./users"

export interface ClubsResponse {
    data: Club[]
    message: string
    error: string | null
}

export const UseGetClubsOption = () => {
    return queryOptions<ClubsResponse>({
        queryKey: ["clubs_options"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/clubs`)
            return data
        }
    })
}

export const UseGetClubsQuery = () => {
    return useQuery<ClubsResponse>({
        queryKey: ["clubs_query"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/clubs`)
            return data
        }
    })
}

export const UseGetClubPlayers = (club_name: string) => {
    return useQuery<UsersResponse>({
        queryKey: ["club_players"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/club/${club_name}/players`)
            return data
        }
    })
}