import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { UserNew } from "@/types/types"
import { PlayerRankingChangeGraph } from "./rating-chart"
import { useTranslation } from "react-i18next";

// TODO: playeri andmete kuvamine Useri põhjal, info, eelmised pelad ja graafik lõpuni
export function PlayerProfileData(player: UserNew) {
  void player
  const { t } = useTranslation();
  return (
    <Accordion type="single" collapsible className="w-full bg-white rounded-lg ">
      <AccordionItem value="item-1" className="border-b border-gray-200">
        <AccordionTrigger className="py-4 px-6 text-lg font-semibold text-gray-800 hover:bg-gray-100">
          {t('rating.player_modal.menus.latest_matches.title')}
        </AccordionTrigger>
        <AccordionContent className="px-6 py-4 text-gray-700">
          <p> This player has not played any matches in the past 180 days.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="border-b border-gray-200">
        <AccordionTrigger className="py-4 px-6 text-lg font-semibold text-gray-800 hover:bg-gray-100">
          {t('rating.player_modal.menus.temp_placeholder.title')}
        </AccordionTrigger>
        <AccordionContent className="px-6 py-4 text-gray-700">
          <p>
            Yes. It comes with default styles that match the other components&apos;
            aesthetic.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3" className="border-b border-gray-200">
        <AccordionTrigger className="py-4 px-6 text-lg font-semibold text-gray-800 hover:bg-gray-100">
          {t('rating.player_modal.menus.rating_change_graph.title')}
        </AccordionTrigger>
        <AccordionContent className="px-6 py-4 text-gray-700">
          {PlayerRankingChangeGraph()}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
