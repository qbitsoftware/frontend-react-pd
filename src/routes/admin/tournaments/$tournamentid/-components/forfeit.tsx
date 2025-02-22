import { MatchWrapper } from '@/types/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { UsePatchMatch } from '@/queries/match'
import { useEffect } from 'react'


interface Props {
    match: MatchWrapper
    isOpen: boolean
    tournament_id: number
    onClose: () => void
}

const Forfeit = ({ match, isOpen, onClose, tournament_id }: Props) => {
    const [winnerId, setWinnerId] = useState<string>("")
    const [error, setError] = useState<string>("")
    const usePatchMatch = UsePatchMatch(tournament_id, match.match.tournament_table_id, match.match.id)

    const handleForfeit = async () => {
        setError("")
        const send_match = match.match
        if (winnerId != "") {
            send_match.winner_id = winnerId
            send_match.forfeit = true
            await usePatchMatch.mutateAsync(send_match)
            onClose()
        } else {
            setError("You must select winner")
        }
    }

    useEffect(() => {
        if (match.match.winner_id && match.match.forfeit) {
            setWinnerId(match.match.winner_id)
        }
    }, [match])

    const deleteForfeit = async () => {
        setError("")
        const send_match = match.match
        send_match.winner_id = ""
        send_match.forfeit = false
        await usePatchMatch.mutateAsync(send_match)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Loobusmivõit</DialogTitle>
                    <DialogDescription>
                        Märgi võitja
                    </DialogDescription>
                </DialogHeader>
                <div className='mt-4'>
                    <RadioGroup value={winnerId} onValueChange={(value) => setWinnerId(value)}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={match.p1.id} id="player1" />
                            <Label htmlFor="player1">{match.p1.name == "" ? "Mängija on valimata" : match.p1.name}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={match.p2.id} id="player2" />
                            <Label htmlFor="player2">{match.p2.name == "" ? "Mängija on valimata" : match.p2.name}</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="flex justify-end flex-col md:flex-row gap-2 mt-6">
                    <Button variant="destructive" onClick={deleteForfeit}>Kustuta loobumisvõit</Button>
                    <Button variant="outline" onClick={onClose}>Tagasi</Button>
                    <Button onClick={handleForfeit} disabled={winnerId === null}>Kinnita loobumisvõit</Button>
                </div>
                <div>
                    <p className='text-red-500'>
                        {error != '' && error}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Forfeit