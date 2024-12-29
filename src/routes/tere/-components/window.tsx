import { useState } from "react"
import Board from "./board"
import { Bracket } from "@/types/types"
import SingleElimBracket from "./single_elim"
import DoubleElimBracket from "./double_elim"
import { CalculateSVGHeight } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WindowProps {
    data: Bracket[]
}

export const Window: React.FC<WindowProps> = ({ data }) => {
    const [bracket, setBracket] = useState(0)
    const renderBracket = () => {
        let previousTop: number = 0

        return data[bracket].tables.map((table, index) => {
            if (index != 0 && index >= 1) {
                previousTop += CalculateSVGHeight(data[bracket].tables[index - 1].matches, 80, 80) + 150
            }
            if (table.name === "Miinusring") {
                return (
                    <div key={index}>
                        <DoubleElimBracket starting_x={0} starting_y={previousTop} data={table} />
                    </div>
                )
            } else {
                return (
                    <div key={index + 1}>
                        <SingleElimBracket starting_x={0} starting_y={previousTop} data={table} />
                    </div>
                )
            }
        })
    }
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
            <div className="flex gap-5 py-4">
                <Tabs defaultValue={data[0].tables[0].name} className="max-w-[1440px] mx-auto md:px-4">
                    <TabsList className="flex flex-wrap justify-center items-center gap-2 mb-4 md:mx-4 text-black bg-black/5">
                        {data.map((item, index) => (
                            <TabsTrigger
                                key={index}
                                value={item.tables[0].name}
                                className="text-sm sm:text-base"
                                onClick={() => setBracket(index)}
                            >
                                {item.tables[0].name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
            <div className="w-[90vw] h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden">
                <Board>
                    {renderBracket()}
                </Board>
            </div >
        </div >
    )
}