'use client';

import axios from "axios"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast"
import { Range } from "react-date-range"
import { useRouter } from "next/navigation"
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns'

import {useLoginModal} from "@/app/hooks/useLoginModal"
import { SafeListing, SafeReservation, SafeUser } from "@/app/types"

import {Container} from "@/app/components/Container"
import { categories } from "@/app/components/navbar/Categories"
import { ListingHead } from "@/app/components/listings/ListingHead"
import {ListingInfo} from "@/app/components/listings/ListingInfo";
import {ListingReservation} from "@/app/components/listings/ListingReservation";

//types to select a range of dates for reservation. 
const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection'
};

interface ListingClientProps {
  reservations?: SafeReservation[];
  //this is how type user inside listing
  listing: SafeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  // important! it must start with empty array
  reservations = [],
  currentUser
}) => {

  const loginModal = useLoginModal();
  const router = useRouter();

  //function to know wich dates are reserved. 
  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    //this create a range of days to make a reservation. 
    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  // funtion to find the category from the list
  const category = useMemo(() => {
     return categories.find((items) => 
      items.label === listing.category);
  }, [listing.category]);

  //states 
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  // function to make a reservation. 
  const onCreateReservation = useCallback(() => {
    // if it is not user it must to log in 
      if (!currentUser) {
        return loginModal.onOpen();
      }
      setIsLoading(true);

      axios.post('/api/reservations', {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id
      })
      // if everithing go right it should post in our state and send it to trips. 
      .then(() => {
        toast.success('Listing reserved!');
        setDateRange(initialDateRange);
        router.push('/trips');
      })
      .catch(() => {
        toast.error('Something went wrong.');
      })
      .finally(() => {
        setIsLoading(false);
      })
  },
  [
    totalPrice, 
    dateRange, 
    listing?.id,
    router,
    currentUser,
    loginModal
  ]);
  // this efecto use to know the price of the days reserved
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
        // this count how many days was reserved.
      const dayCount = differenceInCalendarDays(
        dateRange.endDate, 
        dateRange.startDate
      );
      // count the price 
      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
        // if its cero days
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  return ( 
    <Container>
      <div 
        className="
          max-w-screen-lg 
          mx-auto
        "
      >
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div 
            className="
              grid 
              grid-cols-1 
              md:grid-cols-7 
              md:gap-10 
              mt-6
            "
          >
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div 
              className="
                order-first 
                mb-10 
                md:order-last 
                md:col-span-3
              "
            >
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
   );
}
 
export default ListingClient;