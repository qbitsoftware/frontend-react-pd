import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ClubGrid } from './-components/club-grid'
import { motion } from 'framer-motion'
import { mockClubs } from '@/lib/mock_data/club_mocks'

export const Route = createFileRoute('/klubid/')({
  component: RouteComponent,
})
function RouteComponent() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  return (
    <div className="w-full h-full flex flex-col mb-20">
      <header className="w-full py-6 bg-blue-500 text-white text-center">
        <h1 className="text-3xl font-bold">
          Eri-teadaanne: Hannes Mets astus pinksi! 🏓
        </h1>
      </header>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0 }}
          className=""
        >
          <ClubGrid clubs={mockClubs} />
        </motion.div>
      </div>
    </div>
  )
}
