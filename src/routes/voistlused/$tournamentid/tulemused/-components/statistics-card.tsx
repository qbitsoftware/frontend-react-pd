// import { Badge } from '@/components/ui/badge'
// import { Card, CardContent, CardHeader } from '@/components/ui/card'
// import { Separator } from '@/components/ui/separator'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import Notes from './notes'
// import { MatchWithTeamAndSets, User } from '@/types/types'
// import { capitalizeName } from '@/lib/utils'

// interface StatsiticProps {
//     protocol: MatchWithTeamAndSets
//     players: User[]
//     index: number
// }

// export const StatisticsCard = ({ protocol, players, index }: StatsiticProps) => {

//     const getPlayerNameById = (id: number) => {
//         const player = players.find(player => player.ID === id)
//         return player ? `${capitalizeName(player.first_name)} ${capitalizeName(player.last_name)}` : 'Tundmatu mängija'
//     }
//     let team1TotalWins: number = 0;
//     let team2TotalWins: number = 0;

//     return (
//         <Card key={index} className="w-full max-w-6xl mx-auto mb-[55px]">
//             <CardHeader>
//                 <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-2 ">
//                     <Badge variant="outline" className="text-sm">
//                         Kuupäev: {protocol.match_with_team.start_date ? new Date(protocol.match_with_team.start_date).toLocaleDateString('et-EE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Invalid date'}
//                     </Badge>
//                     <div className="text-xl flex font-semibold text-center items-center">
//                         <span className='flex items-center mr-[10px]'><div className='w-[12px] h-[12px] bg-[#0f172a] rounded-full' /></span>{protocol.match_with_team.p1_team_name} vs {protocol.match_with_team.p2_team_name} <span className=' ml-[10px] flex items-center'><div className='w-[13px] h-[13px] rounded-full bg-[#f1f5f9] border-[1px] border-black' /> </span>
//                     </div>
//                     <Badge variant="outline" className="text-sm">
//                         Kellaaeg: {protocol.match_with_team.start_date ? new Date(protocol.match_with_team.start_date).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' }) : 'Invalid time'}
//                     </Badge>
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 <div className="overflow-x-auto">
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead className="w-[50px]" >Mäng</TableHead>
//                                 <TableHead>{protocol.match_with_team.p1_team_name}</TableHead>
//                                 <TableHead>{protocol.match_with_team.p2_team_name}</TableHead>
//                                 <TableHead className="text-center">Setid</TableHead>
//                                 <TableHead className="text-center">Skoor</TableHead>
//                                 <TableHead className="text-center">Kokku</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {protocol.player_matches.map((match, index) => (
//                                 <TableRow key={index}>
//                                     <TableCell className=''>{index + 1}</TableCell>
//                                     <TableCell>
//                                         {index <= 2
//                                             ? `${String.fromCharCode(65 + index)}: ${getPlayerNameById(match.match.p1_id)}`
//                                             : index === 3
//                                                 ? `Paar: ${getPlayerNameById(match.match.p1_id)} & ${getPlayerNameById(match.match.p1_id_2)}`
//                                                 : `${String.fromCharCode(62 + index)}: ${getPlayerNameById(match.match.p1_id)}`}
//                                     </TableCell>
//                                     <TableCell>
//                                         {index === 0
//                                             ? `Y: ${getPlayerNameById(match.match.p2_id)}`
//                                             : index === 1
//                                                 ? `X: ${getPlayerNameById(match.match.p2_id)}`
//                                                 : index === 2
//                                                     ? `Z: ${getPlayerNameById(match.match.p2_id)}`
//                                                     : index === 3
//                                                         ? `Paar: ${getPlayerNameById(match.match.p2_id)} & ${getPlayerNameById(match.match.p2_id_2)}`
//                                                         : `${String.fromCharCode(84 + index)}: ${getPlayerNameById(match.match.p2_id)}`}
//                                     </TableCell>
//                                     <TableCell>
//                                         <div className="flex flex-wrap gap-1 min-w-[60px]">
//                                             {match.sets.map((set, gameIndex) => {
//                                                 if (set.team_1_score !== 0 || set.team_2_score !== 0) {
//                                                     return (
//                                                         <Badge
//                                                             key={gameIndex}
//                                                             variant={set.team_1_score > set.team_2_score ? "default" : "outline"}
//                                                             className={set.team_1_score > set.team_2_score ? "" : "bg-[#f1f4f9]"}
//                                                         >
//                                                             {`${set.team_1_score} - ${set.team_2_score}`}
//                                                         </Badge>
//                                                     )
//                                                 }
//                                                 return null
//                                             })}
//                                         </div>
//                                     </TableCell>
//                                     <TableCell className="text-center">
//                                         {match.player_1_score} - {match.player_2_score}
//                                     </TableCell>
//                                     <TableCell className="text-center">
//                                         {(() => {
//                                             if (match.player_1_score > match.player_2_score) {
//                                                 team1TotalWins++
//                                             } else if (match.player_2_score > match.player_1_score) {
//                                                 team2TotalWins++
//                                             }
//                                             return `${team1TotalWins} - ${team2TotalWins}`
//                                         })()}
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </div>
//                 <Separator className='w-full mb-4 h-[1px] bg-black/10' />
//                 <Notes content={protocol.team_match.notes} />
//                 <div className='flex flex-col sm:flex-row justify-between text-black/70 py-4'>
//                     <p><span>Lauakohtunik: </span>{protocol.match_with_team.table_referee}</p>
//                     <p><span>Peakohtunik: </span>{protocol.match_with_team.head_referee}</p>
//                 </div>
//                 <div className="mt-6 text-xl font-semibold text-center">
//                     <span>Lõpp skoor: </span>
//                     <span className="text-gray-800">{protocol.match_with_team.p1_team_name}</span>
//                     <span className="font-bold mx-2">{team1TotalWins} - {team2TotalWins}</span>
//                     <span className="text-gray-800">{protocol.match_with_team.p2_team_name}</span>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

