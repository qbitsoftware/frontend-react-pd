import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlayerProfileModal } from "./player-profile-modal";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from "react-i18next";
import { useState } from "react"
import { filterByAgeClass, modifyTitleDependingOnFilter, getYear } from "@/lib/rating-utils";
import { User } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Player extends User {
  ID: number;
  first_name: string;
  last_name: string;
  birth_date: Date;
  club_id: string;
  sex: string;
  rating_points: number;
  placement_points: number;
  weight_points: number;
  eltl_id: number;
  has_rating: boolean;
  nationality: string;
  placing_order: number;
  rank_change: number;
}

interface UserTableProps {
  users: Player[]
}

export function Reiting({ users }: UserTableProps = { users: [] }) {
  const { t } = useTranslation();


  const [sex, setSex] = useState("M")
  const [showCombined, setShowCombined] = useState(false);
  const [ageClass, setAgeClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [SelectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleAgeClassChange = (value: string) => {
    setAgeClass(value);
    setShowCombined(value === "all");

    if (["cadet_boys", "junior_boys", "senior_men"].includes(value)) {
      setSex("M");
    } else if (["cadet_girls", "junior_girls", "senior_women"].includes(value)) {
      setSex("N");
    } else {
      setSex("");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSex = showCombined || sex === "" || user.sex === sex;
    const matchesAgeClass = showCombined || filterByAgeClass(user, ageClass);
    const matchesSearchQuery =
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.club_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSex && matchesAgeClass && matchesSearchQuery;
  });

  const selectedPlayer = users.find((user) => user.ID === SelectedPlayerId);

  return (
    <div className="py-6">
      <div className="flex items-center gap-6 pb-6">
        <h2 className="">
          {modifyTitleDependingOnFilter(t, showCombined, sex, ageClass)}
        </h2>
      </div>
      <div className="rounded-lg bg-white px-6 py-6">
        <p className="font-medium pb-1">{t('rating.last_updated')}: 11.01.2025, 9:00</p>
        <p className="pb-8">Lühendid: NR = koht reitingus, PP = paigutuspunktid, RP = reitingupunktid, KL = kaalud, ID = ELTLID, SA = sünniaasta</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-1 rounded-t-[4px] pb-2">
          {/* First column - Gender selection */}
          <div className="flex flex-row justify-between w-full gap-1">
            <Button
              variant={sex === 'N' ? 'default' : 'outline'}
              onClick={() => {
                handleAgeClassChange("all")
                setSex('N');
                setShowCombined(false);
              }}
              className="shadow-selectedFilter rounded-[4px] flex-1"
            >
              {t('rating.filtering.buttons.women')}
            </Button>
            <Button
              variant={sex === 'M' ? 'default' : 'outline'}
              onClick={() => {
                handleAgeClassChange("all")
                setSex('M');
                setShowCombined(false);
              }}
              className="shadow-selectedFilter rounded-[4px] flex-1"
            >
              {t('rating.filtering.buttons.men')}
            </Button>
            <Button
              variant={showCombined ? 'default' : 'outline'}
              onClick={() => setShowCombined(true)}
              className="shadow-selectedFilter rounded-[4px] flex-1"
            >
              {t('rating.filtering.buttons.combined')}
            </Button>
          </div>

          {/* Second column - Age class selection */}
          <div className="w-full">
            <Select
              value={ageClass}
              onValueChange={handleAgeClassChange}
            >
              <SelectTrigger className="bg-white shadow-selectedFilter rounded-[4px] w-full">
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
          <div className="w-full">
            <Input
              type="text"
              placeholder={t('rating.filtering.search_placeholder')}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
        </div>

        <ScrollArea className="w-full overflow-x-auto rounded-t-lg">
          <Table className="w-full mx-auto border-collapse rounded-t-lg shadow-lg">
            <TableHeader className="rounded-lg">
              <TableRow className="bg-gradient-to-r from-stone-100 to-[#F9F9FB]">
                <TableHead className="px-6 py-3 text-left font-bold">NR</TableHead>
                <TableHead className="px-6 py-3 text-left font-bold">PP</TableHead>
                <TableHead className="px-6 py-3 text-left font-bold">RP</TableHead>
                <TableHead className="px-6 py-3 text-left font-bold">ID</TableHead>
                <TableHead className="px-6 py-3 text-left font-bold">{t('rating.table.head.last_name')}</TableHead>
                <TableHead className="px-6 py-3 text-left font-bold">{t('rating.table.head.first_name')}</TableHead>
                <TableHead className="px-6 py-3 text-left font-bold">{t('rating.table.head.birthyear')}</TableHead>
                <TableHead className="px-6 py-3 text-left font-bold">{t('rating.table.head.club')}</TableHead>
                <TableHead className="px-6 py-3 text-center font-bold">{t('rating.table.head.profile')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, idx) => (
                <TableRow key={user.ID} className="odd:bg-gradient-to-r from-gray-100 to-white even:bg-white hover:bg-blue-50 transition-colors">
                  <TableCell className="px-6 py-3 text-sm font-bold">
                    {idx + 1}
                    {user.rank_change > 0 && <span className="text-blue-400 ml-1">▲</span>}
                    {user.rank_change < 0 && <span className="text-gray-600 ml-1">▼</span>}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm">{user.placement_points}</TableCell>
                  <TableCell className="px-6 py-3 text-sm">{user.rating_points}</TableCell>
                  <TableCell className="px-6 py-3 text-sm">{user.eltl_id}</TableCell>
                  <TableCell className="px-6 py-3 text-sm">{user.last_name}</TableCell>
                  <TableCell className="px-6 py-3 text-sm">{user.first_name}</TableCell>
                  <TableCell className="px-6 py-3 text-sm">{getYear(user.birth_date)}</TableCell>
                  <TableCell className="px-6 py-3 text-sm">{user.club_id}</TableCell>
                  <TableCell className="px-6 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-4 py-2"
                      onClick={() => {
                        setSelectedPlayerId(user.ID);
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
