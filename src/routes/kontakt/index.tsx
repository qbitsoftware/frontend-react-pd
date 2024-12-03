import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Home, House, Link, Mail, Phone } from 'lucide-react'

export const Route = createFileRoute('/kontakt/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Kontakt</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle>Võta ühendust</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <Input id="name" placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <Textarea id="message" placeholder="Your message here..." />
              </div>
              <Button type="submit">Send Message</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kontaktandmed</CardTitle>
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
  )
}
