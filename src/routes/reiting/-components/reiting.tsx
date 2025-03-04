import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlayerProfileModal } from "./player-profile-modal";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from "react-i18next";
import { useState } from "react"
import { filterByAgeClass, modifyTitleDependingOnFilter, getYear } from "@/lib/rating-utils";
import { UserNew } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
  users: UserNew[]
}

export function Reiting({ users }: UserTableProps = { users: [] }) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("men");
  const [ageClass, setAgeClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [SelectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const getSexAndCombined = (tab: string) => {
    switch (tab) {
      case "men": return { sex: "M", showCombined: false };
      case "women": return { sex: "N", showCombined: false };
      case "combined": return { sex: "", showCombined: true };
      default: return { sex: "M", showCombined: false };
    }
  };

  const { sex, showCombined } = getSexAndCombined(activeTab);

  const handleAgeClassChange = (value: string) => {
    setAgeClass(value);

    if (["cadet_boys", "junior_boys", "senior_men"].includes(value)) {
      setActiveTab("men");
    } else if (["cadet_girls", "junior_girls", "senior_women"].includes(value)) {
      setActiveTab("women");
    } else {
      setActiveTab("combined");
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "combined") {
      setAgeClass("all")
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSex = showCombined || sex === "" || user.sex === sex;
    const matchesAgeClass = showCombined || filterByAgeClass(user, ageClass);
    const matchesSearchQuery =
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.club_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSex && matchesAgeClass && matchesSearchQuery;
  }).sort((a, b) => b.rate_points - a.rate_points);

  const selectedPlayer = users.find((user) => user.id === SelectedPlayerId);

  return (
    <div className="py-4">

      <div className="rounded-lg bg-white px-6 py-6">
        <div className="space-y-4">
          <h2 className="">
            {modifyTitleDependingOnFilter(t, showCombined, sex, ageClass)}
          </h2>
          <p className="font-medium pb-1">{t('rating.last_updated')}: <span className="bg-[#FBFBFB] px-3 py-1 rounded-full border border-[#EAEAEA]">11.01.2025, 9:00</span></p>
          <p className="pb-8">Lühendid: NR = koht reitingus, PP = paigutuspunktid, RP = reitingupunktid, KL = kaalud, ID = ELTLID, SA = sünniaasta</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center w-full p-1 rounded-[2px]  mb-1 bg-[#F0F4F7]">
          {/* First column - Gender selection */}
          <div className="md:col-span-4">
            <Tabs
              defaultValue="men"
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className=" justify-start w-full rounded-[2px] py-2 gap-1">
                <TabsTrigger value="women" className="rounded-[4px] flex-1">
                  {t('rating.filtering.buttons.women')}
                </TabsTrigger>
                <TabsTrigger value="men" className="rounded-[4px] flex-1">
                  {t('rating.filtering.buttons.men')}
                </TabsTrigger>
                <TabsTrigger value="combined" className="rounded-[4px] flex-1">
                  {t('rating.filtering.buttons.combined')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Second column - Age class selection */}
          <div className="md:col-span-3">
            <Select
              value={ageClass}
              onValueChange={handleAgeClassChange}
            >
              <SelectTrigger className="bg-white shadow-eventCard rounded-[4px] w-full">
                <SelectValue placeholder={t('rating.filtering.select.options.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('rating.filtering.select.options.all')}</SelectItem>
                <SelectItem value="cadet_boys">{t('rating.filtering.select.options.cadets_boys')}</SelectItem>
                <SelectItem value="cadet_girls">{t('rating.filtering.select.options.cadets_girls')}</SelectItem>
                <SelectItem value="junior_boys">{t('rating.filtering.select.options.juniors_boys')}</SelectItem>
                <SelectItem value="junior_girls">{t('rating.filtering.select.options.juniors_girls')}</SelectItem>
                <SelectItem value="senior_men">{t('rating.filtering.select.options.seniors_men')}</SelectItem>
                <SelectItem value="senior_women">{t('rating.filtering.select.options.seniors_women')}</SelectItem>
              </SelectContent>
            </Select>
          </div>


          {/* Third column - Search input */}
          <div className="w-full md:col-span-3 md:col-start-10">
            <Input
              type="text"
              placeholder={t('rating.filtering.search_placeholder')}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=""
            />
          </div>
        </div>

        <ScrollArea className="w-full overflow-x-auto rounded-t-md">
          <Table className="w-full mx-auto border-collapse rounded-t-lg shadow-lg">
            <TableHeader className="rounded-lg">
              <TableRow className="bg-[#4E5676] hover:bg-[#4E5676] ">
                <TableHead className="px-6 py-3 text-left font-normal text-[#F0F0F0]">NR</TableHead>
                <TableHead className="px-6 py-3 text-left font-normal text-[#F0F0F0]">PP</TableHead>
                <TableHead className="px-6 py-3 text-left font-normal text-[#F0F0F0]">RP</TableHead>
                <TableHead className="px-6 py-3 text-left font-normal text-[#F0F0F0]">ID</TableHead>
                <TableHead className="px-6 py-3 text-left font-normal text-[#F0F0F0]">{t('rating.table.head.last_name')}</TableHead>
                <TableHead className="px-6 py-3 text-left font-normal text-[#F0F0F0]">{t('rating.table.head.first_name')}</TableHead>
                <TableHead className="px-6 py-3 text-left font-normal text-[#F0F0F0]">{t('rating.table.head.birthyear')}</TableHead>
                <TableHead className="px-6 py-3 text-left font-normal text-[#F0F0F0]">{t('rating.table.head.club')}</TableHead>
                <TableHead className="px-6 py-3 text-center font-normal text-[#F0F0F0]">{t('rating.table.head.profile')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, idx) => (
                <TableRow key={user.id} className="odd:bg-gradient-to-r from-gray-100 to-white even:bg-white hover:bg-blue-50 transition-colors">
                  <TableCell className="px-6 py-3 text-sm font-bold">
                    {idx + 1}
                    {/* {user.rank_change > 0 && <span className="text-blue-400 ml-1">▲</span>} */}
                    {/* {user.rank_change < 0 && <span className="text-gray-600 ml-1">▼</span>} */}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm">{user.rate_pl_points}</TableCell>
                  <TableCell className="px-6 py-3 text-sm font-bold">{user.rate_points}</TableCell>
                  <TableCell className="px-6 py-3 text-sm">{user.eltl_id}</TableCell>
                  <TableCell className="px-6 py-3 text-sm font-semibold">{user.last_name}</TableCell>
                  <TableCell className="px-6 py-3 text-sm">{user.first_name}</TableCell>
                  <TableCell className="px-6 py-3 text-sm">{getYear(user.birth_date)}</TableCell>
                  <TableCell className="px-6 py-3 text-sm">{user.club_name}</TableCell>
                  <TableCell className="px-6 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-4 py-2"
                      onClick={() => {
                        setSelectedPlayerId(user.id);
                        setIsModalOpen(true);
                      }}
                    >
                      {t('rating.table.body.profile_button')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <PlayerProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          player={selectedPlayer || null}
        />
      </div>
    </div>
  );
}
