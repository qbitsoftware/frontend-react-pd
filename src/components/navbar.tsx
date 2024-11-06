// "use client"

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { LoginButton } from './ui/login-button'
// import { LogoutButton } from './ui/logout-button'
// import { Menu, Plus } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import Image from 'next/image'
// import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
// import useAuthStore from '@/hooks/use-user'
// import { User } from '@/types/d'


// const NavBar = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   const [isClient, setIsClient] = useState(false)
//   const [user, setUser] = useState<User | null>()
//   const authStore = useAuthStore()

//   useEffect(() => {
//     setUser(authStore.user)
//     setIsClient(true);
//   }, [authStore, isClient]);

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link href="/tournaments" className="flex-shrink-0 flex items-center">
//               <Image className="h-8 w-auto" src="/RLogo.png" width={150} height={90} alt="Logo" />
//             </Link>
//             <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
//               <Link href="/tournaments" className="text-gray-900 inline-flex items-center ml-5 px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-lg font-medium">
//                 Turniirid
//               </Link>
//               {user && (
//                 <Link href="/tournaments/new" className="text-gray-900 inline-flex items-center ml-5 px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-lg font-medium">
//                   <Plus className="h-5 w-5 mr-1" />
//                   Lisa uus turniir
//                 </Link>
//               )}
//             </div>
//           </div>
//           <div className="hidden sm:ml-6 sm:flex sm:items-center">

//             {
//               user ? (
//                 <LogoutButton />
//               ) : (
//                 <LoginButton />
//               )}
//           </div>
//           <div className="flex items-center sm:hidden">
//             <Sheet open={isOpen} onOpenChange={setIsOpen}>
//               <SheetTrigger asChild>
//                 <Button variant="outline" size="icon" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
//                   <span className="sr-only">Ava peamenüü</span>
//                   <Menu className="h-6 w-6" aria-hidden="true" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="right" className="w-[240px] sm:w-[540px]">
//                 <div className="pt-5 pb-6 px-5">
//                   <div className="flex items-center justify-between">
//                     <Link href={"/tournaments"}>
//                       <div>
//                         <Image className="h-8 w-auto" src="/RLogo.png" width={150} height={90} alt="Logo" />
//                       </div>
//                     </Link>
//                   </div>
//                   <div className="mt-6">
//                     <nav className="grid gap-y-8">
//                       <Link href="/tournaments" className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50">
//                         <span className="ml-3 text-base font-medium text-gray-900">
//                           Turniirid
//                         </span>
//                       </Link>
//                       {user && (
//                         <Link href="/tournaments/new" className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50">
//                           <Plus className="h-5 w-5 mr-1" />
//                           <span className="ml-3 text-base font-medium text-gray-900">
//                             Lisa uus turniir
//                           </span>
//                         </Link>
//                       )}
//                     </nav>
//                   </div>
//                 </div>
//                 <div className="py-6 px-5 space-y-6">
//                   {
//                     user ? (
//                       <LogoutButton />
//                     ) : (
//                       <LoginButton />
//                     )}
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default NavBar