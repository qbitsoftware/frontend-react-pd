import { TFunction } from "i18next"
import { MatchWrapper } from "./matches"
import { Player } from "./players"
import { z } from "zod"

export interface Profile {
  user: User,
  matches: MatchWrapper[],
  rating_change: Player[]
}

export type User = {
  id: number
  email: string
  organization_id: number
  first_name: string
  last_name: string
  created_at: string
  eltl_id: number
  birth_date: string
  sex: string
  location: string
  username: string
  foreigner: number
  club_name: string
  rate_order: number
  rate_pl_points: number
  rate_points: number
  rate_weigth: number
  oragnization_id: number
  role: number
}

export type UserNew = {
  username: string;
  id: number;
  email: string;
  organization_id: number;
  first_name: string;
  last_name: string;
  created_at: string;
  eltl_id: number;
  birth_date: string;
  sex: string;
  foreigner: number;
  club_name: string;
  rate_order: number;
  rate_pl_points: number;
  rate_points: number;
  rate_weigth: number;
  oragnization_id: number;
  location: string;
  role: number;
};

export type UserLogin = {
  id: number,
  email: string,
  username: string,
  role: string,
}

export interface UserProfile {
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


export const createRegisterSchema = (t: TFunction) =>
  z
    .object({
      first_name: z.string().min(1, t("register.form.errors.first_name")),
      last_name: z.string().min(1, t("register.form.errors.last_name")),
      username: z.string().min(3, t("register.form.errors.username")),
      password: z.string().min(8, t("register.form.errors.password")),
      location: z.enum(["tartu", "tallinn", "portugal"], {
        errorMap: () => ({ message: t("register.form.errors.location") })
      }),
      confirm_password: z
        .string()
        .min(1, t("register.form.errors.password_confirmation")),
      create_profile: z.boolean().default(true),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: t("register.form.errors.password_confirmation"),
      path: ["confirmPassword"],
    });

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;