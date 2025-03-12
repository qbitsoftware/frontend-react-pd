import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Camera, CheckCircle } from 'lucide-react'

// Define an interface for game day data
// interface GameDay {
//   id: number
//   name: string
// }

export const Route = createFileRoute(
  '/admin/tournaments/$tournamentid/pildid/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  // const [gameDays, setGameDays] = useState<GameDay[]>([])
  // const [activeTab, setActiveTab] = useState('1')
  // const [editingTabId, setEditingTabId] = useState<number | null>(null)
  // const [editName, setEditName] = useState('')

  // const addGameDay = () => {
  //   const nextDayId =
  //     gameDays.length > 0 ? Math.max(...gameDays.map((day) => day.id)) + 1 : 1
  //   const newDay = { id: nextDayId, name: `Päev ${nextDayId}` }
  //   setGameDays([...gameDays, newDay])
  //   setActiveTab(nextDayId.toString())
  //   setEditingTabId(nextDayId)
  //   setEditName(newDay.name)
  // }

  // const removeGameDay = (idToRemove: number) => {
  //   const updatedDays = gameDays.filter((day) => day.id !== idToRemove)
  //   setGameDays(updatedDays)

  //   if (activeTab === idToRemove.toString()) {
  //     if (updatedDays.length > 0) {
  //       setActiveTab(updatedDays[0].id.toString())
  //     } else {
  //       setActiveTab('1')
  //     }
  //   }

  //   if (editingTabId === idToRemove) {
  //     setEditingTabId(null)
  //   }
  // }

  // const startEditing = (day: GameDay, e: React.MouseEvent) => {
  //   e.stopPropagation()
  //   setEditingTabId(day.id)
  //   setEditName(day.name)
  // }

  // const saveTabName = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (editingTabId !== null) {
  //     setGameDays(
  //       gameDays.map((day) =>
  //         day.id === editingTabId
  //           ? { ...day, name: editName || `Päev ${day.id}` }
  //           : day,
  //       ),
  //     )
  //     setEditingTabId(null)
  //   }
  // }

  return (
    <div className="px-10 pt-4 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6 bg-primary/10 p-8 rounded-full inline-flex">
          <Camera className="h-16 w-16 text-primary" />
        </div>

        <h2 className="text-2xl font-bold mb-4">Galerii tulemas peagi</h2>

        <p className="text-muted-foreground mb-6">
          Võistluse fotogalerii funktsionaalsus on arendamisel ja saab peagi valmis.
          Tulevikus saate siia üles laadida võistluspäevade pilte.
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Piltide üleslaadimine ja haldamine</span>
          </div>
          <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Fotode grupeerimine päevade kaupa</span>
          </div>
          <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Automaatne piltide komprimeerimine ja optimeerimine</span>
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Tagasi
          </Button>
        </div>
      </div>
    </div>


    // <div className='px-10 pt-4'>
    //   <div className="flex justify-between items-center mb-4">
    //     <p className="text-md font-bold">Mängu päevad</p>
    //     <Button
    //       onClick={addGameDay}
    //       variant="outline"
    //       size="sm"
    //       className="flex items-center gap-1"
    //     >
    //       <PlusCircle className="h-4 w-4" /> Lisa päev
    //     </Button>
    //   </div>
    //   <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
    //     <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-10 md:mb-4 md:mt-10">
    //       {gameDays.map((day) => (
    //         <div key={day.id} className="relative group">
    //           {editingTabId === day.id ? (
    //             <form
    //               onSubmit={saveTabName}
    //               className="w-full"
    //               onClick={(e) => e.stopPropagation()}
    //             >
    //               <Input
    //                 value={editName}
    //                 onChange={(e) => setEditName(e.target.value)}
    //                 autoFocus
    //                 className="h-8 text-xs sm:text-sm py-1 px-2"
    //                 onBlur={saveTabName}
    //               />
    //             </form>
    //           ) : (
    //             <TabsTrigger
    //               value={day.id.toString()}
    //               className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm py-2 px-2 sm:px-4 w-full"
    //             >
    //               {day.name}
    //               <Button
    //                 variant="ghost"
    //                 size="icon"
    //                 className="ml-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
    //                 onClick={(e) => startEditing(day, e)}
    //               >
    //                 <Edit2 className="h-3 w-3" />
    //               </Button>
    //             </TabsTrigger>
    //           )}
    //           <Button
    //             variant="ghost"
    //             size="icon"
    //             className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
    //             onClick={(e) => {
    //               e.stopPropagation()
    //               removeGameDay(day.id)
    //             }}
    //           >
    //             <Trash2 className="h-3 w-3" />
    //           </Button>
    //         </div>
    //       ))}
    //     </TabsList>
    //     {gameDays.map((day) => (
    //       <TabsContent key={day.id} value={day.id.toString()}>
    //         <div className="">
    //           <ImageUpload tournament_id={Number(1)} gameDay={String(day.id)} />
    //         </div>
    //       </TabsContent>
    //     ))}
    //   </Tabs>
    // </div>
  )
}
