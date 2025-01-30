import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Participant } from '@/types/types'
import { AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

interface SoloTableParticipants {
  participants: Participant[] |  null
}

const SoloTable: React.FC<SoloTableParticipants> = ({ participants }) => {
  return (
    <div>
      {participants && participants.length > 0 ? (
        <div className="rounded-md border">
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
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={participant.extra_data.image_url}></AvatarImage>
                      <AvatarFallback><img src='/avatar-fallback.png' className='rounded-full'></img></AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.rank}</TableCell>
                  <TableCell>{participant.extra_data.class}</TableCell>
                  <TableCell>{participant.players[0].extra_data.club}</TableCell>
                  <TableCell>{participant.players[0].sex}</TableCell>
                  <TableHead>{participant.players[0].extra_data.eltl_id}</TableHead>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <p className="text-gray-500 text-lg">No participants found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  )
}

export default SoloTable