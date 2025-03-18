import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Home, Link, Mail, Phone } from 'lucide-react'

export const Route = createFileRoute('/kontakt/')({
  component: RouteComponent,
  
})

function RouteComponent() {
  return (
    <div className="w-full mx-auto lg:px-4 max-w-[1440px]">
      <div className="py-4">
        <div className="lg:rounded-lg bg-white px-4 sm:px-6 md:px-12 py-6 space-y-4">
          <h2 className="font-bold">Kontakt</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <h4 className="font-normal">Võta ühendust</h4>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Input id="name" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <Textarea id="message" placeholder="Your message here..." />
                  </div>
                  <Button type="submit">Send Message</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
              <h4 className="font-normal">Kontaktandmed</h4>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className='flex gap-2'><strong><Home /></strong> Eesti Lauatenniseliit<br/>
                  Laki 3<br/>
                  10621 Tallinn<br/>
                  Eesti<br/>
                </p>
                <p className='flex gap-2'><strong><Phone/></strong> +372 514 3454</p>
                <p className='flex gap-2'><strong><Mail/></strong> info@estoniantabletennis.ee</p>
                <p className='flex gap-2'><strong><Link/></strong>www.eltl.ee</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
