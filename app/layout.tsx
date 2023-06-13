import { ClientOnly } from './components/ClientOnly'
import { Modal } from './components/modals/Modal'
import { Navbar } from './components/navbar/Navbar'
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
          <Modal isOpen actionLabel='Submit' title ='Hello World' />
          <Navbar/>
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}
