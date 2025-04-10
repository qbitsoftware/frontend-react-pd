import { UseGetTournamentMatches } from '@/queries/match'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import TournamentSchedule from './-components/tournament-schedule'
import { UseGetTournamentTables } from '@/queries/tables'
import { ErrorResponse } from "@/types/types"
import ErrorPage from '@/components/error'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/voistlused/$tournamentid/ajakava/')({
  errorComponent: () => <ErrorPage />,
  loader: async ({ context: { queryClient }, params }) => {
    try {
      const matchesData = await queryClient.ensureQueryData(
        UseGetTournamentMatches(Number(params.tournamentid)),
      )
      const tournamentTables = await queryClient.ensureQueryData(
        UseGetTournamentTables(Number(params.tournamentid))
      )

      return { matchesData, tournamentTables }

    } catch (error) {
      const err = error as ErrorResponse
      if (err.response?.status === 404) {
        return { matchesData: null, tournamentTables: null }
      }
      throw error
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { matchesData } = Route.useLoaderData()
  const [activeDay, setActiveDay] = useState<number>(0)
  const [activeClass, setActiveClass] = useState<string>("Kõik klassid")
  const { t } = useTranslation()

  return (
    <>
      {matchesData?.data && Array.isArray(matchesData.data) && matchesData.data.length > 0 ? (
        <div className="px-2 md:px-12 py-4 md:py-8">
          <h5 className="font-bold mb-4 md:mb-8 text-center md:text-left">{t('competitions.navbar.timetable')}</h5>
          <div className="pb-8">
            <TournamentSchedule
              matches={matchesData.data}
              activeDay={activeDay}
              setActiveDay={setActiveDay}
              activeClass={activeClass}
              setActiveClass={setActiveClass}
            />
          </div>
        </div>
      ) : (
        <div className="p-6 text-center rounded-sm">
          <p className="text-stone-500">{t("competitions.errors.no_schedule")}</p>
        </div>
      )}
    </>
  )
}