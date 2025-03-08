import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { PlayerProfileModal } from '../reiting/-components/player-profile-modal';
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNew } from '@/types/types';

interface Props {
  users: UserNew[] | null
}

const RatingWidget = ({ users }: Props) => {
  const { t } = useTranslation();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const selectedPlayer = users && users.find((user) => user.id === selectedPlayerId);

  const [isModalOpen, setIsModalOpen] = useState(false);


  const [activeTab, setActiveTab] = useState("men")
  if (!users) {
    return (
      <div>
        Edetabel hetkel puudub
      </div>
    )
  }


  const filteredUsers = users
    .filter((user) => {
      if (activeTab === "combined") return true;
      if (activeTab === "men") return user.sex === "M";
      if (activeTab === "women") return user.sex === "N";
      return true;
    })
    .sort((a, b) => {
      return b.rate_points - a.rate_points;
    });

  return (
    <div className='h-full flex flex-col relative space-y-1'>
      <div className="w-fit bg-[#F0F4F7] rounded-[2px]">
        <Tabs
          defaultValue="men"
          value={activeTab}
          onValueChange={setActiveTab}
          className=""
        >
          <TabsList className=" flex justify-start py-2 px-2 w-[32rem]">
            <TabsTrigger value="women" className="rounded-[4px] flex-1 px-4 w-1/3">
              {t('rating.filtering.buttons.women')}
            </TabsTrigger>
            <TabsTrigger value="men" className="rounded-[4px] flex-1 w-1/3">
              {t('rating.filtering.buttons.men')}
            </TabsTrigger>
            <TabsTrigger value="combined" className="rounded-[4px] flex-1 w-1/3">
              {t('rating.filtering.buttons.combined')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full w-full overflow-auto pr-4 rounded-t-[2px]">
          <Table className="w-full mx-auto border-collapse shadow-lg ">
            <TableHeader className="">
              <TableRow className="bg-white ">
                <TableHead className="px-6 py-3 text-left font-meidum">#</TableHead>
                <TableHead className="px-6 py-3 text-left font-meidum">Player</TableHead>
                <TableHead className="px-6 py-3 text-left font-meidum">{t('rating.table.head.club')}</TableHead>
                <TableHead className="px-6 py-3 text-left font-meidum">RP</TableHead>
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
                  <TableCell
                    className="px-6 py-3 text-sm cursor-pointer font-medium text-[#0A67D7]"
                    onClick={() => {
                      setSelectedPlayerId(user.id);
                      setIsModalOpen(true);
                    }}
                  >
                    {`${user.last_name} ${user.first_name}`}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm">{user.club_name}</TableCell>

                  <TableCell className="px-6 py-3 text-sm font-bold">{user.rate_points}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <div className="absolute top-0 left-0 w-full">
        <PlayerProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          player={selectedPlayer || null}
        />
      </div>
    </div>
  )
}

export default RatingWidget
