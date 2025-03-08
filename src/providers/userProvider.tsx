import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserLogin } from '@/types/types';
import { useGetCurrentUserQuery } from '@/queries/users';

interface UserContextType {
  user: UserLogin | null;
  setUser: (user: UserLogin | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user_data } = useGetCurrentUserQuery();
  const [user, setUser] = useState<UserLogin | null>(null);

  useEffect(() => {
    if (user_data) {
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

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};