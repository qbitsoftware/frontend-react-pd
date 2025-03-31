import { createFileRoute, useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Edit2, PlusCircle, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { useState } from 'react';
import { usePostGameDay, useGetGamedaysOptions, usePatchGameDay, useDeleteGameday } from '@/queries/images'
import { Gameday } from '@/types/types'
import { useToast } from "@/hooks/use-toast"
import { useToastNotification } from "@/components/toast-notification"
import ImageUpload from './-components/image-upload'

export const Route = createFileRoute(
  '/admin/tournaments/$tournamentid/pildid/',
)({
  loader: async ({ context: { queryClient }, params }) => {
    let gamedaysData
    try {
      gamedaysData = await queryClient.ensureQueryData(
        useGetGamedaysOptions(Number(params.tournamentid)),
      )
    } catch (error) {
      console.error('Error fetching game days:', error)
    }
    return { gamedaysData }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { gamedaysData } = Route.useLoaderData()

  const [activeTab, setActiveTab] = useState('1')
  const [editingGameday, setEditingGameday] = useState<Gameday | null>(null)
  const [editName, setEditName] = useState('')

  const params = useParams({ "from": Route.id })
  const postGamedayMutation = usePostGameDay(Number(params.tournamentid))
  const patchGamedayMutation = usePatchGameDay(Number(params.tournamentid))
  const removeGameDayMutation = useDeleteGameday(Number(params.tournamentid))

  const toast = useToast()
  const { successToast, errorToast } = useToastNotification(toast)

  const addGameDay = () => {
    try {
      const gameday: Gameday = {
        id: 1,
        name: `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`,
        tournament_id: Number(params.tournamentid),
        images: [],
      }
      postGamedayMutation.mutateAsync(gameday)
      successToast("Gameday successfully added")
    } catch (error) {
      console.error('Error adding game day:', error)
      errorToast("Gameday adding failed")
    }
  }

  const removeGameDay = (idToRemove: number) => {
    try {
      removeGameDayMutation.mutateAsync(idToRemove)
      successToast("Gameday successfully removed")
    } catch (error) {
      console.error("error deleting gameday", error)
      errorToast("Gameday removal failed")
    }
  }

  const startEditing = (day: Gameday, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingGameday(day)
    setEditName(day.name)
  }

  const saveTabName = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingGameday !== null) {
      const updatedGameday: Gameday = {
        id: editingGameday.id,
        name: editName,
        tournament_id: Number(params.tournamentid),
        images: editingGameday.images,
      }
      try {
        patchGamedayMutation.mutateAsync({ formData: updatedGameday, gameday_id: editingGameday.id })
        setEditingGameday(null)
        successToast("Gameday name changed")
      } catch (error) {
        console.error("Failed to update", error)
        errorToast("Gameday name change failed")
      }

    }
  }

  if (!gamedaysData || !gamedaysData.data) {
    return (<div>
      Placeholdeer comp
    </div>)
  }
  const gamedays = gamedaysData.data

  return (
    <div className='px-10 py-4 w-full'>
      <div className="flex justify-between items-center mb-4">
        <p className="text-md font-bold">Mängu päevad</p>
        <Button
          onClick={addGameDay}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" /> Lisa päev
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className='overflow-x-auto'>
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-10 md:mb-4 md:mt-10 ">
            {gamedays && gamedays.map((day) => (
              <div key={day.id} className="relative group">
                {editingGameday && editingGameday.id === day.id ? (
                  <form
                    onSubmit={saveTabName}
                    className="w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      className="h-8 text-xs sm:text-sm py-1 px-2"
                      onBlur={saveTabName}
                    />
                  </form>
                ) : (
                  <div className="relative">
                    <TabsTrigger value={day.id.toString()} className="...">
                      {day.name}
                    </TabsTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 ml-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => startEditing(day, e)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeGameDay(day.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </TabsList>
        </div>
        {gamedays && gamedays.map((day) => (
          <TabsContent key={day.id} value={day.id.toString()}>
            <div className="border rounded-md p-4 min-h-[100px]">
              <ImageUpload tournament_id={Number(params.tournamentid)} gameDay={day.id} />
              <p className="text-sm text-muted-foreground">Game day content for {day.name}</p>

              {day.images && day.images.length > 0 && day.images.map((img, idx) => (
                <img src={img.image_url} alt='test' />

              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
