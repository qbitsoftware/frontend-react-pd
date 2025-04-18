import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackForm, sendUserFeedback } from "@/queries/users";

export const Route = createFileRoute("/admin/feedback/")({
  component: FeedbackFormComponent,
});

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  body: z.string().min(10, {
    message: "Message body must be at least 10 characters.",
  }),
});

export function FeedbackFormComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const feedbackData: FeedbackForm = {
      ...values,
      name: "ELTL admin"
    };

    try {
      const result = await sendUserFeedback(feedbackData);
      if (result.success) {
        console.log("Feedback submitted successfully");
        form.reset();
      } else {
        console.error("Error submitting feedback:", result.error);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  }

  return (
    <div className="container p-8">
      <h3 className="text-stone-800 font-bold">Tagasisidevorm</h3>
      <p className="text-gray-500 mb-8 mt-1">Teie ettepanekud ja tagasiside aitavad meil platvormi paremaks teha</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg px-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teema</FormLabel>
                <FormControl>
                  <Input placeholder="Kokkuvõte" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sõnum</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Palun kirjeldage oma kogemust või ettepanekut detailsemalt..."
                    className="h-32 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
          >
            Saada{" "}
          </Button>
        </form>
      </Form>
    </div>
  );
}