import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link, useRouter } from "@tanstack/react-router"
import { useQueryErrorResetBoundary } from "@tanstack/react-query"
import { useEffect } from "react"
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function ErrorPage() {
    const router = useRouter()
    const queryErrorResetBoundary = useQueryErrorResetBoundary()
    const { t } = useTranslation()

    useEffect(() => {
        queryErrorResetBoundary.reset()
    }, [queryErrorResetBoundary])

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md text-center"
            >
                <div className="mb-8">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 200 200"
                        className="w-32 h-32 mx-auto text-primary"
                        fill="currentColor"
                    >
                        <motion.g
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.path
                                d="M100 40L30 160H170L100 40Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            />
                            <motion.path
                                d="M100 140V140.5"
                                stroke="currentColor"
                                strokeWidth="12"
                                strokeLinecap="round"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.8 }}
                            />
                            <motion.path
                                d="M100 80V120"
                                stroke="currentColor"
                                strokeWidth="12"
                                strokeLinecap="round"
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.5, delay: 1 }}
                            />
                        </motion.g>
                    </svg>
                </div>

                <motion.h1
                    className="text-5xl font-bold mb-4 text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {t('errors.general.title') || 'Oih! Midagi läks valesti'}
                </motion.h1>

                <motion.p
                    className="text-xl mb-8 text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {t('errors.general.description') || 'Vabandame ebamugavuste pärast. Tegeleme probleemi lahendamisega.'}
                </motion.p>

                {/* <motion.div
                    className="mb-8 text-gray-600 flex items-center justify-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Error: {error.message || "Unknown server error"}</span>
                </motion.div> */}

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4"
                >
                    <Button
                        variant="default"
                        onClick={() => router.invalidate()}
                        className="flex items-center gap-2"
                    >
                        {t('errors.general.retry') || 'Proovi uuesti'}
                    </Button>

                    <Button asChild variant="outline">
                        <Link to="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('errors.general.home') || 'Mine kodulehele'}
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    )
}