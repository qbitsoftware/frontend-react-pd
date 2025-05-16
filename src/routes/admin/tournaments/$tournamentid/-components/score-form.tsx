import { Input } from "@/components/ui/input";
import { Match, Score } from "@/types/matches"
import { useEffect, useState } from "react";

interface ScoreFormProps {
    participant: string
    match: Match
    score: Score[]
}

export const ScoreForm: React.FC<ScoreFormProps> = ({ score, participant }) => {
    const [setScore, setSetScore] = useState<{ p1_score: number, p2_score: number }>({ p1_score: 0, p2_score: 0 })

    useEffect(() => {
        let p1_sets = 0
        let p2_sets = 0
        if (!score || score == null) {
            setSetScore({ p1_score: 0, p2_score: 0 })
            return
        }
        for (let i = 0; i < score.length; i++) {
            if (score[i].p1_score >= 11 && Math.abs(score[i].p1_score - score[i].p2_score) >= 2) {
                p1_sets++
            } else if (score[i].p2_score >= 11 && Math.abs(score[i].p1_score - score[i].p2_score) >= 2) {
                p2_sets++
            }
        }
        setSetScore({ p1_score: p1_sets, p2_score: p2_sets })
    }, [score])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, participant: string) => {
        const newSetScore = Number(event.target.value)
        const updatedScore: Score[] = Array.isArray(score) ? [...score] : []

        if (participant === "p1") {
            if (newSetScore > setScore.p1_score) {
                for (let i = setScore.p1_score; i < newSetScore; i++) {
                    updatedScore.push({ number: updatedScore.length + 1, p1_score: 11, p2_score: 0 })
                }
            } else {
                updatedScore.splice(newSetScore, updatedScore.length - newSetScore)
            }
            setSetScore({ ...setScore, p1_score: newSetScore })
        } else {
            if (newSetScore > setScore.p2_score) {
                for (let i = setScore.p2_score; i < newSetScore; i++) {
                    updatedScore.push({ number: updatedScore.length + 1, p1_score: 0, p2_score: 11 })
                }
            } else {
                updatedScore.splice(newSetScore, updatedScore.length - newSetScore)
            }
            setSetScore({ ...setScore, p2_score: newSetScore })
        }


    }

    return (
        <div>
            {participant === "p1" ? (
                <Input
                    onChange={(e) => handleChange(e, "p1")}
                    placeholder="Player 1"
                    type="number"
                    value={setScore.p1_score}
                />
            ) : (
                <Input
                    onChange={(e) => handleChange(e, "p2")}
                    placeholder="Player 2"
                    type="number"
                    value={setScore.p2_score}
                />
            )}
        </div>
    )
}