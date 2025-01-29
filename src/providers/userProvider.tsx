import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGetCurrentUserQuery } from '@/queries/users';
import { UserNew } from '@/types/types';

interface UserContextType {
  user: UserNew | null;
  setUser: (user: UserNew | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user_data, isLoading } = useGetCurrentUserQuery();
  const [user, setUser] = useState<UserNew | null>(null);

  useEffect(() => {
    if (user_data) {
      console.log("Setting user data", user_data.data);
      setUser(user_data.data);
    } else {
      setUser(null);
    }
  }, [user_data]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};