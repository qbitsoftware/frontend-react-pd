import { useState, useRef, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeft, Loader2 } from "lucide-react"
import { Link, useRouter } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Tournament } from "@/types/types"
import {
  UsePostTournament,
  UsePatchTournament,
  UseDeleteTournament,
  UseGetTournamentSizes,
  UseGetTournamentTypes,
  UseGetTournamentCategories,
} from "@/queries/tournaments"
import { useToast } from "@/hooks/use-toast"
import { useToastNotification } from "@/components/toast-notification"
import { useTranslation } from "react-i18next"
import { useState as useStateOriginal } from "react"
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
import Loader from "@/components/loader"
import { cn } from "@/lib/utils"
import { YooptaContentValue } from "@yoopta/editor"
import Editor from "../../-components/yooptaeditor"

const formSchema = z.object({
  name: z.string().min(4).max(40),
  start_date: z.date(),
  end_date: z.date(),
  type: z.string(),
  tournament_size: z.number(),
  sport: z.string(),
  total_tables: z.number().min(1),
  category: z.string(),
  location: z.string().min(1, { message: "Location is required" }),
  information: z.any(),
  private: z.boolean(),
  solo: z.boolean(),
  min_team_size: z.number().min(1),
  max_team_size: z.number().min(1),
})

export type TournamentFormValues = z.infer<typeof formSchema>

interface TournamentFormProps {
  initial_data: Tournament | undefined | null
}

export const TournamentForm: React.FC<TournamentFormProps> = ({ initial_data }) => {
  const { t } = useTranslation()
  const [value, setValue] = useState<YooptaContentValue>(initial_data && initial_data.information ? JSON.parse(initial_data?.information) : undefined);
  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initial_data
      ? {
        ...initial_data,
        start_date: new Date(initial_data.start_date),
        end_date: new Date(initial_data.end_date),
      }
      : {
        name: "",
        start_date: new Date(),
        end_date: new Date(),
        type: "",
        total_tables: 0,
        tournament_size: 0,
        sport: "",
        location: "",
        category: "",
        information: "",
        private: false,
        solo: true,
        min_team_size: 1,
        max_team_size: 1,
      },
  })

  const [showDeleteDialog, setShowDeleteDialog] = useStateOriginal(false)
  const deleteMutation = UseDeleteTournament(initial_data?.id!)
  const { data: tournament_sizes, isLoading } = UseGetTournamentSizes()
  const { data: tournament_types, isLoading: isLoadingTypes } = UseGetTournamentTypes()
  const { data: tournament_categories, isLoading: isLoadingCategories } = UseGetTournamentCategories()



  const toast = useToast()
  const { successToast, errorToast } = useToastNotification(toast)
  const router = useRouter()

  let postMutation = UsePostTournament()
  if (initial_data) {
    postMutation = UsePatchTournament(initial_data.id)
  }

  useEffect(() => {
    if (initial_data && initial_data.information != "") {
      console.log("initialdata", initial_data.information)
      setValue(JSON.parse(initial_data.information))
    }
  }, [initial_data])

  const onSubmit = async (values: TournamentFormValues) => {
    try {
      values.information = JSON.stringify(value)
      await postMutation.mutateAsync(values)
      if (initial_data) {
        successToast("Turniir edukalt uuendatud")
      } else {
        successToast("Turniir edukalt lisatud")
      }
      router.navigate({
        to: "/admin/tournaments",
      })
    } catch (error) {
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
        to: "/admin/tournaments",
        replace: true,
      })
      successToast("Turniir on edukalt kustutatud")
      setShowDeleteDialog(false)
    } catch (error) {
      errorToast("Turniiri kustutamine ebaõnnestus")
      console.error(error)
    }
  }

  console.log(form.getValues())

  return (
    <div>
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
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <Link href="/admin/tournaments">
          <Button variant="outline" className="flex items-center w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("admin.tournaments.create_tournament.back_button")}
          </Button>
        </Link>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {initial_data
              ? t("admin.tournaments.create_tournament.title_edit")
              : t("admin.tournaments.create_tournament.title_create")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.tournaments.create_tournament.name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("admin.tournaments.create_tournament.name_placeholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.tournaments.create_tournament.sport")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("admin.tournaments.create_tournament.sport_placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tabletennis">
                            {t("admin.tournaments.create_tournament.sport_value.tabletennis")}
                          </SelectItem>
                          <SelectItem value="basketball">
                            {t("admin.tournaments.create_tournament.sport_value.basketball")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("admin.tournaments.create_tournament.start_date")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>{t("admin.tournaments.create_tournament.start_date_placeholder")}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("admin.tournaments.create_tournament.end_date")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>{t("admin.tournaments.create_tournament.start_date_placeholder")}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.tournaments.create_tournament.location")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("admin.tournaments.create_tournament.location_placeholder")} {...field} />
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
              </div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => {
                  const [inputValue, setInputValue] = useState(field.value || "")
                  const [showSuggestions, setShowSuggestions] = useState(false)
                  const inputRef = useRef<HTMLInputElement>(null)

                  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value
                    setInputValue(value)
                    field.onChange(value)
                    setShowSuggestions(true)
                  }

                  const handleSuggestionClick = (category: string) => {
                    setInputValue(category)
                    field.onChange(category)
                    setShowSuggestions(false)
                    inputRef.current?.focus()
                  }

                  const filteredCategories = (tournament_categories?.data || []).filter((category) =>
                    category.category.toLowerCase().startsWith(inputValue.toLowerCase()),
                  )

                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>Category</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            ref={inputRef}
                            placeholder="Type a category"
                            value={inputValue}
                            onChange={handleInputChange}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                          />
                        </FormControl>
                        {showSuggestions && filteredCategories.length > 0 && (
                          <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
                            {filteredCategories.map((category) => (
                              <li
                                key={category.category}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSuggestionClick(category.category)}
                              >
                                {category.category}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tournament_size"
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
                  name="total_tables"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Laudade arv"}</FormLabel>
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
              {/* Pane siiia */}
              <div className="w-full flex flex-col gap-4 ">
                <p className="text-sm">Additional information </p>
                
                <Editor value={value} setValue={setValue} readOnly={false} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="private"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">{t("admin.tournaments.create_tournament.private")}</FormLabel>
                        <FormDescription>
                          {t("admin.tournaments.create_tournament.private_description")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
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
              <div className="flex justify-end gap-4">
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
    </div>
  )
}

