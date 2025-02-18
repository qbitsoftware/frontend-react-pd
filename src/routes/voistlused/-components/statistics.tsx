// "use client"

// import { useEffect, useState } from 'react'
// import { Card, CardHeader, CardContent } from "@/components/ui/card"
// import { StatisticsCard } from './statistics-card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { PlayerResponse } from '@/queries/players'
// import { ProtocolResponse } from '@/queries/protocols'

// interface StatisticProps {
//   statisticsData: ProtocolResponse
//   playersResponse: PlayerResponse
// }

// export default function Statistics({ statisticsData, playersResponse }: StatisticProps) {

//   const [uniqueDates, setUniqueDates] = useState<string[]>()
//   const getUniqueDates = (statisticData: ProtocolResponse) => {
//     const uniqueDates = Array.from(
//       new Set(
//         statisticData.data.map(protocol => protocol.match_with_team.start_date.split('T')[0])
//       )
//     );
//     return uniqueDates.reverse()
//   };

//   useEffect(() => {
//     setUniqueDates(getUniqueDates(statisticsData))
//   }, [statisticsData])

//   if (!playersResponse || !uniqueDates) {
//     return (
//       <Card className="w-full max-w-2xl mx-auto mt-12">
//         <CardHeader>
//           <h2 className="text-2xl font-bold text-center">Mängijate laadimisel tekkis viga</h2>
//         </CardHeader>
//         <CardContent>
//           <p className="text-center">Värskendage veebilehte ja proovige uuesti</p>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <div className='px-4'>
//       <Tabs defaultValue={uniqueDates[0]} className='flex flex-col'>
//         <TabsList className='my-6 w-full'>
//           {uniqueDates?.map((date, idx) => (
//             <TabsTrigger key={idx} className='max-w-[200px] w-full' value={date}>Päev {idx + 1}</TabsTrigger>
//           ))}
//         </TabsList>
//         {uniqueDates?.map((date, idx) => (
//           <TabsContent key={idx} value={date} >
//             <div className='flex flex-col'>
//               {statisticsData.data.map((protocol, index) => {
//                 if (protocol.match_with_team.start_date.includes(date)) {
//                   return (
//                     <StatisticsCard key={index} protocol={protocol} players={playersResponse.data} index={index} />
//                   )
//                 }
//               })}
//             </div>
//           </TabsContent>
//         ))}
//       </Tabs>
//     </div>
//   )
// }