import { UseGetTournamentMatches } from '@/queries/match'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import TournamentSchedule from './-components/tournament-schedule'
import { UseGetTournamentTables } from '@/queries/tables'
import ErrorPage from '@/components/error'
import { useTranslation } from 'react-i18next'
import { ErrorResponse } from '@/types/errors'
import ITTFMatchComponent from './-components/new-match-comp'
import { Tabs, TabsTrigger, TabsContent, TabsList } from '@/components/ui/tabs'
import { MatchWrapper } from '@/types/matches'
import { filterMatchesByGameday, generateTimeSlotsForGameday, getUniqueClasses, getUniqueGamedays, getUniqueMatches, getUniqueTables } from './-components/schedule-utils'
import { Filters } from './-components/filters'

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
  const { matchesData, tournamentTables } = Route.useLoaderData()
  const [activeDay, setActiveDay] = useState<number>(0)
  const [activeClass, setActiveClass] = useState<string>("all")
  const { t } = useTranslation()

  const getMatchTTTable = (match: MatchWrapper) => {
    if (tournamentTables && tournamentTables.data && tournamentTables.data.length > 0) {
      const table = tournamentTables.data.find((table) => {
        return table.id == match.match.tournament_table_id
      })
      return table
    }
    return null
  }

  if (!matchesData || !matchesData.data) {
    return <div className="p-6 text-center rounded-sm">
      <p className="text-stone-500">{t("competitions.errors.no_groups")}</p>
    </div>
  }

  const safeMatches = Array.isArray(matchesData.data) ? getUniqueMatches(matchesData.data) : [];
  let classFilteredMatches = safeMatches;
  if (activeClass !== 'all') {
    classFilteredMatches = safeMatches.filter(
      match => match.class === activeClass
    )
  }

  const uniqueGamedays = getUniqueGamedays(classFilteredMatches);
  const [searchTerm, setSearchTerm] = useState("");
  const safeDayIndex = activeDay >= 0 && activeDay < uniqueGamedays.length ? activeDay : 0;
  let filteredMatches = filterMatchesByGameday(classFilteredMatches, uniqueGamedays[safeDayIndex]);

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredMatches = filteredMatches.filter(match =>
      match.p1?.name?.toLowerCase().includes(term) ||
      match.p2?.name?.toLowerCase().includes(term)
    );
  }

  const uniqueClasses = getUniqueClasses(safeMatches);
  const timeSlots = generateTimeSlotsForGameday(filteredMatches);
  const tables = getUniqueTables(filteredMatches);
  const initialSetupDone = useRef(false);

  useEffect(() => {
    if (initialSetupDone.current) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let upcomingDayIndex = -1;

    const lookAheadPeriod = 7;
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + lookAheadPeriod);

    const gameDayDates = uniqueGamedays.map(day => {
      const date = new Date(day);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    for (let i = 0; i < gameDayDates.length; i++) {
      const gameDate = gameDayDates[i];

      if (gameDate.getTime() === today.getTime()) continue;

      if (gameDate > today && gameDate <= maxDate) {
        upcomingDayIndex = i;
        break;
      }
    }

    if (upcomingDayIndex === -1) {
      for (let i = 0; i < gameDayDates.length; i++) {
        const gameDate = gameDayDates[i];
        if (gameDate > today) {
          upcomingDayIndex = i;
          break;
        }
      }
    }

    if (upcomingDayIndex === -1) {
      upcomingDayIndex = 0;
    }

    setActiveDay(upcomingDayIndex);
    initialSetupDone.current = true;
  }, [uniqueGamedays, setActiveDay]);

  return (
    <>
      {matchesData?.data && Array.isArray(matchesData.data) && matchesData.data.length > 0 ? (
        <>
          <Tabs defaultValue='matches'>
            <TabsList className='flex justify-center py-8 gap-1'>
              <TabsTrigger value="matches" className="data-[state=active]:bg-primary">
                {t('competitions.timetable.matches')}
              </TabsTrigger>
              <TabsTrigger value="timetable" className='data-[state=active]:bg-primary'>
                {t('competitions.timetable.timetable')}
              </TabsTrigger>
            </TabsList>
            <Filters gamedays={uniqueGamedays} activeClass={activeClass} activeDay={activeDay} setActiveDay={setActiveDay} totalDays={uniqueGamedays.length || 1} classes={uniqueClasses} setActiveClass={setActiveClass} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <TabsContent value='matches'>
              <div className='flex justify-center'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 md:gap-y-12 gap-x-4 my-8 max-h-[75vh] overflow-y-scroll'>
                  {/* First render matches that are associated with round robin tables */}
                  {matchesData?.data && Array.isArray(matchesData.data) && matchesData.data.filter(match => {
                    const table = getMatchTTTable(match);
                    return table && table.type === "round_robin";
                  }).map((match, key) => {
                    return (
                      <div key={`round-robin-${key}`} className='px-2 py-6'>
                        <ITTFMatchComponent match={match} table_data={getMatchTTTable(match)} />
                      </div>
                    );
                  })}

                  {/* Then render the filtered matches for non-round robin tables */}
                  {filteredMatches.filter(match => {
                    const table = getMatchTTTable(match);
                    return !table || table.type !== "round_robin";
                  }).map((match, key) => {
                    return (
                      <div key={`filtered-${key}`} className='px-2 py-6'>
                        <ITTFMatchComponent match={match} table_data={getMatchTTTable(match)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="timetable">
              <div className="px-2 md:px-12 py-4 md:py-8">
                <h5 className="font-bold mb-4 md:mb-8 text-center md:text-left">{t('competitions.navbar.timetable')}</h5>
                <div className="pb-8">
                  <TournamentSchedule
                    matches={filteredMatches}
                    activeDay={activeDay}
                    timeSlots={timeSlots}
                    tables={tables}
                    uniqueGamedays={uniqueGamedays}
                    safeDayIndex={safeDayIndex}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="p-6 text-center rounded-sm">
          <p className="text-stone-500">{t("competitions.errors.no_schedule")}</p>
        </div>
      )}
    </>
  )
}