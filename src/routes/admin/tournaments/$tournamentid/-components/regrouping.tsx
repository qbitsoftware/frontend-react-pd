"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { useEffect, useState } from 'react'
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
// import { TeamData, useGetRegroupTeams, usePostRegroup } from '@/app/api/teams'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useToastNotification } from '@/components/toast-notification'
import { Participant } from '@/types/types'
import RegroupDND from './regroup-dnd'
import { UseGetParticipantsQuery } from '@/queries/participants'
import { useParams } from '@tanstack/react-router'
import { UseRegroupMatches } from '@/queries/match'

interface ReGroupingProps {
    isOpen: boolean
    setIsOpen: () => void
    onClose: () => void
    tournament_id: number
}

const ReGrouping: React.FC<ReGroupingProps> = ({ isOpen, setIsOpen, onClose, tournament_id }) => {
    const params = useParams({ strict: false })
    const { data } = UseGetParticipantsQuery(tournament_id, Number(params.groupid), true)
    const [participants, setParticipants] = useState<Participant[]>([])
    const useRegroupMutation = UseRegroupMatches(tournament_id, Number(params.groupid))

    const toast = useToast()
    const { successToast, errorToast } = useToastNotification(toast)


    useEffect(() => {
        if (data?.data) {
            setParticipants(data.data)
        }
    }, [isOpen, data?.data])

    if (!participants) {

    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            const updatedParticipants = arrayMove(participants,
                participants.findIndex((item) => item.id === active.id),
                participants.findIndex((item) => item.id === over?.id)
            )
            setParticipants(updatedParticipants);
        }
    }

    console.log("Participants", participants)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const onSubmit = async () => {
        console.log("Submitting")
        try {
            const data = await useRegroupMutation.mutateAsync(participants)
            onClose()
            successToast(data?.message)
        } catch (error) {
            void error
            errorToast("Something went wrong")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className="max-w-4xl max-h-[80vh] md:max-h-[90vh] overflow-y-auto px-0 sm:px-2 md:px-4">
                <DialogHeader>
                    <DialogTitle>Mängu regroupeering</DialogTitle>
                    <DialogDescription>
                        Kuvasime juhuslikult tiimid. Tiimide liigutamiseks lohistage nupust.
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col mt-6'>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext
                            items={participants.map(participant => participant.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <ul className="space-y-2">
                                {participants.map((participant, key) => (
                                    <RegroupDND key={participant.id} participant={participant} index={key} />
                                ))}
                            </ul>
                        </SortableContext>
                    </DndContext>
                </div>
                <Button onClick={onSubmit}>
                    Regrupeeri
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default ReGrouping