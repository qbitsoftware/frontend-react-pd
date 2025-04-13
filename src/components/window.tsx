import { useState, useRef } from "react";
import SingleElimBracket from "./single_elim";
import DoubleElimBracket from "./double_elim";
import { CalculateSVGHeight, parseTableType } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { TournamentTable } from "@/types/groups";
import { Bracket } from "@/types/brackets";

interface WindowProps {
  data: Bracket;
  tournament_table: TournamentTable
}

export const Window: React.FC<WindowProps> = ({ data, tournament_table }) => {
  const [bracket, setBracket] = useState(0);
  const bracketRef = useRef<HTMLDivElement | null>(null);

  const renderBracket = () => {
    let previousTop: number = 0;

    return (
      <div className="mt-6 h-screen" key={"test"}>
        
        {data.eliminations[bracket].elimination.map((table, index) => {
          if (index !== 0 && index >= 1) {
            previousTop += CalculateSVGHeight(
              data.eliminations[bracket].elimination[index - 1].matches,
              45,
              50,
            );
          }

          if (table.name === "Miinusring") {
            return (
              <div className="xl:pt-24" key={index}>
                <DoubleElimBracket
                  key={index}
                  starting_x={0}
                  starting_y={previousTop}
                  data={table}
                  index={index}
                />
              </div>
            );
          } else {
            return (
              <div className="" key={index}>
                <SingleElimBracket
                  key={index}
                  starting_x={0}
                  starting_y={previousTop}
                  data={table}
                />
              </div>
            );
          }
        })}
      </div>
    );
  };
  return (
    <div className="flex flex-col w-full h-full mx-auto relative">
      <div className="absolute z-20 top-0 w-full flex xl:justify-end xl:p-4">
        <div className="xl:max-w-[400px] p-2 flex flex-col w-full bg-[#F8F9FA] shadow-md rounded">
          <div className="flex justify-between z-10">
            <h1 className="text-base font-medium">{tournament_table.class}</h1>
            <p
              className="text-xs underline cursor-pointer"
              onClick={() => console.log()}
            >
              {/* Download */}
            </p>
          </div>
          <div className="z-10">
            <h2 className="text-xs">{parseTableType(tournament_table.type)}</h2>
          </div>
          <Separator className="my-1 z-10" />
          <Tabs
            defaultValue={data?.eliminations[0]?.elimination[0].name}
            className="z-10"
          >
            <TabsList className="flex w-full justify-start gap-6 px-0 text-black bg-transparent overflow-x-auto">
              {data.eliminations.map((item, index) => (
                <TabsTrigger
                  key={index}
                  value={item.elimination[0].name}
                  className="px-0 text-sm data-[state=active]:underline data-[state=active]:bg-transparent data-[state=active]:text-gray-500 data-[state=active]:shadow-none data-[state=active]:border-none bg-transparent"
                  onClick={() => setBracket(index)}
                >
                  {item.elimination[0].name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div
        className="w-full h-full p-4 overflow-auto bg-[#F8F9FA] pt-[100px] xl:pt-[60px]"
        ref={bracketRef}
      >
        {renderBracket()}
      </div>
    </div>
  );
};

