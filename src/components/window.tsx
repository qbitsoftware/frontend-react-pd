import { useState } from "react"
import { Bracket } from "@/types/types"
import SingleElimBracket from "./single_elim"
import DoubleElimBracket from "./double_elim"
import { CalculateSVGHeight } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"

interface WindowProps {
    data: Bracket,
}

export const Window: React.FC<WindowProps> = ({ data }) => {
    const [bracket, setBracket] = useState(0)
    const renderBracket = () => {
        let previousTop: number = 0

        return (
            <div>
                {data.eliminations[bracket].elimination.map((table, index) => {
                    if (index !== 0 && index >= 1) {
                        previousTop += CalculateSVGHeight(data.eliminations[bracket].elimination[index - 1].matches, 80, 80);
                    }

                    if (table.name === "Miinusring") {
                        return (
                            <DoubleElimBracket key={index} starting_x={0} starting_y={previousTop} data={table} index={index} />
                        );
                    } else {
                        return (
                            <SingleElimBracket key={index} starting_x={0} starting_y={previousTop} data={table} />
                        );
                    }
                })}
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center w-full h-full border-[1px] rounded shadow-md m-4 mx-auto">
            <div className="flex gap-5 md:py-4 w-full">
                <Tabs defaultValue={data.eliminations[0].elimination[0].name} className="max-w-[1440px] w-full md:px-4">
                    <TabsList className="flex flex-wrap w-full justify-start gap-2 mb-4 text-black bg-transparent">
                        {data.eliminations.map((item, index) => (
                            <TabsTrigger
                                key={index}
                                value={item.elimination[0].name}
                                className="text-sm sm:text-base data-[state=active]:bg:shadow-xl data-[state=active]:bg-secondary data-[state=active]:text-white shadow-md border-[1px] border-black/5"
                                onClick={() => setBracket(index)}
                            >
                                {item.elimination[0].name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
            <div className="w-full h-full rounded-lg shadow-lg p-4 overflow-auto">
                {renderBracket()}
            </div >
        </div >
    )
}