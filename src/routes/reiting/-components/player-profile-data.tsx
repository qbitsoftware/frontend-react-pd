import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayerRankingChangeGraph } from "./rating-chart";
import { useTranslation } from "react-i18next";
import { Profile } from "@/types/types";
import { formatDateToNumber } from "@/lib/utils";
import { LastMatch } from "./last-matches";

interface PlayerProfileDataProps {
  profile: Profile;
}

export const PlayerProfileData = ({ profile }: PlayerProfileDataProps) => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="latest-matches" className="w-full min-h-64">
      <TabsList className="w-full grid grid-cols-3 bg-gray-50 p-1 rounded-lg">
        <TabsTrigger
          value="latest-matches"
          className="transition-all duration-200"
        >
          {t("rating.player_modal.menus.latest_matches.title")}
        </TabsTrigger>
        <TabsTrigger
          value="temp-placeholder"
          className="transition-all duration-200"
        >
          {t("rating.player_modal.menus.player_profile.title")}
        </TabsTrigger>
        <TabsTrigger
          value="rating-change"
          className="transition-all duration-200"
        >
          {t("rating.player_modal.menus.rating_change_graph.title")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="latest-matches" className="mt-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-lg text-gray-800 mb-4">
            Recent Match History
          </h3>
          <div className="space-y-2">
            {profile.matches && profile.matches.map((game, index) => (
              <LastMatch key={index} last_game={game} />
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="temp-placeholder" className="mt-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-lg text-gray-800 mb-4">
            Player Information
          </h3>

          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex items-center">
              <p className="w-32 text-gray-500">Nationality:</p>
              <p className="font-semibold flex items-center">
                {profile.user.foreigner === 0 ? (
                  <span className="text-lg">🇪🇪</span>
                ) : (
                  "Foreigner"
                )}
              </p>
            </div>

            <div className="flex items-center">
              <p className="w-32 text-gray-500">ELTL ID:</p>
              <p className="font-semibold">{profile.user.eltl_id}</p>
            </div>

            <div className="flex items-center">
              <p className="w-32 text-gray-500">Year of birth:</p>
              <p className="font-semibold">
                {profile.user.birth_date ? formatDateToNumber(profile.user.birth_date) : "----"}
              </p>
            </div>

            <div className="flex items-center">
              <p className="w-32 text-gray-500">Rating:</p>
              <p className="font-semibold text-gray-800">
                {profile.user.rate_order || "N/A"}
              </p>
            </div>

            <div className="flex items-center">
              <p className="w-32 text-gray-500">Sex:</p>
              <p className="font-semibold">
                {profile.user.sex === "M" ? "Male" : "Female"}
              </p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="rating-change" className="mt-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-lg text-gray-800 mb-4">
            Rating Progress
          </h3>
          <div className="h-64">
            <PlayerRankingChangeGraph stats={profile.rating_change} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};