
import { queryOptions } from "@tanstack/react-query"
import {axiosInstance} from "./axiosconf";
import { Bracket, Tournament } from "@/types/types";

export type TournamentsResponse = {
    data: Tournament[] | null
    message: string;
    error: string | null;
};

export type TournamentResponse = {
    data: Tournament | null
    message: string;
    error: string | null;
};


export function useGetTournaments() {
    return queryOptions<TournamentsResponse>({
        queryKey: ["tournaments"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments`, {
                withCredentials: true,
            })
            return data;
        },
    });
}


export const useGetTournament = (id: number) => {
    return queryOptions<TournamentResponse>({
        queryKey: ["tournament", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${id}`, {
                withCredentials: true
            })
            return data;
        }

    })
}

interface BracketReponse {
    data: Bracket[] | null
    message: string;
    error: string | null;
}

export const useGetBracket = (id: number) => {
    return queryOptions<BracketReponse>({
        queryKey: ["bracket_info", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${id}/bracket`, {
                withCredentials: true
            })
            return data;
        }
    })
}