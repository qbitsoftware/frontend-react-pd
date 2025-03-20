import { createFileRoute } from '@tanstack/react-router'
import { Table, TableCaption, TableHeader, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/table'
import { UseGetClubsQuery } from '@/queries/clubs'

export const Route = createFileRoute('/admin/clubs/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: clubsData, isLoading } = UseGetClubsQuery();
    if (isLoading) return <div>Loading...</div>
    if (!clubsData || !clubsData.data) return <div>Error: </div>
    const clubs = clubsData.data

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-5">Club Management</h1>
      
      <Table>
        <TableCaption>A list of clubs available for management</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Website</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubs.map((club) => (
            <TableRow key={club.id}>
              <TableCell className="font-medium">{club.name}</TableCell>
              <TableCell className='truncate'>{club.contact_person}</TableCell>
              <TableCell className='truncate'>{club.email}</TableCell>
              <TableCell className='truncate'>{club.phone}</TableCell>
              <TableCell className='truncate'>{club.address}</TableCell>
              <TableCell>
                <a 
                  href={club.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {club.website.replace(/^https?:\/\//, '')}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}