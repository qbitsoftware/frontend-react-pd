import { createFileRoute } from '@tanstack/react-router'
import { UseGetBracketQuery } from '@/queries/brackets'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BracketComponent from '@/routes/admin/tournaments/-components/bracket'
import Loader from '@/components/loader'
import { useTranslation } from 'react-i18next'
import { UseGetTournamentTableQuery } from '@/queries/tables'


export const Route = createFileRoute(
    '/admin/tournaments/$tournamentid/grupid/$groupid/tabelid/',
)({
    component: RouteComponent,


})

function RouteComponent() {
    const params = Route.useParams()

    const { data: bracketsData, error, refetch, isLoading } = UseGetBracketQuery(Number(params.tournamentid), Number(params.groupid))
    const { data: tournamentTableData } = UseGetTournamentTableQuery(Number(params.tournamentid), Number(params.groupid))

    const { t } = useTranslation()

    if (isLoading) {
        return (
            <div className='h-[50vh] flex items-center justify-center'>
                <Loader />
            </div>
        )
    } else if (!bracketsData || error || !tournamentTableData) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Card className="w-full md:max-w-3xl shadow-lg p-0">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-center text-red-600">
                            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                            {t("admin.tournaments.brackets.not_found")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-md text-center text-gray-700 mb-6">
                            {t("admin.tournaments.brackets.not_found_description")}
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button size="lg" onClick={() => refetch()}>
                            {t("admin.tournaments.brackets.refresh")}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

        )
    } else {
        return (
            <div className='h-[calc(87vh-9.5rem)]'>
                <BracketComponent bracket={bracketsData} tournament_table={tournamentTableData.data} />
            </div>
        )
    }
}
