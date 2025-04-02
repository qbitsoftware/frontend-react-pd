import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

export const ImageModal = ({ imageUrl, onClose, isOpen }: { 
  imageUrl: string, 
  onClose: () => void,
  isOpen: boolean
}) => {
  return (
    <Dialog  open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="p-0 w-full max-h-[95vh] mx-auto overflow-hidden border-none bg-transparent shadow-none"
        >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="flex items-center justify-center w-full h-full">
            <img 
              src={imageUrl} 
              alt="Full view" 
              className="max-w-full max-h-[85vh] object-contain rounded"
              key={imageUrl}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}