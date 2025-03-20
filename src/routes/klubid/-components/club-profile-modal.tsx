"use client";

import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React, { useEffect } from 'react';
import { Club } from "@/types/types";
import { UseGetClubPlayers } from "@/queries/clubs";

interface ClubProfileModal {
  isOpen: boolean;
  onClose: () => void;
  club: Club | null;
}

export const ClubProfileModal: React.FC<ClubProfileModal> = ({ isOpen, onClose, club }) => {
  const { t } = useTranslation();

  const clubName = club?.name || '';

  const { data: playerData, isLoading, refetch } = UseGetClubPlayers(clubName);

  useEffect(() => {
    if (isOpen && clubName) {
      refetch();
    }
  }, [isOpen, clubName, refetch]);

  if (isOpen && (isLoading || !playerData)) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-8 bg-white rounded-2xl shadow-xl">
          <div className="flex justify-center items-center h-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Loading club data...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!club || !isOpen) return null;

  const players = playerData?.data || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-8 bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-scroll">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <img
            src={club.image_url}
            alt={`${club.name}'s logo`}
            className="w-32 h-32 object-cover"
          />
          <DialogTitle className="text-3xl font-bold text-gray-900">{club.name}</DialogTitle>
        </div>

        <div className="flex flex-col space-y-8">
          <div className="bg-gray-50 rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Club Players</h2>
            {players.length > 0 ? (
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
                      <td className="px-4 py-2 text-gray-800">{player.rate_points}</td>
                      <td className="px-4 py-2 text-gray-800">{player.birth_date}</td>
                      <td className="px-4 py-2 text-gray-800">{player.sex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-4">No players found for this club.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
