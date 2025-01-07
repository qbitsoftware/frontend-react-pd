import { queryOptions } from "@tanstack/react-query";
import { axiosInstance } from "./axiosconf";
import { Participant } from "@/types/types";

export type ParticipantResponse = {
    data: Participant | null
    message: string;
    error: string | null
}

export type ParticipantsResponse = {
    data: Participant[] | null
    message: string;
    error: string | null
}


export function UseGetParticipants(tournament_id: number) {
    return queryOptions<ParticipantsResponse> ({
        queryKey: ["participants", tournament_id],
        queryFn: async () => {
            const {data} = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/participants`, {
                withCredentials: true,
            })
            return data;
        }
    })
}