import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Minus } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useToastNotification } from "./toast-notification";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { UsePatchMatch } from "@/queries/match";
import { useLocation, useRouter } from "@tanstack/react-router";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Match, MatchWrapper, Score } from "@/types/matches";

interface MatchDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  match: MatchWrapper;
  tournament_id: number;
}

const scoreSchema = z.object({
  player1: z.number().min(0).max(99),
  player2: z.number().min(0).max(99),
});

const matchFormSchema = z.object({
  tableReferee: z.string().optional(),
  mainReferee: z.string().optional(),
  scores: z
    .array(scoreSchema)
    .max(7, "A maximum of 7 scores are allowed for best of 7"),
});

type MatchFormValues = z.infer<typeof matchFormSchema>;

const MatchDialog: React.FC<MatchDialogProps> = ({
  open,
  onClose,
  match,
  tournament_id,
}) => {
  const toast = useToast();
  const { errorToast, successToast } = useToastNotification(toast);
  const location = useLocation();
  const router = useRouter();
  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      tableReferee: "",
      mainReferee: "",
      scores: [{ player1: 0, player2: 0 }],
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (match && open) {
      reset({
        tableReferee: match.match.extra_data?.table_referee || "",
        mainReferee: match.match.extra_data?.head_referee || "",
        scores: (match.match.extra_data?.score || []).map((s: Score) => ({
          player1: s.p1_score,
          player2: s.p2_score,
        })) || [{ player1: 0, player2: 0 }],
      });
    }
  }, [match, reset, open]);

  const handleClose = () => {
    form.reset({ scores: [] });
    onClose(false);
  };

  const usePatchMatch = UsePatchMatch(
    tournament_id,
    match.match.tournament_table_id,
    match.match.id,
  );

  const { fields, append, remove } = useFieldArray({
    name: "scores",
    control: form.control,
  });

  const handleSubmit = async (data: MatchFormValues) => {
    const scores: Score[] = data.scores.map((score, index) => ({
      number: index,
      p1_score: score.player1,
      p2_score: score.player2,
    }));

    const sendMatch: Match = {
      id: match.match.id,
      tournament_table_id: match.match.tournament_table_id,
      type: match.match.type,
      round: match.match.round,
      p1_id: match.match.p1_id,
      p2_id: match.match.p2_id,
      winner_id: match.match.winner_id,
      order: match.match.order,
      sport_type: match.match.sport_type,
      location: match.match.location,
      start_date: new Date().toString(),
      bracket: match.match.bracket,
      forfeit: match.match.forfeit,
      state:match.match.state,
      extra_data: {
        head_referee: data.mainReferee,
        table_referee: data.tableReferee,
        score: scores,
        table: match.match.extra_data.table,
        parent_match_id: "",
      },
      topCoord: 0,
      table_type: match.match.table_type,
    };

    try {
      await usePatchMatch.mutateAsync(sendMatch);
      router.navigate({
        to: location.pathname,
        replace: true,
      });

      successToast("Successfully updated match scores");
    } catch (error) {
      void error;
      errorToast("Something went wrong");
    }
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border-none">
        <DialogHeader className="py-10 pb-2 rounded-t-lg text-2xl font-bold text-center mx-auto">
          <DialogTitle>Match Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ScrollArea className="h-[60vh]">
              <div className="p-6 space-y-6">
                    <div className="flex justify-center items-center gap-4">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Round:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {match.match.round + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 items-center py-4">
                      <div className="text-right pr-4">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {match.p1.name}
                        </span>
                      </div>
                      <div className="text-center font-bold text-lg">VS</div>
                      <div className="text-left pl-4">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {match.p2.name}
                        </span>
                      </div>
                    </div>
                <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                  <CardHeader className="bg-gray-50 dark:bg-gray-900 rounded-t-lg">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {match.p1.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {match.p2.name}
                      </div>
                    </div>
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-start space-x-2"
                      >
                        <FormField
                          control={form.control}
                          name={`scores.${index}.player1`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  type="number"
                                  value={field.value}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`scores.${index}.player2`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  type="number"
                                  value={field.value}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {index >= 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => remove(index)}
                            className="bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 rounded-md"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {form.formState.errors.scores &&
                      form.formState.errors.scores.root &&
                      form.formState.errors.scores.root.message && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.scores.root.message}
                        </p>
                      )}
                    {fields.length < 7 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ player1: 0, player2: 0 })}
                        className="bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 rounded-md"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Set
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                  <CardHeader className="bg-gray-50 dark:bg-gray-900 rounded-t-lg">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      Referees
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="tableReferee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Table Referee{" "}
                            <span className="text-gray-400">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter table referee name"
                              {...field}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mainReferee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Main Referee{" "}
                            <span className="text-gray-400">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter main referee name"
                              {...field}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
            <DialogFooter className="p-6 pt-2 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose(false)}
                className="bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-md"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MatchDialog;

