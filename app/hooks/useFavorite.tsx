import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

// types for user with a date
import { SafeUser } from "@/app/types";

import {useLoginModal} from "./useLoginModal";

interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null
}

export const useFavorite = (
  // destructuring listingId and currentUser and giveit an IUserFavorite type
  { listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();

  const loginModal = useLoginModal();

  // function to know if user has included the property in his favorites. 
  const hasFavorited = useMemo(() => {
    //gets the array for favororites 
    const list = currentUser?.favoriteIds || [];
    //return true or false if its include.
    return list.includes(listingId);
  }, [currentUser, listingId]);

  //change favorite on and off
  const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    //if is not user go to loginModal. 
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;
      // here is where we toggle favorite with our api.
      if (hasFavorited) {
        request = () => axios.delete(`/api/favorites/${listingId}`);
      } else {
        request = () => axios.post(`/api/favorites/${listingId}`);
      }
      // call the function. 
      await request();
      //refresh and send a success. 
      router.refresh();
      toast.success('Success');

    } catch (error) {
      toast.error('Something went wrong.');
    }
  }, 
  [
    currentUser, 
    hasFavorited, 
    listingId, 
    loginModal,
    router
  ]);

  return {
    hasFavorited,
    toggleFavorite,
  }
}