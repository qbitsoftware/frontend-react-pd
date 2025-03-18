"use client";

import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React from 'react';
import { Club } from "@/types/types";

interface ClubProfileModal {
  isOpen: boolean;
  onClose: () => void;
  club: Club | null;
}

export const ClubProfileModal: React.FC<ClubProfileModal> = ({ isOpen, onClose, club }) => {
  const { t } = useTranslation();
  if (!club) return null;

  const players = [
    { first_name: "Toomas", last_name: "Tibu", birthYear: 1995, ranking: 1, sex: "Male" },
    { first_name: "Kolmasnahk", last_name: "Panija", birthYear: 1998, ranking: 2, sex: "Female" },
    { first_name: "Rahapesukaruu", last_name: "Panija", birthYear: 1998, ranking: 2, sex: "Female" },
    { first_name: "Ahmed", last_name: "Panija", birthYear: 1998, ranking: 2, sex: "Female" },
    { first_name: "Kreutzwald", last_name: "Panija", birthYear: 1998, ranking: 2, sex: "Female" },
    { first_name: "Tigu", last_name: "Panija", birthYear: 1998, ranking: 2, sex: "Female" },
    { first_name: "Tigu", last_name: "Panija", birthYear: 1998, ranking: 2, sex: "Female" },
    { first_name: "Tigu", last_name: "Panija", birthYear: 1998, ranking: 2, sex: "Female" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-8 bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-scroll">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <img
            src={club.logoPath}
            alt={`${club.name}'s logo`}
            className="w-32 h-32 object-cover"
          />
          <DialogTitle className="text-3xl font-bold text-gray-900">{club.name}</DialogTitle>
        </div>

        <div className="flex flex-col space-y-8">
          <div className="bg-gray-50 rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Club Players</h2>
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700 font-medium">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">{t('rating.table.head.last_name')}</th>
                  <th className="px-4 py-2">{t('rating.table.head.first_name')}</th>
                  <th className="px-4 py-2">RP</th>
                  <th className="px-4 py-2">{t('rating.table.head.birthyear')}</th>
                  <th className="px-4 py-2">Sex</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800">{index + 1}</td>
                    <td className="px-4 py-2 text-gray-800">{player.last_name}</td>
                    <td className="px-4 py-2 text-gray-800">{player.first_name}</td>
                    <td className="px-4 py-2 text-gray-800">{player.ranking}</td>
                    <td className="px-4 py-2 text-gray-800">{player.birthYear}</td>
                    <td className="px-4 py-2 text-gray-800">{player.sex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
