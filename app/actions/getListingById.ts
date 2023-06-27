import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}
//funtion to get the property by ID
export async function getListingById(
  params: IParams
) {
  try {
    //catch from url params
    const { listingId } = params;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true
      }
    });

    if (!listing) {
      return null;
    }
    //its return the listing data changing date to string. 
    return {
      ...listing,
      createAt: listing.createAt.toString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toString(),
        updateAt: listing.user.updateAt.toString(),
        emailVerified: 
          listing.user.emailVerified?.toString() || null,
      }
    };

  } catch (error: any) {
    throw new Error(error);
  }
}