'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useToastNotification } from '@/components/toast-notification'
import { useDeleteImage, useGetGamedayImages } from '@/queries/images'
import { LoginResponse } from '@/queries/users'
interface GameDayImagesProps {
    tournament_id: number,
    gameDay: string
    user: LoginResponse | undefined
}

export const Images: React.FC<GameDayImagesProps> = ({ tournament_id, gameDay, user }) => {
    const { data, isLoading, error } = useGetGamedayImages(tournament_id, gameDay);
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [imgLoading, setIsImageLoading] = useState<boolean>(false)
    const imgRef = useRef<HTMLImageElement>(null)
    const useImageMutation = useDeleteImage(tournament_id, gameDay)
    const toast = useToast()
    const { successToast, errorToast } = useToastNotification(toast)

    const openImage = (src: string) => {
        if (!user) {
            const fullsize = src.replace("thumbnails", "fullsize")
            setSelectedImage(fullsize)
            setIsImageLoading(true)
        }
    }

    const closeImage = () => {
        setSelectedImage(null)
    }

    const removeImage = async (img_url: string) => {
        try {
            await useImageMutation.mutateAsync(img_url.split(".com/")[1])
            successToast("Pilt on edukalt eemaldatud")
        } catch (error) {
            errorToast("Pildi eemaldamisel tekkis viga")
        }
    }

    useEffect(() => {
        if (imgRef) {
            // console.log(imgRef.current?.width)
            // console.log(imgRef.current?.height)
        }
    }, [imgRef])


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[20vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg font-medium">Laadin...</span>
            </div>
        )
    }

    return (
        <div>
            {data && data.data != null && data?.data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.data.map((src:string, index:number) => (
                        <Card key={index} className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${user ? "" : "cursor-pointer"} `}
                            onClick={() => openImage(src)}>
                            <CardContent className="p-0 relative">
                                <img
                                    src={src}
                                    alt={`Mängupäev ${gameDay} Pilt ${index + 1}`}
                                    width={400}
                                    height={300}
                                    className={`w-full h-auto object-cover transition-all duration-300 ${user ? "" : "hover:scale-105"} `}
                                />
                                <Button variant='destructive' className={`absolute ${user ? "" : "hidden"} top-[5%] left-[55%] w-[40%] z-10`} onClick={() => removeImage(src)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Kustuta pilt
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className={`bg-muted ${user ? "hidden" : ""}`}>
                    <CardContent
                        className={`flex flex-col items-center justify-center py-8 sm:py-12 `}
                    >
                        <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mb-2 sm:mb-4" />
                        <p className="text-base sm:text-lg text-muted-foreground text-center">
                            Mängupäev {gameDay} jaoks pole pilte saadaval
                        </p>

                    </CardContent>
                </Card>
            )}
            <Dialog open={!!selectedImage} onOpenChange={closeImage} >
                <DialogContent className="p-0 overflow-hidden max-h-[95vh] ">
                    <div className="relative">
                        {selectedImage && (
                            <>
                                <img
                                    className='responsive-img'
                                    src={selectedImage}
                                    alt="Enlarged view"
                                    width={1000}
                                    height={1000}
                                    ref={imgRef}
                                />
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}