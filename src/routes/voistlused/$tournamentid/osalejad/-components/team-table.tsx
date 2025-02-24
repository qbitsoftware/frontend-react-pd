"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Participant } from "@/types/types"

interface TeamTableProps {
  participants: Participant[] | null
}

const TeamTable: React.FC<TeamTableProps> = ({ participants }) => {
  const [selectedTeam, setSelectedTeam] = useState<Participant | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleRowClick = (participant: Participant) => {
    setSelectedTeam(participant)
    setIsDialogOpen(true)
  }

  console.log("Selected team", selectedTeam)
  return (
    <div className="overflow-y-scroll h-full">
      {participants && participants.length > 0 ? (
        <div className="rounded-md border">
          <Table className="bg-white">
            <TableHeader>
              <TableRow className="bg-[#F9F9FB]">
                <TableHead>Pilt</TableHead>
                <TableHead>Meeskond</TableHead>
                <TableHead>Mängijate arv</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow
                  key={participant.id}
                  onClick={() => handleRowClick(participant)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={participant.extra_data.image_url}></AvatarImage>
                      <AvatarFallback><img src='/test/clubs/ViimsiPinx 150x150.jpg' className='rounded-full'></img></AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.players.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-8 text-center h-full flex items-center justify-center">
          <p className="text-gray-500 text-lg">No participants found</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTeam?.name} - Team Players</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pilt</TableHead>
                <TableHead>Nimi</TableHead>
                <TableHead>Asetus Reitingus</TableHead>
                <TableHead>Klass</TableHead>
                <TableHead>Klubi</TableHead>
                <TableHead>Sugu</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTeam?.players.map((player) => (
                <TableRow key={player.id}>
                 <TableCell>
                    <Avatar>
                      <AvatarImage src={player.extra_data.image_url}></AvatarImage>
                      <AvatarFallback><img src='/avatar-fallback.png' className='rounded-full'></img></AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{`${player.first_name} ${player.last_name}`}</TableCell>
                  <TableCell>{player.extra_data.rate_order}</TableCell>
                  <TableCell>{player.extra_data.class}</TableCell>
                  <TableCell>{player.extra_data.club}</TableCell>
                  <TableCell>{player.sex}</TableCell>
                  <TableCell>{player.extra_data.eltl_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TeamTable

