import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useGetUser } from '@/queries/users'
import { useToastNotification } from '@/components/toast-notification'
import { useToast } from '@/hooks/use-toast'
import { useLogin } from '@/queries/users'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import ErrorPage from '@/components/error'
import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const Route = createFileRoute('/login/')({
    component: RouteComponent,
    errorComponent: ({ error, reset }) => {
        return <ErrorPage error={error} reset={reset} />

    },
    loader: async ({ context: { queryClient } }) => {
        try {
            const user = await queryClient.ensureQueryData(useGetUser())
            return { user }
        } catch (error: any) {

            if (error.message.includes('401')) {
                return { user: { data: null } }
            }
            throw error
        }
    },
})

const loginSchema = z.object({
    login: z.string().email('Vigane e-posti aadress'),
    password: z.string().min(8, 'Parool peab olema vähemalt 8 tähemärki pikk'),
})

export type LoginFormData = z.infer<typeof loginSchema>

function RouteComponent() {
    const [serverError, setServerError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { user } = Route.useLoaderData()

    if (user.data) {
        navigate({ to: '/' })
    }

    const { mutate: loginMutation, isPending } = useLogin()
    const toast = useToast()
    const { successToast } = useToastNotification(toast)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = (data: LoginFormData) => {
        setServerError(null)
        loginMutation(data, {
            onSuccess: (response) => {
                successToast("Edukalt sisse logitud")
                // authStore.setUser(response.data)
                
                successToast('Edukalt sisse logitud')
                navigate({ to: '/' })
            },
            onError: () => {
                setServerError('Vale parool või kasutajanimi')
            },
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-lg shadow-md">
                <div>
                    <div className="mx-auto flex items-center justify-center mb-10">
                        <img src="/RLogo.png" alt="logo" className='h-10 w-auto' />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        Tere tulemast tagasi
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-5">
                            <Label htmlFor="login" className="sr-only">
                                E-post
                            </Label>
                            <Input
                                id="login"
                                type="email"
                                {...register('login')}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                                placeholder="E-posti aadress"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="sr-only">
                                Parool
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                {...register('password')}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                                placeholder="Parool"
                            />
                        </div>
                    </div>
                    {errors.login && (
                        <p className="text-sm text-red-600">{errors.login.message}</p>
                    )}
                    {errors.password && (
                        <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}
                    <div>
                        <Button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <ReloadIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    Sisselogimine...
                                </>
                            ) : (
                                'Logi sisse'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
