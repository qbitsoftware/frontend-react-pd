export type Data = {
    rounds: Round[],
    matches: TableMatch[],
    name: string;
}

export type TableMatch = {
    match: Match
    participant_1: Participant
    participant_2: Participant
    is_bronze_match: boolean
}

export type Bracket = {
    tables: Data[]
}

export type ErrorResponse = {
    response: {
        status: number
    }
}

export type UserNew = {
    id: number
    email: string
    organization_id: number
    first_name: string
    last_name: string
    created_at: string
}

export interface User {
    ID: number;
    CreatedAt: Date;
    UpdatedAt: Date;
    DeletedAt?: Date | null;
    first_name: string;
    last_name: string;
    birth_date: Date;
    club_id: string;
    email: string;
    password?: string;
    sex: string;
    rating_points: number;
    placement_points: number;
    weight_points: number;
    eltl_id: number;
    has_rating: boolean;
    confirmation: string;
    nationality: string;
    placing_order: number;
    img_url?: string;
}

export interface Article {
    id: number;
    title: string,
    thumbnail: string,
    user: string,
    category: string,
    content_html: string,
    created_at: string,
    updated_at: string,
}


export type Round = {
    name: string,
}

export type Participant = {
    id: string;
    name: string;
    rank: number;
    sport_type: string;
    tournament_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    players: PlayerNew[];
}

export type PlayerNew = {
    id: string;
    user_id: number
    first_name: string;
    last_name: string;
    sport_type: string;
    number: number;
    rank: number;
    sex: string;
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
}

export type Tournament = {
    created_at: string;
    deleted_at: string | null;
    id: number;
    updated_at: string;
    name: string;
    start_date: string;
    end_date: string;
    location: string;
    image: string;
    type: string;
    sport: string;
    state: string;
    private: boolean;
    solo: boolean;
    min_team_size: number;
    max_team_size: number;
    max_players: number;
    information: string;
};


export type Match = {
    id: string
    tournament_id: number
    type: string
    round: number
    p1_id: string
    p2_id: string
    winner_id: string
    order: number
    sport_type: string
    location: string
    bracket: string
    forfeit: boolean
    extra_data: TableTennisExtraData
    topCoord: number // for front end purposes
}

export type TableTennisExtraData = {
    table: number;
    head_referee?: string;
    table_referee?: string;
    parent_match_id: string;
    score: Score[];
};

export type Score = {
    number: number;
    p1_score: number;
    p2_score: number;
}

export interface Blog {
    ID?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    data: string;
    tournamentId?: number;
    authorId?: number;
}

