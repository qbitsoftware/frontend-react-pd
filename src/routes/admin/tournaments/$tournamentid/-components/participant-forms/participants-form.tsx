import { Card, CardContent } from "@/components/ui/card";
import React from "react";
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

export const ParticipantsForm: React.FC<ParticipantFormProps> = ({
  tournament_data, table_data
}) => {

  const { participantsState } = useParticipantForm();
  const participants = participantsState
 
  if (tournament_data) {
    return (
      <div className=" mx-auto py-6 space-y-6  w-full">
        <Card className=" border-[#F0F3F3]">
          <SeedingHeader tournament_id={tournament_data.id} tournament_table_id={table_data.id} />
          <CardContent className="">
            <div className="min-h-[60vh] flex flex-col">
              <div className="overflow-x-auto w-full">
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
                    {participants?.map((participant, idx) =>
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
