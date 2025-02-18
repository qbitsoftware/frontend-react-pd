// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import React from 'react'
// import { StatisticsCard } from './statistics-card'
// import { MatchWithTeamAndSets, User } from "@/types/types"
// import { Dispatch } from 'react'
// import { SetStateAction } from 'react'

// interface StatsiticDialogProps {
//     protocol: MatchWithTeamAndSets
//     players: User[]
//     isOpen: boolean
//     setIsOpen: Dispatch<SetStateAction<boolean>>
//   index: number
// }


// export const StatisticsDialog: React.FC<StatsiticDialogProps> = ({ protocol, players, isOpen, setIsOpen, index }) => {
//     return (
//         <Dialog open={isOpen} onOpenChange={setIsOpen} >
//             <DialogContent className="max-w-4xl max-h-[80vh] md:max-h-[90vh] overflow-y-auto px-0 sm:px-2 md:px-4">
//                 <DialogHeader>
//                     <DialogTitle>Mängu statistika</DialogTitle>
//                     <DialogDescription>
//                         Detailne ülevaade mängude tulemustest
//                     </DialogDescription>
//                 </DialogHeader>
//                 <div className='flex flex-col mt-6'>
//                     <StatisticsCard protocol={protocol} players={players} index={index} />
//                 </div>
//             </DialogContent>
//         </Dialog>
//     )
// }