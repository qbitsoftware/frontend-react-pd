import React, { useState, useRef, useEffect } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { addPlayerImage } from '@/queries/images';
import { useToast } from '@/hooks/use-toast';
import { useToastNotification } from "@/components/toast-notification"


// Allowed image formats
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface EditImgModalProps {
    playerId: string;
    playerName: string;
    playerImg?: string;
    onSuccess?: () => void;
}

const EditImgModal = ({ playerId, playerName, playerImg, onSuccess }: EditImgModalProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast()
  const { successToast, errorToast } = useToastNotification(toast)

  const { mutate: uploadImage } = addPlayerImage();

  // Set initial preview from playerImg prop when dialog opens
  useEffect(() => {
    if (isOpen && playerImg) {
      setPreview(playerImg);
    }
  }, [isOpen, playerImg]);

  const validateFile = (file: File): boolean => {
    // Reset previous error
    setError("");

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Invalid file type. Only JPG, JPEG, PNG, WebP, and GIF are allowed.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum size is 10MB.");
      return false;
    }

    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Clear the file input if validation fails
      e.target.value = '';
      setImage(null);
      setPreview(playerImg || "");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!image) return;

    setIsLoading(true);
    setError("");

    uploadImage(
      {
        player_id: playerId,
        image_file: image
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setIsLoading(false);
          if (onSuccess) onSuccess();
          successToast("Image uploaded successfully")
        },
        onError: (error) => {
          console.error("Upload failed:", error);
          setError("Failed to upload image. Please try again.");
          setIsLoading(false);
          errorToast("Image upload error")
        }
      }
    );
  };

  const resetForm = () => {
    setImage(null);
    setPreview(playerImg || "");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetForm();
    } else {
      // When opening the dialog, set the preview to the existing image
      if (playerImg) {
        setPreview(playerImg);
      }
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Edit image
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit {playerName}'s image
          </DialogTitle>
          <DialogDescription>
            Add or replace player image here. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="mt-2">
            <input
              type="file"
              id="profilepic"
              name="profilepic"
              accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              className="w-full"
              disabled={isLoading}
            >
              Choose Image
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Upload JPG, JPEG, PNG, WebP, or GIF (max 10MB)
          </p>

          {error && (
            <p className="text-sm text-red-500 mt-2">
              {error}
            </p>
          )}

          <div className="flex justify-center mt-4">
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!image || isLoading}
            >
              {isLoading ? 'Uploading...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditImgModal