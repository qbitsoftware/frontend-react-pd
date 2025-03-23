'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Upload, Trash2, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useToastNotification } from '@/components/toast-notification'

interface ImageUploadProps {
    tournament_id: number
    gameDay: string
}


export default function ImageUpload({ tournament_id, gameDay }: ImageUploadProps) {
    const toast = useToast()
    const { successToast, errorToast } = useToastNotification(toast)
    const [images, setImages] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState<boolean>(false)

    void isUploading, tournament_id, gameDay
    // const postImageMutation = usePostImages(tournament_id, gameDay)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(prevImages => [...prevImages, ...Array.from(e.target.files || [])])
        }
    }

    const handleRemoveImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index))
    }

    const handleClearAll = () => {
        setImages([])
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleAddMoreClick = () => {
        fileInputRef.current?.click()
    }

    const uploadImages = async () => {
        const formData = new FormData()
        images.map((file) => {
            formData.append("images", file)
        })
        try {
            setIsUploading(true)
            successToast("Piltide üleslaadimine võib võtta mõne hetke", "Palun ärge sulgege veebilehte")
            // const result = await postImageMutation.mutateAsync(formData)
            setIsUploading(false)
            successToast("Piltide üleslaadimine oli edukas")
            setImages([])
        } catch (error) {
            void error;
            errorToast("Piltide üleslaadimisel tekkis viga")
        }
    }

    return (
        <div className="w-full flex flex-col justify-center mx-auto p-4">
            <div className="flex mb-4 items-center justify-center">
                <Button
                    onClick={handleAddMoreClick}
                    className="w-[300px]"
                >
                    <Upload className="mr-2 h-4 w-4" /> Lisa pildid
                </Button>
                <Input
                    className="sr-only"
                    type="file"
                    id="fileUpload"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                />
            </div>

            {images.length > 0 && (
                <div className='flex flex-col'>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-4">
                        {images.map((file, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index}`}
                                    className="w-full h-auto object-cover rounded-md"
                                />
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <p className="text-sm truncate mt-1">{file.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleClearAll}
                            className='w-[300px]'
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Eemalda kõik
                        </Button>
                        <Button
                            size="sm"
                            onClick={uploadImages}
                            className='w-[300px]'
                        >
                            <Check className="mr-2 h-4 w-4" /> Salvesta
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}