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

        try {
            const element = bracketRef.current;

            // Get the scroll dimensions (content size)
            const scrollWidth = element.scrollWidth;
            const scrollHeight = element.scrollHeight;

            console.log("scrollWidth", scrollWidth);
            console.log("scrollHeight", scrollHeight);

            // Create a canvas from the entire element, capturing the full scrollable content
            const canvas = await html2canvas(element, {
                scale: 2, // High quality scaling (canvas will be twice the resolution)
                width: scrollWidth,
                height: scrollHeight,
                scrollX: 0,
                scrollY: 0,
                windowWidth: scrollWidth,
                windowHeight: scrollHeight,
                useCORS: true,
                logging: false,
                onclone: (clonedDoc, clonedElement) => {
                    clonedElement.style.width = `${scrollWidth}px`;
                    clonedElement.style.height = `${scrollHeight}px`;
                }
            });

            // Create PDF with A4 dimensions (landscape)
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // Get the PDF page size in pixels (assuming 96 DPI)
            const pdfWidth = pdf.internal.pageSize.getWidth();  // Width of A4 page in mm
            const pdfHeight = pdf.internal.pageSize.getHeight();  // Height of A4 page in mm

            // Convert PDF dimensions from mm to pixels (1 mm = 3.779 px)
            const pdfWidthInPx = pdfWidth * 3.779;
            const pdfHeightInPx = pdfHeight * 3.779;

            const canvasWidth = canvas.width;  // Canvas width in px (after scaling)
            const canvasHeight = canvas.height;  // Canvas height in px (after scaling)

            const imgData = canvas.toDataURL('image/png');  // Convert canvas to image data

            // Calculate how many pages are needed to fit the full canvas (in pixels)
            const pagesX = Math.ceil(canvasWidth / pdfWidthInPx);
            const pagesY = Math.ceil(canvasHeight / pdfHeightInPx);

            console.log("Pages X:", pagesX);
            console.log("Pages Y:", pagesY);

            // Loop through each page and add the corresponding portion of the canvas to the PDF
            for (let y = 0; y < pagesY; y++) {
                for (let x = 0; x < pagesX; x++) {
                    // Add a new page if it's not the first page
                    if (x > 0 || y > 0) {
                        pdf.addPage();
                    }

                    // Calculate the portion of the canvas to be added to the PDF
                    const sourceX = x * pdfWidthInPx;
                    const sourceY = y * pdfHeightInPx;
                    const sourceWidth = Math.min(pdfWidthInPx, canvasWidth - sourceX);  // Crop width if needed
                    const sourceHeight = Math.min(pdfHeightInPx, canvasHeight - sourceY);  // Crop height if needed

                    // Ensure the image is added without stretching by adjusting the dimensions
                    const imgWidthInPDF = sourceWidth / 3.779;  // Convert pixels to mm
                    const imgHeightInPDF = sourceHeight / 3.779;  // Convert pixels to mm

                    // Add the image to the PDF page with the correct width and height in mm
                    pdf.addImage(imgData, 'PNG', 0, 0, imgWidthInPDF, imgHeightInPDF);  // Correct 9 arguments
                }
            }

            // Get the tournament and division name for the PDF filename
            const tournamentName = data.name || 'bracket';
            const divisionName = data.eliminations[bracket].elimination[0].name || '';
            const fileName = `${tournamentName}_${divisionName}`.replace(/\s+/g, '_');

            // Save the PDF with the generated file name
            pdf.save(`${fileName}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };



    const renderBracket = () => {
        let previousTop: number = 0

        return (
            <div className="" key={"test"}>
                {data.eliminations[bracket].elimination.map((table, index) => {
                    if (index !== 0 && index >= 1) {
                        previousTop += CalculateSVGHeight(data.eliminations[bracket].elimination[index - 1].matches, 45, 50);
                    }

                    if (table.name === "Miinusring") {
                        return (
                            <div className="xl:pt-24" key={index}>
                                <DoubleElimBracket key={index} starting_x={0} starting_y={previousTop} data={table} index={index} />
                            </div>
                        );
                    } else {
                        return (
                            <div className="" key={index}>
                                <SingleElimBracket key={index} starting_x={0} starting_y={previousTop} data={table} />
                            </div>
                        );
                    }
                })}
            </div>
        );
    }
    return (
        <div className="flex flex-col w-full h-full mx-auto relative">
            <div className="absolute z-20 top-0 w-full flex xl:justify-end xl:p-4">
                <div className="xl:max-w-[400px] p-2 flex flex-col w-full bg-[#F8F9FA] shadow-md rounded">
                    <div className="flex justify-between z-10">
                        <h1 className="text-base font-medium">Meeste uksikmang</h1>
                        <p className="text-xs underline cursor-pointer" onClick={() => console.log()}>Download</p>
                    </div>
                    <div className="z-10">
                        <h2 className="text-xs">Double elimination</h2>
                    </div>
                    <Separator className="my-1 z-10" />
                    <Tabs defaultValue={data.eliminations[0].elimination[0].name} className="z-10">
                        <TabsList className="flex w-full justify-start gap-6 px-0 text-black bg-transparent overflow-x-auto">
                            {data.eliminations.map((item, index) => (
                                <TabsTrigger
                                    key={index}
                                    value={item.elimination[0].name}
                                    className="px-0 text-sm data-[state=active]:underline data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-none bg-transparent"
                                    onClick={() => setBracket(index)}
                                >
                                    {item.elimination[0].name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </div>
            <div className="w-full h-full p-4 overflow-auto bg-[#F8F9FA] pt-[100px] xl:pt-[0px]" ref={bracketRef}>
                {renderBracket()}
            </div >
        </div >
    )
}