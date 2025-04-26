import { PlayerFormValues } from "@/routes/admin/tournaments/$tournamentid/-components/participant-forms/form-utils";

export const DEFAULT_PLAYER: PlayerFormValues = {
  first_name: "",
  last_name: "",
  name: "",
  sport_type: "tabletennis",
  sex: "M",
  extra_data: {
    rate_order: 0,
    club: "",
    rate_points: 0,
    eltl_id: 0,
    class: ""
  }
}

export type Player = {
    id: string;
    user_id: number
    name: string;
    first_name: string;
    last_name: string;
    sport_type: string;
    number: number;
    rank: number;
    sex: string;
    extra_data: PlayerExtraData;
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
    // user: UserNew;
  }
  
  export type PlayerExtraData = {
    image_url?: string;
    club: string;
    rate_points: number;
    rate_order: number;
    eltl_id: number;
    class: string;
  }