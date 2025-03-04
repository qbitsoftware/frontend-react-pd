import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Blog } from "@/types/types";
import { axiosInstance } from "./axiosconf";

interface BlogsResponse {
    data: Blog[]
    message: string
    error: string | null
}

export function UseGetBlogs() {
    return useQuery<BlogsResponse>({
        queryKey: ["blogs"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/api/v1/blogs/admin", {
                withCredentials: true,
            })
            return data
        }
    })
}

export function UseGetBlogsOption() {
    return queryOptions<BlogsResponse>({
        queryKey: ["blogs"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/api/v1/blogs")
            return data
        }
    })
}

interface BlogResponse {
    data: Blog
    message: string
    error: string | null
}

export function UseGetBlog(id: number) {
    return useQuery<BlogResponse>({
        queryKey: ["blog", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/blogs/${id}`)
            return data
        }
    })
}

export function UseCreateBlog() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (blog: Blog) => {
            const { data } = await axiosInstance.post("/api/v1/blogs", blog)
            return data
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ["blogs"] })
            queryClient.refetchQueries({ queryKey: ["blogs"] })
        }
    })
}

export function UseUpdateBlog() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (blog: Blog) => {
            const { data } = await axiosInstance.patch(`/api/v1/blogs/${blog.id}`, blog)
            return data
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] })
            queryClient.invalidateQueries({ queryKey: ["blog", variables.id] })
        }
    })
}

export function UseDeleteBlog() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await axiosInstance.delete(`/api/v1/blogs/${id}`)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] })
            // queryClient.refetchQueries({ queryKey: ["blogs"] })
        }
    })
}
