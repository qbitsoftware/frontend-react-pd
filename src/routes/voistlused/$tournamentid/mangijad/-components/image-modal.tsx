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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-[90vw] max-h-[90vh] p-1 bg-white border border-gray-200 rounded-lg shadow-xl sm:p-2"
        // modal={true}
      >
        <div className="relative w-full flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
          
          
          <div className="relative max-w-full max-h-full p-1 sm:p-2 bg-white">
            <img 
              src={imageUrl} 
              alt="Full view" 
              className="max-w-full max-h-[80vh] object-contain rounded" 
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}