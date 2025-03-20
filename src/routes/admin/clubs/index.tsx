import { createFileRoute } from '@tanstack/react-router'
import { Table, TableCaption, TableHeader, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/table'
import { UseGetClubsQuery, useCreateClub, useUpdateClub, useDeleteClub, CreateClubInput } from '@/queries/clubs'
import { Button } from '@/components/ui/button'
import { PlusCircle, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useQueryClient } from '@tanstack/react-query'
import { Club } from '@/types/types'
import { useToast } from '@/hooks/use-toast'

export const Route = createFileRoute('/admin/clubs/')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const { data: clubsData, isLoading } = UseGetClubsQuery()
  const createClubMutation = useCreateClub()
  const updateClubMutation = useUpdateClub()
  const deleteClubMutation = useDeleteClub()

  const {toast} = useToast()
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [newClub, setNewClub] = useState<CreateClubInput>({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    image_url: ''
  })

  const handleNewClubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewClub(prev => ({ ...prev, [name]: value }))
  }

  const handleEditClubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (selectedClub) {
      setSelectedClub({ ...selectedClub, [name]: value })
    }
  }

  const handleCreateClub = async () => {
    try {
      await createClubMutation.mutateAsync(newClub, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['clubs_query'] })
          setIsCreateDialogOpen(false)
          setNewClub({
            name: '',
            contact_person: '',
            email: '',
            phone: '',
            address: '',
            website: '',
            image_url: ''
          })
          toast({
            title: "Club created",
            description: "The club has been created successfully."
          })
        }
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create club. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleUpdateClub = async () => {
    if (!selectedClub) return

    try {
      await updateClubMutation.mutateAsync(selectedClub, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['clubs_query'] })
          setIsEditDialogOpen(false)
          setSelectedClub(null)
          toast({
            title: "Club updated",
            description: "The club has been updated successfully."
          })
        }
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update club. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Handle delete club submission
  const handleDeleteClub = async () => {
    if (!selectedClub) return

    try {
      await deleteClubMutation.mutateAsync(selectedClub.name, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['clubs_query'] })
          setIsDeleteDialogOpen(false)
          setSelectedClub(null)
          toast({
            title: "Club deleted",
            description: "The club has been deleted successfully."
          })
        }
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete club. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (!clubsData || !clubsData.data) return <div>Error: No club data available</div>
  
  const clubs = clubsData.data

  return (
    <div className="container p-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Club Management</h1>
        
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Club
        </Button>
      </div>
      <span className='font-medium text-sm px-2 pb-2'>{clubs.length} clubs</span>
      
      <Table>
        <TableCaption>A list of clubs available for management</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Website</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubs.map((club) => (
            <TableRow key={club.id}>
              <TableCell>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={club.image_url} alt={club.name} />
                  <AvatarFallback>{club.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{club.name}</TableCell>
              <TableCell className="truncate">{club.contact_person}</TableCell>
              <TableCell className="truncate">{club.email}</TableCell>
              <TableCell className="truncate">{club.phone}</TableCell>
              <TableCell className="truncate">{club.address}</TableCell>
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
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedClub(club)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setSelectedClub(club)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Club Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Club</DialogTitle>
            <DialogDescription>
              Enter the details for the new club.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newClub.name}
                onChange={handleNewClubChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact_person" className="text-right">
                Contact Person
              </Label>
              <Input
                id="contact_person"
                name="contact_person"
                value={newClub.contact_person}
                onChange={handleNewClubChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newClub.email}
                onChange={handleNewClubChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={newClub.phone}
                onChange={handleNewClubChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={newClub.address}
                onChange={handleNewClubChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                name="website"
                value={newClub.website}
                onChange={handleNewClubChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_url" className="text-right">
                Image URL
              </Label>
              <Input
                id="image_url"
                name="image_url"
                value={newClub.image_url}
                onChange={handleNewClubChange}
                className="col-span-3"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleCreateClub}
              disabled={createClubMutation.isPending}
            >
              {createClubMutation.isPending ? "Creating..." : "Create Club"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Club Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Club</DialogTitle>
            <DialogDescription>
              Update the club details.
            </DialogDescription>
          </DialogHeader>
          {selectedClub && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={selectedClub.name}
                  onChange={handleEditClubChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contact_person" className="text-right">
                  Contact Person
                </Label>
                <Input
                  id="edit-contact_person"
                  name="contact_person"
                  value={selectedClub.contact_person}
                  onChange={handleEditClubChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={selectedClub.email}
                  onChange={handleEditClubChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={selectedClub.phone}
                  onChange={handleEditClubChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Address
                </Label>
                <Input
                  id="edit-address"
                  name="address"
                  value={selectedClub.address}
                  onChange={handleEditClubChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-website" className="text-right">
                  Website
                </Label>
                <Input
                  id="edit-website"
                  name="website"
                  value={selectedClub.website}
                  onChange={handleEditClubChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-image_url" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="edit-image_url"
                  name="image_url"
                  value={selectedClub.image_url}
                  onChange={handleEditClubChange}
                  className="col-span-3"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleUpdateClub}
              disabled={updateClubMutation.isPending}
            >
              {updateClubMutation.isPending ? "Updating..." : "Update Club"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the club{" "}
              <span className="font-semibold">{selectedClub?.name}</span> and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClub}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteClubMutation.isPending}
            >
              {deleteClubMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}