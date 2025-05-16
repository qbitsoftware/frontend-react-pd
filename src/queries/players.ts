import { Profile, User } from "@/types/users"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./axiosconf"

export interface PlayerResponse {
    error: string
    data: User[]
    message: string
}

export const UseGetPlayers = () => {
    return queryOptions<PlayerResponse>({
        queryKey: ["players"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/users`)
            return data
        }
    })
}

export interface ProfileResponse {
    error: string
    data: Profile
    message: string
}

export const UseGetUserProfile = (id: number) => {
    return useQuery<ProfileResponse>({
        queryKey: ["profile", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/users/${id}`)
            return data
        }
    })
}
