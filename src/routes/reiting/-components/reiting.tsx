import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayerProfileModal } from "./player-profile-modal";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  filterByAgeClass,
  modifyTitleDependingOnFilter,
} from "@/lib/rating-utils";
import { UserNew } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// interface Player extends User {
//   ID: number;
//   first_name: string;
//   last_name: string;
//   birth_date: Date;
//   club_id: string;
//   sex: string;
//   rating_points: number;
//   placement_points: number;
//   weight_points: number;
//   eltl_id: number;
//   has_rating: boolean;
//   nationality: string;
//   placing_order: number;
//   rank_change: number;
// }

interface UserTableProps {
  users: UserNew[];
}

export function Reiting({ users }: UserTableProps = { users: [] }) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("combined");
  const [ageClass, setAgeClass] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [SelectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const tableContainerId = "rating-table-container";
  const [scrollPosition, setScrollPosition] = useState(0);

  const getSexAndCombined = (tab: string) => {
    switch (tab) {
      case "men":
        return { sex: "M", showCombined: false };
      case "women":
        return { sex: "N", showCombined: false };
      case "combined":
        return { sex: "", showCombined: true };
      default:
        return { sex: "M", showCombined: false };
    }
  };

  const { sex, showCombined } = getSexAndCombined(activeTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "combined") {
      setAgeClass("all");
    }
  };

  const getTableContainer = () => document.getElementById(tableContainerId);

  const handleModalOpen = (user: UserNew) => {
    const container = getTableContainer();
    if (container) {
      setScrollPosition(container.scrollTop);
    }

    setSelectedPlayerId(user.id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);

    setTimeout(() => {
      const container = getTableContainer();
      if (container) {
        // Force scroll to the saved position
        container.scrollTop = scrollPosition;
      }
    }, 100);
  };

  // Set up an effect to restore scroll position when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setTimeout(() => {
        const container = getTableContainer();
        if (container) {
          container.scrollTop = scrollPosition;
        }
      }, 100);
    }
  }, [isModalOpen, scrollPosition]);

  const filteredUsers = users
    .filter((user) => {
      const matchesSex = showCombined || sex === "" || user.sex === sex;
      const matchesAgeClass = showCombined || filterByAgeClass(user, ageClass);
      const matchesSearchQuery =
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.club_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSex && matchesAgeClass && matchesSearchQuery;
    })
    .sort((a, b) => b.rate_points - a.rate_points);

  const selectedPlayer = users.find((user) => user.id === SelectedPlayerId);

  return (
    <div className="py-4">
      <div className="lg:rounded-lg bg-white px-4 lg:px-12 py-6">
        <div className="space-y-4">
          <h2 className="font-bold">
            {modifyTitleDependingOnFilter(t, showCombined, sex, ageClass)}
          </h2>
          <p className="font-medium pb-1">
            {t("rating.last_updated")}:{" "}
            <span className="bg-[#FBFBFB] px-3 py-1 rounded-full border border-[#EAEAEA]">
              Automatically Synced
            </span>
          </p>
          <p className="pb-8">NR = Ranking, ELO = ELO Points</p>
        </div>
        <div className="border rounded-t-[12px]">
          <div className="border-b border-stone-200 bg-[#EBEFF5] rounded-t-[12px] grid grid-cols-1 lg:grid-cols-12 gap-4 items-center w-full p-1 mb-1">
            <div className="relative w-full md:col-span-3">
              <Input
                type="text"
                placeholder={t("rating.filtering.search_placeholder")}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full pl-4 pr-10 py-2 border rounded-lg text-sm bg-[#F7F6F7] focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <div className="md:col-span-4">
              <Tabs
                defaultValue="men"
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="justify-start w-full rounded-[2px] py-2 gap-1">
                  <TabsTrigger value="women" className="rounded-[4px] flex-1">
                    {t("rating.filtering.buttons.women")}
                  </TabsTrigger>
                  <TabsTrigger value="men" className="rounded-[4px] flex-1">
                    {t("rating.filtering.buttons.men")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="combined"
                    className="rounded-[4px] flex-1"
                  >
                    {t("rating.filtering.buttons.combined")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Use id to ensure we can access this element reliably */}
          <div
            id={tableContainerId}
            className="w-full overflow-auto rounded-t-md max-h-[70vh]"
          >
            <Table className="w-full mx-auto border-collapse rounded-t-lg shadow-lg">
              <TableHeader className="rounded-lg">
                <TableRow className="bg-white sticky top-0 z-10">
                  <TableHead className="md:px-6 py-3 text-left font-medium">
                    NR
                  </TableHead>
                  <TableHead className="px-1 md:px-6 py-3 text-left font-medium">
                    {t("rating.table.head.last_name")}
                  </TableHead>
                  <TableHead className="px-1 md:px-6 py-3 text-left font-medium">
                    {t("rating.table.head.first_name")}
                  </TableHead>
                  <TableHead className="md:px-6 py-3 text-left font-medium">
                    ELO
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    onClick={() => handleModalOpen(user)}
                    key={user.id}
                    className="group cursor-pointer odd:bg-gradient-to-r from-gray-100/50 to-white even:bg-white  transition-colors"
                  >
                    <TableCell
                      className={`px-6 py-3 text-sm font-bold ${
                        index === 0
                          ? "text-yellow-500"
                          : index === 1
                            ? "text-gray-400"
                            : index === 2
                              ? "text-amber-700"
                              : ""
                      }`}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-1 md:px-6 py-3 text-sm font-semibold group-hover:text-blue-600 group-hover:underline">
                      {user.username}
                    </TableCell>
                    <TableCell className="px-1 md:px-6 py-3 text-sm">
                      {user.first_name}
                    </TableCell>
                    <TableCell className="md:px-6 py-3 text-sm">
                      {user.rate_points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <PlayerProfileModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          user={selectedPlayer || null}
        />
      </div>
    </div>
  );
}
