import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import ErrorPage from "@/components/error";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ParticipantFormProps,
} from "./form-utils";
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
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react";

export const ParticipantsForm: React.FC<ParticipantFormProps> = ({
  tournament_data, table_data
}) => {

  const { participantsState, groupedTeams, getSubGroupName, handleNameChange, handleAddNewGroup } = useParticipantForm();
  const participants = participantsState

  const [groupNames, setGroupNames] = useState<Record<number, string>>({});
  const { t } = useTranslation()

  const renderParticipantTable = (participants_arr: Participant[] | null) => {
    return (<Table className="w-full">
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
        {participants_arr && participants_arr.map((participant, idx) =>
          table_data.solo ? (
            <SoloTableBody key={idx} participant={participant} idx={idx} tournament_table_data={table_data} />
          ) : (
            <TeamTableBody key={idx} participant={participant} idx={idx} />
          )
        )}
        <TableRow className="relative">
          {table_data && table_data.solo ? (
            <SoloTableInput table_data={table_data} />
          ) : (
            <TeamTableInput />
          )}
        </TableRow>
      </TableBody>
    </Table>
    )
  }

  if (tournament_data) {
    return (
      <div className=" mx-auto py-6 space-y-6  w-full">
        <Card className=" border-[#F0F3F3]">
          <SeedingHeader tournament_id={tournament_data.id} tournament_table_id={table_data.id} />
          <CardContent className="">
            <div className="min-h-[60vh] flex flex-col">
              <div className="overflow-x-auto w-full">
                {table_data.type === GroupType.ROUND_ROBIN || table_data.type === GroupType.ROUND_ROBIN_FULL_PLACEMENT ? (
                  <div>

                    {Object.entries(groupedTeams).map(([currentGroupId, teams]) => {
                      const groupNumber = Number(currentGroupId)
                      return (
                        <div key={currentGroupId} className="mb-6">
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-semibold">
                                <Input
                                  placeholder={`Group ${groupNumber}`}
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
                              <span className="text-muted-foreground text-sm flex flex-row gap-2">
                                {t("admin.tournaments.groups.participants.teams")}

                              </span>
                            </div>

                          </div>
                          {renderParticipantTable(teams)}
                        </div>
                      )
                    })}
                    <Button className="w-full h-24" variant="outline" onClick={() => handleAddNewGroup(table_data)}>Uus grupp <Plus /></Button>
                  </div>
                ) : (
                  <>
                    {renderParticipantTable(participants)}
                  </>
                )}
              </div>
            </div>
          </CardContent >
        </Card >
      </div >
    );
  } else {
    return <ErrorPage />;
  }
};
