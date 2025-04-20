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