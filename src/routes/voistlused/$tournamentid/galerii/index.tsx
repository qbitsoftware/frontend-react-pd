import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Images } from '../../-components/images'

export const Route = createFileRoute('/voistlused/$tournamentid/galerii/')({
  component: RouteComponent,
})

const gameDays = [1, 2, 3, 4, 5, 6]

function RouteComponent() {

  const tournament_id = Route.useParams().tournamentid

  const [activeTab, setActiveTab] = React.useState("1")

  return (
      <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-10 md:mb-4 md:mt-10">
                  {gameDays.map((day) => (
                      <TabsTrigger
                          key={day}
                          value={day.toString()}
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm py-2 px-2 sm:px-4"
                      >
                          Päev {day}
                      </TabsTrigger>
                  ))}
              </TabsList>
              {gameDays.map((day) => (
                  <TabsContent key={day} value={day.toString()}>
                      <div>
                          <Images tournament_id={Number(tournament_id)} user={undefined} gameDay={String(day)} />
                      </div>
                  </TabsContent>
              ))}
          </Tabs>
      </>
  )
}
