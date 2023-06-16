import { getServerSession} from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from "@/app/libs/prismadb"

export async function getSession() {
    return await getServerSession(authOptions)
}
// its make a connection bettween user and the db
export async function getCurrentUser() {
    try {
        
        const session = await getSession()
        // make it sure that email user exist. 
        if (!session?.user?.email) {
            return null
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        })

        if(!currentUser) {
            return null
        }

        return currentUser

    }catch (error:any) {
        return null
    }
    
}