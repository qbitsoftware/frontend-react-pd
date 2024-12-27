export type Data = {
    rounds: Round[],
    matches: Match[],
    contestants?: {
        [contestantId: string]: Contestant
    }
    name: string;
}

export type Bracket = {
    tables: Data[]
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
    name?: string,
}
export type TeamMatch = {
    ID?: number;
    createdAt?: string;
    updatedAt?: string
    deletedAt?: string | null;

    tournament_id: number;
    winner_id?: number;
    player_a_id: number;
    player_b_id: number;
    player_c_id: number;
    player_d_id?: number;
    player_e_id?: number;
    player_x_id: number;
    player_y_id: number;
    player_z_id: number;
    player_v_id?: number;
    player_w_id?: number;
    captain_a?: string;
    captain_b?: string;
    match_id: number;
    notes?: string;
}

export type Participant = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    first_name: string;
    last_name: string;
    birthDate: string;
    email: string;
    password: string;
}

export type Tournament = {
    CreatedAt: string;
    DeletedAt: string | null;
    ID: number;
    UpdatedAt: string;
    cap: number;
    end_date: string;
    name: string;
    start_date: string;
    type: 'single_elimination' | 'double_elimination' | 'round_robin' | 'meistriliiga';
    State: string;
    private: boolean;
};


export type Match = {
    ID: number
    tournament_id: number
    roundIndex: number,
    order: number,
    matchId: number,
    sides?: Side[],
    matchStatus?: string,
    isLive?: boolean
    isBronzeMatch?: string,
    bracket: string,
    CreatedAt: string
    winner_id: number
    topCoord: number
    p1_id: number
    p2_id: number
    p1_id_2: number
    p2_id_2: number
}

export type Match2 = {
    ID: number;
    CreatedAt: Date;
    UpdatedAt: Date;
    DeletedAt: Date | null;

    tournamentId: number;
    p1Id: number;
    p2Id: number;
    type: string;
    currentRound: number;
    identifier: number;
    winnerId: number;
    bracket: string;
    startDate: Date;
    place: string;
    table: number;
    winnerNextMatch: number;
    loserNextMatch: number;
    teamMatchId: number;
}

export type Contestant = {
    entryStatus?: string,
    players: Player[]
}

export type Team = {
    CreatedAt: string;
    DeletedAt: string | null;
    ID: number;
    UpdatedAt: string;
    order: number;
    name: string;
    tournament_id: number;
    captain_id: string;
    players: User[]
}

export type Side = {
    title?: string,
    contestantId?: string,
    scores?: Score[],
    currentScore?: number | string,
    isServing?: boolean,
    isWinner?: boolean
}

type Score = {
    mainScore: number | string,
    subscore?: number | string,
    isWinner?: boolean
}

export type Player = {
    title: string,
    nationality?: string
}

export interface Set {
    ID: number
    CreatedAt: string
    UpdatedAt: string
    DeletedAt: string | null
    match_id: number
    team_1_score: number
    team_2_score: number
    set_number: number
}

export interface MatchWithTeams {
    id: number;
    tournament_id: number;
    p1_id: number;
    p2_id: number;
    type: string;
    current_round: number;
    identifier: number;
    winner_id: number;
    bracket: string;
    start_date: string;
    table: number;
    winner_next_match: number;
    place: string;
    loser_next_match: number;
    p1_team_name: string;
    p2_team_name: string;
    head_referee: string;
    table_referee: string;
}

export interface TournamentTable {
    teams: TeamWithMatches[];
}

export interface TeamWithMatches {
    team: Team;
    matches: MatchWithSets[];
    total_points: number;
}

export interface MatchWithSets {
    match: Match;
    player_1_score: number;
    player_2_score: number;
    points_gained: number;
    regrouped: boolean;
    sets: Set[];
}

export interface MatchWithTeamAndSets {
    match_with_team: MatchWithTeams
    team_match: TeamMatch
    player_matches: MatchWithSets[]
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

