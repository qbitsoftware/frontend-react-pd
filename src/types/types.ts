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
    eltl_id: number
    sex: string
    foreigner: number
    club_name: string
    rate_order: number
    rate_pl_points: number
    rate_points: number
    rate_weigth: number
    oragnization_id: number
    role: number
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
    order: number;
    rank: number;
    sport_type: string;
    tournament_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    players: PlayerNew[];
    extra_data: PartipantExtraData;
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
    extra_data: PlayerExtraData;
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
    // user: UserNew;
}

export type PlayerExtraData = {
    image_url: string;
    club: string;
    rate_points: number;
    rate_order: number;
    eltl_id: number;
    class: string;
}

export type PartipantExtraData = {
    image_url: string;
    class: string
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
    category: string;
    image: string;
    sport: string;
    state: string;
    private: boolean;
    total_tables: number;
    information: string; 
};

export type TournamentTable = {
    created_at: string;
    deleted_at: string | null;
    id: number;
    updated_at: string;
    tournament_id: number;
    class: string;
    type: string;
    solo: boolean;
    min_team_size: number;
    max_team_size: number;
    size: number;
}

export type Category = {
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
    id: number;
    category: string;
}

export type TournamentInformation = {
    fields: [{ title: string, information: string }]
}

export type TournamentType = {
    id: number
    created_at: string;
    deleted_at: string | null;
    name: string;
}

export type TournamentSize = {
    id: number
    created_at: string;
    deleted_at: string | null;
    size: number;
}


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
    start_time: Date
    extra_data: TableTennisExtraData
    topCoord: number // for front end purposes
}

export type MatchWrapper = {
    match: Match
    p1: Participant
    p2: Participant
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

