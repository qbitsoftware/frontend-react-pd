import { Button } from "@/components/ui/button"
import { ArrowLeft, FileWarning } from "lucide-react"
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

    // Animation variants for the container
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.3,
                delayChildren: 0.1
            }
        }
    }

    // Animation variants for the children
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.2
            }
        }
    }

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <motion.div 
                    className="flex flex-col items-start gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants}>
                        <FileWarning className="w-20 h-20 text-stone-800" />
                    </motion.div>
                    
                    <motion.h2
                        className="font-bold text-stone-900"
                        variants={itemVariants}
                    >
                        {t('errors.general.title') || 'Oih! Midagi läks valesti'}
                    </motion.h2>
                    
                    <motion.p
                        className="text-xl mb-6 text-gray-600"
                        variants={itemVariants}
                    >
                        {t('errors.general.description') || 'Vabandame ebamugavuste pärast. Tegeleme probleemi lahendamisega.'}
                    </motion.p>
                    
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row justify-start space-y-3 sm:space-y-0 sm:space-x-4"
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
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('errors.general.home') || 'Mine kodulehele'}
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}