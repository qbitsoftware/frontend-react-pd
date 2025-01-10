import { TournamentTable } from "@/types/types";
import {axiosInstance} from "./axiosconf";
import { queryOptions} from "@tanstack/react-query";
import { BracketReponse } from "./tournaments";

export type GroupBracketResponse = {
    data: TournamentTable
    message: string
    error: string | null
}


export function UseGetGroupBrackets(id: number) {
    return queryOptions<GroupBracketResponse>({
        queryKey: ["group_bracket", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${id}/groupbracket`);
            return data;
        },
    });
}


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