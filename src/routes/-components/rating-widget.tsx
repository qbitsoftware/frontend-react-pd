import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PlayerProfileModal } from "../reiting/-components/player-profile-modal";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNew } from "@/types/types";

interface Props {
  users: UserNew[] | null;
}

const RatingWidget = ({ users }: Props) => {
  const { t } = useTranslation();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const selectedPlayer =
    users && users.find((user) => user.id === selectedPlayerId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tallinn");

  if (!users) {
    return <div>{t("rating.component.missing")}</div>;
  }

  const filteredUsers = users
    .filter((user) => {
      if (activeTab === "tallinn") return user.location === "tallinn";
      if (activeTab === "tartu") return user.location === "tartu";
      if (activeTab === "portugal") return user.location === "portugal";
      return true;
    })
    .sort((a, b) => b.rate_points - a.rate_points);

  return (
    <div className="h-full flex flex-col relative space-y-1 border rounded-t-[12px]">
      <div className="w-full border-b border-stone-200 p-1 mb-1 rounded-t-[12px] bg-[#EBEFF5]">
        <Tabs
          defaultValue="tallinn"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full "
        >
          <TabsList className="justify-start w-full rounded-[2px] py-2 gap-1 flex flex-col lg:flex-row">
            <TabsTrigger value="tallinn" className="rounded-[4px] flex-1">
              {t("rating.filtering.buttons.tallinn")}
            </TabsTrigger>
            <TabsTrigger value="tartu" className="rounded-[4px] flex-1">
              {t("rating.filtering.buttons.tartu")}
            </TabsTrigger>
            <TabsTrigger value="portugal" className="rounded-[4px] flex-1">
              {t("rating.filtering.buttons.portugal")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="overflow-y-scroll max-h-[80vh]">
        <Table className="w-full mx-auto border-collapse rounded-t-lg shadow-lg">
          <TableHeader className="rounded-lg">
            <TableRow className=" sticky top-0 z-10">
              <TableHead className="px-6 py-3 text-left font-medium">
                NR
              </TableHead>
              <TableHead className="px-6 py-3 text-left font-medium">
                {t("rating.table.head.player")}
              </TableHead>
              <TableHead className="px-6 py-3 text-left font-medium">
                ELO
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow
                onClick={() => {
                  setSelectedPlayerId(user.id);
                  setIsModalOpen(true);
                }}
                key={user.id}
                className="group cursor-pointer"
              >
                <TableCell
                  className={`px-6 py-3 text-sm font-bold ${index === 0
                    ? "text-yellow-500" // Gold for 1st place
                    : index === 1
                      ? "text-gray-400" // Silver for 2nd place
                      : index === 2
                        ? "text-amber-700" // Bronze for 3rd place
                        : ""
                    }`}
                >
                  {index + 1}
                </TableCell>
                <TableCell className="px-6 py-3 text-sm font-semibold group-hover:text-blue-600 group-hover:underline">
                  {user.username}{" "}
                  <span className="font-medium text-gray-500">
                    ({user.first_name})
                  </span>
                </TableCell>
                <TableCell className="px-6 py-3 text-sm">
                  {user.rate_points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PlayerProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedPlayer || null}
      />
    </div>
  );
};

export default RatingWidget;
