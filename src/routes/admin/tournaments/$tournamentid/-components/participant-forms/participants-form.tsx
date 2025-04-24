import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import ErrorPage from "@/components/error";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { ParticipantFormProps } from "./form-utils";
import SoloTableHead from "../../grupid/$groupid/osalejad/-components/solo-table-head";
import TeamTableHead from "../../grupid/$groupid/osalejad/-components/team-table-head";
import SoloTableBody from "../../grupid/$groupid/osalejad/-components/solo-table-body";
import { useParticipantForm } from "@/providers/participantProvider";
import TeamTableBody from "../../grupid/$groupid/osalejad/-components/team-table-body";
import SoloTableInput from "../../grupid/$groupid/osalejad/-components/solo-table-input";
import TeamTableInput from "../../grupid/$groupid/osalejad/-components/team-table-input";
import SeedingHeader from "../../grupid/$groupid/osalejad/-components/seeding-header";
import { GroupType } from "@/types/matches";
import { Participant } from "@/types/participants";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ResetSeeding from "../reset-seeding"

export const ParticipantsForm: React.FC<ParticipantFormProps> = ({
  tournament_data,
  table_data,
}) => {
  const {
    participantsState,
    groupedTeams,
    getSubGroupName,
    handleNameChange,
    handleAddNewGroup,
    groupNames,
    setGroupNames,
  } = useParticipantForm();
  const participants = participantsState;

  const { t } = useTranslation();

  const renderParticipantTable = (
    participants_arr: Participant[] | null,
    groupId: number
  ) => {
    return (
      <div className="rounded-md border">

        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {table_data && table_data.solo ? (
                <SoloTableHead />
              ) : (
                <TeamTableHead />
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {participants_arr &&
              participants_arr.map((participant, idx) =>
                table_data.solo ? (
                  <SoloTableBody
                    key={idx}
                    participant={participant}
                    idx={idx}
                    tournament_table_data={table_data}
                  />
                ) : (
                  <TeamTableBody key={idx} participant={participant} idx={idx} tournament_table={table_data} />
                )
              )}
            <TableRow className="relative bg-[#EBF6FD]/50">
              {table_data && table_data.solo ? (
                <SoloTableInput table_data={table_data} groupId={groupId} />
              ) : (
                <TeamTableInput table_data={table_data} groupId={groupId} />
              )}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  };

  if (tournament_data) {
    return (
      <div className=" mx-auto space-y-6  w-full">
        <Card className="w-full border-stone-100">
          {" "}
          <SeedingHeader
            tournament_id={tournament_data.id}
            table_data={table_data}
            participants_length={participants?.length}
          />

          <CardContent className="">
            <div className="flex justify-end pb-1">
              <ResetSeeding tournament_id={tournament_data.id} table_id={table_data.id} />
            </div>
            <div className="min-h-[60vh] flex flex-col">
              <div className="overflow-x-auto w-full">
                {table_data.type === GroupType.ROUND_ROBIN ||
                  table_data.type === GroupType.ROUND_ROBIN_FULL_PLACEMENT ? (
                  <div className="space-y-12">
                    <div className="flex justify-end gap-3">
                      <span className="text-muted-foreground text-sm flex flex-row gap-2">
                        {t("admin.tournaments.groups.participants.groups")}:{" "}
                        {Object.keys(groupedTeams).length}
                      </span>
                      <span className="text-muted-foreground text-sm flex flex-row gap-2">
                        {t("admin.tournaments.groups.participants.teams")}:{" "}
                        {participants?.length}
                      </span>
                    </div>
                    {Object.entries(groupedTeams).map(
                      ([currentGroupId, teams]) => {
                        const groupNumber = Number(currentGroupId);
                        return (
                          <div key={currentGroupId} className="mb-6">
                            <div>
                              <div className="flex justify-between items-center  bg-[#062842] py-2 rounded-l-sm">
                                <h3 className="text-xl font-semibold px-2 ">
                                  <Input
                                    placeholder={`${t('admin.tournaments.groups.participants.team_placeholder')} ${groupNumber}`}
                                    className="text-lg"
                                    value={
                                      groupNames[groupNumber] !== undefined
                                        ? groupNames[groupNumber]
                                        : getSubGroupName(groupNumber)
                                    }
                                    onChange={(e) =>
                                      setGroupNames((prev) => ({
                                        ...prev,
                                        [groupNumber]: e.target.value,
                                      }))
                                    }
                                    onBlur={() =>
                                      handleNameChange(
                                        groupNames[groupNumber] || "",
                                        groupNumber
                                      )
                                    }
                                  />
                                </h3>
                              </div>
                            </div>
                            {renderParticipantTable(teams, groupNumber)}
                          </div>
                        );
                      }
                    )}
                    {Object.keys(groupedTeams).length < table_data.size && (
                      <Button
                        className="w-full h-24"
                        variant="outline"
                        onClick={() => handleAddNewGroup(table_data)}
                      >
                        {t('admin.tournaments.groups.participants.new_group')} <Plus />
                      </Button>
                    )}
                  </div>
                ) : (
                  <>{renderParticipantTable(participants, 0)}</>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    return <ErrorPage />;
  }
};
