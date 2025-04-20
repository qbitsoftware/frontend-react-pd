import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTimeBracket } from '@/lib/utils'
import { TournamentTable } from '@/types/groups'
import { Venue } from '@/types/venues'
import { Link } from '@tanstack/react-router'
import { Check, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface TableProps {
    table: Venue
    tables_data: TournamentTable[] | null | undefined
}

export const VenueComp = ({ table, tables_data }: TableProps) => {
    const { t } = useTranslation()
    const group = tables_data && table.match?.match?.tournament_table_id
        ? tables_data.find((group) => group.id === table.match?.match?.tournament_table_id)
        : undefined

    const isFree = !table.match_id || table.match_id === ""

    const cardContent = () => {
        return (
            <>
                {
                    table.match &&
                    <CardContent className="">
                            <div className="flex items-center text-gray-700">
                                <p><span className="font-medium">{table.match.p1.name || 'TBD'}</span> vs <span className="font-medium">{table.match.p2.name || 'TBD'}</span></p>
                            </div>

                            {table.match.match.start_date && (
                                <div className="flex items-center text-gray-700">
                                    <p>{formatDateTimeBracket(table.match.match.start_date)}</p>
                                </div>
                            )}

                            {table.match.match.tournament_table_id && (
                                <div className="flex items-start mt-2">
                                    <Badge variant="outline" className="mr-2">
                                        {t('admin.tournaments.create_tournament.class')}: {group && group.class}
                                    </Badge>
                                </div>
                            )}
                    </CardContent>
                }
            </>
        )
    }

    return (
        <Card className={`overflow-hidden transition-all hover:shadow-md border-2 ${isFree ? 'border-green-200' : 'border-red-200/50'}`}>
            
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-medium">{table.name}</CardTitle>
                    <Badge variant={isFree ? "outline" : "destructive"} className="ml-2">
                        {isFree ?
                            <><Check className="h-3 w-3 mr-1" /> {t('admin.tournaments.tables.free')}</> :
                            <><X className="h-3 w-3 mr-1" /> {t('admin.tournaments.tables.taken')}</>
                        }
                    </Badge>
                </div>
            </CardHeader>

            {!isFree && (
                <>
                    {group ?
                        <Link to={`/admin/tournaments/${table.tournament_id}/grupid/${group.id}/mangud`} className='cursor-pointer'>
                            {cardContent()}
                        </Link>
                        :
                        <>
                            {cardContent()}
                        </>
                    }
                </>

            )}

            {isFree && (
                <CardFooter className="pt-2 text-sm text-gray-500 italic">
                    {t('admin.tournaments.tables.empty_placeholder')}
                </CardFooter>
            )}
        </Card>
    )


}

export default VenueComp