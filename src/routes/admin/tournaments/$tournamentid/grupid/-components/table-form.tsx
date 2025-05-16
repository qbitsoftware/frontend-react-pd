import Loader from '@/components/loader'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { UseDeleteTournamentTable, UsePatchTournamentTable, UsePostTournamentTable } from '@/queries/tables'
import { UseGetTournamentSizes, UseGetTournamentTypes } from '@/queries/tournaments'
import { TournamentTable } from '@/types/groups'
import { GroupType } from '@/types/matches'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from '@tanstack/react-router'
import { TFunction } from 'i18next'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { toast } from 'sonner'
import { Slider } from '@/components/ui/slider'


const createFormSchema = (t: TFunction) => z.object({
  class: z.string().min(1, t('admin.tournaments.groups.errors.class')),
  type: z.string().min(1, t('admin.tournaments.groups.errors.type')),
  solo: z.boolean(),
  min_team_size: z.number().optional(),
  max_team_size: z.number().optional(),
  woman_weight: z.number().min(1).max(10),
  size: z.number(),
}).superRefine((data, ctx) => {
  if (data.solo) return;

  if (data.min_team_size === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('admin.tournaments.groups.errors.min_team_size'),
      path: ['min_team_size']
    });
  } else if (data.min_team_size < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('admin.tournaments.groups.errors.min_team_size'),
      path: ['min_team_size']
    });
  }

  if (data.max_team_size === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('admin.tournaments.groups.errors.min_team_size'),
      path: ['max_team_size']
    });
  } else if (data.max_team_size < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('admin.tournaments.groups.errors.min_team_size'),
      path: ['max_team_size']
    });
  }
});

export type TournamentTableForm = z.infer<ReturnType<typeof createFormSchema>>

interface TableFormProps {
  initial_data: TournamentTable | undefined
}

export const TournamentTableForm: React.FC<TableFormProps> = ({ initial_data }) => {

  const { t } = useTranslation()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [customSize, setCustomSize] = useState("");
  const formSchema = createFormSchema(t)

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
        min_team_size: 2,
        max_team_size: 2,
        size: 16,
        woman_weight: 1,
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
        toast.message(t('toasts.tournament_tables.updated'))
        router.navigate({
          to: `/admin/tournaments/${tournamentid}/grupid/${initial_data.id}/`,
        })
      } else {
        toast.message(t('toasts.tournament_tables.created'))
        router.navigate({
          to: `/admin/tournaments/${tournamentid}/grupid/${res.data.id}/`,
        })
      }
    } catch (error) {
      if (initial_data) {
        toast.error(t('toasts.tournament_tables.updated_error'))
      } else {
        toast.error(t('toasts.tournament_tables.created_error'))
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
      toast.message(t('toasts.tournament_tables.deleted'))
      setShowDeleteDialog(false)
    } catch (error) {
      void error
      toast.error(t('toasts.tournament_tables.deleted_error'))
    }
  }

  return (
    <div className=''>
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
      <Card className="w-full border-stone-100">
        <CardHeader className=''>
          <h5 className="font-medium">
            {initial_data ? t("admin.tournaments.create_tournament.edit_group") : t("admin.tournaments.create_tournament.create_group")}
          </h5>
        </CardHeader>
        <CardContent className='px-8'>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.tournaments.create_tournament.class")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("admin.tournaments.create_tournament.class_placeholder")} {...field} />
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
                          {tournament_types && tournament_types.data && tournament_types.data.map((type) => {
                            return (
                              <SelectItem key={type.id} value={type.name}>
                                {t(`admin.tournaments.create_tournament.tournament_tables.${type.name}`)}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("type") === GroupType.ROUND_ROBIN || form.watch("type") === GroupType.ROUND_ROBIN_FULL_PLACEMENT ? (
                  <FormItem>
                    <FormLabel>{t("admin.tournaments.create_tournament.group_amount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        id="tournamentSize"
                        placeholder={initial_data?.size?.toString() || t("admin.tournaments.create_tournament.number_of_groups_placeholder")}
                        value={customSize}
                        onChange={(e) => {
                          const numValue = parseInt(e.target.value, 10) || 0;
                          setCustomSize(e.target.value);
                          form.setValue("size", numValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) : form.watch("type") === GroupType.CHAMPIONS_LEAGUE ? <div></div> : (
                  <FormItem>
                    <FormLabel>{t("admin.tournaments.create_tournament.tournament_size")}</FormLabel>
                    <Select
                      onValueChange={(value) => form.setValue("size", Number.parseInt(value, 10))}
                      defaultValue={String(form.getValues().size || "")}
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
                        {tournament_sizes && tournament_sizes.data && tournament_sizes.data.map((size) => {
                          if (size.size == 24 && !(form.watch("type") == GroupType.DOUBLE_ELIM_TABLETENNIS || form.watch("type") == GroupType.DOUBLE_ELIM_TABLETENNIS_TOP_HEAVY)) {
                            return null
                          }
                          return (
                            <SelectItem key={size.id} value={String(size.size)}>
                              {size.size}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}

                <FormField
                  control={form.control}
                  name="solo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-3">
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
                          type="text"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(0);
                            } else {
                              const cleanedValue = value.replace(/^0+/, '');
                              field.onChange(cleanedValue === '' ? 0 : Number.parseInt(cleanedValue));
                            }
                          }}
                          value={field.value === 0 ? '' : field.value}
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
                          type="text"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(0);
                            } else {
                              const cleanedValue = value.replace(/^0+/, '');
                              field.onChange(cleanedValue === '' ? 0 : Number.parseInt(cleanedValue));
                            }
                          }}
                          value={field.value === 0 ? '' : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <FormField
                control={form.control}
                name="woman_weight"
                render={({ field }) => (
                  < FormItem className="w-[1/2]">
                    <FormLabel>{t("admin.tournaments.create_tournament.woman_weight")}</FormLabel>
                    <div className="grid grid-cols-[1fr,80px] items-center gap-4">
                      <FormControl>
                        <Slider
                          min={1}
                          max={10}
                          step={0.1}
                          value={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                          className="pt-2"
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          type='number'
                          min={1}
                          max={10}
                          step={0.1}
                          value={typeof field.value === 'number' ? field.value : 1}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value) && value >= 1 && value <= 10) {
                              field.onChange(value);
                            } else if (e.target.value === '') {
                              field.onChange(1);
                            }
                          }}
                          className="w-20"
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      {t("admin.tournaments.create_tournament.woman_weight_description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <div className="flex justify-between gap-4 mt-10">
                {initial_data && (
                  <Button type="button" className="text-red-600" onClick={() => setShowDeleteDialog(true)} variant={"outline"}>
                    {t("admin.tournaments.create_tournament.title_delete_table")}
                  </Button>
                )}
                <Button type="submit" className="md:w-[200px] w-full">
                  {initial_data
                    ? t("admin.tournaments.create_tournament.title_edit_table")
                    : t("admin.tournaments.create_tournament.title_create_table")}
                </Button>

              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div >
  )
}



export default TournamentTableForm