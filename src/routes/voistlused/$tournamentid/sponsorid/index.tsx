import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/voistlused/$tournamentid/sponsorid/')({
  component: RouteComponent,
})

const sponsors = [
  {
    name: "tabletennis11",
    logo: "/tabletennis11.jpg",
    description: "tabletennis11 on meie pikaajaline partner, kes toetab meie üritusi ja algatusi."
  },
]


function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Meie Sponsorid</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map((sponsor, index) => (
          <Card key={index} className="flex flex-col h-full">
            <CardHeader className="flex-grow">
              <div className="w-full h-32 relative mb-4">
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  className="rounded-md"
                />
              </div>
              <CardTitle className="text-lg font-semibold text-center">{sponsor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-center">{sponsor.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
