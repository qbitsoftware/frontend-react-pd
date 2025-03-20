import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayerRankingChangeGraph } from "./rating-chart";
import { useTranslation } from "react-i18next";
import { Profile } from "@/types/types";

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
            <div className="flex items-center justify-between border-l-2 border-gray-300 px-3 py-2 bg-white">
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500">08.03</span>
                <span className="text-sm">
                  {profile.user.first_name} {profile.user.last_name}
                </span>
                <span className="font-bold text-sm">3</span>
                <span className="text-xs">:</span>
                <span className="font-bold text-sm">1</span>
                <span className="text-sm">Another Player</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Tournament name</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-l-2 border-gray-300 px-3 py-2 bg-white">
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500">05.03</span>
                <span className="text-sm">
                  {profile.user.first_name} {profile.user.last_name}
                </span>
                <span className="font-bold text-sm">0</span>
                <span className="text-xs">:</span>
                <span className="font-bold text-sm">3</span>
                <span className="text-sm">Opponent Name</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Local Championship</span>
              </div>
            </div>
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
                {profile.user.birth_date ? profile.user.birth_date : "----"}
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
            <PlayerRankingChangeGraph />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};