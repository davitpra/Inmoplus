import { PrismaClient } from "@prisma/client";

// THIS IS A WAY TO RESOLVE A HOT RELOAD ERROR WITH PRISMA CLIENT

// here I give a global definition of prisma.
declare global {
    var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()
// in development global prisma is equal to client.
if (process.env.NODE_ENV !=='production') globalThis.prisma = client

export default client