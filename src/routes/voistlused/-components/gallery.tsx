"use client"

import { useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Images } from "./images"
import { LoginResponse } from "@/queries/users"


const gameDays = [1, 2, 3, 4, 5, 6]

interface GalleryProps {
    user: LoginResponse | undefined
    tournament_id: string | undefined
}

export default function Gallery({ user, tournament_id }: GalleryProps) {
    const [activeTab, setActiveTab] = useState("1")

    if (!tournament_id) {
        return (
            <div>
                Server error
            </div>
        )
    }

    return (
        <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-10 md:mb-4 md:mt-10">
                    {gameDays.map((day) => (
                        <TabsTrigger
                            key={day}
                            value={day.toString()}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm py-2 px-2 sm:px-4"
                        >
                            Päev {day}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {gameDays.map((day) => (
                    <TabsContent key={day} value={day.toString()}>
                        {/* {user &&
                            <div className="">
                                <ImageUpload tournament_id={Number(tournament_id)} gameDay={String(day)} />
                            </div>
                        } */}
                        <div>
                            <Images tournament_id={Number(tournament_id)} user={user} gameDay={String(day)} />
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </>
    )
}