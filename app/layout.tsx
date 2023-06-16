import { ClientOnly } from './components/ClientOnly'
import { RegisterModal } from './components/modals/RegisterModal'
import { LoginModal } from './components/modals/LoginModal'
import { Navbar } from './components/navbar/Navbar'
import { ToasterProvider } from './providers/ToasterProvider'
import { Nunito } from 'next/font/google'
import './globals.css'

export const metadata = {
  title: 'Airbnb',
  description: 'Airbnb clone',
}

const font = Nunito({
  subsets: ['latin']
})
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider/>
          <RegisterModal />
          <LoginModal />
          <Navbar/>
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}
