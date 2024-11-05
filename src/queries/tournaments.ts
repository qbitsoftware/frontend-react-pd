
import {useQuery} from "@tanstack/react-query"
import axiosInstance from "./axiosconf";

export function useGetTournaments() {
    return useQuery({
        queryKey: [""],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/tournaments`, {
                withCredentials: true,
            })
            return data;
        },
    });
}
