"use client";

import { Link, useParams, useLocation } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatDateRange } from "@/lib/utils";
import { useTournament } from "./tournament-provider";

const NavLinks = [
  { name: "Info", href: "/" },
  { name: "Ajakava", href: "/ajakava" },
  { name: "Tulemused", href: "/tulemused" },
  { name: "Osalejad", href: "/osalejad" },
  { name: "Galerii", href: "/galerii" },
  { name: "Juhend", href: "/juhend" },
  { name: "Sponsorid", href: "/sponsorid" },
  { name: "Meedia", href: "/meedia" },
];

const Navbar = () => {
  const params = useParams({ strict: false });
  const location = useLocation();

  const currentTab = location.pathname.split("/").pop() || "/";

  const tournament = useTournament();

  return (
    <div className="">
      <div className="pt-12 pb-4 text-[#363636] bg-[#FBFCFD]">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl text-center font-semibold mb-4">
            {tournament.name}
          </h1>
          <p className="text-xl text-center">{`${formatDateRange(new Date(tournament.start_date), new Date(tournament.end_date))} • ${tournament.location}`}</p>
        </div>
      </div>
      <div className="shadow-lg bg-[#F2F7FD]">
        <Tabs value={currentTab} className="w-full flex justify-center">
          <TabsList className="flex-wrap  mx-auto space-x-2">
            {NavLinks.map((link) => (
              <Link
                className=""
                to={`/voistlused/${params.tournamentid}${link.href}`}
                key={link.name}
              >
                <TabsTrigger
                  value={link.href.replace("/", "")}
                  className={cn(
                    "text-sm sm:text-base px-3 py-2 w-auto lg:-[100px] xl:w-[125px] 2xl:w-[150px]",
                    currentTab === link.href.replace("/", "") &&
                      "bg-[#3C83F6] text-white",
                    currentTab !== link.href.replace("/", "") &&
                      "hover:bg-white",
                  )}
                >
                  {link.name}
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default Navbar;
