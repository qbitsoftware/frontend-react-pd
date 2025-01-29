import { Link, useParams } from "@tanstack/react-router"
import { Separator } from "@/components/ui/separator"

const NavLinks = [
    { name: "Info", href: "/" },
    { name: "Ajakava", href: "/ajakava" },
    { name: "Tulemused", href: "/tulemused" },
    { name: "Osalejad", href: "/osalejad" },
    { name: "Galerii", href: "/galerii" },
    { name: "Juhend", href: "/juhend" },
    { name: "Sponsorid", href: "/sponsorid" },
    { name: "Meedia", href: "/meedia" },
]

const Navbar = () => {

    const params = useParams({ strict: false })

    return (
        <div className="">
            <div className="pt-8 pb-4 text-white  bg-gradient-to-r from-blue-500 to-blue-700">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl text-center font-bold mb-4">Eesti Lauatennise Meistrivõistlused 2025</h1>
                    <p className="text-xl text-center">27. - 29. Jaanuar 2025 • Tallinna Spordihoone</p>
                </div>
            </div>
            <Separator className="h-[2px]" />
            <div className="flex justify-center py-3 bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
                <div className="flex justify-between">
                    <div className="flex space-x-6 px-4 justify-evenly items-center sm:px-6 lg:px-8 flex-wrap">
                        {NavLinks.map((link) => (
                            <Link href={`/voistlused/${params.tournamentid}/${link.href}`} key={link.name} className="text-sm sm:text-base text-white hover:text-gray-200 cursor-pointer text-center ">{link.name}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Navbar