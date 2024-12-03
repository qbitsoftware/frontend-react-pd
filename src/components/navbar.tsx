"use client"

import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button'

const menuItems = [
    {
        name: 'Uudised',
        href: '/uudised',
        dropdownItems: [
            { name: 'All', href: '/uudised' },
            { name: 'International', href: '/uudised?category=International' },
            { name: 'National', href: '/uudised?category=National' },
            { name: 'Youth', href: '/uudised?category=Youth' },
            { name: 'Facilities', href: '/uudised?category=Facilities' },
            { name: 'Tournaments', href: '/uudised?category=Tournaments' },
        ]
    },
    {
        name: 'ELTL',
        href: '/eltl',
        dropdownItems: [
            { name: 'About Us', href: '/eltl/about' },
            { name: 'History', href: '/eltl/history' },
            { name: 'Board Members', href: '/eltl/board' },
        ]
    },
    {
        name: 'Võistlused',
        href: '/voistlused',
        dropdownItems: [
            { name: 'Upcoming', href: '/voistlused/upcoming' },
            { name: 'Results', href: '/voistlused/results' },
            { name: 'Calendar', href: '/voistlused/calendar' },
        ]
    },
    {
        name: 'Klubid',
        href: '/klubid',
        dropdownItems: [
            { name: 'All Clubs', href: '/klubid' },
            { name: 'Register a Club', href: '/klubid/register' },
            { name: 'Club Rankings', href: '/klubid/rankings' },
        ]
    },
    { name: 'Noortesport', href: '/noortesport' },
    { name: 'Reiting', href: '/reiting' },
    { name: 'Reeglid', href: '/reeglid' },
    { name: 'Kontakt', href: '/kontakt' },

]

export default function Navbar() {
    const [activeItem, setActiveItem] = useState('')
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">
                                <img className="h-10 w-auto" src="/RLogo.png" alt="ELTA Logo" />
                            </Link>
                        </div>
                    </div>
                    <div>
                        <Button type="button" onClick={() => changeLanguage('en')}>
                            en
                        </Button>
                        <Button type="button" onClick={() => changeLanguage('et')}>
                            et
                        </Button>
                    </div>

                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList className="flex space-x-4">
                            {menuItems.map((item) => (
                                <NavigationMenuItem key={item.name}>
                                    {item.dropdownItems ? (
                                        <NavigationMenuTrigger className={cn(
                                            "text-sm font-medium transition-colors hover:text-primary",
                                            activeItem === item.name
                                                ? "text-blue-600"
                                                : "text-gray-700 hover:text-blue-600"
                                        )}>
                                            {item.name}
                                        </NavigationMenuTrigger>
                                    ) : (
                                        <NavigationMenuLink
                                            href={item.href}
                                            className={cn(
                                                "text-sm font-medium transition-colors hover:text-primary",
                                                activeItem === item.name
                                                    ? "text-blue-600"
                                                    : "text-gray-700 hover:text-blue-600"
                                            )}
                                            onClick={() => setActiveItem(item.name)}
                                        >
                                            {item.name}
                                        </NavigationMenuLink>
                                    )}
                                    {item.dropdownItems && (
                                        <NavigationMenuContent>
                                            <ul className="grid w-[200px] gap-3 p-4 md:w-[300px] md:grid-cols-1 lg:w-[400px]">
                                                {item.dropdownItems.map((dropdownItem) => (
                                                    <li key={dropdownItem.name}>
                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                href={dropdownItem.href}
                                                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                            >
                                                                <div className="text-sm font-medium leading-none">{dropdownItem.name}</div>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </header >
    )
}

