import { Listing, Reservation, User } from "@prisma/client";

// create a type similar to Listing and change createAt to a string.
export type SafeListing = Omit<
Listing, 
"createdAt"
> & {
  createdAt: string;
};

// create a type similar to SafeReservation and change listing into safelisting
export type SafeReservation = Omit<
  Reservation, 
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
};

//its change User type values with string
export type SafeUser = Omit <
User,
 "createdAt" | "updateAt" | "emailVerified" 
> & {
    createdAt: string,
    updatedAt:string,
    emailVerified:string | null
}