import { MatchWrapper } from "./matches";

export interface Venue {
    id: number,
    name: string,
    match_id: string | null,
    tournament_id: number,
    created_at: string,
    deleted_at: string | null,
    udpated_at: string,
    match: MatchWrapper | null,
}