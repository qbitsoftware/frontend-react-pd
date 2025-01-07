import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeft, Plus, Minus } from "lucide-react"
import { Link, useRouter } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tournament } from "@/types/types"
import { UsePostTournament, UsePatchTournament } from "@/queries/tournaments"
import { useToast } from "@/hooks/use-toast"
import { useToastNotification } from "@/components/toast-notification"

const formSchema = z.object({
  name: z.string().min(4).max(40),
  start_date: z.date(),
  end_date: z.date(),
  type: z.string(),
  sport: z.string(),
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

interface CustomField {
  title: string;
  information: string;
}

export const TournamentForm: React.FC<TournamentFormProps> = ({ initial_data }) => {
  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initial_data ? {
      ...initial_data,
      start_date: new Date(initial_data.start_date),
      end_date: new Date(initial_data.end_date),
      information: initial_data.information
        ? (typeof initial_data.information === 'string'
          ? JSON.parse(initial_data.information)
          : initial_data.information)
        : { fields: [] }
    } : {
      name: "",
      start_date: new Date(),
      end_date: new Date(),
      type: "",
      sport: "",
      location: "",
      information: { fields: [] },
      private: false,
      solo: false,
      min_team_size: 1,
      max_team_size: 1,
    },
  })


  const toast = useToast()
  const { successToast, errorToast } = useToastNotification(toast)
  const router = useRouter()

  let postMutation = UsePostTournament()
  if (initial_data) {
    postMutation = UsePatchTournament(initial_data.id)
  }

  const onSubmit = async (values: TournamentFormValues) => {
    try {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Link href="/admin/tournaments">
          <Button variant="outline" className="flex items-center w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Button>
        </Link>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{initial_data ? "Edit Tournament" : "Create Tournament"}</CardTitle>
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
                      <FormLabel>Tournament Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tournament name" {...field} />
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
                      <FormLabel>Sport</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a sport" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tabletennis">Tabletennis</SelectItem>
                          <SelectItem value="basketball">Basketball</SelectItem>
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
                      <FormLabel>Start Date</FormLabel>
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
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
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
                      <FormLabel>End Date</FormLabel>
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
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
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
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
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
                      <FormLabel>Tournament Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tournament type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single_elimination">Single Elimination</SelectItem>
                          <SelectItem value="double_elimination_full_placement">Double Elimination Full Placement</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="min_team_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Team Size</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
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
                      <FormLabel>Maximum Team Size</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="information"
                render={({ field }) => {
                  const fieldValue = field.value || { fields: [] };

                  return (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Additional Information</FormLabel>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            const currentFields = fieldValue.fields || [];
                            field.onChange({
                              fields: [...currentFields, { title: '', information: '' }]
                            });
                          }}
                        >
                          <Plus />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {fieldValue.fields?.map((customField: CustomField, index: number) => (
                          <div key={index} className="flex flex-col md:flex-row gap-6">
                            <Input
                              className="h-[40px]"
                              placeholder="Title"
                              value={customField.title || ''}
                              onChange={(e) => {
                                const newFields = [...fieldValue.fields];
                                newFields[index] = {
                                  ...newFields[index],
                                  title: e.target.value
                                };
                                field.onChange({ fields: newFields });
                              }}
                            />
                            <Textarea
                              className="md:min-h-[40px]"
                              placeholder="Information"
                              rows={1}
                              value={customField.information || ''}
                              onChange={(e) => {
                                const newFields = [...fieldValue.fields];
                                newFields[index] = {
                                  ...newFields[index],
                                  information: e.target.value
                                };
                                field.onChange({ fields: newFields });
                              }}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                const newFields = fieldValue.fields.filter((_: any, i: number) => i !== index);
                                field.onChange({ fields: newFields });
                              }}
                            >
                              <Minus />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="private"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Private Tournament</FormLabel>
                        <FormDescription>
                          Make this tournament invitation-only
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
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
                        <FormLabel className="text-base">Solo Tournament</FormLabel>
                        <FormDescription>
                          Enable individual participation
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="md:w-[200px] w-full">
                  {initial_data ? "Update Tournament" : "Create Tournament"}
                </Button>

              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}