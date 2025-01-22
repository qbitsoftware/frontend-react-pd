import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tournament } from '@/types/types'
import { formatDateString, parseTournamentType } from '@/lib/utils'

import {
    Users,
    Trophy,
    Calendar,
    MapPin,
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { UseGetParticipantsQuery } from '@/queries/participants'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'

interface TournamentCardProps {
    tournament: Tournament
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
    const { data: participants } = UseGetParticipantsQuery(tournament.id)
    const { t } = useTranslation()
    const navigate = useNavigate()

    const handleClick = (tournament_id: number) => {
        navigate({to: `/admin/tournaments/${tournament_id}`})
    }

    return (
        <> 
            <Card onClick={() => handleClick(tournament.id)} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 hover:bg-gray-100 hover:cursor-pointer">
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
                                value={`${participants && participants.data ? participants.data.length : "-"} / ${tournament.tournament_size}`}
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
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

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