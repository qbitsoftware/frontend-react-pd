'use client'

import { useToastNotification } from '@/components/toast-notification'
import { Input } from '@/components/ui/input'
import { TableCell } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { UsePatchMatch } from '@/queries/match'
import { MatchWrapper, Score } from '@/types/types'
import { useParams } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'

// Interface for the SetScore type
interface MatchSetProps {
    match: MatchWrapper
}

export const MatchSets: React.FC<MatchSetProps> = ({ match }) => {
    const [setScores, setSetScores] = useState<Score[]>([])

    const toast = useToast()
    const { tournamentid } = useParams({ strict: false })
    const { successToast, errorToast } = useToastNotification(toast)
    const updateMatchMutation = UsePatchMatch(Number(tournamentid), match.match.tournament_table_id, match.match.id)

    useEffect(() => {
        if (match && match.match.extra_data.score) {
            const sortedSets = match.match.extra_data.score.sort((a: Score, b: Score) => a.number - b.number)
            setSetScores(sortedSets)
        }
    }, [match, match.match.extra_data.score])

    const handleScoreChange = async (
        number: number,
        participant: 'p1_score' | 'p2_score',
        value: string
    ) => {
        const score = value === '' ? null : Number(value)
        const newScores = setScores.map((set) =>
            set.number === number ? { ...set, [participant]: score } : set
        )

        setSetScores(newScores)

        if (score !== null) {
            const updatedMatch = {
                ...match.match,
                extra_data: {
                    ...match.match.extra_data,
                    score: newScores,
                },
            }
            try {
                const result = await updateMatchMutation.mutateAsync(updatedMatch)
                successToast(result.message)
            } catch (error: any) {
                errorToast(error?.response?.data.message)
            }
        }
    }

    return (
        <>
            {setScores.map((set: Score) => (
                <TableCell key={match.match.id + set.number}>
                    <div className='flex items-center gap-1'>
                        <Input
                            type="number"
                            value={set.p1_score === null ? '' : match.match.forfeit ? 0 : set.p1_score}
                            onChange={(e) => handleScoreChange(set.number, 'p1_score', e.target.value)}
                            className="w-[60px] text-center"
                            min="0"
                            disabled={match.match.forfeit}
                        />
                        <span>:</span>
                        <Input
                            type="number"
                            value={set.p2_score === null ? '' : match.match.forfeit ? 0 : set.p2_score}
                            onChange={(e) => handleScoreChange(set.number, 'p2_score', e.target.value)}
                            className="w-[60px] text-center"
                            min="0"
                            disabled={match.match.forfeit}
                        />
                    </div>
                </TableCell>
            ))}
        </>
    )
}