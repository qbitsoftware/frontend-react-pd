import { User } from "@/types/types"
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "./axiosconf"
import { LoginFormData } from "@/routes/login"

export interface LoginResponse {
    data: User
    message: string
    error: string | null
}

export const useGetUser = () => {
    return queryOptions<LoginResponse>({
        queryKey: ["user"],
        queryFn: async () => {
            const {data} = await axiosInstance.get("/api/v1/auth/users/current", {
                withCredentials: true
            })
            return data
        },
        retry: false
    })
}

export const useLogin = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData: LoginFormData) => {
            const {data} = await axiosInstance.post("/api/v1/login", formData, {
                withCredentials: true
            })
            return data
        }, 
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["user"]})
        }
    })
}

export const useGetLogin = () => {
    return useQuery<LoginResponse>({
        queryKey: ["user"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/auth/users/current`, {
                withCredentials: true
            })
            return data
        },
        staleTime: Infinity,
        retry: false,
        refetchOnWindowFocus: true,
    })
}



export const useLogout = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosInstance.post(`/api/v1/auth/logout`, {}, {
                withCredentials: true
            })
            return data
        },
        onSuccess: () => {
            queryClient.setQueryData(["user"], { data: null, message: "", error: null })
            queryClient.invalidateQueries({ queryKey: ["user"] }),
            queryClient.refetchQueries({ queryKey: ["user"] })
        }
    })
}