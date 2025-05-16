import { Match, MatchWrapper } from "./matches"
import { Participant } from "./participants"

export const BRACKET_CONSTANTS = {
  INITIAL_GAP: 30,
  BOX_HEIGHT: 60,
  BOX_WIDTH: 220,
  
  CONNECTOR_LINE_HEIGHT: 1,
  CONNECTOR_LINE_WIDTH: 1,
  CONNECTOR_SPACING: 4,
  CONNECTOR_VERTICAL_OFFSET: 34 
};

export enum BracketType  {
  MIINUSRING = "Miinusring",
  PLUSSRRING = "Plussring"
}

export type Round = {
  name: string,
}

export type TableMatch = {
  match: Match
  participant_1: Participant
  participant_2: Participant
  is_bronze_match: boolean
}

export type Bracket = {
  eliminations: Eliminations[]
  round_robins: RoundRobins[]
}

export type EliminationBracket = {
  rounds: Round[],
  matches: TableMatch[],
  name: string;
}

export type Eliminations = {
  elimination: EliminationBracket[]
}

export type RoundRobinBracket = {
  participant: Participant
  matches: MatchWrapper[]
  total_points: number
}


export type RoundRobins = {
  round_robin: RoundRobinBracket[][]
}

export type PlayerSwitch = {
  match_1_id: string
  match_2_id: string
  participant_1_id: string
  participant_1_position: string
  participant_2_id: string
  participant_2_position: string
}