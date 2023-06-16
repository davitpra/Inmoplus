import { User } from "@prisma/client"

//its change User type values with string
export type SafeUser = Omit <
User,
 "createdAt" | "updateAt" | "emailVerified" 
> & {
    createdAt: string,
    updatedAt:string,
    emailVerified:string | null
}