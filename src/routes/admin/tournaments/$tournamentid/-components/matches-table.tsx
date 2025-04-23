import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import MatchDialog from "@/components/match-dialog";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReGrouping from "./regrouping";
import TimeEditingModal from "./time-editing-modal";
import { createColumns } from "./matches-table-columns";
import { useTranslation } from "react-i18next";
import { MatchState, MatchWrapper } from "@/types/matches";
import { TournamentTable } from "@/types/groups";
import ResetSeeding from "./reset-seeding";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProtocolModalProvider } from "@/providers/protocolProvider";
import { TableTennisProtocolModal } from "./tt-modal/tt-modal";

interface MatchesTableProps {
  data: MatchWrapper[] | [];
  all_matches: MatchWrapper[] | [];
  tournament_id: number;
  tournament_table: TournamentTable;
  player_count: number;
}

type FilterOptions = MatchState | "all";

export const MatchesTable: React.FC<MatchesTableProps> = ({
  data,
  tournament_id,
  tournament_table,
  player_count,
  all_matches,
}: MatchesTableProps) => {
  const [isRegroupingModalOpen, setIsRegroupingModalOpen] = useState(false);
  const [isTimeEditingModalOpen, setIsTimeEditingModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchWrapper | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<FilterOptions>("all");
  const [initialTab, setInitialTab] = useState<"regrouping" | "finals">(
    "regrouping"
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedMatch) {
      const updatedMatch = data.find(
        (match) => match.match.id === selectedMatch.match.id
      );
      if (updatedMatch) {
        setSelectedMatch(updatedMatch);
      }
    }
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered;

    switch (filterValue) {
      case MatchState.FINISHED:
        filtered = data.filter(
          (match) => match.match.state === MatchState.FINISHED
        );
        break;
      case MatchState.ONGOING:
        filtered = data.filter(
          (match) => match.match.state === MatchState.ONGOING
        );
        break;
      case MatchState.CREATED:
        filtered = data.filter(
          (match) => match.match.state === MatchState.CREATED
        );
        break;
      case "all":
      default:
        filtered = data;
    }

    // Then filter out matches with empty players
    return filtered.filter((match) => match.p1.id !== "" && match.p2.id !== "");
  }, [data, filterValue]);

  const columns = useMemo(() => createColumns(t), [t]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (match: MatchWrapper) => {
    setSelectedMatch(match);
    setIsOpen(true);
  };

  if (data.length > 0) {
    return (
      <Card className="w-full border-stone-100">
        <CardHeader className="flex flex-row w-full items-center justify-between space-y-0">
          <Select
            value={filterValue}
            onValueChange={(value: FilterOptions) => setFilterValue(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter matches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("admin.tournaments.filters.all_games")}
              </SelectItem>
              <SelectItem value={MatchState.FINISHED}>
                {t("admin.tournaments.filters.winner_declared")}
              </SelectItem>
              <SelectItem value={MatchState.ONGOING}>
                {t("admin.tournaments.filters.ongoing_games")}
              </SelectItem>
              <SelectItem value={MatchState.CREATED}>
                {t("admin.tournaments.filters.upcoming_games")}
              </SelectItem>
            </SelectContent>
          </Select>
          <ResetSeeding tournament_id={tournament_id} table_id={tournament_table.id} />

          {tournament_table.type == "champions_league" && (
            <div className="flex gap-4">
              <Button
                className="text-white bg-primary"
                onClick={() => {
                  setInitialTab("regrouping");
                  setIsRegroupingModalOpen(true);
                }}
              >
                {t("admin.tournaments.groups.regroup")}
              </Button>
              <Button
                className="text-white bg-primary"
                onClick={() => {
                  setInitialTab("finals");
                  setIsRegroupingModalOpen(true);
                }}
              >
                {t("admin.tournaments.groups.finals")}
              </Button>
              <Button
                className="text-white bg-primary"
                onClick={() => setIsTimeEditingModalOpen(true)}
              >
                {t("admin.tournaments.groups.change_time")}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border" >
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="whitespace-nowrap">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        "!h-auto",
                        row.original.match.state === MatchState.ONGOING &&
                        "bg-green-100"
                      )}
                    >
                      {row.getVisibleCells().map((cell, cellIndex) => {
                        if (cell.column.id === "actions") {
                          return (
                            <TableCell key={cellIndex}>
                              <Button
                                disabled={
                                  row.original.p1.id == "" ||
                                  row.original.p2.id == ""
                                }
                                variant="outline"
                                onClick={() => handleRowClick(row.original)}
                              >
                                {t("admin.tournaments.matches.table.modify")}
                              </Button>
                            </TableCell>
                          );
                        }
                        if (cell.column.id === "p1_score") {
                          return (
                            <TableCell key={cellIndex} className="text-center">
                              {row.original.match.extra_data.team_1_total}
                            </TableCell>
                          );
                        }

                        if (cell.column.id === "p2_score") {
                          return (
                            <TableCell key={cellIndex} className="text-center">
                              {row.original.match.extra_data.team_2_total}
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell
                            className="py-0 !h-auto w-auto whitespace-nowrap"
                            key={cell.id}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {t("admin.tournaments.groups.no_results")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {selectedMatch
            && tournament_table.solo
            ? <MatchDialog
              open={isOpen}
              onClose={() => setIsOpen(false)}
              match={selectedMatch}
              tournament_id={tournament_id}
            /> : selectedMatch && !tournament_table.solo &&
            <ProtocolModalProvider
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              tournament_id={tournament_id}
              match={selectedMatch}
              player_count={player_count}
            >
              <TableTennisProtocolModal />
            </ProtocolModalProvider>}
        </CardContent>
        <ReGrouping
          tournament_id={tournament_id}
          isOpen={isRegroupingModalOpen}
          onClose={() => setIsRegroupingModalOpen(false)}
          state={initialTab}
        />
        <TimeEditingModal
          matches={all_matches}
          tournament_table_id={tournament_table.id}
          tournament_id={tournament_id}
          isOpen={isTimeEditingModalOpen}
          onClose={() => setIsTimeEditingModalOpen(false)}
        />
      </Card>
    );
  } else {
    return (
      <div className="p-6 text-center rounded-sm">
        <p className="text-stone-500">{t("competitions.errors.no_games")}</p>
      </div>
    );
  }
};
