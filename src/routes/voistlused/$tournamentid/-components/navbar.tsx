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
  
  const pathSegments = location.pathname.split(`/voistlused/${params.tournamentid}`)[1];
  const currentTab = pathSegments === "/" || pathSegments === "" ? "/" : pathSegments.split("/").pop() || "/";

  const isActivePath = (href) => {
    if (href === "/" && (pathSegments === "/" || pathSegments === "")) {
      return true;
    }
    if (href !== "/" && pathSegments.startsWith(href)) {
      return true;
    }
    return false;
  };

  const tournament = useTournament();

  return (
    <div className="">
      <div className="pt-12 pb-4 px-12 text-[#363636] bg-[#FBFCFD]">
        <div className="flex flex-col">
          <h1 className="text-4xl font-semibold mb-4">
            {tournament.name}
          </h1>
          <p className="text-xl">{`${formatDateRange(new Date(tournament.start_date), new Date(tournament.end_date))} • ${tournament.location}`}</p>
        </div>
      </div>
      <div className=" px-12 ">
        <Tabs value={currentTab} className="w-full flex justify-start">
          <TabsList className="flex-wrap  space-x-2">
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
                    isActivePath(link.href) &&
                      "bg-white shadow-selectedFilter",
                    !isActivePath(link.href) &&
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
