import { TFunction } from "i18next"
import { z } from "zod"

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
  round_robin: RoundRobinBracket[]
}



export type ErrorResponse = {
  response: {
    status: number
  }
}

export type UserLogin = {
  id: number,
  email: string,
  username: string,
  role: string,
}

export type UserNew = {
  id: number
  email: string
  organization_id: number
  first_name: string
  last_name: string
  created_at: string
  eltl_id: number
  birth_date: string
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

export interface Profile {
  user: UserNew,
  matches: MatchWrapper[],
  rating_change: Player[]
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
  players: Player[];
  tournament_table_id: number;
  extra_data: PartipantExtraData;
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
  is_parent: boolean
  total_points: number;
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
  media: string;
  color?: string;
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
  participants: Participant[];
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
}

export type MatchWrapper = {
  match: Match;
  p1: Participant;
  p2: Participant;
  class: string;
}

export type TableTennisExtraData = {
  table: number;
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

export type Score = {
  number: number;
  p1_score: number;
  p2_score: number;
}

export interface Blog {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  has_image: boolean;
  image_url: string;
  full_content: string;
  status: string;
  category: string;
}

//GET RID OR CHANGE LATER

// export interface Club {
//   id: number
//   logoPath: string;
//   name: string
// }

export interface PlayerProfile {
  id: number;
  name: string;
  birthYear: number;
  club: string;
  description: string;
  photo: string;
  coverPhoto: string;
  stats: {
    matches: number;
    goals: number;
    assists: number;
    winRate: number;
  };
  achievements: string[];
  rivals: {
    id: number;
    name: string;
    photo: string;
  }[];
  socials: {
    twitter?: string;
    linkedin?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
  };
}

export interface TextNode {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  highlight?: boolean;
}

export interface ImageValue {
  props: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  };
}

export interface ContentBlockBase {
  id: string;
  type: string;
  meta?: {
    focus?: boolean;
    [key: string]: unknown;
  };
}

export interface ContentBlockWithText extends ContentBlockBase {
  value: ContentNode[];
}

export interface ContentBlockWithImage extends ContentBlockBase {
  type: 'Image';
  value: ImageValue[];
}

export type ContentBlock = ContentBlockWithText | ContentBlockWithImage;

export interface ComplexNode {
  children?: ContentNode[];
  type?: string;
  props?: Record<string, unknown>;
}

export type ContentNode = TextNode | ComplexNode;

export interface YooptaContent {
  [id: string]: ContentBlock;
}

export interface RoundTime {
  id: string
  name: string
  date: string
  time: string
}

export interface MatchTimeUpdate {
  match_id: string;
  start_date: string;
}

export interface Club {
  id: number
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
  website: string
  created_at: string
  image_url: string
}

export const createRegisterSchema = (t: TFunction) => z.object({
  first_name: z.string().min(1, t('register.form.errors.first_name')),
  last_name: z.string().min(1, t('register.form.errors.last_name')),
  email: z.string().email(t('register.form.errors.email')),
  sex: z.enum(['male', 'female', 'other'], {
    required_error: t('register.form.errors.sex'),
  }),
  birth_date: z.string().min(1, t('register.form.errors.date_of_birth')),
  username: z.string().min(3, t('register.form.errors.username')),
  password: z.string().min(8, t('register.form.errors.password')),
  confirm_password: z.string().min(1, t('register.form.errors.password_confirmation')),
  create_profile: z.boolean().default(true),
}).refine((data) => data.password === data.confirm_password, {
  message: t('register.form.errors.password_confirmation'),
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>


export interface Gameday {
  id: number;
  name: string;
  images: GamedayImage[]
  tournament_id: number;
}

export interface GamedayImage {
  id: number;
  gameday_id: number;
  image_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface GetGamedaysResponse {
  data: Gameday[]
  message: string
  error: string | null
}

export interface GetGamedayResponse {
  data: Gameday
  message: string
  error: string | null
}