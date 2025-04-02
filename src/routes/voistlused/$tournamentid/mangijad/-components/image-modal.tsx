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
        className="p-0 bg-transparent shadow-none border-none w-auto max-w-[95vw]"
      >
        <div className="flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Full view"
            className="max-w-[95vw] max-h-[95vh] object-contain rounded"
            key={imageUrl}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}