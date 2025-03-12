import { UseGetTournament } from '@/queries/tournaments'
import Editor from '@/routes/admin/-components/yooptaeditor'
import { createFileRoute } from '@tanstack/react-router'
import { YooptaContentValue } from '@yoopta/editor'
import { useState } from 'react'

export const Route = createFileRoute('/voistlused/$tournamentid/meedia/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const tournamentId = Number(params.tournamentid)
    let tournament = queryClient.getQueryData(UseGetTournament(tournamentId).queryKey)

    if (!tournament) {
      tournament = await queryClient.fetchQuery(UseGetTournament(tournamentId))
    }

    return { tournament }
  },


})

function RouteComponent() {
  const { tournament } = Route.useLoaderData()
  const mediaContent = tournament?.data?.media || '{}'
  const [value, setValue] = useState<YooptaContentValue | undefined>(JSON.parse(mediaContent))

  const hasMedia = mediaContent !== '{}' && 
    value && 
    Array.isArray(value.blocks) && 
    value.blocks.length > 0


  return (
    <div className="">
      {hasMedia ? (
        <Editor value={value} setValue={setValue} readOnly />
      ) : (
        <div className="p-6 text-center rounded-sm">
          <p className="text-stone-500">No media content available yet.</p>
        </div>
      )}
    </div>
  )
}
