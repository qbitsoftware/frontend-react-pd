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
import { LanguageDropdown } from './languageSelector'
import { useTranslation } from 'react-i18next'
import { AuthButton } from './ui/auth-button'
import { SidebarTrigger } from './ui/sidebar'


// [t('navbar.menu.news.all'), t('navbar.menu.news.announcements'), t('navbar.menu.news.tournaments'), t('navbar.menu.news.newsletter')]


export default function Navbar() {
    const [activeItem, setActiveItem] = useState('')
    const { t } = useTranslation();
    const menuItems = [
        {
            name: t('navbar.menu.news.name'),
            href: '/uudised',
            dropdownItems: [
                { name: t('navbar.menu.news.all'), href: '/uudised' },
                { name: t('navbar.menu.news.announcements'), href: `/uudised?category=Announcements` },
                { name: t('navbar.menu.news.tournaments'), href: `/uudised?category=Tournaments` },
                { name: t('navbar.menu.news.newsletter'), href: `/uudised?category=Newsletter` },
            ]
        },
        {
            name: t('navbar.menu.eltl'),
            href: '/eltl',
            dropdownItems: [
                { name: 'About Us', href: '/eltl/about' },
                { name: 'History', href: '/eltl/history' },
                { name: 'Board Members', href: '/eltl/board' },
            ]
        },
        {
            name: t('navbar.menu.competition'),
            href: '/voistlused',
            dropdownItems: [
                { name: 'Competitions', href: '/voistlused' },
                { name: 'Results', href: '/voistlused/results' },
                { name: 'Calendar', href: '/voistlused/calendar' },
            ]
        },
        {
            name: t('navbar.menu.clubs'),
            href: '/klubid',
            dropdownItems: [
                { name: 'All Clubs', href: '/klubid' },
                { name: 'Register a Club', href: '/klubid/register' },
                { name: 'Club Rankings', href: '/klubid/rankings' },
            ]
        },
        // { name: t('navbar.menu.young_sport'), href: '/noortesport' },
        { name: t('navbar.menu.ratings'), href: '/reiting' },
        { name: t('navbar.menu.rules'), href: '/reeglid' },
        { name: t('navbar.menu.contact'), href: '/kontakt' },
        { name: t('navbar.menu.admin'), href: '/admin/dashboard' },

    ]

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">
                                <img className="h-10 lg:h-8 xl:h-10 w-auto" src="/RLogo.png" alt="ELTA Logo" />
                            </Link>
                        </div>
                    </div>

                    <NavigationMenu className="hidden lg:flex">
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
                                                "text-sm font-medium px-2 transition-colors hover:text-primary",
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
                            <LanguageDropdown />
                            <AuthButton />
                        </NavigationMenuList>
                    </NavigationMenu>
                    <SidebarTrigger className='lg:hidden my-auto text-secondary' />
                </div>
            </div>
        </header >
    )
}

