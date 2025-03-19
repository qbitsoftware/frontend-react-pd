import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from 'react';
import { UserNew } from "@/types/types";
import { PlayerProfileData } from "./player-data-accordion";
import placeholderImg from "./placheolderImg.svg";
import clubPlaceholder from "./clubPlaceholder.svg"
import { UseGetUserProfile } from "@/queries/players";

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserNew | null;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;
  const profile = UseGetUserProfile(user.id)
  console.log("profile", profile)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl py-12 px-6 bg-white rounded-lg shadow-lg">
        <div className="flex space-x-8">
          <DialogHeader className="flex flex-col items-center space-y-4 w-1/3">
            <Avatar className="w-48 h-48">
              <AvatarImage src="" alt={`${user.first_name} ${user.last_name}'s profile`} />
              <AvatarFallback><img src={placeholderImg} className='rounded-full h-20'></img></AvatarFallback>
            </Avatar>
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              {user.first_name} {user.last_name}
            </DialogTitle>
            <Avatar className="w-24 h-24">
              <AvatarImage src="" alt={`${user.first_name} ${user.last_name}'s club`} />
              <AvatarFallback><img src={clubPlaceholder} className='rounded-full h-12'></img></AvatarFallback>
            </Avatar>
            <p>{user.first_name} {user.last_name}'s club</p>
          </DialogHeader>


          <div className="mt-4">

          </div>
          {PlayerProfileData(user)}
        </div>
      </DialogContent>
    </Dialog>
  );
};