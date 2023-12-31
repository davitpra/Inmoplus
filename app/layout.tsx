import { ClientOnly } from './components/ClientOnly'

import {getCurrentUser} from './actions/getCurrentUser'

import { RegisterModal } from './components/modals/RegisterModal'
import { LoginModal } from './components/modals/LoginModal'
import { RentModal } from './components/modals/RentModal'

import { Navbar } from './components/navbar/Navbar'

import { ToasterProvider } from './providers/ToasterProvider'
import { Nunito } from 'next/font/google'
import './globals.css'
import SearchModal from './components/modals/SearchModal'

export const metadata = {
  title: 'Airbnb',
  description: 'Airbnb clone',
}

const font = Nunito({
  subsets: ['latin']
})
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  //obtaining the session of the user. 
  const currentUser = await getCurrentUser ()

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider/>
          <RegisterModal />
          <LoginModal />
          <RentModal />
          <SearchModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-28">
          {children}
        </div>
      </body>
    </html>
  )
}
