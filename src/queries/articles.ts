import { queryOptions } from "@tanstack/react-query";
import { blog_instance } from "./axiosconf";
import { Article } from "@/types/types";

// Articles Queries with Response type

interface ArticlesResponse {
    data: Article[]
    message: string
    error: string | null
}

export function useGetArticles() {
    return queryOptions<ArticlesResponse>({
        queryKey: ["blogs"],
        queryFn: async() => {
            const {data} = await blog_instance.get("/api/v1/articles")
            return data
        }
    })
}

// Article Queries with Response type

interface ArticleResponse {
    data: Article
    message: string,
    error: string | null
}

export function useGetArticle(id: number) {
    return queryOptions<ArticleResponse>({
        queryKey: ["blogs", id],
        queryFn: async() => {
            const {data} = await blog_instance.get(`/api/v1/articles/${id}`)
            return data
        }
    })
}