import Loader from '@/components/loader'
import { useToastNotification } from '@/components/toast-notification'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { UseDeleteTournamentTable, UsePatchTournamentTable, UsePostTournamentTable } from '@/queries/tables'
import { UseGetTournamentSizes, UseGetTournamentTypes } from '@/queries/tournaments'
import { TournamentTable } from '@/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const formSchema = z.object({
  class: z.string(),
  type: z.string(),
  solo: z.boolean(),
  min_team_size: z.number(),
  max_team_size: z.number(),
  size: z.number(),
})

export type TournamentTableForm = z.infer<typeof formSchema>

interface TableFormProps {
  initial_data: TournamentTable | undefined
}

export const TournamentTableForm: React.FC<TableFormProps> = ({ initial_data }) => {

  const { t } = useTranslation()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const toast = useToast()
  const { successToast, errorToast } = useToastNotification(toast)

  const { tournamentid } = useParams({ strict: false })

  const { data: tournament_sizes, isLoading } = UseGetTournamentSizes()
  const { data: tournament_types, isLoading: isLoadingTypes } = UseGetTournamentTypes()
  const deleteMutation = UseDeleteTournamentTable(Number(tournamentid), initial_data?.id)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initial_data
      ? {
        ...initial_data,
      }
      : {
        class: "",
        type: "",
        solo: false,
        min_team_size: 1,
        max_team_size: 1,
        size: 1,
      },
  })

  let postMutation = UsePostTournamentTable(Number(tournamentid))
  if (initial_data) {
    postMutation = UsePatchTournamentTable(Number(tournamentid), initial_data.id)
  }




  const handleSubmit = async (values: TournamentTableForm) => {
    try {
      const res = await postMutation.mutateAsync(values)
      if (initial_data) {
        successToast("Turniir edukalt uuendatud")
        router.navigate({
          to: `/admin/tournaments/${tournamentid}/grupid/${initial_data.id}/`,
        })
      } else {
        successToast("Turniir edukalt lisatud")
        router.navigate({
          to: `/admin/tournaments/${tournamentid}/grupid/${res.data.id}/`,
        })
      }
    } catch (error) {
      console.log(error)
      if (initial_data) {
        errorToast("Turniiri uuendamisel tekkis viga")
      } else {
        errorToast("Turniiri loomisel tekkis viga")
      }
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync()
      router.navigate({
        to: `/admin/tournaments/${Number(tournamentid)}/grupid/`,
        replace: true,
      })
      successToast("Turniir on edukalt kustutatud")
      setShowDeleteDialog(false)
    } catch (error) {
      errorToast("Turniiri kustutamine ebaõnnestus")
      console.error(error)
    }
  }

  return (
    <div className='py-6'>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.tournaments.confirmations.delete.question")}</AlertDialogTitle>
            <AlertDialogDescription>{t("admin.tournaments.confirmations.delete.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("admin.tournaments.confirmations.delete.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("admin.tournaments.confirmations.delete.deleting")}
                </>
              ) : (
                t("admin.tournaments.confirmations.delete.title")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {initial_data ? "Edit Table" : "Create Table"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Klass</FormLabel>
                      <FormControl>
                        <Input placeholder={"Klass"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.tournaments.create_tournament.type")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("admin.tournaments.create_tournament.type_placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingTypes && (
                            <SelectItem className="flex justify-center items-center" value="loading">
                              <Loader />
                            </SelectItem>
                          )}
                          {tournament_types?.data?.map((type) => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Turniiri suurus"}</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number.parseInt(value, 10))}
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={"Vali turniiri suurus"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoading && (
                            <SelectItem className="flex justify-center items-center" value="loading">
                              <Loader />
                            </SelectItem>
                          )}
                          {tournament_sizes?.data?.map((size) => (
                            <SelectItem key={size.id} value={String(size.size)}>
                              {size.size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="solo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">{t("admin.tournaments.create_tournament.team")}</FormLabel>
                        <FormDescription>{t("admin.tournaments.create_tournament.team_description")}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={!field.value} onCheckedChange={(checked) => field.onChange(!checked)} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", form.getValues().solo ? "hidden" : "")}>
                <FormField
                  control={form.control}
                  name="min_team_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.tournaments.create_tournament.min_team_size")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_team_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.tournaments.create_tournament.max_team_size")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-4 mt-10">
                <Button type="submit" className="md:w-[200px] w-full">
                  {initial_data
                    ? t("admin.tournaments.create_tournament.button_edit")
                    : t("admin.tournaments.create_tournament.button_create")}
                </Button>
                {initial_data && (
                  <Button type="button" onClick={() => setShowDeleteDialog(true)} variant={"destructive"}>
                    Kustuta turniir
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div >
  )
}



export default TournamentTableForm