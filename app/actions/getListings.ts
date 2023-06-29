import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}
// funtion to gets the list of properties from Mongo with primas and filter with params
export default async function getListings(
    params: IListingsParams
  ) {
    try {
      const {
        userId,
        roomCount, 
        guestCount, 
        bathroomCount, 
        locationValue,
        startDate,
        endDate,
        category,
      } = params;
  
      let query: any = {};
  
      // CONVINATIONS TO MODIFY QUERY WITH PARAMS
      if (userId) {
        query.userId = userId;
      }
      
      if (category) {
        query.category = category;
      }

      if (locationValue) {
        query.locationValue = locationValue;
      }

      // "+" is used to pass a number
      // gte means greater than o equal to:
      if (roomCount) {
        query.roomCount = {
          gte: +roomCount
        }
      }
      if (guestCount) {
        query.guestCount = {
          gte: +guestCount
        }
      }
      if (bathroomCount) {
        query.bathroomCount = {
          gte: +bathroomCount
        }
      }

      // filter to reservation. 
      if (startDate && endDate) {
        // query that not have 
        query.NOT = {
          reservations: {
            some: {
              // we going to filter out any who has between this days.
                OR: [
                  {
                    endDate: { gte: startDate },
                    startDate: { lte: startDate }
                  },
                  {
                    startDate: { lte: endDate },
                    endDate: { gte: endDate }
                  }
                ]
            }
          }
        }
      }
  
      const listings = await prisma.listing.findMany({
        where: query,
        orderBy: {
          createAt: 'desc'
        }
      });
      // in onder to pass this props to client components, date should be a string.
      const safeListings = listings.map((listing) => ({
        ...listing,
        createAt: listing.createAt.toISOString(),
      }));
  
      return safeListings;
      
    } catch (error: any) {
      throw new Error(error);
    }
  }