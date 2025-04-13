import { Participant } from "./participants";

export enum MatchState {
  CREATED = "created",
  FINISHED = "finished",
  ONGOING = "ongoing"
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
}