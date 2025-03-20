import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { ClubProfileModal } from "./club-profile-modal";
import { useState } from "react";
import { Club } from "@/types/types";


interface ClubTableProps {
  clubs: Club[]
}

export function ClubGrid({ clubs }: ClubTableProps = { clubs: [] }) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [SelectedClubId, setSelectedClubId] = useState<number | null>(null)
  const [selectedClub, setSelectedClub] = useState<Club>(clubs[0])
  // const selectedClub = clubs.find((club) => club.id === SelectedClubId);
  return (
    <div className="rounded-t-lg bg-white p-6">
      <h2 className="text-3xl font-semibold text-gray-900 mb-10">
        {t('clubs.header')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club, index) => (
          <Card key={index} className="flex flex-col h-full">
            <CardHeader className="flex-grow">
              <div className="relative mb-4 flex justify-center">
                <img
                  src={club.image_url}
                  alt={`logo`}
                  className="rounded-md"
                />
              </div>
              <CardTitle className="text-lg font-semibold text-center">{club.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="px-4 py-2"
                  onClick={() => {
                    // setSelectedClubId(club.id);
                    setSelectedClub(club)
                    setIsModalOpen(true);
                  }}
                >
                  {t('clubs.club_card.button')}
                </Button>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      <ClubProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        club={selectedClub}
      />

    </div>
  );
}
