import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useGetGamedaysOptions } from "@/queries/images";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageModal } from "../mangijad/-components/image-modal"

export const Route = createFileRoute("/voistlused/$tournamentid/galerii/")({
  loader: async ({ context: { queryClient }, params }) => {
    let gamedaysData;
    try {
      gamedaysData = await queryClient.ensureQueryData(
        useGetGamedaysOptions(Number(params.tournamentid))
      );
    } catch (error) {
      console.error("Error fetching game days:", error);
    }
    return { gamedaysData };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { gamedaysData } = Route.useLoaderData();
  const { t } = useTranslation();

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  if (!gamedaysData || !gamedaysData.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("gallery.loading")}</p>
        </div>
      </div>
    );
  }

  const gamedays = [...gamedaysData.data].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateA - dateB;
  });

  const [activeTab, setActiveTab] = useState(() => {
    return gamedays.length > 0 ? gamedays[0].id.toString() : "";
  });

  // If no gamedays
  if (gamedays.length === 0) {
    return (
      <div className="p-6 text-center rounded-sm">
        <p className="text-muted-foreground">{t("gallery.no_images")}</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-12 py-4 md:py-8">
      <h5 className="font-bold mb-4 md:mb-8 text-center md:text-left">{t('gallery.title')}</h5>
      <div className='pb-8 '>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className="flex justify-start items-center gap-1 h-auto p-1">
              {gamedays.map((day) => (
                <TabsTrigger
                  key={day.id}
                  value={day.id.toString()}
                  className="text-sm px-4 py-2 h-9 data-[state=active]:bg-muted data-[state=active]:shadow-sm data-[state=active]:text-stone-800"
                >
                  {day.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {gamedays.map((day) => (
            <TabsContent
              key={day.id}
              value={day.id.toString()}
              className="rounded-md pt-2"
            >
              <div className="rounded-md">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-medium">{day.name}</h3>
                  </div>
                </div>

                {day.images && day.images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {day.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-md overflow-hidden border border-muted group"
                      >
                        <img
                          onClick={() => openModal(img.image_url)}
                          src={img.image_url}
                          alt={`${day.name} - ${t("gallery.image")} ${idx + 1}`}
                          className="cursor-pointer w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    {t("gallery.no_images")}
                  </p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          imageUrl={selectedImage}
          onClose={closeModal}
        />
      )}
    </div>
  );
}