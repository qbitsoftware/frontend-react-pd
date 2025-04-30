import { Participant } from "./participants";


export type PlayerKey = keyof Pick<TableTennisExtraData,
  'player_a_id' | 'player_b_id' | 'player_c_id' | 'player_d_id' | 'player_e_id' |
  'player_x_id' | 'player_y_id' | 'player_z_id' | 'player_v_id' | 'player_w_id'
>

export enum MatchState {
  CREATED = "created",
  FINISHED = "finished",
  ONGOING = "ongoing"
}

export enum GroupType {
  SINGLE_ELIM = "single_elimination",
  SINGLE_ELIM_BRONZE = "single_elimination_bronze",
  DOUBLE_ELIM_FULL_PLACEMENT = "double_elimination_full_placement",
  DOUBLE_ELIM_FULL_PLACEMENT_TOP_HEAVY = "double_elimination_full_placement_top_heavy",
  DOUBLE_ELIM_TABLETENNIS = "double_elimination_tabletennis",
  DOUBLE_ELIM_TABLETENNIS_TOP_HEAVY = "double_elimination_tabletennis_top_heavy",
  CHAMPIONS_LEAGUE = "champions_league",
  ROUND_ROBIN = "round_robin",
  FREE_FOR_ALL = "free_for_all",
  ROUND_ROBIN_FULL_PLACEMENT = "round_robin_full_placement",

}

export type TableTennisExtraData = {
  table: string;
  score?: Score[];
  table_referee?: string;
  head_referee?: string;
  parent_match_id: string;
  notes?: string;
  captain_a?: string;
  player_a_id?: string;
  player_b_id?: string;
  player_c_id?: string;
  player_d_id?: string;
  player_e_id?: string;
  captain_b?: string;
  player_x_id?: string;
  player_y_id?: string;
  player_z_id?: string;
  player_v_id?: string;
  player_w_id?: string;
  team_1_total?: number;
  team_2_total?: number;
}


export type Match = {
  id: string
  tournament_table_id: number
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
  start_date: string
  extra_data: TableTennisExtraData
  topCoord: number // for front end purposes
  table_type: string
  state: MatchState;
  readable_id: number;
  previous_match_readable_id_1: number
  previous_match_readable_id_2: number
}

export type MatchWrapper = {
  match: Match;
  p1: Participant;
  p2: Participant;
  class: string;
}

export type Score = {
  number: number;
  p1_score: number;
  p2_score: number;
}

export interface MatchTimeUpdate {
  match_id: string;
  start_date: string;
  location: string;
}