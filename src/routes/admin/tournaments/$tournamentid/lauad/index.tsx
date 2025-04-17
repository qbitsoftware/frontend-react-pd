import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UseGetFreeVenues } from '@/queries/venues'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { VenueComp } from './-components/table'
import { UseGetTournamentTablesQuery } from '@/queries/tables'

export const Route = createFileRoute('/admin/tournaments/$tournamentid/lauad/')(
    {
        component: RouteComponent,
    },
)

function RouteComponent() {
    const { tournamentid } = useParams({ strict: false })
    const { t } = useTranslation()
    const { data: tournamentTables, isLoading } = UseGetFreeVenues(Number(tournamentid), true)
    const { data: tournamentGroups } = UseGetTournamentTablesQuery(Number(tournamentid))

    if (isLoading) {
        return <div className="p-4">{t('news.loading', { defaultValue: 'Loading...' })}</div>
    }

    if (!tournamentTables?.data || tournamentTables.data.length === 0) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-500">{t('admin.tournaments.tables.no_tables')}</p>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('admin.tournaments.tables.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tournamentTables.data.map(table => (
                            <VenueComp
                                table={table}
                                tables_data={tournamentGroups?.data}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
