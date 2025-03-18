import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { UserNew } from "@/types/types"
import { PlayerRankingChangeGraph } from "./rating-chart"
import { useTranslation } from "react-i18next";

export function PlayerProfileData(player: UserNew) {
  void player
  const { t } = useTranslation();
  
  return (
    <Tabs defaultValue="latest-matches" className="py-3 w-full bg-white rounded-lg">
      <TabsList className="pb-3 w-full grid grid-cols-3">
        <TabsTrigger 
          value="latest-matches" 
          className=""
        >
          {t('rating.player_modal.menus.latest_matches.title')}
        </TabsTrigger>
        <TabsTrigger 
          value="temp-placeholder"
          className=""
        >
          {t('rating.player_modal.menus.temp_placeholder.title')}
        </TabsTrigger>
        <TabsTrigger 
          value="rating-change"
          className=""
        >
          {t('rating.player_modal.menus.rating_change_graph.title')}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="latest-matches" className="px-6 py-4 text-stone-800">
        <div className="space-y-2">
          <div className="relative flex flex-col gap-1 items-start justify-center border-y p-1">
            <span className="absolute right-0">12.03.2025</span>
            <p className="flex flex-row gap-1">{player.first_name} {player.last_name}<span className='font-bold'>0</span></p>
            <p className="flex flex-row gap-1">Opponent<span className="font-bold">3</span></p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="temp-placeholder" className="px-6 py-4 text-stone-800">
        <div className="flex flex-col items-start gap-1">
          <p>Nationality: <strong>EE</strong></p>
          <p>Sex: <strong>MALE</strong></p>
          <p>YOB: <strong>1998</strong></p>
          <p>ELTL ID: <strong>12031</strong></p>
          <p>Rank: <strong>1</strong></p>

        </div>
      </TabsContent>
      
      <TabsContent value="rating-change" className="px-6 py-4 text-stone-800">
        {PlayerRankingChangeGraph()}
      </TabsContent>
    </Tabs>
  )
}