import { createFileRoute } from '@tanstack/react-router'
import ErrorPage from '../../../components/error'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useTournament } from './-components/tournament-provider'
import Editor from '@/routes/admin/-components/yooptaeditor'

export const Route = createFileRoute('/voistlused/$tournamentid/')({
  errorComponent: ({ error, reset }) => {
    return <ErrorPage error={error} reset={reset} />
  },
  component: RouteComponent,
})

function RouteComponent() {
  const tournament = useTournament()

  return (
    <div className="max-w-[1440px] mx-auto h-[80%] overflow-y-auto flex flex-col">
      <div className='w-full h-full mt-[20px] lg:mt-[60px] shadow-md'>
        <Card className='w-full bg-gradient-to-br bg-secondary/40 shadow-lg'>
          <CardContent className="p-6 flex flex-col lg:flex-row gap-8">
            <img src='/test/turna-pilt.jpg' className='rounded-lg lg:max-w-[70%]' />
            <div className="flex flex-col gap-4">
              <div className="space-y-6">
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <MapPinIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Asukoht</span>
                    <span className="font-medium">{tournament.location}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Turniiri algus</span>
                    <span className="font-medium">{formatDate(tournament.start_date)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Turniiri algus</span>
                    <span className="font-medium">{formatDate(tournament.start_date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div>
          {tournament.information && tournament.information != "" ?
            <Editor value={JSON.parse(tournament.information)} setValue={undefined} readOnly={true} />
            : <div>Puudub</div>
          }
        </div>
      </div >
    </div >
  )
}