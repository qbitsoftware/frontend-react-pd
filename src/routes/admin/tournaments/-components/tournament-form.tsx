import { useState, useRef, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useRouter } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  UsePostTournament,
  UsePatchTournament,
  UseDeleteTournament,
  UseGetTournamentCategories,
} from "@/queries/tournaments"
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
import { YooptaContentValue } from "@yoopta/editor"
import Editor from "../../-components/yooptaeditor"
import { t, TFunction } from "i18next"
import { Tournament } from "@/types/tournaments"
import { toast } from "sonner"

const createFormSchema = (t: TFunction) => z.object({
  name: z.string().min(4, { message: t("admin.tournaments.create_tournament.errors.name_min") }).max(40, { message: t("admin.tournaments.create_tournament.errors.name_max") }),
  start_date: z.date({ message: t("admin.tournaments.create_tournament.errors.start_date") }),
  end_date: z.date({ message: t("admin.tournaments.create_tournament.errors.end_date") }),
  sport: z.string({ message: t("admin.tournaments.create_tournament.errors.sport") }),
  total_tables: z.number().min(1, { message: t("admin.tournaments.create_tournament.errors.total_tables") }),
  category: z.string({ message: t("admin.tournaments.create_tournament.errors.category") }),
  location: z.string().min(1, { message: t("admin.tournaments.create_tournament.errors.location") }),
  information: z.any(),
  private: z.boolean(),
  calc_rating: z.boolean(),
})

export type TournamentFormValues = z.infer<ReturnType<typeof createFormSchema>>

interface TournamentFormProps {
  initial_data: Tournament | undefined | null
}

export const TournamentForm: React.FC<TournamentFormProps> = ({ initial_data }) => {
  const { t } = useTranslation()
  const [value, setValue] = useState<YooptaContentValue | undefined>(
    initial_data && initial_data.information ? JSON.parse(initial_data?.information) : undefined
  );
  const formSchema = createFormSchema(t)

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
        total_tables: 1,
        sport: "",
        location: "",
        category: "",
        information: "",
        private: false,
        calc_rating: false,
      },
  })

  const [showDeleteDialog, setShowDeleteDialog] = useStateOriginal(false)
  const deleteMutation = UseDeleteTournament(initial_data?.id)
  const { data: tournament_categories } = UseGetTournamentCategories()
  const router = useRouter()

  let postMutation = UsePostTournament()
  if (initial_data) {
    postMutation = UsePatchTournament(initial_data.id)
  }

  useEffect(() => {
    if (initial_data && initial_data.information != "") {
      setValue(JSON.parse(initial_data.information))
    }
  }, [initial_data])

  const onSubmit = async (values: TournamentFormValues) => {
    try {
      values.information = JSON.stringify(value)
      const result = await postMutation.mutateAsync(values)
      if (initial_data) {
        toast.message(t('toasts.tournaments.updated'))
      } else {
        if (result.data) {
          router.navigate({ to: `/admin/tournaments/${result.data.id}`, replace: true })
        } else {
          router.navigate({ to: `/admin/tournaments`, replace: true })
        }
        toast.error(t('toasts.tournaments.created'))
      }
    } catch (error) {
      void error
      if (initial_data) {
        toast.message(t('toasts.tournaments.updated_error'))
      } else {
        toast.error(t('toasts.tournaments.created_error'))
      }
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync()
      router.navigate({
        to: `/admin/tournaments`,
        replace: true,
      })
      toast.message(t('toasts.tournaments.deleted'))
      setShowDeleteDialog(false)
    } catch (error) {
      void error;
      toast.error(t('toasts.tournaments.deleted_error'))
    }
  }


  return (
    <div className="">
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


      <Card className="w-full shadow-none border-none bg-transparent ">
        <CardHeader className="px-0 ">

          <h5 className="font-medium">
            {initial_data
              ? t("admin.tournaments.create_tournament.title_edit")
              : t("admin.tournaments.create_tournament.title_create")}
          </h5>
        </CardHeader>
        <CardContent className="p-4 rounded-lg bg-card border border-stone-100 shadow-sm">
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
                    <FormItem className="flex flex-col">
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
                  name="category"
                  render={({ field }) => (
                    <CategoryInput field={field} categories={tournament_categories?.data || []} />
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="total_tables"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("admin.tournaments.create_tournament.number_of_tables")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("admin.tournaments.create_tournament.number_of_tables_placeholder")}
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
                name="calc_rating"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">{t("admin.tournaments.create_tournament.ranking")}</FormLabel>
                      <FormDescription>
                        {t("admin.tournaments.create_tournament.ranking_description")}
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

              {/* Pane siiia */}
              <div className="w-full flex flex-col gap-4">
                <p className="text-sm">{t("admin.tournaments.create_tournament.additional_information")} </p>

                <Editor value={value} setValue={setValue} readOnly={false} />
              </div>
              <div className="flex flex-col-reverse gap-10 md:gap-4 md:flex-row md:justify-between ">
                {initial_data && (
                  <Button type="button" className="text-red-600" onClick={() => setShowDeleteDialog(true)} variant={"outline"}>
                    {t("admin.tournaments.delete")}
                  </Button>
                )}
                <Button type="submit" className="md:w-[200px] w-full">
                  {initial_data
                    ? t("admin.tournaments.create_tournament.button_edit")
                    : t("admin.tournaments.create_tournament.button_create")}
                </Button>

              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

function CategoryInput({
  field,
  categories,
}: {
  field: { value: string; onChange: (v: string) => void }
  categories: { category: string }[]
}) {
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

  const filteredCategories = categories.filter((cat) =>
    cat.category.toLowerCase().startsWith(inputValue.toLowerCase()),
  )

  return (
    <FormItem className="flex flex-col">
      <FormLabel>{t("admin.tournaments.create_tournament.category")}</FormLabel>
      <div className="relative">
        <FormControl>
          <Input
            ref={inputRef}
            placeholder={t("admin.tournaments.create_tournament.category_placeholder")}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
        </FormControl>
        {showSuggestions && filteredCategories.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
            {filteredCategories.map((cat) => (
              <li
                key={cat.category}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSuggestionClick(cat.category)}
              >
                {cat.category}
              </li>
            ))}
          </ul>
        )}
      </div>
      <FormMessage />
    </FormItem>
  )
}