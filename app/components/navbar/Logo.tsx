// its important especify that it will be used as client
'use client'

import Image from "next/image"
// new way to write router in Next
import { useRouter } from "next/navigation"

export const Logo = () => {
    const router = useRouter()
  return (
    <Image
        onClick={()=> router.push('/')}
        alt='Logo'
        className="hidden md:block cursor-pointer"
        height='100'
        width='100'
        src= '/images/logo.png'
    />
  )
}
