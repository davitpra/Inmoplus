import {getCurrentUser} from "@/app/actions/getCurrentUser";
import {getListingById} from "@/app/actions/getListingById";


import {ClientOnly} from "@/app/components/ClientOnly";
import {EmptyState} from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";


interface IParams {
    listingId?: string;
  }

//this is a server component. 
const ListingPage = async (
    // params is gets from props. 
    { params }: { params: IParams }
    ) => {
    //we cant use hooks to get the params.
    // so, we use action to get data from our db
    const listing = await getListingById(params);
    const currentUser = await getCurrentUser()

    if (!listing) {
        return (
          <ClientOnly>
            <EmptyState />
          </ClientOnly>
        );
      }

  return (
    <ClientOnly>
      <ListingClient
        listing={listing}
        // reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  )
}

export default ListingPage