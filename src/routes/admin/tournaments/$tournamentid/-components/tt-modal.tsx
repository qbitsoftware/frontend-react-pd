import { useToastNotification } from "@/components/toast-notification";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
  UseStartMatch,
} from "@/queries/match";
import {
  Match,
  MatchWrapper,
  Player,
  TableTennisExtraData,
} from "@/types/types";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MatchSets } from "./match-sets";
import Forfeit from "./forfeit";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"

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
  const router = useRouter();

  const { data: childMathes, isLoading } = UseGetChildMatchesQuery(
    tournament_id,
    match.match.tournament_table_id,
    match.match.id,
  );
  const useStartMatchMutation = UseStartMatch(
    tournament_id,
    match.match.tournament_table_id,
    match.match.id,
  );

  const [notes, setNotes] = useState<string>("");
  const [table_referee, setTableReferee] = useState<string>("");
  const [head_referee, setMainReferee] = useState<string>("");
  const [captainTeam1, setCaptainTeam1] = useState<string>("");
  const [captainTeam2, setCaptainTeam2] = useState<string>("");
  const [table, setTableNumber] = useState<number>(0);
  const [isForfeitOpen, setIsForfeitOpen] = useState(false);
  const [forfeitMatch, setForfeitMatch] = useState<MatchWrapper | null>(null);
  const [_, setActiveTab] = useState<string>("players")

  const prevValuesRef = useRef({
    captainTeam1: match.match.extra_data.captain_a || "",
    captainTeam2: match.match.extra_data.captain_b || "",
    table_referee: match.match.extra_data.table_referee || "",
    head_referee: match.match.extra_data.head_referee || "",
    notes: match.match.extra_data.notes || "",
    table: match.match.extra_data.table || 0,
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
    extraData: TableTennisExtraData,
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
          (player) => player.id === playerId,
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
    [],
  );
  const [team2SelectedPlayers, setTeam2SelectedPlayers] = useState<Player[]>(
    [],
  );

  useEffect(() => {
    console.log("Useffect firsst one");
    const me = match.match.extra_data;
    setTeam1SelectedPlayers(createEmptyPlayers(5, 1, match.match.extra_data));
    setTeam2SelectedPlayers(createEmptyPlayers(5, 2, match.match.extra_data));
    if (isOpen) {
      prevValuesRef.current.table_referee = me.table_referee || "";
      prevValuesRef.current.head_referee = me.head_referee || "";
      prevValuesRef.current.captainTeam1 = me.captain_a || "";
      prevValuesRef.current.captainTeam2 = me.captain_b || "";
      prevValuesRef.current.notes = me.notes || "";
      prevValuesRef.current.table = me.table || 0;
      setTableReferee(me.table_referee || "");
      setMainReferee(me.head_referee || "");
      setCaptainTeam1(me.captain_a || "");
      setCaptainTeam2(me.captain_b || "");
      setNotes(me.notes || "");
      setTableNumber(me.table || 0);
    }
  }, [isOpen, match.match.extra_data]);

  useEffect(() => {
    console.log("Useffect second one");
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
          ...Object.fromEntries(
            Object.entries(hasChanges).filter(
              ([, value]) => value !== undefined,
            ),
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
  console.log("JOU");

  const usePatchMatch = UsePatchMatch(
    tournament_id,
    match.match.tournament_table_id,
    match.match.id,
  );

  const handleSubmit = async (match: Match) => {
    try {
      await usePatchMatch.mutateAsync(match);
      successToast("Successfully updated assigned player");
      router.navigate({
        to: location.pathname,
        replace: true,
      });
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
    playerId: string,
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
          (player) => player.id === playerId,
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
          (player) => player.id === playerId,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100vh-2rem)] max-w-[90vw] md:max-w-[80vw] lg:max-w-[1200px] overflow-auto flex flex-col p-0">
        <DialogHeader className="z-10 bg-background p-4 md:px-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base md:text-lg">
              Protokoll: {match.p1.name} vs {match.p2.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm hidden md:inline">Laud:</span>
                <Input
                  type="number"
                  min="0"
                  className="w-16 h-8"
                  onChange={(e) => setTableNumber(Number(e.target.value))}
                  value={!table ? "" : table}
                />
              </div>
              <X className="cursor-pointer md:hidden" onClick={onClose} />
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="players" className="flex-grow flex flex-col" onValueChange={setActiveTab}>
          <div className="flex flex-row justify-center items-center pb-4">
            <TabsList className="mx-4 md:mx-6 mt-2 space-x-2 w-[300px]">
              <TabsTrigger value="players" className="flex-1">Mängijad</TabsTrigger>
              <TabsTrigger value="scores" className="flex-1">Skoorid</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-grow px-4 md:px-6 py-4">
            <TabsContent value="players" className="mt-0 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {[1, 2].map((team) => (
                  <div key={team} className="space-y-4">
                    <h5 className="font-bold">
                      {team === 1 ? match.p1.name : match.p2.name} Mängijad
                    </h5>
                    <div className="space-y-3">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="flex items-center">
                          <Select
                            value={
                              team === 1
                                ? team1SelectedPlayers[index]?.id?.toString()
                                : team2SelectedPlayers[index]?.id?.toString()
                            }
                            onValueChange={(value) =>
                              handlePlayerChange(team, index, value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  `Mängija ${team === 1 ? String.fromCharCode(65 + index) : String.fromCharCode(88 + index)}`
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {(() => {
                                const playersArray = team === 1 ? match.p1?.players : match.p2?.players;

                                if (!playersArray || !Array.isArray(playersArray) || playersArray.length === 0) {
                                  return (
                                    <SelectItem disabled value="no-players">
                                      No players available
                                    </SelectItem>
                                  );
                                }

                                const validPlayers = playersArray.filter(player =>
                                  player &&
                                  player.id &&
                                  (player.first_name || player.last_name)
                                );

                                return validPlayers.length > 0 ? (
                                  validPlayers.map(player => (
                                    <SelectItem
                                      key={player.id}
                                      value={player.id.toString()}
                                    >
                                      {player.first_name + " " + player.last_name || ""}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem disabled value="no-players">
                                    No players available
                                  </SelectItem>
                                );
                              })()}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>

                    <h6 className="font-semibold mt-4">Paarismäng</h6>
                    <div className="space-y-3">
                      {[3, 4].map((index) => (
                        <div key={index} className="flex items-center">
                          <Select
                            value={
                              team === 1
                                ? team1SelectedPlayers[index]?.id?.toString()
                                : team2SelectedPlayers[index]?.id?.toString()
                            }
                            onValueChange={(value) =>
                              handlePlayerChange(team, index, value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  `Mängija ${team === 1 ? String.fromCharCode(65 + index) : String.fromCharCode(80 + index)}`
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {(() => {
                                const playersArray = team === 1
                                  ? (match.p1?.players || [])
                                  : (match.p2?.players || []);

                                if (!playersArray || !Array.isArray(playersArray) || playersArray.length === 0) {
                                  return (
                                    <SelectItem disabled value="no-players">
                                      No players available
                                    </SelectItem>
                                  );
                                }

                                const validPlayers = playersArray.filter(player =>
                                  player &&
                                  player.id &&
                                  (player.first_name || player.last_name)
                                );

                                return validPlayers.length > 0 ? (
                                  validPlayers.map(player => (
                                    <SelectItem
                                      key={player.id}
                                      value={player.id.toString()}
                                    >
                                      {player.first_name + " " + player.last_name || ""}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem disabled value="no-players">
                                    No players available
                                  </SelectItem>
                                );
                              })()}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <h6 className="font-semibold mb-2">Kapten</h6>
                      <Input
                        type="text"
                        value={team === 1 ? captainTeam1 : captainTeam2}
                        onChange={(e) =>
                          team === 1
                            ? setCaptainTeam1(e.target.value)
                            : setCaptainTeam2(e.target.value)
                        }
                        placeholder={team === 1 ? "Kapten ABC" : "Kapten XYZ"}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h6 className="font-semibold mb-2">Märkmed</h6>
                <Textarea
                  placeholder="Märkmed"
                  onChange={(e) => setNotes(e.target.value)}
                  value={notes}
                  className="w-full min-h-[80px]"
                />
              </div>

              <div className="mt-6">
                <Button onClick={handleMatchStart}>Alusta</Button>
              </div>
            </TabsContent>

            <TabsContent value="scores" className="mt-0 h-full">
              <ScrollArea className="w-full overflow-x-auto">
                <div className="w-full">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left w-20">Jarjekord</TableHead>
                        <TableHead className="text-center w-16">Sett 1</TableHead>
                        <TableHead className="text-center w-16">Sett 2</TableHead>
                        <TableHead className="text-center w-16">Sett 3</TableHead>
                        <TableHead className="text-center w-16">Sett 4</TableHead>
                        <TableHead className="text-center w-16">Sett 5</TableHead>
                        <TableHead className="text-center w-20">
                          {match.p1.name} Skoor
                        </TableHead>
                        <TableHead className="text-center w-20">
                          {match.p2.name} Skoor
                        </TableHead>
                        <TableHead className="text-center w-24">Loobumisvõit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!isLoading &&
                        childMathes &&
                        childMathes.data &&
                        childMathes.data.map((player_match) => (
                          <TableRow key={player_match.match.id}>
                            <TableCell className="text-left py-2">
                              {player_match.match.order == 1
                                ? "A-Y"
                                : player_match.match.order == 2
                                  ? "B-X"
                                  : player_match.match.order == 3
                                    ? "C-Z"
                                    : player_match.match.order == 4
                                      ? "DE-VW"
                                      : player_match.match.order == 5
                                        ? "A-X"
                                        : player_match.match.order == 6
                                          ? "C-Y"
                                          : "B-Z"}
                            </TableCell>
                            <MatchSets
                              key={player_match.match.id}
                              match={player_match}
                            />
                            <TableCell className="text-center py-2">
                              {player_match.match.extra_data.team_1_total}
                            </TableCell>
                            <TableCell className="text-center py-2">
                              {player_match.match.extra_data.team_2_total}
                            </TableCell>
                            <TableCell className="py-2">
                              <Button
                                onClick={() => {
                                  handleForfeitMatch(player_match);
                                }}
                                className="text-xs font-normal h-6 px-1 w-full"
                                size="sm"
                              >
                                Loobumisvõit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </div>
              </ScrollArea>

              <div className="w-full flex justify-center items-center gap-2 my-4">
                <h6 className="font-bold">Võitja:</h6>
                <div>
                  {match.match.winner_id !== ""
                    ? match.match.winner_id === match.p1.id
                      ? match.p1.name
                      : match.p2.name
                    : "Siia tuleb võitja"}
                  <Separator className="bg-black" />
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="bg-[#EBEFF5] p-4 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              className="flex-grow"
              value={table_referee}
              placeholder="Lauakohtunik"
              onChange={(e) => setTableReferee(e.target.value)}
            />
            <Input
              className="flex-grow"
              value={head_referee}
              placeholder="Peakohtunik"
              onChange={(e) => setMainReferee(e.target.value)}
            />
          </div>
          <Button
            disabled={match.match.winner_id !== ""}
            onClick={() => handleFinish()}
            className="w-full"
          >
            Lõpeta Mängud
          </Button>
        </div>

        {forfeitMatch && (
          <Forfeit
            match={forfeitMatch}
            isOpen={isForfeitOpen}
            onClose={() => handleForfeitMatchClose()}
            tournament_id={tournament_id}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

