import {useState} from 'react'
import {ScrollArea} from "@/components/ui/scroll-area";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import { PlayerProfileModal } from '../reiting/-components/player-profile-modal';
import { mockUsers } from '@/lib/mock_data/rating_mocks';
import { useTranslation } from "react-i18next";

const RatingWidget = () => {
    const { t } = useTranslation();

    const [sex, setSex] = useState("M")
    const [showCombined, setShowCombined] = useState(false);


    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
    const selectedPlayer = mockUsers.find((user) => user.ID === selectedPlayerId);

    const [isModalOpen, setIsModalOpen] = useState(false); 

    const filteredUsers = mockUsers.filter((user) => {
        const matchesSex = showCombined || sex === "" || user.sex === sex; 
        return matchesSex
    })
    
  return (
    <div className='h-full flex flex-col'>
        <div className="py-6 flex justify-center">
            <div className='flex flex-row gap-1 w-fit p-1 rounded-[4px] bg-[#F0F4F7]'>
              <Button
                variant={sex === 'N' ? 'default' : 'outline'}
                onClick={() => { 
                  setSex('N');
                  setShowCombined(false);
                }}
                className="shadow-selectedFilter rounded-[4px]"
              >
                {t('rating.filtering.buttons.women')}
              </Button>
              <Button
                variant={sex === 'M' ? 'default' : 'outline'}
                onClick={() => { 
                  setSex('M');
                  setShowCombined(false);
                }}
                className="shadow-selectedFilter rounded-[4px]"
              > 
                {t('rating.filtering.buttons.men')}
              </Button>
              <Button
                variant={showCombined ? 'default' : 'outline'}
                onClick={() => setShowCombined(true)}
                className="shadow-selectedFilter rounded-[4px]"
              > 
                {t('rating.filtering.buttons.combined')}
              </Button>
              </div>
        </div>
        <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full w-full overflow-auto rounded-t-lg">
        <Table className="w-full mx-auto border-collapse rounded-t-lg shadow-lg">
              <TableHeader className="rounded-lg">
                <TableRow className="bg-gradient-to-r from-stone-100 to-[#F9F9FB]">
                  <TableHead className="px-6 py-3 text-left font-bold">NR</TableHead>
                  <TableHead className="px-6 py-3 text-left font-bold">RP</TableHead>
                  <TableHead className="px-6 py-3 text-left font-bold">{t('rating.table.head.last_name')}</TableHead>
                  <TableHead className="px-6 py-3 text-left font-bold">{t('rating.table.head.first_name')}</TableHead>
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
                    <TableCell className="px-6 py-3 text-sm">{user.rating_points}</TableCell>
                    <TableCell className="px-6 py-3 text-sm">{user.last_name}</TableCell>
                    <TableCell className="px-6 py-3 text-sm">{user.first_name}</TableCell>
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
          </div>
          <PlayerProfileModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            player={selectedPlayer || null} 
          />
    </div>
  )
}

export default RatingWidget
