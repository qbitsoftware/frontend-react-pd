import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import placeholderImg from "@/assets/placheolderImg.svg";
import { useTranslation } from "react-i18next";
import { ImageModal } from "./image-modal";
import { Participant } from "@/types/participants";

interface SoloTableProps {
  participants: Participant[] | null;
}

const SoloTable: React.FC<SoloTableProps> = ({ participants }) => {
  const { t } = useTranslation();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="h-full bg-white rounded-md">
      {participants && participants.length > 0 ? (
        <div className="rounded-md border h-full overflow-y-auto">
          <Table className="bg-white h-full ">
            <TableHeader>
              <TableRow className="bg-[#F9F9FB]">
                <TableHead>
                  {t("competitions.participants.table.image")}
                </TableHead>
                <TableHead>
                  {t("competitions.participants.table.name")}
                </TableHead>
                <TableHead>
                  {t("competitions.participants.table.rating_placement")}
                </TableHead>
                <TableHead>
                  {t("competitions.participants.table.class")}
                </TableHead>
                <TableHead>
                  {t("competitions.participants.table.club")}
                </TableHead>
                <TableHead>
                  {t("competitions.participants.table.sex")}
                </TableHead>
                <TableHead>{t("competitions.participants.table.id")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow
                  key={participant.id}
                  className="bg-white bg-[#F9F9FB]/40 "
                >
                  <TableCell>
                    <Avatar
                      className="cursor-pointer"
                      onClick={() =>
                        participant.extra_data.image_url
                          && openModal(participant.extra_data.image_url)
                          
                      }
                    >
                      <AvatarImage
                        src={participant.extra_data.image_url}
                      ></AvatarImage>
                      <AvatarFallback>
                        <img
                          src={placeholderImg}
                          className="rounded-full"
                        ></img>
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.rank}</TableCell>
                  <TableCell>{participant.extra_data.class}</TableCell>
                  <TableCell>
                    {participant.players[0].extra_data.club}
                  </TableCell>
                  <TableCell>{participant.players[0].sex}</TableCell>
                  <TableHead>
                    {participant.players[0].extra_data.eltl_id}
                  </TableHead>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className=" rounded-lg p-8 text-center h-full flex items-center justify-center">
          <p className="text-gray-800 text-lg">
            {t("competitions.participants.no_players")}
          </p>
        </div>
      )}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          imageUrl={selectedImage}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SoloTable;
