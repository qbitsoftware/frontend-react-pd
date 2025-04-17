import { TournamentTable } from "@/types/groups"
import { Tournament } from "@/types/tournaments"
import { z } from "zod"

export interface ParticipantFormProps {
    tournament_data: Tournament
    table_data: TournamentTable
}

export const participantSchema = z.object({
    name: z.string().min(1, "Participant name is required"),
    order: z.number().optional(),
    tournament_id: z.number().min(1),
    sport_type: z.string().default("tabletennis"),
    group: z.number().optional(),
    players: z
        .array(
            z.object({
                id: z.string().optional(),
                user_id: z.number().optional(),
                first_name: z.string().optional(),
                last_name: z.string().optional(),
                name: z.string(),
                sport_type: z.string().default("tabletennis"),
                extra_data: z.object({
                    rate_order: z.number().min(0, "Rating number is required").optional(),
                    club: z.string().optional(),
                    rate_points: z.number(),
                    eltl_id: z.number().min(0, "eltl id is required").optional(),
                    class: z.string().optional(),
                }),
                sex: z.string().optional(),
                number: z.number().optional(),
            }),
        ),
    class: z.string().optional(),
})

export type ParticipantFormValues = z.infer<typeof participantSchema>

export const playerFormSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    number: z.number().optional().nullable(),
    sex: z.string().default("M"),
    extra_data: z
        .object({
            rate_order: z.number().default(0).optional(),
            club: z.string().default("").optional(),
            rate_points: z.number().default(0),
            eltl_id: z.number().default(0).optional(),
            class: z.string().default("").optional(),
        })
        .optional(),
});

export type PlayerFormValues = z.infer<typeof playerFormSchema>;




