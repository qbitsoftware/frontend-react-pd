import { useState } from "react"
import Board from "./board"
import TestBracket2 from "./testbracket2"
import { Button } from "@/components/ui/button"
import { Bracket } from "@/types/types"
import SingleElimBracket from "./single_elim"
import { CalculateSVGHeight } from "@/lib/utils"
import DoubleElimBracket from "./double_elim"

interface WindowProps {
    data: Bracket[]
}

export const Window: React.FC<WindowProps> = ({ data }) => {
    const [bracket, setBracket] = useState(0)
    let previousTop: number = 0
    console.log("Data", data)
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="flex gap-5">
                <Button onClick={() => setBracket(1)}>Number 1</Button>
                <Button onClick={() => setBracket(0)}>Number 0</Button>
            </div>
            <div className="w-[1200px] h-[700px] bg-white rounded-lg shadow-lg overflow-hidden">
                <Board>
                    {bracket === 0 ? (
                        data.map((item, index) => {
                            const topCoord = previousTop
                            previousTop += CalculateSVGHeight(item.tables[0].matches, 180, 80) + 500
                            if (item.tables[0].name == "Miinusring") {
                                return (
                                    <div key={index}>
                                        <DoubleElimBracket starting_x={0} starting_y={topCoord} data={item.tables[0]} />
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={index}>
                                        <SingleElimBracket starting_x={0} starting_y={topCoord} data={item.tables[0]} />
                                    </div>
                                )

                            }
                        })
                    ) : bracket === 1 ? (
                        <TestBracket2 />
                    ) : (
                        ""
                    )}
                </Board>
            </div >
        </div >
    )
}