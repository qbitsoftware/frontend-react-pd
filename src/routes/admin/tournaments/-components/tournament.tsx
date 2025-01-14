import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Trash } from 'lucide-react'
import { Edit } from 'lucide-react'
import { Bracket, Tournament } from '@/types/types'
import React, { useState } from 'react'
import { formatDateString, parseTournamentType } from '@/lib/utils'
import { Link, useRouter } from '@tanstack/react-router'
import {
    Users,
    Trophy,
    Calendar,
    MapPin,
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
import { UseStartTournament } from '@/queries/tournaments'
import { Dialog, DialogTitle, DialogContent, DialogDescription } from '@/components/ui/dialog'
import { Window } from '@/components/window'
import { UseDeleteBrackets } from '@/queries/brackets'
import { UseGetParticipantsQuery } from '@/queries/participants'
import { useTranslation } from 'react-i18next'

interface TournamentCardProps {
    tournament: Tournament
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
    const deleteMutation = UseDeleteTournament(tournament.id)
    const resetMutation = UseDeleteBrackets(tournament.id)
    const startMutation = UseStartTournament(tournament.id)
    const { data: participants } = UseGetParticipantsQuery(tournament.id)
    const router = useRouter()
    const { t } = useTranslation()

    const toast = useToast()
    const { successToast, errorToast } = useToastNotification(toast)
    const [exampleDialog, setExampleDialog] = useState(false)
    const [exampleDialogData, setExampleDialogData] = useState<Bracket[]>([])
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showResetDialog, setShowResetDialog] = useState(false)
    const [showDetails, setShowDetails] = useState(false)

    const additionalInfo = tournament.information ?
        (typeof tournament.information === 'string'
            ? JSON.parse(tournament.information)
            : tournament.information)
        : { fields: [] }

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync()
            router.navigate({
                to: "/admin/tournaments",
                replace: true,
            });
            successToast("Turniir on edukalt kustutatud")
            setShowDeleteDialog(false)
        } catch (error) {
            errorToast("Turniiri kustutamine ebaõnnestus")
            console.error(error)
        }
    };

    const handleReset = async () => {
        try {
            await resetMutation.mutateAsync()
            router.navigate({
                to: "/admin/tournaments",
                replace: true,
            });
            successToast("Turniiri mängud on edukalt kustutatud")
        } catch (error) {
            errorToast("Turniiri mängude kustutamine ebaõnnestus")
            console.error(error)
        }
    }

    const ShowExample = async () => {
        try {
            const result = await startMutation.mutateAsync(false)
            if (result.data) {
                setExampleDialog(true)
                setExampleDialogData(result.data)
            }
            setShowDeleteDialog(false)
        } catch (error) {
            errorToast("There are some problems with starting a tournament")
            console.error(error)
        }
    }

    const CreateTournament = async () => {
        try {
            await startMutation.mutateAsync(true)
            setExampleDialog(false)
            router.navigate({
                to: "/admin/tournaments",
                replace: true,
            });
            successToast("Tournament created successfully")
        } catch (error) {
            errorToast("There are some problems with starting a tournament")
            console.error(error)
        }
    }

    return (
        <>
            {/* Delete Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('admin.tournaments.confirmations.delete.question')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('admin.tournaments.confirmations.delete.description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('admin.tournaments.confirmations.delete.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 text-white hover:bg-red-700"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('admin.tournaments.confirmations.delete.deleting')}
                                </>
                            ) : (
                                t('admin.tournaments.confirmations.delete.title')
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Reset Dialog */}
            <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('admin.tournaments.confirmations.reset.question')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('admin.tournaments.confirmations.reset.description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('admin.tournaments.confirmations.reset.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReset}
                            className="bg-red-600 text-white hover:bg-red-700"
                            disabled={resetMutation.isPending}
                        >
                            {resetMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('admin.tournaments.confirmations.reset.deleting')}
                                </>
                            ) : (
                                t('admin.tournaments.confirmations.reset.title')
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {exampleDialogData &&
                <Dialog open={exampleDialog} onOpenChange={setExampleDialog}>
                    <DialogContent >
                        <DialogTitle>{t('admin.tournaments.confirmations.create_tournament.title')}</DialogTitle>
                        <DialogDescription>
                            {t('admin.tournaments.confirmations.create_tournament.description')}
                        </DialogDescription>
                        <div className='w-full h-[70vh]'>
                            <Window data={exampleDialogData} />
                        </div>
                        <Button onClick={() => { CreateTournament() }}>{t('admin.tournaments.confirmations.create_tournament.button')}</Button>
                    </DialogContent>
                </Dialog>
            }

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
                                {t('admin.tournaments.actions.edit')}
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            {t('admin.tournaments.actions.delete')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => setShowResetDialog(true)}
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            {t('admin.tournaments.actions.reset_matches')}
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        {/* Main Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoItem
                                icon={<Trophy className="w-4 h-4 text-blue-500" />}
                                label={t('admin.tournaments.info.type')}
                                value={parseTournamentType(tournament.type)}
                            />
                            <InfoItem
                                icon={<Users className="w-4 h-4 text-green-500" />}
                                label={t('admin.tournaments.info.participants')}
                                value={`${participants && participants.data ? participants.data.length : "-"} / ${tournament.max_players}`}
                            />
                            <InfoItem
                                icon={<MapPin className="w-4 h-4 text-red-500" />}
                                label={t('admin.tournaments.info.location')}
                                value={tournament.location}
                            />
                            <InfoItem
                                icon={<Calendar className="w-4 h-4 text-purple-500" />}
                                label={t('admin.tournaments.info.duration')}
                                value={`${getDurationDays(tournament.start_date, tournament.end_date) + 1} days`}
                            />
                        </div>

                        <Separator />

                        {/* Modified Extended Info */}
                        <div className="space-y-6">
                            {/* Replace the hardcoded Prize Pool section with this */}
                            {showDetails && additionalInfo.fields?.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold flex items-center gap-2">
                                        <Info className="w-4 h-4 text-blue-500" />
                                        {t('admin.tournaments.info.extra_info')}
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                        {additionalInfo.fields.map((field: any, index: number) => (
                                            <div key={index} className="border-b last:border-b-0 pb-3 last:pb-0">
                                                <p className="text-sm text-gray-600">{field.title}</p>
                                                <p className="font-semibold whitespace-pre-wrap">{field.information}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Keep your Registration Info section */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    {t('admin.tournaments.info.registration_period')}
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="space-y-2">
                                        <p className="text-sm">
                                            <span className="text-gray-600">{t('admin.tournaments.info.registration_period_opens')}: </span>
                                            <span className="font-semibold">{formatDateString(tournament.start_date)}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-600">{t('admin.tournaments.info.registration_period_closes')}: </span>
                                            <span className="font-semibold">{formatDateString(tournament.end_date)}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Update the Bottom Actions section */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDetails(!showDetails)}
                                >
                                    <Info className="w-4 h-4 mr-2" />
                                    {showDetails ? t('admin.tournaments.actions.hide_details') : t('admin.tournaments.actions.view_details')}
                                </Button>
                                <Link href={`/admin/tournaments/${tournament.id}/participants`}>
                                    <Button variant="outline" size="sm">
                                        <Users className="w-4 h-4 mr-2" />
                                        {t('admin.tournaments.actions.manage_participants')}
                                    </Button>
                                </Link>
                            </div>
                            {tournament.state === "created" ? (
                                <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => ShowExample()}>
                                    {t('admin.tournaments.actions.start_tournament')}
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : tournament.state === "started" ? (
                                <Link href={`${tournament.id}/brackets`}>
                                    <Button variant="ghost" size="sm" className="text-green-600">
                                        {t('admin.tournaments.actions.view_brackets')}
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            ) : tournament.state === "" ? (
                                <Button variant="ghost" size="sm" className="text-red-600">
                                    {t('admin.tournaments.actions.view_results')}
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : null}
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