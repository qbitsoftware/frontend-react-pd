"use client";

import { Link, useParams, useLocation } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatDateRange } from "@/lib/utils";
import { useTournament } from "./tournament-provider";

const NavLinks = [
  { name: "Info", href: "/" },
  { name: "Ajakava", href: "/ajakava" },
  { name: "Tulemused", href: "/tulemused" },
  { name: "Mängijad", href: "/mangijad" },
  { name: "Galerii", href: "/galerii" },
  { name: "Juhend", href: "/juhend" },
  { name: "Sponsorid", href: "/sponsorid" },
  { name: "Meedia", href: "/meedia" },
];

const Navbar = () => {
  const params = useParams({ strict: false });
  const location = useLocation();
  const tournament = useTournament();

  const currentPath = location.pathname;
  const baseUrl = `/voistlused/${params.tournamentid}`;
  
  let activeTab = "/";
  
  NavLinks.forEach(link => {
    if (link.href !== "/" && currentPath.includes(baseUrl + link.href)) {
      activeTab = link.href;
    }
  });

  return (
    <div className="">
      <div className="pt-12 pb-4 px-2 md:px-12 text-[#363636] ">
        <div className="flex flex-col">
          <h1 className="text-4xl text-center md:text-left font-semibold mb-4">
            {tournament.name}
          </h1>
          <p className="text-xl text-center md:text-left">{`${formatDateRange(new Date(tournament.start_date), new Date(tournament.end_date))} • ${tournament.location}`}</p>
        </div>
      </div>
      <div className="px-2 md:px-12 ">
        <Tabs value={activeTab} className="w-full flex justify-start">
          <TabsList className="flex-wrap space-x-2">
            {NavLinks.map((link) => (
              <Link
                className=""
                to={`/voistlused/${params.tournamentid}${link.href}`}
                key={link.name}
              >
                <TabsTrigger
                  value={link.href}
                  className={cn(
                    "text-sm 2xl:text-base px-3 py-2 w-auto lg:-[100px] xl:w-[125px] 2xl:w-[150px]",
                    activeTab === link.href &&
                      "bg-white text-[#212121] shadow-selectedFilter",
                    activeTab !== link.href &&
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
