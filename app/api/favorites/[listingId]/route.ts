import { NextResponse } from "next/server";

import {getCurrentUser} from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

//POSTING A FAVORITE ON A LIST
export async function POST(
  request: Request, 
  //destructuring params from props and git it IParams types
  { params }: { params: IParams }
) {
  // get User
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }
  // destructuring listingId
  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  // make an array for favorites
  let favoriteIds = [...(currentUser.favoriteIds || [])];

  //add the new favorte
  favoriteIds.push(listingId);

  // update de user with favorites
  const user = await prisma.user.update({
    where: {
      id: currentUser.id
    },
    data: {
      favoriteIds
    }
  });
  //return User. 
  return NextResponse.json(user);
}

//DELETING A FAVORITE ON A LIST
export async function DELETE(
  request: Request, 
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }
  //gets the favorites into an Array
  let favoriteIds = [...(currentUser.favoriteIds || [])];

  //remove the the id which match with favoriteID. 
  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  // update user with favorites
  const user = await prisma.user.update({
    where: {
      id: currentUser.id
    },
    data: {
      favoriteIds
    }
  });
  // return de user. 
  return NextResponse.json(user);
}