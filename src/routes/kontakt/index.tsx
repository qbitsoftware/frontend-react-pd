import { createFileRoute } from '@tanstack/react-router'
import { Home, Mail, Landmark, Phone } from 'lucide-react'
import {useEffect} from "react"

export const Route = createFileRoute('/kontakt/')({
  component: RouteComponent,
  
})

function RouteComponent() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="w-full mx-auto lg:px-4 max-w-[1440px]">
      <div className="py-4 pb-16">
        <div className="lg:rounded-lg  px-4 sm:px-6 md:px-12 py-6 space-y-4">
          <h2 className="font-bold mb-8">Kontakt</h2>
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Eesti Lauatenniseliit</p>
              <p className="text-stone-800">Laki 3</p>
              <p className="text-stone-800">10621 Tallinn</p>
              <p className="text-stone-800">Eesti</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <p>+372 514 3454</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <a href="mailto:eltl@lauatennis.ee" className="text-primary hover:underline cursor-pointer">
            eltl@lauatennis.ee            </a>
          </div>

          <div className="flex items-start -ml-1 justify-start gap-3">
            <Landmark/>
            <div>
              <p>Pank: AS SEB Pank</p>
              <p>Aadress: Tornimäe 2, 15010 Tallinn, Estonia</p>
              <p>SWIFT (BIC): EEUHEE2X
              </p>
              <p>Account/IBAN: EE4310 10002047681001
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
