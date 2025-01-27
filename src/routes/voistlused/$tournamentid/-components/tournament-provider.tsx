import { Tournament } from '@/types/types'
import React, { createContext, useContext, ReactNode } from 'react'

interface TournamentContextProps {
  tournamentData: Tournament
  children?: ReactNode
}

const TournamentContext = createContext<Tournament | undefined>(undefined)


export const useTournament = () => {
  const context = useContext(TournamentContext)
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider')
  }
  return context
}

export const TournamentProvider: React.FC<TournamentContextProps> = ({ tournamentData, children }) => {
  return <TournamentContext.Provider value={tournamentData}>{children}</TournamentContext.Provider>
}