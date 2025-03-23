import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayerProfileData } from "./player-profile-data";
import placeholderImg from "@/assets/placheolderImg.svg";
import { UseGetUserProfile } from "@/queries/players";
import { UserNew } from "@/types/types";

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserNew | null;
}

export const PlayerProfileModal = ({ isOpen, onClose, user }: PlayerProfileModalProps) => {
  if (!user) return null;
  const { data: profileResponse, isLoading, error } = UseGetUserProfile(user.id);


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl py-8 px-8 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl border border-gray-100">
        <div className="flex flex-col md:flex-row md:space-x-10">
          <div className="flex flex-col items-center space-y-6 w-full md:w-1/3 pb-6 md:pb-0 border-b md:border-b-0 md:border-x border-gray-100">
            <Avatar className="w-48 h-48 shadow-lg">
              <AvatarImage src="" alt={`${user.first_name} ${user.last_name}'s profile`} />
              <AvatarFallback>
                <img src={placeholderImg} className="rounded-full h-full w-full object-cover" alt="Profile" />
              </AvatarFallback>
            </Avatar>

            <h2 className="font-bold text-2xl text-gray-900 text-center">
              {/* {user.first_name} {user.last_name} */}
              {user.username}
            </h2>

            <div className="flex flex-col items-center gap-3 mt-2">
              <p className="text-gray-600 font-medium">{user.club_name}</p>

            </div>
          </div>

          <div className="w-full md:w-2/3 mt-6 md:mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 bg-red-50 rounded-lg">Error loading profile data</div>
            ) : profileResponse?.data ? (
              <PlayerProfileData profile={profileResponse.data} />
            ) : (
              <div className="text-gray-500 p-4 bg-gray-50 rounded-lg">No profile data available</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};