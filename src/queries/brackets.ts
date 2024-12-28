import { TournamentTable } from "@/types/types";
import {axiosInstance} from "./axiosconf";
import { queryOptions} from "@tanstack/react-query";

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