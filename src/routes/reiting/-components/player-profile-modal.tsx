"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React from 'react';
import { UserNew } from "@/types/types";
import { PlayerProfileData } from "./player-data-accordion";

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: UserNew | null;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ isOpen, onClose, player }) => {
  if (!player) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <div className="flex space-x-8">
          <div className="flex flex-col items-start space-y-4 w-1/3">
            <img
              src="../../../../public/test/placeholder-player-profilepic.png"
              alt={`${player.first_name} ${player.last_name}'s profile`}
              className="w-48 h-48 object-cover rounded"
            />

            <DialogTitle className="text-2xl font-semibold text-gray-900">
              {player.first_name} {player.last_name}
            </DialogTitle>
            <div className="mt-4">
              <img
                src="../../../../public/test/clubs/ViimsiLTK Blue Logo.png"
                alt={`${player.first_name} ${player.last_name}'s club`}
                className="w-24 h-24 object-cover rounded"
              />
            </div>
          </div>
          {PlayerProfileData(player)}
        </div>
      </DialogContent>
    </Dialog>
  );
};
