import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { TableMatch } from '@/types/types';


interface MatchDialogProps {
    open: boolean;
    onClose: (open: boolean) => void
    match: TableMatch;
}

const MatchDialog: React.FC<MatchDialogProps> = ({ open, onClose, match }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] min-w-[500px] min-h-[500px]">
                <DialogHeader>
                    <DialogTitle>Match Details</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">Match ID: {match.match.id}</h3>
                            <p>Tournament ID: {match.match.tournament_id}</p>
                            <p>Round: {match.match.round + 1}</p>
                            <p>Order: {match.match.order}</p>
                            <p>Bracket: {match.match.bracket}</p>
                            {match.is_bronze_match && <Badge variant="secondary">Bronze Match</Badge>}
                        </div>
                        <div>
                            <h4 className="text-md font-semibold">Contestants</h4>
                            <p>No contestant information available</p>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold">Additional Information</h4>
                            <p>Winner ID: {match.match.winner_id || 'Not determined'}</p>
                            <p>Player 1 ID: {match.participant_1.name}</p>
                            <p>Player 2 ID: {match.participant_2.name}</p>
                        </div>
                    </div>
                </ScrollArea>
                <div className="mt-4 flex justify-end">
                    {/* <Button onClick={onClose}>Close</Button> */}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MatchDialog;