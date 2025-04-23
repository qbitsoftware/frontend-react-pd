import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { UseUpdateMatchTime } from '@/queries/match'
import { MatchTimeUpdate, MatchWrapper } from '@/types/matches'
import { RoundTime } from '@/types/tournaments'
import { useTranslation } from 'react-i18next'

interface TimeEditingModalProps {
    tournament_id: number
    tournament_table_id: number
    matches: MatchWrapper[],
    isOpen: boolean
    onClose: () => void
}

const TimeEditingModal: React.FC<TimeEditingModalProps> = ({ tournament_id, isOpen, onClose, matches, tournament_table_id }) => {
    const [rounds, setRounds] = useState<RoundTime[]>([])
    const [loading, setLoading] = useState(false)
    const [modifiedRounds, setModifiedRounds] = useState<Set<string>>(new Set())
    const timeMutation = UseUpdateMatchTime(tournament_id, tournament_table_id)

    const { t } = useTranslation()

    useEffect(() => {
        if (isOpen && matches && matches.length > 0) {
            extractRoundsFromMatches(matches)
            setModifiedRounds(new Set())
        }
    }, [isOpen, matches])

    const extractRoundsFromMatches = (matches: MatchWrapper[]) => {
        try {
            setLoading(true)

            const matchesByRound = new Map<string, MatchWrapper>();

            matches.forEach(match => {
                const round = match.match.round;
                let key = ""
                if (match.match.type === "winner") {
                    key = "W-" + round;
                } else if (match.match.type === "round") {
                    key = "R-" + round;
                }
                if (!matchesByRound.has(key)) {
                    matchesByRound.set(key, match);
                }
            });

            const extractedRounds: RoundTime[] = Array.from(matchesByRound.entries())
                .sort(([roundA], [roundB]) => Number(roundA.split("-")[1]) - Number(roundB.split("-")[1]))
                .map(([roundNumber, match]) => {
                    let dateStr = "";
                    let timeStr = "12:00";

                    if (match.match.start_date) {
                        const date = new Date(match.match.start_date);

                        if (!isNaN(date.getTime())) {
                            const year = date.getFullYear();
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const day = date.getDate().toString().padStart(2, '0');

                            dateStr = `${year}-${month}-${day}`;

                            const hours = date.getHours().toString().padStart(2, '0');
                            const minutes = date.getMinutes().toString().padStart(2, '0');
                            timeStr = `${hours}:${minutes}`;
                        }
                    }

                    let name = ""
                    if (match.match.type === "winner") {
                        name = t('admin.tournaments.groups.participants.change_time.play_off') + " " + roundNumber.split("-")[1]
                    } else {
                        name = t('admin.tournaments.groups.participants.change_time.round') + " " + roundNumber.split("-")[1]
                    }
                    return {
                        id: roundNumber,
                        name,
                        date: dateStr,
                        time: timeStr,
                    };
                });

            setRounds(extractedRounds);
        } catch (error) {
            void error;
            toast.error(t('toasts.participants.round_process_error'));

            setRounds([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (id: string, date: string) => {
        setRounds(rounds.map(round =>
            round.id === id ? { ...round, date } : round
        ))
        setModifiedRounds(prev => new Set(prev).add(id))
    }

    const handleTimeChange = (id: string, time: string) => {
        setRounds(rounds.map(round =>
            round.id === id ? { ...round, time } : round
        ))
        setModifiedRounds(prev => new Set(prev).add(id))
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const updatedRoundData = new Map<string, { date: string, time: string }>();

            rounds.forEach(round => {
                if (modifiedRounds.has(round.id)) {
                    updatedRoundData.set(round.id, {
                        date: round.date,
                        time: round.time
                    });
                }
            });

            const matchTimeUpdates: MatchTimeUpdate[] = matches
                .filter(match => modifiedRounds.has(match.match.type === "winner" ? "W-" + match.match.round : "R-" + match.match.round))
                .map(match => {
                    const roundData = updatedRoundData.get(match.match.type === "winner" ? "W-" + match.match.round : "R-" + match.match.round);
                    if (!roundData) return null;

                    const date = new Date(`${roundData.date}T${roundData.time}:00`);


                    const m: MatchTimeUpdate = {
                        match_id: match.match.id,
                        start_date: date.toISOString(),
                    };

                    return m
                })
                .filter((update): update is MatchTimeUpdate => update !== null);

            await timeMutation.mutateAsync(matchTimeUpdates)
            toast.success(t('toasts.participants.time_change_success'))
        } catch (err) {
            void err;
            toast.error(t('toasts.participants.time_change_error'))
        }
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {t('admin.tournaments.groups.participants.change_time.title')}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {loading ? (
                        <div className="flex justify-center">{t('protocol.loading')}</div>
                    ) : (
                        rounds.map(round => {
                            return (
                                <div key={round.id} className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor={`round-${round.id}`} className="text-right">
                                        {round.name}:
                                    </Label>
                                    <div>
                                        <Input
                                            id={`date-${round.id}`}
                                            type="date"
                                            value={round.date}
                                            onChange={(e) => handleDateChange(round.id, e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            id={`time-${round.id}`}
                                            type="time"
                                            value={round.time}
                                            onChange={(e) => handleTimeChange(round.id, e.target.value)}
                                        />
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        {t('admin.tournaments.groups.participants.change_time.cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {t('admin.tournaments.groups.participants.change_time.save')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TimeEditingModal
