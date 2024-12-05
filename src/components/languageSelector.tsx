"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

export function LanguageDropdown() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="cursor-pointer px-4 py-2 hover:bg-gray-200">
                    {t("navbar.language.choose")}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    🇬🇧 {t('navbar.language.english')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('et')}>
                    🇪🇪 {t('navbar.language.estonian')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}