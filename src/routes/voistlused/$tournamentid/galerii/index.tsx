import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {useGetGamedaysOptions} from "@/queries/images"

export const Route = createFileRoute("/voistlused/$tournamentid/galerii/")({
  loader: async ({ context: { queryClient }, params }) => {
    let gamedaysData
    try {
      gamedaysData = await queryClient.ensureQueryData(
        useGetGamedaysOptions(Number(params.tournamentid)),
      )
    } catch (error) {
      console.error('Error fetching game days:', error)
    }
    return { gamedaysData }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const {gamedaysData} = Route.useLoaderData()

  const { t } = useTranslation()

  return (

    <div className="p-6 text-center rounded-sm">
      {gamedaysData && gamedaysData.data && gamedaysData.data.length > 0}
      <p className="text-stone-500">{t('gallery.no_images')}</p>
    </div>
  );
}
{
  
        
        
}
