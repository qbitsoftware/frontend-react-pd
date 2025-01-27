import { createFileRoute } from '@tanstack/react-router'
import ErrorPage from '../../../components/error'
import { Card,CardContent } from '@/components/ui/card'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useTournament } from './-components/tournament-provider'

export const Route = createFileRoute('/voistlused/$tournamentid/')({
  errorComponent: ({ error, reset }) => {
    return <ErrorPage error={error} reset={reset} />
  },
  component: RouteComponent,
})

function RouteComponent() {
  const tournament = useTournament()

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] h-full mx-auto pb-[60px]">
      <div className='w-full h-full mt-[60px] shadow-md '>
        <Card className='w-full bg-gradient-to-br bg-secondary/40 shadow-lg'>
          <CardContent className="p-6 flex flex-col lg:flex-row gap-8">
            <img src='/test/turna-pilt.jpg' className='rounded-lg' />
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
        <div className="space-y-8 py-8 px-6">
          {tournament.information.fields.map((field, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-2xl font-semibold">{field.title}</h3>
              <p className="whitespace-pre-line leading-relaxed">
                {field.information}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}