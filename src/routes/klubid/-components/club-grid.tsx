import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClubProfileModal } from "./club-profile-modal";
import { useState } from "react";
import { Club } from "@/types/types";
import { ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ClubTableProps {
  clubs: Club[];
}

export function ClubGrid({ clubs }: ClubTableProps = { clubs: [] }) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClubs = clubs.filter((club) => {
    return club.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="rounded-t-lg bg-white p-6 space-y-6">
      <div className="relative md:w-1/4 md:col-span-3">
        <Input
          type="text"
          placeholder={t("Otsi klubi")}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 w-full pl-4 pr-10 py-2 border rounded-lg text-sm bg-[#F7F6F7] focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club, index) => (
          <Card
            key={index}
            onClick={() => {
              setSelectedClub(club);
              setIsModalOpen(true);
            }}
            className="flex flex-col h-full cursor-pointer"
          >
            <CardHeader className="flex-grow">
              <CardTitle className="text-lg font-semibold text-center flex flex-row items-center gap-2">
                {club.name}
                <ChevronRight className="text-stone-700 h-6" />
              </CardTitle>
            </CardHeader>
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
