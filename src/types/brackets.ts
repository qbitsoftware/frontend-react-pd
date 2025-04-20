import { Match, MatchWrapper } from "./matches"
import { Participant } from "./participants"

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