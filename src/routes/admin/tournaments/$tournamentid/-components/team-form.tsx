import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

const teamSchema = z.object({
    teamName: z.string().min(1, 'Team name is required'),
    players: z.array(z.object({
        name: z.string().min(1, 'Player name is required'),
        isCaptain: z.boolean().default(false)
    })).min(1, "Team must have at least one player"),
})

type FormValues = z.infer<typeof teamSchema>

type TestPlayer = {
    id: string
    first_name: string;
    last_name: string;
    full_name: string;
}

const placeholderPlayers: TestPlayer[] = [
    { id: '1', first_name: 'John', last_name: 'Doe' },
    { id: '2', first_name: 'John', last_name: 'Tere' },
    { id: '3', first_name: 'Jane', last_name: 'Smith' },
    { id: '4', first_name: 'Alice', last_name: 'Johnson' },
    { id: '5', first_name: 'Bob', last_name: 'Brown' },
    { id: '6', first_name: 'Charlie', last_name: 'Davis' },
    { id: '7', first_name: 'David', last_name: 'Wilson' },
    { id: '8', first_name: 'Eve', last_name: 'Clark' },
    { id: '9', first_name: 'Frank', last_name: 'Harris' },
    { id: '10', first_name: 'Grace', last_name: 'Lee' },
    { id: '11', first_name: 'Hank', last_name: 'Martin' }
].map(player => ({
    ...player,
    full_name: `${player.first_name} ${player.last_name}`
}))

interface AddTeamDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tournamentId: string
}

const TeamForm: React.FC<AddTeamDialogProps> = ({ open, onOpenChange, tournamentId }) => {
    const { toast } = useToast()
    const form = useForm<FormValues>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            teamName: '',
            players: [{ name: '', isCaptain: false }],
        },
    })

    const [playerSuggestions, setPlayerSuggestions] = useState<TestPlayer[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, 300)
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

    useEffect(() => {
        if (debouncedSearchTerm) {
            const filteredPlayers = placeholderPlayers.filter(player =>
                player.full_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            )
            setPlayerSuggestions(filteredPlayers)
        } else {
            setPlayerSuggestions([])
        }
    }, [debouncedSearchTerm])

    const onSubmit = async (values: FormValues) => {
        toast({
            title: "Team added",
            description: `Team ${values.teamName} has been created.`,
        })

        form.reset()
        onOpenChange(false)
    }

    const addPlayer = () => {
        const currentPlayers = form.getValues("players")
        form.setValue("players", [...currentPlayers, { name: "", isCaptain: false }])
    }

    const removePlayer = (index: number) => {
        const currentPlayers = form.getValues("players")
        if (currentPlayers.length > 1) {
            form.setValue("players", currentPlayers.filter((_, i) => i !== index))
        }
    }

    const players = form.watch("players")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Team</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto">
                        <FormField
                            control={form.control}
                            name="teamName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter team name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {players.map((_, index) => (
                            <div key={index} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`players.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1 relative">
                                                <FormLabel>Player {index + 1}</FormLabel>
                                                <FormControl>
                                                    <div className='flex justify-between gap-4'>
                                                        <Input
                                                            {...field}
                                                            placeholder="Enter player name"
                                                            onChange={(e) => {
                                                                field.onChange(e)
                                                                setSearchTerm(e.target.value)
                                                            }}
                                                            onFocus={() => setFocusedIndex(index)}
                                                            onBlur={() => {
                                                                setTimeout(() => setFocusedIndex(null), 200)
                                                            }}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => removePlayer(index)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                                {focusedIndex === index && playerSuggestions.length > 0 && (
                                                    <div className="absolute w-full mt-1 py-1 bg-background border rounded-md shadow-lg z-10">
                                                        {playerSuggestions.map((player, i) => (
                                                            <div
                                                                key={i}
                                                                className="px-3 py-2 cursor-pointer hover:bg-accent"
                                                                onClick={() => {
                                                                    form.setValue(`players.${index}.name`, player.full_name)
                                                                    setPlayerSuggestions([])
                                                                    setFocusedIndex(null)
                                                                }}
                                                            >
                                                                {player.full_name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        ))}

                        <Button type="button" onClick={addPlayer}>
                            Add Player
                        </Button>

                        <Button type="submit" className="mt-4">
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default TeamForm