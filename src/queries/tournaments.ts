
import { queryOptions, useQuery } from "@tanstack/react-query"
import axiosInstance from "./axiosconf";
import { Tournament } from "@/types/types";

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
    return useQuery<TournamentsResponse>({
        queryKey: ["tournaments"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments`, {
                withCredentials: true,
            })
            return data;
        },
    });
}

// export function useGetTournament(id: number) {
//     ({
//         queryKey: ["tournament"],
//         queryFn: () => fetchTournament(id)
//     });
// }

export const useGetTournament = (id: number) => {
    return queryOptions<TournamentResponse>({
        queryKey: ["tournament"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments/${id}`, {
                withCredentials: true
            })
            return data;
        }
        
    })
}
