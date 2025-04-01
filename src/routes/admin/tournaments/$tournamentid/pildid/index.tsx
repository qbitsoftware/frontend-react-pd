import { createFileRoute, useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Edit2, Plus, Trash2, Calendar } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { useState } from 'react';
import { usePostGameDay, useGetGamedaysOptions, usePatchGameDay, useDeleteGameday, useDeleteGamedayImage } from '@/queries/images'
import { Gameday } from '@/types/types'
import { useToast } from "@/hooks/use-toast"
import { useToastNotification } from "@/components/toast-notification"
import ImageUpload from './-components/image-upload'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

  const [activeTab, setActiveTab] = useState(() => {
    if (gamedaysData?.data && gamedaysData.data.length > 0) {
      const sortedGamedays = [...gamedaysData.data].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateA - dateB
      })
      return sortedGamedays[0].id.toString()
    }
    return ''
  })
  const [editingGameday, setEditingGameday] = useState<Gameday | null>(null)
  const [editName, setEditName] = useState('')
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [gamedayToDelete, setGamedayToDelete] = useState<number | null>(null)

  const params = useParams({ "from": Route.id })
  const postGamedayMutation = usePostGameDay(Number(params.tournamentid))
  const patchGamedayMutation = usePatchGameDay(Number(params.tournamentid))
  const removeGameDayMutation = useDeleteGameday(Number(params.tournamentid))
  const deleteImageMutation = useDeleteGamedayImage(Number(params.tournamentid), () => Number(activeTab))

  const toast = useToast()
  const { successToast, errorToast } = useToastNotification(toast)

  const addGameDay = () => {
    try {
      const now = new Date().toISOString()

      const gameday: Gameday = {
        created_at: now,
        id: 1,
        name: `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`,
        tournament_id: Number(params.tournamentid),
        images: [],
      }
      postGamedayMutation.mutateAsync(gameday)
      successToast("Mängupäev edukalt lisatud")
    } catch (error) {
      console.error('Error adding game day:', error)
      errorToast("Mängupäeva lisamine ebaõnnestus")
    }
  }

  const confirmDeleteGameDay = (idToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setGamedayToDelete(idToRemove)
    setDeleteConfirmOpen(true)
  }

  const removeGameDay = () => {
    if (gamedayToDelete === null) return

    try {
      removeGameDayMutation.mutateAsync(gamedayToDelete)
      successToast("Mängupäev edukalt eemaldatud")
    } catch (error) {
      console.error("Error deleting gameday", error)
      errorToast("Mängupäeva eemaldamine ebaõnnestus")
    } finally {
      setDeleteConfirmOpen(false)
      setGamedayToDelete(null)
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
        successToast("Mängupäeva nimi muudetud")
      } catch (error) {
        console.error("Failed to update", error)
        errorToast("Mängupäeva nime muutmine ebaõnnestus")
      }
    }
  }

  if (!gamedaysData || !gamedaysData.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laadin mängupäevi...</p>
        </div>
      </div>
    )
  }

  const gamedays = [...gamedaysData.data].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateA - dateB
  })

  const deleteImage = (imageId: number) => {
    deleteImageMutation.mutate(imageId, {
      onSuccess: () => {
        successToast("Pilt edukalt eemaldatud")
      },
      onError: (error) => {
        void error;
        errorToast("Pildi eemaldamine ebaõnnestus")
      }
    });
  };



  return (
    <div className='px-6 md:px-10 py-6 w-full'>
      <div className="flex justify-between items-center mb-6">
        <h5 className="font-bold">Mängupäevad</h5>
        <Button
          onClick={addGameDay}
          variant="default"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Uus mängupäev
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className='overflow-x-auto pb-1'>
          <TabsList className=" flex justify-start items-start gap-1 flex-wrap h-auto p-1 bg-muted/50">
            {gamedays && gamedays.map((day) => (
              <div key={day.id} className="relative group border rounded-md ">
                {editingGameday && editingGameday.id === day.id ? (
                  <form
                    onSubmit={saveTabName}
                    className="w-full px-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      className="py-1 px-3 text-base text-stone-800 h-9"
                      onBlur={saveTabName}
                    />
                  </form>
                ) : (
                  <div key={day.id} className="relative group border rounded-md flex items-center">
                    <TabsTrigger
                      value={day.id.toString()}
                      className="text-base px-10 py-2 h-9"
                    >
                      <span>{day.name}</span>
                    </TabsTrigger>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 absolute right-2">
                      <Button
                        type="button"
                        className="h-7 w-7 rounded-full hover:bg-gray-200 flex items-center justify-center"
                        onClick={(e) => startEditing(day, e)}
                        title="Muuda"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        className="h-7 w-7 rounded-full hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center"
                        onClick={(e) => confirmDeleteGameDay(day.id, e)}
                        title="Kustuta"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </TabsList>
        </div>

        {gamedays && gamedays.map((day) => (
          <TabsContent key={day.id} value={day.id.toString()} className="rounded-md pt-2">
            <div className="border border-muted rounded-md p-6 min-h-[200px] bg-card shadow-sm">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-medium">{day.name}</h3>
                </div>
                <ImageUpload tournament_id={Number(params.tournamentid)} gameDay={day.id} />
              </div>

              {day.images && day.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {day.images.map((img, idx) => (
                    <div key={idx} className="relative rounded-md overflow-hidden border border-muted">
                      <img
                        src={img.image_url}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteImage(img.id)}
                        title="Kustuta pilt"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Sellele mängupäevale pole veel pilte lisatud</p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kas oled kindel?</AlertDialogTitle>
            <AlertDialogDescription>
              See tegevus kustutab mängupäeva ja kõik sellega seotud pildid. Seda toimingut ei saa tagasi võtta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Loobu</AlertDialogCancel>
            <AlertDialogAction onClick={removeGameDay} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Kustuta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}