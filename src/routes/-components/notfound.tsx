import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
    const { t } = useTranslation()

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md text-center"
            >
                <div className="mb-8">
                    {/* SVG of a table tennis paddle and ball */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 200 200"
                        className="w-32 h-32 mx-auto text-primary"
                        fill="currentColor"
                    >
                        {/* Paddle */}
                        <motion.g
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* Paddle handle */}
                            <rect x="90" y="110" width="10" height="50" rx="3" fill="currentColor" />

                            {/* Paddle head */}
                            <motion.ellipse
                                cx="95"
                                cy="85"
                                rx="25"
                                ry="32"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                fill="currentColor"
                            />

                            {/* Paddle rubber/surface */}
                            <motion.ellipse
                                cx="95"
                                cy="85"
                                rx="22"
                                ry="29"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                fill="#f97316"
                            />
                        </motion.g>

                        {/* Ball */}
                        <motion.circle
                            cx="140"
                            cy="85"
                            r="10"
                            initial={{ x: -50, y: 20 }}
                            animate={{ x: 0, y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.6,
                                type: "spring",
                                stiffness: 120
                            }}
                            fill="white"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </svg>
                </div>

                <motion.h1
                    className="text-5xl font-bold mb-4 text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {t('errors.not_found.title') || '404'}
                </motion.h1>

                <motion.p
                    className="text-xl mb-8 text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {t('errors.not_found.description') || 'Oops! Looks like this ball went out of bounds.'}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4"
                >
                    <Button
                        variant="default"
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t('errors.not_found.back') || 'Go Back'}
                    </Button>

                    <Button asChild variant="outline">
                        <Link to="/">
                            {t('errors.not_found.home') || 'Return to Homepage'}
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default NotFoundPage