import { useState, useRef } from "react"
import { Bracket } from "@/types/types"
import SingleElimBracket from "./single_elim"
import DoubleElimBracket from "./double_elim"
import { CalculateSVGHeight } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Separator } from "./ui/separator"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface WindowProps {
    data: Bracket,
}

export const Window: React.FC<WindowProps> = ({ data }) => {
    const [bracket, setBracket] = useState(0)
    const bracketRef = useRef<HTMLDivElement | null>(null)

    const generatePDF = async () => {
        if (!bracketRef.current) return;

        const element = bracketRef.current;

        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("landscape", "mm", "a4");

            const imgWidth = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (imgHeight > 210) {
                const scaleFactor = 210 / imgHeight;
                pdf.addImage(imgData, "PNG", 0, 0, imgWidth * scaleFactor, 210);
            } else {
                pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            }

            pdf.save("tournament-bracket.pdf");
        } catch (error) {
            console.error("PDF Generation Error:", error);
        }
    };

    const renderBracket = () => {
        let previousTop: number = 0

        return (
            <div className="">
                {data.eliminations[bracket].elimination.map((table, index) => {
                    if (index !== 0 && index >= 1) {
                        previousTop += CalculateSVGHeight(data.eliminations[bracket].elimination[index - 1].matches, 60, 60);
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
        <div className="flex flex-col bg-gray-100/50  w-full h-full mx-auto">
            <div className="w-full flex justify-end p-4 bg-gray-100/50 z-10">
                <div className="max-w-[500px] flex flex-col">
                    <div className="flex justify-between">
                        <h1 className="text-[20px]">Meeste uksikmang</h1>
                        <p className="text-[13px] underline cursor-pointer" onClick={() => generatePDF()}>Download</p>
                    </div>
                    <div className="">
                        <h2 className="text-[13px]">Double elimination</h2>
                    </div>
                    <Separator className="my-2" />
                    <Tabs defaultValue={data.eliminations[0].elimination[0].name} className="">
                        <TabsList className="flex flex-wrap w-full justify-start gap-2 mb-4 text-black bg-transparent">
                            {data.eliminations.map((item, index) => (
                                <TabsTrigger
                                    key={index}
                                    value={item.elimination[0].name}
                                    className="text-sm sm:text-base data-[state=active]:underline data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-none bg-transparent"
                                    onClick={() => setBracket(index)}
                                >
                                    {item.elimination[0].name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </div>
            <div className="w-full h-full rounded-lg shadow-lg p-4 overflow-auto md:mt-[-50px]" ref={bracketRef}>
                {renderBracket()}
            </div >
        </div >
    )
}