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
        // here its returned the User with dates to string to solve a error
        return {
            ...currentUser,
            createdAt: currentUser.createdAt.toISOString(),
            updateAt: currentUser.updateAt.toISOString(),
            emailVerified:currentUser.emailVerified?.toISOString()||null
        }

    }catch (error:any) {
        return null
    }
    
}