import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"
import { UseGetTournamentMatches } from "@/queries/match";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Tournament } from "@/types/tournaments";
import { MatchWrapper } from "@/types/matches";

interface Props {
  tournaments: Tournament[] | null
}

const LatestMatchWidget = ({ tournaments }: Props) => {
  const [allMatches, setAllMatches] = useState<MatchWrapper[]>([])
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()


  const { t } = useTranslation()

  useEffect(() => {
    const fetchAllMatches = async () => {
      if (!tournaments || tournaments.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const matchPromises = tournaments.map(tournament =>
          queryClient.ensureQueryData(UseGetTournamentMatches(tournament.id))
        );
        const responses = await Promise.all(matchPromises);
        const tournamentMatchesArrays = responses
          .filter(response => response.data && Array.isArray(response.data))
          .map(response => response.data);



        const combinedMatches = tournamentMatchesArrays.flat();

        const sortedMatches = combinedMatches.sort((a, b) => {
          if (a && b) {
            return new Date(b.match.start_date).getTime() - new Date(a.match.start_date).getTime()
          } else {
            return -1
          }
        }
        );

        if (sortedMatches && sortedMatches.length > 0) {
          setAllMatches(sortedMatches as MatchWrapper[]);
        }
      } catch (error) {
        console.error("Error fetching tournament matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMatches();
  }, [tournaments]);


  if (!tournaments) {
    return (
      <>

        <div className="flex items-center justify-center p-6 bg-gray-100 rounded-sm">
          <p className="text-lg text-gray-600">{t('homepage.latest_matches.error')}</p>
        </div>


      </>
    )
  }

  if (tournaments.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-100 rounded-sm">
        <p className="text-lg text-gray-600">{t('homepage.latest_matches.no_matches')}</p>
      </div>
    )
  }
  if (loading) {
    return (
      <div className="px-2">
        {t("protocol.loading")}
      </div>
    )
  }

  if (allMatches.length === 0) {
    return (
      <div className="px-2">
        {t('homepage.latest_matches.no_matches')}
      </div>
    )
  }


  return (
    <div className="relative">
      <ul className="pb-6 px-2 space-y-4 h-[43vh] overflow-y-scroll">
        {allMatches.map((match, index) => {
          let p1Sets = 0
          let p2Sets = 0
          if (match.match.extra_data && match.match.extra_data.score) {
            p1Sets = match.match.extra_data.score.reduce((count, set) =>
              count + (set.p1_score > set.p2_score ? 1 : 0), 0) || 0;
            p2Sets = match.match.extra_data.score.reduce((count, set) =>
              count + (set.p2_score > set.p1_score ? 1 : 0), 0) || 0;
          }

          const isP1Winner = p1Sets > p2Sets
          const isP2Winner = p2Sets > p1Sets


          return (
            <li key={index} className="p-2 space-y-2 border bg-white/40 rounded-md ">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{formatDate(match.match.start_date)}</span>
                <Badge variant="default" className="bg-zinc-700 font-normal">
                  {match.class}
                </Badge>
              </div>
              <Separator className="bg-[#EBEFF5]" />

              <div className="flex items-center justify-between">
                {/* First player */}
                <div className="flex-1 text-right pr-4">
                  <p className="">{match.p1.name}</p>
                </div>

                {/* Scores */}
                <div className="flex items-center gap-2 px-3">
                  <span className={`font-medium text-lg w-8 h-8 flex items-center justify-center ${isP1Winner ? "bg-[#EBEFF5]" : "bg-slate-50"} rounded`}>{p1Sets}</span>
                  <span className="text-slate-400">-</span>
                  <span className={`font-medium text-lg w-8 h-8 flex items-center justify-center ${isP2Winner ? "bg-[#EBEFF5]" : "bg-slate-50"} rounded`}>{p2Sets}</span>
                </div>

                {/* Second player */}
                <div className="flex-1 pl-4">
                  <span className="">{match.p2.name}</span>
                </div>
              </div>

            </li>
          )
        })}

      </ul>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#ececec]/50 to-transparent pointer-events-none"></div>

    </div>
  )

}

export default LatestMatchWidget
