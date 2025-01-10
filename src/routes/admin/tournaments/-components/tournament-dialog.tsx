import { DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Dialog } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Window } from '@/routes/tere/-components-2/window'
import { Bracket } from '@/types/types'
import { SetStateAction } from 'react'
import { Dispatch } from 'react'


interface TournamentDialogProps {
    data: Bracket[]
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}
const TournamentDialog: React.FC<TournamentDialogProps> = ({ data, isOpen, setIsOpen }) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent >
                <DialogTitle>Tournament Details</DialogTitle>
                <DialogDescription>
                    Here you can manage the details of the tournament.
                </DialogDescription>
                <div className='w-full h-[70vh]'>
                    <Window data={data} />
                </div>
                <Button>Start tournament</Button>
            </DialogContent>
        </Dialog>
    )
}

export default TournamentDialog