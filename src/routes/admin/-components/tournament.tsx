import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash } from 'lucide-react'
import { Edit } from 'lucide-react'
import { Tournament } from '@/types/types'
import React from 'react'
import { formatDateString, parseTournamentType } from '@/lib/utils'
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

interface TournamentCardProps {
    tournament: Tournament
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
    return (
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
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
                <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">
                    {/* Main Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="flex justify-between items-center pt-4">
                        <div className="flex items-center gap-4">
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