import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import {getCurrentUser} from "@/app/actions/getCurrentUser";

export async function POST (
  request: Request
) {
  // its get the user data
  const currentUser = await getCurrentUser();

  //if is not user thorw an error
  if (!currentUser) {
    return NextResponse.error();
  }
  // gets the body from the api
  const body = await request.json();
  //destructuring the params sended
  const { 
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
   } = body;

  console.log (body)
  //it create a listing object with the data.
  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      price: parseInt(price, 10),
      userId: currentUser.id
    }
  });

  //here respond to the api if its succes or have an error. 
  return NextResponse.json(listing);
}