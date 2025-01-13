import {axiosInstance} from "./axiosconf";
import { queryOptions, useQuery} from "@tanstack/react-query";
import { BracketReponse } from "./tournaments";

export function UseGetBracket(id: number) {
    return queryOptions<BracketReponse>({
        queryKey: ["bracket", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${id}/brackets`, {
                withCredentials: true
            });
            return data
        }
    })
}

export function UseGetBracketQuery(id: number) {
    return useQuery<BracketReponse>({
        queryKey: ["bracket", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${id}/brackets`, {
                withCredentials: true
            });
            return data
        }
    })
}