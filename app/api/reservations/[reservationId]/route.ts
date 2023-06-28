import { NextResponse } from "next/server";

import {getCurrentUser} from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  reservationId?: string;
}

// function to delete a reservation.
export async function DELETE(
  request: Request, 
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== 'string') {
    throw new Error('Invalid ID');
  }

  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      // it enable to cancel, the user who mades the reservation and the owner. 
      OR: [
        { userId: currentUser.id },
        { listing: { userId: currentUser.id } }
      ]
    }
  });

  return NextResponse.json(reservation);
}