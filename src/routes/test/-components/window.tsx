import { useState } from "react"
import Board from "./board"
import { Button } from "@/components/ui/button"
import { Bracket } from "@/types/types"
import SingleElimBracket from "./single_elim"
import DoubleElimBracket from "./double_elim"

interface WindowProps {
    data: Bracket[]
}

export const Window: React.FC<WindowProps> = ({ data }) => {
    const [bracket, setBracket] = useState(0)
    // let previousTop: number = 0

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="flex gap-5 py-4">
                {data.map((item, index) => (
                    <>
                        <Button variant="outline" className="text-black hover:border-blue-600" onClick={() => setBracket(index)}>{item.tables[0].name}</Button>
                    </>
                ))}
            </div>
            <div className="w-[1200px] h-[700px] bg-white rounded-lg shadow-lg overflow-hidden">
                <Board>
                    {data[bracket].tables[0].name == "Miinusring" ?
                        <>
                            <div key={bracket}>
                                <DoubleElimBracket starting_x={0} starting_y={0} data={data[bracket].tables[0]} />
                            </div>
                        </> :
                        <>
                            <div key={bracket}>
                                <SingleElimBracket starting_x={0} starting_y={0} data={data[bracket].tables[0]} />
                            </div>

                        </>
                    }
                </Board>
                {/* <Board>
                    {bracket === 0 ? (
                        data.map((item, index) => {
                            const topCoord = previousTop

                            previousTop += CalculateSVGHeight(item.tables[0].matches, 80, 80) + 100
                            console.log("previoustop ", topCoord)
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
                </Board> */}
            </div >
        </div >
    )
}