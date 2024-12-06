import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

export default function Footer() {
    const { t } = useTranslation()
    return (
        <footer className="bg-blue-600 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold mb-4 ">{t('homepage.title')}</h3>
                        <p className="text-sm ">{t('homepage.description')}</p>
                    </div>
                    <div className="text-center ">
                        <h3 className="text-lg font-semibold mb-4 ">{t('footer.links')}</h3>
                        <ul className="space-y-2">
                            <li><Link href="/uudised" className="text-sm  hover:text-gray-300">{t('navbar.menu.news.name')}</Link></li>
                            <li><Link href="/voistlused" className="text-sm  hover:text-gray-300">Tournaments</Link></li>
                            <li><Link href="/klubid" className="text-sm  hover:text-gray-300">Clubs</Link></li>
                            <li><Link href="/kontakt" className="text-sm  hover:text-gray-300">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="text-center md:text-right">
                        <h3 className="text-lg font-semibold mb-4">{t('footer.contact.name')}</h3>
                        <p className="text-sm  mb-2">{t('footer.contact.email')}: info@estoniantabletennis.ee</p>
                        <p className="text-sm ">{t('footer.contact.phone')}: +372 123 4567</p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center">
                    <p className="text-sm ">{t('eltl.name')}</p>
                    <p className="text-sm">&copy; {new Date().getFullYear()} </p>
                </div>
            </div>
        </footer>
    )
}

