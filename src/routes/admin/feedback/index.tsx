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
import { useState } from "react";
import { CheckCircle } from "lucide-react";

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
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      name: "ELTL admin",
    };

    try {
      const result = await sendUserFeedback(feedbackData);
      if (result.success) {
        console.log("Feedback submitted successfully");
        setIsSubmitted(true);
        form.reset();

        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        console.error("Error submitting feedback:", result.error);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  }

  return (
    <div className="container p-8">
      <h3 className="text-center md:text-left text-stone-800 font-bold">
        Tagasisidevorm
      </h3>
      <p className="text-center md:text-left text-gray-500 mb-8 mt-1">
        Teie ettepanekud ja tagasiside aitavad meil platvormi paremaks teha
      </p>

      {isSubmitted ? (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 max-w-lg">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-600 h-6 w-6" />
            <h4 className="font-medium text-green-800">
              Täname tagasiside eest!
            </h4>
          </div>
          <p className="text-green-700">
            Oleme teie tagasiside kätte saanud ja võtame seda arvesse platvormi
            arendamisel.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="mt-4 border-green-300 text-green-700 hover:bg-green-100 hover:text-green-800"
          >
            Saada veel tagasisidet
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-lg px-1"
          >
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
              className={`w-full ${form.formState.isSubmitting ? "opacity-70" : ""}`}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saatmine..." : "Saada"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
