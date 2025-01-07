import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { Participant } from "@/types/types";

interface ParticipantsListProps {
    participants: Participant[]
}

export const ParticipantsList:React.FC<ParticipantsListProps> = ({participants}) => {


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {participants.map((participant) => (
                    <TableRow key={participant.id}>
                        <TableCell className="font-medium">{participant.name}</TableCell>
                        <TableCell>{participant.rank}</TableCell>
                        <TableCell>{participant.name}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="sm" className="text-red-600">
                                <Trash className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}