// import { MatchWithTeamAndSets } from "@/types/types";
// import { queryOptions} from "@tanstack/react-query";
// import {axiosInstance} from "./axiosconf";

// export type ProtocolResponse = {
//     data: MatchWithTeamAndSets[];
//     message: string;
//     error: string | null;
// }

// export const UseGetProtocols = (tournament_id: number) => {
//     return queryOptions<ProtocolResponse>({
//         queryKey: ["protocols"],
//         queryFn: async () => {
//             const { data } = await axiosInstance.get(`/api/v1/tournaments/${tournament_id}/protocols`)
//             return data
//         }
//     })
// }