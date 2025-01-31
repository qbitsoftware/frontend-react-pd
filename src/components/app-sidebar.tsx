import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { AuthButton } from "./ui/auth-button"
import { LanguageDropdown } from "./languageSelector"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "./ui/sidebar"

export function AppSidebar() {
    const { t } = useTranslation()
    const [activeItem, setActiveItem] = useState<string>("")
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)

    const menuItems = [
        {
            name: t("navbar.menu.news.name"),
            href: "/uudised",
            dropdownItems: [
                { name: t("navbar.menu.news.all"), href: "/uudised" },
                { name: t("navbar.menu.news.announcements"), href: "/uudised?category=Announcements" },
                { name: t("navbar.menu.news.tournaments"), href: "/uudised?category=Tournaments" },
                { name: t("navbar.menu.news.newsletter"), href: "/uudised?category=Newsletter" },
            ],
        },
        {
            name: t("navbar.menu.eltl"),
            href: "/eltl",
            dropdownItems: [
                { name: "About Us", href: "/eltl/about" },
                { name: "History", href: "/eltl/history" },
                { name: "Board Members", href: "/eltl/board" },
            ],
        },
        {
            name: t("navbar.menu.competition"),
            href: "/voistlused",
            dropdownItems: [
                { name: "Kõik võistlused", href: "/voistlused" },
                { name: "Results", href: "/voistlused/results" },
                { name: "Calendar", href: "/voistlused/calendar" },
            ],
        },
        {
            name: t("navbar.menu.clubs"),
            href: "/klubid",
            dropdownItems: [
                { name: "All Clubs", href: "/klubid" },
                { name: "Register a Club", href: "/klubid/register" },
                { name: "Club Rankings", href: "/klubid/rankings" },
            ],
        },
        { name: t("navbar.menu.young_sport"), href: "/noortesport" },
        { name: t("navbar.menu.ratings"), href: "/reiting" },
        { name: t("navbar.menu.rules"), href: "/reeglid" },
        { name: t("navbar.menu.contact"), href: "/kontakt" },
    ]

    const toggleDropdown = (item: string) => {
        setOpenDropdown(openDropdown === item ? null : item)
    }

    return (
        <Sidebar className="bg-white border-r w-60 border-gray-200 flex flex-col" side="right">
            <SidebarHeader className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <Link href="/">
                        <img className="h-8 w-auto" src="/tournament10_lightblue.png" alt="ELTA Logo" />
                    </Link>
                    <LanguageDropdown />
                </div>
            </SidebarHeader>
            <SidebarContent className="flex-1 overflow-y-auto p-2">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.name} className="border-b">
                            {item.dropdownItems ? (
                                <button
                                    onClick={() => toggleDropdown(item.name)}
                                    className={cn(
                                        "w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors",
                                        activeItem === item.name && "bg-gray-100 font-semibold"
                                    )}
                                >
                                    {item.name}
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    onClick={() => setActiveItem(item.name)}
                                    className={cn(
                                        "block px-4 py-2 hover:bg-gray-50 transition-colors",
                                        activeItem === item.name && "bg-gray-100 font-semibold"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            )}
                            {item.dropdownItems && openDropdown === item.name && (
                                <ul className="ml-4 mb-2">
                                    {item.dropdownItems.map((subItem) => (
                                        <li key={subItem.name}>
                                            <Link
                                                href={subItem.href}
                                                onClick={() => {
                                                    setActiveItem(subItem.name)
                                                    setOpenDropdown(null)
                                                }}
                                                className={cn(
                                                    "block px-4 py-1 hover:bg-gray-100 transition-colors",
                                                    activeItem === subItem.name && "bg-gray-200 font-semibold"
                                                )}
                                            >
                                                {subItem.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
                <AuthButton className="w-full mt-4 rounded-md"/>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">© 2023 ELTA</div>
            </SidebarFooter>
        </Sidebar>
    )
}
