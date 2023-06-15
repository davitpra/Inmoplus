import bcrypt from 'bcrypt'
import prisma from "@/app/libs/prismadb"
import { NextResponse } from "next/server"

export async function POST(
    request:Request
    ) {
    // it's obtain the body
    const body = await request.json()
    //it's obtain the params
    const {
        email,
        name, 
        password
    } = body
    //its hashed de password
    const hashedPassword = await bcrypt.hash(password, 12)
    //create a newUser
    const user = await prisma.user.create({
        data:{
            email,
            name,
            hashedPassword
        }
    })
    // irs responde the newUser. 
    return NextResponse.json(user)
}