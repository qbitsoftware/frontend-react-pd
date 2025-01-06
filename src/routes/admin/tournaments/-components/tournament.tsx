import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Trash } from 'lucide-react'
import { Edit } from 'lucide-react'
import { Tournament } from '@/types/types'
import React, { useState } from 'react'
import { formatDateString, parseTournamentType } from '@/lib/utils'
import { Link, useRouter } from '@tanstack/react-router'
import {
    Users,
    Trophy,
    Calendar,
    MapPin,
    DollarSign,
    Clock,
    Info,
    ChevronRight
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UseDeleteTournament } from '@/queries/tournaments'
import { useToast } from '@/hooks/use-toast'
import { useToastNotification } from '@/components/toast-notification'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

interface TournamentCardProps {
    tournament: Tournament
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
    const deleteMutation = UseDeleteTournament(tournament.id)
    const router = useRouter()

    const toast = useToast()
    const { successToast, errorToast } = useToastNotification(toast)

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync()
            router.navigate({
                to: "/admin/tournaments", // Navigate to the current path
                replace: true, // Optional: Avoid adding to the history stack
            });
            successToast("Turniir on edukalt kustutatud")
            setShowDeleteDialog(false)
        } catch (error) {
            errorToast("Turniiri kustutamine ebaõnnestus")
            console.error(error)
        }
    };

    return (
        <>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the tournament
                            and remove all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 text-white hover:bg-red-700"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Tournament"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-col space-y-4">
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <CardTitle className="text-xl font-bold text-gray-900">
                                {tournament.name}
                            </CardTitle>
                            <Badge variant={tournament.state === 'started' ? 'outline' : 'destructive'}>
                                {tournament.state}
                            </Badge>
                        </div>
                        <CardDescription className="text-gray-500 mt-1">
                            {formatDateString(tournament.start_date) + ' - ' + formatDateString(tournament.end_date)}
                        </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href={`/admin/tournaments/${tournament.id}`}>
                            <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        {/* Main Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoItem
                                icon={<Trophy className="w-4 h-4 text-blue-500" />}
                                label="Type"
                                value={parseTournamentType(tournament.type)}
                            />
                            <InfoItem
                                icon={<Users className="w-4 h-4 text-green-500" />}
                                label="Participants"
                                value={`${tournament.min_team_size} / ${tournament.max_players}`}
                            />
                            <InfoItem
                                icon={<MapPin className="w-4 h-4 text-red-500" />}
                                label="Location"
                                value={tournament.location}
                            />
                            <InfoItem
                                icon={<Calendar className="w-4 h-4 text-purple-500" />}
                                label="Duration"
                                value={`${getDurationDays(tournament.start_date, tournament.end_date)} days`}
                            />
                        </div>

                        <Separator />

                        {/* Extended Info */}
                        <div className="space-y-6">
                            {/* Prize Pool Section */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-yellow-500" />
                                    Prize Pool
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">1st Place</p>
                                            <p className="font-semibold">$10,000</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">2nd Place</p>
                                            <p className="font-semibold">$5,000</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Info */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    Registration Period
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="space-y-2">
                                        <p className="text-sm">
                                            <span className="text-gray-600">Opens: </span>
                                            <span className="font-semibold">{formatDateString(tournament.start_date)}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-600">Closes: </span>
                                            <span className="font-semibold">{formatDateString(tournament.end_date)}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <Button variant="outline" size="sm">
                                    <Info className="w-4 h-4 mr-2" />
                                    View Details
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Users className="w-4 h-4 mr-2" />
                                    Manage Teams
                                </Button>
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-600">
                                View Brackets
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

// Helper Components
interface InfoItemProps {
    icon: React.ReactNode
    label: string
    value: string
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
    <div className="flex items-start gap-2">
        {icon}
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-sm font-medium text-gray-900">{value}</p>
        </div>
    </div>
)

// Helper function to calculate duration
const getDurationDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default TournamentCard