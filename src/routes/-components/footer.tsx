import { Link } from "@tanstack/react-router"

export default function Footer() {
    return (
        <footer className="bg-blue-600 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 ">Estonia Table Tennis Association</h3>
                        <p className="text-sm ">Promoting excellence in table tennis across Estonia</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 ">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/uudised" className="text-sm  hover:text-gray-300">News</Link></li>
                            <li><Link href="/voistlused" className="text-sm  hover:text-gray-300">Tournaments</Link></li>
                            <li><Link href="/klubid" className="text-sm  hover:text-gray-300">Clubs</Link></li>
                            <li><Link href="/kontakt" className="text-sm  hover:text-gray-300">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                        <p className="text-sm  mb-2">Email: info@estoniantabletennis.ee</p>
                        <p className="text-sm ">Phone: +372 123 4567</p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center">
                    <p className="text-sm ">&copy; {new Date().getFullYear()} Estonia Table Tennis Association. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

