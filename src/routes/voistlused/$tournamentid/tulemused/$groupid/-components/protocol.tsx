import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { GroupStatisticsCard } from './group-stage-protocol'
import { StatisticsCard } from './statistics-card'
import { useTranslation } from 'react-i18next'
import { MatchWrapper } from '@/types/matches'

interface ProtocolProps {
    isModalOpen: boolean,
    handleModalChange: (open: boolean) => void
    selectedMatch: MatchWrapper
    isRoundRobinFull: boolean,
    isMeistrikad: boolean,
    groupId: number,
    tournamentId: number
}

const Protocol = ({
    isModalOpen,
    handleModalChange,
    selectedMatch,
    isRoundRobinFull,
    isMeistrikad,
    tournamentId,
    groupId }: ProtocolProps) => {

    const { t } = useTranslation()

    return (
        <Dialog open={isModalOpen} onOpenChange={handleModalChange}>
            <DialogContent
                aria-describedby={`match-protocol-${selectedMatch?.match.id}`}
                className="max-w-[1200px] h-[90vh] px-1 md:p-4 mx-auto flex flex-col"
            >
                <DialogTitle className="text-lg text-center font-semibold">
                    {t("competitions.timetable.match_details")}
                </DialogTitle>

                <div className="flex-1 overflow-auto">
                    {isRoundRobinFull && (
                        <GroupStatisticsCard
                            tournament_id={tournamentId}
                            group_id={groupId}
                            match_id={selectedMatch.match.id}
                            index={selectedMatch.match.round}
                        />
                    )}
                    {isMeistrikad && (
                        <StatisticsCard
                            tournament_id={tournamentId}
                            group_id={groupId}
                            match_id={selectedMatch.match.id}
                            index={selectedMatch.match.round}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Protocol