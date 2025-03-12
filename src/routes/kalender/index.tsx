import { createFileRoute } from '@tanstack/react-router'
import ErrorPage from '@/components/error'
import { UseGetTournaments } from '@/queries/tournaments'
import CalendarView from '@/components/CalendarView'
import { motion } from 'framer-motion'


export const Route = createFileRoute('/kalender/')({
  errorComponent: ({ error, reset }) => {
    return <ErrorPage error={error} reset={reset} />
  },
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    const tournaments = await queryClient.ensureQueryData(UseGetTournaments())
    return { tournaments }
  },
})

function RouteComponent() {
  const { tournaments } = Route.useLoaderData()

  if (tournaments.data) {
    return (
    <div className="w-full mx-auto lg:px-4 max-w-[1440px]">
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0 }}
            className=""
        >
            <CalendarView tournaments={tournaments.data}/>
        </motion.div>
      </div>
    )
  } else {
    return (<div>test</div>)
  }
}
