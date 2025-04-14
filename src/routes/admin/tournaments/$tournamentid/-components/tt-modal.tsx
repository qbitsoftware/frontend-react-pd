import { useToastNotification } from "@/components/toast-notification";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  UseGetChildMatchesQuery,
  UsePatchMatch,
  UsePatchMatchSwitch,
  UseStartMatch,
} from "@/queries/match";
import { GitCompareArrows, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MatchSets } from "./match-sets";
import Forfeit from "./forfeit";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Match, MatchWrapper, TableTennisExtraData } from "@/types/matches";
import { Player } from "@/types/players";
import { ProtocolDownloadButton } from "./download-protocol";

interface ProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchWrapper;
  tournament_id: number;
}

export const TableTennisProtocolModal: React.FC<ProtocolModalProps> = ({
  isOpen,
  onClose,
  match,
  tournament_id,
}) => {
  const toast = useToast();
  const { successToast, errorToast } = useToastNotification(toast);

  const { data: childMathes, isLoading } = UseGetChildMatchesQuery(
    tournament_id,
    match.match.tournament_table_id,
    match.match.id
  );
  const useStartMatchMutation = UseStartMatch(
    tournament_id,
    match.match.tournament_table_id,
    match.match.id
  );

  const [notes, setNotes] = useState<string>("");
  const [table_referee, setTableReferee] = useState<string>("");
  const [head_referee, setMainReferee] = useState<string>("");
  const [captainTeam1, setCaptainTeam1] = useState<string>("");
  const [captainTeam2, setCaptainTeam2] = useState<string>("");
  const [table, setTableNumber] = useState<string>("");
  const [isForfeitOpen, setIsForfeitOpen] = useState(false);
  const [forfeitMatch, setForfeitMatch] = useState<MatchWrapper | null>(null);

  const prevValuesRef = useRef({
    captainTeam1: match.match.extra_data.captain_a || "",
    captainTeam2: match.match.extra_data.captain_b || "",
    table_referee: match.match.extra_data.table_referee || "",
    head_referee: match.match.extra_data.head_referee || "",
    notes: match.match.extra_data.notes || "",
    table: match.match.extra_data.table || "",
  });

  const EMPTY_PLAYER: Player = {
    id: "",
    name: "",
    user_id: 0,
    first_name: "Mängija",
    last_name: "",
    sport_type: "",
    number: 0,
    rank: 0,
    sex: "",
    extra_data: {
      image_url: "",
      club: "",
      rate_points: 0,
      rate_order: 0,
      eltl_id: 0,
      class: "",
    },
    created_at: "",
    deleted_at: null,
    updated_at: "",
  };

  const createEmptyPlayers = (
    count: number,
    team_number: number,
    extraData: TableTennisExtraData
  ) => {
    const playerFields1: (keyof TableTennisExtraData)[] = [
      "player_a_id",
      "player_b_id",
      "player_c_id",
      "player_d_id",
      "player_e_id",
    ];
    const playerFields2: (keyof TableTennisExtraData)[] = [
      "player_x_id",
      "player_y_id",
      "player_z_id",
      "player_v_id",
      "player_w_id",
    ];

    return Array.from({ length: count }).map((_, index) => {
      let playerField;
      if (team_number == 1) {
        playerField = playerFields1[index];
      } else {
        playerField = playerFields2[index];
      }

      const playerId = extraData[playerField];

      const selectedPlayer = playerId
        ? (team_number === 1 ? match.p1.players : match.p2.players).find(
            (player) => player.id === playerId
          )
        : null;
      return (
        selectedPlayer || {
          ...EMPTY_PLAYER,
          last_name:
            team_number === 1
              ? String.fromCharCode(65 + index)
              : String.fromCharCode(88 + index),
        }
      );
    });
  };

  const [team1SelectedPlayers, setTeam1SelectedPlayers] = useState<Player[]>(
    []
  );
  const [team2SelectedPlayers, setTeam2SelectedPlayers] = useState<Player[]>(
    []
  );

  useEffect(() => {
    const me = match.match.extra_data;
    setTeam1SelectedPlayers(createEmptyPlayers(5, 1, match.match.extra_data));
    setTeam2SelectedPlayers(createEmptyPlayers(5, 2, match.match.extra_data));
    if (isOpen) {
      prevValuesRef.current.table_referee = me.table_referee || "";
      prevValuesRef.current.head_referee = me.head_referee || "";
      prevValuesRef.current.captainTeam1 = me.captain_a || "";
      prevValuesRef.current.captainTeam2 = me.captain_b || "";
      prevValuesRef.current.notes = me.notes || "";
      prevValuesRef.current.table = me.table || "";
      setTableReferee(me.table_referee || "");
      setMainReferee(me.head_referee || "");
      setCaptainTeam1(me.captain_a || "");
      setCaptainTeam2(me.captain_b || "");
      setNotes(me.notes || "");
      setTableNumber(me.table || "");
    }
  }, [isOpen, match.match.extra_data]);

  useEffect(() => {
    const hasChanges = {
      captain_a:
        captainTeam1 !== prevValuesRef.current.captainTeam1
          ? captainTeam1
          : undefined,
      captain_b:
        captainTeam2 !== prevValuesRef.current.captainTeam2
          ? captainTeam2
          : undefined,
      table_referee:
        table_referee !== prevValuesRef.current.table_referee
          ? table_referee
          : undefined,
      head_referee:
        head_referee !== prevValuesRef.current.head_referee
          ? head_referee
          : undefined,
      notes: notes !== prevValuesRef.current.notes ? notes : undefined,
      table: table !== prevValuesRef.current.table ? table : undefined,
    };

    const sendData = async (extra_data: TableTennisExtraData) => {
      await sendExtraData(extra_data);
    };

    if (Object.values(hasChanges).some((value) => value !== undefined)) {
      const handler = setTimeout(() => {
        const updatedExtraData: TableTennisExtraData = {
          notes: notes,
          captain_a: captainTeam1,
          captain_b: captainTeam2,
          table_referee,
          head_referee,
          table,
          parent_match_id: "",
          player_a_id: team1SelectedPlayers[0]?.id,
          player_b_id: team1SelectedPlayers[1]?.id,
          player_c_id: team1SelectedPlayers[2]?.id,
          player_d_id: team1SelectedPlayers[3]?.id,
          player_e_id: team1SelectedPlayers[4]?.id,
          player_x_id: team2SelectedPlayers[0]?.id,
          player_y_id: team2SelectedPlayers[1]?.id,
          player_z_id: team2SelectedPlayers[2]?.id,
          player_v_id: team2SelectedPlayers[3]?.id,
          player_w_id: team2SelectedPlayers[4]?.id,
          ...Object.fromEntries(
            Object.entries(hasChanges).filter(
              ([, value]) => value !== undefined
            )
          ),
        };

        sendData(updatedExtraData);

        prevValuesRef.current = {
          captainTeam1,
          captainTeam2,
          table_referee,
          head_referee,
          notes,
          table,
        };
      }, 250);

      return () => clearTimeout(handler);
    }
  }, [
    captainTeam1,
    captainTeam2,
    table_referee,
    head_referee,
    notes,
    table,
    match.match.extra_data,
  ]);

  const usePatchMatch = UsePatchMatch(
    tournament_id,
    match.match.tournament_table_id,
    match.match.id
  );

  const handleSubmit = async (match: Match) => {
    try {
      await usePatchMatch.mutateAsync(match);
      //THE ISSUE WHY ITS CLOSED IS ON THIS router.navigate - needs fixing
      // router.navigate({
      //   to: location.pathname,
      //   replace: true,
      // });
    } catch (error) {
      void error;
      errorToast("Something went wrong");
    }
  };

  const usePatchMatchSwitch = UsePatchMatchSwitch(
    tournament_id,
    match.match.tournament_table_id,
    match.match.id
  );

  const switchParticipants = async () => {
    const extra_data: TableTennisExtraData = {
      ...match.match.extra_data,
      table_referee,
      head_referee,
      notes,
      table,
      player_a_id: team1SelectedPlayers[0].id,
      player_b_id: team1SelectedPlayers[1].id,
      player_d_id: team1SelectedPlayers[3].id,
      player_e_id: team1SelectedPlayers[4].id,
      player_x_id: team2SelectedPlayers[0].id,
      player_y_id: team2SelectedPlayers[1].id,
      player_v_id: team2SelectedPlayers[3].id,
      player_w_id: team2SelectedPlayers[4].id,
    };
    match.match.extra_data = extra_data;
    try {
      await usePatchMatchSwitch.mutateAsync(match.match);
    } catch (error) {
      void error;
      errorToast("Something went wrong");
    }
  };

  const sendExtraData = async (extra_data: TableTennisExtraData) => {
    const sendMatch: Match = {
      id: match.match.id,
      tournament_table_id: match.match.tournament_table_id,
      type: match.match.type,
      round: match.match.round,
      p1_id: match.match.p1_id,
      p2_id: match.match.p2_id,
      winner_id: match.match.winner_id,
      order: match.match.order,
      sport_type: match.match.sport_type,
      location: match.match.location,
      start_date: match.match.start_date,
      bracket: match.match.bracket,
      forfeit: match.match.forfeit,
      state: match.match.state,
      extra_data,
      topCoord: 0,
      table_type: match.match.table_type,
    };
    await handleSubmit(sendMatch);
  };

  const handleMatchStart = async () => {
    try {
      await useStartMatchMutation.mutateAsync();
      successToast("Match started");
    } catch (error) {
      void error;
      errorToast("Something went wrong");
    }
  };

  const handlePlayerChange = async (
    team: number,
    index: number,
    playerId: string
  ) => {
    const selectedPlayer = (
      team === 1 ? match.p1.players : match.p2.players
    ).find((player) => player.id === playerId);
    if (!selectedPlayer) return;

    let extra_data: TableTennisExtraData = { ...match.match.extra_data };

    const newTeam1SelectedPlayers = [...team1SelectedPlayers];
    const newTeam2SelectedPlayers = [...team2SelectedPlayers];

    if (team == 1) {
      if (index <= 2) {
        const oldIndex = newTeam1SelectedPlayers.findIndex(
          (player) => player.id === playerId
        );
        if (oldIndex !== -1) {
          const resetPlayer = {
            ...EMPTY_PLAYER,
            last_name: String.fromCharCode(65 + oldIndex),
          };
          newTeam1SelectedPlayers[oldIndex] = resetPlayer;
        }
      } else {
        const oldIndex = newTeam1SelectedPlayers
          .slice(3)
          .findIndex((player) => player.id === playerId);
        if (oldIndex !== -1) {
          const resetPlayer = {
            ...EMPTY_PLAYER,
            last_name: String.fromCharCode(65 + oldIndex + 3),
          };
          newTeam1SelectedPlayers[oldIndex + 3] = resetPlayer;
        }
      }
      newTeam1SelectedPlayers[index] = selectedPlayer;
      setTeam1SelectedPlayers(newTeam1SelectedPlayers);
    } else if (team == 2) {
      if (index <= 2) {
        const oldIndex = newTeam2SelectedPlayers.findIndex(
          (player) => player.id === playerId
        );
        if (oldIndex !== -1) {
          const resetPlayer = {
            ...EMPTY_PLAYER,
            last_name: String.fromCharCode(83 + oldIndex),
          };
          newTeam2SelectedPlayers[oldIndex] = resetPlayer;
        }
      } else {
        const oldIndex = newTeam2SelectedPlayers
          .slice(3)
          .findIndex((player) => player.id === playerId);
        if (oldIndex !== -1) {
          const resetPlayer = {
            ...EMPTY_PLAYER,
            last_name: String.fromCharCode(83 + oldIndex + 3),
          };
          newTeam2SelectedPlayers[oldIndex + 3] = resetPlayer;
        }
      }
      newTeam2SelectedPlayers[index] = selectedPlayer;
      setTeam2SelectedPlayers(newTeam2SelectedPlayers);
    }

    extra_data = {
      ...extra_data,
      table: match.match.extra_data.table,
      parent_match_id: "",
      player_a_id: newTeam1SelectedPlayers[0].id,
      player_b_id: newTeam1SelectedPlayers[1].id,
      player_c_id: newTeam1SelectedPlayers[2].id,
      player_d_id: newTeam1SelectedPlayers[3].id,
      player_e_id: newTeam1SelectedPlayers[4].id,
      player_x_id: newTeam2SelectedPlayers[0].id,
      player_y_id: newTeam2SelectedPlayers[1].id,
      player_z_id: newTeam2SelectedPlayers[2].id,
      player_v_id: newTeam2SelectedPlayers[3].id,
      player_w_id: newTeam2SelectedPlayers[4].id,
    };

    const sendMatch: Match = {
      id: match.match.id,
      tournament_table_id: match.match.tournament_table_id,
      type: match.match.type,
      round: match.match.round,
      p1_id: match.match.p1_id,
      p2_id: match.match.p2_id,
      winner_id: match.match.winner_id,
      order: match.match.order,
      sport_type: match.match.sport_type,
      location: match.match.location,
      state: match.match.state,
      start_date: match.match.start_date,
      bracket: match.match.bracket,
      forfeit: match.match.forfeit,
      extra_data,
      topCoord: 0,
      table_type: match.match.table_type,
    };

    await handleSubmit(sendMatch);
  };

  const handleForfeitMatch = (match: MatchWrapper) => {
    setForfeitMatch(match);
    setIsForfeitOpen(true);
  };

  const handleForfeitMatchClose = () => {
    setIsForfeitOpen(false);
    setForfeitMatch(null);
  };

  const handleFinish = async () => {
    try {
      await usePatchMatch.mutateAsync({
        ...match.match,
        winner_id: "finished",
        extra_data: {
          ...match.match.extra_data,
          player_a_id: team1SelectedPlayers[0].id,
          player_b_id: team1SelectedPlayers[1].id,
          player_c_id: team1SelectedPlayers[2].id,
          player_d_id: team1SelectedPlayers[3].id,
          player_e_id: team1SelectedPlayers[4].id,
          player_x_id: team2SelectedPlayers[0].id,
          player_y_id: team2SelectedPlayers[1].id,
          player_z_id: team2SelectedPlayers[2].id,
          player_v_id: team2SelectedPlayers[3].id,
          player_w_id: team2SelectedPlayers[4].id,
          table_referee: table_referee,
          head_referee: head_referee,
          captain_a: captainTeam1,
          captain_b: captainTeam2,
          notes,
          table,
        },
      });
      onClose();
      successToast("Mäng edukalt lõpetatud");
    } catch (error) {
      void error;
      errorToast("Something went wrong");
    }
  };

  // Helper function to get available players and filtering them
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

  // Player selection component for reuse
  const PlayerSelector = ({
    team,
    index,
    label,
  }: {
    team: number;
    index: number;
    label: string;
  }) => {
    const players = getAvailablePlayers(team);
    const selectedValue =
      team === 1
        ? team1SelectedPlayers[index]?.id?.toString()
        : team2SelectedPlayers[index]?.id?.toString();

    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium w-8">{label}</span>
        <Select
          value={selectedValue}
          onValueChange={(value) => handlePlayerChange(team, index, value)}
        >
          <SelectTrigger className="flex-1 h-8 text-sm">
            <SelectValue placeholder={`Vali mängija`} />
          </SelectTrigger>
          <SelectContent>
            {players.length > 0 ? (
              players.map((player) => (
                <SelectItem
                  key={player.id}
                  value={player.id.toString()}
                  className="text-sm"
                >
                  {player.first_name + " " + player.last_name || ""}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="no-players" className="text-sm">
                No players available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    );
  };

  // Match order mapping
  const getMatchOrderLabel = (order: number) => {
    switch (order) {
      case 1:
        return "A-Y";
      case 2:
        return "B-X";
      case 3:
        return "C-Z";
      case 4:
        return "DE-VW";
      case 5:
        return "A-X";
      case 6:
        return "C-Y";
      case 7:
        return "B-Z";
      default:
        return `${order}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100vh-2rem)] max-w-[90vw] md:max-w-[80vw] overflow-hidden flex flex-col p-0">
        <DialogHeader className="bg-background p-3 md:px-4 border-b sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-medium flex items-center gap-2">
              <span>Protokoll:</span>
              <span className="font-bold">{match.p1.name}</span>
              <span>vs</span>
              <span className="font-bold">{match.p2.name}</span>
              <ProtocolDownloadButton
                tournament_id={tournament_id}
                group_id={match.match.tournament_table_id}
                match_id={match.match.id}
              />
            </DialogTitle>
            <div className="flex items-center gap-2">
              <X className="cursor-pointer h-5 w-5" onClick={onClose} />
            </div>
          </div>
        </DialogHeader>

        <Tabs
          defaultValue="players"
          className="flex-grow flex flex-col min-h-0"
          // onValueChange={setActiveTab}
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

          <div className="flex-grow overflow-hidden flex flex-col min-h-0">
            <TabsContent
              value="players"
              className="flex-grow p-3 md:p-4 overflow-auto m-0"
            >
              <div className="flex items-center justify-center w-full mb-1">
                <Button
                  onClick={switchParticipants}
                  variant="outline"
                  size="sm"
                  className=""
                >
                  <GitCompareArrows size={16} />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((team) => (
                  <div
                    key={team}
                    className="space-y-3 bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-sm">
                        {team === 1 ? match.p1.name : match.p2.name}
                      </h5>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">Kapten:</span>
                        <Input
                          type="text"
                          value={team === 1 ? captainTeam1 : captainTeam2}
                          onChange={(e) =>
                            team === 1
                              ? setCaptainTeam1(e.target.value)
                              : setCaptainTeam2(e.target.value)
                          }
                          placeholder={team === 1 ? "Kapten ABC" : "Kapten XYZ"}
                          className="h-7 text-xs w-28"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-500 pl-1">
                        Üksikmäng
                      </div>
                      <div className="space-y-1.5">
                        {[0, 1, 2].map((index) => (
                          <PlayerSelector
                            key={index}
                            team={team}
                            index={index}
                            label={
                              team === 1
                                ? String.fromCharCode(65 + index)
                                : String.fromCharCode(88 + index)
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-500 pl-1">
                        Paarismäng
                      </div>
                      <div className="space-y-1.5">
                        {[3, 4].map((index) => (
                          <PlayerSelector
                            key={index}
                            team={team}
                            index={index}
                            label={
                              team === 1
                                ? String.fromCharCode(65 + index)
                                : String.fromCharCode(
                                    team === 1 ? 65 + index : 80 + index
                                  )
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
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
                  onChange={(e) => setNotes(e.target.value)}
                  value={notes}
                  className="w-full min-h-[60px] text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent
              value="scores"
              className="flex-grow p-0 overflow-auto m-0 flex flex-col min-h-0"
            >
              <ScrollArea className="flex-grow overflow-auto">
                <div className="p-3 md:p-4">
                  {/* Team Score Summary */}
                  <div className="flex justify-around items-center mb-4 px-1">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium">
                        {match.p1.name}
                      </span>
                      <span className="text-2xl font-bold">
                        {!isLoading && childMathes && childMathes.data
                          ? childMathes.data.reduce(
                              (total, match) =>
                                total +
                                (match.match.winner_id === match.p1.id &&
                                match.match.winner_id != ""
                                  ? 1
                                  : 0),
                              0
                            )
                          : 0}
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-xl font-bold">VS</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium">
                        {match.p2.name}
                      </span>
                      <span className="text-2xl font-bold">
                        {!isLoading && childMathes && childMathes.data
                          ? childMathes.data.reduce(
                              (total, match) =>
                                total +
                                (match.match.winner_id === match.p2.id &&
                                match.match.winner_id != ""
                                  ? 1
                                  : 0),
                              0
                            )
                          : 0}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-auto border rounded-lg shadow-sm">
                    <Table
                      className="w-full overflow-auto"
                      style={{ minWidth: "500px" }}
                    >
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="text-xs font-medium p-2 text-left w-16">
                            Mäng
                          </TableHead>
                          <TableHead className="text-xs font-medium p-2 text-center w-12">
                            S1
                          </TableHead>
                          <TableHead className="text-xs font-medium p-2 text-center w-12">
                            S2
                          </TableHead>
                          <TableHead className="text-xs font-medium p-2 text-center w-12">
                            S3
                          </TableHead>
                          <TableHead className="text-xs font-medium p-2 text-center w-12">
                            S4
                          </TableHead>
                          <TableHead className="text-xs font-medium p-2 text-center w-12">
                            S5
                          </TableHead>
                          <TableHead className="text-xs font-medium p-2 text-center w-24">
                            Tegevused
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {!isLoading &&
                          childMathes &&
                          childMathes.data &&
                          childMathes.data.map((player_match) => (
                            <TableRow
                              key={player_match.match.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="text-xs font-medium p-2">
                                {getMatchOrderLabel(player_match.match.order)}
                              </TableCell>
                              <MatchSets
                                key={player_match.match.id}
                                match={player_match}
                              />
                              <TableCell className="p-2">
                                <Button
                                  onClick={() =>
                                    handleForfeitMatch(player_match)
                                  }
                                  className="text-xs h-6 px-2 w-full"
                                  size="sm"
                                  variant="outline"
                                >
                                  Loobumine
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  {match.match.winner_id && (
                    <div className="flex justify-center items-center gap-2 my-4 bg-green-50 p-2 rounded-md">
                      <span className="font-semibold text-sm">Võitja:</span>
                      <span className="font-bold text-sm">
                        {match.match.winner_id === match.p1.id
                          ? match.p1.name
                          : match.p2.name}
                      </span>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>

        <div className="bg-gray-100 p-3 border-t flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">Lauakohtunik</label>
              <Input
                className="h-8 text-sm"
                value={table_referee}
                placeholder="Lauakohtunik"
                onChange={(e) => setTableReferee(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">Peakohtunik</label>
              <Input
                className="h-8 text-sm"
                value={head_referee}
                placeholder="Peakohtunik"
                onChange={(e) => setMainReferee(e.target.value)}
              />
            </div>
          </div>

          <Button
            disabled={match.match.winner_id !== ""}
            onClick={handleFinish}
            className="w-full h-9 font-medium"
            variant={match.match.winner_id !== "" ? "outline" : "default"}
          >
            {match.match.winner_id !== "" ? "Mäng lõpetatud" : "Lõpeta Mängud"}
          </Button>
        </div>

        {forfeitMatch && (
          <Forfeit
            match={forfeitMatch}
            isOpen={isForfeitOpen}
            onClose={handleForfeitMatchClose}
            tournament_id={tournament_id}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
