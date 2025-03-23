import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useToastNotification } from "@/components/toast-notification";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ErrorPage from "@/components/error";
import { useTranslation } from "react-i18next";
import { createRegisterSchema, RegisterFormData } from "@/types/types";
import { useCreateUser } from "@/queries/users";

export const Route = createFileRoute("/register/")({
  component: RouteComponent,
  errorComponent: () => {
    return <ErrorPage />;
  },
});

function RouteComponent() {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const { successToast } = useToastNotification(toast);
  const userMutation = useCreateUser();

  const registerMutation = {
    mutate: (data: RegisterFormData, options: any) => {
      void data;
      options.onSuccess();
    },
    isPending: false,
  };

  const registerSchema = createRegisterSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {},
  });

  const onSubmit = (data: RegisterFormData) => {
    setServerError(null);
    userMutation.mutate(data, {
      onSuccess: () => {
        successToast(t("register.successful_registration"));
        navigate({ to: "/login" });
      },
      onError: (error: any) => {
        if (error.response.status === 409) {
          setServerError(t("register.form.errors.duplicate_username"));
        } else {
          setServerError(t("register.registration_error"));
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2 sm:px-6 lg:px-8 py-2">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h3>{t("register.form.heading")}</h3>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">
                  {t("register.form.first_name")}
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  {...register("first_name")}
                  className="mt-1"
                />
                {errors.first_name && (
                  <p className="text-sm text-red-600">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">{t("register.form.last_name")}</Label>
                <Input
                  id="lastName"
                  type="text"
                  {...register("last_name")}
                  className="mt-1"
                />
                {errors.last_name && (
                  <p className="text-sm text-red-600">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="username">{t("register.form.username")}</Label>
              <Input
                id="username"
                type="text"
                {...register("username")}
                className="mt-1"
              />
              {errors.username && (
                <p className="text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">{t("register.form.password")}</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="mt-1"
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">
                {t("register.form.confirm_password")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirm_password")}
                className="mt-1"
              />
              {errors.confirm_password && (
                <p className="text-sm text-red-600">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <input
                id="create_profile"
                type="checkbox"
                {...register("create_profile")}
                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                defaultChecked={true}
              />
              <Label
                htmlFor="create_profile"
                className="ml-2 block text-sm text-gray-900"
              >
                {t("register.form.create_profile") || "Loo mängijaprofiil"}
              </Label>
            </div>
          </div>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <ReloadIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  {t("register.form.register_progress") || "Registreerimine..."}
                </>
              ) : (
                t("register.form.register") || "Registreeri"
              )}
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => navigate({ to: "/login" })}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {t("register.already_have_account") ||
                "Juba on konto? Logi sisse"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
