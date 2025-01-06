import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Trophy, UsersIcon } from 'lucide-react'

export const Route = createFileRoute('/admin/dashboard/')({
    component: RouteComponent,
})

function RouteComponent() {

    const mockStats = {
        totalTournaments: 45,
        activeTournaments: 3,
        totalTeams: 128,
        totalUsers: 512,
        recentSignups: 24,
        pendingApprovals: 8
    };

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Trophy className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">{mockStats.totalTournaments}</CardTitle>
                            <CardDescription>Total Tournaments</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <UsersIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">{mockStats.totalTeams}</CardTitle>
                            <CardDescription>Registered Teams</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center space-x-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">{mockStats.pendingApprovals}</CardTitle>
                            <CardDescription>Pending Approvals</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">• New team registration: Team Alpha (2 minutes ago)</p>
                        <p className="text-sm text-gray-600">• Tournament "Summer Championship" started (1 hour ago)</p>
                        <p className="text-sm text-gray-600">• Blog post published: "Tournament Tips" (3 hours ago)</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

