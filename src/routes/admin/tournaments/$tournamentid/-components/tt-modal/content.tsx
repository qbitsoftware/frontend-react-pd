import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamPlayers from "./team";
import { Button } from "@/components/ui/button";
import { GitCompareArrowsIcon } from "lucide-react";
import { useProtocolModal } from "@/providers/protocolProvider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Scores from "./scores";
import Forfeit from "./forfeit";

export function Content() {

  const {
    player_count,
    match,
    notes,
    headReferee,
    tableReferee,
    forfeitMatch,
    handleSwitchParticipants,
    handleMatchStart,
    handleMatchFinish,
    handleTableRefereeChange,
    handleNotesChange,
    handleHeadRefereeChange
  } = useProtocolModal()

  const getAvailablePlayers = (teamNumber: number) => {
    const playersArray =
      teamNumber === 1 ? match.p1?.players : match.p2?.players;

    if (
      !playersArray ||
      !Array.isArray(playersArray) ||
      playersArray.length === 0
    ) {
      return [];
    }

    return playersArray.filter(
      (player) => player && player.id && (player.first_name || player.last_name)
    );
  };

  return (
    <div>
      <Tabs
        defaultValue="players"
        className="flex-grow flex flex-col min-h-0"
      >
        <TabsList className="mx-auto my-2 space-x-1 p-1 bg-stone-200/40 rounded-lg w-auto">
          <TabsTrigger
            value="players"
            className="py-2 px-4 rounded-md data-[state=active]:bg-stone-800 data-[state=active]:shadow-sm flex items-center gap-1"
          >
            <span>Mängijad</span>
          </TabsTrigger>
          <TabsTrigger
            value="scores"
            className="py-2 px-4 rounded-md data-[state=active]:bg-stone-800 data-[state=active]:shadow-sm flex items-center gap-1"
          >
            <span>Skoorid</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="players"
          className="flex-grow p-3 md:p-4 overflow-auto m-0"
        >
          <div className="flex items-center justify-center w-full mb-1">
            <Button
              onClick={handleSwitchParticipants}
              variant="outline"
              size="sm"
              className=""
            >
              <GitCompareArrowsIcon size={16} />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TeamPlayers key={1} team={1} playerCount={player_count} players={getAvailablePlayers(1)} />
            <TeamPlayers key={2} team={2} playerCount={player_count} players={getAvailablePlayers(2)} />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <h6 className="font-semibold text-sm">Märkmed</h6>
              <Button
                onClick={handleMatchStart}
                size="sm"
                className="h-8 px-3 text-xs"
              >
                Alusta mängu
              </Button>
            </div>
            <Textarea
              placeholder="Märkmed"
              onChange={(e) => handleNotesChange(e.target.value)}
              value={notes}
              className="w-full min-h-[60px] text-sm mt-4"
            />
          </div>
        </TabsContent>
        {forfeitMatch && (
          <Forfeit match={forfeitMatch} />
        )}
        <TabsContent value="scores" className="flex-grow p-0 overflow-auto m-0 flex flex-col min-h-0">
          <Scores />
        </TabsContent>
      </Tabs>
      <div className="bg-gray-100 p-3 border-t flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Lauakohtunik</label>
            <Input
              className="h-8 text-sm"
              value={tableReferee}
              placeholder="Lauakohtunik"
              onChange={(e) => handleTableRefereeChange(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Peakohtunik</label>
            <Input
              className="h-8 text-sm"
              value={headReferee}
              placeholder="Peakohtunik"
              onChange={(e) => handleHeadRefereeChange(e.target.value)}
            />
          </div>
        </div>
        <Button
          disabled={match.match.winner_id !== ""}
          onClick={handleMatchFinish}
          className="w-full h-9 font-medium"
          variant={match.match.winner_id !== "" ? "outline" : "default"}
        >
          {match.match.winner_id !== "" ? "Mäng lõpetatud" : "Lõpeta Mängud"}
        </Button>
      </div>
    </div>
  )
}
