import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { UsePatchMatch } from '@/queries/match'
import { useProtocolModal } from '@/providers/protocolProvider';
import { toast } from 'sonner';
import { MatchWrapper } from '@/types/matches'

const Forfeit = ({match}: {match: MatchWrapper}) => {
    const {
        tournament_id,
        forfeitMatch,
        setForfeitMatch
    } = useProtocolModal()

    const [winnerId, setWinnerId] = useState<string>("")
    const [error, setError] = useState<string>("")

    const { mutateAsync: updateMatch } = UsePatchMatch(
        tournament_id,
        match.match.tournament_table_id,
        match.match.id)

    const handleForfeit = async () => {
        try {
            setError("")
            const send_match = match.match
            if (winnerId != "") {
                send_match.winner_id = winnerId
                send_match.forfeit = true
                await updateMatch(send_match)
                setForfeitMatch(null)
            } else {
                setError("You must select winner")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error updating match")
        }
    }


    const deleteForfeit = async () => {
        try {
            setError("")
            const send_match = match.match
            send_match.winner_id = ""
            send_match.forfeit = false
            await updateMatch(send_match)
            setForfeitMatch(null)
        } catch (error) {
            console.log(error)
            toast.error("Error updating match")
        }
    }

    return (
        <Dialog open={forfeitMatch !== null} onOpenChange={() => setForfeitMatch(null)} >
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
                    <Button variant="outline" onClick={() => setForfeitMatch(null)}>Tagasi</Button>
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