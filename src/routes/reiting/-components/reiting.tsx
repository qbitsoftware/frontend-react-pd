import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlayerProfileModal } from "./player-profile-modal";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from "react-i18next";
import { useState } from "react"
import { filterByAgeClass, modifyTitleDependingOnFilter, getYear } from "@/lib/rating-utils";
import { User } from "@/types/types";

interface Player extends User{
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

export function Reiting({ users }: UserTableProps = { users: []}) {
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
      <div className="rounded-t-lg bg-white p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-3">
          {modifyTitleDependingOnFilter(t, showCombined, sex, ageClass)}
        </h2>
        <h3 className="text-l font-semibold text-gray-600 mb-6">{t('rating.last_updated')}: 11.01.2025, 9:00</h3>
        <div className="w-full pr-4 mt-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <Button
              variant={sex === 'N' ? 'default' : 'outline'}
              onClick={() => { 
                handleAgeClassChange("all")
                setSex('N');
                setShowCombined(false);
              }}
              className="px-6 py-2 bg-blue-100 text-muted-foreground rounded-md transition-all duration-300 hover:bg-blue-200 hover:scale-105 focus:outline-none focus:bg-blue-300"
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
              className="px-6 py-2 bg-blue-100 text-muted-foreground rounded-md transition-all duration-300 hover:bg-blue-200 hover:scale-105 focus:outline-none focus:bg-blue-300"
            > 
              {t('rating.filtering.buttons.men')}
            </Button>
            <Button
              variant={showCombined ? 'default' : 'outline'}
              onClick={() => setShowCombined(true)}
              className="px-6 py-2 bg-blue-100 text-muted-foreground rounded-md transition-all duration-300 hover:bg-blue-200 hover:scale-105 focus:outline-none focus:bg-blue-300"
            > 
              {t('rating.filtering.buttons.combined')}
            </Button>
          </div>
          <div className="w-full max-w-md mx-4">
            <select
              value={ageClass}
              onChange={(e) => { 
                handleAgeClassChange(e.target.value)
              }}
              className="w-full pl-4 py-2.5 text-muted-foreground border border-gray-300 rounded-md shadow-sm hover:cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-100"
            >
              <option value="all">{t('rating.filtering.select.options.all')}</option>
              <option value="cadet_boys">{t('rating.filtering.select.options.cadets_boys')}</option>
              <option value="cadet_girls">{t('rating.filtering.select.options.cadets_girls')}</option>
              <option value="junior_boys">{t('rating.filtering.select.options.juniors_boys')}</option>
              <option value="junior_girls">{t('rating.filtering.select.options.juniors_girls')}</option>
              <option value="senior_men">{t('rating.filtering.select.options.seniors_men')}</option>
              <option value="senior_women">{t('rating.filtering.select.options.seniors_women')}</option>
            </select>
          </div>
          <div className="w-full max-w-sm md:max-w-md">
            <input
              type="text"
              placeholder={t('rating.filtering.search_placeholder')}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
        </div>
        <ScrollArea className="w-full mt-8 pr-4 overflow-x-auto rounded-t-lg">
            <Table className="w-full max-w-6xl mx-auto border-collapse rounded-t-lg shadow-lg">
              <TableHeader className="rounded-lg">
                <TableRow className="bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-t-lg">
                  <TableHead className="px-6 py-3 text-left font-semibold text-white">NR</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-white">PP</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-white">RP</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-white">ID</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-white">{t('rating.table.head.last_name')}</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-white">{t('rating.table.head.first_name')}</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-white">{t('rating.table.head.birthyear')}</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-white">{t('rating.table.head.club')}</TableHead>
                  <TableHead className="px-6 py-3 text-center font-semibold text-white">{t('rating.table.head.profile')}</TableHead>
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
                        onClick={() =>  {
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
);
}
