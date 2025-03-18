import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlayerProfileModal } from "./player-profile-modal";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react"
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
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserTableProps {
  users: UserNew[]
}

export function Reiting({ users }: UserTableProps = { users: [] }) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("men");
  const [ageClass, setAgeClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [SelectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const windowScrollRef = useRef(0);

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

  // Manage scroll position when modal state changes
  useEffect(() => {
    if (isModalOpen) {
      // Save the current scroll position when the modal opens
      windowScrollRef.current = window.scrollY;
    } else {
      if (windowScrollRef.current !== undefined) {
        const restoreScroll = () => {
          window.scrollTo(0, windowScrollRef.current);
          console.log(`Modal closed: Restored window scroll to ${windowScrollRef.current}px`);
        };
        
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(restoreScroll);
        });
      }
    }
  }, [isModalOpen]);

  const handleModalOpen = (user: UserNew) => {
    setSelectedPlayerId(user.id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

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
      <div className="lg:rounded-lg bg-white px-4 lg:px-12 py-6">
        <div className="space-y-4">
          <h2 className="font-bold">
            {modifyTitleDependingOnFilter(t, showCombined, sex, ageClass)}
          </h2>
          <p className="font-medium pb-1">{t('rating.last_updated')}: <span className="bg-[#FBFBFB] px-3 py-1 rounded-full border border-[#EAEAEA]">11.01.2025, 9:00</span></p>
          <p className="pb-8">Lühendid: NR = koht reitingus, PP = paigutuspunktid, RP = reitingupunktid, KL = kaalud, ID = ELTLID, SA = sünniaasta</p>
        </div>
        
        <div className="border rounded-t-[12px]">
          <div className="border-b border-stone-200 bg-[#EBEFF5] rounded-t-[12px] grid grid-cols-1 lg:grid-cols-12 gap-4 items-center w-full p-1 mb-1">
            <div className="relative w-full md:col-span-3">
              <Input
                type="text"
                placeholder={t('rating.filtering.search_placeholder')}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full pl-4 pr-10 py-2 border rounded-lg text-sm bg-[#F7F6F7] focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <div className="md:col-span-3">
              <Select
                value={ageClass}
                onValueChange={handleAgeClassChange}
              >
                <SelectTrigger className="w-full h-12 flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm bg-[#F7F6F7]">
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

            <div className="md:col-span-4">
              <Tabs
                defaultValue="men"
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="justify-start w-full rounded-[2px] py-2 gap-1">
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
          </div>

          <div className="w-full overflow-auto rounded-t-md max-h-[70vh]">
            <Table className="w-full mx-auto border-collapse rounded-t-lg shadow-lg">
              <TableHeader className="rounded-lg">
                <TableRow className="bg-white sticky top-0 z-10">
                  <TableHead className="md:px-6 py-3 text-left font-medium">NR</TableHead>
                  <TableHead className="px-1 md:px-6 py-3 text-left font-medium">{t('rating.table.head.last_name')}</TableHead>
                  <TableHead className="px-1 md:px-6 py-3 text-left font-medium">{t('rating.table.head.first_name')}</TableHead>
                  <TableHead className="md:px-6 py-3 text-left font-medium">PP</TableHead>
                  <TableHead className="md:px-6 py-3 text-left font-medium">RP</TableHead>
                  <TableHead className="md:px-6 py-3 text-left font-medium">ID</TableHead>
                  <TableHead className="md:px-6 py-3 text-left font-medium">{t('rating.table.head.birthyear')}</TableHead>
                  <TableHead className="md:px-6 py-3 text-left font-medium">{t('rating.table.head.club')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    onClick={() => handleModalOpen(user)}
                    key={user.id}
                    className="group cursor-pointer odd:bg-gradient-to-r from-gray-100/50 to-white even:bg-white transition-colors"
                  >
                    <TableCell className="md:px-6 py-3 text-sm font-bold">
                      {user.rate_order}
                    </TableCell>
                    <TableCell
                      className="px-1 md:px-6 py-3 text-sm font-semibold group-hover:text-blue-600 group-hover:underline"
                    >
                      {user.last_name}
                    </TableCell>
                    <TableCell className="px-1 md:px-6 py-3 text-sm">{user.first_name}</TableCell>
                    <TableCell className="md:px-6 py-3 text-sm">{user.rate_pl_points}</TableCell>
                    <TableCell className="md:px-6 py-3 text-sm">{user.rate_points}</TableCell>
                    <TableCell className="md:px-6 py-3 text-sm">{user.eltl_id}</TableCell>
                    <TableCell className="md:px-6 py-3 text-sm">{getYear(user.birth_date)}</TableCell>
                    <TableCell className="md:px-6 py-3 text-sm">{user.club_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 50 }}>
          <PlayerProfileModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            player={selectedPlayer || null}
          />
        </div>
      </div>
    </div>
  );
}