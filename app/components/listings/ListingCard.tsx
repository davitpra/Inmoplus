'use client'

import { useRouter } from "next/navigation";
import { useCountries } from "../../hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "../../types";
import { useCallback, useMemo } from "react";
import { format } from 'date-fns';
import Image from "next/image";
import { Button } from "../Button";
import { HeartButton } from "../HeartButton";


interface ListingCardProps {
    data: SafeListing
    reservation?:SafeReservation
    onAction?: (id: string) => void
    disabled?: boolean
    actionLabel?: string
    actionId?: string
    currentUser?:  SafeUser | null
}

export const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId = '',
    currentUser,  
}) => {
    const router = useRouter()
    //function to get country by value
    const {getByValue} = useCountries()
    //gets de location
    const location = getByValue(data.locationValue)

    //function to cancel 
    const handleCancel = useCallback (
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            // if it is disable its return nothing
            if (disabled) {
            return;
            }

            //run the function
            onAction?.(actionId)
    },[disabled, onAction, actionId])

    //to store the price
    const price = useMemo(() => {
        // if there a reservation return the total price
        if (reservation) {
          return reservation.totalPrice
        }
        // if not, return price
        return data.price;
    }, [reservation, data.price])

    //const to know the reservation date
    const reservationDate = useMemo(() => {
        //its not dont display anything
      if (!reservation) {
        return null;
      }
      //gets the start and end day reservation
      const start = new Date(reservation.startDate)
      const end = new Date(reservation.endDate)

      //this return days in format 
      return `${format(start, 'PP')} - ${format(end, 'PP')}`
    }, [reservation])

  return (
    <div 
      onClick={() => router.push(`/listings/${data.id}`)} 
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        {/* Image and heart */}
        <div 
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
          "
        >
          <Image
            fill
            priority
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
            src={data.imageSrc}
            alt="Listing"
          />
          <div 
            className="
                absolute
                top-3
                right-3
            "
          >
            <HeartButton 
              listingId={data.id} 
              currentUser={currentUser}
            />
          </div>
        </div>
        {/* Information */}
        <div className="font-semibold text-lg">
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        {/* price and reservation */}
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">
            $ {price}
          </div>
          {/* if not reservation yet, its show */}
          {!reservation && (
            <div className="font-light">night</div>
          )}
        </div>
        
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel} 
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  )
}
